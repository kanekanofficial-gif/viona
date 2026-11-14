"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const html=read("public/index.html"),theme=read("public/viona-theme.js"),themeCss=read("public/viona-theme.css");
const lang=read("public/viona-checkout-i18n.js"),requirements=read("public/viona-requirements.js");
const codeEdit=read("public/code-edit.html"),codeForm=read("public/code-edit.js");
const server=read("server.js"),db=read("db-init.js"),app=read("public/v15.js"),sw=read("public/sw.js");
test("theme picker supports explicit light, dark, system auto and femboy",()=>{
 assert.match(html,/id="vionaThemeMode"/);
 for(const mode of ["auto","light","dark"])assert.ok(html.includes('value="'+mode+'"'));
 assert.match(theme,/prefers-color-scheme: dark/);
 assert.match(theme,/localStorage.setItem\(KEY,value\)/);
 assert.match(theme,/data-world/);
 assert.match(themeCss,/html\[data-theme="dark"\]/);
 assert.match(themeCss,/html\[data-world="femboy"\]/);
 assert.match(themeCss,/#ff70b7/);
 assert.match(themeCss,/#111316/);
 assert.match(html,/viona-theme\.css\?v=1/);
});
test("checkout translations include all payment methods, fallback, status and cards",()=>{
 assert.match(html,/viona-checkout-i18n\.js\?v=1/);
 for(const key of ["ru","en","ja","de","femboy"])assert.match(lang,new RegExp(key+":\\{"));
 for(const key of ["sberUnavailable","sberFallbackLink","bankCard","cardDesc","sbpTitle","savedCards","creatingPayment","paymentError","cardsNotFound"])assert.ok(lang.includes(key));
 assert.match(lang,/MutationObserver/);
 assert.match(app,/Прямой запуск SberPay не поддерживается этим тестовым терминалом/);
 assert.match(themeCss,/\.vx-sber-fallback/);
 assert.match(themeCss,/\.vx-sber-status/);
});
test("product lists and product detail modal show requirements and separate quote requests",()=>{
 for(let id=1;id<=7;id++)assert.match(requirements,new RegExp("\\b"+id+":\\{"));
 assert.match(requirements,/MutationObserver/);
 assert.match(requirements,/\.detail-layout/);
 assert.match(requirements,/"\/api\/request"/);
 assert.match(requirements,/res.status===202/);
 assert.match(requirements,/Не отправляй пароли, токены и API-ключи/);
 assert.match(html,/viona-requirements\.js\?v=1/);
});
test("code edit has a real page, protected backend and no automatic payment",()=>{
 assert.match(html,/href="\/code-edit"/);
 assert.match(html,/nx-code-promo/);
 assert.match(codeEdit,/id="codeEditForm"/);
 assert.match(codeEdit,/name="source"/);
 assert.match(codeEdit,/name="changes"/);
 assert.match(codeEdit,/name="contact"/);
 assert.match(codeEdit,/id="codeConfirm"/);
 assert.match(codeForm,/"\/api\/code-edit"/);
 assert.match(server,/app.get\("\/code-edit"/);
 assert.match(server,/registerCodeEdit\(app,pool\)/);
 assert.match(db,/CREATE TABLE IF NOT EXISTS code_edit_requests/);
 assert.doesNotMatch(codeEdit,/paymentUrl|checkoutOpen/);
 assert.match(sw,/viona-reboot-v31/);
});
test("code request validation and database storage are safe and explicit",async()=>{
 const {registerCodeEdit}=require("../code-edit-api");
 let handler=null,record=null;
 const pool={async query(sql,args){record={sql,args};return {rowCount:1}}};
 registerCodeEdit({post(p,h){assert.equal(p,"/api/code-edit");handler=h}},pool);
 const res=()=>({statusCode:200,set(){return this},status(c){this.statusCode=c;return this},json(x){this.payload=x;return this}});
 const req={ip:"test-user",get(k){return k==="origin"?"https://viona.space":""},body:{
  project:"My app",name:"Kai",contact:"@kai_code",language:"Python",
  source:"print('hello world')",changes:"Please add a notification handler and cleanup."}};
 const result=res();await handler(req,result);
 assert.equal(result.statusCode,201);assert.equal(record.args[5],req.body.source);
 assert.match(record.sql,/INSERT INTO code_edit_requests/);
 assert.equal(result.payload.paymentRequired,false);
 const bad=res();await handler({...req,body:{...req.body,source:""}},bad);
 assert.equal(bad.statusCode,400);
 const unavailableApp={post(_p,h){handler=h}};
 registerCodeEdit(unavailableApp,null);
 const unavailable=res();await handler(req,unavailable);
 assert.equal(unavailable.statusCode,503);
});
