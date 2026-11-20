"use strict";
const test=require("node:test");const assert=require("node:assert/strict");const fs=require("node:fs");const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const routes=read("viona2-routes.js"),server=read("server.js"),bank=read("tbank-demo.js"),db=read("db-init.js");
const main=read("public/index.html"),styles=read("public/viona2-home.css"),music=read("public/v2/music.html"),artist=read("public/v2/artist.html");
test("homepage uses a distinct VIONA 2.0 visual system and new service divisions",()=>{
 assert.match(main,/viona2-home\.css/);assert.match(main,/viona2-main\.js/);
 assert.match(main,/soundlab\.viona\.space/);assert.match(main,/v2-home-grid/);
 assert.match(styles,/\.nx-sidebar \.nx-sidebar-nav/);
 assert.match(styles,/position:sticky!important/);
 assert.match(styles,/\.v2-catalog-art/);
});
test("all professional domains have real independent pages, and SoundLab origin is allowed",()=>{
 for(const [host,file] of [["soundlab.viona.space","music.html"],["bots.viona.space","catalog.html"],["web.viona.space","catalog.html"],["code.viona.space","catalog.html"]]){
  assert.ok(server.includes('"'+host+'":"'+file+'"'));
 }
 assert.match(routes,/open\("\/KANEKANKANARTIST","artist.html"\)/);
 assert.match(routes,/open\("\/music","music.html"\)/);
 assert.match(routes,/legitOrigin\(req\)/);
 assert.match(routes,/soundlab\.viona\.space/);
});
test("SoundLab requests have safe genre/voice selection and a paid human lyric-writing option",()=>{
 for(const name of ["witch-house","pop-punk","hard-rock","alternative-rock","zoomergaze"])assert.ok(music.includes(name));
 for(const deny of ["opiumcore","mylancore"])assert.ok(!music.includes('value="'+deny+'"'));
 assert.match(music,/name="voice" value="female"/);
 assert.match(music,/name="voice" value="male"/);
 assert.match(music,/name="lyricsMode" value="commission"/);
 assert.match(music,/согласовываются до оплаты/);
 assert.match(routes,/INSERT INTO viona_music_requests/);
 assert.match(read("migrations/022_viona2_requests.sql"),/CREATE TABLE IF NOT EXISTS viona_music_requests/);
});
test("personal artist page separates identity from shop and keeps private sensitive details limited",()=>{
 assert.match(artist,/KANEKAN/);
 assert.match(artist,/FL Studio/);
 assert.match(artist,/С семи лет/);
 assert.match(artist,/Witch House/i);
 assert.match(artist,/2026/);
 assert.match(artist,/Личные и медицинские подробности намеренно сокращены/);
});
test("careers and legal sections are real standalone pages and requests require valid origin",()=>{
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
});
test("test payments distinguish bank Init rejection from network failures without false confirmation",()=>{
 assert.match(bank,/code:reason,bankCode:/);
 assert.match(bank,/INIT_FAILED/);
 assert.match(bank,/PAYMENT_SERVICE_UNAVAILABLE/);
 assert.match(main,/\/legal\/privacy/);
 assert.match(read("public/v15.js"),/v2CheckoutTerms/);
});
test("all catalog items have unique scalable illustrations and payment symbols",()=>{
 for(const name of ["telegram","portfolio","discord","game","landing","code","max"])assert.ok(read("public/assets/catalog-"+name+".svg").includes("<svg"),name);
 for(const p of ["brand-sbp.svg","bank-card-v2.svg"])assert.ok(read("public/assets/"+p).includes("<svg"));
});
