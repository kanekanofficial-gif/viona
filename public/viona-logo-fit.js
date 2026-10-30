"use strict";
/*
 * Separate the eight owner-supplied logos in the browser from the old 4x2 atlas.
 * Transparency is cropped per cell. No background-position zoom tricks.
 * Fail closed to the existing atlas if Canvas is unavailable.
 */
(()=>{
 const url="/assets/viona-user-logos.webp?v=18";
 const names=["telegram","discord","max","game","card","sbp","sber","tbank"];
 const image=new Image();
 image.decoding="async";
 image.onload=()=>{
  try{
   if(!image.naturalWidth||!image.naturalHeight)return;
   const cw=Math.floor(image.naturalWidth/4),ch=Math.floor(image.naturalHeight/2);
   if(cw<32||ch<32)return;
   const rules=[];
   const atlas=document.createElement("canvas");
   atlas.width=cw;atlas.height=ch;
   const ctx=atlas.getContext("2d",{willReadFrequently:true});
   if(!ctx)return;
   names.forEach((name,i)=>{
    const col=i%4,row=Math.floor(i/4);
    ctx.clearRect(0,0,cw,ch);
    ctx.drawImage(image,col*cw,row*ch,cw,ch,0,0,cw,ch);
    const data=ctx.getImageData(0,0,cw,ch).data;
    let minX=cw,minY=ch,maxX=-1,maxY=-1;
    for(let y=0;y<ch;y++){
     for(let x=0;x<cw;x++){
      if(data[(y*cw+x)*4+3]<=12)continue;
      minX=Math.min(minX,x);minY=Math.min(minY,y);
      maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
     }
    }
    if(maxX<minX||maxY<minY)return;
    const pad=3;
    const sx=Math.max(0,minX-pad),sy=Math.max(0,minY-pad);
    const sw=Math.min(cw-sx,maxX-sx+pad+1),sh=Math.min(ch-sy,maxY-sy+pad+1);
    const cropped=document.createElement("canvas");
    cropped.width=sw;cropped.height=sh;
    const dest=cropped.getContext("2d");
    if(!dest)return;
    dest.drawImage(atlas,sx,sy,sw,sh,0,0,sw,sh);
    const dataUrl=cropped.toDataURL("image/webp",.95);
    rules.push('.viona-brand-'+name+'{background-image:url("'+dataUrl+'")!important;background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important}');
   });
   if(rules.length!==8)return;
   const style=document.createElement("style");
   style.id="viona-separate-logo-images";
   style.textContent=rules.join("\n");
   document.head.append(style);
   document.documentElement.classList.add("viona-logos-separated");
  }catch(err){
   // A failed decode must never break browsing or checkout.
   console.warn("VIONA logos fallback:",err?.name||"decode");
  }
 };
 image.src=url;
})();