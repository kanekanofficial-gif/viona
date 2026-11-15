"use strict";
/* VIONA Studio — local-only creative tools. Never executes user-submitted code. */
(()=>{
 const KEY="viona-studio-v1",EDITOR="viona-editor-v1",ROOT=document.getElementById("vstContent");
 if(!ROOT)return;
 const doc=document.documentElement;
 try{
  const saved=JSON.parse(localStorage.getItem("viona-world")||"null");
  if(["ru","en","de","ja","femboy"].includes(saved)){doc.dataset.world=saved;doc.lang=saved==="femboy"?"ru":saved}
 }catch{}
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
 const clean=(s,n=300)=>String(s??"").trim().slice(0,n);
 const uid=()=>{if(globalThis.crypto?.randomUUID)return crypto.randomUUID();const b=new Uint8Array(16);crypto.getRandomValues(b);b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=[...b].map(x=>x.toString(16).padStart(2,"0")).join("");return [h.slice(0,8),h.slice(8,12),h.slice(12,16),h.slice(16,20),h.slice(20)].join("-")};
 const stamp=()=>new Date().toISOString();
 const defaults=()=>({projects:[],boards:[],bundle:[],widgetOrder:["projects","orders","boards","catalog","lab"],lab:"telegram",selectedProject:null,selectedBoard:null});
 function normalize(s){
  const d=defaults();if(!s||typeof s!=="object"||Array.isArray(s))return d;
  for(const k of ["projects","boards","bundle","widgetOrder"])if(Array.isArray(s[k]))d[k]=s[k].slice(0,60);
  for(const k of ["lab","selectedProject","selectedBoard"])if(typeof s[k]==="string")d[k]=s[k];
  return d;
 }
 let state=normalize(read(KEY,null));
 let editor=Object.assign({font:13,wrap:false,tabs:2,theme:"dark",numbers:true},read(EDITOR,{}));
 const segments=location.pathname.split("/").filter(Boolean),pathView=segments[1]==="projects"?"workspace":segments[1]==="bots"?"lab":segments[1];
 if(segments[1]==="projects"&&state.projects.some(p=>p.id===segments[2]))state.selectedProject=segments[2];
 if(segments[1]==="boards"&&state.boards.some(x=>x.id===segments[2]))state.selectedBoard=segments[2];
 if(segments[1]==="bots")state.lab="telegram";
 const effectiveTheme=()=>doc.dataset.theme==="dark"?"dark":"light";editor.theme=effectiveTheme();
 let products=[],tab=pathView||new URLSearchParams(location.search).get("view")||"lab",labMessage="Введи /start, чтобы увидеть демонстрацию.",demoSite="landing";
 const tabs=new Set(["lab","builder","workspace","diff","bundles","boards","dashboard","editor","support"]);
 const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 function setStudioRoute(view=tab){const record=view==="workspace"?selectedProject():view==="boards"?selectedBoard():null;
  const botId=view==="lab"&&state.lab==="telegram"?window.VionaBotBuilder?.id?.():null;
  const path=record&&uuid.test(record.id)?"/studio/"+(view==="workspace"?"projects":"boards")+"/"+record.id:botId&&uuid.test(botId)?"/studio/bots/"+botId:"/studio/"+view;
  if(location.pathname!==path||location.search)history.replaceState(history.state,"",path);
 }
 const vector=n=>'<svg class="vst-svg" aria-hidden="true"><use href="/assets/studio-icons.svg#'+n+'"></use></svg>';
 if(!tabs.has(tab))tab="lab";
 let diffInputs={left:"function hello() {\n  return 'Hello';\n}",right:"function hello(name) {\n  return 'Hello, ' + name;\n}"};
 const toast=message=>{const t=$("#vstToast");if(!t)return;t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),3300)};
 function save(){
  try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{toast("Не удалось сохранить данные: возможно, переполнено хранилище браузера.");return false}
 }
 const asset=id=>{const known={1:"telegram",2:"dashboard",3:"builder",4:"triggers",5:"workspace",6:"editor",7:"buttons"};return vector(known[id]||"bundles")};
 const selectedProject=()=>state.projects.find(p=>p.id===state.selectedProject)||state.projects[0];
 const selectedBoard=()=>state.boards.find(b=>b.id===state.selectedBoard)||state.boards[0];
 const price=x=>Number(x||0).toLocaleString("ru-RU")+" ₽";
 const title=(h,sub,action="")=>'<header class="vst-section-head"><div><h2>'+h+'</h2><p>'+sub+'</p></div>'+action+'</header>';
 const note=s=>'<p class="vst-note">'+s+'</p>';
 const button=(label,attr="",kind="")=>'<button type="button" class="vst-btn '+kind+'" '+attr+'>'+label+'</button>';
 const section=(h,p,inner,cls="")=>'<article class="vst-card '+cls+'"><h3>'+h+'</h3><p>'+p+'</p>'+inner+'</article>';
 function renderLab(){
  const current=state.lab;
  let body="";
  if(current==="telegram"){
   body=window.VionaBotBuilder?.markup()||'<p class="vst-note">Конструктор Telegram-бота не загрузился. Обнови страницу.</p>';
  }else if(current==="website"){
   body='<div class="vst-preview-web"><header><span>'+ (demoSite==="landing"?"VIONA / LANDING":"VIONA / PORTFOLIO")+'</span><span>● ● ●</span></header><div class="vst-preview-hero"><h3>'+(demoSite==="landing"?"Твой следующий проект.":"Мои работы и идеи.")+'</h3><p>'+(demoSite==="landing"?"Современный макет: адаптация, чистая типографика, готовые секции.":"Интерактивный пример портфолио для разработчика или дизайнера.")+'</p><span class="vst-tag">DEMO ONLY</span></div></div><div class="vst-actions">'+button("Лендинг",'data-vst-site="landing"')+button("Портфолио",'data-vst-site="portfolio"')+'</div>';
  }else{
   body='<div class="vst-card" style="background:var(--vst-soft)"><div class="vst-eyebrow">SINGLE PLAYER / SAFE MOCK</div><h3>Панель настроек игры</h3><label class="vst-check"><input type="checkbox" data-vst-game="minimap"> Мини-карта</label><label class="vst-check"><input type="checkbox" data-vst-game="overlay"> Информационный оверлей</label><label class="vst-check"><input type="checkbox" data-vst-game="hud"> Подсказки управления</label><p id="vstGameNotice">Эта панель только показывает интерфейс; никаких игровых файлов не затрагивает.</p></div>';
  }
  ROOT.innerHTML=title("VIONA LAB","Работающие интерактивные демо-интерфейсы. Это не доступ к реальным ботам и не выполнение кода.")+
  '<div class="vst-grid">'+[
   ["telegram","Telegram Bot Builder","Создай свои команды, кнопки и ответы."],["website","Website / Portfolio","Переключай готовые макеты."],["game","Game UI","Пример панели игрового проекта."]
  ].map(([id,t,p])=>section(t,p,button(id===current?"Открыто":"Открыть",'data-vst-lab="'+id+'"',id===current?"primary":""),id===current?"fluid-edge":"")).join("")+'</div>'+
  (current==="telegram"?body:'<div class="vst-card vg-glass-panel" style="margin-top:16px"><h3>Интерактивный предпросмотр · '+esc(current.toUpperCase())+'</h3>'+body+'</div>');
 }
 function renderBuilder(){
  ROOT.innerHTML=title("Конструктор проекта","Собери техническое задание, сохрани черновик в Workspace и при необходимости отправь запрос на оценку.")+
  '<div class="vst-grid two"><form id="vstBuildForm" class="vst-card">'+
   '<label class="vst-field">Название проекта<input name="title" maxlength="90" required placeholder="Например, бот поддержки"></label>'+
   '<label class="vst-field">Тип проекта<select name="kind"><option value="Telegram-бот">Telegram-бот</option><option value="Discord-бот">Discord-бот</option><option value="Веб-сайт">Веб-сайт</option><option value="Инструмент для игры">Инструмент для игры</option><option value="Доработка кода">Доработка кода</option><option value="Другое">Другое</option></select></label>'+
   '<label class="vst-field">Технология<select name="tech"><option>JavaScript / Node.js</option><option>TypeScript</option><option>Python</option><option>HTML / CSS</option><option>C#</option><option>На усмотрение разработчика</option></select></label>'+
   '<h3 style="margin:10px 0">Что добавить</h3>'+
   ["Авторизация","База данных","Админ-панель","Адаптация под телефон","Уведомления","Интеграции","Дизайн с анимациями"].map(f=>'<label class="vst-check"><input type="checkbox" name="features" value="'+esc(f)+'">'+esc(f)+'</label>').join("")+
   '<label class="vst-field">Дополнительные пожелания<textarea name="details" maxlength="2000" placeholder="Подробно опиши результат"></textarea></label>'+
   '<label class="vst-field">Контакт (только при отправке заявки)<input name="contact" maxlength="180" placeholder="@username или email"></label>'+
   '<div class="vst-actions"><button type="submit" name="intent" value="draft" class="vst-btn">Сохранить в Workspace</button><button type="submit" name="intent" value="request" class="vst-btn primary">Отправить на оценку ↗</button></div><p class="vst-note" style="margin:13px 0 0">Стоимость определяется после согласования. Без оплаты, без автоматической разработки.</p></form>'+
   section("Что получится","Пошаговое ТЗ со списком функций и выбранной технологией.",'<div class="vst-list"><div class="vst-list-item"><span>1. Сформируй идею</span><span class="vst-tag">BRIEF</span></div><div class="vst-list-item"><span>2. Сохрани черновик</span><span class="vst-tag">LOCAL</span></div><div class="vst-list-item"><span>3. Отправь на оценку</span><span class="vst-tag">REQUEST</span></div><div class="vst-list-item"><span>4. Согласуй стоимость</span><span class="vst-tag">MANUAL</span></div></div>')+
   '</div>';
 }
 const stages=[["idea","Идея"],["brief","Техническое задание"],["design","Дизайн"],["build","Разработка"],["test","Тестирование"],["release","Релиз"]];
 function renderWorkspace(){
  const p=selectedProject();if(p)state.selectedProject=p.id;setStudioRoute("workspace");
  const list='<div class="vst-list">'+(state.projects.length?state.projects.map(x=>'<div class="vst-list-item"><div><strong class="vst-private">'+esc(x.title)+'</strong><small>'+esc(x.kind)+' · '+new Date(x.createdAt).toLocaleDateString("ru-RU")+'</small></div>'+button(x.id===p?.id?"Открыт":"Открыть",'data-vst-open-project="'+esc(x.id)+'"',x.id===p?.id?"primary":"")+'</div>').join(""):'<div class="vst-empty">Пока нет проектов. Создай первый в Конструкторе.</div>')+'</div>';
  let details=note("Этапы отмечает сам пользователь. Это не статусы разработки от команды VIONA и не подтверждённые заказы.");
  if(p){
   const index=stages.findIndex(x=>x[0]===p.stage);
   details+='<h3 class="vst-private">'+esc(p.title)+'</h3><p>'+esc(p.kind)+' · '+esc(p.tech)+'</p><p style="margin:9px 0">'+esc(p.details||"Описание пока не добавлено.")+'</p>';
   details+='<label class="vst-field">Этап проекта (отмечаешь самостоятельно)<select id="vstStage">'+stages.map(([id,label])=>'<option value="'+id+'"'+(p.stage===id?" selected":"")+'>'+label+'</option>').join("")+'</select></label>';
   details+='<div class="vst-timeline">'+stages.map(([id,label],i)=>'<div class="vst-milestone '+(i<=index?"done":"")+'"><strong>'+esc(label)+'</strong><small>'+(i===index?"Текущий этап (локальная отметка)":i<index?"Отмечен в этой браузерной версии":"Ещё не отмечен")+'</small></div>').join("")+'</div>';
   details+='<h3 style="margin:20px 0 12px">Заметки и история</h3>'+
    '<div class="vst-list">'+(p.notes||[]).slice(-12).map(n=>'<div class="vst-list-item"><span class="vst-private">'+esc(n.text)+'</span><small>'+new Date(n.at).toLocaleDateString("ru-RU")+'</small></div>').join("")+'</div>'+
    '<form id="vstNoteForm" class="vst-actions" style="align-items:flex-start;flex-direction:column"><label class="vst-field" style="width:100%">Новая заметка<textarea name="note" minlength="2" maxlength="1000" required></textarea></label><button class="vst-btn primary" type="submit">Сохранить заметку</button></form>';
   details+='<h3 style="margin:20px 0 12px">Файлы проекта (только на этом устройстве)</h3>'+
    '<div class="vst-list">'+(p.files||[]).map(f=>'<div class="vst-list-item"><strong class="vst-private">'+esc(f.name)+'</strong>'+button("Скачать",'data-vst-download="'+esc(f.id)+'"')+'</div>').join("")+'</div>'+
    '<label class="vst-field">Прикрепить текстовый файл до 35 КБ<input type="file" id="vstFile" accept=".txt,.js,.ts,.json,.css,.html,.md,.py,.xml"></label>'+
    '<div class="vst-actions"><a class="vst-btn" href="/code-edit">Заказать изменения кода ↗</a>'+button("Удалить этот черновик",'data-vst-delete-project="'+esc(p.id)+'"')+'</div>';
  }
  ROOT.innerHTML=title("VIONA Workspace","Мои черновики, этапы, заметки и файлы. Здесь показывается только то, что ты создал на этом устройстве.",button("Новый проект",'data-vst-tab="builder"'))+
  '<div class="vst-grid two"><div class="vst-card"><h3>Мои проекты · '+state.projects.length+'</h3>'+list+'</div><div class="vst-card">'+details+'</div></div>';
 }
 function lcsDiff(a,b){
  const A=a.split("\n").slice(0,180),B=b.split("\n").slice(0,180),n=A.length,m=B.length;
  const dp=Array.from({length:n+1},()=>new Uint16Array(m+1));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=A[i]===B[j]?1+dp[i+1][j+1]:Math.max(dp[i+1][j],dp[i][j+1]);
  let i=0,j=0,parts=[],add=0,del=0;
  while(i<n||j<m){
   if(i<n&&j<m&&A[i]===B[j]){parts.push(["same",A[i]]);i++;j++}
   else if(j<m&&(i===n||dp[i][j+1]>=dp[i+1][j])){parts.push(["add",B[j++]]);add++}
   else {parts.push(["remove",A[i++]]);del++}
  }return{parts,add,del,truncated:a.split("\n").length>180||b.split("\n").length>180};
 }
 function paintDiff(){
  const result=lcsDiff(diffInputs.left,diffInputs.right),line=x=>'<div class="vst-diff-line '+x[0]+'">'+(x[0]==="add"?"+ ":x[0]==="remove"?"− ":"  ")+esc(x[1]||" ")+'</div>';
  const out=$("#vstDiffOutput");if(!out)return;
  out.innerHTML='<p class="vst-note">Добавлено строк: '+result.add+' · Удалено строк: '+result.del+(result.truncated?" · Показаны первые 180 строк каждого блока":"")+'. Всё сравнение выполняется локально в браузере.</p><div class="vst-diff-lines">'+result.parts.map(line).join("")+'</div>';
 }
 function renderDiff(){
  ROOT.innerHTML=title("Код: До / После","Сравни две версии по строкам. Зелёный — добавлено, красный — удалено. Код никуда не отправляется.")+
   '<div class="vst-compare">'+
   '<label class="vst-field vst-card">Исходная версия<textarea id="vstDiffBefore" rows="13" class="vst-code">'+esc(diffInputs.left)+'</textarea></label>'+
   '<label class="vst-field vst-card">Обновлённая версия<textarea id="vstDiffAfter" rows="13" class="vst-code">'+esc(diffInputs.right)+'</textarea></label></div>'+
   '<div class="vst-actions">'+button("Сравнить",'data-vst-run-diff', "primary")+button("Поменять местами",'data-vst-swap-diff')+'</div>'+
   '<div class="vst-card" id="vstDiffOutput" style="margin-top:18px"></div>';
  paintDiff();
 }
 function renderBundles(){
  const set=new Set(state.bundle.map(String));
  const total=products.filter(p=>set.has(String(p.id))).reduce((n,p)=>n+Number(p.price||0),0);
  ROOT.innerHTML=title("Конструктор наборов","Выбирай совместимые цифровые товары. Цены берутся из каталога, скидка автоматически не предполагается.")+
   note("Можно добавить несколько товаров в настоящую корзину VIONA. Совместимость сложных интеграций необходимо согласовать отдельно.")+
   '<div class="vst-grid">'+products.map(p=>'<article class="vst-card"><span class="vst-eyebrow">'+asset(p.id)+' '+esc(p.category)+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p><div class="vst-actions"><label class="vst-check"><input type="checkbox" data-vst-bundle="'+esc(p.id)+'"'+(set.has(String(p.id))?" checked":"")+'> В набор</label><strong>'+price(p.price)+'</strong></div></article>').join("")+'</div>'+
   '<div class="vst-card vg-glass-panel" style="margin-top:15px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px"><div><h3>Состав набора: '+set.size+' товара</h3><strong>'+price(total)+'</strong></div>'+button("Добавить набор в корзину",'data-vst-add-bundle',set.size?"primary":"")+'</div>';
 }
 function renderBoards(){
  const b=selectedBoard();if(b)state.selectedBoard=b.id;setStudioRoute("boards");
  ROOT.innerHTML=title("Доски идей","Собирай заметки и закрепляй товары в личных подборках. Доски доступны в этом браузере.")+
  '<div class="vst-grid two"><div class="vst-card"><h3>Мои доски</h3><form id="vstBoardForm" class="vst-actions"><input class="vst-input" name="board" placeholder="Название новой доски" required maxlength="70"><button class="vst-btn primary" type="submit">Создать доску</button></form><div class="vst-list" style="margin-top:15px">'+
  (state.boards.length?state.boards.map(x=>'<div class="vst-list-item"><strong class="vst-private">'+esc(x.title)+'</strong>'+button(x.id===b?.id?"Открыта":"Открыть",'data-vst-open-board="'+esc(x.id)+'"',x.id===b?.id?"primary":"")+'</div>').join(""):'<div class="vst-empty">Нет досок. Создай новую.</div>')+
  '</div></div><div class="vst-card">'+(b?'<h3 class="vst-private">'+esc(b.title)+'</h3><p>Заметки и закреплённые товары</p><div class="vst-list" style="margin:15px 0">'+(b.notes||[]).map(n=>'<div class="vst-list-item"><span class="vst-private">'+esc(n.text)+'</span>'+button("×",'data-vst-board-remove-note="'+esc(n.id)+'"')+'</div>').join("")+'</div>'+
  '<form id="vstBoardNote" class="vst-actions"><input class="vst-input" name="note" required maxlength="350" placeholder="Добавить заметку"><button class="vst-btn primary" type="submit">Добавить</button></form>'+
  '<h3 style="margin-top:18px">Товары на доске</h3><div class="vst-board-pins" style="margin:9px 0">'+(b.pins||[]).map(id=>{const p=products.find(x=>String(x.id)===String(id));return p?'<span class="vst-tag">'+esc(p.title)+' '+button("×",'data-vst-unpin="'+esc(id)+'"')+'</span>':""}).join("")+'</div>'+
  '<label class="vst-field">Закрепить товар<select id="vstPin"><option value="">Выбери товар</option>'+products.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.title)+'</option>').join("")+'</select></label>'+
  '<div class="vst-actions">'+button("Закрепить",'data-vst-pin',"primary")+button("Удалить доску",'data-vst-delete-board="'+esc(b.id)+'"')+'</div>':note("Выбери доску слева или создай новую."))+'</div></div>';
 }
 const widgetInfo={
  projects:["Мои проекты","Локальные черновики и этапы.","workspace"],
  orders:["Заказы VIONA","Историю подтверждённых заказов смотри в VIONA ID.","home"],
  boards:["Доски идей","Подборки и заметки.","boards"],
  catalog:["Каталог","Доступные продукты.","bundles"],
  lab:["VIONA LAB","Проверка демонстраций.","lab"]
 };
 function renderDashboard(){
  const groups=state.widgetOrder.filter(x=>widgetInfo[x]);
  for(const key of Object.keys(widgetInfo))if(!groups.includes(key))groups.push(key);
  ROOT.innerHTML=title("Конструктор профиля","Расставляй виджеты стрелками или перетаскивай мышью. Порядок сохраняется в браузере.")+
  '<div class="vst-grid two" id="vstWidgets">'+groups.map((id,index)=>{
   const v=widgetInfo[id];const count=id==="projects"?state.projects.length:id==="boards"?state.boards.length:null;
   return '<article class="vst-card vst-dashboard-item" draggable="true" data-vst-drag="'+id+'"><div class="vst-eyebrow">0'+(index+1)+' / WIDGET</div><h3>'+v[0]+(count!==null?" · "+count:"")+'</h3><p>'+v[1]+'</p><div class="vst-actions">'+button("↑",'data-vst-widget-up="'+id+'"')+button("↓",'data-vst-widget-down="'+id+'"')+(id==="orders"?'<a class="vst-btn" href="/#home">VIONA ID ↗</a>':button("Открыть",'data-vst-tab="'+v[2]+'"'))+'</div></article>'
  }).join("")+'</div>';
 }
 function renderEditor(){
  editor.theme=effectiveTheme();
  ROOT.innerHTML=title("Редактор кода","Настраиваемый редактор с номерами строк, размером шрифта, переносом и табуляцией. Код остаётся в браузере.")+
  '<div class="vst-grid two"><article class="vst-card">'+
  '<label class="vst-field">Размер шрифта<select data-vst-editor="font">'+[12,13,14,16,18].map(n=>'<option value="'+n+'"'+(editor.font===n?" selected":"")+'>'+n+' px</option>').join("")+'</select></label>'+
  '<label class="vst-field">Тема VIONA и редактора<select data-vst-editor="theme"><option value="dark"'+(editor.theme==="dark"?" selected":"")+'>Тёмная</option><option value="light"'+(editor.theme==="light"?" selected":"")+'>Светлая</option></select></label>'+
  '<label class="vst-field">Отступ Tab<select data-vst-editor="tabs">'+[2,4,8].map(n=>'<option value="'+n+'"'+(editor.tabs===n?" selected":"")+'>'+n+' пробела</option>').join("")+'</select></label>'+
  '<label class="vst-check"><input type="checkbox" data-vst-editor="wrap"'+(editor.wrap?" checked":"")+'> Перенос длинных строк</label>'+
  '<label class="vst-check"><input type="checkbox" data-vst-editor="numbers"'+(editor.numbers?" checked":"")+'> Нумерация строк</label>'+
  '<div class="vst-actions"><a class="vst-btn primary" href="/code-edit">Перейти к доработке кода ↗</a></div></article>'+
  '<article class="vst-card"><h3>Живой предпросмотр</h3><div id="vstEditorPreview" class="vst-editor-wrap"><pre id="vstLineNums" class="vst-line-nums" aria-hidden="true"></pre><textarea id="vstCode" aria-label="Демонстрация редактора" spellcheck="false" class="vst-code" rows="12">function hello(name) {\n  // VIONA Studio\n  return "Hello, " + name;\n}</textarea></div><p style="margin-top:12px">В этом поле Tab вставляет отступ, код не исполняется.</p></article></div>';
  updateEditorPreview();
 }
 function updateEditorPreview(){
  const code=$("#vstCode");if(!code)return;
  const nums=$("#vstLineNums"),wrap=$("#vstEditorPreview");
  code.style.fontSize=editor.font+"px";code.style.tabSize=editor.tabs;
  nums.style.fontSize=editor.font+"px";nums.style.lineHeight="1.7";code.style.lineHeight="1.7";
  code.style.whiteSpace=editor.wrap?"pre-wrap":"pre";code.style.overflowWrap=editor.wrap?"anywhere":"normal";
  code.classList.toggle("vst-editor-dark",editor.theme==="dark");code.classList.toggle("vst-editor-light",editor.theme==="light");
  nums.hidden=!editor.numbers;wrap.style.gridTemplateColumns=editor.numbers?"40px minmax(0,1fr)":"minmax(0,1fr)";
  nums.textContent=Array.from({length:code.value.split("\n").length},(_,i)=>i+1).join("\n");
 }
 function renderSupport(){
  const email="support.viona.space@gmail.com";
  const faq=(q,a)=>'<details class="vst-faq"><summary>'+q+'</summary><p>'+a+'</p></details>';
  ROOT.innerHTML=title("Поддержка и вопросы","Связь с командой VIONA по проектам, заказам и работе Studio.")+
  '<div class="vst-grid two"><article class="vst-card"><h3>'+vector("mail")+' VIONA Support</h3>'+
  '<p>Опиши вопрос или проблему и укажи номер заказа, если он есть. Никогда не присылай пароли, токены и платёжные данные.</p>'+
  '<div class="vst-support-contact"><strong class="vst-support-address">'+email+'</strong><div class="vst-support-actions">'+
  '<a class="vst-btn primary" href="mailto:'+email+'?subject=VIONA%20%E2%80%94%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0">'+vector("mail")+' Написать письмо</a>'+
  button(vector("copy")+' Скопировать адрес','data-vst-copy-support')+'</div></div>'+
  '<p class="vst-note">Письмо откроется в почтовом приложении. Это не онлайн-чат, отправка через сайт не происходит.</p></article>'+
  '<article class="vst-card"><h3>'+vector("info")+' Частые вопросы</h3>'+
  faq("Как отправить заявку?","Собери проект в Конструкторе или LAB и используй «Отправить на оценку». Отправка подтверждается только при сохранении заявки сервером.")+
  faq("Где хранятся черновики?","В браузере на этом устройстве. Черновики не синхронизируются с другими устройствами.")+
  faq("Зачем UUID в адресе?","Уникальный адрес помогает найти черновик на этом устройстве, но не является публичной ссылкой на облачный проект.")+
  faq("Как спросить о заказе?","Напиши на support.viona.space@gmail.com и укажи номер заказа, если он есть. Пароли и секретные ключи не нужны.")+
  '</article></div>';
 }
 function render(){
  $$("#vstTabs [data-vst-tab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.vstTab===tab)));
  const renderers={lab:renderLab,builder:renderBuilder,workspace:renderWorkspace,diff:renderDiff,bundles:renderBundles,boards:renderBoards,dashboard:renderDashboard,editor:renderEditor,support:renderSupport};
  renderers[tab]();
 }
 function navigate(id){
  if(!tabs.has(id))return;tab=id;
  render();setStudioRoute(id);$("#vstTabs")?.scrollIntoView({block:"start",behavior:doc.dataset.prefMotion==="reduce"?"instant":"smooth"});
 }
 async function submitBuilder(form,intent,clickedButton){
  if(!form.reportValidity())return;
  const d=new FormData(form),project={
   id:uid(),title:clean(d.get("title"),90),kind:clean(d.get("kind"),70),tech:clean(d.get("tech"),80),
   features:d.getAll("features").map(x=>clean(x,90)),details:clean(d.get("details"),2000),
   createdAt:stamp(),stage:"idea",notes:[],files:[],status:"local_draft"
  };
  if(!project.title){toast("Добавь название проекта.");return}
  if(intent==="request"){
   const contact=clean(d.get("contact"),180);
   if(contact.length<3){toast("Для заявки укажи Telegram или email.");form.elements.contact.focus();return}
   clickedButton.disabled=true;clickedButton.textContent="Отправка…";
   try{
    const details=["VIONA Studio project request",project.title,project.kind,project.tech,
     "Features: "+project.features.join(", "),"Details: "+project.details].join("\n").slice(0,5000);
    const response=await fetch("/api/request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:project.title,contact,details})});
    if(response.status===202){toast("Демо: сервер не сохранил заявку. Черновик остаётся у тебя.");return}
    if(!response.ok)throw Error("unavailable");
    project.status="request_saved";project.notes.push({at:stamp(),text:"Заявка отправлена серверу. Этапы разработки не обновляются автоматически."});
    toast("Заявка отправлена. Дальнейшая работа согласуется отдельно.");
   }catch{toast("Не удалось отправить заявку. Черновик можно сохранить отдельно.");return}
   finally{clickedButton.disabled=false;clickedButton.textContent="Отправить на оценку ↗"}
  }
  state.projects.unshift(project);state.projects=state.projects.slice(0,30);state.selectedProject=project.id;
  save();if(intent==="draft")toast("Черновик сохранён в этом браузере.");navigate("workspace");
 }
 const downloadText=(name,text,type="text/plain")=>{
  const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
 };
 function moveWidget(id,delta){
  const a=state.widgetOrder;const i=a.indexOf(id),j=i+delta;if(i<0||j<0||j>=a.length)return;
  [a[i],a[j]]=[a[j],a[i]];save();renderDashboard();
 }
 ROOT.addEventListener("submit",e=>{
  const form=e.target;if(!["vstBuildForm","vstNoteForm","vstBoardForm","vstBoardNote"].includes(form.id))return;
  e.preventDefault();
  if(form.id==="vstBuildForm"){submitBuilder(form,e.submitter?.value||"draft",e.submitter||form.querySelector('[value="draft"]'));return}
  if(form.id==="vstNoteForm"){
   const p=selectedProject(),text=clean(new FormData(form).get("note"),1000);
   if(p&&text.length>=2){p.notes=p.notes||[];p.notes.push({at:stamp(),text});save();renderWorkspace()}return;
  }
  if(form.id==="vstBoardForm"){
   const value=clean(new FormData(form).get("board"),70);if(!value)return;
   const b={id:uid(),title:value,notes:[],pins:[],createdAt:stamp()};state.boards.unshift(b);state.selectedBoard=b.id;save();renderBoards();return;
  }
  if(form.id==="vstBoardNote"){
   const b=selectedBoard(),value=clean(new FormData(form).get("note"),350);
   if(b&&value){b.notes.push({id:uid(),text:value});save();renderBoards()}
  }
 });
 ROOT.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="vstStage"){const p=selectedProject();if(p&&stages.some(x=>x[0]===el.value)){p.stage=el.value;p.notes.push({at:stamp(),text:"Этап изменён вручную: "+stages.find(x=>x[0]===el.value)[1]});save();renderWorkspace()}}
  if(el.matches("[data-vst-bundle]")){const id=el.dataset.vstBundle,idx=state.bundle.indexOf(id);if(el.checked&&idx<0)state.bundle.push(id);else if(!el.checked&&idx>=0)state.bundle.splice(idx,1);save();renderBundles()}
  if(el.matches("[data-vst-editor]")){const key=el.dataset.vstEditor;if(key==="theme"){window.VionaTheme?.choose?.(el.value);editor.theme=effectiveTheme()}else editor[key]=el.type==="checkbox"?el.checked:["font","tabs"].includes(key)?Number(el.value):el.value;localStorage.setItem(EDITOR,JSON.stringify(editor));updateEditorPreview()}
  if(el.id==="vstFile"){
   const file=el.files?.[0],p=selectedProject();if(!file||!p)return;
   if(file.size>35000){toast("Файл слишком большой. Максимум 35 КБ.");return}
   const ext=file.name.toLowerCase().split(".").pop();
   if(!["txt","js","ts","json","css","html","md","py","xml"].includes(ext)){toast("Разрешены только текстовые файлы.");return}
   file.text().then(contents=>{p.files=p.files||[];if(p.files.length>=6){toast("Не более 6 файлов в проекте.");return}p.files.push({id:uid(),name:clean(file.name,120),contents});if(save())renderWorkspace()}).catch(()=>toast("Не удалось прочитать файл."));
  }
 });
 ROOT.addEventListener("click",e=>{
  const x=e.target.closest("button,[data-vst-tab]");if(!x)return;
  if(x.dataset.vstTab){navigate(x.dataset.vstTab);return}
  if(x.hasAttribute("data-vst-copy-support")){if(!navigator.clipboard?.writeText){toast("Выдели адрес поддержки и скопируй вручную.");return}navigator.clipboard.writeText("support.viona.space@gmail.com").then(()=>toast("Адрес поддержки скопирован.")).catch(()=>toast("Не удалось скопировать. Выдели адрес вручную."));return}
  if(x.dataset.vstLab){state.lab=x.dataset.vstLab;save();renderLab();setStudioRoute("lab");return}
  if(x.dataset.vstDemo){const v=x.dataset.vstDemo;labMessage=v==="/start"?"Привет! Это интерактивная демонстрация бота VIONA.":v==="/help"?"Команды: /start, /help, /about.": "VIONA Bot Starter — макет для будущего проекта.";renderLab();return}
  if(x.dataset.vstSite){demoSite=x.dataset.vstSite;renderLab();return}
  if(x.hasAttribute("data-vst-run-diff")){diffInputs.left=$("#vstDiffBefore").value;diffInputs.right=$("#vstDiffAfter").value;paintDiff();return}
  if(x.hasAttribute("data-vst-swap-diff")){diffInputs.left=$("#vstDiffAfter").value;diffInputs.right=$("#vstDiffBefore").value;renderDiff();return}
  if(x.dataset.vstOpenProject){state.selectedProject=x.dataset.vstOpenProject;save();renderWorkspace();return}
  if(x.dataset.vstDeleteProject){
   if(!confirm("Удалить локальный черновик проекта?"))return;
   state.projects=state.projects.filter(p=>p.id!==x.dataset.vstDeleteProject);state.selectedProject=state.projects[0]?.id||null;save();renderWorkspace();return;
  }
  if(x.dataset.vstDownload){
   const f=selectedProject()?.files?.find(f=>f.id===x.dataset.vstDownload);
   if(f)downloadText(f.name,f.contents);return;
  }
  if(x.dataset.vstOpenBoard){state.selectedBoard=x.dataset.vstOpenBoard;save();renderBoards();return}
  if(x.dataset.vstDeleteBoard){if(!confirm("Удалить доску и локальные заметки?"))return;state.boards=state.boards.filter(b=>b.id!==x.dataset.vstDeleteBoard);state.selectedBoard=state.boards[0]?.id||null;save();renderBoards();return}
  if(x.dataset.vstBoardRemoveNote){const b=selectedBoard();if(b){b.notes=b.notes.filter(n=>n.id!==x.dataset.vstBoardRemoveNote);save();renderBoards()}return}
  if(x.dataset.vstUnpin){const b=selectedBoard();if(b){b.pins=b.pins.filter(id=>id!==x.dataset.vstUnpin);save();renderBoards()}return}
  if(x.hasAttribute("data-vst-pin")){const b=selectedBoard(),id=$("#vstPin")?.value;if(b&&id&&products.some(p=>String(p.id)===id)&&!b.pins.includes(id)){b.pins.push(id);save();renderBoards()}return}
  if(x.hasAttribute("data-vst-add-bundle")){
   if(!state.bundle.length){toast("Выбери хотя бы один товар.");return}
   const valid=state.bundle.filter(id=>products.some(p=>String(p.id)===String(id)));
   const storedBasket=read("viona-halloween-v1",{}),basket=storedBasket&&typeof storedBasket==="object"?storedBasket:{},cart=Array.isArray(basket.cart)?basket.cart.map(String):[];
   basket.cart=[...new Set([...cart,...valid])];
   try{localStorage.setItem("viona-halloween-v1",JSON.stringify(basket));toast("Добавлено в корзину. Открываем каталог…");setTimeout(()=>location.assign("/#catalog"),300)}catch{toast("Не удалось обновить корзину.")}return;
  }
  if(x.dataset.vstWidgetUp){moveWidget(x.dataset.vstWidgetUp,-1);return}
  if(x.dataset.vstWidgetDown){moveWidget(x.dataset.vstWidgetDown,1);return}
 });
 ROOT.addEventListener("input",e=>{if(e.target.id==="vstCode")updateEditorPreview()});
 ROOT.addEventListener("scroll",e=>{if(e.target.id==="vstCode"){const gutter=$("#vstLineNums");if(gutter)gutter.scrollTop=e.target.scrollTop}},true);
 ROOT.addEventListener("keydown",e=>{
  if(e.target.id==="vstCode"&&e.key==="Tab"){
   e.preventDefault();const input=e.target,start=input.selectionStart,end=input.selectionEnd,spaces=" ".repeat(editor.tabs);
   input.setRangeText(spaces,start,end,"end");updateEditorPreview();
  }
 });
 $("#vstTabs")?.addEventListener("click",e=>{const b=e.target.closest("[data-vst-tab]");if(b)navigate(b.dataset.vstTab)});
 let drag=null;
 ROOT.addEventListener("dragstart",e=>{const node=e.target.closest("[data-vst-drag]");if(node){drag=node.dataset.vstDrag;e.dataTransfer?.setData("text/plain",drag)}});
 ROOT.addEventListener("dragover",e=>{if(drag&&e.target.closest("[data-vst-drag]"))e.preventDefault()});
 ROOT.addEventListener("drop",e=>{const dest=e.target.closest("[data-vst-drag]")?.dataset.vstDrag;if(!drag||!dest||drag===dest)return;e.preventDefault();const a=state.widgetOrder,i=a.indexOf(drag),j=a.indexOf(dest);if(i<0||j<0)return;a.splice(i,1);a.splice(j,0,drag);drag=null;save();renderDashboard()});
 const privacy=$("#vstPrivacy");if(privacy){privacy.setAttribute("aria-pressed",String(doc.dataset.vionaPrivate==="on"))}
 privacy?.addEventListener("click",()=>{
  const enabled=!doc.classList.contains("vst-privacy-active");
  doc.classList.toggle("vst-privacy-active",enabled);doc.dataset.vionaPrivate=enabled?"on":"off";
  privacy.setAttribute("aria-pressed",String(enabled));toast(enabled?"Приватный режим включён":"Приватный режим выключен");
 });
 async function loadProducts(){
  try{
   const response=await fetch("/api/products",{credentials:"same-origin"});
   if(!response.ok)throw Error("catalog unavailable");const data=await response.json();
   products=(Array.isArray(data)?data:Array.isArray(data.products)?data.products:[]).map(p=>({...p,id:Number(p.id)}));
  }catch{products=[];toast("Каталог пока недоступен. Остальные разделы работают локально.")}
  render();
 }
 const langCode={ru:"RU",en:"EN",de:"DE",ja:"JP",femboy:"♡"}[doc.dataset.world]||"RU";
 if($("#vstLangLabel"))$("#vstLangLabel").textContent=langCode;
 const langFlag=$("#vstLanguage img");if(langFlag)langFlag.hidden=doc.dataset.world!=="ru";
 new MutationObserver(()=>{const next=effectiveTheme();if(editor.theme!==next){editor.theme=next;const el=ROOT.querySelector('[data-vst-editor="theme"]');if(el)el.value=next;updateEditorPreview()}})
  .observe(doc,{attributes:true,attributeFilter:["data-theme"]});
 window.VionaStudio={navigate,openView:navigate,editor:()=>({...editor})};
 loadProducts();
})();