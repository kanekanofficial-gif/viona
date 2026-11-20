"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 fs.mkdirSync("screenshots",{recursive:true});
 try{
  for(const [name,width,height] of [["desktop",1440,900],["tablet",820,1000],["mobile",390,844]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   const base="http://127.0.0.1:4173";
   async function open(path){await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:25000});await page.waitForLoadState("load");await page.waitForTimeout(120)}
   async function noOverflow(path){
    const result=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,window:innerWidth}));
    assert.ok(result.scroll<=result.window+2,path+" overflow "+result.scroll+" / "+result.window+" on "+name);
   }
   await open("/");
   const hire=page.locator("#hireOverlay");
   if(await hire.isVisible())await page.locator("#hireClose").click();
   await page.waitForFunction(()=>document.querySelectorAll(".product-item").length>=5,null,{timeout:9000}).catch(async err=>{
    console.error("Catalog load failed: ",JSON.stringify({
     jsErrors:errors,
     text:await page.locator("#productGrid").innerText().catch(()=>"<missing>"),
     apiStatus:await page.evaluate(async()=>fetch("/api/products").then(r=>r.status).catch(e=>e.message)),
     appScript:await page.evaluate(async()=>fetch("/rebuild/app.js?v=1").then(r=>r.status).catch(e=>e.message))
    }));throw err;
   });
   assert.ok(await page.locator("header.top-dock").isVisible(),"new root uses independent floating dock");
   assert.equal(await page.locator(".nx-sidebar").count(),0,"legacy sidebar leaked into rebuilt frontend");
   assert.ok(await page.locator(".glass-surface").count()>=6,"layered glass surfaces missing");
   assert.ok(await page.locator("#v3-refraction").count()===1,"refraction filter missing");
   assert.ok(await page.locator(".water-drop").count()>=5,"animated droplets missing");
   assert.ok(await page.locator('.showcase a[href="/bots"]').count()===1,"new catalog department missing");
   await noOverflow("/");
   await page.screenshot({path:"screenshots/liquid-"+name+".png",fullPage:true});
   await page.locator("#catalogFilters [data-category='Боты']").click();
   assert.equal(await page.locator(".product-item").count(),3,"bots filter is incorrect");
   await page.locator("#catalogFilters [data-category='Все']").click();
   await page.locator("#catalogSearch").fill("Telegram");
   assert.equal(await page.locator(".product-item").count(),1,"catalog search is incorrect");
   await page.locator("#catalogSearch").fill("");
   if(name==="desktop"){
    await page.locator("[data-view-product='1']").first().click();
    assert.ok(await page.locator("#modalScrim").isVisible(),"product detail must be a usable window");
    await page.locator("[data-add-cart='1']").click();
    assert.equal(await page.locator("#cartBadge").innerText(),"1","cart is not functional");
    assert.ok(await page.locator("#beginCheckout").isVisible(),"checkout action missing");
    await page.locator("#beginCheckout").click();
    assert.match(await page.locator("#modalBody").innerText(),/Telegram|аккаунт/,"unauthenticated checkout should request Telegram sign in");
    await page.locator("[data-close-modal]").first().click();
   }
   await page.locator("#themeToggle").click();
   assert.equal(await page.locator("html").getAttribute("data-theme"),"light");
   await page.locator("#themeToggle").click();
   assert.equal(await page.locator("html").getAttribute("data-theme"),"dark");
   await open("/music");
   assert.match(await page.locator("h1").innerText(),/Feel it/i);
   assert.ok(await page.locator("#v2MusicForm").isVisible());
   assert.ok(await page.locator('.sound-form input[name="voice"][value="female"]').count()===1);
   assert.ok(await page.locator('.sound-form [name="lyricsMode"][value="commission"]').count()===1);
   await noOverflow("/music");await page.screenshot({path:"screenshots/soundlab-"+name+".png",fullPage:true});
   await open("/KANEKANKANARTIST");
   assert.match(await page.locator("h1").innerText(),/KANEKAN/i);
   assert.ok(await page.locator(".chapter").count()>=6,"full artist story is missing");
   assert.match(await page.locator("#voice").innerText(),/ИИ-вокала/);
   await noOverflow("/KANEKANKANARTIST");
   await page.screenshot({path:"screenshots/artist-"+name+".png",fullPage:true});
   for(const area of ["/bots","/web","/code"]){
    await open(area);
    assert.equal(await page.locator(".cat-service").count(),3,"individual category is incomplete: "+area);
    await noOverflow(area);
   }
   await open("/careers");
   assert.ok(await page.locator("#v2CareersForm").count()===1,"career form missing");
   await noOverflow("/careers");
   await open("/classic");
   assert.ok(await page.locator("#products").count()===1,"legacy backup not available");
   await open("/admin-console");
   await page.waitForFunction(()=>document.querySelector("#adminNotice")?.textContent?.length>0,{timeout:12000});
   assert.ok(await page.locator("#adminLogin").isVisible(),"admin login missing");
   assert.ok(!await page.locator("#adminDashboard").isVisible(),"private admin data visible without sign-in");
   assert.deepEqual(errors,[],"uncaught page errors: "+errors.join("; "));
   await page.close();
  }
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});
