"use strict";
const crypto=require("node:crypto");
const {getUser}=require("./telegram-auth");
const BASE="https://securepay.tinkoff.ru/v2";
// Only log network error codes, never request bodies, terminal credentials or payment tokens.
function safeNetworkError(err){const cause=err?.cause;const code=typeof cause?.code==="string"?cause.code:"unknown";const syscall=typeof cause?.syscall==="string"?cause.syscall:"unknown";const name=typeof err?.name==="string"?err.name:"Error";return {name,code,syscall,aborted:name==="AbortError"||name==="TimeoutError"};}
function sign(fields,password){
 const values={...fields,Password:password};
 return crypto.createHash("sha256").update(Object.keys(values).filter(k=>k!=="Token"&&values[k]!==null&&typeof values[k]!=="object").sort().map(k=>String(values[k])).join(""),"utf8").digest("hex");
}
// API endpoint and hosted payment form use different T-Bank hostnames.
// Allow only the officially documented payment hosts (exact hostname match).
function trustedPaymentUrl(value){
 if(typeof value!=="string")return false;
 try{
  const url=new URL(value);
  return url.protocol==="https:" && !url.username && !url.password && !url.port &&
   ["securepay.tinkoff.ru","securepayments.tinkoff.ru"].includes(url.hostname);
 }catch{return false}
}
function safeBankFailure(result){
 const redact=value=>{
  if(typeof value!=="string")return undefined;
  let clean=value.slice(0,300);
  for(const secret of [process.env.TBANK_DEMO_PASSWORD,process.env.TBANK_DEMO_TERMINAL]){
   if(secret)clean=clean.split(secret).join("[redacted]");
  }
  return clean.slice(0,180);
 };
 return {success:result?.Success===true,errorCode:redact(String(result?.ErrorCode??"unknown")),message:redact(result?.Message),details:redact(result?.Details),hasPaymentUrl:typeof result?.PaymentURL==="string"};
}
const configured=()=>Boolean(process.env.TBANK_DEMO_TERMINAL&&process.env.TBANK_DEMO_PASSWORD&&process.env.TBANK_DEMO_TERMINAL.endsWith("DEMO"));
async function bank(method,fields){
 const body={...fields,TerminalKey:process.env.TBANK_DEMO_TERMINAL};
 body.Token=sign(body,process.env.TBANK_DEMO_PASSWORD);
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 try{const r=await fetch(BASE+"/"+method,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:controller.signal});if(!r.ok)throw Error("Bank HTTP "+r.status);return await r.json()}finally{clearTimeout(timeout)}
}
function registerTestPayments(app,pool,getCatalog){
 app.get("/api/payments/test/config",(_req,res)=>res.json({enabled:configured()&&Boolean(pool),mode:"demo"}));
 app.post("/api/payments/test/init",async(req,res)=>{
  res.set("Cache-Control","no-store");
  if(!configured()||!pool)return res.status(503).json({error:"Тестовый эквайринг пока не настроен."});
  if(req.get("origin")!==(process.env.PUBLIC_BASE_URL||"https://viona.space").replace(/\/$/,""))return res.status(403).json({error:"Недопустимый источник запроса."});
  const user=getUser(req);if(!user)return res.status(401).json({error:"Войдите через Telegram для тестовой оплаты."});
  const ids=req.body?.items;
  if(!Array.isArray(ids)||ids.length<1||ids.length>20||!ids.every(id=>Number.isSafeInteger(id)&&id>0)||new Set(ids).size!==ids.length)return res.status(400).json({error:"Некорректная корзина."});
  try{
   const catalog=await getCatalog(),selected=ids.map(id=>catalog.find(p=>Number(p.id)===id));
   if(selected.some(p=>!p||!Number.isSafeInteger(Number(p.price))||Number(p.price)<=0))return res.status(400).json({error:"Товары без фиксированной цены нельзя оплатить."});
   const amount=selected.reduce((sum,p)=>sum+Number(p.price)*100,0);
   if(!Number.isSafeInteger(amount)||amount<100||amount>1000000000)return res.status(400).json({error:"Некорректная сумма."});
   const orderId=crypto.randomUUID();
   await pool.query("INSERT INTO viona_demo_payments(order_id,telegram_id,amount_kopecks,status) VALUES($1,$2,$3,'NEW')",[orderId,user.id,amount]);
   const result=await bank("Init",{Amount:amount,OrderId:orderId,Description:"VIONA DEMO: "+selected.map(p=>String(p.title)).join(", ").slice(0,140),NotificationURL:(process.env.PUBLIC_BASE_URL||"https://viona.space").replace(/\/$/,"")+"/api/payments/test/notification"});
   if(result.Success!==true||!trustedPaymentUrl(result.PaymentURL)){console.warn("Demo payment Init bank response:",safeBankFailure(result));return res.status(502).json({error:"Банк не создал тестовый платёж."})}
   await pool.query("UPDATE viona_demo_payments SET payment_id=$2,status='INITIATED' WHERE order_id=$1",[orderId,String(result.PaymentId)]);
   res.json({paymentUrl:result.PaymentURL,orderId,mode:"demo"});
  }catch(e){console.error("Demo payment Init:",e.message,"network:",safeNetworkError(e));res.status(503).json({error:"Не удалось создать тестовый платёж."})}
 });
 app.post("/api/payments/test/notification",async(req,res)=>{
  if(!configured()||!pool)return res.sendStatus(503);
  const body=req.body||{},token=body.Token;
  if(typeof token!=="string"||!body.OrderId||body.TerminalKey!==process.env.TBANK_DEMO_TERMINAL)return res.sendStatus(403);
  const expected=sign(Object.fromEntries(Object.entries(body).filter(([k])=>k!=="Token")),process.env.TBANK_DEMO_PASSWORD);
  if(!/^[0-9a-f]{64}$/i.test(token)||!crypto.timingSafeEqual(Buffer.from(token.toLowerCase(),"hex"),Buffer.from(expected,"hex")))return res.sendStatus(403);
  try{
   const status=String(body.Status||"");
   if(!["NEW","FORM_SHOWED","AUTHORIZING","AUTHORIZED","CONFIRMED","REJECTED","REVERSED","REFUNDED","CANCELED","DEADLINE_EXPIRED"].includes(status))return res.status(200).type("text/plain").send("OK");
   await pool.query("UPDATE viona_demo_payments SET status=$2,updated_at=NOW() WHERE order_id=$1 AND amount_kopecks=$3 AND (payment_id IS NULL OR payment_id=$4)",[String(body.OrderId),status,Number(body.Amount),String(body.PaymentId||"")]);
   res.type("text/plain").send("OK");
  }catch(e){console.error("Demo payment notification:",e.message);res.sendStatus(503)}
 });
 app.get("/api/payments/test/status/:id",async(req,res)=>{
  res.set("Cache-Control","no-store");
  const user=getUser(req);if(!user)return res.sendStatus(401);
  if(!/^[0-9a-f-]{36}$/i.test(req.params.id)||!pool)return res.sendStatus(404);
  try{const r=await pool.query("SELECT status,amount_kopecks FROM viona_demo_payments WHERE order_id=$1 AND telegram_id=$2",[req.params.id,user.id]);if(!r.rowCount)return res.sendStatus(404);res.json({mode:"demo",...r.rows[0]})}catch{res.sendStatus(503)}
 });
}
module.exports={registerTestPayments};
