"use strict";
const crypto=require("node:crypto");
const ISSUER="https://oauth.telegram.org";
const JWKS_URL=ISSUER+"/.well-known/jwks.json";
const CLIENT_ID=process.env.TELEGRAM_CLIENT_ID||"";
const CLIENT_SECRET=process.env.TELEGRAM_CLIENT_SECRET||"";
const SESSION_SECRET=process.env.SESSION_SECRET||"";
const BASE=(process.env.PUBLIC_BASE_URL||"https://viona.space").replace(/\/$/,"");
const configured=Boolean(CLIENT_ID&&CLIENT_SECRET&&SESSION_SECRET);
const callbackUrl=BASE+"/auth/telegram/callback";
const b64=v=>Buffer.from(v).toString("base64url");
const hmac=s=>crypto.createHmac("sha256",SESSION_SECRET).update(s).digest("base64url");
function sign(value){const data=b64(JSON.stringify(value));return data+"."+hmac(data)}
function verify(value){if(!configured||typeof value!=="string")return null;const [data,mac]=value.split(".");if(!data||!mac)return null;const expected=hmac(data);const a=Buffer.from(mac),b=Buffer.from(expected);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return null;try{return JSON.parse(Buffer.from(data,"base64url").toString("utf8"))}catch{return null}}
function cookies(req){return Object.fromEntries((req.headers.cookie||"").split(";").map(x=>{const i=x.indexOf("=");return i<0?["",""]:[x.slice(0,i).trim(),x.slice(i+1).trim()]}).filter(x=>x[0]))}
const secure=BASE.startsWith("https:")?"; Secure":"";
function setCookie(res,name,value,maxAge){res.append("Set-Cookie",name+"="+value+"; Path=/; HttpOnly; SameSite=Lax"+secure+"; Max-Age="+maxAge)}
function clearCookie(res,name){setCookie(res,name,"",0)}
const random=()=>crypto.randomBytes(32).toString("base64url");
function register(app){
app.get("/api/auth/config",(_req,res)=>res.json({telegram:configured}));
app.get("/api/auth/me",(req,res)=>{const user=verify(cookies(req).viona_session);if(!user||user.exp<Date.now())return res.json({user:null});res.set("Cache-Control","no-store");res.json({user:{id:user.id,name:user.name,username:user.username,picture:user.picture||null}})});
app.get("/auth/telegram/start",(_req,res)=>{if(!configured)return res.status(503).send("Telegram login is not configured.");const state=random(),verifier=random(),nonce=random();const challenge=crypto.createHash("sha256").update(verifier).digest("base64url");setCookie(res,"viona_oauth",sign({state,verifier,nonce,exp:Date.now()+10*60*1000}),600);const params=new URLSearchParams({client_id:CLIENT_ID,redirect_uri:callbackUrl,response_type:"code",scope:"openid profile",state,nonce,code_challenge:challenge,code_challenge_method:"S256"});res.redirect(302,ISSUER+"/auth?"+params)});
app.get("/auth/telegram/callback",async(req,res)=>{const flow=verify(cookies(req).viona_oauth);clearCookie(res,"viona_oauth");if(!configured||!flow||flow.exp<Date.now()||typeof req.query.state!=="string"||req.query.state!==flow.state||typeof req.query.code!=="string")return res.redirect(302,"/?auth=failed");try{
const response=await fetch(ISSUER+"/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","Authorization":"Basic "+Buffer.from(CLIENT_ID+":"+CLIENT_SECRET).toString("base64")},body:new URLSearchParams({grant_type:"authorization_code",code:req.query.code,redirect_uri:callbackUrl,code_verifier:flow.verifier}),signal:AbortSignal.timeout(10000)});
if(!response.ok)throw Error("token exchange failed");const token=await response.json();if(!token.id_token)throw Error("missing ID token");const parts=token.id_token.split(".");if(parts.length!==3)throw Error("invalid JWT");const header=JSON.parse(Buffer.from(parts[0],"base64url"));const claims=JSON.parse(Buffer.from(parts[1],"base64url"));if(header.alg!=="RS256"||typeof header.kid!=="string")throw Error("unsupported JWT algorithm");
const keysResponse=await fetch(JWKS_URL,{signal:AbortSignal.timeout(10000)});if(!keysResponse.ok)throw Error("JWKS unavailable");const jwks=await keysResponse.json();const jwk=jwks.keys.find(k=>k.kid===header.kid&&k.kty==="RSA");if(!jwk)throw Error("unknown signing key");const key=crypto.createPublicKey({key:jwk,format:"jwk"});if(!crypto.verify("RSA-SHA256",Buffer.from(parts[0]+"."+parts[1]),key,Buffer.from(parts[2],"base64url")))throw Error("bad signature");
const now=Math.floor(Date.now()/1000);if(claims.iss!==ISSUER||!(claims.aud===CLIENT_ID||(Array.isArray(claims.aud)&&claims.aud.includes(CLIENT_ID)))||!Number.isFinite(claims.exp)||claims.exp<=now||!Number.isFinite(claims.iat)||claims.iat>now+60||claims.nonce!==flow.nonce||!claims.sub)throw Error("invalid claims");
const user={id:String(claims.sub).slice(0,80),name:String(claims.name||claims.preferred_username||"Telegram user").slice(0,100),username:String(claims.preferred_username||"").slice(0,100),picture:typeof claims.picture==="string"&&claims.picture.startsWith("https://")?claims.picture.slice(0,500):null,exp:Date.now()+7*24*3600*1000};setCookie(res,"viona_session",sign(user),7*24*3600);res.redirect(302,"/?auth=success");
}catch(e){console.error("Telegram login:",e.message);res.redirect(302,"/?auth=failed")}});
app.post("/api/auth/logout",(_req,res)=>{clearCookie(res,"viona_session");res.json({ok:true})});
}
module.exports={register};
