"use strict";
const fs=require("node:fs");
const path=require("node:path");
async function initializeDatabase(pool){
 if(!pool){console.log("VIONA: DATABASE_URL missing; running without persistent storage");return false}
 const client=await pool.connect();
 try{
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock($1)",[160026]);
  await client.query(`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0, icon TEXT NOT NULL DEFAULT '◈', tag TEXT NOT NULL DEFAULT ''
  )`);
  await client.query(`CREATE TABLE IF NOT EXISTS requests (
    id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL DEFAULT '', contact TEXT NOT NULL DEFAULT '',
    details TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  const seed=[
  [1,"Telegram Bot Starter","Боты","Стартовый шаблон Telegram-бота на Node.js.",490,"⌘","Шаблон"],
  [2,"Portfolio UI Kit","Шаблоны","Тёмный UI-набор для личного портфолио.",290,"◈","Дизайн"],
  [3,"Discord Utility Bot","Боты","Основа Discord-бота с командами и настройками.",690,"✳","Node.js"],
  [4,"Game Mod Toolkit","Игры","Инструменты для разрешённых модификаций одиночных игр.",390,"⬡","Инструменты"],
  [5,"Landing Page Pack","Шаблоны","Набор адаптивных страниц для небольших проектов.",350,"▧","HTML/CSS"],
  [6,"Custom Development","Услуги","Опиши задачу и найди разработчика для своего проекта.",0,"↗","Заказ"],
  [7,"MAX Bot Starter","Боты","Стартовый шаблон чат-бота MAX. Концепт, не подключённый бот.",0,"✦","MAX / Шаблон"]
  ];
  for(const p of seed)await client.query("INSERT INTO products(id,title,category,description,price,icon,tag) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO NOTHING",p);
  await client.query("SELECT setval(pg_get_serial_sequence('products','id'),GREATEST((SELECT COALESCE(MAX(id),1) FROM products),1),true)");
  const sql=fs.readFileSync(path.join(__dirname,"migrations","016_viona_platform.sql"),"utf8");
  await client.query(sql);
  await client.query(fs.readFileSync(path.join(__dirname,"migrations","017_tbank_demo.sql"),"utf8"));
  await client.query(fs.readFileSync(path.join(__dirname,"migrations","018_tbank_methods.sql"),"utf8"));
  await client.query("COMMIT");
  console.log("VIONA: PostgreSQL schema ready");
  return true;
 }catch(err){
  await client.query("ROLLBACK").catch(()=>{});
  console.error("VIONA: database initialization failed:",err.message);
  return false;
 }finally{client.release()}
}
module.exports={initializeDatabase};
