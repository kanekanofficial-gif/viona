"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 fs.mkdirSync("screenshots",{recursive:true});
 try{
  for(const [label,width,height] of [["desktop",1440,900],["tablet",820,1000],["mobile",390,844]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   const origin="http://127.0.0.1:4173";
   const open=async route=>{await page.goto(origin+route,{waitUntil:"domcontentloaded",timeout:25000});await page.waitForLoadState("load")};
   const noOverflow=async route=>{
    const d=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll("body *")].map(e=>{const b=e.getBoundingClientRect();return {tag:e.tagName,id:e.id,cls:typeof e.className==="string"?e.className.slice(0,40):"",left:b.left,right:b.right}}).filter(x=>x.left<-10||x.right>innerWidth+10).slice(0,8)}));
    assert.ok(d.scroll<=d.width+2,route+" "+label+" overflows: "+JSON.stringify(d));
   };
   await open("/");
   if(await page.locator("#welcome").isVisible())await page.locator("#closeWelcome").click();
   await page.waitForFunction(()=>document.querySelectorAll(".product-card").length>=8,null,{timeout:12000});
   assert.equal(await page.locator(".nx-sidebar").count(),0,"Old sidebar remains");
   assert.ok(await page.locator(".glass").count()>=10,"Layered glass missing");
   assert.equal(await page.locator(".liquid-drop").count(),0,"Unwanted drops still render");
   assert.ok(await page.locator(".hero-composition").isVisible(),"New hero art missing");
   assert.ok(await page.locator("#vionaLanguageButton").isVisible(),"Language switcher missing");
   await noOverflow("/");
   await page.screenshot({path:"screenshots/atelier-"+label+".png",fullPage:true});
   await page.locator('#productFilters [data-filter="Музыка"]').click();
   assert.equal(await page.locator(".product-card").count(),1,"Music category missing");
   assert.match(await page.locator(".product-card").innerText(),/KANEKAN KAN/);
   await page.locator('#productFilters [data-filter="Боты"]').click();
   assert.equal(await page.locator(".product-card").count(),3,"Bots category filter");
   await page.locator('#productFilters [data-filter="Все"]').click();
   await page.locator("#searchProducts").fill("Telegram");
   assert.equal(await page.locator(".product-card").count(),1,"Search result is incorrect");
   await page.locator("#searchProducts").fill("");
   if(label==="desktop"){
    await page.locator('[data-product="1"]').first().click();
    await page.locator("#overlay").waitFor({state:"visible",timeout:4000});
    assert.ok(await page.locator("#overlay").isVisible(),"Product detail dialog missing");
    assert.ok(await page.locator("#overlay").evaluate(el=>el.classList.contains("is-open")),"Product dialog animation not active");
    assert.equal(await page.locator(".detail-block").count(),5,"Expected comprehensive product description");
    assert.match(await page.locator("#dialogContent").innerText(),/Как это работает/);
    await page.locator('[data-add="1"]').click();
    assert.equal(await page.locator("#cartCount").textContent(),"1","Cart did not update");
    assert.equal(await page.locator("#overlay").getAttribute("data-mode"),"drawer","Cart is not an animated side drawer");
    assert.ok(await page.locator("#overlay").evaluate(el=>el.classList.contains("is-open")),"Drawer open state missing");
    await page.locator("#goCheckout").click();
    assert.match(await page.locator("#dialogContent").innerText(),/Telegram|VIONA ID/i,"Not signed-in checkout did not require authentication");
    await page.locator("#closeDialog").click();await page.locator("#overlay").waitFor({state:"hidden"});
    await page.route("**/api/auth/me",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({user:{id:"987654321",name:"Тестовый пользователь",username:"viona_tester",picture:null}})}));
    await page.route("**/api/auth/config",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({telegram:true,botUsername:"viona_appbot"})}));
    await page.route("**/api/payments/test/my-orders",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({orders:[{orderId:"6af982ec-f19c-43eb-b8d0-aa7beaad5ce0",amount:490,stage:"completed",status:"CONFIRMED",fileName:"project.zip",fileAvailable:true,items:[{title:"Telegram Bot Starter"}]}]})}));
    await page.locator("#openAccount").click();
    await page.locator("#ordersRoot a").first().waitFor();
    assert.match(await page.locator("#dialogContent").innerText(),/Тестовый пользователь/);
    assert.match(await page.locator("#dialogContent").innerText(),/987654321/);
    assert.match(await page.locator("#dialogContent").innerText(),/project\.zip/);
    await page.locator("#closeDialog").click();await page.locator("#overlay").waitFor({state:"hidden"});
    await page.locator("#openCart").click();
    await page.locator("#goCheckout").click();
    await page.locator("#payForm").waitFor({state:"attached",timeout:5000});
    assert.ok(await page.locator('#payForm input[name="method"][value="card"]').count()===1,"Card payment missing");
    assert.ok(await page.locator('img[src$="visa.svg"]').count()>=1);
    assert.ok(await page.locator('img[src$="Mir.svg"]').count()>=1,"Mir missing next to Visa");
    assert.ok(await page.locator('img[src$="sbp.svg"]').count()>=1);
    assert.equal(await page.locator(".choices .payment-logo").count(),5,"All branded logos are required");
    await page.locator("#closeDialog").click();await page.locator("#overlay").waitFor({state:"hidden"});
   }
   await page.locator("#vionaLanguageButton").click();
   await page.locator('[data-lang-value="en"]').click();
   assert.equal(await page.locator("html").getAttribute("lang"),"en");
   assert.match(await page.locator(".intro h1").innerText(),/Your idea/);
   if(label==="desktop"){
    await page.locator("#vionaLanguageButton").click();await page.locator('[data-lang-value="ja"]').click();
    assert.equal(await page.locator("html").getAttribute("lang"),"ja");
    await page.locator("#vionaLanguageButton").click();await page.locator('[data-lang-value="de"]').click();
    assert.equal(await page.locator("html").getAttribute("lang"),"de");
   }
   await page.locator("#vionaLanguageButton").click();
   await page.locator('[data-lang-value="pink"]').click();
   assert.equal(await page.locator("html").getAttribute("data-style"),"pink");
   await noOverflow("/ with pink theme");
   await page.locator("#vionaLanguageButton").click();
   await page.locator('[data-lang-value="ru"]').click();
   assert.equal(await page.locator("html").getAttribute("data-style"),"default");
   await page.locator("#changeTheme").click();assert.equal(await page.locator("html").getAttribute("data-theme"),"light");
   await page.locator("#changeTheme").click();assert.equal(await page.locator("html").getAttribute("data-theme"),"dark");
   await open("/music");
   assert.ok(await page.locator("#v2MusicForm").isVisible());
   assert.ok(await page.locator("#vionaLanguageButton").isVisible());
   assert.equal(await page.locator('[name="lyricsMode"]').count(),2,"Lyrics options missing");
   assert.equal(await page.locator('[name="voice"]').count(),2,"Voice options missing");
   assert.ok(await page.locator('input[name="genre"][list="musicGenres"]').count()===1);
   await noOverflow("/music");
   if(label==="desktop"){
    await page.locator('[name="genre"]').fill("Brazilian funk");
    await page.locator('[name="contact"]').fill("@tester");
    await page.locator('[name="title"]').fill("My track");
    await page.locator('[name="brief"]').fill("This is a real detailed creative brief.");
    await page.locator(".music-form input[type=checkbox]").check();
    await page.locator(".music-form button[type=submit]").click();
    assert.ok(await page.locator('[name="genre"]').evaluate(el=>!el.validity.valid),"Forbidden genre accepted");
    await page.locator('[name="genre"]').fill("Math rock");
    assert.ok(await page.locator('[name="genre"]').evaluate(el=>el.validity.valid),"Custom genre was rejected");
   }
   await page.screenshot({path:"screenshots/music-"+label+".png",fullPage:true});
   await open("/KANEKANKANARTIST");
   assert.match(await page.locator("h1").innerText(),/KANEKAN/);
   assert.equal(await page.locator(".bio-chapter").count(),6,"Full biography missing");
   assert.equal(await page.locator(".platform-link").count(),6,"Official artist channels missing");
   assert.ok(await page.locator("#vionaLanguageButton").isVisible());
   await noOverflow("/KANEKANKANARTIST");
   await page.screenshot({path:"screenshots/artist-"+label+".png",fullPage:true});
   for(const route of ["/bots","/web","/code"]){
    await open(route);assert.equal(await page.locator(".category-item").count(),3,"Category options missing: "+route);
    assert.equal(await page.locator(".liquid-drop").count(),0);
    await noOverflow(route);
   }
   await open("/careers");assert.ok(await page.locator("#v2CareersForm").isVisible());await noOverflow("/careers");
   await open("/support");assert.equal(await page.locator(".support-grid article").count(),3);await noOverflow("/support");
   await open("/classic");assert.ok(await page.locator("#products").count()===1,"Classic fallback lost");
   await open("/admin-console");
   await page.waitForFunction(()=>document.querySelector("#adminNotice")?.textContent?.length>0,null,{timeout:12000});
   assert.ok(await page.locator("#adminLogin").isVisible(),"Private admin login missing");
   assert.ok(!await page.locator("#adminDashboard").isVisible(),"Admin data exposed without Google session");
   assert.deepEqual(errors,[],"Page exceptions: "+errors.join("; "));
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
