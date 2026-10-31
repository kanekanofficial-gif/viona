"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");

const root=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const css=read("public/viona-halloween.css");
const html=read("public/index.html");
const v16=read("public/v16.js");
const sw=read("public/sw.js");

test("all close controls have exactly one CSS-drawn cross and no visible glyph",()=>{
 for(const id of ["v15Close","panelClose"]){
  assert.match(html,new RegExp('<button[^>]*id="'+id+'"[^>]*aria-label="Закрыть"[^>]*><\\/button>'));
 }
 assert.match(v16,/class="v16-close" aria-label="Закрыть"><\/button>/);
 assert.match(css,/:is\(\.v15-close,\.panel-close,\.v16-close\)::after/);
 assert.match(css,/rotate\(45deg\)!important/);
 assert.match(css,/rotate\(-45deg\)!important/);
 assert.match(css,/\.v15-close,\.v16-close\{position:absolute!important/);
 assert.match(css,/\.panel-close\{position:relative!important/);
 assert.match(css,/\.v15-dialog #v15Title,\.v15-dialog \.vx-title\{padding-right:52px\}/);
});

test("Halloween palette is charcoal and pumpkin-orange, without saturated violet",()=>{
 assert.match(css,/--bg:#090a08/);
 assert.match(css,/--accent:#ff921f/);
 assert.match(css,/BLACK & PUMPKIN, NOT PURPLE/);
 function hue(hex){
  const rgb=[0,2,4].map(x=>parseInt(hex.slice(x,x+2),16)/255),mx=Math.max(...rgb),mn=Math.min(...rgb),delta=mx-mn;
  const sat=mx===0?0:delta/mx;
  if(delta===0)return[0,sat];
  let h=mx===rgb[0]?(rgb[1]-rgb[2])/delta:mx===rgb[1]?(rgb[2]-rgb[0])/delta+2:(rgb[0]-rgb[1])/delta+4;
  return[((h*60)%360+360)%360,sat];
 }
 const colors=[...css.matchAll(/#([a-f0-9]{6})(?:[a-f0-9]{2})?(?![a-z0-9_-])/gi)].map(m=>m[1]);
 const violets=colors.filter(color=>{const[h,s]=hue(color);return h>=245&&h<335&&s>.19});
 assert.deepEqual(violets,[],"unexpected saturated purple CSS colors: "+violets.slice(0,10).join(","));
});

test("MAX and game logos fit their catalog slots and keep correct atlas cells",()=>{
 assert.match(css,/\.product-icon:has\(> \.viona-brand-game\)/);
 assert.match(css,/width:106px;height:106px;flex:0 0 106px;/);
 assert.match(css,/\.product-icon > \.viona-brand-max\{background-position:66\.6667% 0%!important\}/);
 assert.match(css,/\.product-icon > \.viona-brand-game\{background-position:100% 0%!important\}/);
 assert.match(css,/width:98px!important;height:98px!important/);
 assert.match(css,/background-size:400% 200%!important/);
 assert.match(css,/overflow:hidden!important/);
 assert.doesNotMatch(css,/width:142px!important|width:130px!important/);
});

test("MIR logo is contained and centred in saved-card and checkout slots",()=>{
 assert.match(css,/\.vx-mini-card-icon\{[\s\S]*?flex:0 0 54px!important;width:54px!important;height:50px!important;/);
 assert.match(css,/\.vx-mini-card-icon \.viona-brand-card\{[\s\S]*?width:46px!important;height:46px!important;/);
 assert.match(css,/\.vx-card-method \.vx-method-icon\{[\s\S]*?width:58px!important;height:58px!important;/);
 assert.match(css,/\.vx-card-method \.vx-method-icon \.viona-brand-card\{[\s\S]*?width:50px!important;height:50px!important;/);
 assert.match(css,/background-position:0% 100%!important/);
 assert.doesNotMatch(css,/width:126px!important|width:102px!important|width:89px!important/);
 assert.match(v16,/viona-brand-card/);
});

test("new CSS and VIONA ID code are cache-busted together",()=>{
 assert.ok(html.includes("/viona-halloween.css?v=21"));
 assert.ok(html.includes("/v16.js?v=19"));
 assert.ok(sw.includes('const CACHE="viona-shell-v21-1"'));
 assert.ok(sw.includes("/viona-halloween.css?v=21"));
 assert.ok(sw.includes("/v16.js?v=19"));
});

test("payment flow files are preserved",()=>{
 const app=read("public/v15.js");
 for(const route of ["/api/payments/test/init","/api/payments/test/qr","/api/payments/test/sberpay"])
  assert.ok(app.includes(route));
});

test("four pixelated atlas marks are replaced by local vector SVG assets",()=>{
 for(const file of ["brand-mir","brand-sberpay","brand-max","brand-gamepad"]){
  const name="/assets/"+file+".svg?v=21";
  assert.ok(css.includes(name),"CSS must use "+name);
  assert.ok(sw.includes(name),"service worker must precache "+name);
  const content=read("public/assets/"+file+".svg");
  assert.match(content,/<svg\\s[^>]*viewBox=/);
  assert.doesNotMatch(content,/<(?:image|script|foreignObject)\\b/i,"no raster or script embedded in SVG");
  assert.ok(content.trim().endsWith("</svg>"));
 }
});

test("saved-card MIR and full SberPay mark fit their containers",()=>{
 assert.match(css,/\/\\* Saved MIR card: legible horizontal wordmark/);
 assert.match(css,/width:45px!important;height:34px!important/);
 assert.match(css,/\/\\* SberPay needs a WIDE mark/);
 assert.match(css,/width:105px!important;height:60px!important;flex:0 0 105px!important/);
 assert.match(css,/width:91px!important;height:40px!important/);
 assert.match(css,/width:87px!important;height:54px!important;flex-basis:87px!important/);
 assert.match(css,/width:102px!important;height:102px!important/);
});
