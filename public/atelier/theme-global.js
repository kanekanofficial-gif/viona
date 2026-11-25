"use strict";
(()=>{
 const KEY="viona-atelier-theme";
 let theme="dark";
 try{const value=JSON.parse(localStorage.getItem(KEY));if(value==="light")theme="light"}catch{}
 document.documentElement.dataset.theme=theme;
 if(document.querySelector("#changeTheme"))return;
 const header=document.querySelector(".site-nav,.sound-nav,.artist-nav");
 if(!header)return;
 const b=document.createElement("button");b.type="button";b.className="theme-control";b.id="changeTheme";b.setAttribute("aria-label","Сменить светлую и тёмную тему");b.title="Сменить тему";
 b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M20.3 15.4A8.8 8.8 0 0 1 8.6 3.7a8.8 8.8 0 1 0 11.7 11.7Z"/></svg>';
 const selector=header.querySelector(".locale-switcher");
 if(selector)header.insertBefore(b,selector);else header.appendChild(b);
 b.addEventListener("click",()=>{
  const next=document.documentElement.dataset.theme==="light"?"dark":"light";
  document.documentElement.dataset.theme=next;
  try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}
  location.reload();
 });
})();
