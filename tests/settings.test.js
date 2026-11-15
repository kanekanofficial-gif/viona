"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const base=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(base,file),"utf8");
const homepage=read("public/index.html"),service=read("public/code-edit.html");
const logic=read("public/viona-settings.js"),css=read("public/viona-settings.css");
const oldProfile=read("public/v15.js"),fullProfile=read("public/v16.js");
const theme=read("public/viona-theme.js"),sw=read("public/sw.js");
test("settings can be opened from local VIONA ID and authenticated account",()=>{
 assert.match(logic,/v15Content #v15ProfileForm/);
 assert.match(logic,/v16WorkspaceBody \.v16-account/);
 assert.match(logic,/viona-settings-entry/);
 assert.match(logic,/vionaSettingsEntryLocal/);
 assert.match(logic,/vionaSettingsEntryAccount/);
 assert.match(oldProfile,/function openProfile/);
 assert.match(fullProfile,/function accountHtml/);
});
test("settings dialog is accessible and keyboard-operable",()=>{
 assert.match(logic,/role="dialog"/);
 assert.match(logic,/aria-modal="true"/);
 assert.match(logic,/role="tablist"/);
 assert.match(logic,/aria-selected/);
 assert.match(logic,/aria-labelledby/);
 assert.match(logic,/e\.key==="Escape"/);
 assert.match(logic,/e\.key!=="Tab"/);
 assert.match(logic,/e\.key==="ArrowRight"/);
 assert.match(logic,/e\.key==="ArrowLeft"/);
 assert.match(logic,/el\.inert=true/);
 assert.match(logic,/entry\.el\.inert=entry\.inert/);
 assert.match(css,/max-width:720px/);
 assert.match(css,/\.vs-dialog/);
});
test("appearance preferences persist and apply actual UI effects",()=>{
 for(const preference of ["motion","density","font","contrast","badge","start"])
  assert.match(logic,new RegExp(preference+":"));
 assert.match(logic,/localStorage\.setItem\(KEY,JSON\.stringify\(prefs\)\)/);
 assert.match(logic,/window\.VionaTheme\?\.choose/);
 assert.match(theme,/window\.VionaTheme=/);
 for(const rule of ['data-pref-motion="reduce"','data-pref-density="compact"','data-pref-font="large"','data-pref-contrast="high"','data-pref-badge="off"'])
  assert.ok(css.includes(rule),rule);
 assert.match(logic,/prefs\.start!=="catalog"/);
 assert.match(logic,/scrollIntoView/);
});
test("languages and data export preserve account/payment privacy",()=>{
 for(const locale of ["ru","en","ja","de","femboy"])assert.match(logic,new RegExp(locale+":\\{"));
 assert.match(logic,/viona-language-v18/);
 assert.match(logic,/viona-world/);
 assert.match(logic,/viona_language=/);
 assert.match(logic,/viona-halloween-v1/);
 assert.match(logic,/new Blob/);
 assert.match(logic,/viona-local-preferences\.json/);
 assert.match(logic,/window\.confirm/);
 assert.doesNotMatch(logic,/localStorage\.clear\(/);
 assert.doesNotMatch(logic,/fetch\(/);
 assert.doesNotMatch(logic,/\/api\/payments\//);
 assert.doesNotMatch(logic,/removeItem\("viona-language-v18"\)/);
});
test("settings assets loaded on storefront and code-edit page",()=>{
 for(const s of [homepage,service]){
  assert.match(s,/viona-settings\.css\?v=1/);
  assert.match(s,/viona-settings\.js\?v=1/);
 }
 assert.match(sw,/viona-reboot-v35/);
 for(const p of ['"/viona-settings.css?v=1"','"/viona-settings.js?v=1"'])assert.ok(sw.includes(p));
});
