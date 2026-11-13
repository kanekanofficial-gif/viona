"use strict";
/* VIONA motion layer: pointer-driven glass refraction, reveal transitions and reduced-motion support. */
(()=>{
 const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const root=document.documentElement;
 root.classList.add("vg-motion-ready");
 const header=document.querySelector(".site-header");
 let scrollFrame=false;
 const updateHeader=()=>{scrollFrame=false;header?.classList.toggle("is-scrolled",window.scrollY>12)};
 window.addEventListener("scroll",()=>{if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateHeader)}},{passive:true});
 updateHeader();

 const reveal=[
  ".masthead-copy",".vg-glass-card",".hero-features>div",".section-top",
  ".market-controls",".category-bar",".product",".vg-editorial-inner",
  ".studio-grid article",".contact-copy",".contact form"
 ].join(",");
 const targets=[...document.querySelectorAll(reveal)];
 if(!reduce&&"IntersectionObserver"in window){
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){
    entry.target.classList.add("vg-visible");
    observer.unobserve(entry.target);
   }
  },{threshold:.08,rootMargin:"0px 0px 42px 0px"});
  targets.forEach((el,i)=>{el.classList.add("vg-reveal");el.style.transitionDelay=Math.min(i%4,3)*65+"ms";observer.observe(el)});
 }else targets.forEach(el=>el.classList.add("vg-visible"));

 const fine=window.matchMedia("(hover:hover) and (pointer:fine)").matches;
 if(!reduce&&fine){
  const scene=document.querySelector(".vg-hero-art"),card=scene?.querySelector(".vg-glass-card");
  let frame=false,x=0,y=0;
  scene?.addEventListener("pointermove",e=>{
   const r=scene.getBoundingClientRect();x=(e.clientX-r.left)/r.width-.5;y=(e.clientY-r.top)/r.height-.5;
   if(frame)return;frame=true;
   requestAnimationFrame(()=>{frame=false;if(!card)return;
    card.style.setProperty("--pointer-x",(x*8).toFixed(2)+"px");
    card.style.setProperty("--pointer-y",(y*8).toFixed(2)+"px");
    card.style.setProperty("--tilt-x",(x*5).toFixed(2)+"deg");
    card.style.setProperty("--tilt-y",(y*-5).toFixed(2)+"deg");
   });
  },{passive:true});
  scene?.addEventListener("pointerleave",()=>{if(!card)return;for(const p of ["--pointer-x","--pointer-y","--tilt-x","--tilt-y"])card.style.removeProperty(p)},{passive:true});

  const grid=document.getElementById("products");
  grid?.addEventListener("pointermove",e=>{
   const item=e.target.closest(".product");if(!item)return;
   const r=item.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
   item.style.setProperty("--card-x",(px*100).toFixed(1)+"%");
   item.style.setProperty("--card-y",(py*100).toFixed(1)+"%");
   item.style.setProperty("--tilt-x",((px-.5)*2.2).toFixed(2)+"deg");
   item.style.setProperty("--tilt-y",((.5-py)*2.2).toFixed(2)+"deg");
  },{passive:true});
  grid?.addEventListener("pointerleave",e=>{const item=e.target.closest(".product");if(item){item.style.removeProperty("--tilt-x");item.style.removeProperty("--tilt-y")}},{passive:true});
 }
 document.addEventListener("pointerdown",e=>{
  if(e.pointerType==="mouse"&&e.button!==0)return;
  const target=e.target.closest(".tool-button,.lang-trigger,.action-primary,.product-view,.product-actions button,.vx-method,.vg-editorial-link,.category-bar button");
  if(target)target.classList.add("vg-pressed");
 },{passive:true});
 const clear=()=>document.querySelectorAll(".vg-pressed").forEach(el=>el.classList.remove("vg-pressed"));
 document.addEventListener("pointerup",clear,{passive:true});document.addEventListener("pointercancel",clear,{passive:true});
})();
