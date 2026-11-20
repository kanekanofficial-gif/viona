"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const src=name=>fs.readFileSync(path.join(__dirname,"..",name),"utf8");
const html=src("public/studio.html"),home=src("public/classic.html");
const studio=src("public/viona-studio.js"),bot=src("public/viona-telegram-builder.js");
const css=src("public/viona-studio-polish.css"),theme=src("public/viona-theme.js");
const server=src("server.js"),icons=src("public/assets/studio-icons.svg");
test("Russian language control uses real SVG and accessible settings",()=>{
 assert.match(home,/assets\/flag-ru\.svg/);assert.match(html,/assets\/flag-ru\.svg/);
 assert.match(home,/data-lang="ru"/);assert.match(html,/vstLangLabel/);
 assert.match(html,/viona-settings-entry/);assert.ok(!html.includes(">◎</span>"));
});
test("Studio and bot controls share a vector icon sprite",()=>{
 for(const name of ["lab","builder","workspace","diff","boards","support","privacy","telegram","commands","send","mail","close"]){
  const actual=name==="commands"?"command":name;assert.ok(icons.includes('id="'+actual+'"'),actual);
 }
 assert.match(html,/studio-icons\.svg#lab/);assert.match(bot,/studio-icons\.svg#/);
 assert.match(src("public/viona-settings.js"),/studio-icons\.svg#/);
});
test("Studio themes apply to preview, chat, settings and editor",()=>{
 for(const part of ["vst-editor-light","vst-editor-dark","vst-preview-web","vb-chat-msgs","vs-overlay"]){assert.ok(css.includes(part),part)}
 assert.match(theme,/root\.style\.colorScheme=effective/);
 assert.match(studio,/effectiveTheme\(\)/);
 assert.match(studio,/window\.VionaTheme\?\.choose\?/);
 assert.match(studio,/MutationObserver/);
});
test("all Studio pages expose working local UUID paths and safe reload routes",()=>{
 assert.match(studio,/crypto\.randomUUID/);
 assert.match(studio,/function setStudioRoute/);
 assert.match(studio,/\/studio\/bots\//);
 assert.match(studio,/\?"projects":"boards"/);
 assert.match(studio,/uuid\.test/);
 assert.match(bot,/routeId/);
 assert.match(server,/app\.get\("\/studio\/:kind\/:id"/);
 assert.match(server,/app\.get\("\/studio\/:view"/);
 assert.match(html,/data-vst-tab="support"/);
});
test("support is linked from the store, Studio, and bot templates",()=>{
 for(const text of [home,html,studio,bot])assert.ok(text.includes("support.viona.space@gmail.com")||text===html&&text.includes("Поддержка и вопросы"));
 assert.match(studio,/function renderSupport/);assert.match(studio,/mailto:/);
 assert.match(studio,/Черновики не синхронизируются/);
 assert.match(bot,/Обращения ботом не отправляются|обращения ботом не отправляются|бот не отправляет обращения/);
 assert.doesNotMatch(studio,/eval\(/);
});
