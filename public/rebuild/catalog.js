"use strict";(()=>{
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const config={
 bots:{kicker:"VIONA / AUTOMATION DEPARTMENT",heading:"Боты,<br><em>которые работают.</em>",intro:"Автоматизируй общение и процессы. От простых команд до сложных сценариев, созданных под задачу.",icon:"telegram.svg",word:"BOT.",services:[["01 / TELEGRAM","Telegram-боты","Ответы, команды, кнопки, роли, меню, уведомления и сценарии общения.","telegram.svg"],["02 / DISCORD","Discord-боты","Команды, роли, модерация и автоматизация сообщества.","discrod.svg"],["03 / MAX","MAX-боты","Проектирование чат-ботов и сценариев для MAX. Доступные интеграции обсуждаются до начала работы.","Max.svg"]]},
 web:{kicker:"VIONA / DIGITAL INTERFACES",heading:"Цифровые<br><em>впечатления.</em>",intro:"Сайты с характером: интерфейсы, которые решают задачи и остаются понятными на любом экране.",icon:"visa.svg",word:"WEB.",services:[["01 / LANDING","Посадочные страницы","Ясная структура, сильная визуальная история и удобные формы."],["02 / PORTFOLIO","Сайты-портфолио","Для авторов, проектов и цифровых продуктов."],["03 / UI / UX","Интерфейсы приложений","Дизайн-система, адаптивность, доступность и микроанимации."]]},
 code:{kicker:"VIONA / ENGINEERING",heading:"Важна<br><em>каждая строка.</em>",intro:"Исправляем ошибки, добавляем возможности и помогаем проектам расти с понятным техническим заданием.",icon:"gamepad.svg",word:"CODE.",services:[["01 / REPAIR","Исправление ошибок","Разбор проблемы, аккуратные изменения и проверка результата."],["02 / FEATURES","Новые функции","Разработка новых возможностей и сценариев работы."],["03 / REFACTOR","Аудит и доработка","Работа с существующим кодом, структурой и поддерживаемостью."]]}
 };
 const host=location.hostname.split(".")[0],key=config[host]?host:location.pathname.split("/")[1],data=config[key]||config.web;
 document.title="VIONA — "+({bots:"Боты и автоматизация",web:"Сайты и дизайн",code:"Разработка и код"}[key]||"Цифровые услуги");
 document.querySelector("#v2CatalogKicker").textContent=data.kicker;
 document.querySelector("#v2CatalogTitle").innerHTML=data.heading;
 document.querySelector("#v2CatalogIntro").textContent=data.intro;
 document.querySelector("#catBrandWord").textContent=data.word;
 document.querySelector("#catBrandIcon").src="/assets/brand-icons/"+encodeURIComponent(data.icon);
 document.querySelector("#v2CatalogCards").innerHTML=data.services.map(([num,title,desc,icon],i)=>
  '<article class="cat-service glass-surface"><div class="cat-service-poster '+esc(key)+'"><span class="water-drop" aria-hidden="true"></span>'+(icon?'<img src="/assets/brand-icons/'+encodeURIComponent(icon)+'" alt="">':'<div class="cat-service-abstract" aria-hidden="true"><i></i><i></i><i></i></div>')+'</div><span class="section-number">'+esc(num)+'</span><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p><a href="https://viona.space/#contact">Оставить заявку ↗</a></article>').join("");
})();