"use strict";
(()=>{
 const $=(s,from=document)=>from.querySelector(s),$$=(s,from=document)=>[...from.querySelectorAll(s)];
 const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
 const rub=n=>new Intl.NumberFormat("ru-RU").format(Number(n)||0)+" ₽";
 const icon=n=>"/assets/brand-icons/"+encodeURIComponent(n);
 const state={products:[],cart:read("viona-atelier-cart",[]).filter(Number.isSafeInteger),category:"Все",query:"",user:null,auth:{},submitting:false,order:null};
 const toast=msg=>{const el=$("#toast");el.textContent=msg;el.classList.add("active");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("active"),3500)};
 const request=async(path,opt={})=>{const response=await fetch(path,{credentials:"same-origin",cache:"no-store",...opt});const data=await response.json().catch(()=>({}));if(!response.ok)throw Object.assign(new Error(data.error||"Не удалось выполнить запрос."),{code:data.code,bankCode:data.bankCode,status:response.status});return data};
 const post=(path,data)=>request(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 const visual={
 1:{kind:"bots",icons:["telegram.svg"]},2:{kind:"web"},3:{kind:"bots",icons:["discrod.svg"]},4:{kind:"game",icons:["gamepad.svg"]},5:{kind:"web"},6:{kind:"code"},7:{kind:"bots",icons:["Max.svg"]}
 };
 const filtered=()=>state.products.filter(p=>(state.category==="Все"||p.category===state.category)&&[p.title,p.description,p.category].join(" ").toLocaleLowerCase("ru").includes(state.query));
 const listCart=()=>state.cart.map(id=>state.products.find(p=>Number(p.id)===id)).filter(Boolean);
 const cartTotal=()=>listCart().reduce((sum,p)=>sum+Number(p.price||0),0);
 const updateCart=()=>{state.cart=[...new Set(state.cart)];save("viona-atelier-cart",state.cart);$("#cartCount").textContent=String(state.cart.length)};
 function card(p){
  const id=Number(p.id),spec=visual[id]||{kind:"code"},price=Number(p.price||0);
  const art=spec.icons?spec.icons.map(x=>'<img src="'+icon(x)+'" alt="" loading="lazy">').join("")
    :spec.kind==="web"?'<div class="preview-browser"><b>create something.</b><span></span></div>':'<span class="preview-code">{"< />"}</span>';
  return '<article class="glass product-card"><div class="product-scene">'+art+'<span class="liquid-drop" aria-hidden="true"></span></div><div class="product-meta">'+escape(p.category)+' / VIONA 0'+id+'</div><h3>'+escape(p.title)+'</h3><p>'+escape(p.description)+'</p><div class="product-bottom"><b>'+(price>0?rub(price):"По запросу")+'</b><button type="button" data-product="'+id+'">Подробнее ↗</button></div></article>';
 }
 function render(){const products=filtered();$("#productList").innerHTML=products.length?products.map(card).join(""):'<p class="glass" style="grid-column:1/-1;padding:30px">По этому запросу товаров нет. <a href="#contact">Расскажи свою идею</a>.</p>'}
 async function initProducts(){try{const res=await request("/api/products");state.products=Array.isArray(res.products)?res.products.filter(p=>Number.isSafeInteger(Number(p.id))):[];render();updateCart()}catch{$("#productList").innerHTML='<p class="glass" style="padding:35px;grid-column:1/-1">Каталог временно недоступен. Попробуй открыть страницу позже.</p>'}}
 const modal=$("#overlay"),content=$("#dialogContent");
 function showDialog(html){
  content.innerHTML=html;modal.hidden=false;document.body.style.overflow="hidden";$("#closeDialog").focus();
 }
 function closeDialog(){modal.hidden=true;document.body.style.overflow="";content.innerHTML=""}
 const legal='<div class="legal-links"><a href="/legal/terms" target="_blank" rel="noopener">Соглашение</a><a href="/legal/privacy" target="_blank" rel="noopener">Конфиденциальность</a><a href="/legal/delivery" target="_blank" rel="noopener">Условия услуг</a></div>';
 function showProduct(id){const p=state.products.find(x=>Number(x.id)===id);if(!p)return;const price=Number(p.price||0);
  showDialog('<span class="micro">VIONA / PRODUCT 0'+id+'</span><h2 id="dialogHeading">'+escape(p.title)+'</h2><p>'+escape(p.description)+'</p><div class="panel-notice">Раздел: '+escape(p.category)+'<br>Стоимость: '+(price>0?rub(price):"По согласованию")+'<br>Подробности и возможные доработки обсудим по твоему техническому заданию.</div><div style="height:20px"></div>'+legal+'<div style="height:20px"></div>'+(price>0?'<button class="cta-primary" type="button" data-add="'+id+'">Добавить в корзину ↗</button>':'<a class="cta-primary" href="#contact" data-close-link>Описать индивидуальную задачу ↗</a>'));
 }
 function showCart(){const cart=listCart(),parts=cart.map(p=>'<div class="modal-line"><div><b>'+escape(p.title)+'</b><br><small>'+escape(p.category)+'</small></div><div style="display:flex;gap:9px;align-items:center"><b>'+rub(p.price)+'</b><button data-remove="'+Number(p.id)+'" type="button">Убрать</button></div></div>').join("");
  showDialog('<span class="micro">VIONA / SHOPPING BAG</span><h2 id="dialogHeading">Твоя корзина</h2>'+(cart.length?parts+'<div class="modal-total"><span>Итого</span><strong>'+rub(cartTotal())+'</strong></div><div class="panel-notice">Тестовая оплата: деньги не списываются. После подтверждения банковского теста заказ появится в личном кабинете.</div><div style="height:18px"></div><button type="button" class="cta-primary" id="goCheckout">Перейти к оплате ↗</button>':'<p>Пока пусто. Добавь товары в каталоге.</p>'));
 }
 function add(id){if(!state.cart.includes(id))state.cart.push(id);updateCart();showCart();toast("Товар добавлен")}
 function remove(id){state.cart=state.cart.filter(x=>x!==id);updateCart();showCart()}
 async function me(){try{const [a,b]=await Promise.all([request("/api/auth/me"),request("/api/auth/config")]);state.user=a.user||null;state.auth=b||{}}catch{state.user=null;state.auth={}};$("#openAccount").innerHTML=state.user?escape((state.user.name||"VIONA ID").slice(0,15))+' <span>↗</span>':'VIONA ID <span>↗</span>'}
 function telegramWidget(){
  const root=$("#loginWidget");if(!root)return;
  if(!state.auth.telegram||!state.auth.botUsername){root.innerHTML='<div class="panel-notice">Вход через Telegram не настроен на сервере. Напиши в поддержку.</div>';return}
  const s=document.createElement("script");s.async=true;s.src="https://telegram.org/js/telegram-widget.js?22";s.dataset.telegramLogin=state.auth.botUsername;s.dataset.size="large";s.dataset.radius="12";s.dataset.authUrl=location.origin+"/auth/telegram/widget";s.dataset.requestAccess="write";root.append(s);
 }
 async function account(){await me();
  if(!state.user){showDialog('<span class="micro">VIONA / SECURE ID</span><h2 id="dialogHeading">Твой аккаунт.</h2><p>Войди через Telegram для тестовой оплаты, истории покупок и скачивания готовых файлов.</p><div id="loginWidget" style="min-height:95px;display:grid;place-items:center"></div><div class="panel-notice">Никаких паролей на сайте VIONA: вход выполняется через Telegram.</div><p><a href="/classic" style="text-decoration:underline">Резервный классический кабинет</a></p>');telegramWidget();return}
  showDialog('<span class="micro">VIONA / PERSONAL SPACE</span><h2 id="dialogHeading">Привет, '+escape(state.user.name||"пользователь")+'</h2><p>Заказы и готовые файлы доступны только владельцу этого Telegram-аккаунта.</p><div style="display:flex;flex-wrap:wrap;gap:9px"><button type="button" class="cta-secondary" id="loadOrders">Мои заказы ↗</button><button type="button" class="cta-secondary" id="logout">Выйти</button></div><div id="ordersRoot"></div>');
 }
 async function orders(){const root=$("#ordersRoot");if(!root)return;root.innerHTML='<p>Загружаем заказы…</p>';
  try{const res=await request("/api/payments/test/my-orders"),records=res.orders||[];
   root.innerHTML='<h3 style="margin-top:24px">Мои тестовые покупки</h3>'+(records.length?records.map(o=>{
    const id=String(o.orderId||o.id||"");
    return '<div class="order-card"><b>Заказ '+escape(id.slice(0,8))+'</b><small>Статус: '+escape(o.stageLabel||o.status||"ожидается")+'</small>'+(id?'<a href="/payment/order/'+encodeURIComponent(id)+'">Открыть и проверить файл ↗</a>':"")+'</div>'
   }).join(""):'<p>Покупок пока нет.</p>');
  }catch(e){root.innerHTML='<p>'+escape(e.message)+'</p>'}
 }
 async function checkout(){await me();if(!state.user){toast("Сначала войди через Telegram");account();return}
  const cart=listCart();if(!cart.length){toast("Корзина пуста");return}
  showDialog('<span class="micro">VIONA / T-BANK DEMO</span><h2 id="dialogHeading">Тестовая оплата</h2><div class="modal-total"><span>Итого</span><strong>'+rub(cartTotal())+'</strong></div><form id="payForm"><label>Контакт<input name="contact" required minlength="3" maxlength="200" placeholder="@username или email"></label><label>Опиши задачу<textarea name="brief" required minlength="10" maxlength="4000" rows="4" placeholder="Что именно нужно получить?"></textarea></label><div><b style="font-size:12px">Способ оплаты</b><div class="choices" style="margin-top:10px">'+
   '<label><input type="radio" name="method" value="card" checked><img src="'+icon("visa.svg")+'" alt="Visa"> Банковская карта</label>'+
   '<label><input type="radio" name="method" value="sbp"><img src="'+icon("sbp.svg")+'" alt="СБП"> СБП</label>'+
   '<label><input type="radio" name="method" value="sberpay"><img src="'+icon("sberpay.svg")+'" alt="SberPay"> SberPay</label>'+
   '<label><input type="radio" name="method" value="tpay"><img src="'+icon("t-pay-full.svg")+'" alt="T-Pay"> T-Pay*</label>'+
   '</div></div><div class="panel-notice">* T-Pay доступен только если его поддерживает защищённая форма Т-Банка для твоего тестового терминала. Отдельной T-Pay API-интеграции на VIONA нет. Реальные деньги при тестовом терминале не списываются.</div><div id="sberPhoneWrap" hidden><label>Номер телефона для SberPay на ПК<input name="phone" inputmode="tel" placeholder="+79990000000" maxlength="16"></label></div>'+legal+'<label class="check-line"><input type="checkbox" required name="agreed"> Я прочитал условия услуги и политику обработки данных.</label><button class="cta-primary" type="submit">Запустить тестовую оплату ↗</button><div id="payStatus" class="status-box" role="status"></div></form>');
 }
 const trustedUrl=v=>{try{const u=new URL(v),h=u.hostname.toLowerCase();return u.protocol==="https:"&&!u.username&&!u.password&&!u.port&&(h==="pay.tbank-online.com"||["tinkoff.ru","tbank.ru"].some(d=>h===d||h.endsWith("."+d)))}catch{return false}};
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
  const prod=t.closest("[data-product]");if(prod){showProduct(Number(prod.dataset.product));return}
  const addBtn=t.closest("[data-add]");if(addBtn){add(Number(addBtn.dataset.add));return}
  const removeBtn=t.closest("[data-remove]");if(removeBtn){remove(Number(removeBtn.dataset.remove));return}
  if(t.closest("#openCart"))return showCart();
  if(t.closest("#openAccount"))return account();
  if(t.closest("#goCheckout"))return checkout();
  if(t.closest("#loadOrders"))return orders();
  if(t.closest("#refreshPayment"))return refreshPayment();
  if(t.closest("#logout")){await post("/api/auth/logout",{}).catch(()=>{});state.user=null;closeDialog();toast("Выход выполнен");return}
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
 setTheme(savedTheme==="light"?"light":"dark");
 $("#changeTheme").addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
 if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>{entries.filter(x=>x.isIntersecting).forEach(entry=>{entry.target.classList.add("shown");observer.unobserve(entry.target)})},{threshold:.08});$$("[data-appear]").forEach(el=>observer.observe(el))}else $$("[data-appear]").forEach(el=>el.classList.add("shown"));
 if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}),{once:true});
 if(new URLSearchParams(location.search).get("auth")==="failed")toast("Вход через Telegram не выполнен");
 if(new URLSearchParams(location.search).get("auth")==="success")toast("Telegram подключён");
 initProducts();me();
})();
