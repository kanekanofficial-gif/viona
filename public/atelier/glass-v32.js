"use strict";
(()=>{
 const svgNS="http://www.w3.org/2000/svg";
 const defs=document.createElementNS(svgNS,"svg");
 defs.setAttribute("aria-hidden","true");
 defs.setAttribute("width","0");defs.setAttribute("height","0");
 defs.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden";
 defs.innerHTML='<defs><filter id="viona-glass-ripple" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.007 0.009" numOctaves="2" seed="92" result="noise"><animate attributeName="baseFrequency" values="0.007 0.009;0.010 0.007;0.007 0.009" dur="7s" repeatCount="indefinite"/></feTurbulence><feGaussianBlur in="noise" stdDeviation="2" result="smooth"/><feDisplacementMap in="SourceGraphic" in2="smooth" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
 if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)defs.querySelector("animate")?.remove();
 document.body.prepend(defs);
 const avoid=".dialog,.order-card,.music-form input,.glass-refraction";
 function apply(root){
  for(const element of root.querySelectorAll(".glass")){
   if(element.matches(avoid)||element.classList.contains("has-refraction")||element.closest(".dialog"))continue;
   element.classList.add("has-refraction");
   const surface=document.createElement("span");
   surface.className="glass-refraction";
   surface.setAttribute("aria-hidden","true");
   element.prepend(surface);
  }
 }
 apply(document);
 const containers=["#productList","#catCards",".role-grid",".support-grid"];
 for(const selector of containers){
  const host=document.querySelector(selector);
  if(!host)continue;
  new MutationObserver(()=>apply(host)).observe(host,{childList:true});
 }
})();
