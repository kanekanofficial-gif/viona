"use strict";
const crypto=require("node:crypto");
/* Request a paid review/alteration of code; no code is executed or exposed publicly. */
function registerCodeEdit(app,pool){
 const recent=new Map();
 app.post("/api/code-edit",async(req,res)=>{
  res.set("Cache-Control","no-store");
  const allowedOrigin=(process.env.PUBLIC_BASE_URL||"https://viona.space").replace(/\/$/,"");
  if(req.get("origin")!==allowedOrigin && process.env.NODE_ENV!=="test")return res.status(403).json({error:"origin_invalid"});
  const input=req.body&&typeof req.body==="object"&&!Array.isArray(req.body)?req.body:{};
  const field=(name,max)=>typeof input[name]==="string"?input[name].trim().slice(0,max+1):"";
  const project=field("project",120),name=field("name",100),contact=field("contact",200),
   language=field("language",48),source=field("source",30000),changes=field("changes",5000);
  if(!project||project.length>120||!name||name.length>100||!contact||contact.length>200 ||
    !language||language.length>48||source.length<5||source.length>30000 ||
    changes.length<15||changes.length>5000){
   return res.status(400).json({error:"invalid_fields"});
  }
  if(!/^[\w.+@:/\s-]{3,200}$/u.test(contact))return res.status(400).json({error:"invalid_contact"});
  if(!pool)return res.status(503).json({error:"storage_unavailable"});
  const now=Date.now(),key=req.ip||"anonymous";
  for(const [k,v] of recent)if(v.until<now)recent.delete(k);
  const rate=recent.get(key)||{count:0,until:now+600000};
  if(rate.count>=8)return res.status(429).json({error:"rate_limited"});
  rate.count++;recent.set(key,rate);
  const id=crypto.randomUUID();
  try{
   await pool.query(
    "INSERT INTO code_edit_requests(id,project_name,client_name,contact,technology,source_code,requested_changes,status) VALUES($1,$2,$3,$4,$5,$6,$7,'new')",
    [id,project,name,contact,language,source,changes]
   );
   return res.status(201).json({id,message:"request_received",paymentRequired:false});
  }catch(err){
   console.error("VIONA code-edit: storage error",err.code||"database");
   return res.status(503).json({error:"storage_unavailable"});
  }
 });
}
module.exports={registerCodeEdit};