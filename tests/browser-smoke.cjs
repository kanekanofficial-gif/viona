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
   if(layout.scrollWidth>width+1){
    const overflow=await page.evaluate(()=>[...document.querySelectorAll("body *")].map(el=>{
     const r=el.getBoundingClientRect();
     return{tag:el.tagName.toLowerCase(),id:el.id,className:typeof el.className==="string"?el.className.slice(0,80):"",right:r.right,left:r.left};
    }).filter(x=>x.right>innerWidth+1||x.left< -1).slice(0,20));
    console.log(label+" overflow: "+JSON.stringify(overflow));
   }
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
    
    const theme=page.locator("#vionaThemeMode");
    await theme.selectOption("dark");
    assert.equal(await page.locator("html").getAttribute("data-theme"),"dark","dark theme did not activate");
    await theme.selectOption("light");
    assert.equal(await page.locator("html").getAttribute("data-theme"),"light","light theme did not activate");
    await page.emulateMedia({colorScheme:"dark"});
    await theme.selectOption("auto");
    assert.equal(await page.locator("html").getAttribute("data-theme"),"dark","system dark mode not detected");
    await page.emulateMedia({colorScheme:"light"});
    await page.waitForFunction(()=>document.documentElement.dataset.theme==="light",{timeout:3000});
    assert.equal(await page.locator("html").getAttribute("data-theme"),"light","system light mode not detected");
    assert.equal(await page.locator(".nx-requirements").count(),await page.locator(".product").count(),"all products need requirement lists");
    await page.locator(".product .nx-requirements summary").first().click();
    assert.ok(await page.locator(".product .nx-customize-form").first().isVisible(),"customization request form missing");
    await page.locator("#langTrigger").click();
    assert.ok(await page.locator("#langList").isVisible(),"language selector didn't open");
    await page.locator('[data-lang="en"]').click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(350);
    assert.equal(await page.locator("html").getAttribute("lang"),"en","language did not switch");

    await page.locator(".product-actions button[data-action='cart']").first().click();
    await page.locator("#cartOpen").click();
    await page.waitForTimeout(300);
    assert.ok(await page.locator("#panel").evaluate(e=>e.classList.contains("open")),"cart drawer failed to open");
    const checkoutOpen=page.locator("#checkoutOpen");
    assert.ok(await checkoutOpen.isVisible(),"checkout button missing");
    await checkoutOpen.click();
    assert.ok(await page.locator(".vx-checkout").isVisible(),"checkout did not open");
    await page.waitForTimeout(100);
    assert.match(await page.locator(".vx-title").innerText(),/Checkout/i,"English checkout title not translated");
    assert.match(await page.locator(".vx-card-method").innerText(),/Bank card/,"payment labels not translated");
    assert.match(await page.locator("#vionaSberFallback").innerText(),/T-Bank/i,"SberPay fallback link not translated");
    await page.locator("#v15Close").click();
    await page.locator("#langTrigger").click();
    await page.locator('[data-lang="femboy"]').click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(350);
    assert.equal(await page.locator("html").getAttribute("data-world"),"femboy");
    const pink=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue("--vt-accent").trim());
    assert.equal(pink,"#ff70b7","femboy theme must be pink-black");
    await page.goto("http://127.0.0.1:4173/code-edit",{waitUntil:"domcontentloaded"});
    await page.waitForTimeout(250);
    assert.ok(await page.locator("#codeEditForm").isVisible(),"separate code-edit page unavailable");
    assert.equal(await page.locator("html").getAttribute("data-world"),"femboy","code-edit locale not shared");
    const serviceAccent=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue("--accent").trim());
    assert.equal(serviceAccent,"var(--vt-accent,#e4e6e8)");
    const serviceAccentResolved=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue("--vt-accent").trim());
    assert.equal(serviceAccentResolved,"#ff70b7","code-edit page must use pink femboy accent");

   }
   assert.deepEqual(pageErrors,[],"uncaught page errors: "+pageErrors.join(" | "));
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
