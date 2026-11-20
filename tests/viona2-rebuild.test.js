"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=name=>fs.readFileSync(path.join(__dirname,"..",name),"utf8");
const main=read("public/index.html"),css=read("public/atelier/main.css"),polish=read("public/atelier/polish.css"),app=read("public/atelier/app.js");
const artist=read("public/v2/artist.html"),music=read("public/v2/music.html"),server=read("server.js"),routes=read("viona2-routes.js");
test("independent VIONA site, with the legacy customer account preserved",()=>{
 assert.match(main,/class="glass site-nav"/);
 assert.match(main,/atelier\/main\.css/);assert.match(main,/atelier\/app\.js/);assert.match(main,/id="productList"/);
 assert.doesNotMatch(main,/nx-sidebar|v15\.js|viona2-home\.css/);
 assert.match(read("public/classic.html"),/nx-sidebar/);
 assert.match(server,/app\.get\("\/classic"/);
});
test("layered glass and motion exist, with oversized water drops removed",()=>{
 assert.match(css,/backdrop-filter:blur\(24px\) saturate\(180%\)/);
 assert.match(css,/inset -2px -3px/);
 assert.doesNotMatch(css,/\.liquid-drop/);
 assert.doesNotMatch(main,/class="liquid-drop"/);
 assert.match(polish,/overlay\.is-open/);
 assert.match(polish,/hero-composition/);
 assert.match(polish,/prefers-reduced-motion/);
 assert.match(main,/feDisplacementMap/);
});
test("new working catalog, account and T-Bank checkout keep their server endpoints",()=>{
 for(const id of ["productList","productFilters","searchProducts","cartCount","dialogContent","openAccount"])assert.ok(main.includes(id),id);
 for(const route of ["/api/products","/api/auth/me","/api/payments/test/init","/api/payments/test/qr","/api/payments/test/sberpay","/api/payments/test/my-orders"])assert.ok(app.includes(route),route);
 assert.match(app,/T-Pay is exposed by the bank-hosted card payment form/);
 assert.match(app,/trustedUrl/);
 assert.match(app,/name="agreed"/);
});
test("original icon assets, VISA and Mir together, rounded bank logos",()=>{
 for(const asset of ["telegram.svg","discrod.svg","Max.svg","gamepad.svg","Mir.svg","visa.svg","mastercard.svg","sbp.svg","sberpay.svg","t-pay-full.svg","t-bank.svg"])assert.match(read("public/assets/brand-icons/"+asset),/<svg/i,asset);
 assert.match(app,/Mir\.svg/);assert.match(app,/visa\.svg/);
 assert.match(polish,/payment-logo/);assert.match(polish,/border-radius:10px/);
 assert.doesNotMatch(read("public/atelier/catalog.js"),/liquid-drop/);
});
test("any music genre except opiumcore, mylancore and funk, with server-side validation",()=>{
 assert.match(music,/name="genre" list="musicGenres"/);
 assert.match(music,/id="v2MusicForm"/);
 assert.match(music,/name="voice" value="female"/);assert.match(music,/name="voice" value="male"/);
 assert.match(music,/name="lyricsMode" value="commission"/);
 const {validMusicGenre}=require("../viona2-routes");
 for(const genre of ["Witch House","Hyperpop","math rock","J-Rock","ドリームポップ","alternative jazz","Ambient / Drone"])assert.equal(validMusicGenre(genre),true,genre);
 for(const genre of ["funk","Brazilian Funk","opiumcore","mylancore","funk rock","Фанк","Mylancore"])assert.equal(validMusicGenre(genre),false,genre);
 assert.match(read("public/atelier/forms.js"),/api\/v2\/music\/request/);
 assert.match(routes,/INSERT INTO viona_music_requests/);
});
test("music is visible as a catalog category and product descriptions are informative",()=>{
 assert.match(main,/data-filter="Музыка"/);
 assert.match(main,/product-details\.js/);
 assert.match(app,/musicCard/);assert.match(app,/profile-data/);
 const descriptions=read("public/atelier/product-details.js");
 for(const field of ["what","how","included","who","notes"])assert.ok(descriptions.includes(field),field);
 assert.match(descriptions,/Custom music track|Commission an original music track/);
});
test("five modes: RU, EN, Japanese, German and pink, shared between pages",()=>{
 const src=read("public/atelier/language.js");
 for(const locale of ["ru","en","ja","de","pink"])assert.ok(src.includes(locale),locale);
 assert.match(src,/viona-language-v1/);
 assert.match(read("public/atelier/language.css"),/data-style=pink/);
 for(const page of ["public/index.html","public/v2/music.html","public/v2/artist.html","public/v2/catalog.html","public/v2/careers.html"])assert.match(read(page),/atelier\/language\.js/,page);
});
test("artist profile links to the six provided official channels",()=>{
 for(const link of ["music.yandex.ru/artist/25929088","www.youtube.com/@KANEKANKAN","music.mts.ru/artist/25929088","zvuk.com/artist/214207860","www.tiktok.com/@kanekan.official.2","t.me/kanekankan_artist"])assert.ok(artist.includes(link),link);
 assert.equal((artist.match(/class="bio-chapter"/g)||[]).length,6);
});
test("private admin, careers and special host routes remain unchanged",()=>{
 for(const p of ["careers","support","terms","privacy","delivery","catalog"])assert.match(read("public/v2/"+p+".html"),/<!doctype html>/i,p);
 assert.match(read("public/v2/careers.html"),/id="v2CareersForm"/);
 assert.match(routes,/INSERT INTO viona_career_applications/);
 for(const host of ["soundlab.viona.space","bots.viona.space","web.viona.space","code.viona.space"])assert.ok(server.includes('"'+host+'":'),host);
 assert.match(server,/app\.get\("\/payment\/order\/:id"/);
 assert.match(read("tbank-demo.js"),/INIT_FAILED/);
});
