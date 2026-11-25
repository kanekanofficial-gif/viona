"use strict";
(()=>{
 const svgNS="http://www.w3.org/2000/svg";
 const defs=document.createElementNS(svgNS,"svg");
 defs.setAttribute("aria-hidden","true");
 defs.setAttribute("width","0");defs.setAttribute("height","0");
 defs.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden";
 defs.innerHTML='<defs><filter id="viona-glass-ripple" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.007 0.009" numOctaves="1" seed="92" result="noise"></feTurbulence><feGaussianBlur in="noise" stdDeviation="2" result="smooth"/><feDisplacementMap in="SourceGraphic" in2="smooth" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
 if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)defs.querySelector("animate")?.remove();
 document.body.prepend(defs);
 const avoid=".dialog,.order-card,.music-form input,.glass-refraction";
 function apply(root){
  for(const element of root.querySelectorAll(".site-nav.glass")){
   if(element.matches(avoid)||element.classList.contains("has-refraction")||element.closest(".dialog"))continue;
   element.classList.add("has-refraction");
   const surface=document.createElement("span");
   surface.className="glass-refraction";
   surface.setAttribute("aria-hidden","true");
   element.prepend(surface);
  }
 }
 if(window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 768px)").matches)return;
 apply(document);
})();
