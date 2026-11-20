"use strict";
const test=require("node:test");const assert=require("node:assert/strict");const fs=require("node:fs");const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const main=read("public/index.html"),classic=read("public/classic.html"),css=read("public/rebuild/liquid.css"),js=read("public/rebuild/app.js"),music=read("public/v2/music.html"),artist=read("public/v2/artist.html");
const routes=read("viona2-routes.js"),server=read("server.js"),bank=read("tbank-demo.js"),db=read("db-init.js");
test("VIONA is a structurally new storefront, not a recolored classic page",()=>{
 assert.match(main,/rebuild\/liquid\.css/);
 assert.match(main,/rebuild\/app\.js/);
 assert.match(main,/class="top-dock glass-surface"/);
 assert.match(main,/id="productGrid"/);
 assert.match(main,/id="checkoutForm"|id="modalScrim"/);
 assert.doesNotMatch(main,/nx-sidebar|nx-workspace|viona-reset\.css|v15\.js/);
 assert.match(classic,/nx-sidebar/);
 assert.match(server,/app\.get\("\/classic"/);
});
test("real multilayer glass and fluid drops with accessibility fallbacks",()=>{
 assert.match(css,/backdrop-filter:blur\(24px\) saturate\(175%\)/);
 assert.match(css,/inset -3px -3px/);
 assert.match(css,/\.water-drop:before/);
 assert.match(css,/@keyframes dropFall/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(main,/feDisplacementMap/);
});
test("new interactive catalog, cart, demo checkout and T-Pay hosted by bank",()=>{
 for(const keyword of ["productGrid","catalogSearch","catalogFilters","modalBody","cartBadge"])assert.ok(main.includes(keyword));
 for(const keyword of ["localStorage","/api/products","/api/auth/me","/api/payments/test/init","/api/payments/test/qr","/api/payments/test/sberpay"])assert.ok(js.includes(keyword),keyword);
 assert.match(js,/t-pay-full\.svg/);
 assert.match(js,/T-Pay uses the bank-hosted checkout/);
 assert.match(js,/trustedPaymentURL/);
 assert.match(js,/name="accept"/);
 assert.match(js,/paymentUrl/);
});
test("official user provided platform icons used throughout catalog and checkout",()=>{
 for(const filename of ["telegram.svg","discrod.svg","Max.svg","Mir.svg","visa.svg","mastercard.svg","sbp.svg","sberpay.svg","t-bank.svg","t-pay-full.svg","gamepad.svg"]){
  assert.match(read("public/assets/brand-icons/"+filename),/<svg/i,filename);
 }
 assert.match(read("public/rebuild/catalog.js"),/brand-icons/);
});
test("standalone domains remain defined but rely on external DNS/TLS activation",()=>{
 for(const [host,file] of [["soundlab.viona.space","music.html"],["bots.viona.space","catalog.html"],["web.viona.space","catalog.html"],["code.viona.space","catalog.html"]]){
  assert.ok(server.includes('"'+host+'":"'+file+'"'));
 }
 assert.match(routes,/open\("\/KANEKANKANARTIST","artist.html"\)/);
 assert.match(routes,/open\("\/music","music.html"\)/);
 assert.match(routes,/legitOrigin\(req\)/);
});
test("music brief is real, and biography includes the full non-graphic artist story",()=>{
 for(const name of ["witch-house","pop-punk","hard-rock","alternative-rock","zoomergaze"])assert.ok(music.includes(name));
 for(const name of ["opiumcore","mylancore"])assert.ok(!music.includes('value="'+name+'"'));
 assert.match(music,/name="voice" value="female"/);
 assert.match(music,/name="voice" value="male"/);
 assert.match(music,/name="lyricsMode" value="commission"/);
 assert.match(music,/согласуем до оплаты/);
 for(const v of ["KANEKAN","FL Studio","С семи лет","три операции","автомобильный эдитинг","ИИ-вокала","Witch House"]){
  assert.match(artist,new RegExp(v,"i"),v);
 }
 assert.doesNotMatch(artist,/история компании VIONA, а история самого артиста/);
 assert.match(read("public/v2/artist-v3.css"),/recordSpin/);
 assert.match(routes,/INSERT INTO viona_music_requests/);
});
test("recruitment, legal pages, private requests and payment troubleshooting preserved",()=>{
 for(const p of ["careers","support","terms","privacy","delivery","catalog"]){
  assert.ok(read("public/v2/"+p+".html").includes('<!doctype html>'),p);
 }
 assert.match(routes,/INSERT INTO viona_career_applications/);
 assert.match(routes,/if\(!legitOrigin\(req\)\)/);
 assert.match(read("migrations/022_viona2_requests.sql"),/viona_career_applications/);
 assert.match(db,/022_viona2_requests\.sql/);
 const admin=read("admin-console.js");
 assert.match(admin,/base\+"\/v2\/music",session/);
 assert.match(admin,/base\+"\/v2\/careers",session/);
 assert.match(bank,/code:reason,bankCode:/);
 assert.match(bank,/INIT_FAILED/);
 assert.match(bank,/PAYMENT_SERVICE_UNAVAILABLE/);
});
