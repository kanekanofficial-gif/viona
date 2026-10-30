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
// T-Bank returns the hosted payment URL in the successful /Init response.
// Its payment hosts may differ between test and production terminals.
// The API also returns https://pay.tbank-online.com for DEMO checkouts.
// Trust only HTTPS hosts under bank-owned DNS suffixes (exact dot boundary).
function trustedPaymentUrl(value){
 if(typeof value!=="string")return false;
 try{
  const url=new URL(value);
  const hostname=url.hostname.toLowerCase();
  const bankHost=["tinkoff.ru","tbank.ru"].some(domain=>
   hostname===domain||hostname.endsWith("."+domain)) ||
   hostname==="pay.tbank-online.com";
  return url.protocol==="https:" && !url.username && !url.password &&
   !url.port && bankHost;
 }catch{return false}
}
// Never record PaymentURL paths, queries, credentials or payment identifiers in logs.
function paymentHostForLog(value){
 if(typeof value!=="string")return "not-a-string";
 try{return new URL(value).hostname.slice(0,128)||"empty-host"}catch{return "invalid-url"}
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
 return {success:result?.Success===true,errorCode:redact(String(result?.ErrorCode??"unknown")),message:redact(result?.Message),details:redact(result?.Details),hasPaymentUrl:typeof result?.PaymentURL==="string",paymentHost:paymentHostForLog(result?.PaymentURL)};
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

 async function createCheckout(req,res,method){
  res.set("Cache-Control","no-store");
  if(!configured()||!pool)return res.status(503).json({error:"Тестовый эквайринг пока не настроен."});
  if(req.get("origin")!==(process.env.PUBLIC_BASE_URL||"https://viona.space").replace(new RegExp("/$"),""))return res.status(403).json({error:"Недопустимый источник запроса."});
  const user=getUser(req);
  if(!user)return res.status(401).json({error:"Войдите через Telegram для тестовой оплаты."});
  const ids=req.body?.items;
  if(!Array.isArray(ids)||ids.length<1||ids.length>20||!ids.every(id=>Number.isSafeInteger(id)&&id>0)||new Set(ids).size!==ids.length)return res.status(400).json({error:"Некорректная корзина."});
  const saveCard=method==="card"&&req.body?.saveCard===true;
  try{
   const catalog=await getCatalog(),selected=ids.map(id=>catalog.find(p=>Number(p.id)===id));
   if(selected.some(p=>!p||!Number.isSafeInteger(Number(p.price))||Number(p.price)<=0))return res.status(400).json({error:"Товары без фиксированной цены нельзя оплатить."});
   const amount=selected.reduce((sum,p)=>sum+Number(p.price)*100,0);
   const minimum=method==="sbp"?1000:100;
   if(!Number.isSafeInteger(amount)||amount<minimum||amount>1000000000)return res.status(400).json({error:method==="sbp"?"Для СБП минимальная сумма 10 ₽.":"Некорректная сумма."});
   const orderId=crypto.randomUUID();
   await pool.query("INSERT INTO viona_demo_payments(order_id,telegram_id,amount_kopecks,status,method,save_card_requested) VALUES($1,$2,$3,'NEW',$4,$5)",[orderId,user.id,amount,method,saveCard]);
   const initFields={Amount:amount,OrderId:orderId,Description:"VIONA DEMO: "+selected.map(p=>String(p.title)).join(", ").slice(0,128),NotificationURL:(process.env.PUBLIC_BASE_URL||"https://viona.space").replace(new RegExp("/$"),"")+"/api/payments/test/notification"};
   if(method==="card"){
    initFields.CustomerKey="viona-"+user.id;
    if(saveCard){initFields.Recurrent="Y";initFields.OperationInitiatorType="1";}
   }
   const result=await bank("Init",initFields);
   if(result.Success!==true||!result.PaymentId||(method==="card"&&!trustedPaymentUrl(result.PaymentURL))){
    console.warn("Demo payment Init bank response:",safeBankFailure(result));
    return res.status(502).json({error:"Банк не создал тестовый платёж."});
   }
   const paymentId=String(result.PaymentId);
   await pool.query("UPDATE viona_demo_payments SET payment_id=$2,status='INITIATED' WHERE order_id=$1",[orderId,paymentId]);
   if(method==="card")return res.json({paymentUrl:result.PaymentURL,orderId,mode:"demo"});
   const qr=await bank("GetQr",{PaymentId:paymentId,DataType:"PAYLOAD",PaymentMethod:"SBP"});
   if(qr.Success!==true||typeof qr.Data!=="string"){
    console.warn("Demo SBP GetQr rejected:",{success:qr.Success===true,errorCode:String(qr.ErrorCode||"unknown").slice(0,32)});
    return res.status(502).json({error:"Т-Банк не сформировал QR. Проверьте, включена ли СБП у терминала."});
   }
   let qrLink;
   try{const url=new URL(qr.Data);if(url.protocol!=="https:"||url.hostname!=="qr.nspk.ru"||url.username||url.password)throw Error("Invalid QR host");qrLink=url.toString()}catch{return res.status(502).json({error:"Банк вернул неожиданный адрес СБП."})}
   const QRCode=require("qrcode");
   const qrImage=await QRCode.toDataURL(qrLink,{errorCorrectionLevel:"M",width:320,margin:2});
   await pool.query("UPDATE viona_demo_payments SET status='QR_CREATED',updated_at=NOW() WHERE order_id=$1",[orderId]);
   res.json({qrImage,qrLink,orderId,mode:"demo"});
  }catch(e){
   console.error("Demo payment "+method+":",e.message,"network:",safeNetworkError(e));
   res.status(503).json({error:"Не удалось создать тестовый платёж."});
  }
 }
 app.post("/api/payments/test/init",(req,res)=>createCheckout(req,res,"card"));
 app.post("/api/payments/test/qr",(req,res)=>createCheckout(req,res,"sbp"));
 app.get("/api/payments/test/cards",async(req,res)=>{
  res.set("Cache-Control","no-store");
  const user=getUser(req);
  if(!user)return res.status(401).json({error:"Требуется вход через Telegram."});
  if(!configured()||!pool)return res.status(503).json({error:"Тестовое хранилище карт недоступно."});
  try{
   // A bank-hosted payment may save a card before its notification reaches us.
   // GetCardList is scoped to this authenticated customer's bank CustomerKey.
   const local=await pool.query("SELECT last4 FROM viona_demo_saved_cards WHERE telegram_id=$1 ORDER BY created_at DESC LIMIT 20",[user.id]);
   const cards=[],seen=new Set();
   let bankAvailable=false;
   try{
    const result=await bank("GetCardList",{CustomerKey:"viona-"+user.id,SavedCard:true});
    // The acquiring API can return an array directly or an object with Cards.
    const rows=Array.isArray(result)?result:Array.isArray(result?.Cards)?result.Cards:Array.isArray(result?.CardInfo)?result.CardInfo:[];
    if(Array.isArray(result)||result?.Success===true){
     bankAvailable=true;
     for(const item of rows.slice(0,50)){
      if(!item||typeof item!=="object")continue;
      const status=String(item.Status??"A").toUpperCase();
      if(!["A","ACTIVE"].includes(status))continue; // Ignore deleted/expired bank cards.
      const pan=String(item.Pan??"");
      const last4=pan.match(/([0-9]{4})$/)?.[1];
      if(!last4)continue;
      const cardId=String(item.CardId??"");
      const fingerprint="bank:"+ (cardId||last4);
      if(seen.has(fingerprint))continue;
      seen.add(fingerprint);
      cards.push({last4,source:"bank"});
     }
    }else{
     console.warn("Demo GetCardList rejected:",String(result?.ErrorCode??"unknown").slice(0,24));
    }
   }catch(e){
    console.warn("Demo GetCardList unavailable:",safeNetworkError(e));
   }
   // Fallback for a successful, signed payment notification even if GetCardList is unavailable.
   for(const row of local.rows){
    const last4=String(row.last4||"");
    if(!/^[0-9]{4}$/.test(last4)||cards.some(card=>card.last4===last4))continue;
    cards.push({last4,source:"verified"});
   }
   res.json({cards:cards.slice(0,20),mode:"demo",bankAvailable});
  }catch(e){
   console.error("Demo saved cards:",e.message);
   res.status(503).json({error:"Не удалось загрузить сохранённые карты."});
  }
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

   const updated=await pool.query("UPDATE viona_demo_payments SET status=$2,updated_at=NOW() WHERE order_id=$1 AND amount_kopecks=$3 AND payment_id=$4 RETURNING telegram_id,method,save_card_requested",[String(body.OrderId),status,Number(body.Amount),String(body.PaymentId||"")]);
   // Store only a bank-issued payment token and the last four digits. Never PAN/CVV/expiry.
   const rebill=typeof body.RebillId==="string"||typeof body.RebillId==="number"?String(body.RebillId):"";
   const pan=typeof body.Pan==="string"?body.Pan:"";
   if(updated.rowCount && updated.rows[0].method==="card" && updated.rows[0].save_card_requested &&
      (status==="AUTHORIZED"||status==="CONFIRMED") && body.Success===true &&
      (!body.CustomerKey || body.CustomerKey==="viona-"+updated.rows[0].telegram_id) &&
      /^[0-9]{1,64}$/.test(rebill) && /^[0-9*]{8,24}$/.test(pan) &&
      pan.includes("*") && /[0-9]{4}$/.test(pan)){
    await pool.query("INSERT INTO viona_demo_saved_cards(telegram_id,rebill_id,last4) VALUES($1,$2,$3) ON CONFLICT(telegram_id,rebill_id) DO NOTHING",
      [updated.rows[0].telegram_id,rebill,pan.slice(-4)]);
   }
   res.type("text/plain").send("OK");
  }catch(e){console.error("Demo payment notification:",e.message);res.sendStatus(503)}
 });
 app.get("/api/payments/test/status/:id",async(req,res)=>{
  res.set("Cache-Control","no-store");
  const user=getUser(req);if(!user)return res.sendStatus(401);
  if(!/^[0-9a-f-]{36}$/i.test(req.params.id)||!pool)return res.sendStatus(404);
  try{
   const r=await pool.query("SELECT status,amount_kopecks,method,payment_id FROM viona_demo_payments WHERE order_id=$1 AND telegram_id=$2",[req.params.id,user.id]);
   if(!r.rowCount)return res.sendStatus(404);
   const payment=r.rows[0];
   // A DEMO SBP notification might be delayed; verify status with the bank.
   if(payment.method==="sbp" && payment.payment_id && ["INITIATED","QR_CREATED","AUTHORIZED"].includes(payment.status)){
    try{
     const remote=await bank("GetState",{PaymentId:payment.payment_id});
     const valid=remote.Success===true && String(remote.PaymentId)===String(payment.payment_id) &&
       String(remote.OrderId)===String(req.params.id) && Number(remote.Amount)===Number(payment.amount_kopecks);
     const next=String(remote.Status||"");
     if(valid && ["AUTHORIZED","CONFIRMED","REJECTED","DEADLINE_EXPIRED","REVERSED","CANCELED"].includes(next)){
      await pool.query("UPDATE viona_demo_payments SET status=$2,updated_at=NOW() WHERE order_id=$1 AND telegram_id=$3 AND payment_id=$4",[req.params.id,next,user.id,payment.payment_id]);
      payment.status=next;
     }
    }catch(e){console.error("Demo SBP state check:",safeNetworkError(e))}
   }
   res.json({mode:"demo",status:payment.status,amount_kopecks:payment.amount_kopecks});
  }catch(e){console.error("Demo payment status:",e.message);res.sendStatus(503)}
 });
}
module.exports={registerTestPayments};
