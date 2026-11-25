"use strict";
const test=require("node:test");const assert=require("node:assert/strict");
const {trustedPaymentUrl,paymentHostForLog}=require("../tbank-demo");
test("accepts bank-owned hosted demo checkout domains",()=>{
 for(const url of ["https://securepay.tinkoff.ru/v2/Payment/123","https://securepayments.tinkoff.ru/q2wER3t0","https://pay.tbank-online.com/","https://forms.tbank.ru/pay"," https://pay.tbank.ru/123 "])
  assert.equal(trustedPaymentUrl(url),true,url);
});
test("rejects payment address tricks without disabling secure redirect checks",()=>{
 for(const url of ["http://securepay.tinkoff.ru/","https://tbank.ru.evil.test/","https://tbank-online.com.attacker.com/","https://evil.tbank.ru@attacker.com/pay","javascript:alert(1)","https://tbank.ru:8080/pay","//tbank.ru/pay","https://tbank.ru\\@attacker.test/","https://tbank.ru:443@attacker.test/"])
  assert.equal(trustedPaymentUrl(url),false,url);
});
test("public payment diagnostic never includes paths or query secrets",()=>{
 assert.equal(paymentHostForLog("https://unknown-checkout.example/path?paymentId=private"),"unknown-checkout.example");
});
