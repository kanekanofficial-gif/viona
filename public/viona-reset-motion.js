"use strict";
/* VIONA Reboot: stable, non-overlapping transitions, accessible motion. */
(()=>{
 const root=document.documentElement;
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const navLinks=[...document.querySelectorAll(".nx-sidebar-nav a")];
 const sections=["home","catalog","studio","contact"].map(id=>document.getElementById(id)).filter(Boolean);
 function markActive(id){navLinks.forEach(a=>a.classList.toggle("nx-nav-active",a.getAttribute("href")==="#"+id))}
 const navObserver=typeof IntersectionObserver==="function"?new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  if(visible.length)markActive(visible[0].target.id);
 },{rootMargin:"-15% 0px -60% 0px",threshold:[0,.1,.3,.6]}):null;
 sections.forEach(el=>navObserver?.observe(el));
 const reveal=[...document.querySelectorAll(".nx-hero-copy,.nx-hero-screen,.nx-metrics>div,.section-top,.nx-discovery,.studio-grid article,.contact-copy,.contact form")];
 if(!reduced&&typeof IntersectionObserver==="function"){
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add("nx-visible");observer.unobserve(entry.target)}
  },{threshold:.08,rootMargin:"0px 0px 65px 0px"});
  reveal.forEach(el=>{el.classList.add("nx-reveal");observer.observe(el)});
  root.classList.add("nx-motion-ready");
 }else reveal.forEach(el=>el.classList.add("nx-visible"));
 const cover=document.getElementById("products");
 if(cover&&!reduced&&typeof IntersectionObserver==="function"){
  const productObserver=new IntersectionObserver(entries=>{
   for(const e of entries)if(e.isIntersecting){e.target.classList.add("nx-visible");productObserver.unobserve(e.target)}
  },{threshold:.08,rootMargin:"0px 0px 60px 0px"});
  const observeProducts=()=>cover.querySelectorAll(".product:not(.nx-reveal)").forEach(el=>{el.classList.add("nx-reveal");productObserver.observe(el)});
  observeProducts();
  if(typeof MutationObserver==="function")new MutationObserver(observeProducts).observe(cover,{childList:true});
 }
 document.addEventListener("click",e=>{
  const link=e.target.closest(".nx-sidebar-nav a,.mobile-bar a");
  if(link&&link.getAttribute("href")?.startsWith("#"))markActive(link.getAttribute("href").slice(1));
 });
})();
