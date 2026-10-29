"use strict";
const crypto=require("node:crypto");
const BOT_TOKEN=process.env.TELEGRAM_BOT_TOKEN||"";
const SESSION_SECRET=process.env.SESSION_SECRET||"";
const BOT_USERNAME=(process.env.TELEGRAM_BOT_USERNAME||"viona_appbot").replace(/^@/,"");
const BASE=(process.env.PUBLIC_BASE_URL||"https://viona.space").replace(/\/$/,"");
const enabled=Boolean(BOT_TOKEN&&SESSION_SECRET.length>=32&&/^[a-zA-Z0-9_]{5,32}$/.test(BOT_USERNAME));
const secure=BASE.startsWith("https:")?"; Secure":"";
function cookie(res,name,value,maxAge){res.append("Set-Cookie",name+"="+value+"; Path=/; HttpOnly; SameSite=Lax"+secure+"; Max-Age="+maxAge)}
function cookies(req){const out={};for(const part of (req.headers.cookie||"").split(";")){const pos=part.indexOf("=");if(pos>0)out[part.slice(0,pos).trim()]=part.slice(pos+1).trim()}return out}
function sign(data){const value=Buffer.from(JSON.stringify(data)).toString("base64url");const mac=crypto.createHmac("sha256",SESSION_SECRET).update(value).digest("base64url");return value+"."+mac}
function verify(raw){if(!enabled||typeof raw!=="string"||raw.length>3000)return null;const parts=raw.split(".");if(parts.length!==2)return null;const expected=crypto.createHmac("sha256",SESSION_SECRET).update(parts[0]).digest();let actual;try{actual=Buffer.from(parts[1],"base64url")}catch{return null}if(actual.length!==expected.length||!crypto.timingSafeEqual(actual,expected))return null;try{const data=JSON.parse(Buffer.from(parts[0],"base64url").toString("utf8"));return data&&typeof data==="object"?data:null}catch{return null}}
function validateTelegram(query){if(!enabled)return null;const hash=query.hash;if(typeof hash!=="string"||!/^[0-9a-f]{64}$/i.test(hash))return null;const allowed=["id","first_name","last_name","username","photo_url","auth_date"];const pairs=[];for(const [key,val] of Object.entries(query)){if(key==="hash")continue;if(!allowed.includes(key)||typeof val!=="string"||val.length>500)return null;pairs.push(key+"="+val)}for(const key of ["id","first_name","auth_date"])if(typeof query[key]!=="string")return null;
const authTime=Number(query.auth_date),now=Math.floor(Date.now()/1000);if(!Number.isSafeInteger(authTime)||authTime>now+60||now-authTime>300)return null;if(!/^\d{1,20}$/.test(query.id))return null;
const secret=crypto.createHash("sha256").update(BOT_TOKEN).digest();const check=crypto.createHmac("sha256",secret).update(pairs.sort().join("\n")).digest("hex");const a=Buffer.from(hash,"hex"),b=Buffer.from(check,"hex");if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return null;
return {id:query.id,name:[query.first_name,query.last_name||""].join(" ").trim().slice(0,100),username:(query.username||"").slice(0,100),picture:(query.photo_url||"").startsWith("https://")?query.photo_url.slice(0,500):null,exp:Date.now()+7*86400000}}
function register(app){
app.get("/api/auth/config",(_req,res)=>{res.set("Cache-Control","no-store");res.json({telegram:enabled,mode:"widget",botUsername:enabled?BOT_USERNAME:null})});
app.get("/api/auth/me",(req,res)=>{res.set("Cache-Control","no-store");const session=verify(cookies(req).viona_session);if(!session||typeof session.exp!=="number"||session.exp<Date.now())return res.json({user:null});res.json({user:{id:session.id,name:session.name,username:session.username,picture:session.picture||null}})});
app.get("/auth/telegram/widget",(req,res)=>{res.set("Cache-Control","no-store");const data=validateTelegram(req.query);if(!data)return res.redirect(303,"/?auth=failed");cookie(res,"viona_session",sign(data),7*86400);res.redirect(303,"/?auth=success")});
app.get("/auth/telegram/start",(_req,res)=>res.redirect(302,"/#contact"));
app.post("/api/auth/logout",(_req,res)=>{cookie(res,"viona_session","",0);res.json({ok:true})});
}
module.exports={register};
