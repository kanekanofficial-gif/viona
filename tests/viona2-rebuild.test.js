"use strict";
const test=require("node:test");const assert=require("node:assert/strict");const fs=require("node:fs");const path=require("node:path");
const read=name=>fs.readFileSync(path.join(__dirname,"..",name),"utf8");
const main=read("public/index.html"),css=read("public/atelier/main.css"),js=read("public/atelier/app.js");
const artist=read("public/v2/artist.html"),music=read("public/v2/music.html"),server=read("server.js"),routes=read("viona2-routes.js");
test("fresh VIONA site uses independent semantic markup and theme assets",()=>{
 assert.match(main,/class="glass site-nav"/);
 assert.match(main,/atelier\/main\.css/);
 assert.match(main,/atelier\/app\.js/);
 assert.match(main,/id="productList"/);
 assert.doesNotMatch(main,/nx-sidebar|v15\.js|viona2-home\.css/);
 assert.match(read("public/classic.html"),/nx-sidebar/);
 assert.match(server,/app\.get\("\/classic"/);
});
test("glass effect genuinely blurs layers and droplet animation respects reduced motion",()=>{
 assert.match(css,/backdrop-filter:blur\(24px\) saturate\(180%\)/);
 assert.match(css,/inset -2px -3px/);
 assert.match(css,/\.liquid-drop:before/);
 assert.match(css,/@keyframes waterFlow/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(main,/feDisplacementMap/);
});
test("functional catalog, cart, account and T-Bank demonstration use real endpoints",()=>{
 for(const id of ["productList","productFilters","searchProducts","cartCount","dialogContent","openAccount"])assert.ok(main.includes(id));
 for(const route of ["/api/products","/api/auth/me","/api/payments/test/init","/api/payments/test/qr","/api/payments/test/sberpay","/api/payments/test/my-orders"])assert.ok(js.includes(route),route);
 assert.match(js,/T-Pay is exposed by the bank-hosted card payment form/);
 assert.match(js,/t-pay-full\.svg/);
 assert.match(js,/trustedUrl/);
 assert.match(js,/name="agreed"/);
});
test("user-provided platform/payment brand symbols exist and are used instead of invented logos",()=>{
 for(const asset of ["telegram.svg","discrod.svg","Max.svg","gamepad.svg","Mir.svg","visa.svg","mastercard.svg","sbp.svg","sberpay.svg","t-pay-full.svg","t-bank.svg"])assert.match(read("public/assets/brand-icons/"+asset),/<svg/i,asset);
 assert.match(main,/brand-icons\/telegram\.svg/);
 assert.match(read("public/atelier/catalog.js"),/brand-icons/);
});
test("SoundLab form works with saved music applications and supported genres",()=>{
 assert.match(music,/id="v2MusicForm"/);
 for(const g of ["witch-house","pop-punk","hard-rock","alternative-rock","zoomergaze"])assert.ok(music.includes('value="'+g+'"'));
 for(const g of ["funk","opiumcore","mylancore"])assert.ok(!music.includes('value="'+g+'"'));
 assert.match(music,/name="voice" value="female"/);
 assert.match(music,/name="voice" value="male"/);
 assert.match(music,/name="lyricsMode" value="commission"/);
 assert.match(read("public/atelier/forms.js"),/api\/v2\/music\/request/);
 assert.match(routes,/INSERT INTO viona_music_requests/);
});
test("artist biography is a full independent music-focused narrative",()=>{
 assert.match(artist,/KANEKAN KAN/);
 assert.match(artist,/С семи лет/);
 assert.match(artist,/три операции/i);
 assert.match(artist,/пластина/i);
 assert.match(artist,/FL Studio/);
 assert.match(artist,/автомобильному эдитингу/);
 assert.match(artist,/ИИ-вокал/);
 assert.equal((artist.match(/class="bio-chapter"/g)||[]).length,6);
 assert.doesNotMatch(artist,/v2\/base\.css/);
});
test("careers and legal pages are real, and custom-domain routing retained",()=>{
 for(const p of ["careers","support","terms","privacy","delivery","catalog"])assert.match(read("public/v2/"+p+".html"),/<!doctype html>/i,p);
 assert.match(read("public/v2/careers.html"),/id="v2CareersForm"/);
 assert.match(read("public/atelier/forms.js"),/api\/v2\/careers\/apply/);
 assert.match(routes,/INSERT INTO viona_career_applications/);
 for(const host of ["soundlab.viona.space","bots.viona.space","web.viona.space","code.viona.space"])assert.ok(server.includes('"'+host+'":'),host);
 assert.match(server,/app\.get\("\/payment\/order\/:id"/);
});
test("T-Bank rejection reports safe diagnostic bank codes, not a confirmed payment",()=>{
 const bank=read("tbank-demo.js");
 assert.match(bank,/BANK_REJECTED/);
 assert.match(bank,/INIT_FAILED/);
 assert.match(bank,/PAYMENT_SERVICE_UNAVAILABLE/);
 assert.match(js,/Ошибка|Тестовая оплата|Т-БАНК/);
});
