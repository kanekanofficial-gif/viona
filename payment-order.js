"use strict";
/* VIONA 17: authenticated, bank-verified DEMO order tracking and real fulfillment updates. */
const {getUser}=require("./telegram-auth");
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FINISHED=new Set(["CONFIRMED","REFUNDED","REVERSED"]);
const FAILED=new Set(["REJECTED","AUTH_FAIL","CANCELED","DEADLINE_EXPIRED","REFUNDED","REVERSED"]);
const ALLOWED_BANK=new Set(["NEW","FORM_SHOWED","AUTHORIZING","AUTHORIZED","CONFIRMED","AUTH_FAIL","REJECTED","CANCELED","DEADLINE_EXPIRED","REFUNDED","REVERSED","CONFIRMING"]);
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
 if(!row.payment_id)return row;
 // Repair legacy confirmed test orders that predate the fulfillment migration.
 if(row.status==="CONFIRMED" && row.fulfillment_status==="awaiting_payment"){
  try{
   const recovered=await pool.query("UPDATE viona_demo_payments SET fulfillment_status='queued',paid_at=COALESCE(paid_at,NOW()),stage_updated_at=NOW() WHERE order_id=$1 AND status='CONFIRMED' AND fulfillment_status='awaiting_payment' RETURNING *",[row.order_id]);
   return recovered.rows[0]||row;
  }catch(e){console.warn("VIONA confirmed order transition unavailable:",e.message);return row}
 }
 if(FINISHED.has(row.status))return row;
 const last=Number(new Date(row.last_bank_check_at||0));
 if(Number.isFinite(last)&&Date.now()-last<9000)return row;
 // A database-level lease prevents simultaneous page refreshes from flooding GetState.
 try{
  const lease=await pool.query(
   "UPDATE viona_demo_payments SET last_bank_check_at=NOW() "+
   "WHERE order_id=$1 AND payment_id=$2 AND (last_bank_check_at IS NULL OR last_bank_check_at < NOW()-INTERVAL '9 seconds') RETURNING order_id",
   [row.order_id,row.payment_id]
  );
  if(!lease.rowCount)return row;
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
  rejected:confirmed&&stage==="rejected",
  stage,
  stageNote:confirmed?safeText(row.fulfillment_note,500):"",
  customerContact:safeText(row.customer_contact,200),
  customerBrief:safeText(row.customer_brief,4000),
  amount:Math.round(Number(row.amount_kopecks)/100),
  method:safeText(row.method,24)||"card",
  items,
  createdAt:row.created_at,
  paidAt:confirmed?row.paid_at:null,
  stageUpdatedAt:row.stage_updated_at,
  demo:true,
  fileAvailable:Boolean(confirmed&&stage==="completed"&&row.filename),
  fileName:confirmed&&stage==="completed"&&row.filename?safeText(row.filename,180):null,
  canManage:false
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
   const p=await pool.query("SELECT p.*,f.filename FROM viona_demo_payments p LEFT JOIN viona_demo_order_files f ON f.order_id=p.order_id WHERE p.order_id=$1 AND p.telegram_id=$2",[req.params.id,user.id]);
   if(!p.rowCount)return res.status(404).json({error:"Заказ не найден в этом аккаунте."});
   const row=await reconcile(p.rows[0],pool,bank);
   const events=await pool.query("SELECT stage,message,created_at FROM viona_demo_order_events WHERE order_id=$1 ORDER BY id ASC LIMIT 60",[req.params.id]);
   res.json({order:publicOrder(row,false),events:events.rows.map(e=>({stage:safeText(e.stage,35),message:safeText(e.message,500),createdAt:e.created_at}))});
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
   const r=await pool.query("SELECT p.*,f.filename FROM viona_demo_payments p LEFT JOIN viona_demo_order_files f ON f.order_id=p.order_id WHERE p.telegram_id=$1 ORDER BY p.created_at DESC LIMIT 40",[user.id]);
   res.json({orders:r.rows.map(row=>publicOrder(row,false))});
  }catch(e){console.error("VIONA purchase history:",e.message);res.status(503).json({error:"История заказов недоступна."})}
 });

 // Only the purchasing Telegram account can download, and only after verified CONFIRMED and admin completion.
 app.get("/api/payments/test/order/:id/file",async(req,res)=>{
  res.set({"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"sandbox"});
  const user=getUser(req);
  if(!user)return res.status(401).json({error:"Войди через Telegram для скачивания результата."});
  if(!pool)return res.sendStatus(503);
  if(!UUID.test(req.params.id))return res.sendStatus(400);
  try{
   const q=await pool.query(`SELECT f.filename,f.contents FROM viona_demo_order_files f
    JOIN viona_demo_payments p ON p.order_id=f.order_id
    WHERE p.order_id=$1 AND p.telegram_id=$2 AND p.status='CONFIRMED' AND p.fulfillment_status='completed'`,[req.params.id,user.id]);
   if(!q.rowCount)return res.status(404).json({error:"Файл пока недоступен. Открой заказ после завершения работы."});
   const item=q.rows[0];
   const fallback="viona-code-result";
   res.set("Content-Disposition", "attachment; filename=\"viona-code-result\"; filename*=UTF-8''"+encodeURIComponent(item.filename));
   res.type("application/octet-stream");
   res.send(item.contents);
  }catch(e){console.error("VIONA private code delivery:",e.message);res.status(503).json({error:"Не удалось скачать файл."})}
 });

}
module.exports={registerPaymentOrders,bankMatches,publicOrder,reconcile};
