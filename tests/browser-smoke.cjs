"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {chromium}=require("playwright");

(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 fs.mkdirSync("screenshots",{recursive:true});
 try{
  for(const [label,width,height] of [["desktop",1440,900],["tablet",820,1000],["mobile",390,844]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const pageErrors=[];
   page.on("pageerror",error=>pageErrors.push(error.message));
   await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded",timeout:25000});
   await page.waitForTimeout(900);
   const layout=await page.evaluate(()=>{
    const box=selector=>{const r=document.querySelector(selector)?.getBoundingClientRect();return r?{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}:null};
    const img=document.querySelector(".nx-mark-original img");
    return{scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,
      sidebar:box(".nx-sidebar"),main:box(".nx-workspace"),copy:box(".nx-hero-copy"),screen:box(".nx-hero-screen"),
      topbar:box(".nx-topbar"),bottom:box(".mobile-bar"),logo:{natural:img?.naturalWidth||0,width:img?.getBoundingClientRect().width||0},
      productCount:document.querySelectorAll(".product").length,lang:document.documentElement.lang};
   });
   console.log(label+" layout: "+JSON.stringify(layout));
   assert.ok(layout.scrollWidth<=width+1,label+" has horizontal scroll");
   assert.ok(layout.copy&&layout.screen,"hero regions missing");
   assert.ok(layout.productCount>=5,label+" catalog did not load demo products");
   assert.ok(layout.logo.natural>=layout.logo.width,"logo is being enlarged beyond source resolution");
   if(width>=1000){
    assert.ok(layout.main.x>=layout.sidebar.right-3,"sidebar overlaps main");
    assert.ok(layout.screen.x>=layout.copy.right+5,"hero panels overlap");
   }else{
    assert.ok(layout.screen.y>=layout.copy.bottom+5,"stacked hero panels overlap");
    assert.ok(layout.bottom&&layout.bottom.height>40,"mobile navigation missing");
   }
   await page.screenshot({path:"screenshots/"+label+".png",fullPage:true});
   if(width===1440){
    await page.locator("#categories [data-category=\"Боты\"]").click();
    await page.waitForTimeout(80);
    assert.equal(await page.locator(".product").count(),3,"bot category does not filter correctly");
    await page.locator("#categories [data-category=\"Все\"]").click();
    await page.locator("#sortTrigger").click();
    await page.locator("#sortList [data-sort=\"price-asc\"]").click();
    assert.ok((await page.locator(".product").count())>=5,"sort did not preserve product cards");
    await page.locator("#langTrigger").click();
    assert.ok(await page.locator("#langList").isVisible(),"language selector didn't open");
    await page.locator('[data-lang="en"]').click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(350);
    assert.equal(await page.locator("html").getAttribute("lang"),"en","language did not switch");
    await page.locator("#cartOpen").click();
    await page.waitForTimeout(300);
    assert.ok(await page.locator("#panel").evaluate(e=>e.classList.contains("open")),"cart drawer failed to open");
   }
   assert.deepEqual(pageErrors,[],"uncaught page errors: "+pageErrors.join(" | "));
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
