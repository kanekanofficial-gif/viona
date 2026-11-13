"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const css=read("public/viona-liquid-glass.css");
const html=read("public/index.html");
const v16=read("public/v16.js");
const sw=read("public/sw.js");
const app=read("public/v15.js");

function hue(hex){
 const rgb=[0,2,4].map(x=>parseInt(hex.slice(x,x+2),16)/255),mx=Math.max(...rgb),mn=Math.min(...rgb),delta=mx-mn;
 const sat=mx===0?0:delta/mx;
 if(delta===0)return[0,sat];
 let h=mx===rgb[0]?(rgb[1]-rgb[2])/delta:mx===rgb[1]?(rgb[2]-rgb[0])/delta+2:(rgb[0]-rgb[1])/delta+4;
 return[((h*60)%360+360)%360,sat];
}

test("the new site palette has no brown or saturated violet theme colors",()=>{
 assert.match(css,/--bg:#07111e/);
 assert.match(css,/--accent:#62d8f2/);
 const colors=[...css.matchAll(/#([a-f0-9]{6})(?:[a-f0-9]{2})?(?![a-z0-9_-])/gi)].map(m=>m[1]);
 const violets=colors.filter(color=>{const[h,s]=hue(color);return h>=245&&h<335&&s>.19});
 assert.deepEqual(violets,[],"unexpected violet theme colors: "+violets.slice(0,10).join(","));
 assert.doesNotMatch(css,/--bg:#[0-9a-f]*(?:1[0-9a-f]{4}|[0-9a-f]{6})/i);
});

test("Liquid Glass uses layered translucency, refraction, highlights and motion",()=>{
 for(const token of ["backdrop-filter:blur(34px) saturate(190%)","inset 1px 1px #ffffff52","vg-glass-reflection","vg-glass-card:after","@keyframes vg-refraction","@keyframes vg-chip-float","@keyframes vg-card-float"])assert.ok(css.includes(token),token);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.doesNotMatch(css,/\.vg-mark-image\{[^}]*filter:blur/);
});

test("original gamepad and MAX icons stay crisp and large without replacing brand artwork",()=>{
 assert.match(css,/\.product-icon:has\(>\.viona-brand-game\)/);
 assert.match(css,/\.product-icon:has\(>\.viona-brand-max\)/);
 assert.match(css,/width:102px!important;height:102px!important/);
 assert.match(css,/background-image:url\('\\/assets\\/brand-max\.svg\?v=23'\\)!important/);
 assert.match(css,/background-image:url\('\\/assets\\/brand-gamepad\.svg\?v=23'\\)!important/);
 assert.match(css,/\.product-icon>\.viona-brand-telegram,.product-icon>\.viona-brand-discord\{width:64px;height:64px\}/);
});

test("MIR and SberPay keep their own artwork and proper wide containers",()=>{
 assert.match(css,/brand-mir\.svg\?v=23/);
 assert.match(css,/brand-sberpay\.svg\?v=23/);
 assert.match(css,/\.vx-sber-method \.vx-method-icon\{[^}]*width:105px!important;height:60px!important/);
 assert.match(css,/\.vx-sber-method \.vx-method-icon \.viona-brand-sber\{[^}]*width:91px!important;height:40px!important/);
 assert.match(css,/\.vx-card-method \.vx-method-icon \.viona-brand-card\{[^}]*width:50px!important;height:39px!important/);
 assert.match(v16,/viona-brand-card/);
});

test("all close controls keep a visible, aligned CSS cross",()=>{
 assert.match(css,/:is\(\.v15-close,\.panel-close,\.v16-close\):before/);
 assert.match(css,/:is\(\.v15-close,\.panel-close,\.v16-close\):after/);
 assert.match(css,/rotate\(45deg\)/);
 assert.match(css,/rotate\(-45deg\)/);
 assert.match(html,/id="v15Close" class="v15-close" aria-label="Закрыть"><\/button>/);
 assert.match(html,/id="panelClose" class="panel-close" type="button" aria-label="Закрыть"><\/button>/);
});

test("service worker drops the old seasonal cache and preloads the new shell",()=>{
 assert.match(sw,/viona-shell-v23-1/);
 assert.match(sw,/viona-liquid-glass\.css/);
 assert.match(sw,/viona-motion\.js/);
 assert.match(sw,/assets\/viona-mark\.webp/);
 assert.doesNotMatch(sw,/viona-halloween|favicon\.png/);
 assert.match(html,/viona-liquid-glass\.css\?v=1/);
});

test("language changes are applied to the hero, catalog, forms and VIONA ID",()=>{
 assert.match(app,/function localize\(\)/);
 assert.match(app,/data-i-placeholder/);
 assert.match(app,/data-i-aria/);
 assert.match(app,/location\.reload\(\)/);
 assert.match(v16,/dataset\.world\|\|document\.documentElement\.lang/);
 assert.match(v16,/paymentsAndGoods/);
 assert.match(v16,/savedCards/);
});