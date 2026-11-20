"use strict";
(()=>{
 const $=q=>document.querySelector(q);
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const catalog={
  "/bots":{title:"Боты,<br><em>которые работают.</em>",kicker:"VIONA / BOTS",intro:"Автоматизация общения, Telegram-команды и собственные сценарии — от прототипа до готового решения.",cards:[["01 / TELEGRAM","Telegram-бот на заказ","Сценарии общения, кнопки, команды и интеграции. Без передачи токенов через публичную форму."],["02 / SUPPORT","Бот поддержки","Частые вопросы, статусы обращений и ручной контроль качества."],["03 / DEMO","Конструктор ботов","Проверь логику сообщений в VIONA Studio до заказа реализации."]]},
  "/web":{title:"Сайты для<br><em>сильных идей.</em>",kicker:"VIONA / WEB",intro:"Современные адаптивные интерфейсы, посадочные страницы и веб-проекты с понятными условиями разработки.",cards:[["01 / LANDING","Лендинг","Презентация проекта, адаптивная верстка и работа с мобильными экранами."],["02 / UI","Портфолио","Страница автора, проектов, контактов и результатов."],["03 / SYSTEM","Веб-приложение","Интерактивный интерфейс с серверными функциями по согласованному техническому заданию."]]},
  "/code":{title:"Код, который<br><em>решает задачи.</em>",kicker:"VIONA / DEVELOPMENT",intro:"Доработка Node.js, JavaScript, TypeScript, HTML/CSS и Python-проектов после проверки технического задания.",cards:[["01 / FIX","Исправление ошибок","Разбор проблемы, подготовка правки, проверка результата."],["02 / FEATURE","Новые возможности","Доработка логики, интерфейса или интеграции."],["03 / REVIEW","Аудит кода","Проверка качества, безопасности и поддерживаемости проекта."]]}
 };
 if($("#v2CatalogCards")){
  const data=catalog[location.pathname]||catalog["/web"];
  $("#v2CatalogTitle").innerHTML=data.title;
  $("#v2CatalogKicker").textContent=data.kicker;
  $("#v2CatalogIntro").textContent=data.intro;
  $("#v2CatalogCards").innerHTML=data.cards.map(([num,title,desc])=>'<article class="v2-card"><small>'+esc(num)+'</small><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p><a class="v2-card-arrow" href="/#contact" aria-label="Оставить заявку: '+esc(title)+'">↗</a></article>').join("");
  document.title="VIONA — "+(location.pathname==="/bots"?"Telegram-боты":location.pathname==="/code"?"Разработка и код":"Сайты и дизайн");
 }
 const post=async(url,details)=>{
  const r=await fetch(url,{method:"POST",credentials:"same-origin",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify(details)});
  const body=await r.json().catch(()=>({}));
  if(!r.ok)throw Error(body.error||"Не удалось отправить заявку. Повтори попытку.");
  return body;
 };
 const music=$("#v2MusicForm");
 if(music){
  const update=()=>{
   const own=music.elements.lyricsMode.value==="provided";
   $("#v2LyricsLabel").firstChild.textContent=own?"Текст песни":"Идея, тема и сюжет песни";
   music.querySelector('[name="brief"]').placeholder=own?"Вставь свой текст песни...":"Расскажи, о чём должна быть песня. Написание текста будет отдельной платной услугой.";
  };
  music.addEventListener("change",e=>{if(e.target.name==="lyricsMode")update()});update();
  music.addEventListener("submit",async e=>{
   e.preventDefault();if(!music.reportValidity())return;
   const btn=music.querySelector('button[type="submit"]'),status=$("#v2MusicStatus"),data=Object.fromEntries(new FormData(music));
   if(!data.genre||["funk","opiumcore","mylancore"].includes(data.genre)){status.textContent="Выбери доступный жанр.";return}
   btn.disabled=true;status.textContent="Сохраняем музыкальную заявку…";
   try{
    const result=await post("/api/v2/music/request",data);
    status.textContent="Заявка сохранена! Номер: "+result.id+". Команда согласует цену и сроки перед любой оплатой.";
    music.reset();update();
   }catch(err){status.textContent=err.message}
   finally{btn.disabled=false}
  });
 }
 const careers=$("#v2CareersForm");
 if(careers){
  careers.addEventListener("submit",async e=>{
   e.preventDefault();if(!careers.reportValidity())return;
   const btn=careers.querySelector('button[type="submit"]'),status=$("#v2CareersStatus");
   btn.disabled=true;status.textContent="Отправляем отклик…";
   try{
    const result=await post("/api/v2/careers/apply",Object.fromEntries(new FormData(careers)));
    status.textContent="Отклик сохранён. Номер заявки: "+result.id+".";
    careers.reset();
   }catch(err){status.textContent=err.message}
   finally{btn.disabled=false}
  });
 }
})();
