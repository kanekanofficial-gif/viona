"use strict";
/* VIONA LAB: editable Telegram bot blueprint + completely local simulator.
   This is NOT a real Telegram bot and never runs uploaded/third-party code. */
(()=>{
 const ROOT=document.getElementById("vstContent");
 if(!ROOT)return;
 const KEY="viona-tg-bot-builder-v1",HISTORY_KEY="viona-tg-bot-history-v1";
 const MAX_COMMANDS=40,MAX_BUTTONS=8,MAX_TRIGGERS=30,MAX_VERSIONS=15,PHOTO_MAX_BYTES=150000;
 const trustedImageURI=value=>typeof value==="string"&&value.length<210000&&/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
 const escapeHTML=value=>String(value??"").replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
 })[c]);
 const trim=(value,max=200)=>String(value??"").trim().slice(0,max);
 const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}};
 const clone=(x)=>JSON.parse(JSON.stringify(x));
 const validCommand=(x)=>/^\/[a-z][a-z0-9_]{0,31}$/.test(x);
 const validWebURL=(value)=>{try{const u=new URL(value);return u.protocol==="https:"&&Boolean(u.hostname)&&!u.username&&!u.password}catch{return false}};
 const roles=["all","moderator","admin"];
 const roleNames={all:"Все пользователи",moderator:"Модераторы и админы",admin:"Только админы"};
 function sample(name="/start",reply="Привет, {name}! Добро пожаловать.",role="all",buttons=[]){
  return{name,reply,role,media:"none",mediaCaption:"",mediaData:"",buttons};
 }
 function defaultBot(){
  return{
   version:1,name:"Мой Telegram-бот",username:"viona_demo_bot",description:"Будущий бот, который мы соберём вместе.",
   commands:[
    sample("/start","Привет, {name}! ✨\nЯ — {bot}. Выбери действие.", "all",[{label:"Помощь",kind:"command",target:"/help"}]),
    sample("/help","Доступные команды:\n{commands}"),
    sample("/about","Это демонстрационная версия {bot}.")
   ],
   triggers:[{keyword:"привет",match:"exact",reply:"Привет, {name}! Набери /help, чтобы увидеть команды."}]
  };
 }
 const TEMPLATES={
  basic:{title:"Универсальный бот",hint:"Старт, помощь, информация",make:defaultBot},
  shop:{title:"Магазин",hint:"Товары, корзина, заказ",make:()=>({
   ...defaultBot(),name:"Мой магазин",description:"Бот магазина с меню и заказами.",
   commands:[
    sample("/start","Добро пожаловать в {bot}! Что хотите посмотреть?","all",[{label:"Каталог",kind:"command",target:"/catalog"},{label:"Поддержка",kind:"command",target:"/support"}]),
    sample("/help","Доступные команды:\n{commands}"),
    sample("/catalog","Наш демонстрационный каталог. Товары и цены добавятся при разработке.","all",[{label:"Оформить заявку",kind:"command",target:"/order"}]),
    sample("/order","Заявка по товару {product} пока является примером. Реальные заказы потребуют интеграции."),
    sample("/support","Напиши нам, и менеджер ответит. Это только пример интерфейса.")
   ],
   triggers:[{keyword:"цена",match:"contains",reply:"Стоимость уточняется после настройки магазина."}]
  })},
  support:{title:"Поддержка",hint:"Вопросы, тикеты, модератор",make:()=>({
   ...defaultBot(),name:"Бот поддержки",description:"Принимает обращения и показывает справку.",
   commands:[
    sample("/start","Привет, {name}! Чем тебе помочь?","all",[{label:"Задать вопрос",kind:"command",target:"/ticket"},{label:"Справка",kind:"command",target:"/faq"}]),
    sample("/help","Доступные команды:\n{commands}"),
    sample("/ticket","Опиши проблему. Это демонстрация; обращения не отправляются."),
    sample("/faq","Частые вопросы: оплата, доступ, настройки."),
    sample("/queue","Список обращений доступен модераторам в будущей версии.","moderator")
   ],
   triggers:[{keyword:"помощь",match:"contains",reply:"Открой /faq или /ticket."}]
  })},
  community:{title:"Сообщество",hint:"Правила, роли, модерация",make:()=>({
   ...defaultBot(),name:"Бот сообщества",description:"Помощь участникам и командам модерации.",
   commands:[
    sample("/start","Привет, {name}! Добро пожаловать в наше сообщество.","all",[{label:"Правила",kind:"command",target:"/rules"},{label:"Помощь",kind:"command",target:"/help"}]),
    sample("/help","Доступные команды:\n{commands}"),
    sample("/rules","Правила сообщества: уважение, отсутствие спама."),
    sample("/report","Напиши, что случилось. В демо жалобы никуда не уходят."),
    sample("/mod","Панель модератора (визуальный пример).","moderator")
   ],
   triggers:[{keyword:"правила",match:"contains",reply:"Прочитай /rules перед общением."}]
  })}
 };
 function normalize(data){
  if(!data||typeof data!=="object"||Array.isArray(data))return defaultBot();
  const base=defaultBot();
  const commands=Array.isArray(data.commands)?data.commands.slice(0,MAX_COMMANDS).filter(x=>x&&typeof x==="object").map(x=>({
   name:trim(x.name,33).toLowerCase(),reply:trim(x.reply,2400),
   role:roles.includes(x.role)?x.role:"all",
   media:["none","photo","document"].includes(x.media)?x.media:"none",
   mediaCaption:trim(x.mediaCaption,350),mediaData:trustedImageURI(x.mediaData)?x.mediaData:"",
   buttons:Array.isArray(x.buttons)?x.buttons.slice(0,MAX_BUTTONS).filter(b=>b&&typeof b==="object").map(b=>({
    label:trim(b.label,45),kind:["command","url","message"].includes(b.kind)?b.kind:"command",target:trim(b.target,450)
   })):[]
  })).filter(x=>validCommand(x.name)):[];
  const seen=new Set();const unique=commands.filter(x=>{if(seen.has(x.name))return false;seen.add(x.name);return true});
  const triggers=Array.isArray(data.triggers)?data.triggers.slice(0,MAX_TRIGGERS).filter(x=>x&&typeof x==="object").map(x=>({
   keyword:trim(x.keyword,70),match:x.match==="exact"?"exact":"contains",reply:trim(x.reply,1500)
  })).filter(x=>x.keyword&&x.reply):[];
  return{
   version:1,name:trim(data.name,70)||base.name,username:trim(data.username,33)||base.username,
   description:trim(data.description,450),commands:unique.length?unique:base.commands,triggers
  };
 }
 let bot=normalize(read(KEY));
 let history=read(HISTORY_KEY);
 if(!history||!Array.isArray(history.past)||!Array.isArray(history.future))history={past:[],future:[]};
 history.past=history.past.slice(-MAX_VERSIONS);history.future=history.future.slice(-MAX_VERSIONS);
 let panel="commands",selected=bot.commands[0]?.name||"/start",editing=null,editButton=-1,role="all";
 let pendingMedia=null,uploadingImage=false;
 let persona={name:"Алекс",username:"alex_demo",product:"Demo Product",order_id:"DEMO-001"};
 let chat=[{type:"system",text:"Здесь можно вводить свои команды и сообщения. Ничего не отправляется в Telegram."}];
 let requestBusy=false,requestFeedback="",draftStatus="",templateChoice="basic";
 const currentCommand=()=>bot.commands.find(x=>x.name===selected)||bot.commands[0];
 const labelRoles=()=>roleNames[role]||roleNames.all;
 const rolesAllowed={all:["all","moderator","admin"],moderator:["moderator","admin"],admin:["admin"]};
 const isAllowed=(minRole)=>rolesAllowed[minRole||"all"]?.includes(role)??true;
 const getCommand=(name)=>bot.commands.find(c=>c.name===name);
 const msg=(type,text,buttons=[],media="none",caption="",mediaData="")=>({type,text:trim(text,2600),buttons,media,caption,mediaData:trustedImageURI(mediaData)?mediaData:""});
 const format=(raw)=>{
  const vars={
   name:persona.name,username:"@"+persona.username,bot:bot.name,
   product:persona.product,order_id:persona.order_id,
   commands:bot.commands.filter(x=>isAllowed(x.role)).map(x=>x.name).join(", ")
  };
  return String(raw??"").replace(/\{(name|username|bot|product|order_id|commands)\}/g,(_,key)=>vars[key]);
 };
 function send(raw){
  const text=trim(raw,800);
  if(!text)return;
  chat.push(msg("user",text));
  let response;
  if(text.startsWith("/")){
   const name=text.split(/\s+/)[0].toLowerCase().split("@")[0];
   const command=getCommand(name);
   if(!command)response=msg("bot","Неизвестная команда. Проверь список команд через /help.");
   else if(!isAllowed(command.role))response=msg("bot","Эта команда недоступна для роли: "+labelRoles()+".");
   else response=msg("bot",format(command.reply),command.buttons,command.media,format(command.mediaCaption),command.mediaData);
  }else{
   const value=text.toLocaleLowerCase("ru");
   const trigger=bot.triggers.find(x=>x.match==="exact"?value===x.keyword.toLocaleLowerCase("ru"):value.includes(x.keyword.toLocaleLowerCase("ru")));
   response=msg("bot",trigger?format(trigger.reply):"Сообщение получено в симуляторе. Добавь триггер, чтобы бот отвечал на эту фразу.");
  }
  chat.push(response);
  chat=chat.slice(-48);
 }
 function persist(){
  try{localStorage.setItem(KEY,JSON.stringify(bot));localStorage.setItem(HISTORY_KEY,JSON.stringify(history));return true}
  catch{draftStatus="Не удалось сохранить: память браузера заполнена.";return false}
 }
 function change(mutator){
  const before=clone(bot);mutator();
  history.past.push(before);history.past=history.past.slice(-MAX_VERSIONS);history.future=[];
  persist();
 }
 function restore(direction){
  const stack=direction==="undo"?history.past:history.future;
  if(!stack.length)return;
  const other=direction==="undo"?history.future:history.past;
  other.push(clone(bot));if(other.length>MAX_VERSIONS)other.shift();
  bot=normalize(stack.pop());
  if(!getCommand(selected))selected=bot.commands[0]?.name;
  persist();draftStatus=direction==="undo"?"Отменено предыдущее изменение.":"Изменение повторено.";repaint();
 }
 function notify(text){draftStatus=text;const node=ROOT.querySelector("#vbStatus");if(node)node.textContent=text}
 const heading=(title,desc)=>'<div class="vb-heading"><h3>'+escapeHTML(title)+'</h3><p>'+escapeHTML(desc)+'</p></div>';
 const button=(text,attr="",cls="")=>'<button type="button" class="vb-btn '+cls+'" '+attr+'>'+escapeHTML(text)+'</button>';
 const field=(text,input)=>'<label class="vb-field"><span>'+escapeHTML(text)+'</span>'+input+'</label>';
 const input=(name,placeholder,value="",max=100,required=false)=>'<input name="'+name+'" maxlength="'+max+'" placeholder="'+escapeHTML(placeholder)+'" value="'+escapeHTML(value)+'"'+(required?" required":"")+'>';
 const area=(name,placeholder,value="",max=2400)=>'<textarea name="'+name+'" maxlength="'+max+'" placeholder="'+escapeHTML(placeholder)+'" rows="5">'+escapeHTML(value)+'</textarea>';
 const option=(value,label,current)=>'<option value="'+escapeHTML(value)+'"'+(value===current?" selected":"")+'>'+escapeHTML(label)+'</option>';
 const icon={commands:"⌨",buttons:"▦",triggers:"◎",scenarios:"◇",check:"✓",order:"↗"};
 function renderEditor(){
  const existing=editing?getCommand(editing):null;
  const imageData=pendingMedia!==null?pendingMedia:existing?.mediaData||"";
  return heading(existing?"Изменить команду":"Добавить команду","Напиши команду и ответ. Переменные: {name}, {username}, {bot}, {product}, {order_id}, {commands}.")+
   '<form id="vbCommandForm" class="vb-form"><div class="vb-fields-two">'+
   field("Команда",input("name","/shop",existing?.name||"",33,true))+
   field("Доступ",'<select name="role">'+roles.map(x=>option(x,roleNames[x],existing?.role||"all")).join("")+'</select>')+'</div>'+
   field("Ответ бота",area("reply","Привет, {name}! Вот список товаров…",existing?.reply||"",2400))+
   '<div class="vb-fields-two">'+
   field("Тип медиа (демо)",'<select name="media">'+[["none","Только текст"],["photo","Фото-заглушка"],["document","Документ-заглушка"]].map(([v,t])=>option(v,t,existing?.media||"none")).join("")+'</select>')+
   field("Подпись к медиа",input("mediaCaption","Описание фото или файла",existing?.mediaCaption||"",350))+'</div>'+
   '<label class="vb-field vb-upload"><span>Локальное фото (PNG, JPG, WebP, до 150 КБ)</span><input type="file" id="vbMediaFile" accept="image/png,image/jpeg,image/webp"><small id="vbImageUploadStatus">Файл не выбран.</small></label>'+
   (imageData&&trustedImageURI(imageData)?'<div class="vb-image-preview"><img src="'+escapeHTML(imageData)+'" alt="Предпросмотр изображения">'+button("Убрать фото",'data-vb-action="clear-image"')+'</div>':'<p class="vb-subtle">Фото хранится только в этом браузере. Для реального заказа изображение потребуется передать отдельно.</p>')+
   '<div class="vst-actions"><button type="submit" class="vb-btn primary">'+(existing?"Сохранить изменения":"Добавить команду")+'</button>'+
   (editing?button("Отменить редактирование",'data-vb-action="cancel-edit"'):"")+'</div></form>';
 }
 function renderCommands(){
  const items=bot.commands.map(c=>
   '<div class="vb-command-row'+(editing===c.name?" selected":"")+'"><div><strong>'+escapeHTML(c.name)+'</strong><small>'+escapeHTML(roleNames[c.role])+'</small>'+
   '<p>'+escapeHTML(c.reply.slice(0,105))+'</p></div><div class="vb-command-actions">'+
   button("Изменить",'data-vb-edit="'+escapeHTML(c.name)+'"')+
   button("Удалить",'data-vb-delete="'+escapeHTML(c.name)+'"',"danger")+'</div></div>'
  ).join("");
  return '<div class="vb-stack"><div class="vb-card">'+heading("Мои команды · "+bot.commands.length+"/"+MAX_COMMANDS,"Любые команды вида /start, /help, /shop и другие.")+
   '<div class="vb-command-list">'+items+'</div></div><div class="vb-card">'+renderEditor()+'</div></div>';
 }
 function renderButtons(){
  const c=currentCommand();if(!c)return heading("Кнопки","Добавь команду.");
  return '<div class="vb-stack"><div class="vb-card">'+heading("Кнопки и меню","Прикрепи к команде кнопки: запустить другую команду, отправить текст или показать ссылку.")+
   field("Команда с кнопками",'<select id="vbSelectedCommand">'+bot.commands.map(x=>option(x.name,x.name,selected)).join("")+'</select>')+
   '<div class="vb-command-list">'+c.buttons.map((b,i)=>'<div class="vb-command-row"><div><strong>'+escapeHTML(b.label)+'</strong><small>'+escapeHTML(b.kind==="command"?"→ "+b.target:b.kind==="url"?"Ссылка: "+b.target:"Сообщение: "+b.target)+'</small></div>'+
   button("Удалить",'data-vb-remove-button="'+i+'"',"danger")+'</div>').join("")+
   (!c.buttons.length?'<div class="vst-empty">Кнопок нет. Добавь первую.</div>':"")+'</div></div>'+
   '<div class="vb-card">'+heading("Добавить кнопку","Для перехода выбери команду и введи её название, например /shop.")+
   '<form id="vbButtonForm" class="vb-form">'+field("Текст кнопки",input("label","Магазин", "",45,true))+
   field("Действие",'<select name="kind" id="vbButtonKind">'+[["command","Запустить команду"],["message","Отправить текст"],["url","Открыть HTTPS-ссылку"]].map(([v,t])=>option(v,t,"command")).join("")+'</select>')+
   field("Команда / сообщение / адрес",input("target","/shop", "",450,true))+
   '<button type="submit" class="vb-btn primary">Добавить кнопку</button></form></div></div>';
 }
 function renderTriggers(){
  return '<div class="vb-stack"><div class="vb-card">'+heading("Ответы на обычные сообщения","Бот может реагировать на слова и фразы, а не только на команды.")+
   '<div class="vb-command-list">'+bot.triggers.map((t,i)=>'<div class="vb-command-row"><div><strong>'+escapeHTML(t.keyword)+'</strong><small>'+(t.match==="exact"?"Точное совпадение":"Содержит фразу")+'</small>'+
   '<p>'+escapeHTML(t.reply.slice(0,120))+'</p></div>'+button("Удалить",'data-vb-delete-trigger="'+i+'"',"danger")+'</div>').join("")+
   (!bot.triggers.length?'<div class="vst-empty">Триггеров пока нет.</div>':"")+'</div></div>'+
   '<div class="vb-card">'+heading("Добавить правило","Например: пользователь пишет «цена» — бот отвечает сообщением.")+
   '<form id="vbTriggerForm" class="vb-form"><div class="vb-fields-two">'+
   field("Фраза",input("keyword","цена", "",70,true))+
   field("Условие",'<select name="match"><option value="contains">Содержит фразу</option><option value="exact">Точное совпадение</option></select>')+'</div>'+
   field("Ответ",area("reply","Стоимость зависит от выбранного товара.","",1500))+
   '<button type="submit" class="vb-btn primary">Добавить триггер</button></form></div></div>';
 }
 function check(){
  const issues=[],warnings=[];
  const byName=new Map(bot.commands.map(c=>[c.name,c]));
  if(!byName.has("/start"))warnings.push("Рекомендуется добавить /start для первого запуска.");
  if(!byName.has("/help"))warnings.push("Рекомендуется добавить /help с перечнем команд.");
  if(!bot.commands.length)issues.push("Добавь хотя бы одну команду.");
  const seen=new Set();
  for(const c of bot.commands){
   if(!validCommand(c.name))issues.push("Неверное имя команды: "+c.name);
   if(seen.has(c.name))issues.push("Повторяется команда "+c.name);
   seen.add(c.name);
   if(!c.reply.trim())issues.push("У команды "+c.name+" пустой ответ.");
   if(c.media!=="none"&&!c.mediaCaption.trim())warnings.push(c.name+": медиа добавлено без подписи.");
   for(const b of c.buttons){
    if(!b.label)issues.push(c.name+": пустая подпись кнопки.");
    if(b.kind==="command"&&!byName.has(b.target.toLowerCase()))issues.push(c.name+": кнопка «"+b.label+"» ведёт в отсутствующую команду "+b.target);
    if(b.kind==="url"&&!validWebURL(b.target))issues.push(c.name+": ссылке «"+b.label+"» нужен безопасный адрес https://");
    if(b.kind==="message"&&!b.target)issues.push(c.name+": кнопка «"+b.label+"» не содержит сообщения.");
   }
  }
  const keywords=new Set();
  for(const t of bot.triggers){const k=t.match+" "+t.keyword.toLowerCase();
   if(keywords.has(k))warnings.push("Повторяется правило для фразы «"+t.keyword+"».");keywords.add(k)}
  const reached=new Set();
  function walk(name){
   if(reached.has(name)||!byName.has(name))return;
   reached.add(name);for(const b of byName.get(name).buttons)if(b.kind==="command")walk(b.target.toLowerCase())
  }
  if(byName.has("/start"))walk("/start");
  for(const c of bot.commands)if(byName.has("/start")&&!reached.has(c.name)&&c.name!=="/help"){
   warnings.push(c.name+": нет пути через кнопки от /start (команду всё ещё можно ввести вручную).")
  }
  return{issues,warnings};
 }
 function renderScenarios(){
  const errors=check(),nodes=bot.commands.map(c=>'<article class="vb-flow-node"><strong>'+escapeHTML(c.name)+'</strong><small>'+escapeHTML(roleNames[c.role])+'</small>'+
   '<div>'+c.buttons.map(b=>'<span class="vb-flow-edge">'+escapeHTML(b.label)+' → '+escapeHTML(b.target)+'</span>').join("")+
   (!c.buttons.length?'<small>Кнопок нет</small>':"")+'</div></article>').join("");
  return heading("Сценарии и переходы","Каждая карточка — команда, стрелки показывают переходы, созданные кнопками.")+
   '<div class="vb-flow-map">'+nodes+'</div><div class="vst-actions">'+button("Добавить переход",'data-vb-panel="buttons"',"primary")+button("Проверить сценарий",'data-vb-panel="check"')+'</div>'+
   '<p class="vst-note">Кнопки связывают команды в маршрут: /start → /catalog → /order. Ты сам создаёшь переходы в разделе «Кнопки».</p>'+
   '<p class="vb-status">Ошибок: '+errors.issues.length+' · предупреждений: '+errors.warnings.length+'</p>';
 }
 const serialize=()=>({
  name:bot.name,username:bot.username,description:bot.description,
  commands:bot.commands.map(c=>({
   name:c.name,role:roleNames[c.role],reply:c.reply,
   media:c.media,mediaCaption:c.mediaCaption,hasLocalPhoto:!!c.mediaData,
   buttons:c.buttons.map(b=>({label:b.label,action:b.kind,target:b.target}))
  })),
  triggers:bot.triggers.map(x=>({...x}))
 });
 function brief(){
  const obj=serialize(),parts=[
   "ТЕХНИЧЕСКОЕ ЗАДАНИЕ — TELEGRAM BOT / VIONA",
   "Название: "+obj.name,"Username (предпочтительный): @"+obj.username,
   "Описание: "+obj.description,"",
   "КОМАНДЫ ("+obj.commands.length+")"
  ];
  for(const c of obj.commands){
   parts.push(c.name+" | "+c.role,"Ответ: "+c.reply,"Медиа: "+c.media+(c.mediaCaption?" / "+c.mediaCaption:"")+(c.hasLocalPhoto?" [локальное фото, переслать отдельно]":""));
   for(const b of c.buttons)parts.push("Кнопка: "+b.label+" | "+b.action+" → "+b.target);parts.push("");
  }
  parts.push("РЕАКЦИИ НА СООБЩЕНИЯ ("+obj.triggers.length+")");
  for(const t of obj.triggers)parts.push(t.match+" «"+t.keyword+"» → "+t.reply);
  parts.push("","Важно: это прототип. Требуются согласование разработки, проверка интеграций и стоимость.","Токены, пароли и ключи Telegram не нужны на этапе заказа.");
  return parts.join("\n");
 }
 function renderChecks(){
  const result=check();
  const item=(label,txt)=>'<div class="vb-validation-item"><strong>'+escapeHTML(label)+'</strong><span>'+escapeHTML(txt)+'</span></div>';
  return heading("Проверка логики","VIONA проверит команды, переходы, ссылки, повторы и незавершённые сценарии.")+
   '<div class="vb-check-grid"><div class="vb-card"><h3>Ошибки · '+result.issues.length+'</h3>'+
   (result.issues.length?result.issues.map(x=>item("Исправить",x)).join(""):'<p class="vb-good">Критических проблем не найдено.</p>')+'</div>'+
   '<div class="vb-card"><h3>Рекомендации · '+result.warnings.length+'</h3>'+
   (result.warnings.length?result.warnings.map(x=>item("Совет",x)).join(""):'<p class="vb-good">Дополнительных замечаний нет.</p>')+'</div></div>'+
   '<div class="vb-card">'+heading("Предпросмотр технического задания","Это именно описание для разработчика, а не автоматически работающий Telegram-бот.")+
   '<pre class="vb-brief">'+escapeHTML(brief())+'</pre><div class="vst-actions">'+button("Скачать ТЗ .txt",'data-vb-action="download"',"primary")+
   button("Перейти к заказу",'data-vb-panel="order"')+'</div></div>';
 }
 function renderOrder(){
  const text=brief(),issues=check();
  return heading("Оформить заказ бота","После симуляции можно отправить ТЗ разработчику на оценку. Реальная разработка оплачивается отдельно.")+
   '<div class="vb-card">'+
   '<div class="vst-note">В заявке используются только название, контакт и техническое задание. <strong>Не присылай BotFather-токен, пароли или API-ключи.</strong> Если база данных сайта недоступна, заявка не будет сохранена.</div>'+
   '<div class="vb-order-stats"><span>Команд: <b>'+bot.commands.length+'</b></span><span>Кнопок: <b>'+bot.commands.reduce((n,c)=>n+c.buttons.length,0)+'</b></span><span>Триггеров: <b>'+bot.triggers.length+'</b></span><span>Замечаний: <b>'+(issues.issues.length+issues.warnings.length)+'</b></span></div>'+
   '<form id="vbOrderForm" class="vb-form">'+field("Telegram или email для ответа",input("contact","@username или email", "",180,true))+
   field("Дополнительные пожелания",area("notes","Что ещё должен уметь бот?", "",700))+
   '<label class="vb-checkline"><input type="checkbox" name="agreement" required> Подтверждаю, что это запрос оценки, а не готовый бот и не платёж.</label>'+
   '<p class="vb-subtle">Сайт принимает до 5000 символов описания заявки. Полную версию ТЗ сохрани отдельным файлом.</p>'+
   '<div class="vst-actions"><button class="vb-btn primary" type="submit"'+(requestBusy?" disabled":"")+'>Отправить ТЗ на оценку ↗</button>'+
   button("Скачать полное ТЗ",'data-vb-action="download"')+'</div>'+
   '<p id="vbOrderStatus" role="status" aria-live="polite">'+escapeHTML(requestFeedback)+'</p></form></div>';
 }
 function renderChat(){
  return '<section class="vb-chat-section"><div class="vb-phone"><div class="vb-phone-top"><span class="vb-phone-icon">✦</span><div><strong>'+escapeHTML(bot.name)+'</strong><small>@'+escapeHTML(bot.username)+' · Локальный симулятор</small></div><span class="vb-phone-dots">•••</span></div>'+
   '<div class="vb-chat-msgs" id="vbChatLog" role="log" aria-label="Диалог с демонстрационным ботом">'+chat.map(m=>{
    if(m.type==="system")return '<div class="vb-chat-system">'+escapeHTML(m.text)+'</div>';
    return '<div class="vb-chat-bubble '+(m.type==="user"?"vb-user":"vb-bot")+'">'+
     (m.media==="photo"&&trustedImageURI(m.mediaData)?
      '<img class="vb-chat-photo" src="'+escapeHTML(m.mediaData)+'" alt="Изображение в симуляторе">':
      m.media!=="none"?'<div class="vb-attachment"><span aria-hidden="true">'+(m.media==="photo"?"▧":"▤")+'</span><small>'+(m.media==="photo"?"Пример фото":"Пример документа")+'</small></div>':"")+
     '<div class="vb-message-text">'+escapeHTML(m.text)+'</div>'+
     (m.caption?'<p class="vb-msg-caption">'+escapeHTML(m.caption)+'</p>':"")+
     (m.type==="bot"&&m.buttons?.length?'<div class="vb-inline-buttons">'+m.buttons.map(b=>
      '<button type="button" data-vb-run="'+escapeHTML(b.kind)+'" data-vb-target="'+escapeHTML(b.target)+'" class="vb-inline-btn">'+escapeHTML(b.label)+'</button>').join("")+'</div>':"")+
    '</div>';
   }).join("")+'</div><form id="vbChatForm" class="vb-chat-compose"><input name="message" maxlength="800" placeholder="Введи /help, /shop или любое сообщение" autocomplete="off" required aria-label="Команда или сообщение"><button class="vb-send" type="submit" aria-label="Отправить">➤</button></form></div>'+
   '<div class="vb-chat-extras"><label class="vb-field"><span>Тестируемая роль</span><select id="vbSimRole">'+[["all","Обычный пользователь"],["moderator","Модератор"],["admin","Администратор"]].map(([v,t])=>option(v,t,role)).join("")+'</select></label>'+
   '<form id="vbPersonaForm" class="vb-form" style="margin-top:12px"><div class="vb-fields-two">'+
   field("Имя клиента",input("name","Имя",persona.name,60,true))+
   field("Товар",input("product","Название товара",persona.product,60))+
   field("ID тестового заказа",input("order_id","DEMO-001",persona.order_id,40))+
   field("Ник клиента",input("username","username",persona.username,40))+
   '</div><button type="submit" class="vb-btn">Обновить переменные демо</button></form>'+
   '<div class="vb-samples">'+bot.commands.slice(0,8).map(c=>button(c.name,'data-vb-demo="'+escapeHTML(c.name)+'"')).join("")+'</div>'+
   button("Очистить чат",'data-vb-action="clear-chat"')+'</div></section>';
 }
 function markup(){
  const tabs=[["commands","Команды"],["buttons","Кнопки"],["triggers","Реакции"],["scenarios","Сценарии"],["check","Проверка / ТЗ"],["order","Заказ"]];
  const controls={
   commands:renderCommands,buttons:renderButtons,triggers:renderTriggers,scenarios:renderScenarios,check:renderChecks,order:renderOrder
  };
  return '<section class="vb-app" id="vionaBotBuilder">'+
   '<div class="vb-top"><div><p class="vst-eyebrow">VIONA LAB / TELEGRAM BOT BUILDER</p><h3>Собери своего Telegram-бота.</h3><p>Создавай команды, кнопки и сценарии. Проверяй их в настоящем интерактивном симуляторе перед заказом.</p></div>'+
   '<div class="vb-toolbar">'+button("↶ Отменить",'data-vb-action="undo"'+(history.past.length?'':' disabled'))+
   button("↷ Повторить",'data-vb-action="redo"'+(history.future.length?'':' disabled'))+'</div></div>'+
   '<div class="vb-identity vb-card"><form id="vbIdentityForm"><div class="vb-fields-three">'+
   field("Название",input("name","Название бота",bot.name,70,true))+
   field("Username без @",input("username","my_bot",bot.username,33,true))+
   field("Описание",input("description","Чем занимается бот?",bot.description,450))+
   '</div><div class="vst-actions"><button class="vb-btn primary" type="submit">Сохранить профиль бота</button>'+
   '<label class="vb-template-label">Шаблон <select id="vbTemplate">'+Object.entries(TEMPLATES).map(([id,t])=>option(id,t.title,templateChoice)).join("")+'</select></label>'+
   button("Загрузить шаблон",'data-vb-action="apply-template"')+'</div></form></div>'+
   '<div class="vb-layout"><div class="vb-workbench"><nav class="vb-nav" role="tablist" aria-label="Разделы конструктора">'+tabs.map(([id,text])=>
    '<button type="button" role="tab" data-vb-panel="'+id+'" aria-selected="'+(panel===id)+'" tabindex="'+(panel===id?"0":"-1")+'">'+escapeHTML(text)+'</button>').join("")+'</nav>'+
   '<section class="vb-panel" role="tabpanel">'+controls[panel]()+'</section><p class="vb-status" id="vbStatus" role="status">'+escapeHTML(draftStatus||"Черновик сохраняется только в этом браузере.")+'</p></div>'+
   renderChat()+'</div></section>';
 }
 function repaint(restoreChat=false){
  const old=ROOT.querySelector("#vionaBotBuilder");if(!old)return;
  const shell=document.createElement("div");shell.innerHTML=markup();
  old.replaceWith(shell.firstElementChild);
  if(restoreChat)ROOT.querySelector("#vbChatForm input")?.focus();
  const log=ROOT.querySelector("#vbChatLog");if(log)log.scrollTop=log.scrollHeight;
 }
 function action(name){
  if(name==="undo"||name==="redo"){pendingMedia=null;restore(name);return}
  if(name==="clear-image"){pendingMedia="";const image=ROOT.querySelector(".vb-image-preview img");if(image)image.hidden=true;notify("Фото будет убрано после сохранения команды.");return}
  if(name==="clear-chat"){chat=[{type:"system",text:"Чат очищен. Введи команду для проверки."}];repaint();return}
  if(name==="cancel-edit"){editing=null;pendingMedia=null;panel="commands";repaint();return}
  if(name==="download"){
   const blob=new Blob([brief()],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
   a.href=url;a.download="viona-telegram-bot-brief.txt";document.body.append(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1500);notify("Полное ТЗ сохранено на устройство.");return;
  }
  if(name==="apply-template"){
   if(!window.confirm("Заменить текущий черновик выбранным шаблоном? Предыдущую версию можно вернуть через «Отменить»."))return;
   change(()=>{bot=TEMPLATES[templateChoice].make();selected=bot.commands[0]?.name||"/start";editing=null;pendingMedia=null;panel="commands";chat=[{type:"system",text:"Шаблон применён. Попробуй /start."}]});
   repaint();return;
  }
 }
 async function submitOrder(form){
  if(requestBusy)return;
  const fields=new FormData(form),contact=trim(fields.get("contact"),180),extra=trim(fields.get("notes"),700);
  if(contact.length<3){requestFeedback="Укажи контакт для ответа.";repaint();return}
  if(!fields.get("agreement")){requestFeedback="Подтверди условия отправки.";repaint();return}
  const full=brief(),description=(full+"\n\nДополнительные пожелания: "+extra);
  const details=description.length>5000?description.slice(0,4880)+"\n\n[ТЗ сокращено до лимита заявки. Полную версию можно скачать в VIONA LAB.]":description;
  requestBusy=true;requestFeedback="Сохраняем заявку…";repaint();
  try{
   const response=await fetch("/api/request",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",
    body:JSON.stringify({name:("Telegram-бот: "+bot.name).slice(0,100),contact,details})});
   if(response.status===201)requestFeedback="Заявка сохранена на сервере VIONA. Стоимость и сроки уточняются отдельно.";
   else if(response.status===202)requestFeedback="Демо-режим: сервер НЕ сохранил заявку. Скачай ТЗ и повтори отправку после подключения базы данных.";
   else requestFeedback="Не удалось сохранить заявку (код "+response.status+"). Проверь данные или повтори позже.";
  }catch{requestFeedback="Ошибка соединения. Заявка не подтверждена — повтори отправку."}
  finally{requestBusy=false;repaint()}
 }
 function submitCommand(form){
  if(uploadingImage){notify("Дождись завершения чтения фотографии.");return}
  const fields=new FormData(form),name=trim(fields.get("name"),33).toLowerCase(),reply=trim(fields.get("reply"),2400),roleValue=fields.get("role");
  if(!validCommand(name)){notify("Имя команды должно начинаться с / и содержать латинские буквы, цифры или _. До 32 символов.");return}
  if(!reply){notify("Напиши ответ для этой команды.");return}
  if(getCommand(name)&&name!==editing){notify("Команда "+name+" уже существует. Выбери другое название.");return}
  if(!editing&&bot.commands.length>=MAX_COMMANDS){notify("Максимум "+MAX_COMMANDS+" команд в одном черновике.");return}
  const media=fields.get("media"),mediaCaption=trim(fields.get("mediaCaption"),350),oldName=editing;
  change(()=>{
   const current=oldName?getCommand(oldName):null;
   const record={name,reply,role:roles.includes(roleValue)?roleValue:"all",
    media:["none","photo","document"].includes(media)?media:"none",mediaCaption,
    mediaData:media==="photo"?(pendingMedia!==null?pendingMedia:current?.mediaData||""):"",
    buttons:current?.buttons||[]};
   if(current){
    Object.assign(current,record);
    if(oldName!==name)for(const cmd of bot.commands)for(const b of cmd.buttons)if(b.kind==="command"&&b.target===oldName)b.target=name;
   }else bot.commands.push(record);
  });
  selected=name;editing=null;pendingMedia=null;notify("Команда "+name+" сохранена.");repaint();
 }
 function submitButton(form){
  const current=currentCommand();if(!current){notify("Сначала добавь команду.");return}
  if(current.buttons.length>=MAX_BUTTONS){notify("В одной команде не более "+MAX_BUTTONS+" кнопок.");return}
  const f=new FormData(form),label=trim(f.get("label"),45),kind=f.get("kind"),target=trim(f.get("target"),450);
  if(!label||!target){notify("Укажи текст и действие кнопки.");return}
  if(kind==="command"&&!validCommand(target.toLowerCase())){notify("Целевая команда должна иметь вид /shop.");return}
  if(kind==="url"&&!validWebURL(target)){notify("Допускаются только полноценные HTTPS-ссылки без логина и пароля.");return}
  if(!["command","url","message"].includes(kind)){notify("Неизвестное действие.");return}
  change(()=>current.buttons.push({label,kind,target:kind==="command"?target.toLowerCase():target}));
  notify("Кнопка добавлена. Проверь её в симуляторе.");repaint();
 }
 function submitTrigger(form){
  if(bot.triggers.length>=MAX_TRIGGERS){notify("Достигнут предел "+MAX_TRIGGERS+" реакций.");return}
  const f=new FormData(form),keyword=trim(f.get("keyword"),70),reply=trim(f.get("reply"),1500),match=f.get("match")==="exact"?"exact":"contains";
  if(!keyword||!reply){notify("Нужны и фраза, и текст ответа.");return}
  if(bot.triggers.some(x=>x.keyword.toLowerCase()===keyword.toLowerCase()&&x.match===match)){notify("Такое правило уже существует.");return}
  change(()=>bot.triggers.push({keyword,reply,match}));notify("Реакция добавлена.");repaint();
 }
 ROOT.addEventListener("submit",event=>{
  const form=event.target;if(!form.closest("#vionaBotBuilder"))return;
  if(!["vbIdentityForm","vbCommandForm","vbButtonForm","vbTriggerForm","vbChatForm","vbOrderForm","vbPersonaForm"].includes(form.id))return;
  event.preventDefault();
  if(!form.reportValidity())return;
  if(form.id==="vbIdentityForm"){
   const f=new FormData(form),name=trim(f.get("name"),70),username=trim(f.get("username"),33).replace(/^@/,"");
   if(!/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(username)){notify("Username должен содержать 5–32 латинских символа, цифры или _.");return}
   change(()=>{bot.name=name;bot.username=username;bot.description=trim(f.get("description"),450)});
   notify("Профиль бота обновлён.");repaint();return;
  }
  if(form.id==="vbPersonaForm"){
   const data=new FormData(form);
   persona={
    name:trim(data.get("name"),60)||"Клиент",
    username:trim(data.get("username"),40).replace(/^@/,"")||"client",
    product:trim(data.get("product"),60)||"Товар",
    order_id:trim(data.get("order_id"),40)||"DEMO-001"
   };
   chat.push(msg("system","Тестовые данные обновлены. Отправь команду повторно."));
   repaint();return;
  }
  if(form.id==="vbCommandForm"){submitCommand(form);return}
  if(form.id==="vbButtonForm"){submitButton(form);return}
  if(form.id==="vbTriggerForm"){submitTrigger(form);return}
  if(form.id==="vbChatForm"){
   const value=new FormData(form).get("message");send(value);repaint(true);return;
  }
  if(form.id==="vbOrderForm"){submitOrder(form)}
 });
 ROOT.addEventListener("change",e=>{
  if(!e.target.closest("#vionaBotBuilder"))return;
  if(e.target.id==="vbTemplate"){templateChoice=e.target.value;return}
  if(e.target.id==="vbSelectedCommand"){selected=e.target.value;repaint();return}
  if(e.target.id==="vbSimRole"){role=e.target.value;repaint();return}
  if(e.target.id==="vbMediaFile"){
   const file=e.target.files?.[0];if(!file)return;
   const status=ROOT.querySelector("#vbImageUploadStatus");
   if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>PHOTO_MAX_BYTES){
    if(status)status.textContent="Нужен PNG/JPEG/WebP размером до 150 КБ.";
    notify("Уменьши изображение до 150 КБ и попробуй ещё раз.");e.target.value="";return;
   }
   const otherPhotos=bot.commands.reduce((n,c)=>n+(c.mediaData?.length||0),0)-(editing?getCommand(editing)?.mediaData?.length||0:0);
   if(otherPhotos+Math.ceil(file.size*1.4)>700000){
    if(status)status.textContent="Лимит фото черновика исчерпан.";
    notify("Уменьши изображения: общий лимит около 500 КБ.");e.target.value="";return;
   }
   uploadingImage=true;if(status)status.textContent="Читаем локальное фото…";
   const reader=new FileReader();
   reader.onload=()=>{
    uploadingImage=false;
    if(!trustedImageURI(reader.result)){if(status)status.textContent="Не удалось прочитать изображение.";return}
    pendingMedia=reader.result;
    if(status)status.textContent="Фото готово. Выбери «Фото-заглушка» в типе медиа и сохрани команду.";
   };
   reader.onerror=()=>{uploadingImage=false;if(status)status.textContent="Ошибка чтения изображения."};
   reader.readAsDataURL(file);return;
  }

 });
 ROOT.addEventListener("click",e=>{
  const node=e.target.closest("#vionaBotBuilder button");if(!node)return;
  if(node.dataset.vbPanel){panel=node.dataset.vbPanel;repaint();return}
  if(node.dataset.vbAction){action(node.dataset.vbAction);return}
  if(node.dataset.vbEdit){editing=node.dataset.vbEdit;pendingMedia=null;selected=editing;panel="commands";repaint();return}
  if(node.dataset.vbDelete){
   if(!window.confirm("Удалить команду "+node.dataset.vbDelete+"? Связанные кнопки останутся, но проверка покажет их ошибки."))return;
   change(()=>{bot.commands=bot.commands.filter(c=>c.name!==node.dataset.vbDelete)});
   if(editing===node.dataset.vbDelete)editing=null;
   if(selected===node.dataset.vbDelete)selected=bot.commands[0]?.name||"";
   repaint();return;
  }
  if(node.hasAttribute("data-vb-remove-button")){
   const index=Number(node.dataset.vbRemoveButton),c=currentCommand();if(!c||!Number.isInteger(index)||!c.buttons[index])return;
   change(()=>c.buttons.splice(index,1));repaint();return;
  }
  if(node.hasAttribute("data-vb-delete-trigger")){
   const index=Number(node.dataset.vbDeleteTrigger);if(!bot.triggers[index])return;
   change(()=>bot.triggers.splice(index,1));repaint();return;
  }
  if(node.dataset.vbDemo){send(node.dataset.vbDemo);repaint();return}
  if(node.dataset.vbRun){
   const target=node.dataset.vbTarget,kind=node.dataset.vbRun;
   if(kind==="command"||kind==="message")send(target);
   else if(kind==="url")chat.push(msg("system","В настоящем боте эта кнопка открыла бы ссылку: "+target+". В симуляторе переход отключён."));
   repaint();return;
  }
 });
 function scrollChat(){const log=ROOT.querySelector("#vbChatLog");if(log)log.scrollTop=log.scrollHeight}
 const info=()=>({commands:bot.commands.length,triggers:bot.triggers.length,buttons:bot.commands.reduce((n,c)=>n+c.buttons.length,0)});
 window.VionaBotBuilder={markup,repaint,check,brief,info};
})();