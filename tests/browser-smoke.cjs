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
    const d=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll("body *")].map(e=>{const b=e.getBoundingClientRect();return {tag:e.tagName,id:e.id,cls:typeof e.className==="string"?e.className.slice(0,40):"",left:b.left,right:b.right}}).filter(x=>x.left< -10||x.right>innerWidth+10).slice(0,8)}));
    assert.ok(d.scroll<=d.width+2,route+" "+label+" overflows: "+JSON.stringify(d));
   };
   await open("/");
   if(await page.locator("#welcome").isVisible())await page.locator("#closeWelcome").click();
   await page.waitForFunction(()=>document.querySelectorAll(".product-card").length>=5,null,{timeout:12000});
   assert.equal(await page.locator(".nx-sidebar").count(),0,"Old sidebar remains on rebuilt page");
   assert.ok(await page.locator(".glass").count()>=10,"Layered glass components missing");
   assert.equal(await page.locator("#liquid-distortion").count(),1,"Missing glass distortion filter");
   assert.ok(await page.locator(".liquid-drop").count()>=4,"Fluid droplets missing");
   await noOverflow("/");
   await page.screenshot({path:"screenshots/atelier-"+label+".png",fullPage:true});
   await page.locator('#productFilters [data-filter="Боты"]').click();
   assert.equal(await page.locator(".product-card").count(),3,"Bots category filter");
   await page.locator('#productFilters [data-filter="Все"]').click();
   await page.locator("#searchProducts").fill("Telegram");
   assert.equal(await page.locator(".product-card").count(),1,"Search result is incorrect");
   await page.locator("#searchProducts").fill("");
   if(label==="desktop"){
    await page.locator('[data-product="1"]').first().click();
    assert.ok(await page.locator("#overlay").isVisible(),"Product detail dialog missing");
    await page.locator('[data-add="1"]').click();
    assert.equal(await page.locator("#cartCount").textContent(),"1","Cart did not update");
    await page.locator("#goCheckout").click();
    assert.match(await page.locator("#dialogContent").innerText(),/Telegram|VIONA ID/i,"Not signed-in checkout did not request login");
    await page.locator("#closeDialog").click();
   }
   await page.locator("#changeTheme").click();assert.equal(await page.locator("html").getAttribute("data-theme"),"light");
   await page.locator("#changeTheme").click();assert.equal(await page.locator("html").getAttribute("data-theme"),"dark");
   await open("/music");
   assert.ok(await page.locator("#v2MusicForm").isVisible());
   assert.equal(await page.locator('[name="lyricsMode"]').count(),2,"Own lyrics and commission modes missing");
   assert.equal(await page.locator('[name="voice"]').count(),2,"Voice options missing");
   await noOverflow("/music");
   await page.screenshot({path:"screenshots/music-"+label+".png",fullPage:true});
   await open("/KANEKANKANARTIST");
   assert.match(await page.locator("h1").innerText(),/KANEKAN/);
   assert.equal(await page.locator(".bio-chapter").count(),6,"Full biography chapters missing");
   assert.match(await page.locator("#vocal").innerText(),/ИИ-вокал/);
   await noOverflow("/KANEKANKANARTIST");
   await page.screenshot({path:"screenshots/artist-"+label+".png",fullPage:true});
   for(const r of ["/bots","/web","/code"]){
    await open(r);assert.equal(await page.locator(".category-item").count(),3,"Category options missing: "+r);await noOverflow(r);
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
