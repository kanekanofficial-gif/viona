"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const base=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(base,file),"utf8");
const css=read("public/viona-reset.css");
const html=read("public/index.html");
const js=read("public/v15.js");
const manifest=JSON.parse(read("public/manifest.webmanifest"));

test("new light glass uses cool gray, teal and white and no brown theme",()=>{
 assert.match(css,/--bg:#eef6f8/);
 assert.match(css,/--accent:#027e9a/);
 assert.match(css,/backdrop-filter:blur\(36px\) saturate\(165%\)/);
 for(const bad of ["#100b07","#281f17","#ff994c","#201912","#8d52d9"])assert.ok(!css.includes(bad),bad);
});

test("hero and mobile navigation have predictable grid, breakpoints and no overlap",()=>{
 assert.match(css,/\.nx-hero\{display:grid!important/);
 assert.match(css,/\.nx-hero-screen\{position:relative;display:flex/);
 assert.doesNotMatch(html,/nx-float-chip|vg-float-chip/);
 for(const b of ["max-width:1250px","max-width:1000px","max-width:740px","max-width:455px"])assert.ok(css.includes(b),b);
 assert.match(css,/\.nx-workspace\{width:calc\(100% - 248px\)/);
 assert.match(css,/\.mobile-bar\{position:fixed!important/);
});

test("original 96px asset is never enlarged to a giant blurry 350px hero image",()=>{
 assert.doesNotMatch(html,/class="vg-mark-image"|class="nx-mark-image"/);
 assert.match(css,/\.nx-mark-original img\{[^}]*width:68px!important;height:68px!important/);
 assert.match(css,/\.nx-brand-logo\{[^}]*width:48px!important;height:48px!important/);
 const file=fs.readFileSync(path.join(base,"public/assets/viona-mark.webp"));
 assert.equal(file.toString("ascii",0,4),"RIFF");
 assert.equal(file.toString("ascii",8,12),"WEBP");
});

test("real user sprite assets are displayed in fixed native-sized frames",()=>{
 assert.match(css,/\.product-icon \.viona-brand\{[^}]*width:64px!important;height:64px!important/);
 for(const name of ["telegram","discord","max","game"])assert.match(css,new RegExp("\\.product-icon \\.viona-brand-"+name+"\\{"));
 assert.match(css,/background-size:256px 128px!important/);
 assert.doesNotMatch(css,/\.product-icon \.viona-brand\{[^}]*transform:scale/);
});

test("checkout, account and gallery remain styled after reset",()=>{
 for(const token of [".panel.open",".v15-dialog.open",".detail-layout",".vx-sber-method",".vx-card-method",".v16-workspace",".v16-account"])
  assert.ok(css.includes(token),token);
 assert.match(css,/\.vx-sber-method \.vx-method-icon\{width:112px!important;height:65px!important/);
 assert.match(css,/\.vx-card-method \.vx-method-icon \.viona-brand-card\{[^}]*width:55px!important;height:45px!important/);
 assert.match(html,/id="v15Dialog"/);
});

test("language state and profile remain supported",()=>{
 assert.match(js,/document\.documentElement\.dataset\.world=lang/);
 assert.match(js,/viona-language-v18/);
 assert.match(html,/id="profileOpen"/);
 assert.equal(manifest.short_name,"VIONA");
});
