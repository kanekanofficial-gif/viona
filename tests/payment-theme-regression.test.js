"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const src=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const home=src("public/classic.html");
const reset=src("public/viona-reset.css");
const theme=src("public/payment-result-theme.css");
const sw=src("public/sw.js");
const server=src("admin-console.js");
const login=src("public/admin-console.js");

test("Payment status cards never get a forced always-white reset",()=>{
 assert.doesNotMatch(reset,/\.vr-root \.vr-box,\.vr-root \.vr-hero\s*\{\s*background:\s*#f6fbfc!important/);
 assert.match(theme,/html\[data-theme="dark"\] #vionaResultRoot\.vr-root \.vr-box/);
 assert.match(theme,/html\[data-theme="dark"\] #vionaResultRoot\.vr-root \.vr-hero/);
 assert.match(theme,/background:linear-gradient\(148deg,#16253b,#0c1728\)!important/);
 assert.match(theme,/html\[data-theme="light"\] #vionaResultRoot\.vr-root \.vr-box/);
 assert.match(theme,/\.vr-step-active strong/);
 assert.match(theme,/\.vr-receipt-row strong/);
});

test("Theme stylesheet is loaded last and cache is updated",()=>{
 const newStyle='<link rel="stylesheet" href="/payment-result-theme.css?v=1">';
 assert.ok(home.includes(newStyle));
 assert.ok(home.indexOf(newStyle)>home.indexOf('viona-studio-polish.css'));
 assert.ok(home.indexOf(newStyle)>home.indexOf('viona-reset.css'));
 assert.match(home,/payment-result\.css\?v=19/);
 assert.match(sw,/viona-reboot-v39/);
 assert.match(sw,/payment-result-theme\.css\?v=1/);
});

test("Admin setup response explains exactly which server configuration is missing",()=>{
 assert.match(server,/databaseReady:Boolean\(pool\)/);
 assert.match(server,/googleClientReady:Boolean\(process\.env\.GOOGLE_CLIENT_ID\)/);
 assert.match(login,/cfg\.databaseReady===false/);
 assert.match(login,/cfg\.googleClientReady===false/);
 assert.match(login,/GOOGLE_CLIENT_ID/);
 assert.doesNotMatch(login,/name=["']password["']/);
});
