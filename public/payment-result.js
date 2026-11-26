"use strict";
/* VIONA 17 payment return, authenticated order status and actual work timeline. */
(()=>{
 const path=location.pathname.replace(/\/+$/,"")||"/";
 const isResult=path==="/payment/success"||path==="/payment/fail"||/^\/payment\/order\/[0-9a-f-]{36}$/i.test(path);
 if(!isResult)return;
 const escaped=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const validId=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
 const id=path.startsWith("/payment/order/")?path.split("/").at(-1):new URLSearchParams(location.search).get("orderId");
 const money=n=>new Intl.NumberFormat("ru-RU",{style:"currency",currency:"RUB",maximumFractionDigits:0}).format(Number(n)||0);
 const date=v=>{const n=new Date(v);return Number.isNaN(n.getTime())?"—":n.toLocaleString("ru-RU",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})};
 const methodLabel={card:"Банковская карта",sbp:"СБП / QR",sberpay:"SberPay"};
 const stages=[
  {id:"confirmed",label:"Оплата подтверждена",desc:"Банк подтвердил оплату заказа"},
  {id:"queued",label:"Подготавливаем заказ",desc:"Изучаем техническое задание и планируем работу"},
  {id:"in_progress",label:"Выполняем работу",desc:"Команда реализует твоё техническое задание"},
  {id:"ready",label:"Работа завершена — готовим отправку",desc:"Проверяем результат перед передачей"},
  {id:"completed",label:"Отправлено",desc:"Результат передан в личный кабинет"}
 ];
 const stageIndex={queued:1,in_progress:2,ready:3,completed:4};
 document.body.classList.add("vr-result-active");
 document.title="VIONA — Состояние заказа";
 const root=document.createElement("main");
 root.id="vionaResultRoot";
 root.className="vr-root";
 root.setAttribute("aria-live","polite");
 document.body.append(root);
 let interval=null,requests=0,lastHash="",busy=false;
 const header=()=>'<header class="vr-bar"><a href="/" class="vr-logo" aria-label="На главную VIONA"><span class="vr-logo-mark"><img src="/assets/viona-mark.webp?v=1" alt=""></span><span>viona<span class="vr-logo-dot">.</span></span></a><span class="vr-bar-badge"><span class="vr-signal"></span> ТЕСТОВЫЙ РЕЖИМ</span></header>';
 function shell(inner){return header()+'<div class="vr-wrap">'+inner+'</div><footer class="vr-footer"><span>VIONA DIGITAL MARKET / 2026</span><span>Данные платежа сверяются с Т-Банком</span></footer>'}
 const loading=()=>shell('<div class="vr-message vr-waiting"><div class="vr-spinner" aria-hidden="true"></div><span class="vr-eyebrow">VIONA / VERIFYING</span><h1>Проверяем оплату<span class="vr-dot">.</span></h1><p>Связываемся с банком и загружаем твой заказ. Подтверждение происходит на сервере VIONA.</p></div>');
 function problem(title,description,showRetry=true){
  root.innerHTML=shell('<section class="vr-message vr-failure"><div class="vr-fail-symbol" aria-hidden="true">!</div><span class="vr-eyebrow">VIONA / PAYMENT</span><h1>'+escaped(title)+'</h1><p>'+escaped(description)+'</p><div class="vr-actions"><a class="vr-primary-link" href="/#catalog">Вернуться в каталог ↗</a>'+(showRetry?'<button class="vr-secondary-link" type="button" id="vrRetry">Проверить ещё раз ↻</button>':'')+'</div></section>');
 }
 if(!validId.test(String(id||""))){problem("Не найден номер заказа","Перейди к заказу из своего VIONA ID. Без номера мы не можем безопасно проверить платёж.",false);return}
 root.innerHTML=loading();
 const pathToOrder="/payment/order/"+encodeURIComponent(id);
 function steps(order){
  if(order.stage==="rejected")return '<div class="vr-rejected-stage"><strong>Заказ отклонён администратором</strong><p>'+escaped(order.stageNote||"Причина пока не указана.")+'</p></div>';
  const current=stageIndex[order.stage]??1;
  return '<ol class="vr-steps">'+stages.map((step,i)=>{
   const done=i<current||order.stage==="completed",active=!done&&i===current;
   return '<li class="vr-step '+(done?"vr-step-done":active?"vr-step-active":"vr-step-upcoming")+'"><span class="vr-step-track"><span class="vr-step-number">'+(done?"✓":i+1)+'</span></span><div><strong>'+escaped(step.label)+'</strong><small>'+escaped(step.desc)+'</small></div></li>';
  }).join("")+'</ol>';
 }
 function itemsHtml(items){
  if(!items.length)return '<p class="vr-empty">Этот заказ создан до обновления VIONA. История товаров недоступна, но статус оплаты проверяется.</p>';
  return '<div class="vr-items">'+items.map(item=>
   '<article class="vr-item"><div class="vr-item-icon">'+(window.VionaIcons?.product(item)||'<span>◈</span>')+'</div><div class="vr-item-main"><div class="vr-item-title"><strong>'+escaped(item.title||"Цифровой товар")+'</strong><span>'+money(item.price)+'</span></div><p>'+escaped(item.description||"Описание будет уточнено при обработке заказа.")+'</p><div class="vr-tags"><span>'+escaped(item.category||"Цифровой продукт")+'</span>'+(item.tag?'<span>'+escaped(item.tag)+'</span>':'')+'<span>Артикул #'+escaped(item.id)+'</span></div></div></article>'
  ).join("")+'</div>';
 }
 function eventsHtml(events){
  const list=events.filter(e=>e.stage==="message" || e.message);
  if(!list.length)return '<p class="vr-empty">Команда ещё не отправляла сообщений. Когда появятся реальные обновления, они будут здесь.</p>';
  return '<div class="vr-events">'+list.map(e=>
   '<div class="vr-event"><span class="vr-event-bullet" aria-hidden="true">✦</span><div><strong>'+(e.stage==="message"?"Сообщение от команды":"Обновление заказа")+'</strong><p>'+escaped(e.message||"Статус обновлён")+'</p><time>'+escaped(date(e.createdAt))+'</time></div></div>'
  ).join("")+'</div>';
 }
 function deliveryHtml(order){
  if(!order.verifiedPaid)return "";
  if(order.stage==="rejected")return '<section class="vr-box vr-rejected-result"><div class="vr-box-title"><span>Результат заказа</span><small>Отклонён</small></div><p>Администратор отклонил выполнение. Файл недоступен. Если есть вопросы, напиши в поддержку с номером заказа.</p></section>';
  if(order.stage==="completed"&&order.fileAvailable)
   return '<section class="vr-box vr-delivery"><div class="vr-box-title"><span>Твой готовый проект</span><small>Доступ по VIONA ID</small></div>'+
    '<p>Файл загружен командой VIONA и доступен только в аккаунте, который оформил заказ.</p>'+
    '<div class="vr-actions"><a class="vr-primary-link" href="/api/payments/test/order/'+encodeURIComponent(order.orderId)+'/file">Скачать готовый файл ↧</a></div>'+
    (order.fileName?'<p class="vr-file-name">Файл: '+escaped(order.fileName)+'</p>':'')+'</section>';
  return '<section class="vr-box vr-delivery"><div class="vr-box-title"><span>Готовый проект</span><small>Ожидается</small></div>'+
   '<p>Когда администратор завершит заказ и прикрепит результат, здесь появится защищённая кнопка скачивания.</p></section>';
 }

 function render(payload){
  const order=payload.order,confirmed=order.verifiedPaid,failed=order.failed;
  const state=order.rejected?"rejected":confirmed?"success":failed?"failure":"waiting";
  const stageTitle={queued:"Подготавливаем заказ",in_progress:"Выполняем работу",ready:"Готовим отправку",completed:"Отправлено",rejected:"Отклонён"};
  const headline=confirmed?(stageTitle[order.stage]||"Заказ оформлен"):failed?"Оплата не прошла":"Ожидаем подтверждения";
  const description=confirmed?(order.rejected?"Администратор отклонил выполнение заказа. Это не возврат платежа. Причину можно посмотреть ниже, по вопросам обращайся в поддержку.":"Тестовая оплата подтверждена Т-Банком. Заявка сохранена. Следить за рассмотрением ТЗ и этапами работы можно в личном кабинете VIONA."):
   failed?"Банк не подтвердил оплату. Деньги по этому тестовому заказу не считаются полученными. Можно попробовать снова.":
   "Оплата ещё не подтверждена банком. Мы продолжаем проверку — не нужно платить повторно, пока статус не прояснится.";
  const logo=order.rejected?"!":confirmed?"✓":failed?"!":"⋯";
  const receipt='<div class="vr-receipt"><div class="vr-receipt-row"><span>Номер заказа</span><strong>#'+escaped(order.orderId.slice(0,8).toUpperCase())+'</strong></div><div class="vr-receipt-row"><span>Дата оформления</span><strong>'+escaped(date(order.createdAt))+'</strong></div><div class="vr-receipt-row"><span>Способ оплаты</span><strong class="v18-method-receipt"><span class="viona-brand viona-brand-'+(order.method==="sbp"?"sbp":order.method==="sberpay"?"sber":"card")+'" role="img" aria-label="Способ оплаты"></span>'+escaped(methodLabel[order.method]||"Т-Банк")+'</strong></div><div class="vr-receipt-row"><span>Статус банка</span><strong>'+escaped(order.status)+'</strong></div><div class="vr-receipt-total"><span>Сумма заказа</span><strong>'+money(order.amount)+'</strong></div></div>';
  root.innerHTML=shell('<div class="vr-page '+state+'"><div class="vr-hero"><div class="vr-hero-icon" aria-hidden="true">'+logo+'</div><div class="vr-hero-text"><span class="vr-eyebrow">VIONA / '+(confirmed?"PAYMENT COMPLETE":failed?"PAYMENT FAILED":"PAYMENT CHECK")+'</span><h1>'+headline+'<span class="vr-dot">.</span></h1><p>'+description+'</p><div class="vr-hero-actions"><a class="vr-primary-link" href="/#catalog">В каталог ↗</a><a class="vr-secondary-link" href="/#account">Личный кабинет ↗</a><a class="vr-secondary-link" href="'+pathToOrder+'">Ссылка на заказ</a><button type="button" class="vr-text-link" id="vrRetry">Обновить статус ↻</button></div></div></div>'+
   '<div class="vr-grid"><div class="vr-main-column"><section class="vr-box"><div class="vr-box-title"><span>Твой заказ</span><small>'+(order.items.length?order.items.length+" поз.":"Товары")+'</small></div>'+itemsHtml(order.items)+'</section>'+
   '<section class="vr-box vr-customer-brief"><div class="vr-box-title"><span>Моя заявка</span><small>Техническое задание</small></div>'+   (order.customerContact?'<p><b>Контакт:</b> '+escaped(order.customerContact)+'</p>':'')+   '<p class="vr-client-brief">'+escaped(order.customerBrief||"Описание задачи не указано: заказ оформлен до обновления.")+'</p></section>'+
   (confirmed?'<section class="vr-box"><div class="vr-box-title"><span>Этапы выполнения</span><small>По факту выполнения</small></div>'+steps(order)+(order.stageNote?'<div class="vr-current-note">'+escaped(order.stageNote)+'</div>':'')+'</section>':'<section class="vr-box vr-follow"><strong>Что дальше?</strong><p>'+(failed?'Вернись в каталог и открой оформление заказа снова. Не отправляй платежи повторно по старой ссылке.':'Дождись подтверждения банка или обнови статус через несколько секунд. Эта страница ничего не списывает.')+'</p></section>')+
   (confirmed?'<section class="vr-box"><div class="vr-box-title"><span>Обновления команды</span><small>Только настоящие сообщения</small></div>'+eventsHtml(payload.events||[])+'</section>':'')+
   deliveryHtml(order)+'</div><aside class="vr-aside"><section class="vr-box vr-summary"><div class="vr-box-title"><span>Информация</span><small>VIONA / '+(order.demo?"DEMO":"PAYMENT")+'</small></div>'+receipt+'<div class="vr-verified"><span>◇</span>'+(confirmed?'Подтверждено запросом к серверу и данным банка':'Статус заказа проверяется сервером, а не адресом страницы')+'</div></section><div class="vr-help"><span>Нужна помощь?</span><p>Для уточнения сроков и комплектации свяжись с командой VIONA, указав номер заказа.</p><a href="/studio/support">Открыть поддержку ↗</a></div></aside></div></div>');
  document.title="VIONA — "+headline;
 }
 async function load(showLoading=false){
  if(busy)return;busy=true;
  if(showLoading)root.innerHTML=loading();
  try{
   const r=await fetch("/api/payments/test/order/"+encodeURIComponent(id),{credentials:"same-origin",cache:"no-store"});
   const data=await r.json().catch(()=>({}));
   if(!r.ok){
    if(r.status===401){problem("Войди в VIONA ID","Чтобы увидеть заказ и результат оплаты, войди через Telegram на главной странице.",false)}
    else problem("Не удалось открыть заказ",data.error||"Проверь соединение и повтори попытку.");
    return;
   }
   if(!data.order)throw Error("Не получены данные заказа.");
   const next=JSON.stringify(data);
   if(next!==lastHash){render(data);lastHash=next}
   const order=data.order;
   if(order.verifiedPaid){
    // Clear a prior pending checkout cart only for the same authenticated order.
    try{
     const pending=JSON.parse(sessionStorage.getItem("viona-checkout-pending")||"null");
     if(pending?.orderId===order.orderId&&Array.isArray(pending.items)){
      const key="viona-halloween-v1",saved=JSON.parse(localStorage.getItem(key)||"{}");
      if(Array.isArray(saved.cart)){
       const bought=new Set(pending.items.map(String));
       saved.cart=saved.cart.filter(v=>!bought.has(String(v)));
       localStorage.setItem(key,JSON.stringify(saved));
      }
      sessionStorage.removeItem("viona-checkout-pending");
     }
    }catch{}
   }
  }catch(e){problem("Не удалось проверить оплату",e.message||"Проблема с соединением.");}
  finally{busy=false}
 }
 root.addEventListener("click",e=>{
  if(e.target.closest("#vrRetry")){lastHash="";load(true)}
 });
 load();
 // No fabricated progress; only refresh bank verification and real fulfillment changes.
 interval=setInterval(()=>{if(document.visibilityState!=="hidden"&&requests++<90)load()},10000);
 window.addEventListener("pagehide",()=>clearInterval(interval),{once:true});
})();