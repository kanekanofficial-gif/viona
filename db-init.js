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
  const sql=fs.readFileSync(path.join(__dirname,"migrations","016_viona_platform.sql"),"utf8");
  await client.query(sql);
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
