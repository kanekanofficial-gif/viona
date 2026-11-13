"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("public/index.html");
const css=read("public/viona-liquid-glass.css");
const app=read("public/v15.js");
const v16=read("public/v16.js");
const rich=read("public/rich-details.js");
const motion=read("public/viona-motion.js");
const icons=read("public/viona-icons.js");
const pay=read("public/payment-result.js");
const sw=read("public/sw.js");
const manifest=JSON.parse(read("public/manifest.webmanifest"));

test("homepage is a real Liquid Glass redesign and uses the supplied VIONA artwork",()=>{
 assert.match(html,/viona-liquid-glass\.css\?v=1/);
 assert.match(html,/viona-motion\.js\?v=1/);
 assert.match(html,/favicon\.svg\?v=1/);
 assert.match(html,/assets\/viona-mark\.webp\?v=1/);
 assert.match(html,/class="vg-glass-card"/);
 assert.match(html,/class="vg-mark-image"/);
 assert.match(css,/backdrop-filter:blur\(38px\) saturate\(195%\)/);
 assert.match(css,/@keyframes vg-refraction/);
 assert.match(css,/@keyframes vg-card-float/);
 assert.doesNotMatch(html,/halloween|pumpkin|ghost|bat|night market/i);
 assert.doesNotMatch(css,/--bg:#100b07|#100b07|#ff994c/i);
 assert.ok(fs.existsSync(path.join(root,"public/assets/viona-mark.webp")));
});

test("catalog, authentication, checkout, favorites, cart and profile hooks remain unique",()=>{
 const ids=["top","profileOpen","v16NotifyOpen","v16NotifyDot","language","langTrigger","langList","langLabel",
  "favOpen","cartOpen","favCount","cartCount","mobileFav","mobileCart","heroTitle","heroDesc","search","searchSuggestions",
  "sortTrigger","sortList","sortLabel","sortHolder","categories","products","resultCount","currencyNote","requestForm",
  "formStatus","v15Dialog","v15Content","v15Close","v15Overlay","overlay","panel","panelTitle","panelBody","panelBottom",
  "panelClose","tabFav","tabCart","toast","readingBar"];
 for(const id of ids){const re=new RegExp("\\bid=\""+id+"\"","g");assert.equal((html.match(re)||[]).length,1,id+" must exist exactly once")}
});

test("original user artwork, catalog icon logic and payment brands are preserved",()=>{
 const binary=fs.readFileSync(path.join(root,"public/assets/viona-user-logos.webp"));
 assert.ok(binary.length>4000);
 assert.equal(binary.toString("ascii",0,4),"RIFF");
 assert.equal(binary.toString("ascii",8,12),"WEBP");
 for(const brand of ["telegram","discord","max","game","card","sbp","sber","tbank"])assert.match(css,new RegExp("\\.viona-brand-"+brand+"\\b"));
 assert.match(icons,/const uploaded=\{1:"telegram",3:"discord",4:"game",7:"max"\}/);
 for(const brand of ["brand-mir","brand-sberpay","brand-max","brand-gamepad"]){
  const svg=read("public/assets/"+brand+".svg");
  assert.match(svg,/^<svg /);
  assert.match(svg,/viewBox=/);
  assert.ok(!svg.includes("<image"));
 }
 for(const path of ["/assets/brand-mir.svg?v=23","/assets/brand-sberpay.svg?v=23","/assets/brand-max.svg?v=23","/assets/brand-gamepad.svg?v=23"])assert.ok(css.includes(path));
 assert.match(css,/width:102px!important;height:102px!important/);
 assert.match(css,/width:105px!important;height:60px!important;flex:0 0 105px!important/);
 assert.match(css,/width:45px!important;height:34px!important/);
});

test("all visible static UI and product details have working five-language translations",()=>{
 for(const locale of ["ru","en","ja","de","femboy"])assert.match(app,new RegExp(locale+":\\{"));
 assert.match(app,/data-i-html/);
 assert.match(app,/data-i-placeholder/);
 assert.match(app,/data-i-aria/);
 assert.match(app,/for\(const el of \$\$\("\[data-i\]"\)\)/);
 assert.match(app,/viona-language-v18/);
 assert.match(app,/viona_language=/);
 assert.match(app,/Max-Age=31536000/);
 assert.match(v16,/document\.documentElement\.dataset\.world/);
 for(const locale of ["ja","de","femboy"])assert.match(v16,new RegExp(locale+":\\{"));
 assert.match(rich,/const detailsCopy=/);
 assert.match(rich,/localized\.heading/);
 assert.match(app,/data-product-id=/);
 assert.match(html,/data-i-aria="languageAria"/);
 assert.match(html,/data-i-placeholder="detailsPlaceholder"/);
});

test("glass animations are smooth, interactive and respect reduced-motion preferences",()=>{
 assert.match(motion,/IntersectionObserver/);
 assert.match(motion,/pointermove/);
 assert.match(motion,/prefers-reduced-motion/);
 assert.match(motion,/is-scrolled/);
 assert.doesNotMatch(motion,/scrollTo\(\{top:0/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/vg-motion-ready/);
 assert.match(css,/vg-pressed/);
});

test("the existing cart and payment flows remain wired to their TEST endpoints",()=>{
 for(const endpoint of ["/api/payments/test/init","/api/payments/test/qr","/api/payments/test/sberpay"])assert.ok(app.includes(endpoint));
 assert.ok(app.includes("rememberPendingPayment"));
 assert.ok(app.includes("vionaQrPanel"));
 assert.match(html,/id="cartOpen"[^>]*>[\s\S]*?<svg/);
 assert.match(html,/id="mobileCart"[^>]*><svg/);
 assert.match(pay,/assets\/viona-mark\.webp/);
});

test("favicon, PWA manifest and service worker all use the new brand shell",()=>{
 assert.match(read("public/favicon.svg"),/data:image\/webp;base64,/);
 assert.match(read("public/viona-icon.svg"),/data:image\/webp;base64,/);
 assert.equal(manifest.theme_color,"#07111e");
 assert.ok(manifest.icons.some(x=>x.src==="/favicon.svg"));
 assert.ok(manifest.icons.some(x=>x.src==="/assets/viona-mark.webp"));
 assert.match(sw,/viona-shell-v23-1/);
 for(const asset of ["/favicon.svg?v=1","/viona-liquid-glass.css?v=1","/viona-motion.js?v=1","/assets/viona-mark.webp?v=1","/v15.js?v=19","/v16.js?v=20"])assert.ok(sw.includes(asset),asset);
 assert.doesNotMatch(sw,/halloween|favicon\.png/);
});


test("every local stylesheet, script, favicon and image reference resolves",()=>{
 const refs=[
  ...[...html.matchAll(/(?:href|src)=["'](\/[^"'?#]+\.(?:css|js|svg|webp|png|webmanifest))(?:\?[^"']*)?["']/gi)].map(m=>m[1]),
  ...[...css.matchAll(/url\(['"]?(\/[^'")]+)['"]?\)/g)].map(m=>m[1].split("?")[0])
 ];
 for(const ref of new Set(refs)){
  const clean=ref.split("?")[0];
  assert.ok(fs.existsSync(path.join(root,"public",clean.replace(/^\/+/,""))),ref+" must exist");
 }
 for(const pathRef of ["/rich-details.css?v=1","/product-detail-layout.css?v=4","/telegram-login.css?v=2"])assert.ok(sw.includes(pathRef),pathRef+" must be precached");
});

test("HTML is properly nested and has no duplicate IDs",()=>{
 const voids=new Set(["meta","link","input","img","br","hr","source","area","base"]);
 const opened=[],errors=[];
 for(const m of html.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^<>]*)>/g)){
  const closing=Boolean(m[1]),tag=m[2].toLowerCase();
  if(voids.has(tag)||m[3].trim().endsWith("/"))continue;
  if(!closing)opened.push(tag);else if(opened.pop()!==tag)errors.push(tag);
 }
 assert.deepEqual(errors,[]);assert.deepEqual(opened,[]);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size);
});