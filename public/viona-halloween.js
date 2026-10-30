"use strict";
/* VIONA 18 — liquid interaction layer, accessible motion and intentional scroll reset. */
(()=>{
 const path=location.pathname.replace(/\/+$/,"")||"/";
 if(path!=="/"&&path!=="/index.html")return;
 // Browsers typically restore the prior scroll coordinate on reload and BFCache entry.
 // Reset only initial navigations to the homepage; in-page anchor navigation still works.
 try{history.scrollRestoration="manual"}catch{}
 const scrollHome=()=>{window.scrollTo({top:0,left:0,behavior:"instant"});document.documentElement.scrollTop=0;document.body.scrollTop=0};
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",scrollHome,{once:true});else scrollHome();
 window.addEventListener("pageshow",()=>{scrollHome();requestAnimationFrame(scrollHome);setTimeout(scrollHome,60)});
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const html=document.documentElement;
 html.classList.add("v18-ready");
 const language=html.dataset.world||"ru";
 const labels={
  ru:{headline:"Идея.<br><em>Код. Результат.</em>",detail:"Выбирай инструменты, создавай свои проекты и отслеживай каждый заказ.",sub:"Новые идеи рождаются ночью.",night:"НОЧНАЯ КОЛЛЕКЦИЯ",how:"Как это работает",buy:"Тестовые платежи — реальные деньги не списываются"},
  en:{headline:"Idea.<br><em>Code. Result.</em>",detail:"Discover tools, build your projects and track every order.",sub:"New ideas are born after dark.",night:"AFTER DARK COLLECTION",how:"How it works",buy:"Demo checkout — no real charges"},
  ja:{headline:"アイデア。<br><em>コード。完成。</em>",detail:"ツールを選び、プロジェクトを作り、注文を確認。",sub:"新しいアイデアは夜に生まれる。",night:"夜のセレクション",how:"仕組み",buy:"テスト決済：実際の請求はありません"},
  de:{headline:"Idee.<br><em>Code. Ergebnis.</em>",detail:"Entdecke Tools, entwickle Projekte und verfolge deine Bestellungen.",sub:"Neue Ideen entstehen in der Nacht.",night:"NACHTKOLLEKTION",how:"So funktioniert's",buy:"Testzahlungen ohne echte Abbuchung"},
  femboy:{headline:"Мечта.<br><em>Код. Волшебство.</em>",detail:"Выбирай инструменты, создавай проекты и следи за каждым заказом ♡",sub:"Милые идеи тоже рождаются ночью ✧",night:"НОЧНАЯ КОЛЛЕКЦИЯ",how:"Как это работает",buy:"Только тестовая оплата ♡"}
 };
 const t=labels[language]||labels.ru;
 const desc=document.querySelector(".v18-hero-screen p");
 const screenTitle=document.querySelector(".v18-hero-screen h2");
 if(screenTitle)screenTitle.innerHTML=t.headline;
 if(desc)desc.textContent=t.detail;
 const note=document.querySelector(".v18-hero-note small");
 if(note)note.textContent=t.sub;
 const action=document.querySelector(".hero-cta .action-link span:first-child");
 if(action)action.textContent=t.how;
 const kicker=document.querySelector(".market-intro>span:nth-child(2)");
 if(kicker)kicker.textContent=t.night;
 // Keep payment warning localized even when old translation dictionary is loaded.
 document.addEventListener("click",e=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a||a.getAttribute("href")==="#")return;
  // Navigation is handled by the browser's native anchors. Do not use JS scroll hacks.
 },{passive:true});
 if(reduced)return;
 const revealElements=[
  ".section-top",".market-controls",".category-bar",".studio-grid article",
  ".contact-copy",".contact form",".hero-features>div",".v18-editorial-inner"
 ];
 if("IntersectionObserver"in window){
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting){
     entry.target.classList.add("v18-inview");
     observer.unobserve(entry.target);
    }
   }
  },{rootMargin:"0px 0px 45px 0px",threshold:.06});
  document.querySelectorAll(revealElements.join(",")).forEach(el=>observer.observe(el));
 }
 const interactive=".tool-button,.lang-trigger,.action-primary,.product-view,.product-actions button,.vx-method,.v18-editorial-link,.category-bar button";
 // A short spring-like press highlight. Decorative elements cannot intercept clicks.
 document.addEventListener("pointerdown",e=>{
  if(e.pointerType==="mouse"&&e.button!==0)return;
  const target=e.target.closest(interactive);
  if(!target)return;
  target.classList.remove("v18-pressed");
  target.offsetWidth; // restart effect for repeated fast taps
  target.classList.add("v18-pressed");
 },{passive:true});
 document.addEventListener("pointerup",()=>document.querySelectorAll(".v18-pressed").forEach(x=>x.classList.remove("v18-pressed")),{passive:true});
 document.addEventListener("pointercancel",()=>document.querySelectorAll(".v18-pressed").forEach(x=>x.classList.remove("v18-pressed")),{passive:true});
 // Lightweight pointer-based refraction; never animates the payment page or touch devices.
 if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){
  const scene=document.querySelector(".v18-hero-art");
  const card=scene?.querySelector(".v18-hero-screen");
  let frame=false,x=0,y=0;
  scene?.addEventListener("pointermove",e=>{
   const rect=scene.getBoundingClientRect();
   x=(e.clientX-rect.left)/rect.width-.5;
   y=(e.clientY-rect.top)/rect.height-.5;
   if(frame)return;
   frame=true;
   requestAnimationFrame(()=>{
    frame=false;
    if(card){
     card.style.setProperty("--v18-mouse-x",(x*9).toFixed(2)+"px");
     card.style.setProperty("--v18-mouse-y",(y*9).toFixed(2)+"px");
    }
   });
  },{passive:true});
  scene?.addEventListener("pointerleave",()=>{
   card?.style.removeProperty("--v18-mouse-x");
   card?.style.removeProperty("--v18-mouse-y");
  },{passive:true});
 }
})();