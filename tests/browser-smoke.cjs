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
   assert.ok(await page.locator(".v2-home-links").isVisible(),"VIONA 2.0 service area missing");
   assert.ok(await page.locator('.v2-home-links a[href="/music"]').count()>0,"SoundLab homepage link missing");
   assert.ok(layout.productCount>=5,label+" catalog did not load demo products");
   assert.ok(layout.logo.natural>=layout.logo.width,"logo is being enlarged beyond source resolution");
   if(width>=1000){
    assert.ok(layout.main.y>=layout.sidebar.bottom-3,"VIONA 2.0 header overlaps main content");
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

    /* VIONA ID preferences: local profile, theme, density, accessibility and tabs. */
    await page.locator("#profileOpen").click();
    await page.locator("#vionaSettingsEntryLocal").click();
    assert.ok(await page.locator("#vionaSettingsOverlay").isVisible(),"settings dialog did not open");
    assert.equal(await page.locator('#vionaSettingsOverlay [role="tab"]').count(),3);
    await page.locator('[data-settings-theme="dark"]').click();
    assert.equal(await page.locator("html").getAttribute("data-theme"),"dark");
    assert.equal(await page.locator("#vionaThemeMode").inputValue(),"dark","header theme selector wasn't updated");
    await page.locator('[data-settings-density="compact"]').click();
    assert.equal(await page.locator("html").getAttribute("data-pref-density"),"compact");
    await page.locator('[data-settings-font="large"]').click();
    assert.equal(await page.locator("html").getAttribute("data-pref-font"),"large");
    await page.locator('[data-settings-contrast="high"]').click();
    assert.equal(await page.locator("html").getAttribute("data-pref-contrast"),"high");
    await page.locator('.vs-segment[data-settings-motion="reduce"]').click();
    assert.equal(await page.locator("html").getAttribute("data-pref-motion"),"reduce");
    await page.locator('[data-settings-tab="interface"]').click();
    await page.locator("#vionaSettingsBadge").uncheck();
    assert.equal(await page.locator("html").getAttribute("data-pref-badge"),"off");
    await page.locator('[data-settings-start="catalog"]').click();
    assert.equal(await page.locator("html").getAttribute("data-pref-start"),"catalog");
    await page.locator('[data-settings-tab="data"]').click();
    const downloadPromise=page.waitForEvent("download");
    await page.locator('[data-settings-command="export"]').click();
    const exportData=await downloadPromise;
    assert.equal(exportData.suggestedFilename(),"viona-local-preferences.json");
    await page.locator(".vs-close").click();
    assert.ok(!await page.locator("#vionaSettingsOverlay").count(),"settings dialog not removed");
    await page.locator("#v15Close").click();
    await page.reload({waitUntil:"domcontentloaded"});
    assert.equal(await page.locator("html").getAttribute("data-theme"),"dark","theme wasn't persisted");
    assert.equal(await page.locator("html").getAttribute("data-pref-density"),"compact","density wasn't persisted");
    assert.equal(await page.locator("html").getAttribute("data-pref-font"),"large","font size wasn't persisted");
    assert.equal(await page.locator("html").getAttribute("data-pref-badge"),"off","badge preference wasn't persisted");
    await page.locator("#profileOpen").click();
    await page.locator("#vionaSettingsEntryLocal").click();
    await page.locator('[data-settings-theme="auto"]').click();
    await page.locator('[data-settings-density="comfortable"]').click();
    await page.locator('[data-settings-font="normal"]').click();
    await page.locator('[data-settings-contrast="normal"]').click();
    await page.locator('.vs-segment[data-settings-motion="system"]').click();
    await page.locator(".vs-close").click();
    await page.locator("#v15Close").click();

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
    const serviceAccentResolved=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue("--vt-accent").trim());
    assert.equal(serviceAccentResolved,"#ff70b7","code-edit page must use pink femboy accent");

    /* VIONA Studio end-to-end: demos, builder, workspace, boards, code diff, bundles and editor. */
    await page.goto("http://127.0.0.1:4173/studio?view=lab",{waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>document.querySelector('#vionaBotBuilder #vbChatForm')!==null,{timeout:10000});
    assert.ok(await page.locator("#vstTabs [data-vst-tab]").count()>=8);
    /* The Telegram simulation accepts user-typed commands and saves editable blueprints. */
    await page.locator('#vbCommandForm [name="name"]').fill("/shop");
    await page.locator('#vbCommandForm [name="reply"]').fill("Каталог для {name}. Выбирай товары.");
    await page.locator('#vbCommandForm button[type="submit"]').click();
    assert.match(await page.locator(".vb-command-list").first().innerText(),/\/shop/);
    await page.locator('#vbChatForm [name="message"]').fill("/shop");
    await page.locator('#vbChatForm button[type="submit"]').click();
    assert.match(await page.locator("#vbChatLog").innerText(),/Каталог для Алекс/);
    await page.locator('#vbCommandForm [name="name"]').fill("/photo");
    await page.locator('#vbCommandForm [name="reply"]').fill("Вот демонстрационное фото.");
    await page.locator('#vbCommandForm [name="media"]').selectOption("photo");
    await page.locator("#vbMediaFile").setInputFiles({
      name:"tiny.png",mimeType:"image/png",
      buffer:Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/qB0AAAAASUVORK5CYII=","base64")
    });
    await page.waitForFunction(()=>document.querySelector("#vbImageUploadStatus")?.textContent.includes("Фото готово"),null,{timeout:6000});
    await page.locator('#vbCommandForm button[type="submit"]').click();
    await page.locator('#vbChatForm [name="message"]').fill("/photo");
    await page.locator('#vbChatForm button[type="submit"]').click();
    await page.locator(".vb-chat-photo").last().waitFor({state:"visible",timeout:5000});
    await page.locator('.vb-nav [data-vb-panel="buttons"]').click();
    await page.locator('#vbSelectedCommand').selectOption("/start");
    await page.locator('#vbButtonForm [name="label"]').fill("Магазин");
    await page.locator('#vbButtonForm [name="target"]').fill("/shop");
    await page.locator('#vbButtonForm button[type="submit"]').click();
    await page.locator('[data-vb-demo="/start"]').click();
    await page.locator('#vbChatLog [data-vb-target="/shop"]').last().click();
    assert.match(await page.locator("#vbChatLog").innerText(),/Каталог для Алекс/);
    await page.locator('.vb-nav [data-vb-panel="triggers"]').click();
    await page.locator('#vbTriggerForm [name="keyword"]').fill("скидка");
    await page.locator('#vbTriggerForm [name="reply"]').fill("Скидку согласуем отдельно.");
    await page.locator('#vbTriggerForm button[type="submit"]').click();
    await page.locator('#vbChatForm [name="message"]').fill("Есть скидка?");
    await page.locator('#vbChatForm button[type="submit"]').click();
    assert.match(await page.locator("#vbChatLog").innerText(),/Скидку согласуем отдельно/);
    await page.locator('[data-vb-action="undo"]').click();
    assert.equal(await page.evaluate(()=>window.VionaBotBuilder.info().triggers),1,"undo should remove the new trigger");
    await page.locator('[data-vb-action="redo"]').click();
    assert.equal(await page.evaluate(()=>window.VionaBotBuilder.info().triggers),2,"redo should restore the trigger");
    await page.locator('.vb-nav [data-vb-panel="scenarios"]').click();
    assert.match(await page.locator(".vb-flow-map").innerText(),/\/shop/);
    await page.locator('.vb-nav [data-vb-panel="check"]').click();
    assert.match(await page.locator(".vb-brief").innerText(),/\/shop/);
    const briefDownload=page.waitForEvent("download");
    await page.locator('[data-vb-action="download"]').click();
    const briefFile=await briefDownload;
    assert.equal(briefFile.suggestedFilename(),"viona-telegram-bot-brief.txt");
    await page.screenshot({path:"screenshots/bot-builder-"+label+".png",fullPage:true});
    await page.reload({waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>document.querySelector('#vionaBotBuilder')!==null,{timeout:10000});
    assert.match(await page.locator(".vb-command-list").first().innerText(),/\/shop/,"bot command not persisted");
    await page.locator('.vb-nav [data-vb-panel="order"]').click();
    await page.route("**/api/request",route=>route.fulfill({
      status:202,contentType:"application/json",body:JSON.stringify({message:"Демо: не сохранено"})
    }));
    await page.locator('#vbOrderForm [name="contact"]').fill("@viona_test");
    await page.locator('#vbOrderForm [name="agreement"]').check();
    await page.locator('#vbOrderForm button[type="submit"]').click();
    await page.waitForFunction(()=>document.querySelector("#vbOrderStatus")?.textContent.includes("НЕ сохранил заявку"),null,{timeout:10000});
    assert.match(await page.locator("#vbOrderStatus").innerText(),/НЕ сохранил заявку/);
    await page.unroute("**/api/request");

    await page.locator('#vstTabs [data-vst-tab="builder"]').click();
    await page.locator('#vstBuildForm [name="title"]').fill("Тестовый проект VIONA");
    await page.locator('#vstBuildForm [name="details"]').fill("Подключить меню команд и базу данных");
    await page.locator('#vstBuildForm [name="features"][value="Авторизация"]').check();
    await page.locator('#vstBuildForm button[value="draft"]').click();
    assert.ok(await page.locator("#vstContent").getByText("Тестовый проект VIONA").count()>0);
    await page.locator('#vstNoteForm [name="note"]').fill("Черновик для проверки");
    await page.locator('#vstNoteForm button[type="submit"]').click();
    assert.match(await page.locator("#vstContent").innerText(),/Черновик для проверки/);
    await page.locator("#vstFile").setInputFiles({name:"notes.txt",mimeType:"text/plain",buffer:Buffer.from("Original code file for VIONA Studio")});
    await page.getByRole("button",{name:"Скачать"}).waitFor({timeout:5000});
    await page.screenshot({path:"screenshots/studio-workspace.png",fullPage:true});
    await page.locator('#vstTabs [data-vst-tab="boards"]').click();
    await page.locator('#vstBoardForm [name="board"]').fill("Моя доска");
    await page.locator('#vstBoardForm button[type="submit"]').click();
    await page.locator('#vstBoardNote [name="note"]').fill("Идея для нового проекта");
    await page.locator('#vstBoardNote button[type="submit"]').click();
    assert.match(await page.locator("#vstContent").innerText(),/Идея для нового проекта/);
    await page.locator("#vstPin").selectOption("1");
    await page.locator("[data-vst-pin]").click();
    assert.match(await page.locator("#vstContent").innerText(),/Telegram Bot Starter/);
    await page.locator('#vstTabs [data-vst-tab="diff"]').click();
    await page.locator("[data-vst-run-diff]").click();
    assert.ok(await page.locator(".vst-diff-line.add").count()>0);
    assert.ok(await page.locator(".vst-diff-line.remove").count()>0);
    await page.locator('#vstTabs [data-vst-tab="dashboard"]').click();
    await page.locator('[data-vst-widget-down="projects"]').click();
    assert.equal(await page.locator('.vst-dashboard-item').first().getAttribute("data-vst-drag"),"orders");
    await page.locator('#vstTabs [data-vst-tab="editor"]').click();
    await page.locator('[data-vst-editor="font"]').selectOption("18");
    assert.equal(await page.locator("#vstCode").evaluate(x=>x.style.fontSize),"18px");
    await page.locator('#vstTabs [data-vst-tab="bundles"]').click();
    await page.locator('[data-vst-bundle="1"]').check();
    assert.match(await page.locator("#vstContent").innerText(),/1 товара/);
    await page.locator("#vstPrivacy").click();
    assert.equal(await page.locator("html").getAttribute("data-viona-private"),"on");
    await page.keyboard.press("Control+k");
    assert.ok(await page.locator("#vionaCommandOverlay").isVisible());
    await page.locator("#vgcSearch").fill("LAB");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#vionaCommandOverlay").count(),0);
    await page.screenshot({path:"screenshots/studio-bundles.png",fullPage:true});
    await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
    await page.waitForTimeout(600);
    assert.equal(await page.locator(".vg-hub-card").count(),8,"home should link eight new tools");
    assert.ok(await page.locator(".fluid-edge>.vg-drop").count()>=2,"no flowing water edge elements");
    await page.locator("#profileOpen").click();
    await page.locator("#vionaSettingsEntryLocal").click();
    assert.equal(await page.locator(".vs-preview-card").count(),2,"motion previews missing");
    await page.locator("#vionaSettingsOverlay .vs-dialog").waitFor({state:"visible"});
    await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector("#vionaSettingsOverlay .vs-dialog")).opacity)>.99,null,{timeout:5000});
    assert.ok(await page.locator("#vionaSettingsOverlay .vs-dialog").isVisible());
    await page.screenshot({path:"screenshots/settings-glass.png"});
    await page.locator(".vs-close").click();
    await page.locator("#v15Close").click();


   }

   if(width===390){
    await page.locator("#profileOpen").click();
    await page.locator("#vionaSettingsEntryLocal").click();
    assert.ok(await page.locator("#vionaSettingsOverlay .vs-dialog").isVisible(),"mobile preferences not visible");
    await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector("#vionaSettingsOverlay .vs-dialog")).opacity)>.99,null,{timeout:5000});
    const ui=await page.evaluate(()=>{
     const dlg=document.querySelector("#vionaSettingsOverlay .vs-dialog").getBoundingClientRect();
     return{left:dlg.left,right:dlg.right,windowWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth};
    });
    assert.ok(ui.left>=-1&&ui.right<=ui.windowWidth+1,"settings overflow on mobile");
    await page.screenshot({path:"screenshots/settings-mobile.png"});
    await page.locator(".vs-close").click();
    await page.locator("#v15Close").click();
   }
   if(width===820||width===390){
    await page.goto("http://127.0.0.1:4173/studio?view=lab",{waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>document.querySelector("#vionaBotBuilder #vbChatForm")!==null,{timeout:10000});
    const docWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
    assert.ok(docWidth<=width+1,label+" Telegram Builder has horizontal overflow ("+docWidth+")");
    await page.locator('#vbChatForm [name="message"]').fill("/help");
    await page.locator('#vbChatForm button[type="submit"]').click();
    assert.match(await page.locator("#vbChatLog").innerText(),/Доступные команды:/);
    await page.screenshot({path:"screenshots/bot-builder-"+label+".png",fullPage:true});
   }
   /* An unlisted admin page never reveals orders before Google authentication. */
   await page.goto("http://127.0.0.1:4173/admin-console",{waitUntil:"domcontentloaded"});
   await page.waitForFunction(()=>document.querySelector("#adminNotice")?.textContent?.length>0,null,{timeout:8000});
   assert.ok(await page.locator("#adminLogin").isVisible(),"Google admin login screen missing");
   assert.ok(!await page.locator("#adminDashboard").isVisible(),"admin orders must be private");
   assert.match(await page.locator("h1").first().innerText(),/Управление заказами/);
   if(width===1440)await page.screenshot({path:"screenshots/admin-login.png"});

   /* Regression: a dark order page must not render unreadable white cards. */
   if(width===1440){
    await page.goto("http://127.0.0.1:4173/payment/order/11111111-1111-4111-8111-111111111111",{waitUntil:"domcontentloaded"});
    await page.waitForSelector("#vionaResultRoot .vr-message",{timeout:8000});
    await page.evaluate(()=>{
     window.VionaTheme.choose("dark");
     document.querySelector("#vionaResultRoot").innerHTML=
      '<div class="vr-page"><section class="vr-hero">Заголовок</section><section class="vr-box">Заказ</section></div>';
    });
    const darkColors=await page.evaluate(()=>{
     const a=getComputedStyle(document.querySelector(".vr-box"));
     const b=getComputedStyle(document.querySelector(".vr-hero"));
     return {box:a.backgroundImage,hero:b.backgroundImage,text:a.color};
    });
    assert.match(darkColors.box,/rgb\(22, 37, 59\)/,"dark order box did not use its dark palette");
    assert.match(darkColors.hero,/rgb\(25, 42, 66\)/,"dark order hero did not use its dark palette");
    assert.equal(darkColors.text,"rgb(237, 246, 252)");
    await page.evaluate(()=>window.VionaTheme.choose("light"));
    const lightColors=await page.evaluate(()=>{
     const a=getComputedStyle(document.querySelector(".vr-box"));
     return {box:a.backgroundImage,text:a.color};
    });
    assert.match(lightColors.box,/rgb\(255, 255, 255\)/,"light order box did not use its light palette");
    assert.equal(lightColors.text,"rgb(28, 64, 84)");
   }
   assert.deepEqual(pageErrors,[],"uncaught page errors: "+pageErrors.join(" | "));
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
