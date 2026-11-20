"use strict";
/* VIONA 2.0 enhancement layer. Legacy checkout and order logic remain intact. */
(()=>{
 if(location.pathname!=="/")return;
 const $=q=>document.querySelector(q);
 const catalogArt={1:"catalog-telegram.svg",2:"catalog-portfolio.svg",3:"catalog-discord.svg",4:"catalog-game.svg",5:"catalog-landing.svg",6:"catalog-code.svg",7:"catalog-max.svg"};
 const grid=$("#products");
 function decorateProducts(){
  if(!grid)return;
  for(const card of grid.querySelectorAll(".product")){
   if(card.querySelector(".v2-catalog-art"))continue;
   const view=card.querySelector("[data-view]");
   const id=Number(view?.dataset.view);
   if(!catalogArt[id])continue;
   const image=document.createElement("img");
   image.src="/assets/"+catalogArt[id];
   image.alt="";
   image.className="v2-catalog-art";image.loading="lazy";image.decoding="async";
   card.prepend(image);
  }
 }
 if(grid){new MutationObserver(decorateProducts).observe(grid,{childList:true});decorateProducts()}
 // Legal consent and official/locally created payment labels should be visible during checkout.
 const content=$("#v15Content");
 function decorateCheckout(){
  const checkout=content?.querySelector(".vx-checkout");
  if(!checkout||checkout.dataset.v2Enhanced)return;
  checkout.dataset.v2Enhanced="true";
  const methods=checkout.querySelector(".vx-payment-method-list");
  if(methods){
   const images=[
    ["#vionaDemoPay","/assets/bank-card-v2.svg","Банковская карта"],
    ["#vionaSbpPay","/assets/brand-sbp.svg","Система быстрых платежей"],
    ["#vionaSberPay","/assets/brand-sberpay.svg?v=23","SberPay"]
   ];
   for(const [target,src,label] of images){
    const button=methods.querySelector(target);
    if(!button)continue;
    const icon=button.querySelector(".vx-method-icon");
    if(icon){icon.innerHTML="";const img=document.createElement("img");img.src=src;img.alt=label;img.width=100;img.height=42;img.loading="lazy";img.style.cssText="width:100%;height:100%;object-fit:contain";icon.append(img)}
   }
  }
  const summary=checkout.querySelector(".vx-summary");
  if(summary){
   const terms=document.createElement("div");terms.className="v2-payment-terms";
   terms.innerHTML='<strong>Тестовая оплата VIONA</strong><p>Перед запуском банковской формы ознакомься с документами:</p><a href="/legal/terms" target="_blank" rel="noopener">Пользовательское соглашение</a> · <a href="/legal/privacy" target="_blank" rel="noopener">Политика конфиденциальности</a> · <a href="/legal/delivery" target="_blank" rel="noopener">Условия услуг и оплаты</a><p>Финальные юридические условия будут утверждены до реального приёма денег.</p>';
   summary.append(terms);
   const row=document.createElement("div");row.className="v2-payment-icons";
   row.innerHTML='<img src="/assets/bank-card-v2.svg" alt="Банковская карта"><img src="/assets/brand-sbp.svg" alt="СБП"><img src="/assets/brand-sberpay.svg?v=23" alt="SberPay">';
   summary.append(row);
  }
 }
 if(content){new MutationObserver(decorateCheckout).observe(content,{childList:true,subtree:false});decorateCheckout()}
 // One-time first-visit hiring invitation. Do not interrupt payment result or an active modal.
 const flag="viona-v2-hiring-dismissed-v1";
 const dismissed=()=>{try{return localStorage.getItem(flag)==="1"}catch{return true}};
 const save=()=>{try{localStorage.setItem(flag,"1")}catch{}};
 if(!dismissed()){
  const dialog=document.createElement("section");
  dialog.id="v2HiringDialog";dialog.setAttribute("role","dialog");dialog.setAttribute("aria-modal","true");dialog.setAttribute("aria-labelledby","v2HiringTitle");dialog.hidden=true;
  dialog.innerHTML='<div class="v2-hiring-inner"><button type="button" class="close" aria-label="Закрыть">×</button><small style="color:var(--v2-orange);font-weight:800;letter-spacing:.15em">VIONA / BUILD WITH US</small><h2 id="v2HiringTitle">Творим будущее. Ищем команду.</h2><p>VIONA принимает отклики от разработчиков, дизайнеров, тестировщиков и специалистов поддержки. Нужны знания технологий, умение работать с клиентами и свободное время.</p><a href="/careers">Узнать о направлениях и оставить заявку ↗</a><p style="font-size:11px;margin-top:17px">Условия сотрудничества обсуждаются отдельно.</p></div>';
  document.body.append(dialog);
  const dismiss=()=>{dialog.hidden=true;save();document.removeEventListener("keydown",onKey)};
  const onKey=e=>{if(e.key==="Escape")dismiss()};
  dialog.querySelector(".close").addEventListener("click",dismiss);
  dialog.addEventListener("click",e=>{if(e.target===dialog)dismiss()});
  dialog.querySelector("a").addEventListener("click",save);
  window.addEventListener("load",()=>{if(!$(".v15-dialog[aria-hidden='false']")&&!$(".v16-workspace:not([hidden])")&&!document.body.classList.contains("vr-result-active")){dialog.hidden=false;dialog.querySelector(".close").focus();document.addEventListener("keydown",onKey)}},{once:true});
 }
})();
