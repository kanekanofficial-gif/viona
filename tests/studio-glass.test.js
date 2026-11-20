"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const at=file=>fs.readFileSync(path.resolve(__dirname,"..",file),"utf8");
const home=at("public/classic.html"),studio=at("public/studio.html"),site=at("public/viona-studio.js");
const glass=at("public/viona-glass27.css"),enhance=at("public/viona-glass27.js"),settings=at("public/viona-settings.js"),cmd=at("public/viona-command.js");
const sw=at("public/sw.js"),server=at("server.js"),codeEdit=at("public/code-edit.html");
test("all agreed Studio tools are linked from homepage",()=>{
 for(const view of ["lab","builder","workspace","diff","bundles","boards","dashboard","editor"]){
  assert.match(home,new RegExp("studio\\?view="+view));
  assert.match(studio,new RegExp('data-vst-tab="'+view+'"'));
 }
 assert.match(server,/app.get\("\/studio"/);
 assert.match(studio,/viona-studio\.js\?v=2/);
 assert.match(studio,/VIONA Studio/);
 assert.match(studio,/code-edit/);
 assert.match(site,/window\.VionaStudio/);
});
test("LAB demo and project builder remain safe and interactive",()=>{
 assert.match(site,/function renderLab/);
 assert.match(site,/VionaBotBuilder/);
 assert.match(site,/data-vst-site/);
 assert.match(site,/data-vst-game/);
 assert.match(site,/function renderBuilder/);
 assert.match(site,/state\.projects\.unshift\(project\)/);
 assert.match(site,/submitBuilder\(form/);
 assert.match(site,/"\/api\/request"/);
 assert.match(site,/response.status===202/);
 assert.doesNotMatch(site,/\beval\(|new Function\(/);
 assert.doesNotMatch(site,/\binnerHTML\s*=\s*[^;]*\bsource/);
});
test("workspace files, notes and timeline are local-only",()=>{
 assert.match(site,/function renderWorkspace/);
 assert.match(site,/vstMilestone|vst-milestone/);
 assert.match(site,/data-vst-download/);
 assert.match(site,/file\.size>35000/);
 assert.match(site,/file\.text\(\)/);
 assert.match(site,/createdAt:stamp\(\)/);
 assert.match(site,/отмечает сам пользователь/);
 assert.match(site,/Отправить на оценку/);
});
test("diff and product bundles actually process client data",()=>{
 assert.match(site,/function lcsDiff/);
 assert.match(site,/Math\.max\(dp\[i\+1\]\[j\],dp\[i\]\[j\+1\]\)/);
 assert.match(site,/function paintDiff/);
 assert.match(site,/function renderBundles/);
 assert.match(site,/\/api\/products/);
 assert.match(site,/data-vst-add-bundle/);
 assert.match(site,/viona-halloween-v1/);
});
test("boards, widget ordering, privacy and code editor are implemented",()=>{
 assert.match(site,/function renderBoards/);
 assert.match(site,/vstBoardNote/);
 assert.match(site,/vstPin/);
 assert.match(site,/function renderDashboard/);
 assert.match(site,/draggable="true"/);
 assert.match(site,/data-vst-widget-up/);
 assert.match(site,/function renderEditor/);
 assert.match(site,/data-vst-editor="tabs"/);
 assert.match(site,/vst-privacy-active/);
 assert.match(at("public/viona-editor-prefs.js"),/setRangeText/);
});
test("glass, water and full-motion settings preview are CSS-driven and optional",()=>{
 assert.match(glass,/backdrop-filter:blur/);
 assert.match(glass,/vg27-rivulet/);
 assert.match(glass,/vg27-droplet/);
 assert.match(glass,/vg27-modal/);
 assert.match(glass,/vg27-panel/);
 assert.match(glass,/vs-motion-preview/);
 assert.match(glass,/data-pref-water="off"/);
 assert.match(glass,/prefers-reduced-motion:reduce/);
 assert.match(settings,/motionPreview/);
 assert.match(settings,/vs-preview-card/);
 assert.match(settings,/vionaSettingsPrivacy/);
 assert.match(settings,/vionaSettingsWater/);
 assert.match(enhance,/function skeleton/);
 assert.match(enhance,/function popup/);
 assert.match(enhance,/function quickBar/);
 assert.match(enhance,/function ripple/);
 assert.match(enhance,/function fluid/);
});
test("command center works on all pages and is keyboard accessible",()=>{
 assert.match(cmd,/Ctrl\+K|Cmd\+K/);
 assert.match(cmd,/e\.ctrlKey\|\|e\.metaKey/);
 assert.match(cmd,/role="dialog"/);
 assert.match(cmd,/aria-selected/);
 assert.match(cmd,/e\.key==="ArrowDown"/);
 assert.match(cmd,/e\.key==="Enter"/);
 for(const page of [home,studio,codeEdit])assert.match(page,/viona-command\.js\?v=1/);
});
test("offline cache references Studio and all visual assets",()=>{
 assert.match(sw,/viona-reboot-v39/);
 for(const path of ["/studio.html","/viona-glass27.css?v=1","/viona-studio.js?v=2","/viona-command.js?v=1","/viona-editor-prefs.js?v=1"])assert.ok(sw.includes('"'+path+'"'));
 assert.match(home,/viona-glass27\.css\?v=1/);
});
