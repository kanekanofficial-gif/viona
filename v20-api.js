"use strict";
const crypto=require("node:crypto");
// Two independently managed inquiry pipelines. A request never implies payment or automatic generation.
const GENRES=Object.freeze(["Witch house","Pop-punk","Hard rock","Alternative rock","Zoomergaze","Dream pop","Synth-pop","Indie rock","Shoegaze","Post-punk"]);
const VOICES=Object.freeze(["female","male"]);
const STAFF_ROLES=Object.freeze(["frontend","backend","fullstack","design","support","qa"]);
const trim=(v,max)=>typeof v==="string"?v.trim().slice(0,max):"";
const forbidden=/(?:^|[\s/-])(funk|opiumcore|mylancore)(?:$|[\s/-])/i;
function normalizeMusic(raw){
 const x=raw&&typeof raw==="object"?raw:{};
 const item={
  clientName:trim(x.clientName,100),contact:trim(x.contact,200),trackTitle:trim(x.trackTitle,120),
  genre:trim(x.genre,40),voice:trim(x.voice,10),textMode:trim(x.textMode,12),
  lyricsOrIdea:trim(x.lyricsOrIdea,6000),mood:trim(x.mood,300),
  instruments:trim(x.instruments,500),extraNotes:trim(x.extraNotes,1000)
 };
 if(item.clientName.length<2||item.contact.length<3||item.trackTitle.length<2)
  throw Error("Укажи имя, контакт и название композиции.");
 if(!GENRES.includes(item.genre)||forbidden.test(item.genre))throw Error("Этот музыкальный жанр пока недоступен.");
 if(!VOICES.includes(item.voice))throw Error("Выбери женский или мужской вокал.");
 if(!["own","artist"].includes(item.textMode)||item.lyricsOrIdea.length<10)
  throw Error("Укажи текст песни или идею минимум в 10 символов.");
 return item;
}
function normalizeStaff(raw){
 const x=raw&&typeof raw==="object"?raw:{};
 const item={
  displayName:trim(x.displayName,100),contact:trim(x.contact,200),role:trim(x.role,32),
  skills:trim(x.skills,2500),portfolio:trim(x.portfolio,500),availability:trim(x.availability,180),
  note:trim(x.note,1000)
 };
 if(item.displayName.length<2||item.contact.length<3||!STAFF_ROLES.includes(item.role)||
  item.skills.length<15||item.availability.length<4)throw Error("Заполни контакт, специальность, навыки и доступное время.");
 if(item.portfolio&&!/^https:\/\/[^\s<>"']{3,450}$/i.test(item.portfolio))
  throw Error("Ссылка на портфолио должна начинаться с https://.");
 return item;
}
function registerV20(app,pool){
 const allowedOrigins=new Set(["https://viona.space","https://soundlab.viona.space"]);
 const base=process.env.PUBLIC_BASE_URL;
 if(base)allowedOrigins.add(base.replace(/\/$/,""));
 // Allow developer/CI local preview, never trust user-submitted return URLs.
 const originOk=req=>allowedOrigins.has(req.get("origin"))||(/^localhost$|^127\.0\.0\.1$/.test(req.hostname)&&/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(req.get("origin")||""));
 const write=(table,fields,map)=>async(req,res)=>{
  res.set("Cache-Control","no-store");
  if(!pool)return res.status(503).json({error:"Сервис заявок временно недоступен — данные не были сохранены."});
  if(!originOk(req))return res.status(403).json({error:"Недопустимый источник запроса."});
  if(!req.is("application/json"))return res.status(415).json({error:"Ожидаются данные формы."});
  let data;try{data=map(req.body)}catch(e){return res.status(400).json({error:e.message})}
  const id=crypto.randomUUID();
  try{
   const columns=fields.map(x=>x.column);
   const params=fields.map(x=>data[x.key]);
   await pool.query(
    "INSERT INTO "+table+" (id,"+columns.join(",")+") VALUES($1,"+fields.map((_,i)=>"$"+(i+2)).join(",")+")",
    [id,...params]
   );
   return res.status(201).json({ok:true,id,queued:true,paid:false,message:"Заявка сохранена и ожидает проверки команды VIONA."});
  }catch(e){console.error("VIONA v20 request persistence failed:",e.message);return res.status(503).json({error:"Не удалось сохранить заявку. Попробуй позже."})}
 };
 app.post("/api/v20/music",write("viona_music_requests",[
  ["client_name","clientName"],["contact","contact"],["track_title","trackTitle"],
  ["genre","genre"],["voice","voice"],["text_mode","textMode"],
  ["lyrics_or_idea","lyricsOrIdea"],["mood","mood"],["instruments","instruments"],["extra_notes","extraNotes"]
 ].map(([column,key])=>({column,key})),normalizeMusic));
 app.post("/api/v20/careers",write("viona_staff_applications",[
  ["display_name","displayName"],["contact","contact"],["role","role"],
  ["skills","skills"],["portfolio","portfolio"],["availability","availability"],["note","note"]
 ].map(([column,key])=>({column,key})),normalizeStaff));
 app.get("/api/v20/genres",(_req,res)=>res.set("Cache-Control","public, max-age=3600").json({genres:GENRES,voices:VOICES,blocked:["funk","opiumcore","mylancore"]}));
}
module.exports={registerV20,normalizeMusic,normalizeStaff,GENRES,STAFF_ROLES};
