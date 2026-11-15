"use strict";
/* Glass visuals, skeletons, hover previews and quick bar: enhancement only. */
(()=>{
 const doc=document.documentElement,qs=(s,root=document)=>root.querySelector(s);
 const host=document.body;
 const reduce=()=>matchMedia("(prefers-reduced-motion: reduce)").matches||doc.dataset.prefMotion==="reduce";
 const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;":"&quot;","'":"&#39;"}[c]));
 function fluid(target,delay){
  if(!target||target.dataset.vgWater)return;
  target.dataset.vgWater="1";target.dataset.vgDelay=delay;
  target.classList.add("fluid-edge");
  for(const cls of ["vg-waterfall-shine","vg-waterline","vg-drop"]){
   const span=document.createElement("span");span.className=cls;span.setAttribute("aria-hidden","true");target.append(span);
  }
 }
 function glass(target){
  if(!target||target.querySelector(":scope > .vg-shimmer"))return;
  target.classList.add("vg-gloss");
  const shine=document.createElement("span");shine.className="vg-shimmer";shine.setAttribute("aria-hidden","true");target.append(shine);
 }
 function enhance(){
  [qs(".nx-hero-screen"),qs(".nx-code-promo"),qs(".vst-hero")].forEach((x,i)=>fluid(x,String(i*2)));
  for(const [selector,offset] of [["#products .product",0],[".vg-hub-card",1],[".vst-card",2]]){
   document.querySelectorAll(selector).forEach((card,i)=>{
    if((i+offset)%3===0)fluid(card,String((i%3)*2));
    glass(card);
   });
  }
  for(const selector of [".nx-hero-copy",".nx-hero-screen",".vst-hero"]){const target=qs(selector);if(target)glass(target)}
 }
 let pending=false;
 const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhance()})};
 function skeleton(){
  const grid=qs("#products");if(!grid||grid.children.length)return;
  const node=document.createElement("div");node.className="vg-pending";node.setAttribute("aria-hidden","true");
  node.innerHTML=Array.from({length:3},()=>'<div class="vg-skeleton"><span></span><span></span><span></span><span></span></div>').join("");
  node.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(225px,1fr));gap:14px;grid-column:1/-1;";
  grid.append(node);
  setTimeout(()=>node.remove(),8000);
 }
 function quickBar(){
  if(!qs("#products")||qs(".vg-quickbar"))return;
  const el=document.createElement("nav");el.className="vg-quickbar";el.setAttribute("aria-label","Быстрые действия");
  el.innerHTML='<a href="/#catalog"><span aria-hidden="true">◫</span><span class="vg-short-label">Каталог</span></a>'+
   '<a href="/studio?view=lab"><span aria-hidden="true">◈</span><span class="vg-short-label">LAB</span></a>'+
   '<a href="/studio?view=workspace"><span aria-hidden="true">▦</span><span class="vg-short-label">Workspace</span></a>'+
   '<button type="button" data-command-open aria-label="Открыть командный центр"><span aria-hidden="true">⌘</span><span class="vg-short-label">Поиск</span></button>'+
   '<button type="button" id="vgQuickSettings" aria-label="Открыть настройки"><span aria-hidden="true">⚙</span></button>';
  host.append(el);
  el.querySelector("#vgQuickSettings").addEventListener("click",()=>{
   if(window.VionaSettings?.open)window.VionaSettings.open();
   else document.getElementById("profileOpen")?.click();
  });
 }
 function popup(){
  const preview=document.createElement("div");preview.className="vg-product-preview";
  preview.setAttribute("aria-hidden","true");preview.hidden=true;host.append(preview);
  function hide(){preview.hidden=true}
  function show(card){
   if(!card||reduce()||matchMedia("(hover:none)").matches)return;
   const text=qs("h3",card)?.textContent||"",desc=qs(".product>p",card)?.textContent||qs("p",card)?.textContent||"";
   const price=qs(".price",card)?.textContent||"";
   preview.innerHTML="<small>VIONA / QUICK PREVIEW</small><strong>"+safe(text)+"</strong><p>"+safe(desc.slice(0,150))+"</p><small>"+safe(price)+"</small>";
   preview.hidden=false;const box=card.getBoundingClientRect();const w=245;
   preview.style.left=Math.max(8,Math.min(innerWidth-w-8,box.right+13))+"px";
   preview.style.top=Math.max(8,Math.min(innerHeight-190,box.top+14))+"px";
  }
  document.addEventListener("pointerover",e=>{const el=e.target.closest("#products .product");if(el)show(el)},true);
  document.addEventListener("pointerout",e=>{const el=e.target.closest("#products .product");if(el&&!el.contains(e.relatedTarget))hide()},true);
  document.addEventListener("focusin",e=>{if(e.target.closest("#products .product .product-view"))show(e.target.closest(".product"));else hide()});
  document.addEventListener("scroll",hide,{passive:true});
 }
 function ripple(){
  document.addEventListener("pointerdown",e=>{
   if(reduce()||e.button!==0)return;
   const el=e.target.closest(".vst-btn,.vst-tabs button,.vg-quickbar button,.nx-topbar button,.product-actions button,.vs-overlay button");
   if(!el)return;const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
   el.classList.add("vg-ripple-host");
   const node=document.createElement("span");node.className="vg-ripple";
   node.style.setProperty("--vg-x",e.clientX-r.left+"px");node.style.setProperty("--vg-y",e.clientY-r.top+"px");
   el.append(node);node.addEventListener("animationend",()=>node.remove(),{once:true});setTimeout(()=>node.remove(),1100);
  },true);
 }
 function boot(){
  skeleton();quickBar();popup();ripple();enhance();
  const grid=qs("#products");if(grid)new MutationObserver(schedule).observe(grid,{childList:true});
  const studio=qs("#vstContent");if(studio)new MutationObserver(schedule).observe(studio,{childList:true});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
