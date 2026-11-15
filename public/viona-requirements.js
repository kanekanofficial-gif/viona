"use strict";
/* Catalog-specific requirements & separately priced customization inquiries. */
(()=>{
 const requirements={
  1:{
   ru:["Название и @username бота","Список команд и сценариев","Нужные интеграции без секретных ключей"],
   en:["Bot name and @username","Commands and conversation flows","Required integrations (no secret keys)"],
   de:["Bot-Name und @username","Befehle und Abläufe","Gewünschte Integrationen ohne geheime Schlüssel"],
   ja:["ボット名と@username","コマンドと操作の流れ","必要な連携（秘密鍵は送らない）"]},
  2:{ru:["Страницы и блоки портфолио","Тексты, фотографии и ссылки","Предпочитаемые цвета и пример дизайна"],
   en:["Portfolio pages and sections","Text, photos and links","Preferred colors and design references"],
   de:["Portfolio-Seiten und Abschnitte","Texte, Bilder und Links","Farben und Designbeispiele"],
   ja:["ポートフォリオのページ構成","テキスト、画像、リンク","配色とデザイン例"]},
  3:{ru:["Название Discord-сервера","Команды, роли и права доступа","Функции бота без отправки токена"],
   en:["Discord server name","Commands, roles and permissions","Bot features (do not send tokens)"],
   de:["Discord-Servername","Befehle, Rollen und Rechte","Bot-Funktionen (keine Tokens senden)"],
   ja:["Discordサーバー名","コマンド、ロール、権限","ボット機能（トークンは送らない）"]},
  4:{ru:["Название и версия одиночной игры","Платформа и формат проекта","Какие разрешённые функции нужны"],
   en:["Single-player game and version","Platform and project format","Permitted features you need"],
   de:["Einzelspieler-Spiel und Version","Plattform und Projektformat","Benötigte erlaubte Funktionen"],
   ja:["シングルプレイヤーゲーム名とバージョン","プラットフォームと形式","必要な許可された機能"]},
  5:{ru:["Цель страницы и список секций","Тексты, логотипы и изображения","Цвета, референсы и адаптация"],
   en:["Page goal and sections","Text, logos and photos","Colors, design references and mobile layout"],
   de:["Seitenziel und Abschnitte","Texte, Logos und Bilder","Farben, Vorlagen und mobiles Layout"],
   ja:["ページの目的と構成","テキスト、ロゴ、画像","配色、参考デザイン、モバイル対応"]},
  6:{ru:["Язык программирования и окружение","Описание задачи и ожидаемого результата","Существующий проект или пример кода без секретов"],
   en:["Programming language and environment","Project brief and desired result","Existing project or code example without secrets"],
   de:["Sprache und Entwicklungsumgebung","Aufgabenstellung und Ziel","Bestehendes Projekt oder Code ohne Geheimnisse"],
   ja:["プログラミング言語と実行環境","依頼内容と期待する結果","既存コードの例（秘密情報なし）"]},
  7:{ru:["Название бота и назначение","Команды и ответы","Нужные интеграции без токенов"],
   en:["Bot name and purpose","Commands and replies","Integrations without credentials"],
   de:["Name und Zweck des Bots","Befehle und Antworten","Integrationen ohne Zugangsdaten"],
   ja:["ボット名と用途","コマンドと応答","必要な連携（認証情報なし）"]}
 };
 const words={
  ru:{heading:"Что нужно добавить?",description:"Расскажи, как настроить этот продукт под себя.",request:"Отправить пожелания",contact:"Telegram или email для ответа",changes:"Что добавить, удалить или исправить?",warning:"Не отправляй пароли, токены и API-ключи. Настройка оценивается и оплачивается отдельно.",success:"Заявка сохранена. Мы согласуем стоимость отдельно.",demo:"Демо-режим: запрос не сохранён. Нужна база данных.",error:"Не удалось отправить запрос.",empty:"Укажи контакт и пожелания (от 10 символов).",send:"Отправляем…"},
  en:{heading:"What should be added?",description:"Tell us how to customize this product.",request:"Send customization request",contact:"Telegram or email",changes:"What to add, remove or fix?",warning:"Never submit passwords, bot tokens or API keys. Customization is quoted separately.",success:"Request saved. Price will be agreed separately.",demo:"Demo mode: request was not saved. Database required.",error:"Could not submit request.",empty:"Add your contact and at least 10 characters of instructions.",send:"Sending…"},
  de:{heading:"Was soll ergänzt werden?",description:"Beschreibe die gewünschte Anpassung.",request:"Anpassung anfragen",contact:"Telegram oder E-Mail",changes:"Was soll ergänzt, entfernt oder repariert werden?",warning:"Keine Passwörter, Tokens oder API-Schlüssel senden. Anpassungen werden separat berechnet.",success:"Anfrage gespeichert. Preis wird gesondert vereinbart.",demo:"Demo-Modus: Anfrage nicht gespeichert.",error:"Anfrage konnte nicht gesendet werden.",empty:"Bitte Kontakt und mindestens 10 Zeichen eingeben.",send:"Wird gesendet…"},
  ja:{heading:"何を追加しますか？",description:"ご希望のカスタマイズを教えてください。",request:"カスタマイズを依頼",contact:"Telegram またはメール",changes:"追加・削除・修正したい内容",warning:"パスワード、トークン、APIキーを送らないでください。追加作業は別途見積もりになります。",success:"依頼を保存しました。料金は別途確認します。",demo:"デモモード：保存されませんでした。",error:"送信できませんでした。",empty:"連絡先と10文字以上のご要望を入力してください。",send:"送信中…"},
  femboy:{heading:"Что добавить? ♡",description:"Расскажи, как сделать этот продукт именно твоим ♡",request:"Отправить пожелания ♡",contact:"Твой Telegram или email",changes:"Что добавить или изменить? ♡",warning:"Токены и пароли отправлять нельзя. Стоимость уточним отдельно ♡",success:"Пожелания сохранены ♡ Цену согласуем отдельно.",demo:"Пока нет базы данных — пожелания не сохранились.",error:"Не получилось отправить заявку.",empty:"Добавь контакт и описание.",send:"Отправляем ♡"}
 };
 const locale=()=>document.documentElement.dataset.world||"ru";
 const t=()=>({...words.ru,...(words[locale()]||{})});
 const selected=id=>requirements[id]&&(requirements[id][locale()]||requirements[id].ru);
 function create(id,withForm){
  const items=selected(id);if(!items)return null;
  const text=t(),details=document.createElement("details");
  details.className="nx-requirements";details.dataset.productId=id;
  const summary=document.createElement("summary");summary.textContent=text.heading;
  const intro=document.createElement("p");intro.textContent=text.description;
  const list=document.createElement("ul");
  for(const line of items){const li=document.createElement("li");li.textContent=line;list.append(li)}
  details.append(summary,intro,list);
  if(withForm){
   const form=document.createElement("form");form.className="nx-customize-form";form.dataset.requirementProduct=id;
   const contact=document.createElement("input");contact.name="contact";contact.type="text";contact.maxLength=200;contact.required=true;contact.placeholder=text.contact;contact.setAttribute("aria-label",text.contact);
   const changes=document.createElement("textarea");changes.name="changes";changes.rows=3;changes.minLength=10;changes.maxLength=2400;changes.required=true;changes.placeholder=text.changes;changes.setAttribute("aria-label",text.changes);
   const note=document.createElement("small");note.textContent=text.warning;
   const submit=document.createElement("button");submit.type="submit";submit.textContent=text.request;
   const status=document.createElement("p");status.className="nx-customize-status";status.setAttribute("role","status");
   form.append(contact,changes,note,submit,status);details.append(form);
  }else{
   const note=document.createElement("small");note.textContent=text.warning;details.append(note);
  }
  return details;
 }
 const grid=document.getElementById("products"),popup=document.getElementById("v15Content");
 function decorateCards(){
  if(!grid)return;
  for(const card of grid.querySelectorAll(".product:not([data-nx-requirements])")){
   const id=Number(card.querySelector("[data-view]")?.dataset.view);
   const block=create(id,true);
   if(!block)continue;card.dataset.nxRequirements=id;
   const target=card.querySelector(".product-view");
   if(target)target.after(block);else card.append(block);
  }
 }
 function decorateDetail(){
  const layout=popup?.querySelector(".detail-layout");
  const info=layout?.querySelector(".detail-info");
  if(!info||info.querySelector(".nx-requirements"))return;
  const id=Number(layout.dataset.productId);
  const block=create(id,false);if(block)info.append(block);
 }
 if(grid){
  new MutationObserver(decorateCards).observe(grid,{childList:true});
  decorateCards();
  grid.addEventListener("submit",async e=>{
   const form=e.target.closest(".nx-customize-form");if(!form)return;
   e.preventDefault();e.stopPropagation();
   const data=Object.fromEntries(new FormData(form));
   const status=form.querySelector(".nx-customize-status"),button=form.querySelector("button");
   const id=Number(form.dataset.requirementProduct);
   if(!requirements[id]||!data.contact?.trim()||String(data.changes||"").trim().length<10){status.textContent=t().empty;return}
   const product=form.closest(".product")?.querySelector("h3")?.textContent||"VIONA Product";
   button.disabled=true;status.textContent=t().send;
   try{
    const details=("Customization request, product "+id+" / "+product+"\n"+String(data.changes).trim()).slice(0,5000);
    const res=await fetch("/api/request",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",
     body:JSON.stringify({name:"",contact:String(data.contact).trim().slice(0,200),details})});
    if(res.status===202){status.textContent=t().demo;return}
    if(!res.ok)throw Error("request_failed");
    status.textContent=t().success;form.reset();
   }catch{status.textContent=t().error}
   finally{button.disabled=false}
  });
 }
 if(popup){
  new MutationObserver(decorateDetail).observe(popup,{childList:true,subtree:true});
  decorateDetail();
 }
})();