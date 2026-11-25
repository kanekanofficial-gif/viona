"use strict";
(()=>{
 const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const sections={
 bots:{kicker:"01 / AUTOMATION DEPARTMENT",title:"Боты,<br><em>которые работают.</em>",intro:"Telegram, Discord и MAX. Создаём понятные сценарии, кнопки, команды и автоматизацию общения.",icon:"telegram.svg",word:"BOTS.",cards:[["01 / TELEGRAM","Telegram-боты","Команды, кнопки, заявки, роли и сценарии общения.","telegram.svg"],["02 / DISCORD","Discord-боты","Инструменты для сообществ, базовая модерация и команды.","discrod.svg"],["03 / MAX","MAX-боты","Проектирование сценариев и чат-ботов в пределах доступных интеграций.","Max.svg"]]},
 web:{kicker:"02 / WEB EXPERIENCE",title:"Сайты,<br><em>которые чувствуют.</em>",intro:"Лендинги, интерфейсы и сайты-портфолио с продуманной структурой, адаптивностью и визуальными деталями.",icon:"",word:"WEB.",cards:[["01 / LANDING","Лендинги","Страница, которая рассказывает о твоём проекте и помогает связаться."],["02 / PORTFOLIO","Портфолио","Персональная витрина работ, проектов и творческого подхода."],["03 / UI DESIGN","Интерфейсы","Система экранов и компонентов, адаптивная и доступная на разных устройствах."]]},
 code:{kicker:"03 / SOFTWARE ENGINEERING",title:"Идеи,<br><em>которые запускают.</em>",intro:"Программирование, исправление ошибок и доработка существующих проектов. От задачи до проверяемого результата.",icon:"",word:"CODE.",cards:[["01 / DEBUG","Исправление ошибок","Разбор проблемы, безопасная правка и проверка результата."],["02 / FEATURES","Разработка функций","Новые возможности, серверная логика и пользовательские сценарии."],["03 / REFACTOR","Поддержка кода","Обновление существующих проектов и повышение удобства сопровождения."]]}
 };
 const host=location.hostname.split(".")[0],key=sections[host]?host:location.pathname.split("/").filter(Boolean)[0],data=sections[key]||sections.web;
 const $=s=>document.querySelector(s);
 document.title="VIONA — "+({bots:"Telegram-боты и автоматизация",web:"Сайты и дизайн",code:"Разработка и код"}[key]||"Цифровые услуги");
 $("#catKicker").textContent=data.kicker;$("#catTitle").innerHTML=data.title;$("#catIntro").textContent=data.intro;$("#catWord").textContent=data.word;
 if(data.icon)$("#catIcon").src="/assets/brand-icons/"+encodeURIComponent(data.icon);else $("#catIcon").style.display="none";
 $("#catCards").innerHTML=data.cards.map(([label,title,body,icon],i)=>
  '<article class="glass category-item"><div class="category-item-art '+escape(key)+'">'+(icon?'<img src="/assets/brand-icons/'+encodeURIComponent(icon)+'" alt="">':key==="web"?'<img class="category-original-art" src="/assets/catalog/'+(i===0?'landing-browser-windows.svg':'portfolio-ui-ux.svg')+'" alt="">':key==="code"?'<img class="category-original-art" src="/assets/catalog/vscode.svg" alt="">':'<div class="category-mock">UI</div>')+'</div><small class="micro">'+escape(label)+'</small><h3>'+escape(title)+'</h3><p>'+escape(body)+'</p><a href="https://viona.space/#contact">Оставить заявку ↗</a></article>').join("");
})();
