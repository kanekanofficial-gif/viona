const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const app = express();
const {register:registerTelegramAuth}=require("./telegram-auth");
const {registerV16}=require("./v16-api");
const {initializeDatabase}=require("./db-init");
const {registerTestPayments}=require("./tbank-demo");
const {registerCodeEdit}=require("./code-edit-api");
const {registerAdminConsole}=require("./admin-console");
const {registerViona2}=require("./viona2-routes");
const PORT = process.env.PORT || 3000;
app.use(express.json({limit:"1mb"}));
/* Standalone branded SoundLab hostname. Requires DNS CNAME and Render custom-domain setup. */
app.use((req,res,next)=>{
 const landing={
  "soundlab.viona.space":"music.html",
  "bots.viona.space":"catalog.html",
  "web.viona.space":"catalog.html",
  "code.viona.space":"catalog.html"
 };
 if(landing[req.hostname]&&(req.path==="/"||req.path==="/index.html")){
  res.set({"Vary":"Host","Cache-Control":"public, max-age=300"});
  return res.sendFile(path.join(__dirname,"public","v2",landing[req.hostname]));
 }
 next();
});
app.use(express.static(path.join(__dirname,"public")));
registerTelegramAuth(app);
let pool = null;
if (process.env.DATABASE_URL) pool = new Pool({connectionString:process.env.DATABASE_URL, ssl:{rejectUnauthorized:false}});
const demo = [
{id:1,title:"Telegram Bot Starter",category:"Боты",description:"Стартовый шаблон Telegram-бота на Node.js.",price:490,icon:"⌘",tag:"Шаблон"},
{id:2,title:"Portfolio UI Kit",category:"Шаблоны",description:"Тёмный UI-набор для личного портфолио.",price:290,icon:"◈",tag:"Дизайн"},
{id:3,title:"Discord Utility Bot",category:"Боты",description:"Основа Discord-бота с командами и настройками.",price:690,icon:"✳",tag:"Node.js"},
{id:4,title:"Game Mod Toolkit",category:"Игры",description:"Инструменты для разрешённых модификаций одиночных игр.",price:390,icon:"⬡",tag:"Инструменты"},
{id:5,title:"Landing Page Pack",category:"Шаблоны",description:"Набор адаптивных страниц для небольших проектов.",price:350,icon:"▧",tag:"HTML/CSS"},
{id:6,title:"Custom Development",category:"Услуги",description:"Опиши задачу и найди разработчика для своего проекта.",price:0,icon:"↗",tag:"Заказ"},
{id:7,title:"MAX Bot Starter",category:"Боты",description:"Стартовый шаблон чат-бота для мессенджера MAX: обработка сообщений, команды и структура проекта. Концепт товара, не готовый подключённый бот.",price:0,icon:"✦",tag:"MAX / Шаблон"}
];
const start=async()=>{
const ready=await initializeDatabase(pool);
if(pool&&!ready){console.error("VIONA: database schema unavailable; persistent APIs disabled");await pool.end().catch(()=>{});pool=null}
const getCatalog=async()=>{if(pool){try{const r=await pool.query("SELECT id,title,category,description,price,icon,tag FROM products ORDER BY id");return r.rows.some(p=>String(p.title).toLowerCase().includes("max bot"))?r.rows:[...r.rows,demo[6]]}catch(e){console.error("Catalog fallback:",e.message)}}return demo};
registerV16(app,pool,getCatalog);
registerTestPayments(app,pool,getCatalog);
registerAdminConsole(app,pool,{bank:require("./tbank-demo").bank,configured:require("./tbank-demo").configured});
registerCodeEdit(app,pool);
registerViona2(app,pool);
app.get("/api/health",(_req,res)=>res.json({ok:true,app:"VIONA"}));
app.get("/api/products",async(_req,res)=>{
 if(pool){try{const r=await pool.query("SELECT id,title,category,description,price,icon,tag FROM products ORDER BY id");return res.json({products:r.rows.some(p=>String(p.title).toLowerCase().includes("max bot"))?r.rows:[...r.rows,demo[6]],source:"database"});}catch(e){console.error(e.message);}}
 res.json({products:demo,source:"demo"});
});
app.post("/api/request",async(req,res)=>{
 const {name="",contact="",details=""}=req.body||{};
 if(String(details).trim().length<10)return res.status(400).json({error:"Опиши задачу минимум в 10 символах."});
 if(pool){try{await pool.query("INSERT INTO requests(name,contact,details) VALUES($1,$2,$3)",[String(name).slice(0,100),String(contact).slice(0,200),String(details).slice(0,5000)]);return res.status(201).json({message:"Заявка сохранена."});}catch(e){console.error(e.message);return res.status(500).json({error:"Не удалось сохранить заявку."});}}
 res.status(202).json({message:"Демо-режим: заявка не сохранена. Подключи PostgreSQL."});
});
// Keep previously released account and order-detail experience available during the full site relaunch.
app.get("/classic",(_req,res)=>res.sendFile(path.join(__dirname,"public","classic.html")));
app.get("/payment/order/:id",(req,res,next)=>{
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id))return next();
 return res.sendFile(path.join(__dirname,"public","classic.html"));
});
app.get("/code-edit",(_req,res)=>res.sendFile(path.join(__dirname,"public","code-edit.html")));
app.get("/studio",(_req,res)=>res.sendFile(path.join(__dirname,"public","studio.html")));
app.get("/studio/:view", (req,res,next)=>{
 const allowed=new Set(["lab","builder","workspace","diff","bundles","boards","dashboard","editor","support"]);
 if(!allowed.has(req.params.view))return next();
 return res.sendFile(path.join(__dirname,"public","studio.html"));
});
app.get("/studio/:kind/:id", (req,res,next)=>{
 if(!["projects","boards","bots"].includes(req.params.kind)||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(req.params.id))return next();
 return res.sendFile(path.join(__dirname,"public","studio.html"));
});
app.get("*path",(_req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log("VIONA listening on "+PORT));
};
start().catch(err=>{console.error("VIONA startup failed:",err);process.exitCode=1});
