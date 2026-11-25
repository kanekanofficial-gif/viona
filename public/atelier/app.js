"use strict";
(()=>{
 const $=(s,from=document)=>from.querySelector(s),$$=(s,from=document)=>[...from.querySelectorAll(s)];
 const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
 const rub=n=>new Intl.NumberFormat("ru-RU").format(Number(n)||0)+" ₽";
 const icon=n=>"/assets/brand-icons/"+encodeURIComponent(n);
 const t=(key,fallback)=>window.VionaLocale?.t(key,fallback)||fallback;
 const currentLang=()=>window.VionaLocale?.get()||"ru";
 const detailed=id=>window.VionaProductDetails?.get(id,currentLang())||null;
 const musicCard=()=>({id:"music",category:"Музыка",title:({en:"Custom music track",ja:"オリジナル楽曲の制作",de:"Musik nach Wunsch"})[currentLang()]||"Музыкальный трек на заказ",description:({en:"An original track by KANEKAN KAN, with your lyrics, mood and vocal preference.",ja:"KANEKAN KANによるオリジナル楽曲制作。歌詞・雰囲気・声を選べます。",de:"Ein eigener Track von KANEKAN KAN nach Text, Stimmung und Stimme."})[currentLang()]||"KANEKAN KAN создаст трек по твоей идее: жанр, текст, настроение, голос и инструменты.",price:0,tag:"SoundLab"});
 const avatarUrl=user=>{try{const u=new URL(user.picture||"");return u.protocol==="https:"&&!u.username&&!u.password?escape(u.href):null}catch{return null}};
 const profileImage=(user,klass)=>{const url=avatarUrl(user),initial=(user.name||"V").trim().charAt(0).toUpperCase()||"V";return '<span class="'+klass+'">'+(url?'<img src="'+url+'" alt="" referrerpolicy="no-referrer" loading="lazy">':escape(initial))+'</span>'};

 const state={products:[],cart:read("viona-atelier-cart",[]).filter(Number.isSafeInteger),category:"Все",query:"",user:null,auth:{},submitting:false,order:null};
 const toast=msg=>{const el=$("#toast");el.textContent=msg;el.classList.add("active");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("active"),3500)};
 const request=async(path,opt={})=>{const response=await fetch(path,{credentials:"same-origin",cache:"no-store",...opt});const data=await response.json().catch(()=>({}));if(!response.ok)throw Object.assign(new Error(data.error||"Не удалось выполнить запрос."),{code:data.code,bankCode:data.bankCode,status:response.status});return data};
 const post=(path,data)=>request(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 const visual={
 1:{kind:"bots",icons:["telegram.svg"]},2:{kind:"art",art:"portfolio-ui.svg"},3:{kind:"bots",icons:["discrod.svg"]},4:{kind:"game",icons:["gamepad.svg"]},5:{kind:"art",art:"landing-windows.svg"},6:{kind:"art",art:"code-editor.svg"},7:{kind:"bots",icons:["Max.svg"]}
 };
 const displayProducts=()=>[...state.products,musicCard()];
 const filtered=()=>displayProducts().filter(p=>(state.category==="Все"||p.category===state.category)&&[p.title,p.description,p.category,p.tag].join(" ").toLocaleLowerCase().includes(state.query));
  const listCart=()=>state.cart.map(id=>state.products.find(p=>Number(p.id)===id)).filter(Boolean);
 const cartTotal=()=>listCart().reduce((sum,p)=>sum+Number(p.price||0),0);
 const updateCart=()=>{state.cart=[...new Set(state.cart)];save("viona-atelier-cart",state.cart);$("#cartCount").textContent=String(state.cart.length)};
 function card(p,index=0){
  if(p.id==="music")return '<article class="glass product-card" style="--card-index:'+index+'"><div class="product-scene music-product"><div class="music-poster" aria-hidden="true"><span>K.</span></div></div><div class="product-meta">'+escape(t("music.category","Музыка"))+' / KANEKAN KAN</div><h3>'+escape(p.title)+'</h3><p>'+escape(p.description)+'</p><div class="product-bottom"><b>'+escape(t("music.price","Индивидуальный заказ"))+'</b><button type="button" data-product="music">'+escape(t("btn.more","Подробнее ↗"))+'</button></div></article>';
  const id=Number(p.id),spec=visual[id]||{kind:"code"},price=Number(p.price||0);
  const art=spec.art?'<img class="catalog-original-svg" src="/assets/catalog/'+encodeURIComponent(spec.art)+'" alt="" loading="lazy">'
    :spec.icons?spec.icons.map(x=>'<img src="'+icon(x)+'" alt="" loading="lazy">').join("")
    :spec.kind==="web"?'<div class="preview-browser"><b>create something.</b><span></span></div>':'<span class="preview-code">&lt;/&gt;</span>';
  return '<article class="glass product-card" style="--card-index:'+index+'"><div class="product-scene">'+art+'</div><div class="product-meta">'+escape(p.category)+' / VIONA '+String(id).padStart(2,"0")+'</div><h3>'+escape(p.title)+'</h3><p>'+escape(p.description)+'</p><div class="product-bottom"><b>'+(price>0?rub(price):escape(t("details.request","По согласованию")))+'</b><button type="button" data-product="'+id+'">'+escape(t("btn.more","Подробнее ↗"))+'</button></div></article>';
 }
 function render(){const products=filtered();$("#productList").innerHTML=products.length?products.map((p,i)=>card(p,i)).join(""):'<p class="glass" style="grid-column:1/-1;padding:30px">По этому запросу товаров нет. <a href="#contact">Расскажи свою идею</a>.</p>'}

  async function initProducts(){try{const res=await request("/api/products");state.products=Array.isArray(res.products)?res.products.filter(p=>Number.isSafeInteger(Number(p.id))):[];render();updateCart()}catch{$("#productList").innerHTML='<p class="glass" style="padding:35px;grid-column:1/-1">Каталог временно недоступен. Попробуй открыть страницу позже.</p>'}}
 const modal=$("#overlay"),content=$("#dialogContent");
 let closeTimer=null;
 function showDialog(html,mode="modal"){
  clearTimeout(closeTimer);content.innerHTML=html;modal.dataset.mode=mode;modal.hidden=false;
  document.body.style.overflow="hidden";
  requestAnimationFrame(()=>modal.classList.add("is-open"));
  $("#closeDialog").focus();
 }
 function closeDialog(){
  modal.classList.remove("is-open");
  const hide=()=>{if(!modal.classList.contains("is-open")){modal.hidden=true;content.innerHTML="";document.body.style.overflow=""}};
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)hide();
  else closeTimer=setTimeout(hide,300);
 }

  const legal='<div class="legal-links"><a href="/legal/terms" target="_blank" rel="noopener">Соглашение</a><a href="/legal/privacy" target="_blank" rel="noopener">Конфиденциальность</a><a href="/legal/delivery" target="_blank" rel="noopener">Условия услуг</a></div>';
 function showProduct(id){
  const p=id==="music"?musicCard():state.products.find(x=>Number(x.id)===id);if(!p)return;
  const d=detailed(id)||{what:p.description,how:"Уточни детали перед началом работы.",included:["Результат по согласованной задаче."],who:"Клиентам с подходящей задачей.",notes:"Точный состав файлов и условия согласовываются отдельно."};
  const visualData=visual[id]||{icons:id==="music"?[]:[]};
  const pic=id==="music"?'<div class="music-poster" style="width:62px;height:62px"><span>K.</span></div>':visualData.art?'<img src="/assets/catalog/'+encodeURIComponent(visualData.art)+'" alt="">':visualData.icons?.length?'<img src="'+icon(visualData.icons[0])+'" alt="">':'<span style="font-size:31px">⌘</span>';
  const price=Number(p.price||0);
  const block=(heading,body)=>'<section class="detail-block"><h3>'+escape(t("details."+heading,({what:"Что это",works:"Как это работает",includes:"Что входит",best:"Кому подойдёт",note:"Важные условия"})[heading]))+'</h3><p>'+escape(body)+'</p></section>';
  let html='<span class="micro">VIONA / '+(id==="music"?"SOUNDLAB":"PRODUCT "+String(id).padStart(2,"0"))+'</span><div class="product-full-header"><div class="product-full-logo">'+pic+'</div><div><h2 id="dialogHeading">'+escape(p.title)+'</h2><small style="color:var(--muted)">'+escape(p.category)+'</small></div></div>';
  html+='<div class="detail-highlight"><b>'+escape(t("details.price","Цена"))+':</b> '+(price>0?rub(price):escape(t("details.request","По согласованию")))+'. '+escape(p.description)+'</div>';
  html+=block("what",d.what)+block("works",d.how);
  html+='<section class="detail-block"><h3>'+escape(t("details.includes","Что входит"))+'</h3><ul class="detail-list">'+(d.included||[]).map(x=>'<li>'+escape(x)+'</li>').join("")+'</ul></section>';
  html+=block("best",d.who)+block("note",d.notes);
  html+=legal;
  html+='<div class="product-cta">'+(id==="music"?'<a href="/music" class="cta-primary" style="width:100%">'+escape(t("btn.music","Оформить музыкальную заявку ↗"))+'</a>':price>0?'<button class="cta-primary" type="button" data-add="'+id+'">'+escape(t("btn.add","Добавить в корзину ↗"))+'</button>':'<a class="cta-primary" href="#contact" data-close-link>'+escape(t("btn.music","Описать индивидуальную задачу ↗"))+'</a>')+'</div>';
  showDialog(html);
 }
 function showCart(){
  const cart=listCart(),parts=cart.map((p,i)=>'<div class="modal-line" style="--line-index:'+i+'"><div><b>'+escape(p.title)+'</b><br><small>'+escape(p.category)+'</small></div><div style="display:flex;gap:9px;align-items:center"><b>'+rub(p.price)+'</b><button data-remove="'+Number(p.id)+'" type="button">×</button></div></div>').join("");
  showDialog('<span class="micro">VIONA / SHOPPING BAG</span><h2 id="dialogHeading">'+escape(t("cart.title","Твоя корзина"))+'</h2>'+(cart.length?parts+'<div class="modal-total"><span>'+escape(t("cart.total","Итого"))+'</span><strong>'+rub(cartTotal())+'</strong></div><div class="panel-notice">Тестовая оплата: деньги не списываются. После подтверждения банковского теста заказ появится в личном кабинете.</div><div style="height:18px"></div><button type="button" class="cta-primary" id="goCheckout">'+escape(t("btn.pay","Перейти к оплате ↗"))+'</button>':'<p>'+escape(t("cart.empty","Пока пусто. Выбери товар в каталоге."))+'</p>'),"drawer");
 }

  function add(id){if(!state.cart.includes(id))state.cart.push(id);updateCart();showCart();toast(t("toast.add","Товар добавлен"))}
 function remove(id){state.cart=state.cart.filter(x=>x!==id);updateCart();showCart()}
 async function me(){
  // Keep the real authenticated Telegram session distinct from public template data.
  const [a,config]=await Promise.allSettled([request("/api/auth/me"),request("/api/auth/config")]);
  state.user=a.status==="fulfilled"?a.value.user||null:null;
  state.auth=config.status==="fulfilled"?config.value:{};
  const button=$("#openAccount");
  button.innerHTML=state.user
   ?profileImage(state.user,"account-symbol")+'<span class="account-label">'+escape(state.user.name||"Telegram")+'<small>'+escape(state.user.username?"@"+state.user.username:"VIONA ID · Telegram")+'</small></span><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>'
   :'<span class="account-symbol">V</span><span class="account-label">VIONA ID<small>'+escape(t("btn.login","Войти в аккаунт"))+'</small></span><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
 }
 function telegramWidget(){
  const root=$("#loginWidget");if(!root)return;
  if(!state.auth.telegram||!state.auth.botUsername){root.innerHTML='<div class="panel-notice">Вход через Telegram не настроен на сервере. Напиши в поддержку.</div>';return}
  const s=document.createElement("script");s.async=true;s.src="https://telegram.org/js/telegram-widget.js?22";s.dataset.telegramLogin=state.auth.botUsername;s.dataset.size="large";s.dataset.radius="12";s.dataset.authUrl=location.origin+"/auth/telegram/widget";s.dataset.requestAccess="write";root.append(s);
 }
 async function account(){
  await me();
  if(!state.user){
   showDialog('<span class="micro">VIONA / SECURE ID</span><h2 id="dialogHeading">'+escape(t("profile.hello","Личный кабинет"))+'</h2><p>Войди через Telegram, чтобы видеть данные аккаунта, статус заказов и готовые файлы.</p><div id="loginWidget" style="min-height:110px;display:grid;place-items:center"></div><div class="panel-notice">Данные появляются после входа через официальный Telegram. Сайт VIONA не запрашивает пароль.</div><p><a href="/classic" style="text-decoration:underline">Резервный кабинет</a></p>',"drawer");telegramWidget();return
  }
  const u=state.user,handle=u.username?"@"+u.username:"—";
  const avatar=profileImage(u,"profile-avatar");
  const profile='<div class="profile-card"><div class="profile-header">'+avatar+'<div><h3>'+escape(u.name||"Telegram")+'</h3><span class="profile-handle">'+escape(handle)+'</span></div></div><div class="profile-status">'+escape(t("profile.telegram","Telegram подключён"))+'</div><div class="profile-data">'+
   '<div class="profile-row"><span>'+escape(t("profile.name","Имя"))+'</span><strong>'+escape(u.name||"—")+'</strong></div>'+
   '<div class="profile-row"><span>'+escape(t("profile.handle","Ник"))+'</span><strong>'+escape(handle)+'</strong></div>'+
   '<div class="profile-row"><span>'+escape(t("profile.id","Telegram ID"))+'</span><strong>'+escape(u.id||"—")+'</strong></div></div></div>';
  showDialog('<span class="micro">VIONA / ACCOUNT</span><h2 id="dialogHeading">'+escape(t("profile.hello","Личный кабинет"))+'</h2>'+profile+
   '<div class="profile-actions"><button type="button" class="cta-secondary" id="loadOrders">'+escape(t("btn.orders","Мои заказы ↗"))+'</button><button type="button" class="cta-secondary" id="logout">'+escape(t("btn.logout","Выйти"))+'</button></div>'+
   '<div class="panel-notice">'+escape(t("profile.files","Файлы доступны в заказах после завершения работы."))+'</div><div id="ordersRoot"></div>',"drawer");
  orders();
 }

  async function orders(){
  const root=$("#ordersRoot");if(!root)return;root.innerHTML='<p>Загружаем заказы…</p>';
  const stageNames={awaiting_payment:"Ожидает подтверждения банка",queued:"Запрос принят",in_progress:"В разработке",review:"Проверка результата",completed:"Готово",rejected:"Отклонено"};
  try{
   const res=await request("/api/payments/test/my-orders"),records=Array.isArray(res.orders)?res.orders:[];
   root.innerHTML='<h3 style="margin:28px 0 12px;font:850 20px Outfit,sans-serif">'+escape(t("profile.orders","История заказов"))+'</h3>'+
    (records.length?records.map(o=>{
     const id=String(o.orderId||""),valid=/^[a-f0-9-]{36}$/i.test(id);
     const stage=stageNames[o.stage]||o.stage||o.status||"Ожидается";
     return '<div class="order-card"><b>№ '+escape(id.slice(0,8))+'</b> · '+rub(o.amount)+'<small>'+escape(stage)+'</small><small>'+escape((o.items||[]).map(item=>item.title).join(", "))+'</small>'+
      (valid?'<a href="/payment/order/'+encodeURIComponent(id)+'">Заявка и статусы ↗</a>':"")+
      (valid&&o.fileAvailable?'<p><a href="/api/payments/test/order/'+encodeURIComponent(id)+'/file">'+escape(o.fileName||"Готовый файл")+' ↓</a></p>':"")+'</div>';
    }).join(""):'<p>Подтверждённых тестовых заказов ещё нет.</p>');
  }catch(e){root.innerHTML='<div class="panel-notice">'+escape(e.message)+'</div>'}
 }

  async function checkout(){
  await me();if(!state.user){toast(t("toast.sign","Сначала войди через Telegram"));account();return}
  const cart=listCart();if(!cart.length){toast(t("toast.empty","Корзина пуста"));return}
  const method=(value,title,iconMarkup,checked=false)=>'<label class="payment-method"><input type="radio" name="method" value="'+value+'"'+(checked?' checked':'')+'><span class="payment-icons">'+iconMarkup+'</span><span class="method-text">'+title+'</span></label>';
  const img=(filename,alt,cls="")=>'<span class="payment-logo '+cls+'"><img src="'+icon(filename)+'" alt="'+alt+'" loading="lazy"></span>';
  const methods=method("card",t("checkout.card","Банковская карта"),img("visa.svg","Visa")+img("Mir.svg","МИР"),true)+method("sbp","СБП",img("sbp.svg","СБП","logo-sbp"))+method("sberpay","SberPay",img("sberpay.svg","SberPay","logo-sber"))+method("tpay","T-Pay",img("t-pay-full.svg","T-Pay","logo-tpay"));
  showDialog('<span class="micro">VIONA / T-BANK DEMO</span><h2 id="dialogHeading">'+escape(t("checkout.demo","Тестовая оплата"))+'</h2><div class="modal-total"><span>'+escape(t("cart.total","Итого"))+'</span><strong>'+rub(cartTotal())+'</strong></div><form id="payForm"><label>'+escape(t("checkout.contact","Контакт"))+'<input name="contact" required minlength="3" maxlength="200" placeholder="@username или email"></label><label>'+escape(t("checkout.brief","Опиши задачу"))+'<textarea name="brief" required minlength="10" maxlength="4000" rows="4" placeholder="Что именно нужно получить?"></textarea></label><div><b style="font-size:12px">'+escape(t("checkout.method","Способ оплаты"))+'</b><div class="choices" style="margin-top:10px">'+methods+'</div></div>'+
   '<div class="panel-notice">'+escape(t("checkout.tpay","T-Pay доступен только если он включён на платёжной странице Т-Банка. Реальные деньги не списываются."))+'</div>'+
   '<div id="sberPhoneWrap" hidden><label>Номер телефона для SberPay на ПК<input name="phone" inputmode="tel" placeholder="+79990000000" maxlength="16"></label></div>'+legal+
   '<label class="check-line"><input type="checkbox" required name="agreed"> '+escape(t("checkout.agree","Я прочитал условия и политику конфиденциальности."))+'</label><button class="cta-primary" type="submit">'+escape(t("checkout.start","Запустить тестовую оплату ↗"))+'</button><div id="payStatus" class="status-box" role="status"></div></form>');
 }

  const trustedUrl=v=>{try{const u=new URL(v),h=u.hostname.toLowerCase();return u.protocol==="https:"&&!u.username&&!u.password&&!u.port&&new Set(["securepay.tinkoff.ru","securepayments.tinkoff.ru","rest-api-test.tinkoff.ru","pay.tbank-online.com","securepay.tbank.ru","pay.tbank.ru"]).has(h)}catch{return false}};
 const trustedSber=v=>{try{const u=new URL(v),h=u.hostname.toLowerCase();return u.protocol==="https:"&&!u.username&&!u.password&&!u.port&&["sberbank.ru","sber.ru","sberpay.ru","sberbankonline.ru"].some(d=>h===d||h.endsWith("."+d))}catch{return false}};
 async function submitPay(form){if(state.submitting||!form.reportValidity())return;const value=Object.fromEntries(new FormData(form)),status=$("#payStatus"),button=$('[type=submit]',form);
  const method=value.method;state.submitting=true;button.disabled=true;status.textContent="Обращаемся к тестовому терминалу…";
  try{
   const payload={items:listCart().map(p=>Number(p.id)),contact:String(value.contact).trim(),brief:String(value.brief).trim()};
   let route="/api/payments/test/init";
   if(method==="sbp")route="/api/payments/test/qr";
   if(method==="sberpay"){route="/api/payments/test/sberpay";payload.device=innerWidth>760?"desktop":"mobile";payload.phone=(value.phone||"").trim();if(payload.device==="desktop"&&!/^\+[1-9][0-9]{6,14}$/.test(payload.phone))throw Error("Нужен номер +79990000000 для SberPay на компьютере.")}
   // T-Pay is exposed by the bank-hosted card payment form, when enabled for a terminal.
   const data=await post(route,payload);
   if(data.orderId){state.order=data.orderId;try{sessionStorage.setItem("viona-checkout-pending",JSON.stringify({orderId:data.orderId,items:payload.items}))}catch{}}
   if(method==="sbp"){if(!/^data:image\/png;base64,/.test(data.qrImage||""))throw Error("Банк не вернул QR-код.");showDialog('<span class="micro">Т-БАНК / СБП</span><h2 id="dialogHeading">QR для тестовой оплаты</h2><img src="'+data.qrImage+'" alt="QR-код СБП" style="display:block;width:min(320px,100%);margin:20px auto"><p>Отсканируй код поддерживаемым банковским приложением. Заказ появится после подтверждения оплаты банком.</p><button type="button" class="cta-primary" id="refreshPayment">Проверить статус ↗</button><div class="status-box" id="payStatus" role="status"></div>');return}
   if(method==="sberpay"&&data.flow==="push"){showDialog('<h2 id="dialogHeading">Подтверди SberPay</h2><p>Проверь запрос в банковском приложении. Если банк подтвердит тестовый платёж, заказ появится в кабинете.</p><button type="button" id="refreshPayment" class="cta-primary">Проверить статус ↗</button><div class="status-box" id="payStatus" role="status"></div>');return}
   const url=data.redirectUrl||data.paymentUrl;
   if(!(trustedUrl(url)||(method==="sberpay"&&trustedSber(url))))throw Error("Банк вернул неподтверждённый адрес. Платёж не открыт.");
   location.assign(url);
  }catch(e){if(status.isConnected)status.textContent=e.message+(e.code?" ["+e.code+(e.bankCode?" / "+e.bankCode:"")+"]":"")}
  finally{state.submitting=false;if(button.isConnected)button.disabled=false}
 }
 async function refreshPayment(){const status=$("#payStatus");if(!state.order)return;try{const res=await request("/api/payments/test/status/"+encodeURIComponent(state.order));status.textContent="Статус банка: "+(res.status||"проверяется")+". Для файла открой личный кабинет."}catch(e){status.textContent=e.message}}
 $("#productFilters").addEventListener("click",e=>{const button=e.target.closest("[data-filter]");if(!button)return;state.category=button.dataset.filter;$$("#productFilters button").forEach(x=>x.classList.toggle("active",x===button));render()});
 $("#searchProducts").addEventListener("input",e=>{state.query=e.target.value.toLocaleLowerCase("ru").trim();render()});
 document.addEventListener("click",async e=>{
  const t=e.target;
  const prod=t.closest("[data-product]");if(prod){showProduct(prod.dataset.product==="music"?"music":Number(prod.dataset.product));return}
  const addBtn=t.closest("[data-add]");if(addBtn){add(Number(addBtn.dataset.add));return}
  const removeBtn=t.closest("[data-remove]");if(removeBtn){remove(Number(removeBtn.dataset.remove));return}
  if(t.closest("#openCart"))return showCart();
  if(t.closest("#openAccount"))return account();
  if(t.closest("#goCheckout"))return checkout();
  if(t.closest("#loadOrders"))return orders();
  if(t.closest("#refreshPayment"))return refreshPayment();
  if(t.closest("#logout")){await post("/api/auth/logout",{}).catch(()=>{});state.user=null;closeDialog();toast(t("toast.exit","Выход выполнен"));return}
  if(t.closest("[data-close-link]"))return closeDialog();
 });
 $("#closeDialog").addEventListener("click",closeDialog);
 modal.addEventListener("click",e=>{if(e.target===modal)closeDialog()});
 content.addEventListener("submit",e=>{if(e.target.id==="payForm"){e.preventDefault();submitPay(e.target)}});
 content.addEventListener("change",e=>{if(e.target.name==="method")$("#sberPhoneWrap")?.toggleAttribute("hidden",e.target.value!=="sberpay")});
 $("#contactRequest").addEventListener("submit",async e=>{
  e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const values=Object.fromEntries(new FormData(form)),button=$('[type=submit]',form),label=$("#contactFeedback");button.disabled=true;label.textContent="Отправляем…";
  try{const res=await post("/api/request",{name:String(values.name||"").trim(),contact:String(values.contact||"").trim(),details:String(values.details||"").trim()});label.textContent=res.message||"Заявка обработана.";if(res.message?.includes("сохранена"))form.reset()}catch(err){label.textContent=err.message}finally{button.disabled=false}
 });
 const welcome=$("#welcome");function closeWelcome(){welcome.hidden=true;save("viona-atelier-welcome",true);document.body.style.overflow=""}
 $("#closeWelcome").addEventListener("click",closeWelcome);
 welcome.addEventListener("click",e=>{if(e.target===welcome)closeWelcome()});
 $(".welcome-body a").addEventListener("click",closeWelcome);
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!welcome.hidden)closeWelcome();else if(!modal.hidden)closeDialog()}});
 if(!read("viona-atelier-welcome",false)&&!new URLSearchParams(location.search).has("auth")){window.addEventListener("load",()=>{welcome.hidden=false;$("#closeWelcome").focus()},{once:true})}
 const savedTheme=read("viona-atelier-theme","dark");function setTheme(value){document.documentElement.dataset.theme=value;save("viona-atelier-theme",value)}
 const fixedTheme=({pink:"dark",goth:"dark",alt:"dark",cute:"light"})[currentLang()];
 document.documentElement.dataset.theme=fixedTheme||(savedTheme==="light"?"light":"dark");
 if(fixedTheme)$("#changeTheme").hidden=true;
 $("#changeTheme").addEventListener("click",()=>{if(fixedTheme)return;setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark");location.reload()});
 window.addEventListener("viona:locale",()=>{render();me().catch(()=>{})});

 if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>{entries.filter(x=>x.isIntersecting).forEach(entry=>{entry.target.classList.add("shown");observer.unobserve(entry.target)})},{threshold:.08});$$("[data-appear]").forEach(el=>observer.observe(el))}else $$("[data-appear]").forEach(el=>el.classList.add("shown"));
 if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}),{once:true});
 if(new URLSearchParams(location.search).get("auth")==="failed")toast("Вход через Telegram не выполнен");
 if(new URLSearchParams(location.search).get("auth")==="success")toast("Telegram подключён");
 initProducts();me();
})();
