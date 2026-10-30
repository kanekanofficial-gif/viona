"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const css=read("public/viona-halloween.css");
const html=read("public/index.html");
const v16=read("public/v16.js");
const sw=read("public/sw.js");
const split=read("public/viona-logo-fit.js");

test("all close controls keep their single centered cross",()=>{
 for(const id of ["v15Close","panelClose"]){
  assert.match(html,new RegExp('<button[^>]*id="'+id+'"[^>]*aria-label="Закрыть"[^>]*><\\/button>'));
 }
 assert.match(v16,/class="v16-close" aria-label="Закрыть"><\/button>/);
 assert.match(css,/:is\(\.v15-close,\.panel-close,\.v16-close\)::after/);
 assert.match(css,/rotate\(45deg\)!important/);
 assert.match(css,/rotate\(-45deg\)!important/);
});

test("Halloween color remains charcoal and pumpkin orange",()=>{
 assert.match(css,/--bg:#090a08/);
 assert.match(css,/--accent:#ff921f/);
 assert.match(css,/BLACK & PUMPKIN, NOT PURPLE/);
});

test("oversized sprite zoom removed from all eight images",()=>{
 assert.doesNotMatch(css,/background-size:600%\s+300%/);
 assert.doesNotMatch(css,/background-size:480%\s+240%/);
 assert.doesNotMatch(css,/width:142px!important;height:142px!important/);
 assert.doesNotMatch(css,/width:126px!important;height:126px!important/);
 assert.match(css,/\.product-icon:has\(\.viona-brand\)\{/);
 assert.match(css,/\.product-icon \.viona-brand\{\s*width:76px!important;height:76px!important/);
 assert.match(css,/\.product-icon \.viona-brand-game\{\s*width:78px!important;height:64px!important/);
 assert.match(css,/\.vx-payment-method-list \.vx-method-icon/);
 assert.match(css,/overflow:hidden!important/);
});

test("MIR is inside a compact, correctly aligned saved card icon",()=>{
 assert.match(css,/\.vx-card-list \.vx-mini-card-icon\{/);
 assert.match(css,/flex:0 0 52px!important;width:52px!important;height:40px!important/);
 assert.match(css,/\.vx-card-list \.vx-mini-card-icon \.viona-brand-card\{/);
 assert.match(css,/width:46px!important;height:25px!important/);
 assert.match(css,/\.vx-payment-method-list \.vx-method-icon \.viona-brand-card\{/);
 assert.match(v16,/viona-brand-card/);
});

test("eight owner-provided images are cropped to alpha bounds into independent backgrounds",()=>{
 assert.match(split,/getImageData\(0,0,cw,ch\)/);
 assert.match(split,/data\[\(y\*cw\+x\)\*4\+3\]<=12/);
 assert.match(split,/background-size:contain!important/);
 assert.match(split,/background-position:center!important/);
 assert.match(split,/rules.length!==8/);
 const injected=[];
 const fakeContext={
  clearRect(){},
  drawImage(){},
  getImageData(){const data=new Uint8ClampedArray(100*100*4);data[(50*100+50)*4+3]=255;return {data}}
 };
 const doc={
  createElement(name){
   if(name==="canvas")return {width:0,height:0,getContext(){return fakeContext},toDataURL(){return "data:image/webp;base64,FAKE"}};
   if(name==="style")return {textContent:"",id:""};
   throw Error("unexpected element");
  },
  head:{append(node){injected.push(node.textContent)}},
  documentElement:{classList:{add(name){injected.push(name)}}}
 };
 class FakeImage{constructor(){this.naturalWidth=400;this.naturalHeight=200}set src(_){this.onload()}}
 vm.runInNewContext(split,{document:doc,Image:FakeImage,console:{warn(){}}});
 assert.ok(injected.includes("viona-logos-separated"));
 for(const brand of ["telegram","discord","max","game","card","sbp","sber","tbank"]){
  assert.ok(injected[0].includes(".viona-brand-"+brand+"{"),"cropped logo missing: "+brand);
 }
});

test("v20 assets and cache are linked in exact order",()=>{
 assert.ok(html.includes("/viona-halloween.css?v=20"));
 assert.ok(html.includes("/viona-logo-fit.js?v=20"));
 assert.ok(html.indexOf("/viona-logo-fit.js?v=20")<html.indexOf("/viona-icons.js?v=18"));
 assert.ok(sw.includes('const CACHE="viona-shell-v20-1"'));
 assert.ok(sw.includes("/viona-halloween.css?v=20"));
 assert.ok(sw.includes("/viona-logo-fit.js?v=20"));
});

test("TEST payment endpoints are unchanged",()=>{
 const app=read("public/v15.js");
 for(const route of ["/api/payments/test/init","/api/payments/test/qr","/api/payments/test/sberpay"])assert.ok(app.includes(route));
});
