"use strict";
(()=>{
 const mode=window.VionaLocale?.get();
 if(!["pink","goth","alt","cute"].includes(mode))return;
 const scripts={
 alt:{".intro h1":"Твоя идея.<br><span class='shimmer'>Не как у всех.</span>",".intro-lead":"Сайты, код, боты и музыка. Сделай что-то своё.",".intro-actions .cta-primary":"Смотреть каталог ↗",".market .section-top h2":"Выбирай.<br><em>Создавай своё.</em>",".sound-opening h1":"Твой звук.<br><em>Твои правила.</em>"},
 cute:{".intro h1":"Твоя мечта.<br><span class='shimmer'>Наш уютный<br>мир ♡</span>",".intro-lead":"Создаём милые сайты, полезных ботиков и красивые песенки.",".intro-actions .cta-primary":"В каталог ♡",".market .section-top h2":"Маленькие идеи.<br><em>Большие чудеса ♡</em>",".sound-opening h1":"Песенка<br><em>для твоей истории ♡</em>"},
  pink:{
   ".intro h1":"Твоя идея.<br><span class='shimmer'>Наш маленький<br>волшебный мир ♡</span>",
   ".intro-lead":"Здесь рождаются красивые сайты, милые боты, крутой код и музыка с настроением. Расскажи, что хочешь создать ♡",
   ".intro-actions .cta-primary":"Открыть сокровища ♡",
   ".intro-actions .cta-secondary":"Узнать о студии ↓",
   "#services .section-top h2":"Много идей.<br><em>Одно уютное место ♡</em>",
   ".service-tiles .service-card:nth-child(1) h3":"Ботики и автоматизация ♡",
   ".service-tiles .service-card:nth-child(2) h3":"Красивые сайтики ♡",
   ".service-tiles .service-card:nth-child(3) h3":"Волшебство кода ♡",
   ".music-feature h3":"Пусть твоя история<br><em>станет песенкой ♡</em>",
   ".music-feature-link":"В музыкальную студию ♡",
   ".market .section-top h2":"Выбирай то,<br><em>что тебе нравится ♡</em>",
   ".process .section-top h2":"Маленькие шаги.<br><em>Большой результат ♡</em>",
   ".hire-call h2":"Создавать красивое<br><em>вместе веселее ♡</em>",
   ".contact h2":"Есть идея?<br><em>Расскажи нам ♡</em>",
   ".sound-opening h1":"Твоя история<br><em>заслуживает<br>красивой песни ♡</em>",
   ".music-styles h2":"Найди своё<br><em>звучание ♡</em>",
   ".order-lead h2":"Расскажи,<br><em>какую песенку<br>хочешь ♡</em>",
   ".music-form h3":"Твоя будущая песня ♡",
   ".music-form button[type=submit]":"Отправить мечту ♡",
   ".artist-opening h1":"Музыка.<br>Чувства.<br><em>KANEKAN ♡</em>",
   ".artist-action h2":"Твоя история<br><em>тоже зазвучит ♡</em>",
   ".secondary-opening h1":"Творим новое.<br><em>Вместе ♡</em>"
  },
  goth:{
   ".intro h1":"Твоя идея.<br><span class='shimmer'>Из теней<br>в реальность.</span>",
   ".intro-lead":"Там, где цифровые миры обретают форму: код, сайты, автоматизация и музыка ночи.",
   ".intro-actions .cta-primary":"Открыть хранилище ☾",
   ".intro-actions .cta-secondary":"Изучить направления ↓",
   "#services .section-top h2":"Множество миров.<br><em>Единая воля.</em>",
   ".service-tiles .service-card:nth-child(1) h3":"Механизмы теней",
   ".service-tiles .service-card:nth-child(2) h3":"Цифровые соборы",
   ".service-tiles .service-card:nth-child(3) h3":"Алхимия кода",
   ".music-feature h3":"Пусть тишина<br><em>обретёт голос.</em>",
   ".music-feature-link":"В обитель звука ☾",
   ".market .section-top h2":"Коллекция<br><em>цифровых артефактов.</em>",
   ".process .section-top h2":"Каждый этап<br><em>имеет значение.</em>",
   ".hire-call h2":"Дела достойные<br><em>творят вместе.</em>",
   ".contact h2":"Есть замысел?<br><em>Приоткрой тайну.</em>",
   ".sound-opening h1":"Звучание<br><em>из глубины<br>ночи.</em>",
   ".music-styles h2":"Музыка<br><em>без света.</em>",
   ".order-lead h2":"Поведай,<br><em>какой звук<br>ты ищешь.</em>",
   ".music-form h3":"Новая звуковая история ☾",
   ".music-form button[type=submit]":"Отправить послание ☾",
   ".artist-opening h1":"Тени.<br>Звук.<br><em>KANEKAN.</em>",
   ".artist-action h2":"Твоя история<br><em>обретёт голос.</em>",
   ".secondary-opening h1":"Создавай новое.<br><em>По ту сторону привычного.</em>"
  }
 };
 for(const [selector,html] of Object.entries(scripts[mode])){
  const node=document.querySelector(selector);if(node)node.innerHTML=html;
 }
})();
