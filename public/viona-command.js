"use strict";
/* Cmd+K / Ctrl+K: safe, searchable navigation; no account access by bypass. */
(()=>{
 const locale=()=>{try{return JSON.parse(localStorage.getItem("viona-world"))||"ru"}catch{return"ru"}};
 const EN=locale()==="en",escape=v=>String(v??"").replace(/[&<>"\']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]||(c.charCodeAt(0)===34?"&quot;":"&#39;")));
 const text={title:EN?"Search or type a command…":"Поиск действий или разделов…",empty:EN?"Nothing found":"Ничего не найдено",close:EN?"Esc to close":"Esc — закрыть",choose:EN?"Enter to select":"Enter — выбрать"};
 const commands=[
  {id:"catalog",title:EN?"Catalog":"Каталог",hint:EN?"Browse digital products":"Цифровые товары",icon:"◫",url:"/#catalog",keywords:"товары продукты поиск catalog"},
  {id:"lab",title:"VIONA LAB",hint:EN?"Interactive demos":"Интерактивные демо",icon:"◈",url:"/studio?view=lab",keywords:"demo тест"},
  {id:"builder",title:EN?"Project builder":"Конструктор проекта",hint:EN?"Create a project brief":"Собрать техническое задание",icon:"▤",url:"/studio?view=builder",keywords:"idea проект"},
  {id:"workspace",title:"Workspace",hint:EN?"Projects, files and notes":"Проекты, файлы, заметки",icon:"◷",url:"/studio?view=workspace",keywords:"project history timeline"},
  {id:"diff",title:EN?"Code comparison":"Сравнить код До / После",hint:"Diff",icon:"≠",url:"/studio?view=diff",keywords:"compare изменения"},
  {id:"bundles",title:EN?"Product bundles":"Наборы товаров",hint:EN?"Combine products":"Собрать товары вместе",icon:"⊞",url:"/studio?view=bundles",keywords:"cart корзина"},
  {id:"boards",title:EN?"Idea boards":"Доски идей",hint:EN?"Notes and collections":"Заметки и подборки",icon:"◇",url:"/studio?view=boards",keywords:"notes pinboard"},
  {id:"dashboard",title:EN?"Profile dashboard":"Конструктор профиля",hint:EN?"Arrange widgets":"Переставить виджеты",icon:"▦",url:"/studio?view=dashboard",keywords:"widgets"},
  {id:"editor",title:EN?"Code editor preferences":"Редактор кода",hint:EN?"Font, tab, wrap":"Настройки редактора",icon:"⌨",url:"/studio?view=editor",keywords:"code"},
  {id:"code",title:EN?"Request code changes":"Доработка кода",hint:EN?"Submit your own source code":"Оставить платную заявку",icon:"✎",url:"/code-edit",keywords:"edit service"},
  {id:"settings",title:EN?"Settings":"Настройки",hint:EN?"Appearance, animations and privacy":"Темы, анимации и данные",icon:"⚙",action:"settings",keywords:"themes preferences"},
  {id:"profile",title:"VIONA ID",hint:EN?"Open your profile":"Открыть профиль",icon:"◉",action:"profile",keywords:"account"},
  {id:"privacy",title:EN?"Privacy screen mode":"Приватный режим",hint:EN?"Hide on-screen details":"Скрыть личные данные на экране",icon:"◎",action:"privacy",keywords:"private"}
 ];
 let overlay=null,active=0,priorFocus=null,filtered=[...commands];
 function choose(cmd){
  if(!cmd)return;
  close();
  if(cmd.url){
   if(location.pathname==="/studio"&&cmd.url.startsWith("/studio?")){
    window.VionaStudio?.navigate(cmd.url.split("view=")[1]);return
   }
   location.assign(cmd.url);return;
  }
  if(cmd.action==="settings"){
   if(window.VionaSettings?.open)window.VionaSettings.open();else location.assign("/#home");return
  }
  if(cmd.action==="profile"){const trigger=document.getElementById("profileOpen");if(trigger)trigger.click();else location.assign("/#home");return}
  if(cmd.action==="privacy"){
   const btn=document.getElementById("vstPrivacy");if(btn)btn.click();else{
    const on=document.documentElement.dataset.vionaPrivate!=="on";
    document.documentElement.dataset.vionaPrivate=on?"on":"off";
    document.documentElement.classList.toggle("vst-privacy-active",on);
   }
  }
 }
 function paint(){
  const list=overlay?.querySelector(".vgc-options");if(!list)return;
  list.innerHTML=filtered.length?filtered.map((cmd,i)=>'<button class="vgc-option" type="button" role="option" data-command="'+escape(cmd.id)+'" aria-selected="'+(i===active)+'"><span aria-hidden="true">'+escape(cmd.icon)+'</span><span><strong>'+escape(cmd.title)+'</strong><small>'+escape(cmd.hint)+'</small></span></button>').join(""):'<p style="text-align:center;padding:21px;opacity:.8">'+text.empty+'</p>';
  list.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"});
 }
 function search(query){
  const q=String(query||"").toLocaleLowerCase().trim();
  filtered=commands.filter(cmd=>(cmd.title+" "+cmd.hint+" "+cmd.keywords).toLocaleLowerCase().includes(q));
  active=0;paint();
 }
 function open(){
  if(overlay)return;
  priorFocus=document.activeElement;
  overlay=document.createElement("div");overlay.className="vgc-overlay";overlay.id="vionaCommandOverlay";
  overlay.innerHTML='<section class="vgc-dialog" role="dialog" aria-modal="true" aria-label="VIONA Command Center"><input type="search" id="vgcSearch" autocomplete="off" spellcheck="false" placeholder="'+escape(text.title)+'" aria-label="'+escape(text.title)+'"><div class="vgc-options" role="listbox" aria-label="Commands"></div><p class="vgc-footer">'+escape(text.choose)+' · '+escape(text.close)+'</p></section>';
  document.body.append(overlay);
  const input=overlay.querySelector("#vgcSearch");
  overlay.addEventListener("pointerdown",e=>{if(e.target===overlay)close()});
  overlay.addEventListener("input",e=>{if(e.target===input)search(input.value)});
  overlay.addEventListener("click",e=>{const b=e.target.closest("[data-command]");if(b)choose(commands.find(x=>x.id===b.dataset.command))});
  search("");input.focus();
 }
 function close(){if(!overlay)return;overlay.remove();overlay=null;priorFocus?.isConnected&&priorFocus.focus({preventScroll:true})}
 document.addEventListener("click",e=>{if(e.target.closest("[data-command-open]")){e.preventDefault();open()}});
 document.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();overlay?close():open();return}
  if(!overlay)return;
  if(e.key==="Escape"){e.preventDefault();e.stopImmediatePropagation();close();return}
  if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();active=(active+(e.key==="ArrowDown"?1:-1)+filtered.length)%Math.max(filtered.length,1);paint();return}
  if(e.key==="Enter"){e.preventDefault();choose(filtered[active]);return}
  if(e.key==="Tab"){
   e.preventDefault();overlay.querySelector("#vgcSearch")?.focus();
  }
 },true);
 window.VionaCommand={open,close};
})();