"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const base=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(base,file),"utf8");
const html=read("public/index.html");
const css=read("public/viona-reset.css");
const js=read("public/v15.js");
const motion=read("public/viona-reset-motion.js");
const sw=read("public/sw.js");
const manifest=JSON.parse(read("public/manifest.webmanifest"));

test("VIONA has a distinct complete storefront design, not the old overlapping hero",()=>{
 for(const part of ["nx-sidebar","nx-topbar","nx-hero-copy","nx-hero-screen","nx-screen-main","nx-metrics","nx-discovery","nx-step-icon","nx-contact-decoration"])
  assert.ok(html.includes(part),part);
 assert.match(html,/href="\/viona-reset\.css\?v=1"/);
 assert.match(html,/src="\/viona-reset-motion\.js\?v=1"/);
 assert.doesNotMatch(html,/vg-glass-card|vg-float-chip|vg-chip-top|vg-chip-bottom|viona-liquid-glass\.css|viona-motion\.js|halloween|ghost|pumpkin/i);
 assert.match(css,/grid-template-columns:minmax\(0,1\.03fr\) minmax\(0,.97fr\)/);
 assert.match(css,/position:fixed!important;inset:0 auto 0 0!important/);
 assert.match(css,/\.nx-hero-screen/);
 assert.match(css,/\.nx-workspace/);
});

test("every required JS and payment hook remains present exactly once",()=>{
 const hooks=["readingBar","top","home","heroTitle","heroDesc","v16NotifyOpen","v16NotifyDot","profileOpen",
 "language","langTrigger","langLabel","langList","favOpen","favCount","cartOpen","cartCount","search",
 "searchSuggestions","sortHolder","sortTrigger","sortLabel","sortList","categories","products","resultCount",
 "currencyNote","requestForm","formStatus","mobileFav","mobileCart","overlay","v15Overlay","v15Dialog",
 "v15Close","v15Content","panel","panelTitle","panelClose","tabFav","tabCart","panelBody","panelBottom","toast"];
 for(const id of hooks){
  const hits=[...html.matchAll(new RegExp('\\bid="'+id+'"',"g"))];
  assert.equal(hits.length,1,id+" should exist exactly once");
 }
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"duplicate DOM ids");
});

test("search, category, sorting and five languages have working JavaScript",()=>{
 assert.doesNotMatch(js,/\$\$\$\(/);
 assert.match(js,/\$\$\("\[data-category\]"\)/);
 assert.match(js,/\$\$\("\[data-sort\]"\)/);
 assert.match(js,/function localize\(\)/);
 assert.match(js,/data-i-placeholder/);
 assert.match(js,/data-i-aria/);
 for(const locale of ["ru","en","ja","de","femboy"])assert.match(js,new RegExp(locale+":\\{"));
 assert.match(js,/viona-language-v18/);
 assert.match(html,/data-lang="ru"/);
 assert.match(html,/data-lang="en"/);
 assert.match(html,/data-lang="ja"/);
 assert.match(html,/data-lang="de"/);
 assert.match(html,/data-lang="femboy"/);
});

test("payment/checkout still goes to exact test endpoints with explicit verification",()=>{
 for(const endpoint of ["/api/payments/test/init","/api/payments/test/qr","/api/payments/test/sberpay"])
  assert.ok(js.includes(endpoint),endpoint);
 assert.match(js,/rememberPendingPayment/);
 assert.match(js,/vionaQrPanel/);
 assert.ok(fs.existsSync(path.join(base,"public/payment-result.js")));
});

test("original VIONA art and original brand sprite stay linked, not redrawn by AI",()=>{
 assert.match(html,/assets\/viona-mark\.webp/);
 assert.match(css,/assets\/viona-user-logos\.webp/);
 assert.match(html,/class="nx-mark-original"/);
 const brand=fs.readFileSync(path.join(base,"public/assets/viona-mark.webp"));
 const sprite=fs.readFileSync(path.join(base,"public/assets/viona-user-logos.webp"));
 for(const b of [brand,sprite]){
  assert.equal(b.toString("ascii",0,4),"RIFF");
  assert.equal(b.toString("ascii",8,12),"WEBP");
 }
 assert.match(css,/\.nx-mark-original img\{[^}]*width:68px!important;height:68px!important/);
 assert.match(css,/\.product-icon \.viona-brand\{[^}]*width:64px!important;height:64px!important/);
 assert.doesNotMatch(css,/(?:^|[;}])\s*(?:filter:\s*blur|image-rendering:\s*pixelated)/im);
});

test("original image upgrade detects real PNGs and preserves existing fallbacks",()=>{
 const optional=read("public/viona-original-assets.js");
 for(const name of ["viona-original.png","viona-discord.png","viona-mir.png","viona-max.png",
 "viona-tbank.png","viona-telegram.png","viona-sberpay.png","viona-sbp.png","viona-gamepad.png"])
  assert.ok(optional.includes(name),name+" absent from full-resolution loader");
 assert.match(optional,/method:"HEAD"/);
 assert.match(optional,/naturalWidth<512/);
 assert.match(optional,/background-size:contain!important/);
 assert.match(html,/viona-original-assets\.js\?v=1/);
 assert.match(sw,/viona-original-assets\.js\?v=1/);
});

test("favicon/manifest/cache use the v30 shell and all static assets exist",()=>{
 assert.match(html,/href="\/favicon\.svg\?v=30"/);
 assert.equal(manifest.theme_color,"#eef7f8");
 assert.match(sw,/viona-reboot-v30/);
 for(const name of ["/viona-reset.css?v=1","/viona-reset-motion.js?v=1","/v15.js?v=30","/assets/viona-mark.webp?v=1"])
  assert.ok(sw.includes(name),name);
 const links=[
  ...[...html.matchAll(/(?:href|src)="(\/[^"?#]+\.(?:css|js|webp|svg|png|webmanifest))(?:\?[^"]*)?"/g)].map(m=>m[1]),
  ...[...css.matchAll(/url\(['"]?(\/[^'")]+)['"]?\)/g)].map(m=>m[1].split("?")[0])
 ];
 for(const loc of new Set(links))assert.ok(fs.existsSync(path.join(base,"public",loc.replace(/^\/+/,""))),loc+" is missing");
});

test("new animations avoid moving or blurring product photos and reduce motion",()=>{
 assert.match(motion,/IntersectionObserver/);
 assert.match(motion,/prefers-reduced-motion/);
 assert.match(motion,/MutationObserver/);
 assert.doesNotMatch(motion,/pointermove|filter\s*:\s*blur|rotateX|rotateY/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\.nx-motion-ready \.nx-reveal/);
});

test("HTML DOM sections are ordered and no controls are nested inside buttons",()=>{
 const ids=["home","catalog","studio","contact"].map(id=>html.indexOf('id="'+id+'"'));
 assert.ok(ids.every(i=>i>0));
 assert.ok(ids[0]<ids[1]&&ids[1]<ids[2]&&ids[2]<ids[3]);
 const buttons=[...html.matchAll(/<button\b[\s\S]*?<\/button>/g)].map(m=>m[0]);
 for(const button of buttons)assert.doesNotMatch(button,/<button\b[^>]*>[\s\S]*<button\b/);
});
