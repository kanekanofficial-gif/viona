"use strict";
const crypto=require("node:crypto");
const path=require("node:path");
const GENRES=new Set(["witch-house","pop-punk","hard-rock","alternative-rock","zoomergaze","synth-pop","dream-pop","indie-rock","post-punk","shoegaze","electronic-rock"]);
const LIMIT=5000;
function trimmed(v,max){return typeof v==="string"?v.trim().slice(0,max):""}
function legitOrigin(req){try{return new URL(req.get("origin")).origin===new URL(process.env.PUBLIC_BASE_URL||"https://viona.space").origin}catch{return false}}
function registerViona2(app,db){
 const open=(route,file)=>app.get(route,(_req,res)=>res.sendFile(path.join(__dirname,"public","v2",file)));
 open("/KANEKANKANARTIST","artist.html");
 open("/music","music.html");
 open("/careers","careers.html");
 open("/support","support.html");
 open("/legal/terms","terms.html");
 open("/legal/privacy","privacy.html");
 open("/legal/delivery","delivery.html");
 for(const name of ["bots","web","code"])open("/"+name,"catalog.html");
 app.get("/api/v2/health",(_req,res)=>res.json({ok:true,storage:Boolean(db),music:true,careers:true}));
 app.post("/api/v2/music/request",async(req,res)=>{
  res.set("Cache-Control","no-store");
  if(!legitOrigin(req))return res.status(403).json({error:"Источник запроса не подтверждён."});
  if(!db)return res.status(503).json({error:"Приём заявок недоступен: база данных не подключена."});
  const v=req.body||{};
  const contact=trimmed(v.contact,200),title=trimmed(v.title,140),genre=trimmed(v.genre,48),voice=trimmed(v.voice,12),lyricsMode=trimmed(v.lyricsMode,16),brief=trimmed(v.brief,LIMIT);
  if(contact.length<3||title.length<2||brief.length<10||!GENRES.has(genre)||!["female","male"].includes(voice)||!["provided","commission"].includes(lyricsMode))
   return res.status(400).json({error:"Проверь контакт, название, жанр, голос и описание песни."});
  const id=crypto.randomUUID();
  try{
   await db.query(`INSERT INTO viona_music_requests(id,contact,title,genre,voice,lyrics_mode,lyrics_or_brief,mood,instrumentation,reference_note)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [id,contact,title,genre,voice,lyricsMode,brief,trimmed(v.mood,180),trimmed(v.instrumentation,600),trimmed(v.reference,600)]);
   res.status(201).json({id,status:"new",message:"Заявка на музыку сохранена. Стоимость и сроки согласовываются отдельно."});
  }catch(e){console.error("VIONA 2 music request:",e.message);res.status(503).json({error:"Заявка не сохранена. Попробуй ещё раз позднее."})}
 });
 app.post("/api/v2/careers/apply",async(req,res)=>{
  res.set("Cache-Control","no-store");
  if(!legitOrigin(req))return res.status(403).json({error:"Источник запроса не подтверждён."});
  if(!db)return res.status(503).json({error:"Форма откликов временно недоступна."});
  const v=req.body||{};
  const name=trimmed(v.name,100),contact=trimmed(v.contact,200),specialty=trimmed(v.specialty,80),skills=trimmed(v.skills,2000),portfolio=trimmed(v.portfolio,500),availability=trimmed(v.availability,200);
  if(name.length<2||contact.length<3||skills.length<10||availability.length<3||!["Разработка","Дизайн","Поддержка","Тестирование"].includes(specialty))
   return res.status(400).json({error:"Заполни специализацию, навыки, контакт и доступность."});
  const id=crypto.randomUUID();
  try{
   await db.query("INSERT INTO viona_career_applications(id,name,contact,specialty,skills,portfolio,availability) VALUES($1,$2,$3,$4,$5,$6,$7)",
    [id,name,contact,specialty,skills,portfolio,availability]);
   res.status(201).json({id,message:"Отклик сохранён. Это заявка на рассмотрение, а не обещание трудоустройства."});
  }catch(e){console.error("VIONA 2 career request:",e.message);res.status(503).json({error:"Отклик не сохранён."})}
 });
}
module.exports={registerViona2,GENRES,legitOrigin};
