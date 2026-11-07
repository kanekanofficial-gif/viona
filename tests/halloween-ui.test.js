"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("public/index.html");
const css=read("public/viona-halloween.css");
const neo=read("public/viona-neo.css");
const neoJs=read("public/viona-neo.js");
const sw=read("public/sw.js");
const manifest=JSON.parse(read("public/manifest.webmanifest"));
const app=read("public/v15.js");
const motion=neoJs;
const icons=read("public/viona-icons.js");
const checkout=read("public/viona-checkout.css");
const pay=read("public/payment-result.js");

test("VIONA NEO replaces Halloween visuals with the graphite liquid-glass identity",()=>{
 assert.match(html,/neo-hero-art/);
 assert.match(html,/neo-glass-panel v18-hero-screen/);
 assert.match(html,/neo-chip-python/);
 assert.match(html,/neo-chip-csharp/);
 assert.match(html,/viona-mark\.webp\?v=22/);
 assert.match(html,/viona-neo\.css\?v=22/);
 assert.match(html,/VIONA — Digital Market/);
 assert.match(html,/DIGITAL MARKET · EST\. 2026/);
 assert.doesNotMatch(html,/Halloween Night Market|HALLOWEEN EDITION|DIGITAL AFTER DARK|NIGHT MARKET|MIDNIGHT SELECTION|NIGHT DROPS|v18-moon|v18-bat|v18-pumpkin/i);
 assert.match(neo,/--neo-cyan|#58d7f2/);
 assert.doesNotMatch(neo,/purple|violet|lavender|magenta/i);
 assert.match(neo,/backdrop-filter:blur\(28px\) saturate\(160%\)/);
 assert.match(neoJs,/ЦИФРОВАЯ КОЛЛЕКЦИЯ/);
});

test("all hooks needed by catalog, auth, checkout, favorites, cart and profile remain unique",()=>{
 const ids=[
  "top","profileOpen","v16NotifyOpen","v16NotifyDot","language","langTrigger","langList","langLabel",
  "favOpen","cartOpen","favCount","cartCount","mobileFav","mobileCart",
  "heroTitle","heroDesc","search","searchSuggestions","sortTrigger","sortList","sortLabel","sortHolder",
  "categories","products","resultCount","currencyNote","requestForm","formStatus","v15Dialog",
  "v15Content","v15Close","v15Overlay","overlay","panel","panelTitle","panelBody","panelBottom",
  "panelClose","tabFav","tabCart","toast","readingBar"
 ];
 for(const id of ids){
  const re=new RegExp('\\bid="'+id+'"','g');
  assert.equal((html.match(re)||[]).length,1,id+" must exist exactly once");
 }
});

test("all user-provided catalog and payment brand artwork is connected to actual UI",()=>{
 const binary=fs.readFileSync(path.join(root,"public","assets","viona-user-logos.webp"));
 assert.ok(binary.length>4000);
 assert.equal(binary.toString("ascii",0,4),"RIFF");
 assert.equal(binary.toString("ascii",8,12),"WEBP");
 for(const brand of ["telegram","discord","max","game","card","sbp","sber","tbank"]){
  assert.match(css,new RegExp("\\.viona-brand-"+brand+"\\b"));
 }
 assert.match(icons,/const uploaded=\{1:"telegram",3:"discord",4:"game",7:"max"\}/);
 for(const brand of ["card","sbp","sber","tbank"]){
  assert.ok(app.includes("viona-brand-"+brand),"checkout must show "+brand);
 }
});

test("cart has a real SVG bag on desktop and mobile instead of broken unicode placeholder",()=>{
 const bag=(html.match(/v18-bag-icon/g)||[]).length;
 assert.equal(bag,1);
 assert.match(html,/id="cartOpen"[^>]*>[\s\S]*?<svg[^>]+v18-bag-icon/);
 assert.match(html,/id="mobileCart"[^>]*><svg/);
 assert.match(html,/M5 8h14l-1 12H6L5 8Z/);
});

test("language survives reload and redesign, including a fallback cookie",()=>{
 assert.match(app,/viona-language-v18/);
 assert.match(app,/viona_language=/);
 assert.match(app,/Max-Age=31536000/);
 assert.doesNotMatch(app,/localStorage\.removeItem\("viona-world"\)/);
 assert.match(app,/lang=preferredLanguage\(\)/);
});

test("home visits always start at top without disturbing payment results",()=>{
 assert.match(motion,/path!=="\/"&&path!=="\/index.html"/);
 assert.match(motion,/scrollRestoration="manual"/);
 assert.match(motion,/addEventListener\("pageshow"/);
 assert.match(motion,/scrollTo\(\{top:0,left:0,behavior:"instant"\}\)/);
 assert.match(pay,/\/payment\/success/);
});

test("four distinct fonts, reduced motion, animated overlays and glass button close states",()=>{
 for(const name of ["Manrope","Unbounded","Cormorant Garamond","IBM Plex Mono"])
  assert.ok(css.includes(name),name);
 assert.match(css,/backdrop-filter:blur\(30px\) saturate\(170%\)/);
 assert.match(css,/\.v15-close:before,\.panel-close:before,\.v16-close:before/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/@keyframes v18-screen-drift/);
 assert.match(css,/@keyframes v18-reveal/);
});

test("checkout stays wired to original TEST-only payment endpoints",()=>{
 for(const endpoint of ["/api/payments/test/init","/api/payments/test/qr","/api/payments/test/sberpay"])
  assert.ok(app.includes(endpoint));
 assert.ok(app.includes("rememberPendingPayment"));
 assert.ok(app.includes("vionaQrPanel"));
});


test("the uploaded VIONA emblem has separate website and favicon assets",()=>{
 const logo=fs.readFileSync(path.join(root,"public/assets/viona-mark.webp"));
 const favicon=fs.readFileSync(path.join(root,"public/favicon.png"));
 assert.equal(logo.toString("ascii",0,4),"RIFF");
 assert.equal(logo.toString("ascii",8,12),"WEBP");
 assert.equal(favicon.toString("ascii",1,4),"PNG");
 assert.equal(favicon.readUInt32BE(16),32);
 assert.equal(favicon.readUInt32BE(20),32);
 assert.match(html,/rel="icon" type="image\/svg\+xml"/);
 assert.match(html,/favicon\.png\?v=22/);
 assert.match(manifest.name,/VIONA — Digital Market/);
 assert.ok(manifest.icons.some(icon=>icon.src==="/assets/viona-mark.webp?v=22"));
 assert.ok(manifest.icons.some(icon=>icon.src==="/favicon.png?v=22"));
 assert.ok(sw.includes("/assets/viona-mark.webp?v=22"));
 assert.ok(sw.includes("/favicon.png?v=22"));
});

test("HTML is properly nested and has no duplicated IDs",()=>{
 const voids=new Set(["meta","link","input","img","br","hr","source","area","base"]);
 const opened=[],errors=[];
 for(const m of html.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^<>]*)>/g)){
  const closing=Boolean(m[1]),tag=m[2].toLowerCase();
  if(voids.has(tag)||m[3].trim().endsWith("/"))continue;
  if(!closing)opened.push(tag);
  else if(opened.pop()!==tag)errors.push(tag);
 }
 assert.deepEqual(errors,[]);
 assert.deepEqual(opened,[]);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size);
});
