"use strict";
/* VIONA private dashboard. All write/read access is checked by the server. */
(()=>{
 const theme=()=>{const mode=localStorage.getItem("viona-theme")||"auto",dark=window.matchMedia("(prefers-color-scheme: dark)").matches;const actual=mode==="dark"?"dark":mode==="light"?"light":dark?"dark":"light";document.documentElement.dataset.theme=actual;document.querySelector('meta[name="theme-color"]')?.setAttribute("content",actual==="dark"?"#0b1119":"#f4f9fc")};
 theme();window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",theme);window.addEventListener("storage",e=>{if(e.key==="viona-theme")theme()});
 const $=q=>document.querySelector(q);
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const state={orders:[],detail:null,id:null,filter:"all",busy:false,archived:false,mode:"orders",inquiries:[]};
 const stages={awaiting_payment:"Ожидает оплату",queued:"Заявка принята",in_progress:"В разработке",ready:"Подготовка к отправке",completed:"Готово",rejected:"Отклонён"};
 const next={queued:"in_progress",in_progress:"ready",ready:"completed"};
 const money=n=>new Intl.NumberFormat("ru-RU",{style:"currency",currency:"RUB",maximumFractionDigits:0}).format(Number(n)||0);
 const stamp=s=>{const d=new Date(s);return Number.isNaN(d.getTime())?"—":d.toLocaleString("ru-RU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})};
 const allowed=/^[0-9a-f]{8}-[0-9a-f-]{27}$/i;
 const say=(message,error=false)=>{const n=$("#adminNotice");n.textContent=message;n.classList.toggle("error",error)};
 const api=async(url,opts={})=>{
  const r=await fetch("/api/admin"+url,{credentials:"same-origin",cache:"no-store",...opts});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw Object.assign(new Error(data.error||"Ошибка сервера ("+r.status+")"),{status:r.status});
  return data;
 };
 const json=(method,obj)=>({method,headers:{"Content-Type":"application/json"},body:JSON.stringify(obj)});
 function showDashboard(on){
  $("#adminLogin").hidden=on;$("#adminDashboard").hidden=!on;
  if(on)$("#adminEmail").textContent="Вход разрешён: support.viona.space@gmail.com";
 }
 const label=o=>{
  if(o.failed)return "Оплата отклонена";
  if(o.rejected)return "Отклонён администратором";
  if(!o.verifiedPaid)return stages.awaiting_payment;
  return stages[o.stage]||stages.queued;
 };
 const badge=o=>'<span class="ad-pill'+(o.failed?" failed":!o.verifiedPaid?" pending":"")+'">'+esc(label(o))+'</span>';
 function stats(){
  const list=state.orders;
  const values=[["Всего",list.length],["Подтверждено",list.filter(x=>x.verifiedPaid).length],["В работе",list.filter(x=>x.verifiedPaid&&["queued","in_progress","ready"].includes(x.stage)).length],["Готово",list.filter(x=>x.verifiedPaid&&x.stage==="completed").length]];
  $("#adminStats").innerHTML=values.map(([name,value])=>'<div class="ad-stat"><strong>'+value+'</strong><small>'+name+'</small></div>').join("");
 }
 function renderList(){
  const f=state.filter;
  const rows=state.orders.filter(o=>f==="all"||f==="paid"&&o.verifiedPaid||f==="pending"&&!o.verifiedPaid||f==="completed"&&o.stage==="completed"&&o.verifiedPaid||f==="rejected"&&o.rejected);
  $("#adminOrders").innerHTML=rows.length?rows.map(o=>
   '<button type="button" class="ad-order" data-order="'+esc(o.orderId)+'" aria-pressed="'+(state.id===o.orderId)+'">'+
   '<span class="ad-order-top"><strong>#'+esc(o.orderId.slice(0,8).toUpperCase())+'</strong>'+badge(o)+'</span>'+
   '<p>'+esc(o.items.map(i=>i.title).join(", ")||"Демонстрационный заказ")+'</p>'+
   '<span class="ad-order-top"><small>'+esc(stamp(o.createdAt))+'</small><span class="ad-order-price">'+money(o.amount)+'</span></span>'+
   '</button>').join(""):'<p class="ad-empty">Заказов по этому фильтру пока нет.</p>';
 }
 function field(label,value){
  return '<div class="ad-detail-field"><small>'+esc(label)+'</small><strong>'+esc(value)+'</strong></div>';
 }
 function renderDetail(){
  const root=$("#adminDetail"),payload=state.detail;
  if(!payload){root.innerHTML='<div class="ad-empty">Выбери заказ для просмотра.</div>';return}
  const o=payload.order;if(!o)return;
  const items=Array.isArray(o.items)?o.items:[];
  const locked=!o.verifiedPaid||o.failed||o.rejected;
  const upcoming=next[o.stage];
  const timeline=(payload.events||[]).map(e=>
   '<article class="ad-event"><strong>'+esc(e.stage==="message"?"Сообщение клиенту":e.stage==="file"?"Файл":"Смена этапа: "+(stages[e.stage]||e.stage))+'</strong>'+
   (e.message?'<p>'+esc(e.message)+'</p>':"")+'<small>'+esc(stamp(e.created_at))+'</small></article>').join("")||'<p>Обновлений пока нет.</p>';
  const stageControl=locked?'<p>'+(o.rejected?'Заказ отклонён. Причина видна клиенту.':'Сначала требуется подтверждённый тестовый платёж Т-Банка.')+'</p>':
   upcoming?'<form id="adminStageForm" class="ad-form"><label class="ad-field">Следующий этап<input readonly value="'+esc(stages[upcoming])+'"></label>'+
   '<label class="ad-field">Комментарий клиенту<textarea name="note" maxlength="500" placeholder="Например: начали писать код и проверять функциональность"></textarea></label>'+
   '<div class="ad-actions"><button type="submit" data-next="'+upcoming+'">'+(upcoming==="completed"?"Готово — выдать файл":upcoming==="ready"?"Подготовка к отправке":"В разработке")+'</button></div>'+
   (upcoming==="completed"&&!o.fileName?'<p>Перед статусом «Готово» нужно загрузить файл с результатом.</p>':"")+'</form>':
   '<p>Заказ завершён. Готовый файл доступен владельцу через его Telegram-аккаунт.</p>';
  root.innerHTML='<div class="ad-detail-top"><span class="ad-label">VIONA / ORDER DETAIL</span><div class="ad-split"><h2 class="ad-detail-title">#'+esc(o.orderId.slice(0,8).toUpperCase())+'</h2>'+badge(o)+'</div>'+
   '<p>Полный ID: <code>'+esc(o.orderId)+'</code></p></div>'+
   '<div class="ad-detail-fields">'+field("Клиент Telegram ID",o.telegramId)+field("Тестовая сумма",money(o.amount))+field("Метод",o.method)+field("Создан",stamp(o.createdAt))+'</div>'+
   '<h3>Товары заказа</h3><div class="ad-products">'+(items.length?items.map(item=>'<div class="ad-product"><div><strong>'+esc(item.title)+'</strong><br><small>'+esc(item.category||"Цифровой товар")+'</small></div><strong>'+money(item.price)+'</strong></div>').join(""):'<p>Снимок товаров недоступен для этого старого заказа.</p>')+'</div>'+
   '<h3>Изменение этапа</h3>'+stageControl+
   '<h3>Готовый код / файл</h3><p>Разрешены файлы исходного кода и ZIP до 1 МиБ. Хранятся приватно в PostgreSQL.</p>'+
   (o.fileName?'<div class="ad-actions"><a class="ad-file-link" href="/api/admin/orders/'+encodeURIComponent(o.orderId)+'/file">Скачать: '+esc(o.fileName)+'</a></div>':'<p>Файл ещё не загружен.</p>')+
   (!locked?'<form class="ad-form" id="adminUploadForm"><label class="ad-field">Прикрепить или заменить результат<input type="file" name="file" accept=".zip,.txt,.md,.js,.jsx,.ts,.tsx,.py,.html,.css,.json,.xml,.sql,.java,.cs,.c,.h,.cpp,.go,.rs,.lua,.rb,.php,.yaml,.yml" required></label><div class="ad-actions"><button type="submit">Загрузить файл</button></div></form>':'')+
   (!locked?'<h3>Сообщение покупателю</h3><form class="ad-form" id="adminMessageForm"><label class="ad-field">Что сообщить<textarea name="message" maxlength="500" required placeholder="Например: проверка готова, остался последний этап"></textarea></label><div class="ad-actions"><button type="submit">Добавить сообщение</button></div></form>':'')+
   '<h3>История заказа</h3><div>'+timeline+'</div>';
 }
 async function loadOrders(){
  const result=await api("/orders"+(state.archived?"?archived=1":""));
  state.orders=Array.isArray(result.orders)?result.orders:[];
  stats();renderList();
  if(state.id&&state.orders.some(x=>x.orderId===state.id)){return}
  state.id=null;state.detail=null;
  if(state.orders.length)await selectOrder(state.orders[0].orderId);
  else{state.id=null;state.detail=null;renderDetail()}
 }
 async function selectOrder(id){
  if(!allowed.test(id))return;
  state.id=id;renderList();
  try{state.detail=await api("/orders/"+encodeURIComponent(id));renderDetail()}
  catch(e){say(e.message,true)}
 }
 async function afterChange(message){await loadOrders();if(state.id)await selectOrder(state.id);say(message)}
 async function googleLogin(token){
  try{
   await api("/login",json("POST",{credential:token}));
   showDashboard(true);say("Вход выполнен. Загружаем заказы.");
   await loadOrders();say("Вход в VIONA подтверждён.");
  }catch(e){say(e.message,true)}
 }
 function initGoogle(clientId){
  const google=window.google?.accounts?.id;
  if(!google){say("Не загрузилась кнопка Google. Проверь соединение или блокировщик скриптов.",true);return}
  google.initialize({client_id:clientId,callback:r=>{if(r?.credential)googleLogin(r.credential)},auto_select:false,ux_mode:"popup"});
  google.renderButton($("#googleSignInButton"),{theme:"outline",size:"large",shape:"pill",text:"signin_with",width:260});
 }
 async function boot(){
  showDashboard(false);
  try{
   const cfg=await api("/config");
   if(!cfg.enabled){
     const help=cfg.databaseReady===false
      ?"База данных PostgreSQL недоступна. Проверь DATABASE_URL и логи Render, затем повтори попытку."
      :cfg.googleClientReady===false
      ?"База данных готова. Осталось создать Google OAuth Client ID и добавить GOOGLE_CLIENT_ID в Render → Environment, затем обновить страницу."
      :"Админ-панель ещё не настроена. Проверь GOOGLE_CLIENT_ID и DATABASE_URL в Render.";
     say(help+" Пароль Gmail на сайте VIONA вводить не нужно.",true);
     return;
    }
   const current=await api("/session").catch(e=>{if(e.status===401)return null;throw e});
   if(current?.authenticated){showDashboard(true);await loadOrders();say("Панель готова к работе.")}
   else{
    say("Авторизуйся с помощью Google.");
    const begin=()=>initGoogle(cfg.clientId);
    if(document.readyState==="complete")begin();else window.addEventListener("load",begin,{once:true});
   }
  }catch(e){say(e.message||"Не удалось открыть панель.",true)}
 }
 $("#adminReload").addEventListener("click",async()=>{try{await loadOrders();if(state.id)await selectOrder(state.id);say("Список заказов обновлён.")}catch(e){say(e.message,true)}});
 $("#adminLogout").addEventListener("click",async()=>{try{await api("/logout",{method:"POST"});state.id=null;state.orders=[];state.detail=null;showDashboard(false);say("Ты вышел из панели. Обнови страницу для повторного входа.")}catch(e){say(e.message,true)}});
 $("#adminOrders").addEventListener("click",e=>{const item=e.target.closest("[data-order]");if(item)selectOrder(item.dataset.order)});
 $("#adminFilters").addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;state.filter=btn.dataset.filter;document.querySelectorAll("#adminFilters [data-filter]").forEach(el=>el.setAttribute("aria-pressed",String(el===btn)));renderList()});
 $("#adminDetail").addEventListener("submit",async e=>{
  if(!["adminStageForm","adminUploadForm","adminMessageForm"].includes(e.target.id))return;
  e.preventDefault();if(state.busy||!state.id)return;
  state.busy=true;const btn=e.submitter||e.target.querySelector('button[type="submit"]');if(btn)btn.disabled=true;
  try{
   const id=encodeURIComponent(state.id),form=e.target;
   if(form.id==="adminStageForm"){
    await api("/orders/"+id+"/stage",json("PATCH",{stage:btn.dataset.next,note:form.elements.note.value}));
    await afterChange("Этап обновлён. Клиент увидит новый статус в своём заказе.");
   }else if(form.id==="adminMessageForm"){
    await api("/orders/"+id+"/message",json("POST",{message:form.elements.message.value}));
    await afterChange("Сообщение добавлено в историю клиента.");
   }else{
    const file=form.elements.file.files?.[0];
    if(!file||file.size<1||file.size>1048576)throw Error("Выбери файл не более 1 МиБ.");
    const response=await fetch("/api/admin/orders/"+id+"/file",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/octet-stream","X-File-Name":encodeURIComponent(file.name)},body:file});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw Error(data.error||"Файл не загрузился");
    await afterChange("Файл сохранён на сервере. Для выдачи клиенту установи этап «Готово».");
   }
  }catch(err){say(err.message||"Не удалось выполнить действие.",true)}
  finally{state.busy=false;if(btn&&btn.isConnected)btn.disabled=false}
 });
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&!$("#adminDashboard").hidden)loadOrders().catch(()=>{})});
 boot();
})();
