"use strict";
/* Progressive original-image upgrade.
 * Until PNG sources are uploaded, the current low-resolution bundled assets stay in place.
 * The originals remain untouched. The browser loads them only when the full-size
 * viona-original.png is present, so incomplete assets never break the storefront.
 */
(()=>{
 const base="/assets/";
 const original="viona-original.png";
 const icons={
  telegram:"viona-telegram.png",
  discord:"viona-discord.png",
  max:"viona-max.png",
  game:"viona-gamepad.png",
  card:"viona-mir.png",
  sber:"viona-sberpay.png",
  sbp:"viona-sbp.png",
  tbank:"viona-tbank.png"
 };
 const ready=()=>{
  const mark=base+original;
  fetch(mark,{method:"HEAD",cache:"no-store",credentials:"same-origin"})
   .then(response=>{
    if(!response.ok||!/image\/png/i.test(response.headers.get("content-type")||""))return;
    const proof=new Image();
    proof.decoding="async";
    proof.onload=()=>{
     if(proof.naturalWidth<512||proof.naturalHeight<512)return;
     document.querySelectorAll(".nx-brand-logo,.nx-mark-original img,.footer-brand img")
       .forEach(img=>{img.src=mark;img.removeAttribute("srcset");img.style.imageRendering="auto"});
     const holder=document.querySelector(".nx-screen-symbol");
     if(holder&&!holder.classList.contains("nx-screen-original")){
      holder.classList.add("nx-screen-original");
      const logo=document.createElement("img");
      logo.src=mark;logo.alt="";logo.decoding="async";
      logo.width=260;logo.height=260;
      holder.append(logo);
     }
     const iconLink=document.querySelector('link[rel="icon"]');
     if(iconLink){iconLink.href=mark;iconLink.type="image/png"}
    };
    proof.src=mark;
    for(const [kind,file] of Object.entries(icons)){
     const url=base+file;
     const image=new Image();
     image.decoding="async";
     image.onload=()=>{
      if(image.naturalWidth<160||image.naturalHeight<100)return;
      const style=document.createElement("style");
      style.dataset.vionaOriginal=kind;
      const selector=".viona-brand.viona-brand-"+kind;
      style.textContent=selector+"{background-image:url('"+url+"')!important;background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important;image-rendering:auto!important;filter:none!important}"
       +(kind==="max"||kind==="game"?".product-icon "+selector+"{width:82px!important;height:82px!important;flex-basis:82px!important}.detail-glyph "+selector+"{width:170px!important;height:170px!important}":"");
      document.head.append(style);
     };
     image.src=url;
    }
   })
   .catch(()=>{ /* Keep the bundled fallback and never block the site. */ });
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});else ready();
})();
