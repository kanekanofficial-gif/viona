"use strict";
/* VIONA 17: authenticated, bank-verified DEMO order tracking and real fulfillment updates. */
const {getUser}=require("./telegram-auth");
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FINISHED=new Set(["CONFIRMED","REFUNDED","REVERSED"]);
const FAILED=new Set(["REJECTED","AUTH_FAIL","CANCELED","DEADLINE_EXPIRED","REFUNDED","REVERSED"]);
const ALLOWED_BANK=new Set(["NEW","FORM_SHOWED","AUTHORIZING","AUTHORIZED","CONFIRMED","AUTH_FAIL","REJECTED","CANCELED","DEADLINE_EXPIRED","REFUNDED","REVERSED","CONFIRMING"]);
const PROGRESSION={queued:"in_progress",in_progress:"ready",ready:"completed"};
const publicSite=()=>(process.env.PUBLIC_BASE_URL||"https://viona.space").replace(/\/$/,"");
const isAdmin=user=>Boolean(user && String(process.env.VIONA_ADMIN_TELEGRAM_IDS||"").split(",").map(v=>v.trim()).filter(Boolean).includes(String(user.id)));
const safeText=(input,max=500)=>typeof input==="string"?input.trim().slice(0,max):"";

function bankMatches(remote,row){
 return remote && remote.Success===true &&
  String(remote.PaymentId)===String(row.payment_id) &&
  String(remote.OrderId)===String(row.order_id) &&
  Number(remote.Amount)===Number(row.amount_kopecks) &&
  (!remote.TerminalKey||remote.TerminalKey===process.env.TBANK_DEMO_TERMINAL) &&
  ALLOWED_BANK.has(String(remote.Status||""));
}
async function reconcile(row,pool,bank){
 if(!row.payment_id || FINISHED.has(row.status))return row;
 const last=Number(new Date(row.last_bank_check_at||0));
 if(Number.isFinite(last)&&Date.now()-last<9000)return row;
 // Bank response—not the URL query, the browser or a client-supplied flag—sets paid state.
 try{
  const remote=await bank("GetState",{PaymentId:row.payment_id});
  if(!bankMatches(remote,row)){
   console.warn("VIONA order bank state mismatch:",row.order_id);
   return row;
  }
  const next=String(remote.Status);
  const result=await pool.query(
   "UPDATE viona_demo_payments SET " +
   "status=CASE WHEN status IN ('CONFIRMED','REFUNDED','REVERSED') THEN status ELSE $2 END," +
   "paid_at=CASE WHEN $2='CONFIRMED' THEN COALESCE(paid_at,NOW()) ELSE paid_at END," +
   "fulfillment_status=CASE WHEN $2='CONFIRMED' AND fulfillment_status='awaiting_payment' THEN 'queued' ELSE fulfillment_status END," +
   "stage_updated_at=CASE WHEN $2='CONFIRMED' AND fulfillment_status='awaiting_payment' THEN NOW() ELSE stage_updated_at END," +
   "last_bank_check_at=NOW(),updated_at=NOW() " +
   "WHERE order_id=$1 AND payment_id=$3 RETURNING *",
   [row.order_id,next,row.payment_id]
  );
  return result.rows[0]||row;
 }catch(e){
  console.warn("VIONA order GetState unavailable:",typeof e?.cause?.code==="string"?e.cause.code:"network");
  return row;
 }
}
function publicOrder(row,canManage){
 const status=String(row.status||"NEW");
 const confirmed=status==="CONFIRMED";
 const stage=confirmed?String(row.fulfillment_status||"queued"):"awaiting_payment";
 const items=Array.isArray(row.items)?row.items.map(i=>({
  id:Number(i.id)||0,
  title:safeText(i.title,160),
  description:safeText(i.description,1000),
  category:safeText(i.category,70),
  tag:safeText(i.tag,70),
  price:Number(i.price)||0
 })):[];
 return {
  orderId:String(row.order_id),
  status,
  verifiedPaid:confirmed,
  failed:FAILED.has(status),
  stage,
  stageNote:confirmed?safeText(row.fulfillment_note,500):"",
  amount:Math.round(Number(row.amount_kopecks)/100),
  method:safeText(row.method,24)||"card",
  items,
  createdAt:row.created_at,
  paidAt:confirmed?row.paid_at:null,
  stageUpdatedAt:row.stage_updated_at,
  demo:true,
  canManage:Boolean(canManage&&confirmed)
 };
}
function registerPaymentOrders(app,pool,bank,configured){
 app.use("/api/payments/test/order",(_req,res,next)=>{
  res.set("Cache-Control","private, no-store");
  next();
 });
 app.get("/api/payments/test/order/:id",async(req,res)=>{
  const user=getUser(req);
  if(!user)return res.status(401).json({error:"Войди через Telegram, чтобы просмотреть свой заказ."});
  if(!pool||!configured())return res.status(503).json({error:"Сервис проверки оплаты временно недоступен."});
  if(!UUID.test(req.params.id))return res.status(400).json({error:"Некорректный номер заказа."});
  try{
   const p=await pool.query("SELECT * FROM viona_demo_payments WHERE order_id=$1 AND telegram_id=$2",[req.params.id,user.id]);
   if(!p.rowCount)return res.status(404).json({error:"Заказ не найден в этом аккаунте."});
   const row=await reconcile(p.rows[0],pool,bank);
   const events=await pool.query("SELECT stage,message,created_at FROM viona_demo_order_events WHERE order_id=$1 ORDER BY id ASC LIMIT 60",[req.params.id]);
   res.json({order:publicOrder(row,isAdmin(user)),events:events.rows.map(e=>({stage:safeText(e.stage,35),message:safeText(e.message,500),createdAt:e.created_at}))});
  }catch(e){
   console.error("VIONA order details:",e.message);
   res.status(503).json({error:"Не удалось получить данные заказа."});
  }
 });
 app.get("/api/payments/test/my-orders",async(req,res)=>{
  res.set("Cache-Control","private, no-store");
  const user=getUser(req);
  if(!user)return res.status(401).json({error:"Требуется вход через Telegram."});
  if(!pool||!configured())return res.status(503).json({error:"История тестовых покупок недоступна."});
  try{
   const r=await pool.query("SELECT * FROM viona_demo_payments WHERE telegram_id=$1 ORDER BY created_at DESC LIMIT 40",[user.id]);
   res.json({orders:r.rows.map(row=>publicOrder(row,false))});
  }catch(e){console.error("VIONA purchase history:",e.message);res.status(503).json({error:"История заказов недоступна."})}
 });
 function requireAdmin(req,res){
  const user=getUser(req);
  if(!user || !isAdmin(user))return false;
  const origin=req.get("origin");
  return origin===publicSite() && req.is("application/json");
 }
 app.patch("/api/payments/test/order/:id/stage",async(req,res)=>{
  res.set("Cache-Control","no-store");
  if(!requireAdmin(req,res))return res.status(403).json({error:"Нет доступа к управлению заказами."});
  if(!pool||!configured())return res.sendStatus(503);
  if(!UUID.test(req.params.id))return res.sendStatus(400);
  const next=safeText(req.body?.stage,35),note=safeText(req.body?.note,500);
  if(!["in_progress","ready","completed"].includes(next))return res.status(400).json({error:"Недопустимый этап заказа."});
  const previous=Object.keys(PROGRESSION).find(stage=>PROGRESSION[stage]===next);
  try{
   const r=await pool.query(
    "UPDATE viona_demo_payments SET fulfillment_status=$3,fulfillment_note=$4,stage_updated_at=NOW(),updated_at=NOW() " +
    "WHERE order_id=$1 AND telegram_id IS NOT NULL AND status='CONFIRMED' AND fulfillment_status=$2 RETURNING *",
    [req.params.id,previous,next,note]
   );
   if(!r.rowCount)return res.status(409).json({error:"Этап заказа изменился или платёж ещё не подтверждён."});
   res.json({order:publicOrder(r.rows[0],true)});
  }catch(e){console.error("VIONA fulfillment stage:",e.message);res.status(503).json({error:"Не удалось обновить этап заказа."})}
 });
 app.post("/api/payments/test/order/:id/message",async(req,res)=>{
  res.set("Cache-Control","no-store");
  if(!requireAdmin(req,res))return res.status(403).json({error:"Нет доступа к сообщениям."});
  if(!pool||!configured())return res.sendStatus(503);
  if(!UUID.test(req.params.id))return res.sendStatus(400);
  const message=safeText(req.body?.message,500);
  if(message.length<3)return res.status(400).json({error:"Сообщение слишком короткое."});
  try{
   const r=await pool.query("INSERT INTO viona_demo_order_events(order_id,stage,message) SELECT order_id,'message',$2 FROM viona_demo_payments WHERE order_id=$1 AND status='CONFIRMED' RETURNING id",[req.params.id,message]);
   res.status(r.rowCount?201:404).json({ok:Boolean(r.rowCount)});
  }catch(e){console.error("VIONA fulfillment message:",e.message);res.status(503).json({error:"Не удалось отправить сообщение."})}
 });
}
module.exports={registerPaymentOrders,bankMatches,publicOrder};
