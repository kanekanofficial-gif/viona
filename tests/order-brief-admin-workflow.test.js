"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const {publicOrder}=require("../payment-order");
const migration=read("migrations/021_order_brief_archive.sql");
const checkout=read("public/v15.js"),bank=read("tbank-demo.js");
const admin=read("admin-console.js"),adminUi=read("public/admin-console.js");
const adminHtml=read("private/admin-console.html"),customer=read("public/payment-result.js");
const identity=read("public/v16.js");
const order={status:"CONFIRMED",fulfillment_status:"in_progress",order_id:"11111111-1111-4111-8111-111111111111",telegram_id:"12345",amount_kopecks:49000,
 customer_contact:"@username",customer_brief:"Нужен бот с командой /start и меню настроек",items:[]};
test("a paid order contains the exact client request, not only products and amount",()=>{
 const item=publicOrder(order,false);
 assert.equal(item.customerContact,"@username");
 assert.equal(item.customerBrief,order.customer_brief);
 assert.match(migration,/ADD COLUMN IF NOT EXISTS customer_contact/);
 assert.match(migration,/ADD COLUMN IF NOT EXISTS customer_brief/);
 assert.match(read("db-init.js"),/021_order_brief_archive\.sql/);
 assert.match(checkout,/vionaBriefContact/);
 assert.match(checkout,/vionaBriefText/);
 for(const route of ["/api/payments/test/init","/api/payments/test/qr","/api/payments/test/sberpay"]){
  assert.ok(checkout.includes(route),"missing checkout route "+route);
 }
 assert.match(checkout,/\.\.\.checkoutBrief\(\)/);
 assert.match(bank,/customerContact\.length<3\|\|customerBrief\.length<10/);
 assert.match(bank,/customer_contact,customer_brief/);
 assert.match(adminUi,/Что хочет клиент\?/);
 assert.match(adminUi,/o\.customerBrief/);
 assert.match(customer,/Моя заявка/);
 assert.match(identity,/o\.customerBrief/);
});
test("rejected delivery keeps bank-confirmed purchase distinct from a refunded payment",()=>{
 const rejected=publicOrder({...order,fulfillment_status:"rejected",fulfillment_note:"Недостаточно информации для завершения разработки"},false);
 assert.equal(rejected.verifiedPaid,true);
 assert.equal(rejected.rejected,true);
 assert.equal(rejected.failed,false);
 assert.equal(rejected.stage,"rejected");
 assert.equal(rejected.fileAvailable,false);
 assert.match(admin,/app\.patch\(base\+"\/orders\/:id\/reject",session,requireMutation/);
 assert.match(admin,/status='CONFIRMED' AND fulfillment_status IN/);
 assert.match(admin,/reason\.length<10/);
 assert.match(adminUi,/Отклонить заказ/);
 assert.match(customer,/Заказ отклонён администратором/);
 assert.match(identity,/rejected:"Отклонён"/);
});
test("uploaded code remains private until the admin completes the job",()=>{
 const uploaded=publicOrder({...order,filename:"source.zip",fulfillment_status:"ready"},false);
 assert.equal(uploaded.fileAvailable,false);
 const completed=publicOrder({...order,filename:"source.zip",fulfillment_status:"completed"},false);
 assert.equal(completed.fileAvailable,true);
 assert.equal(completed.fileName,"source.zip");
 assert.match(admin,/EXISTS\(SELECT 1 FROM viona_demo_order_files/);
 assert.match(adminUi,/Файл загружен:/);
 assert.doesNotMatch(adminUi,/Скачать:.*o\.fileName/);
 assert.match(adminUi,/Готово — выдать файл/);
});
test("clear orders is reversible archive, not deletion of bank transaction history",()=>{
 assert.match(migration,/archived_at TIMESTAMPTZ/);
 assert.match(admin,/SET archived_at=NOW\(\)/);
 assert.match(admin,/SET archived_at=NULL/);
 assert.doesNotMatch(admin,/DELETE FROM viona_demo_payments/);
 assert.match(adminUi,/adminClearOrders/);
 assert.match(adminUi,/window\.confirm/);
 assert.match(adminUi,/adminArchiveToggle/);
 assert.match(adminUi,/adminRestoreOrder/);
 assert.match(adminHtml,/adminClearOrders/);
 assert.match(adminHtml,/adminArchiveToggle/);
});
test("general website requests and code edits are only visible after admin session validation",()=>{
 assert.match(admin,/app\.get\(base\+"\/inquiries",session/);
 assert.match(admin,/FROM requests ORDER BY created_at DESC/);
 assert.match(admin,/FROM code_edit_requests ORDER BY created_at DESC/);
 assert.match(adminHtml,/adminInquiries/);
 assert.match(adminUi,/loadInquiries/);
 assert.match(adminUi,/esc\(q\.details/);
});
