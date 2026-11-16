"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const src=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const {identityAllowed,filenameFromHeader,STATUS_NEXT,ADMIN_EMAIL}=require("../admin-console");
const {publicOrder}=require("../payment-order");
const server=src("server.js"),admin=src("admin-console.js"),payment=src("payment-order.js");
const page=src("private/admin-console.html"),client=src("public/admin-console.js");
const result=src("public/payment-result.js"),db=src("migrations/020_admin_order_delivery.sql");
const validSub="109876543210987654321";

test("access is restricted to one server-verified Google identity",()=>{
 const data={email:ADMIN_EMAIL,sub:validSub,email_verified:true};
 assert.equal(ADMIN_EMAIL,"support.viona.space@gmail.com");
 assert.equal(identityAllowed(data),true);
 assert.equal(identityAllowed({...data,email:"unrelated@gmail.com"}),false);
 assert.equal(identityAllowed({...data,email_verified:false}),false);
 assert.equal(identityAllowed({...data,sub:null}),false);
 assert.equal(identityAllowed({...data,sub:"not-a-google-sub"}),false);
 const old=process.env.VIONA_ADMIN_GOOGLE_SUB;
 try{process.env.VIONA_ADMIN_GOOGLE_SUB="555555555555";
  assert.equal(identityAllowed(data),false);
  assert.equal(identityAllowed({...data,sub:"555555555555"}),true);
 }finally{if(old===undefined)delete process.env.VIONA_ADMIN_GOOGLE_SUB;else process.env.VIONA_ADMIN_GOOGLE_SUB=old}
});
test("files are code archives and cannot use traversal paths or executable extensions",()=>{
 assert.equal(filenameFromHeader(encodeURIComponent("my-code.zip")),"my-code.zip");
 assert.equal(filenameFromHeader(encodeURIComponent("app.js")),"app.js");
 assert.equal(filenameFromHeader(encodeURIComponent("../server.js")),"");
 assert.equal(filenameFromHeader(encodeURIComponent("file.exe")),"");
 assert.equal(filenameFromHeader(encodeURIComponent("dir\\file.js")),"");
 assert.equal(filenameFromHeader("%FF"),"");
 assert.equal(filenameFromHeader(encodeURIComponent("x<script>.js")),"x_script_.js");
});
test("only panel can update demo order status, and stages are sequential",()=>{
 assert.deepEqual(STATUS_NEXT,{queued:"in_progress",in_progress:"ready",ready:"completed"});
 assert.match(admin,/app\.patch\(base\+"\/orders\/:id\/stage",session,requireMutation/);
 assert.match(admin,/status='CONFIRMED'/);
 assert.match(admin,/EXISTS\(SELECT 1 FROM viona_demo_order_files/);
 assert.doesNotMatch(payment,/app\.patch\("\/api\/payments\/test\/order\/\:id\/stage"/);
 assert.doesNotMatch(payment,/VIONA_ADMIN_TELEGRAM_IDS/);
 assert.doesNotMatch(result,/vrNextStage|vrSendMessage/);
 assert.equal(publicOrder({status:"CONFIRMED",fulfillment_status:"queued",items:[],order_id:"11111111-1111-4111-8111-111111111111",amount_kopecks:100},true).canManage,false);
});
test("owner downloads only after verified payment and completion",()=>{
 assert.match(payment,/p\.telegram_id=\$2 AND p\.status='CONFIRMED' AND p\.fulfillment_status='completed'/);
 assert.match(payment,/getUser\(req\)/);
 assert.match(payment,/res\.type\("application\/octet-stream"\)/);
 const basic={status:"CONFIRMED",fulfillment_status:"ready",order_id:"11111111-1111-4111-8111-111111111111",amount_kopecks:100,filename:"app.js",items:[]};
 assert.equal(publicOrder(basic,false).fileAvailable,false);
 const complete=publicOrder({...basic,fulfillment_status:"completed"},false);
 assert.equal(complete.fileAvailable,true);
 assert.equal(complete.fileName,"app.js");
 assert.equal(publicOrder({...basic,status:"AUTHORIZED",fulfillment_status:"completed"},false).fileAvailable,false);
});
test("private files and admin sessions live in Postgres, not in /public",()=>{
 assert.match(db,/viona_admin_sessions/);
 assert.match(db,/token_hash CHAR\(64\)/);
 assert.match(db,/viona_demo_order_files/);
 assert.match(db,/contents BYTEA/);
 assert.match(admin,/google-auth-library/);
 assert.match(admin,/verifyIdToken/);
 assert.match(admin,/httpOnly:true/);
 assert.match(admin,/sameSite:"strict"/);
 assert.match(admin,/randomBytes\(32\)/);
 assert.match(admin,/res\.set\(\{"Cache-Control":"no-store","X-Robots-Tag":"noindex/);
 assert.match(server,/registerAdminConsole/);
 assert.match(src("db-init.js"),/020_admin_order_delivery\.sql/);
});
test("the unlisted panel handles status, upload and download; UI shows demo notice",()=>{
 assert.match(page,/name="robots" content="noindex/);
 assert.match(page,/googleSignInButton/);
 assert.match(page,/T-BANK · DEMO ONLY/);
 assert.match(client,/adminStageForm/);
 assert.match(client,/adminUploadForm/);
 assert.match(client,/adminMessageForm/);
 assert.match(client,/application\/octet-stream/);
 assert.match(result,/deliveryHtml/);
 assert.match(result,/Скачать готовый файл/);
 assert.match(src("public/v16.js"),/stageLabels/);
 assert.match(src("public/index.html"),/payment-result\.js\?v=20/);
 assert.doesNotMatch(src("public/index.html"),/href="\/admin-console"/);
});
