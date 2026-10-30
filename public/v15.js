"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const dict={
ru:{navCatalog:"Каталог",navStudio:"Студия",navContact:"Связаться",edition:"DIGITAL GOODS / 2026",status:"Открыты для новых идей",eyebrow:"НЕ ПРОСТО МАРКЕТПЛЕЙС",hero:'Создавай<br><em>за гранью</em><br> обычного<span class="period">.</span>',desc:"Код, инструменты и цифровые продукты для тех, кто придумывает своё. Добро пожаловать в VIONA.",explore:"Смотреть каталог",request:"Предложить проект",scroll:"ЛИСТАЙ НИЖЕ ↓",catalogTitle:"Выбирай. <em>Создавай.</em>",catalogDesc:"Цифровые решения для твоих проектов.",studioTitle:"Идея → <em>результат.</em>",step1:"Найди своё",step1desc:"Исследуй коллекцию цифровых решений.",step2:"Сохрани идеи",step2desc:"Избранное и корзина всегда под рукой.",step3:"Начни проект",step3desc:"Расскажи, что хочешь создать.",contactTitle:"Есть идея?<br><em>Погнали.</em>",contactDesc:"Опиши свой проект — обсудим возможности.",nameLabel:"Как тебя зовут?",contactLabel:"Как с тобой связаться?",detailsLabel:"Что создаём?",submit:"Отправить заявку",footer:"Делаем цифровое необычным.",mobileHome:"Главная",mobileCatalog:"Каталог",mobileFav:"Избранное",mobileCart:"Корзина",search:"Поиск по каталогу...",sort:["По умолчанию","Сначала дешевле","Сначала дороже","По названию"],cats:["Все","Боты","Шаблоны","Игры","Услуги"],empty:"Ничего не найдено",add:"В корзину",added:"Добавлено",remove:"Удалить",requestPrice:"По запросу",total:"Итого",demo:"Демонстрационный каталог. Оплата пока не подключена.",checkout:"Оплата пока недоступна",saved:"Сохранено",removed:"Удалено",error:"Не удалось выполнить запрос",sent:"Заявка отправлена!",cartEmpty:"Корзина пока пуста",favEmpty:"Избранное пока пусто"},
en:{navCatalog:"Catalog",navStudio:"Studio",navContact:"Contact",edition:"DIGITAL GOODS / 2026",status:"Open for new ideas",eyebrow:"BEYOND AN ORDINARY MARKET",hero:'Make it<br><em>different</em><br> with VIONA<span class="period">.</span>',desc:"Code, tools and digital products for people building something new.",explore:"Explore the market",request:"Start a project",scroll:"SCROLL TO EXPLORE ↓",catalogTitle:"Find it. <em>Build it.</em>",catalogDesc:"Digital essentials for your next idea.",studioTitle:"From idea <em>to impact.</em>",step1:"Discover",step1desc:"Explore curated digital products.",step2:"Save",step2desc:"Keep favorites and cart close.",step3:"Create",step3desc:"Tell us what you want to build.",contactTitle:"Have an idea?<br><em>Let's build.</em>",contactDesc:"Tell us about your project.",nameLabel:"Your name",contactLabel:"Contact details",detailsLabel:"Project brief",submit:"Send request",footer:"Making digital different.",mobileHome:"Home",mobileCatalog:"Catalog",mobileFav:"Favorites",mobileCart:"Cart",search:"Search products...",sort:["Featured","Price: low to high","Price: high to low","Name"],cats:["All","Bots","Templates","Games","Services"],empty:"Nothing found",add:"Add to cart",added:"Added",remove:"Remove",requestPrice:"On request",total:"Total",demo:"Demo catalog. Payments are not connected.",checkout:"Checkout unavailable",saved:"Saved",removed:"Removed",error:"Request failed",sent:"Request sent!",cartEmpty:"Your cart is empty",favEmpty:"No favorites yet"},
ja:{navCatalog:"商品一覧",navStudio:"スタジオ",navContact:"お問い合わせ",edition:"デジタル / 2026",status:"新しいアイデアを募集中",eyebrow:"デジタルのその先へ",hero:'アイデアを<br><em>もっと自由に</em><br>VIONA<span class="period">.</span>',desc:"新しいものを作る人のためのコード、ツール、デジタル製品。",explore:"商品を見る",request:"相談する",scroll:"スクロール ↓",catalogTitle:"探して、<em>創ろう。</em>",catalogDesc:"次のプロジェクトに必要なツール。",studioTitle:"アイデアを<em>形に。</em>",step1:"見つける",step1desc:"デジタル製品を探す。",step2:"保存する",step2desc:"お気に入りとカートに保存。",step3:"作る",step3desc:"プロジェクトについて教えてください。",contactTitle:"アイデアがある？<br><em>始めよう。</em>",contactDesc:"作りたいものを教えてください。",nameLabel:"お名前",contactLabel:"連絡先",detailsLabel:"プロジェクト",submit:"送信",footer:"デジタルをもっと自由に。",mobileHome:"ホーム",mobileCatalog:"商品",mobileFav:"お気に入り",mobileCart:"カート",search:"商品を検索...",sort:["おすすめ","価格が安い順","価格が高い順","名前順"],cats:["すべて","ボット","テンプレート","ゲーム","サービス"],empty:"見つかりません",add:"カートに追加",added:"追加済み",remove:"削除",requestPrice:"要相談",total:"合計",demo:"デモカタログです。決済機能は未対応です。",checkout:"決済は利用できません",saved:"保存しました",removed:"削除しました",error:"送信できませんでした",sent:"送信しました！",cartEmpty:"カートは空です",favEmpty:"お気に入りはありません"},
de:{navCatalog:"Katalog",navStudio:"Studio",navContact:"Kontakt",edition:"DIGITALE WERKZEUGE / 2026",status:"Offen für neue Ideen",eyebrow:"MEHR ALS EIN MARKTPLATZ",hero:'Ideen aus<br><em>der Dunkelheit</em><br>erschaffen<span class="period">.</span>',desc:"Code, Werkzeuge und digitale Produkte für deine nächsten Projekte.",explore:"Katalog ansehen",request:"Projekt anfragen",scroll:"WEITER ENTDECKEN ↓",catalogTitle:"Entdecken. <em>Erschaffen.</em>",catalogDesc:"Digitale Werkzeuge für dein nächstes Projekt.",studioTitle:"Von der Idee <em>zum Werk.</em>",step1:"Entdecken",step1desc:"Finde digitale Werkzeuge.",step2:"Merken",step2desc:"Favoriten und Warenkorb speichern.",step3:"Erschaffen",step3desc:"Beschreibe dein Projekt.",contactTitle:"Eine Idee?<br><em>Los geht's.</em>",contactDesc:"Erzähl uns von deinem Projekt.",nameLabel:"Dein Name",contactLabel:"Kontakt",detailsLabel:"Dein Projekt",submit:"Anfrage senden",footer:"Digitales neu gedacht.",mobileHome:"Start",mobileCatalog:"Katalog",mobileFav:"Favoriten",mobileCart:"Warenkorb",search:"Produkte suchen...",sort:["Standard","Preis aufsteigend","Preis absteigend","Name"],cats:["Alle","Bots","Vorlagen","Spiele","Dienste"],empty:"Keine Ergebnisse",add:"In den Warenkorb",added:"Hinzugefügt",remove:"Entfernen",requestPrice:"Auf Anfrage",total:"Gesamt",demo:"Demo-Katalog. Keine Zahlungen möglich.",checkout:"Kasse nicht verfügbar",saved:"Gespeichert",removed:"Entfernt",error:"Anfrage fehlgeschlagen",sent:"Anfrage gesendet!",cartEmpty:"Warenkorb ist leer",favEmpty:"Keine Favoriten"},
femboy:{navCatalog:"Каталог ♡",navStudio:"Студия ✧",navContact:"Написать ♡",edition:"SOFT DIGITAL / 2026",status:"Мечты приветствуются ♡",eyebrow:"ТВОЯ МАЛЕНЬКАЯ ВСЕЛЕННАЯ",hero:'Мечтай.<br><em>Твори.</em><br>Сияй<span class="period">♡</span>',desc:"Уютные цифровые инструменты для самых смелых и милых идей.",explore:"Смотреть красоту ♡",request:"Моя идея ✧",scroll:"ЛИСТАЙ НИЖЕ ♡",catalogTitle:"Выбирай <em>с любовью.</em>",catalogDesc:"Маленькие инструменты для больших мечтаний.",studioTitle:"Мечта → <em>реальность.</em>",step1:"Исследуй ♡",step1desc:"Найди что-нибудь особенное.",step2:"Сохрани ✧",step2desc:"Собери любимое в коллекцию.",step3:"Создай ♡",step3desc:"Расскажи о своей задумке.",contactTitle:"Есть мечта?<br><em>Воплотим ♡</em>",contactDesc:"Расскажи, что хочется создать.",nameLabel:"Как тебя зовут? ♡",contactLabel:"Как связаться?",detailsLabel:"Твоя мечта",submit:"Отправить ♡",footer:"Твоя цифровая сказка ♡",mobileHome:"Домой",mobileCatalog:"Каталог",mobileFav:"Любимое",mobileCart:"Корзина",search:"Найти что-то милое...",sort:["По умолчанию","Сначала дешевле","Сначала дороже","По названию"],cats:["Все","Ботики","Шаблоны","Игры","Услуги"],empty:"Ничего не нашлось ♡",add:"Добавить ♡",added:"Добавлено ♡",remove:"Убрать",requestPrice:"По запросу",total:"Итого",demo:"Демо-каталог. Оплата пока не подключена.",checkout:"Оплата пока недоступна",saved:"Сохранено ♡",removed:"Убрано",error:"Не получилось отправить",sent:"Отправлено ♡",cartEmpty:"Корзина пока пустая ♡",favEmpty:"Пока нет любимого ♡"}
};
const productTranslations={
en:[["Telegram Bot Starter","Starter Node.js template for a Telegram bot."],["Portfolio UI Kit","Dark interface components for your portfolio."],["Discord Utility Bot","A customizable Discord bot foundation."],["Game Mod Toolkit","Tools for permitted single-player modifications."],["Landing Page Pack","Responsive pages for your next project."],["Custom Development","Tell us about your custom project."]],
ja:[["Telegram ボット","Node.js で作る Telegram ボットのテンプレート。"],["ポートフォリオ UI","ポートフォリオ用のダーク UI キット。"],["Discord ボット","便利な Discord ボットの基盤。"],["ゲームツール","シングルプレイヤー向けの許可されたツール。"],["ランディングページ","レスポンシブなページのセット。"],["カスタム開発","あなたのプロジェクトを教えてください。"]],
de:[["Telegram-Bot Starter","Node.js-Vorlage für deinen Telegram-Bot."],["Portfolio UI Kit","Dunkles Design-Kit für dein Portfolio."],["Discord Utility Bot","Anpassbare Grundlage für Discord-Bots."],["Game Mod Toolkit","Werkzeuge für erlaubte Einzelspieler-Modifikationen."],["Landingpage-Paket","Responsive Webseiten für dein Projekt."],["Individuelle Entwicklung","Erzähl uns von deinem Projekt."]],
femboy:[["Telegram-ботик ♡","Уютный шаблон Telegram-бота на Node.js."],["Милый Portfolio Kit","Нежный набор интерфейсов для портфолио."],["Discord-ботик ✧","Удобная основа для Discord-бота."],["Игровая мастерская","Инструменты для одиночных игр."],["Странички мечты ♡","Красивые адаптивные страницы."],["Разработка мечты","Расскажи о своём проекте ♡"]]};
const localized=p=>{const entry=productTranslations[lang]?.[Number(p.id)-1];return entry?{...p,title:entry[0],description:entry[1]}:p};
const currencies={ru:["RUB",1,"ru-RU"],en:["USD",.012,"en-US"],ja:["JPY",1.85,"ja-JP"],de:["EUR",.0105,"de-DE"],femboy:["RUB",1,"ru-RU"]};
const cats=["Все","Боты","Шаблоны","Игры","Услуги"],sorts=["default","price-asc","price-desc","name"];
const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const getStorage=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
let lang=getStorage("viona-world","ru");if(!dict[lang])lang="ru";const t=dict[lang];document.documentElement.dataset.world=lang;document.documentElement.lang=lang==="femboy"?"ru":lang;
let products=[],category="Все",sort="default",mode="cart",active=false,returnFocus=null,toastTimer;
const storageKey="viona-halloween-v1",old=getStorage(storageKey,{}),ids=a=>Array.isArray(a)?[...new Set(a.map(String))]:[];
let state={favorites:ids(old.favorites),cart:ids(old.cart)};
const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state))}catch{}updateCounters()};
function updateCounters(){$("#favCount").textContent=state.favorites.length;$("#cartCount").textContent=state.cart.length}
function money(n){if(!(Number(n)>0))return t.requestPrice;const [currency,rate,locale]=currencies[lang];return new Intl.NumberFormat(locale,{style:"currency",currency,maximumFractionDigits:currency==="RUB"||currency==="JPY"?0:2}).format(Number(n)*rate)}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2400)}
function localize(){for(const el of $$("[data-i]")){const key=el.dataset.i;if(t[key])el.textContent=t[key]}$("#heroTitle").innerHTML=t.hero;$("#heroDesc").textContent=t.desc;$$(".section-top h2").forEach((el,i)=>el.innerHTML=i===0?t.catalogTitle:t.studioTitle);$(".contact h2").innerHTML=t.contactTitle;$("#search").placeholder=t.search;$("#langLabel").textContent={ru:"RU",en:"EN",ja:"JP",de:"DE",femboy:"♡"}[lang];$$("[data-lang]").forEach(b=>b.classList.toggle("selected",b.dataset.lang===lang));$("#currencyNote").textContent=lang==="en"?"Approximate conversion from RUB. Checkout remains in RUB.":lang==="de"?"Ungefähre Umrechnung aus RUB. Abrechnung in RUB.":lang==="ja"?"参考換算価格です。決済通貨はルーブルです。":"";$$("[data-sort]").forEach((b,i)=>b.textContent=t.sort[i]);$("#sortLabel").textContent=t.sort[sorts.indexOf(sort)];$$("[data-category]").forEach((b,i)=>b.textContent=t.cats[i]);$(".demo-note").textContent=t.demo;document.title="VIONA — "+({ru:"Digital Market",en:"Midnight Market",ja:"デジタルマーケット",de:"Digitalwerk",femboy:"Soft Universe"}[lang])}
function visible(){const q=$("#search").value.trim().toLocaleLowerCase();const arr=products.filter(p=>(category==="Все"||p.category===category)&&[p.title,p.description,p.category,p.tag,localized(p).title,localized(p).description].join(" ").toLocaleLowerCase().includes(q));if(sort==="price-asc")arr.sort((a,b)=>a.price-b.price);if(sort==="price-desc")arr.sort((a,b)=>b.price-a.price);if(sort==="name")arr.sort((a,b)=>a.title.localeCompare(b.title));return arr}
function render(){const list=visible();$("#resultCount").textContent=String(list.length).padStart(2,"0");$("#products").innerHTML=list.length?list.map(p=>{p=localized(p);const id=String(p.id),fav=state.favorites.includes(id),cart=state.cart.includes(id);return '<article class="product"><div class="product-head"><div class="product-icon">'+safe(p.icon)+'</div><span class="product-tag">'+safe(p.tag)+'</span></div><h3>'+safe(p.title)+'</h3><p>'+safe(p.description)+'</p><button type="button" class="product-view" data-view="'+safe(id)+'">'+safe(({ru:'Подробнее',en:'Quick view',ja:'詳細を見る',de:'Details ansehen',femboy:'Посмотреть ♡'})[lang])+' <span aria-hidden="true">↗</span></button><div class="product-foot"><strong class="price">'+money(p.price)+'</strong><div class="product-actions"><button type="button" class="heart '+(fav?"active":"")+'" data-action="favorites" data-id="'+safe(id)+'" aria-pressed="'+fav+'" aria-label="'+safe(t.mobileFav)+'">'+(fav?"♥":"♡")+'</button><button type="button" class="'+(cart?"active":"")+'" data-action="cart" data-id="'+safe(id)+'" aria-pressed="'+cart+'">'+safe(cart?t.added:t.add)+'</button></div></div></article>'}).join(""):'<div class="empty">'+safe(t.empty)+'</div>'}
function toggle(kind,id){if(!["favorites","cart"].includes(kind)||!products.some(p=>String(p.id)===id))return;const arr=state[kind],index=arr.indexOf(id);if(index<0)arr.push(id);else arr.splice(index,1);save();render();if(active)renderPanel();toast(index<0?t.saved:t.removed)}
$("#products").addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(b)toggle(b.dataset.action,b.dataset.id)});
$("#search").addEventListener("input",render);
$("#categories").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;category=b.dataset.category;$$("[data-category]").forEach(x=>x.classList.toggle("active",x===b));render()});
const sortTrigger=$("#sortTrigger"),sortList=$("#sortList");function closeSort(){sortList.hidden=true;sortTrigger.setAttribute("aria-expanded","false")}
sortTrigger.addEventListener("click",()=>{const open=sortList.hidden;sortList.hidden=!open;sortTrigger.setAttribute("aria-expanded",String(open))});
sortList.addEventListener("click",e=>{const b=e.target.closest("[data-sort]");if(!b)return;sort=b.dataset.sort;$("#sortLabel").textContent=t.sort[sorts.indexOf(sort)];$$("[data-sort]").forEach(x=>x.classList.toggle("selected",x===b));closeSort();render()});
const langTrigger=$("#langTrigger"),langList=$("#langList");function closeLang(){langList.hidden=true;langTrigger.setAttribute("aria-expanded","false")}
langTrigger.addEventListener("click",()=>{const open=langList.hidden;langList.hidden=!open;langTrigger.setAttribute("aria-expanded",String(open))});
langList.addEventListener("click",e=>{const b=e.target.closest("[data-lang]");if(!b)return;closeLang();if(b.dataset.lang===lang)return;try{localStorage.setItem("viona-world",JSON.stringify(b.dataset.lang))}catch{}location.reload()});
document.addEventListener("pointerdown",e=>{if(!$("#sortHolder").contains(e.target))closeSort();if(!$("#language").contains(e.target))closeLang()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSort();closeLang();closePanel()}});
function renderPanel(){const title=mode==="cart"?t.mobileCart:t.mobileFav;$("#panelTitle").textContent=title;$$("[data-panel]").forEach(b=>b.classList.toggle("active",b.dataset.panel===mode));const list=state[mode].map(id=>products.find(p=>String(p.id)===id)).filter(Boolean);$("#panelBody").innerHTML=list.length?list.map(p=>'<div class="panel-item"><div><strong>'+safe(localized(p).title)+'</strong><small>'+money(p.price)+'</small></div><button type="button" data-remove="'+safe(p.id)+'">'+safe(t.remove)+'</button></div>').join(""):'<div class="empty">'+safe(mode==="cart"?t.cartEmpty:t.favEmpty)+'</div>';$("#panelBottom").innerHTML=mode==="cart"&&list.length?'<div class="panel-total"><span>'+safe(t.total)+'</span><strong>'+money(list.reduce((sum,p)=>sum+Number(p.price||0),0))+'</strong></div><button class="action-primary" id="checkoutOpen" type="button">'+safe(({ru:'Оформить заявку',en:'Request order',ja:'注文を相談',de:'Bestellung anfragen',femboy:'Оформить ♡'})[lang])+' ↗</button><p class="panel-note">'+safe(t.demo)+'</p>':""}
function openPanel(next){mode=next;renderPanel();if(active)return;active=true;returnFocus=document.activeElement;$("#panel").classList.add("open");$("#panel").setAttribute("aria-hidden","false");$("#overlay").hidden=false;document.body.style.overflow="hidden";$("#panelClose").focus({preventScroll:true})}
function closePanel(){if(!active)return;active=false;$("#panel").classList.remove("open");$("#panel").setAttribute("aria-hidden","true");$("#overlay").hidden=true;document.body.style.overflow="";if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true})}
$("#favOpen").addEventListener("click",()=>openPanel("favorites"));$("#cartOpen").addEventListener("click",()=>openPanel("cart"));$("#mobileFav").addEventListener("click",()=>openPanel("favorites"));$("#mobileCart").addEventListener("click",()=>openPanel("cart"));$("#panelClose").addEventListener("click",closePanel);$("#overlay").addEventListener("click",closePanel);
$$("[data-panel]").forEach(b=>b.addEventListener("click",()=>openPanel(b.dataset.panel)));
$("#panelBody").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(b)toggle(mode,b.dataset.remove)});
$("#requestForm").addEventListener("submit",async e=>{e.preventDefault();const form=e.currentTarget,button=form.querySelector("button[type=submit]");if(!form.reportValidity())return;button.disabled=true;$("#formStatus").textContent="…";try{const data=Object.fromEntries(new FormData(form));const res=await fetch("/api/request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});if(!res.ok)throw Error();const result=await res.json().catch(()=>({}));if(res.status===202){$("#formStatus").textContent=lang==="en"?"Demo mode: request was not saved.":lang==="de"?"Demo-Modus: Anfrage nicht gespeichert.":lang==="ja"?"デモモード：保存されませんでした。":"Демо-режим: заявка не сохранена. Нужна база данных.";return}form.reset();$("#formStatus").textContent=t.sent}catch{$("#formStatus").textContent=t.error}finally{button.disabled=false}});
async function load(){try{const res=await fetch("/api/products");if(!res.ok)throw Error("API");const json=await res.json();products=Array.isArray(json)?json:Array.isArray(json.products)?json.products:[];products=products.map(p=>({...p,price:Number(p.price)||0}));render();renderPanel()}catch{$("#products").innerHTML='<div class="empty">'+safe(t.error)+'</div>';$("#resultCount").textContent="00"}}
localize();updateCounters();load();

/* V14 cinematic motion and accessibility */
(function(){
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const bar=document.getElementById("readingBar");let pending=false;
const update=()=>{pending=false;const max=document.documentElement.scrollHeight-window.innerHeight;bar.style.transform="scaleX("+(max>0?Math.max(0,Math.min(1,window.scrollY/max)):0)+")"};
window.addEventListener("scroll",()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});window.addEventListener("resize",update,{passive:true});update();
if(reduced||!("IntersectionObserver" in window))return;
document.documentElement.classList.add("motion-ready");
const io=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target)}},{threshold:.07,rootMargin:"0px 0px 35px 0px"});
const observe=(root)=>{root.querySelectorAll(".section-top,.studio-grid article,.contact-copy,.contact form,.product").forEach(el=>{if(!el.classList.contains("reveal")){el.classList.add("reveal");io.observe(el)}})};
observe(document);
const grid=document.getElementById("products");if(grid){new MutationObserver(()=>observe(grid)).observe(grid,{childList:true});if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){grid.addEventListener("pointermove",e=>{const card=e.target.closest(".product");if(!card)return;const r=card.getBoundingClientRect();card.style.setProperty("--card-x",(e.clientX-r.left)+"px");card.style.setProperty("--card-y",(e.clientY-r.top)+"px")},{passive:true})}}
})();

/* VIONA 15: detail, discovery, account and order-request experience. */
(function(){
const copy={
ru:{view:"Подробнее",details:"Описание продукта",category:"Категория",favorite:"В избранное",order:"Заявка на заказ",orderNote:"Это запрос на связь, а не оплата. Никакие деньги не списываются.",orderSubmit:"Отправить запрос",profile:"VIONA ID",local:"Локальный профиль",localNote:"Имя и настройки хранятся только в этом браузере. Это не зарегистрированный аккаунт.",nick:"Твой ник",save:"Сохранить профиль",favorites:"В избранном",cart:"В корзине",world:"Текущий мир",search:"Быстрый поиск",empty:"Ничего не найдено",profileSaved:"Профиль сохранён",checkoutEmpty:"Сначала добавь товар",noPayments:"Оплата пока не подключена. Можно отправить заявку.",requestFailed:"Заявка не сохранена — попробуй позже",requestDemo:"Демо-режим: заявка не сохранена. Нужна база данных.",requestSent:"Заявка отправлена",close:"Закрыть"},
en:{view:"Quick view",details:"Product details",category:"Category",favorite:"Save",order:"Order request",orderNote:"This is a contact request, not a payment. No charge will be made.",orderSubmit:"Send request",profile:"VIONA ID",local:"Local profile",localNote:"Your nickname and preferences stay in this browser. This is not a registered account.",nick:"Your nickname",save:"Save profile",favorites:"Favorites",cart:"In cart",world:"Current world",search:"Quick search",empty:"Nothing found",profileSaved:"Profile saved",checkoutEmpty:"Add an item first",noPayments:"Payments are not connected. You can send a request.",requestFailed:"Request was not saved",requestDemo:"Demo mode: request not saved. Database required.",requestSent:"Request sent",close:"Close"},
ja:{view:"詳細を見る",details:"商品詳細",category:"カテゴリー",favorite:"保存",order:"注文のお問い合わせ",orderNote:"これはお問い合わせであり、決済ではありません。",orderSubmit:"送信",profile:"VIONA ID",local:"ローカルプロフィール",localNote:"名前と設定はこのブラウザだけに保存されます。登録アカウントではありません。",nick:"ニックネーム",save:"保存",favorites:"お気に入り",cart:"カート",world:"テーマ",search:"検索候補",empty:"見つかりません",profileSaved:"保存しました",checkoutEmpty:"商品を追加してください",noPayments:"決済機能は未対応です。お問い合わせは可能です。",requestFailed:"送信できませんでした",requestDemo:"デモモード：保存されませんでした。",requestSent:"送信しました",close:"閉じる"},
de:{view:"Details ansehen",details:"Produktdetails",category:"Kategorie",favorite:"Merken",order:"Bestellanfrage",orderNote:"Dies ist eine Kontaktanfrage, keine Zahlung. Es wird nichts abgebucht.",orderSubmit:"Anfrage senden",profile:"VIONA ID",local:"Lokales Profil",localNote:"Name und Einstellungen bleiben in diesem Browser. Kein registriertes Konto.",nick:"Dein Name",save:"Profil speichern",favorites:"Favoriten",cart:"Warenkorb",world:"Designwelt",search:"Schnellsuche",empty:"Keine Ergebnisse",profileSaved:"Profil gespeichert",checkoutEmpty:"Bitte Produkt hinzufügen",noPayments:"Keine Zahlung möglich. Anfrage senden.",requestFailed:"Anfrage nicht gespeichert",requestDemo:"Demo-Modus: nicht gespeichert. Datenbank erforderlich.",requestSent:"Anfrage gesendet",close:"Schließen"},
femboy:{view:"Посмотреть ♡",details:"Всё о товаре ♡",category:"Категория",favorite:"Сохранить ♡",order:"Моя заявка ♡",orderNote:"Это только заявка, оплата не производится.",orderSubmit:"Отправить ♡",profile:"VIONA ID ♡",local:"Мой уголок",localNote:"Ник хранится только в этом браузере. Настоящей регистрации пока нет.",nick:"Твой ник ♡",save:"Сохранить ♡",favorites:"Любимое",cart:"Корзина",world:"Твой мир",search:"Найти милое",empty:"Ничего нет ♡",profileSaved:"Сохранено ♡",checkoutEmpty:"Добавь что-нибудь ♡",noPayments:"Оплаты пока нет, но можно оставить заявку ♡",requestFailed:"Не получилось сохранить заявку",requestDemo:"Демо-режим: заявка не сохранена.",requestSent:"Заявка отправлена ♡",close:"Закрыть"}
};const tr=copy[lang]||copy.ru;
const overlay=document.getElementById("v15Overlay"),dialog=document.getElementById("v15Dialog"),content=document.getElementById("v15Content"),closeBtn=document.getElementById("v15Close");
let isOpen=false,priorFocus=null,modalType="",modalProduct=null,scrollLockPrevious="";
function open(type,markup){if(active)closePanel();if(!isOpen)priorFocus=document.activeElement;modalType=type;content.innerHTML=markup;overlay.hidden=false;dialog.classList.add("open");dialog.setAttribute("aria-hidden","false");isOpen=true;scrollLockPrevious=document.body.style.overflow;document.body.style.overflow="hidden";closeBtn.focus({preventScroll:true})}
function close(){if(!isOpen)return;isOpen=false;dialog.classList.remove("open");dialog.setAttribute("aria-hidden","true");overlay.hidden=true;document.body.style.overflow=scrollLockPrevious;content.innerHTML="";modalProduct=null;if(priorFocus?.isConnected)priorFocus.focus({preventScroll:true})}
closeBtn.addEventListener("click",close);overlay.addEventListener("click",close);
document.addEventListener("keydown",e=>{if(!isOpen)return;if(e.key==="Escape"){e.preventDefault();close()}if(e.key==="Tab"){const els=[...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),a[href]')].filter(x=>x.getClientRects().length);if(!els.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
function productDetail(id){const p=products.find(x=>String(x.id)===String(id));if(!p)return;modalProduct=String(p.id);const v=localized(p);const fav=state.favorites.includes(modalProduct),inCart=state.cart.includes(modalProduct);open("product",'<div class="v15-kicker">VIONA SELECT / '+safe(v.tag)+'</div><div class="detail-layout"><div class="detail-visual"><span class="detail-orbit">✦</span><span class="detail-glyph">'+safe(v.icon)+'</span><span class="detail-index">V / '+safe(modalProduct.padStart(3,"0"))+'</span></div><div class="detail-info"><span class="section-kicker">'+safe(tr.details)+'</span><h2 id="v15Title">'+safe(v.title)+'</h2><p>'+safe(v.description)+'</p><div class="detail-meta"><span>'+safe(tr.category)+'</span><strong>'+safe(v.category)+'</strong></div><div class="detail-price">'+money(v.price)+'</div><div class="detail-actions"><button type="button" class="action-primary" data-v15-add="'+safe(modalProduct)+'">'+safe(inCart?t.added:t.add)+' ↗</button><button type="button" class="detail-fav" data-v15-fav="'+safe(modalProduct)+'" aria-pressed="'+fav+'">'+(fav?"♥ ":"♡ ")+safe(tr.favorite)+'</button></div><p class="detail-note">'+safe(t.demo)+'</p></div></div>')}
document.getElementById("products").addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(b)productDetail(b.dataset.view)});
content.addEventListener("click",e=>{const add=e.target.closest("[data-v15-add]"),fav=e.target.closest("[data-v15-fav]");if(add||fav){const id=add?add.dataset.v15Add:fav.dataset.v15Fav;toggle(add?"cart":"favorites",id);productDetail(id)}});
const profileKey="viona-id-local-v15";let profile=getStorage(profileKey,{nick:""});
function openProfile(){const nick=String(profile.nick||"").slice(0,32);open("profile",'<div class="v15-kicker">VIONA / PERSONAL SPACE</div><h2 id="v15Title">'+safe(tr.profile)+'</h2><div class="profile-card"><div class="profile-avatar">'+safe(nick.trim()?nick.trim().charAt(0).toUpperCase():"V")+'</div><div><strong>'+safe(nick||tr.local)+'</strong><p>'+safe(tr.localNote)+'</p></div></div><form id="v15ProfileForm" class="v15-form"><label>'+safe(tr.nick)+'<input name="nick" maxlength="32" autocomplete="nickname" value="'+safe(nick)+'" placeholder="VIONA"></label><button type="submit" class="action-primary">'+safe(tr.save)+' ↗</button></form><div class="profile-stats"><div><strong>'+state.favorites.length+'</strong><small>'+safe(tr.favorites)+'</small></div><div><strong>'+state.cart.length+'</strong><small>'+safe(tr.cart)+'</small></div><div><strong>'+safe(lang.toUpperCase())+'</strong><small>'+safe(tr.world)+'</small></div></div>')}
document.getElementById("profileOpen").addEventListener("click",openProfile);
content.addEventListener("submit",e=>{if(e.target.id!=="v15ProfileForm")return;e.preventDefault();profile={nick:String(new FormData(e.target).get("nick")||"").trim().slice(0,32)};try{localStorage.setItem(profileKey,JSON.stringify(profile))}catch{}toast(tr.profileSaved);openProfile()});
const suggestions=document.getElementById("searchSuggestions"),search=document.getElementById("search");function hideSuggestions(){suggestions.hidden=true;search.setAttribute("aria-expanded","false")}
function updateSuggestions(){const q=search.value.trim().toLocaleLowerCase();if(!q){hideSuggestions();return}const hits=products.filter(p=>[p.title,p.description,localized(p).title,localized(p).description,p.category].join(" ").toLocaleLowerCase().includes(q)).slice(0,5);suggestions.innerHTML=hits.length?hits.map(p=>{const v=localized(p);return '<button type="button" role="option" data-suggest="'+safe(p.id)+'"><span class="suggest-icon">'+safe(p.icon)+'</span><span class="suggest-title">'+safe(v.title)+'</span><span class="suggest-price">'+money(p.price)+'</span></button>'}).join(""):'<div class="suggest-empty">'+safe(tr.empty)+'</div>';suggestions.hidden=false;search.setAttribute("aria-expanded","true")}
search.addEventListener("input",updateSuggestions);search.addEventListener("focus",updateSuggestions);search.addEventListener("keydown",e=>{if(e.key==="Escape")hideSuggestions();if(e.key==="ArrowDown"&&!suggestions.hidden){e.preventDefault();suggestions.querySelector("button")?.focus()}});
suggestions.addEventListener("keydown",e=>{const buttons=[...suggestions.querySelectorAll("button")],idx=buttons.indexOf(document.activeElement);if(e.key==="Escape"){hideSuggestions();search.focus()}if(e.key==="ArrowDown"){e.preventDefault();buttons[Math.min(idx+1,buttons.length-1)]?.focus()}if(e.key==="ArrowUp"){e.preventDefault();if(idx===0)search.focus();else buttons[idx-1]?.focus()}});
suggestions.addEventListener("click",e=>{const b=e.target.closest("[data-suggest]");if(!b)return;hideSuggestions();productDetail(b.dataset.suggest)});
document.addEventListener("pointerdown",e=>{if(!e.target.closest(".smart-search"))hideSuggestions()});
function openCheckout(){
 const selected=state.cart.map(id=>products.find(p=>String(p.id)===id)).filter(Boolean);
 if(!selected.length){toast(tr.checkoutEmpty);return}
 stopQrPolling();
 const total=selected.reduce((n,p)=>n+Number(p.price||0),0);
 const items=selected.map(p=>'<li class="vx-line"><span class="vx-product-glyph">'+safe(p.icon||"✦")+'</span><span class="vx-product-name">'+safe(localized(p).title)+'</span><strong>'+money(p.price)+'</strong></li>').join("");
 open("checkout",[
  '<div class="vx-checkout">',
  '<div class="vx-overline"><span class="vx-spark">✦</span> VIONA / CHECKOUT <span class="vx-demo-dot"></span> ТЕСТОВЫЙ РЕЖИМ</div>',
  '<h2 id="v15Title" class="vx-title">Оформление <em>заказа.</em></h2>',
  '<p class="vx-lead">Выбери удобный способ оплаты — всё остальное сделаем мы.</p>',
  '<div class="vx-layout">',
    '<main class="vx-payment-column">',
     '<section class="vx-methods" id="vionaPaymentOptions" hidden>',
      '<div class="vx-section-title"><span class="vx-section-number">01</span><h3>Способ оплаты</h3><span class="vx-section-caption">Т-Банк · DEMO</span></div>',
      '<div class="vx-payment-method-list">',
        '<button type="button" id="vionaDemoPay" class="vx-method vx-card-method">',
         '<span class="vx-method-icon" aria-hidden="true">▤</span>',
         '<span class="vx-method-copy"><strong>Банковская карта</strong><small>Visa, Mastercard, Мир · защищённая страница банка</small></span>',
         '<span class="vx-method-arrow" aria-hidden="true">↗</span>',
        '</button>',
        '<button type="button" id="vionaSbpPay" class="vx-method vx-sbp-method">',
         '<span class="vx-method-icon" aria-hidden="true">▦</span>',
         '<span class="vx-method-copy"><strong>СБП по QR-коду</strong><small>Оплата через приложение любого поддерживаемого банка</small></span>',
         '<span class="vx-method-arrow" aria-hidden="true">↗</span>',
        '</button>',
      '</div>',
      '<div class="vx-wallet">',
       '<div class="vx-wallet-heading"><span class="vx-wallet-symbol" aria-hidden="true">▣</span><div><strong>Сохранённые карты</strong><small>Привязаны к твоему VIONA ID</small></div><button type="button" class="vx-wallet-refresh" id="vionaRefreshCards" title="Обновить список сохранённых карт">↻ <span>Обновить</span></button></div>',
       '<div id="vionaCardsList" class="vx-card-list" role="status" aria-live="polite"><p class="vx-card-state">Загружаем карты…</p></div>',
       '<p class="vx-wallet-footnote">Карты отображаются для удобства. Оплату в один клик подключим после тестирования.</p>',
      '</div>',
      '<label class="vx-consent" for="vionaSaveCard"><input type="checkbox" id="vionaSaveCard"><span class="vx-checkbox-art" aria-hidden="true">✓</span><span><strong>Сохранить новую карту</strong><small>По желанию. Банк сохранит данные для будущих покупок.</small></span></label>',
      '<p class="vx-safety"><span aria-hidden="true">◇</span> Данные карты и CVV вводятся только у Т-Банка — не на сайте VIONA.</p>',
     '</section>',
     '<div id="checkoutStatus" class="vx-status" role="status" aria-live="polite"></div>',
     '<section id="vionaQrPanel" class="vx-qr-panel" hidden>',
      '<div class="vx-section-title"><span class="vx-section-number">QR</span><h3>Оплата через СБП</h3></div>',
      '<div class="vx-qr-frame"><img id="vionaQrImage" alt="QR-код для тестовой оплаты через СБП" width="248" height="248"></div>',
      '<a id="vionaQrLink" class="vx-qr-action" target="_blank" rel="noopener noreferrer">Открыть в приложении банка ↗</a>',
      '<p id="vionaQrState" role="status" aria-live="polite">Ожидаем подтверждение оплаты…</p>',
     '</section>',
     '<details class="vx-contact-fold"><summary>Нужно обсудить заказ? <span>Оставить заявку ↗</span></summary>',
       '<form id="v15CheckoutForm" class="v15-form vx-contact-form">',
        '<label>'+safe(t.nameLabel)+'<input name="name" maxlength="100" required autocomplete="name" value="'+safe(profile.nick||"")+'"></label>',
        '<label>'+safe(t.contactLabel)+'<input name="contact" maxlength="200" required autocomplete="email" placeholder="Telegram / email"></label>',
        '<label>'+safe(t.detailsLabel)+'<textarea name="details" minlength="10" maxlength="5000" rows="3" required></textarea></label>',
        '<button type="submit" class="action-primary">'+safe(tr.orderSubmit)+' ↗</button>',
        '<p id="vionaRequestStatus" role="status" aria-live="polite"></p>',
       '</form>',
     '</details>',
    '</main>',
    '<aside class="vx-summary" aria-label="Ваш заказ">',
      '<div class="vx-summary-heading"><span>ТВОЙ ЗАКАЗ</span><span>'+selected.length+' шт.</span></div>',
      '<ul class="vx-summary-items">'+items+'</ul>',
      '<div class="vx-summary-amount"><span>К оплате</span><strong>'+money(total)+'</strong></div>',
      '<div class="vx-test-banner"><span class="vx-test-indicator"></span><div><strong>Тестовая оплата</strong><small>Реальные деньги не списываются</small></div></div>',
    '</aside>',
  '</div>',
 '</div>'
 ].join(""));
 loadSavedCards();
}
let vionaCardsRequest=0;
async function loadSavedCards(){
 const target=content.querySelector("#vionaCardsList");if(!target)return;
 const request=++vionaCardsRequest;
 target.innerHTML='<p class="vx-card-state">Загружаем сохранённые карты…</p>';
 try{
  const response=await fetch("/api/payments/test/cards",{credentials:"same-origin",cache:"no-store"});
  if(request!==vionaCardsRequest||!content.contains(target))return;
  if(response.status===401){target.innerHTML='<p class="vx-card-state">Войди через Telegram, чтобы увидеть свои карты.</p>';return}
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(data.error||"Не удалось получить список карт");
  const cards=Array.isArray(data.cards)?data.cards.filter(c=>c&&/^[0-9]{4}$/.test(String(c.last4))):[];
  if(!cards.length){
   target.innerHTML='<p class="vx-card-state">'+(data.bankAvailable===false?'Карты пока не найдены. Если ты сохранил карту, обнови список после оплаты.':'Пока нет сохранённых карт. При оплате отметь «Сохранить новую карту».')+'</p>';
   return;
  }
  target.innerHTML=cards.slice(0,12).map(card=>
   '<div class="vx-saved-card"><span class="vx-mini-card-icon" aria-hidden="true">▤</span><span><strong>Карта ···· '+safe(card.last4)+'</strong><small>Сохранена через Т-Банк</small></span><span class="vx-card-check" aria-label="Сохранена">✓</span></div>'
  ).join("");
 }catch(e){
  if(request!==vionaCardsRequest||!content.contains(target))return;
  target.innerHTML='<p class="vx-card-state">Не удалось загрузить карты. Нажми «Обновить».</p>';
 }
}
content.addEventListener("click",e=>{if(e.target.closest("#vionaRefreshCards"))loadSavedCards()});
content.addEventListener("click",async e=>{
 if(e.target.id!=="vionaDemoPay")return;
 const button=e.target,status=content.querySelector("#checkoutStatus");
 const ids=state.cart.map(Number);
 button.disabled=true;status.textContent="Создаём тестовый платёж…";
 try{const r=await fetch("/api/payments/test/init",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({items:ids,saveCard:content.querySelector("#vionaSaveCard")?.checked===true})});const data=await r.json();if(!r.ok)throw Error(data.error||"Ошибка оплаты");window.location.assign(data.paymentUrl)}
 catch(err){status.textContent=err.message;button.disabled=false}
});

let vionaQrTimer=null;
function stopQrPolling(){if(vionaQrTimer){clearInterval(vionaQrTimer);vionaQrTimer=null}}
content.addEventListener("click",async e=>{
 const button=e.target.closest("#vionaSbpPay");
 if(!button)return;
 const status=content.querySelector("#checkoutStatus"),ids=state.cart.map(Number);
 stopQrPolling();button.disabled=true;status.textContent="Создаём тестовый QR СБП…";
 const panel=content.querySelector("#vionaQrPanel");if(panel)panel.hidden=true;
 try{
  const r=await fetch("/api/payments/test/qr",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({items:ids})});
  const data=await r.json();if(!r.ok)throw Error(data.error||"Ошибка СБП");
  if(!data.qrImage||!data.qrLink||!data.orderId)throw Error("Банк не вернул QR");
  content.querySelector("#vionaQrImage").src=data.qrImage;
  content.querySelector("#vionaQrLink").href=data.qrLink;
  panel.hidden=false;status.textContent="Откройте ссылку или отсканируйте QR-код банковским приложением.";
  let ticks=0;
  vionaQrTimer=setInterval(async()=>{
   const label=content.querySelector("#vionaQrState");
   if(!label||++ticks>36){stopQrPolling();return}
   try{const resp=await fetch("/api/payments/test/status/"+encodeURIComponent(data.orderId),{credentials:"same-origin",cache:"no-store"});if(!resp.ok)return;const state=await resp.json();
    if(["AUTHORIZED","CONFIRMED"].includes(state.status)){label.textContent="Тестовая оплата подтверждена ✓";stopQrPolling()}
    else if(["REJECTED","DEADLINE_EXPIRED","CANCELED","REVERSED"].includes(state.status)){label.textContent="Оплата не прошла";stopQrPolling()}
   }catch{}
  },5000);
 }catch(err){status.textContent=err.message}
 finally{button.disabled=false}
});
fetch("/api/payments/test/config").then(r=>r.json()).then(d=>{const show=()=>{const b=content.querySelector("#vionaPaymentOptions");if(b)b.hidden=!d.enabled};const obs=new MutationObserver(show);obs.observe(content,{childList:true,subtree:false});show()}).catch(()=>{});
document.getElementById("panelBottom").addEventListener("click",e=>{if(e.target.closest("#checkoutOpen"))openCheckout()});
content.addEventListener("submit",async e=>{if(e.target.id!=="v15CheckoutForm")return;e.preventDefault();const form=e.target;if(!form.reportValidity())return;const button=form.querySelector("button[type=submit]"),status=content.querySelector("#vionaRequestStatus");const selected=state.cart.map(id=>products.find(p=>String(p.id)===id)).filter(Boolean);if(!selected.length){status.textContent=tr.checkoutEmpty;return}const values=Object.fromEntries(new FormData(form));const orderLines=selected.map(p=>p.title+" (ID "+p.id+"): "+p.price+" RUB").join("; ");const details="VIONA order request: "+orderLines+"\nTotal: "+selected.reduce((n,p)=>n+Number(p.price||0),0)+" RUB\n"+values.details;button.disabled=true;status.textContent="…";try{const res=await fetch("/api/request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:values.name,contact:values.contact,details:details.slice(0,5000)})});if(!res.ok)throw Error();if(res.status===202){status.textContent=tr.requestDemo;return}status.textContent=tr.requestSent;form.reset();toast(tr.requestSent)}catch{status.textContent=tr.requestFailed}finally{button.disabled=false}});
})();
