"use strict";
/* VIONA demo fulfillment console. Only a Google-verified allowlisted identity may manage orders.
   Never accept or persist Google account passwords. */
const crypto=require("node:crypto");
const path=require("node:path");
// Load Express when registering routes so pure security checks can be unit tested without server dependencies.
const {publicOrder,reconcile}=require("./payment-order");
const ADMIN_EMAIL="support.viona.space@gmail.com";
const SESSION_COOKIE="viona_admin_session";
const SESSION_MS=12*60*60*1000;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_EXT=new Set(["txt","md","js","jsx","ts","tsx","py","html","css","json","xml","sql","java","cs","c","h","cpp","go","rs","lua","rb","php","yaml","yml","zip"]);
const STATUS_NEXT={queued:"in_progress",in_progress:"ready",ready:"completed"};
const PUBLIC_SITE=()=>String(process.env.PUBLIC_BASE_URL||"https://viona.space").replace(/\/$/,"");
const enabled=pool=>Boolean(pool&&process.env.GOOGLE_CLIENT_ID);
function identityAllowed(payload){
 return Boolean(payload&&payload.email_verified===true&&
  typeof payload.email==="string"&&payload.email.toLowerCase()===ADMIN_EMAIL&&
  typeof payload.sub==="string"&&/^\d{5,30}$/.test(payload.sub)&&
  (!process.env.VIONA_ADMIN_GOOGLE_SUB||payload.sub===process.env.VIONA_ADMIN_GOOGLE_SUB));
}
function filenameFromHeader(raw){
 if(typeof raw!=="string"||raw.length>900)return "";
 let value;try{value=decodeURIComponent(raw)}catch{return ""}
 if(/[\\/\u0000-\u001f\u007f]/.test(value))return "";
 value=path.basename(value).normalize("NFC").trim().replace(/[^\p{L}\p{N} ._()-]/gu,"_").slice(0,180);
 const extension=value.toLowerCase().split(".").at(-1);
 return ALLOWED_EXT.has(extension)?value:"";
}
function asPublic(row){
 const o=publicOrder(row,false);
 return {...o,telegramId:String(row.telegram_id),fileName:row.filename||null,
  fileSize:row.file_size||null,fileUploadedAt:row.uploaded_at||null,archivedAt:row.archived_at||null};
}
function download(res,row){
 const name=row.filename;
 const ascii=name.replace(/[^A-Za-z0-9._-]/g,"_").slice(0,120)||"viona-result.txt";
 res.set({"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff",
  "Content-Security-Policy":"sandbox",
  "Content-Disposition":'attachment; filename="'+ascii+'"; filename*=UTF-8\'\''+encodeURIComponent(name)});
 res.type("application/octet-stream");
 return res.send(row.contents);
}
function registerAdminConsole(app,pool,{bank,configured}={}){
 const express=require("express");
 const base="/api/admin";
 const raw=express.raw({type:"application/octet-stream",limit:"1mb"});
 const sameOrigin=req=>req.get("origin")===PUBLIC_SITE();
 const isJSON=req=>Boolean(req.is("application/json"));
 const noStore=(req,res,next)=>{res.set({"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"});next()};
 app.use(base,noStore);
 app.get("/admin-console",(req,res)=>{res.set({"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive","Referrer-Policy":"no-referrer"});res.sendFile(path.join(__dirname,"private","admin-console.html"))});
 app.get(base+"/config",(req,res)=>res.json({enabled:enabled(pool),databaseReady:Boolean(pool),googleClientReady:Boolean(process.env.GOOGLE_CLIENT_ID),clientId:enabled(pool)?process.env.GOOGLE_CLIENT_ID:null,login:"google"}));
 const readToken=req=>{
  const match=String(req.headers.cookie||"").split(";").map(x=>x.trim()).find(x=>x.startsWith(SESSION_COOKIE+"="));
  const value=match?.slice(SESSION_COOKIE.length+1)||"";
  return /^[a-f0-9]{64}$/i.test(value)?value:null;
 };
 const hash=token=>crypto.createHash("sha256").update(token).digest("hex");
 const cookieOptions={httpOnly:true,secure:PUBLIC_SITE().startsWith("https://"),sameSite:"strict",path:base};
 const session=async(req,res,next)=>{
  if(!enabled(pool))return res.status(503).json({error:"Для админ-панели нужны PostgreSQL и Google Client ID."});
  const token=readToken(req);
  if(!token)return res.status(401).json({error:"Необходим вход в админ-панель."});
  try{
   const q=await pool.query("SELECT google_sub FROM viona_admin_sessions WHERE token_hash=$1 AND expires_at>NOW()",[hash(token)]);
   if(!q.rowCount)return res.status(401).json({error:"Сеанс завершился. Войди снова."});
   req.adminGoogleSub=q.rows[0].google_sub;
   return next();
  }catch(e){console.error("VIONA admin session:",e.message);return res.status(503).json({error:"Недоступна проверка сеанса."})}
 };
 const requireMutation=(req,res,next)=>{
  if(!sameOrigin(req))return res.status(403).json({error:"Недопустимый источник."});
  return next();
 };
 app.post(base+"/login",requireMutation,async(req,res)=>{
  if(!enabled(pool))return res.status(503).json({error:"Google Sign-In или БД не настроены."});
  if(!isJSON(req)||typeof req.body?.credential!=="string"||req.body.credential.length>8192)
   return res.status(400).json({error:"Некорректные данные входа."});
  try{
   const {OAuth2Client}=require("google-auth-library");
   const client=new OAuth2Client();
   const ticket=await client.verifyIdToken({idToken:req.body.credential,audience:process.env.GOOGLE_CLIENT_ID});
   const identity=ticket.getPayload();
   if(!identityAllowed(identity))return res.status(403).json({error:"Эта учётная запись не имеет доступа."});
   const token=crypto.randomBytes(32).toString("hex");
   await pool.query("INSERT INTO viona_admin_sessions(token_hash,google_sub,expires_at) VALUES($1,$2,$3)",[hash(token),identity.sub,new Date(Date.now()+SESSION_MS)]);
   res.cookie(SESSION_COOKIE,token,{...cookieOptions,maxAge:SESSION_MS});
   return res.json({ok:true,email:ADMIN_EMAIL});
  }catch(e){
   console.warn("VIONA admin Google login rejected:",e.name||"invalid");
   return res.status(401).json({error:"Не удалось подтвердить Google-аккаунт."});
  }
 });
 app.get(base+"/session",session,(req,res)=>res.json({authenticated:true,email:ADMIN_EMAIL}));
 app.post(base+"/logout",requireMutation,async(req,res)=>{
  const token=readToken(req);
  try{if(token&&pool)await pool.query("DELETE FROM viona_admin_sessions WHERE token_hash=$1",[hash(token)])}catch(e){console.warn("Admin sign-out storage unavailable:",e.message)}
  res.clearCookie(SESSION_COOKIE,cookieOptions);
  res.json({ok:true});
 });
 app.get(base+"/orders",session,async(req,res)=>{
  const showArchived=req.query.archived==="1";
  const archiveFilter=showArchived?"p.archived_at IS NOT NULL":"p.archived_at IS NULL";
  try{
   let q=await pool.query(`SELECT p.*,f.filename,f.file_size,f.uploaded_at FROM viona_demo_payments p
    LEFT JOIN viona_demo_order_files f ON f.order_id=p.order_id
    WHERE ${archiveFilter} ORDER BY p.created_at DESC LIMIT 100`);
   if(configured?.()&&typeof bank==="function"){
    const pending=q.rows.filter(x=>x.payment_id&&!["CONFIRMED","REFUNDED","REVERSED","REJECTED","CANCELED"].includes(x.status)).slice(0,6);
    await Promise.allSettled(pending.map(async row=>{await reconcile(row,pool,bank)}));
    if(pending.length)q=await pool.query(`SELECT p.*,f.filename,f.file_size,f.uploaded_at FROM viona_demo_payments p
      LEFT JOIN viona_demo_order_files f ON f.order_id=p.order_id WHERE ${archiveFilter} ORDER BY p.created_at DESC LIMIT 100`);
   }
   res.json({orders:q.rows.map(asPublic)});
  }catch(e){console.error("VIONA admin orders:",e.message);res.status(503).json({error:"Не удалось загрузить заказы."})}
 });
 app.get(base+"/orders/:id",session,async(req,res)=>{
  if(!UUID.test(req.params.id))return res.sendStatus(400);
  try{
   const q=await pool.query(`SELECT p.*,f.filename,f.file_size,f.uploaded_at FROM viona_demo_payments p
    LEFT JOIN viona_demo_order_files f ON f.order_id=p.order_id WHERE p.order_id=$1`,[req.params.id]);
   if(!q.rowCount)return res.sendStatus(404);
   const e=await pool.query("SELECT stage,message,created_at FROM viona_demo_order_events WHERE order_id=$1 ORDER BY id ASC LIMIT 100",[req.params.id]);
   res.json({order:asPublic(q.rows[0]),events:e.rows});
  }catch(err){console.error("VIONA admin order detail:",err.message);res.sendStatus(503)}
 });
 app.patch(base+"/orders/:id/stage",session,requireMutation,async(req,res)=>{
  if(!UUID.test(req.params.id)||!isJSON(req))return res.sendStatus(400);
  const next=String(req.body?.stage||"");
  const previous=Object.keys(STATUS_NEXT).find(k=>STATUS_NEXT[k]===next);
  const note=typeof req.body?.note==="string"?req.body.note.trim().slice(0,500):"";
  if(!previous)return res.status(400).json({error:"Неизвестный этап."});
  try{
   const updated=await pool.query(`UPDATE viona_demo_payments SET fulfillment_status=$3,fulfillment_note=$4,stage_updated_at=NOW(),updated_at=NOW()
    WHERE order_id=$1 AND fulfillment_status=$2 AND status='CONFIRMED'
    AND ($3 <> 'completed' OR EXISTS(SELECT 1 FROM viona_demo_order_files WHERE order_id=$1))
    RETURNING *`,[req.params.id,previous,next,note]);
   if(!updated.rowCount)return res.status(409).json({error:"Проверь подтверждение оплаты, текущий этап и наличие файла перед завершением."});
   res.json({order:publicOrder(updated.rows[0],false)});
  }catch(e){console.error("VIONA admin stage update:",e.message);res.status(503).json({error:"Не удалось изменить этап."})}
 });
 // Declining delivery is an admin decision, not a bank refund or a failed payment.
 app.patch(base+"/orders/:id/reject",session,requireMutation,async(req,res)=>{
  if(!UUID.test(req.params.id)||!isJSON(req))return res.sendStatus(400);
  const reason=typeof req.body?.reason==="string"?req.body.reason.trim().slice(0,500):"";
  if(reason.length<10)return res.status(400).json({error:"Укажи причину отклонения минимум в 10 символов."});
  try{
   const result=await pool.query(`UPDATE viona_demo_payments
    SET fulfillment_status='rejected',fulfillment_note=$2,stage_updated_at=NOW(),updated_at=NOW()
    WHERE order_id=$1 AND status='CONFIRMED' AND fulfillment_status IN ('queued','in_progress','ready')
    RETURNING *`,[req.params.id,reason]);
   if(!result.rowCount)return res.status(409).json({error:"Можно отклонить только оплаченный заказ, который ещё не завершён."});
   return res.json({order:publicOrder(result.rows[0],false)});
  }catch(e){console.error("VIONA order rejection:",e.message);return res.status(503).json({error:"Не удалось отклонить заказ."})}
 });
 // Soft archive; never delete payment records, uploaded files or customer history.
 app.post(base+"/orders/archive",session,requireMutation,async(req,res)=>{
  if(!isJSON(req)||req.body?.confirm!=="АРХИВИРОВАТЬ")return res.status(400).json({error:"Требуется подтверждение архивирования."});
  try{
   const q=await pool.query("UPDATE viona_demo_payments SET archived_at=NOW() WHERE archived_at IS NULL RETURNING order_id");
   return res.json({ok:true,archived:q.rowCount});
  }catch(e){console.error("VIONA admin archive:",e.message);return res.status(503).json({error:"Не удалось очистить список заказов."})}
 });
 app.post(base+"/orders/:id/restore",session,requireMutation,async(req,res)=>{
  if(!UUID.test(req.params.id))return res.sendStatus(400);
  try{
   const q=await pool.query("UPDATE viona_demo_payments SET archived_at=NULL WHERE order_id=$1 AND archived_at IS NOT NULL RETURNING order_id",[req.params.id]);
   return res.status(q.rowCount?200:404).json({ok:Boolean(q.rowCount)});
  }catch(e){console.error("VIONA order restore:",e.message);return res.status(503).json({error:"Не удалось восстановить заказ."})}
 });
 app.get(base+"/inquiries",session,async(req,res)=>{
  try{
   const ordinary=await pool.query("SELECT id,name,contact,details,created_at FROM requests ORDER BY created_at DESC LIMIT 100");
   const code=await pool.query("SELECT id,project_name,contact,requested_changes,technology,created_at FROM code_edit_requests ORDER BY created_at DESC LIMIT 50");
   const inquiries=[
    ...ordinary.rows.map(x=>({id:String(x.id),kind:"Обращение с сайта",title:x.name||"Новая заявка",contact:x.contact,details:x.details,createdAt:x.created_at})),
    ...code.rows.map(x=>({id:String(x.id),kind:"Доработка кода",title:x.project_name,contact:x.contact,details:x.requested_changes,technology:x.technology,createdAt:x.created_at}))
   ].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,120);
   return res.json({inquiries});
  }catch(e){console.error("VIONA inquiries:",e.message);return res.status(503).json({error:"Не удалось загрузить заявки."})}
 });
 app.post(base+"/orders/:id/message",session,requireMutation,async(req,res)=>{
  if(!UUID.test(req.params.id)||!isJSON(req))return res.sendStatus(400);
  const message=typeof req.body?.message==="string"?req.body.message.trim().slice(0,500):"";
  if(message.length<3)return res.status(400).json({error:"Сообщение слишком короткое."});
  try{
   const q=await pool.query(`INSERT INTO viona_demo_order_events(order_id,stage,message)
    SELECT order_id,'message',$2 FROM viona_demo_payments WHERE order_id=$1 AND status='CONFIRMED' RETURNING id`,[req.params.id,message]);
   res.status(q.rowCount?201:409).json({ok:Boolean(q.rowCount)});
  }catch(e){console.error("VIONA admin order message:",e.message);res.status(503).json({error:"Не удалось отправить сообщение."})}
 });
 app.post(base+"/orders/:id/file",session,requireMutation,raw,async(req,res)=>{
  if(!UUID.test(req.params.id))return res.sendStatus(400);
  const filename=filenameFromHeader(req.get("x-file-name"));
  if(!filename)return res.status(400).json({error:"Недопустимое имя или расширение файла."});
  if(!Buffer.isBuffer(req.body)||!req.body.length||req.body.length>1048576)
   return res.status(400).json({error:"Нужен файл кода не более 1 МиБ."});
  try{
   const row=await pool.query("SELECT status,fulfillment_status FROM viona_demo_payments WHERE order_id=$1",[req.params.id]);
   if(!row.rowCount)return res.sendStatus(404);
   if(row.rows[0].status!=="CONFIRMED")return res.status(409).json({error:"Выдача возможна только после подтверждения тестовой оплаты."});
   if(row.rows[0].fulfillment_status==="rejected")return res.status(409).json({error:"Нельзя загружать файл для отклонённого заказа."});
   await pool.query(`INSERT INTO viona_demo_order_files(order_id,filename,media_type,contents,file_size)
    VALUES($1,$2,'application/octet-stream',$3,$4)
    ON CONFLICT(order_id) DO UPDATE SET filename=EXCLUDED.filename,media_type=EXCLUDED.media_type,
     contents=EXCLUDED.contents,file_size=EXCLUDED.file_size,uploaded_at=NOW()`,[req.params.id,filename,req.body,req.body.length]);
   await pool.query("INSERT INTO viona_demo_order_events(order_id,stage,message) VALUES($1,'file',$2)",[req.params.id,"Файл результата подготовлен командой VIONA."]);
   res.status(201).json({ok:true,filename,size:req.body.length});
  }catch(e){console.error("VIONA admin file:",e.message);res.status(503).json({error:"Не удалось сохранить файл."})}
 });
 app.get(base+"/orders/:id/file",session,async(req,res)=>{
  if(!UUID.test(req.params.id))return res.sendStatus(400);
  try{
   const q=await pool.query("SELECT filename,contents FROM viona_demo_order_files WHERE order_id=$1",[req.params.id]);
   if(!q.rowCount)return res.sendStatus(404);
   return download(res,q.rows[0]);
  }catch(e){console.error("VIONA admin file download:",e.message);res.sendStatus(503)}
 });
}
module.exports={registerAdminConsole,identityAllowed,filenameFromHeader,ADMIN_EMAIL,STATUS_NEXT};
