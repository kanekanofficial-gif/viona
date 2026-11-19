"use strict";
(()=>{
 const form=document.getElementById("v20CareersForm");
 if(form){
  const message=document.getElementById("v20CareersStatus");
  const button=form.querySelector('button[type="submit"]');
  form.addEventListener("submit",async e=>{
   e.preventDefault();
   if(!form.reportValidity())return;
   const data=Object.fromEntries(new FormData(form));
   const initial=button.textContent;
   button.disabled=true;message.className="v20-status";message.textContent="Сохраняем заявку…";
   try{
    const response=await fetch("/api/v20/careers",{
     method:"POST",credentials:"same-origin",cache:"no-store",
     headers:{"Content-Type":"application/json"},body:JSON.stringify(data)
    });
    const result=await response.json().catch(()=>({}));
    if(!response.ok||!result.ok)throw Error(result.error||"Сервис заявок временно недоступен.");
    message.textContent="Отклик зарегистрирован: #"+result.id.slice(0,8).toUpperCase()+". Ответ придёт по указанному контакту, если мы сможем предложить сотрудничество.";
    form.reset();
   }catch(err){message.textContent=err.message;message.classList.add("error")}
   finally{button.disabled=false}
  });
 }
 const sectorTitle=document.getElementById("sectorTitle");
 if(!sectorTitle)return;
 const hostname=location.hostname.toLowerCase();
 const route=location.pathname.replace(/\/$/,"").toLowerCase();
 const sector=hostname==="bots.viona.space"||route==="/bots"?"bots":
              hostname==="web.viona.space"||route==="/web"?"web":"code";
 const config={
  bots:{
   brand:"BOTS / AUTOMATION",title:["Боты, которые","работают."],
   lead:"Telegram, Discord и MAX: прорабатываем команды, сценарии и интеграции под твою задачу.",
   heading:"Боты и автоматизация",
   cards:[
    ["01 / TELEGRAM","Telegram-боты","Команды /start, /help, сценарии, меню, уведомления и пользовательские сообщения."],
    ["02 / DISCORD","Discord Utility","Команды сервера, роли и уведомления с понятной архитектурой."],
    ["03 / MAX","MAX-боты","Проектирование структуры и сценариев под актуальные возможности мессенджера."],
    ["04 / PROCESS","Автоматизация","Проработка API-интеграций и упрощение повторяющихся задач."]
   ]},
  web:{
   brand:"WEB / EXPERIENCE",title:["Сайты с","характером."],
   lead:"Лендинги, небольшие интернет-магазины, адаптивные интерфейсы и визуальные системы.",
   heading:"Веб-разработка и дизайн",
   cards:[
    ["01 / LANDING","Лендинги","Выразительная первая страница, чёткая структура и адаптивная вёрстка."],
    ["02 / PORTFOLIO","Портфолио","Проекты, галереи, визуальная история и быстрые контакты."],
    ["03 / INTERFACE","UI / UX","Компоненты, анимации, формы и интерфейсы под задачу."],
    ["04 / FIXES","Поддержка","Доработка существующих сайтов, мобильная версия и исправление ошибок."]
   ]},
  code:{
   brand:"CODE / ENGINEERING",title:["Чистый код.","Новые идеи."],
   lead:"Разработка функций, рефакторинг, исправление ошибок и подготовка документации.",
   heading:"Разработка под задачи",
   cards:[
    ["01 / JS","JavaScript / Node.js","Логика интерфейсов, API, backend-сервисы и автоматизация."],
    ["02 / PYTHON","Python","Скрипты, работа с данными и серверные инструменты."],
    ["03 / DATA","SQL / PostgreSQL","Структуры данных, миграции и безопасная обработка заказов."],
    ["04 / DEBUG","Исправление кода","Диагностика ошибок, тестирование и обновление существующих проектов."]
   ]}
 };
 const x=config[sector];
 document.documentElement.dataset.sector=sector;
 document.title=x.heading+" — VIONA";
 document.getElementById("sectorKicker").textContent="VIONA / "+x.brand;
 sectorTitle.replaceChildren(document.createTextNode(x.title[0]+" "));
 const em=document.createElement("em");em.textContent=x.title[1];sectorTitle.append(em);
 document.getElementById("sectorLead").textContent=x.lead;
 document.getElementById("sectorHeading").textContent=x.heading;
 const cards=document.getElementById("sectorCards");
 for(const [tag,title,description] of x.cards){
  const card=document.createElement("article");
  const t=document.createElement("span");t.textContent=tag;
  const h=document.createElement("h2");h.textContent=title;
  const p=document.createElement("p");p.textContent=description;
  card.append(t,h,p);cards.append(card);
 }
 if(sector==="code"){
  const link=document.querySelector(".v20-sector-actions .v20-inner-cta");
  link.href="https://viona.space/code-edit";link.textContent="Описать изменения ↗";
 }
})();
