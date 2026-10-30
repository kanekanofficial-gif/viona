"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const {bankMatches,publicOrder}=require("../payment-order");
const ORIGINAL=process.env.TBANK_DEMO_TERMINAL;
process.env.TBANK_DEMO_TERMINAL="MERCHANTDEMO";

const row={
 order_id:"11111111-1111-4111-8111-111111111111",
 payment_id:"12345",
 amount_kopecks:49000,
 status:"AUTHORIZED",
 method:"card",
 fulfillment_status:"awaiting_payment",
 items:[{id:1,title:"Telegram Bot Starter",category:"Боты",description:"Шаблон",tag:"Node.js",price:490}],
 created_at:"2026-10-30T00:00:00Z"
};
const bank={Success:true,PaymentId:"12345",OrderId:row.order_id,Amount:49000,Status:"CONFIRMED",TerminalKey:"MERCHANTDEMO"};

test("only exact bank order, payment, amount and terminal are trusted",()=>{
 assert.equal(bankMatches(bank,row),true);
 for(const [key,value] of [["PaymentId","67890"],["OrderId","other"],["Amount",49001],["TerminalKey","ANOTHERDEMO"],["Status","PENDING_SUCCESS"],["Success",false]]){
  assert.equal(bankMatches({...bank,[key]:value},row),false,key+" should be rejected");
 }
});

test("a return URL or AUTHORIZED status never implies confirmed payment",()=>{
 const pending=publicOrder(row,false);
 assert.equal(pending.verifiedPaid,false);
 assert.equal(pending.stage,"awaiting_payment");
 assert.equal(pending.canManage,false);
 const confirmed=publicOrder({...row,status:"CONFIRMED",fulfillment_status:"queued",paid_at:"2026-10-30T00:00:01Z"},false);
 assert.equal(confirmed.verifiedPaid,true);
 assert.equal(confirmed.stage,"queued");
});

test("refund is not represented as a successful active payment",()=>{
 const refunded=publicOrder({...row,status:"REFUNDED",fulfillment_status:"ready"},false);
 assert.equal(refunded.failed,true);
 assert.equal(refunded.verifiedPaid,false);
 assert.equal(refunded.stage,"awaiting_payment");
});

test("only verified admin may see fulfillment controls",()=>{
 assert.equal(publicOrder({...row,status:"CONFIRMED",fulfillment_status:"queued"},false).canManage,false);
 assert.equal(publicOrder({...row,status:"CONFIRMED",fulfillment_status:"queued"},true).canManage,true);
});

test("public payload contains a product snapshot but no bank payment identifiers",()=>{
 const result=publicOrder({...row,status:"CONFIRMED",fulfillment_status:"queued"},false);
 assert.deepEqual(result.items[0],{id:1,title:"Telegram Bot Starter",description:"Шаблон",category:"Боты",tag:"Node.js",price:490});
 assert.equal("payment_id" in result,false);
 assert.equal("telegram_id" in result,false);
 assert.equal("rebill_id" in result,false);
});

test("catalog illustration picks a specific Telegram SVG for Telegram product",()=>{
 const code=fs.readFileSync(path.join(__dirname,"..","public","viona-icons.js"),"utf8");
 const ctx={window:{}};
 vm.runInNewContext(code,ctx);
 const telegram=ctx.window.VionaIcons.product({id:1,title:"Telegram Bot Starter",category:"Боты"});
 const discord=ctx.window.VionaIcons.product({id:3,title:"Discord Utility Bot",category:"Боты"});
 const max=ctx.window.VionaIcons.product({id:7,title:"MAX Bot Starter",category:"Боты"});
 assert.match(telegram,/role="img" aria-label="Telegram"/);
 assert.match(telegram,/<svg/);
 assert.notEqual(discord,telegram);
 assert.notEqual(max,telegram);
});

test("bank return URLs are set in Init and only CONFIRMED drives paid UI",()=>{
 const bankSource=fs.readFileSync(path.join(__dirname,"..","tbank-demo.js"),"utf8");
 const page=fs.readFileSync(path.join(__dirname,"..","public","payment-result.js"),"utf8");
 assert.match(bankSource,/SuccessURL:base\+"\/payment\/success\?orderId="/);
 assert.match(bankSource,/FailURL:base\+"\/payment\/fail\?orderId="/);
 assert.match(page,/order\.verifiedPaid/);
 assert.match(page,/\/api\/payments\/test\/order\//);
});

test.after(()=>{if(ORIGINAL===undefined)delete process.env.TBANK_DEMO_TERMINAL;else process.env.TBANK_DEMO_TERMINAL=ORIGINAL});
