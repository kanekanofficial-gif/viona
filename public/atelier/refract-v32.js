"use strict";
(()=>{
 // Place the SVG filter directly in the document so url(#viona-ripple) resolves
 // locally. The filter applies to background pixels via backdrop-filter only,
 // while all readable content remains a separate undistorted layer.
 if(document.getElementById("viona-ripple"))return;
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
 svg.setAttribute("aria-hidden","true");
 svg.setAttribute("focusable","false");
 svg.style.cssText="position:absolute;pointer-events:none;width:0;height:0;overflow:hidden";
 svg.innerHTML='<defs><filter id="viona-ripple" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">'+
   '<feTurbulence type="fractalNoise" baseFrequency="0.007 0.009" numOctaves="2" seed="29" result="noise">'+
   '<animate attributeName="baseFrequency" values="0.007 0.009;0.010 0.006;0.007 0.009" dur="8s" repeatCount="indefinite"/>'+
   '</feTurbulence><feGaussianBlur in="noise" stdDeviation="1.5" result="smooth"/>'+
   '<feDisplacementMap in="SourceGraphic" in2="smooth" scale="28" xChannelSelector="R" yChannelSelector="G"/>'+
   '</filter></defs>';
 if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  const animation=svg.querySelector("animate");if(animation)animation.remove();
 }
 document.body.prepend(svg);
})();
