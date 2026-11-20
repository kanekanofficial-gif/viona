"use strict";
(()=>{
 const $=(s,root=document)=>root.querySelector(s);
 const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const txt=(s,max=4000)=>typeof s==="string"?s.trim().slice(0,max):"";
 const format=n=>new Intl.NumberFormat("ru-RU").format(Number(n)||0)+" ₽";
 const read=(key,backup)=>{try{const x=JSON.parse(localStorage.getItem(key));return x??backup}catch{return backup}};
 const state={catalog:[],cart:read("viona3-cart",[]).filter(Number.isSafeInteger),user:null,auth:null,active:"all",query:"",busy:false,modal:null};
 const art={
 1:{kind:"telegram",images:["telegram.svg"]},
 2:{kind:"web"},
 3:{kind:"discord",images:["discrod.svg"]},
 4:{kind:"game",images:["gamepad.svg"]},
 5:{kind:"web"},
 6:{kind:"code"},
 7:{kind:"max",images:["Max.svg"]}
 };
 const img=n=>"/assets/brand-icons/"+encodeURIComponent(n);
 let toastTimeout;
 function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("shown");clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove("shown"),3500)}
 async function get(url,opts){const r=await fetch(url,{credentials:"same-origin",cache:"no-store",...opts});let json={};try{json=await r.json()}catch{}if(!r.ok)throw Object.assign(new Error(json.error||"Сервис сейчас недоступен."),{status:r.status,code:json.code||"",bankCode:json.bankCode||""});return json}
 const post=(url,data)=>get(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 function cartItems(){return state.cart.map(id=>state.catalog.find(p=>Number(p.id)===id)).filter(Boolean)}
 function cartTotal(){return cartItems().reduce((n,p)=>n+Number(p.price||0),0)}
 function saveCart(){state.cart=[...new Set(state.cart)];localStorage.setItem("viona3-cart",JSON.stringify(state.cart));$("#cartBadge").textContent=state.cart.length}
 function addToCart(id){if(!state.cart.includes(id)){state.cart.push(id);saveCart();toast("Добавлено в корзину")}else{toast("Уже в корзине")}}
 function removeFromCart(id){state.cart=state.cart.filter(x=>x!==id);saveCart();openCart()}
 function renderCard(p){
  const id=Number(p.id),price=Number(p.price||0);
  const meta=art[id]||{kind:"code"};
  const visual=meta.images?meta.images.map(n=>'<img alt="" loading="lazy" src="'+img(n)+'">').join("")
    :meta.kind==="web"?'<div class="mini-browser"><div></div><b>Design that works.</b><i></i></div>'
    :meta.kind==="code"?'<span class="mini-code">&lt;/&gt;</span>':'<span class="mini-code">✳</span>';
  const cat=esc(p.category||"Проекты"),title=esc(p.title||"Без названия"),desc=esc(p.description||"");
  return '<article class="product-item glass-surface" data-product="'+id+'"><div class="product-visual scene-'+esc(meta.kind)+'">'+visual+'<span class="water-drop" aria-hidden="true"></span></div><div class="product-type"><span>'+cat+'</span><span>VIONA / '+String(id).padStart(2,"0")+'</span></div><h3>'+title+'</h3><p>'+desc+'</p><div class="product-bottom"><span class="price">'+(price>0?format(price):"По запросу")+'</span><button type="button" data-view-product="'+id+'">Подробнее ↗</button></div></article>';
 }
 function renderCatalog(){
  const list=state.catalog.filter(p=>(state.active==="Все"||p.category===state.active)&&(p.title+" "+p.description+" "+p.category).toLocaleLowerCase("ru").includes(state.query));
  $("#productCount").textContent=list.length+" "+(list.length===1?"товар":list.length>1&&list.length<5?"товара":"товаров");
  $("#productGrid").innerHTML=list.length?list.map(renderCard).join(""):'<div class="glass-surface" style="grid-column:1/-1;padding:35px">По такому запросу ничего не найдено. <a href="#contact" style="text-decoration:underline">Опиши свой проект</a>.</div>';
 }
 async function loadCatalog(){
  try{
   const r=await get("/api/products");
   state.catalog=Array.isArray(r.products)?r.products.filter(x=>Number.isSafeInteger(Number(x.id))):[];
   renderCatalog();saveCart();
  }catch(e){$("#productGrid").innerHTML='<div class="glass-surface" style="grid-column:1/-1;padding:28px">Не удалось открыть каталог. Обнови страницу или напиши в поддержку.</div>'}
 }
 function showModal(html,mode){
  state.modal=mode;
  $("#modalBody").innerHTML=html;
  $("#modalScrim").hidden=false;
  document.body.style.overflow="hidden";
  $(".close-modal").focus();
 }
 function closeModal(){state.modal=null;$("#modalScrim").hidden=true;$("#modalBody").innerHTML="";document.body.style.overflow=""}
 const legal='<div class="legal-links"><a href="/legal/terms" target="_blank" rel="noopener">Соглашение</a><a href="/legal/privacy" target="_blank" rel="noopener">Конфиденциальность</a><a href="/legal/delivery" target="_blank" rel="noopener">Условия оплаты и услуг</a></div>';
 function viewProduct(id){
  const p=state.catalog.find(x=>Number(x.id)===id);if(!p)return;
  const price=Number(p.price||0);
  showModal('<span class="section-number">VIONA / SERVICE DETAILS</span><h2>'+esc(p.title)+'</h2><p>'+esc(p.description)+'</p><div class="modal-alert"><b>Категория:</b> '+esc(p.category)+'<br><b>Стоимость:</b> '+(price?format(price):"Согласуется отдельно")+'<br>Для индивидуальной настройки потребуется техническое задание.</div>'+legal+'<div style="height:17px"></div>'+(price?'<button type="button" class="solid-button" data-add-cart="'+id+'">Добавить в корзину — '+format(price)+' ↗</button>':'<a class="solid-button" href="#contact" id="requestIndividual">Описать задачу ↗</a>'),"product");
 }
 function openCart(){
  const list=cartItems();
  showModal('<span class="section-number">VIONA / YOUR BAG</span><h2>Твоя корзина <span style="opacity:.45">('+list.length+')</span></h2>'+(
    list.length?list.map(p=>'<div class="modal-item"><div><b>'+esc(p.title)+'</b><br><small class="modal-meta">'+esc(p.category)+'</small></div><div style="display:flex;align-items:center;gap:12px"><b>'+format(p.price)+'</b><button type="button" data-remove-cart="'+Number(p.id)+'">Убрать</button></div></div>').join("")+
    '<div class="total-row"><span>Итого</span><span>'+format(cartTotal())+'</span></div><div class="modal-alert">Оплата только в тестовом режиме Т-Банка. Деньги не списываются. Для оформления потребуется аккаунт Telegram и описание задачи.</div><button type="button" class="solid-button" id="beginCheckout">Перейти к оформлению ↗</button>'
    :'<p>Пока пусто. Выбери товар в каталоге.</p><button type="button" class="solid-button" data-close-modal>Продолжить просмотр ↗</button>'),"cart");
 }
 async function loadUser(){
  try{
   const [a,c]=await Promise.all([get("/api/auth/me"),get("/api/auth/config")]);
   state.user=a.user||null;state.auth=c;
  }catch{state.user=null;state.auth={telegram:false}}
  $("[data-open-account]").innerHTML=state.user?"VIONA ID · "+esc(state.user.name).slice(0,14)+' <span>↗</span>':'VIONA ID <span>↗</span>';
 }
 function telegramLogin(){
  if(!state.auth?.telegram||!state.auth?.botUsername){
   $("#loginSpace").innerHTML='<div class="modal-alert">Вход через Telegram не настроен. Напиши в поддержку VIONA.</div>';
   return;
  }
  const host=$("#loginSpace");
  const script=document.createElement("script");
  script.async=true;script.src="https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-login",state.auth.botUsername);
  script.setAttribute("data-size","large");script.setAttribute("data-radius","12");
  script.setAttribute("data-auth-url",location.origin+"/auth/telegram/widget");
  script.setAttribute("data-request-access","write");host.append(script);
 }
 async function openAccount(){
  await loadUser();
  if(!state.user){
   showModal('<span class="section-number">VIONA / ID</span><h2>Твой профиль — твои проекты.</h2><p>Войди через Telegram, чтобы оформлять тестовые заказы и получать готовые проекты.</p><div id="loginSpace" class="login-frame"></div><div class="modal-alert">Вход выполняется через официальный Telegram. Пароли не запрашиваются на VIONA.</div><p><a href="/classic" style="text-decoration:underline">Классический вход (резервный)</a></p>',"account");
   telegramLogin();return;
  }
  showModal('<span class="section-number">VIONA / PRIVATE SPACE</span><h2>Привет, '+esc(state.user.name||"!")+'</h2><p>Личные заказы и результаты привязаны к твоему Telegram-аккаунту.</p><button type="button" class="ghost-button" id="accountOrders">Мои заказы ↗</button><div style="height:12px"></div><button type="button" class="ghost-button" id="accountLogout">Выйти</button><div id="accountOrdersList"></div>',"account");
 }
 async function showOrders(){
  const target=$("#accountOrdersList");if(!target)return;
  target.innerHTML='<p>Загружаем заказы…</p>';
  try{
   const data=await get("/api/payments/test/my-orders");
   const items=Array.isArray(data.orders)?data.orders:[];
   target.innerHTML='<h3>Мои тестовые заказы</h3>'+(items.length?items.map(o=>{
    const id=String(o.id||o.orderId||o.order_id||"");
    const safe=/^[0-9a-f-]{36}$/i.test(id);
    return '<article class="order-card"><b>Заказ '+esc(id.slice(0,8))+'</b><small>'+esc(o.stageLabel||o.stage||o.status||"Статус уточняется")+'</small><small>'+format((o.amountKopecks||o.amount_kopecks||0)/100)+'</small>'+(safe?'<a href="/payment/order/'+encodeURIComponent(id)+'">Подробнее и готовый файл ↗</a>':"")+'</article>';
   }).join(""):'<p>Пока нет заказов после тестовой оплаты.</p>');
  }catch(e){target.innerHTML='<p>'+esc(e.message)+'</p>'}
 }
 function checkoutHtml(){
  return '<span class="section-number">VIONA / SECURE DEMO CHECKOUT</span><h2>Оформление проекта.</h2><p class="modal-meta">Только тестовые платежи Т-Банка. Настоящие деньги не списываются.</p><div class="total-row"><span>К оплате</span><span>'+format(cartTotal())+'</span></div><form id="checkoutForm" class="modal-form">'+
   '<label>Твой Telegram или email<input name="contact" required minlength="3" maxlength="200" placeholder="@username или email"></label>'+
   '<label>Техническое задание<textarea name="brief" minlength="10" maxlength="4000" required rows="4" placeholder="Расскажи, что именно ты хочешь получить"></textarea></label>'+
   '<div><b style="font-size:12px">Способ оплаты</b><div class="radio-choices" style="margin-top:8px">'+
    '<label><input type="radio" value="card" name="method" checked><img class="choice-image" src="'+img("visa.svg")+'" alt="Visa"><span>Банковская карта</span></label>'+
    '<label><input type="radio" value="sbp" name="method"><img class="choice-image" src="'+img("sbp.svg")+'" alt="СБП"> СБП</label>'+
    '<label><input type="radio" value="sberpay" name="method"><img class="choice-image" src="'+img("sberpay.svg")+'" alt="SberPay"> SberPay (если доступен)</label>'+
    '<label><input type="radio" value="tpay" name="method"><img class="choice-image" src="'+img("t-pay-full.svg")+'" alt="T-Pay"> T-Pay (форма банка)</label>'+
   '</div></div>'+
   '<div id="sberPhoneRow" hidden><label>Номер для SberPay (на компьютере)<input name="phone" inputmode="tel" placeholder="+79990000000" maxlength="16"></label></div>'+
   '<div class="modal-alert">T-Pay предлагается только через защищённую платёжную страницу Т-Банка при включённом способе. Возможность использования СБП и SberPay зависит от настроек тестового терминала. <strong>Данные карты на VIONA не вводятся.</strong></div>'+
   legal+'<label class="consent-row"><input type="checkbox" required name="accept"> Я ознакомился с условиями заказа и обработкой данных.</label>'+
   '<button type="submit" class="solid-button">Открыть тестовую оплату ↗</button><p id="checkoutStatus" class="form-status" role="status"></p></form>';
 }
 async function beginCheckout(){
  await loadUser();
  if(!state.user){toast("Для оплаты требуется вход через Telegram");openAccount();return}
  if(!cartItems().length){toast("Корзина пуста");return}
  showModal(checkoutHtml(),"checkout");
 }
 function trustedPaymentURL(v){
  if(typeof v!=="string")return false;
  try{const u=new URL(v),h=u.hostname.toLowerCase();return u.protocol==="https:"&&!u.username&&!u.password&&!u.port&&(h==="pay.tbank-online.com"||["tbank.ru","tinkoff.ru"].some(d=>h===d||h.endsWith("."+d)))}catch{return false}
 }
 async function processCheckout(form){
  if(state.busy)return;
  if(!form.reportValidity())return;
  const v=Object.fromEntries(new FormData(form)),button=$('button[type="submit"]',form),status=$("#checkoutStatus");
  const method=v.method;
  if(!["card","tpay","sbp","sberpay"].includes(method))return;
  if(method==="sberpay"&&!v.phone&&matchMedia("(pointer:fine)").matches&&window.innerWidth>800){status.textContent="Для SberPay на компьютере укажи номер телефона.";return}
  state.busy=true;button.disabled=true;status.textContent="Создаём тестовый платёж…";
  const ids=cartItems().map(p=>Number(p.id));
  try{
   const payload={items:ids,contact:txt(v.contact,200),brief:txt(v.brief,4000)};
   let endpoint="/api/payments/test/init";
   if(method==="sbp")endpoint="/api/payments/test/qr";
   if(method==="sberpay"){endpoint="/api/payments/test/sberpay";payload.device=window.innerWidth<=800?"mobile":"desktop";payload.phone=txt(v.phone,16)}
   // T-Pay uses the bank-hosted checkout, not an invented direct authorization route.
   const result=await post(endpoint,payload);
   if(method==="sbp"){
    if(typeof result.qrImage!=="string"||!result.qrImage.startsWith("data:image/png;base64,"))throw Error("Не удалось получить QR-код.");
    showModal('<span class="section-number">Т-Банк / СБП · DEMO</span><h2>Тестовая оплата по QR</h2><p>Сканируй код в поддерживаемом банковском приложении. Сумма: '+format(cartTotal())+'</p><img src="'+result.qrImage+'" alt="QR-код СБП для тестовой оплаты" style="display:block;width:min(100%,310px);margin:20px auto"><p class="modal-meta">После подтверждения банка заказ появится в VIONA ID.</p><button type="button" class="solid-button" id="checkPayment">Проверить статус ↗</button><p role="status" id="checkoutStatus" class="form-status"></p>',"qr");
    state.lastOrderId=result.orderId;return;
   }
   if(method==="sberpay"&&result.flow==="push"){
    state.lastOrderId=result.orderId;
    showModal('<h2>Подтверждение SberPay</h2><p>Проверь запрос в приложении банка. После подтверждения заказ появится в кабинете.</p><button type="button" class="solid-button" id="checkPayment">Проверить статус ↗</button><p role="status" id="checkoutStatus" class="form-status"></p>',"qr");return;
   }
   const dest=result.redirectUrl||result.paymentUrl;
   if(!trustedPaymentURL(dest)&&!/^https:\/\/(?:[a-z0-9-]+\.)?(?:sberbank\.ru|sber\.ru|sberpay\.ru|sberbankonline\.ru)\//i.test(String(dest||"")))throw Error("Банк вернул неподходящую ссылку на оплату.");
   location.assign(dest);
  }catch(e){
   status.textContent=e.message+(e.code?" ["+e.code+(e.bankCode?" / "+e.bankCode:"")+"]":"");
  }finally{state.busy=false;if(button.isConnected)button.disabled=false}
 }
 async function checkPayment(){
  const status=$("#checkoutStatus");if(!state.lastOrderId)return;
  try{const data=await get("/api/payments/test/status/"+encodeURIComponent(state.lastOrderId));status.textContent="Статус банка: "+(data.status||"проверяется")+". При подтверждении заказ появится в кабинете."}
  catch(e){status.textContent=e.message}
 }
 const form=$("#contactForm");
 form.addEventListener("submit",async e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const button=$('button[type=submit]',form),status=$("#contactStatus"),data=Object.fromEntries(new FormData(form));
  button.disabled=true;status.textContent="Отправляем заявку…";
  try{const r=await post("/api/request",{name:txt(data.name,100),contact:txt(data.contact,200),details:txt(data.details,5000)});
   if(!r.message?.toLowerCase().includes("сохранена")){status.textContent=r.message||"Заявка обработана, но не сохранена.";return}
   form.reset();status.textContent="Заявка сохранена. Команда рассмотрит её.";toast("Заявка отправлена")
  }catch(err){status.textContent=err.message}finally{button.disabled=false}
 });
 $("#catalogSearch").addEventListener("input",e=>{state.query=e.target.value.toLocaleLowerCase("ru").trim();renderCatalog()});
 $("#catalogFilters").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(!btn)return;state.active=btn.dataset.category;$$("#catalogFilters button").forEach(b=>b.classList.toggle("selected",b===btn));renderCatalog()});
 document.addEventListener("click",async e=>{
  const t=e.target;
  const view=t.closest("[data-view-product]");if(view){viewProduct(Number(view.dataset.viewProduct));return}
  const add=t.closest("[data-add-cart]");if(add){addToCart(Number(add.dataset.addCart));openCart();return}
  const remove=t.closest("[data-remove-cart]");if(remove){removeFromCart(Number(remove.dataset.removeCart));return}
  if(t.closest("[data-open-cart]")){openCart();return}
  if(t.closest("[data-open-account]")){openAccount();return}
  if(t.closest("[data-close-modal]")){closeModal();return}
  if(t.closest("#beginCheckout")){beginCheckout();return}
  if(t.closest("#accountOrders")){showOrders();return}
  if(t.closest("#accountLogout")){await post("/api/auth/logout",{}).catch(()=>{});state.user=null;closeModal();toast("Выход выполнен");return}
  if(t.closest("#checkPayment")){checkPayment();return}
  if(t.closest("#requestIndividual")){closeModal();return}
 });
 $("#modalScrim").addEventListener("click",e=>{if(e.target.id==="modalScrim")closeModal()});
 $("#modalBody").addEventListener("change",e=>{if(e.target.name==="method"){$("#sberPhoneRow")?.toggleAttribute("hidden",e.target.value!=="sberpay")}});
 $("#modalBody").addEventListener("submit",e=>{if(e.target.id==="checkoutForm"){e.preventDefault();processCheckout(e.target)}});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("#hireOverlay").hidden)closeHire();else if(!$("#modalScrim").hidden)closeModal()}});
 const hire=$("#hireOverlay"),hireFlag="viona3-hiring-dismissed";
 const closeHire=()=>{hire.hidden=true;try{localStorage.setItem(hireFlag,"1")}catch{}document.body.style.overflow=""};
 $("#hireClose").addEventListener("click",closeHire);
 hire.addEventListener("click",e=>{if(e.target===hire)closeHire()});
 $(".hire-modal a").addEventListener("click",closeHire);
 window.addEventListener("load",()=>{if(!read(hireFlag,false)&&!new URLSearchParams(location.search).has("auth")){hire.hidden=false;$("#hireClose").focus()}},{once:true});
 const savedTheme=read("viona3-theme",null),sysDark=matchMedia("(prefers-color-scheme: dark)");
 function theme(t){document.documentElement.dataset.theme=t==="light"?"light":"dark";localStorage.setItem("viona3-theme",JSON.stringify(document.documentElement.dataset.theme))}
 theme(savedTheme||"dark");
 $("#themeToggle").addEventListener("click",()=>theme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
 if("IntersectionObserver"in window){const observer=new IntersectionObserver(items=>{for(const ent of items){if(ent.isIntersecting){ent.target.classList.add("visible");observer.unobserve(ent.target)}}},{rootMargin:"0px 0px -30px 0px",threshold:.08});$$("[data-reveal]").forEach(x=>observer.observe(x))}
 else $$("[data-reveal]").forEach(x=>x.classList.add("visible"));
 if(window.matchMedia("(prefers-reduced-motion: no-preference)").matches){
  const core=$(".hero-core");
  $(".hero-art").addEventListener("pointermove",e=>{if(window.innerWidth<900)return;const r=e.currentTarget.getBoundingClientRect(),x=((e.clientX-r.left)/r.width-.5)*9,y=((e.clientY-r.top)/r.height-.5)*8;core.style.rotate=y+"deg "+x+"deg"});
  $(".hero-art").addEventListener("pointerleave",()=>core.style.rotate="");
 }
 if(location.search.includes("auth=success"))toast("Telegram подключён");
 if(location.search.includes("auth=failed"))toast("Не удалось войти. Проверь настройки Telegram.");
 loadCatalog();loadUser();
})();
