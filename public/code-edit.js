"use strict";
/* No client code is executed, printed to logs, or passed to payment providers. */
(()=>{
 const root=document.documentElement;
 const known=["ru","en","ja","de","femboy"];
 const translations={
  ru:{catalog:"Каталог",back:"На главную",langLabel:"Язык",eyebrow:"УСЛУГА / РАЗРАБОТКА",
   heading:"Доработка твоего кода.",description:"Пришли исходный код своего проекта и объясни, что изменить, удалить, исправить или добавить. Мы оценим задачу и сообщим стоимость до начала работы.",
   priceLabel:"Стоимость",priceValue:"По оценке задачи",priceNote:"Это запрос на оценку, а не платёж. Никаких списаний.",
   formTitle:"Расскажи о проекте",projectLabel:"Название проекта",languageLabel:"Технология",
   chooseLanguage:"Выбери язык",other:"Другое",codeLabel:"Вставь исходный код",
   codeLimit:"До 30 000 символов. Не вставляй токены, пароли, API-ключи или чужой закрытый код.",
   changesLabel:"Что нужно изменить?",nameLabel:"Имя или ник",contactLabel:"Telegram или email",
   confirm:"Я имею право изменять этот код и понимаю, что оценка и доработка оплачиваются отдельно.",
   send:"Отправить на оценку",typesTitle:"Что можно заказать",
   task1:"Исправление ошибок и багов",task2:"Изменение или удаление функций",
   task3:"Новые возможности и интеграции",task4:"Улучшение интерфейса и структуры",
   processTitle:"Как проходит работа",processDesc:"Ты отправляешь запрос. Мы уточняем объём и цену. Работа начинается только после отдельного согласования.",
   safeTitle:"Безопасность кода",safeDesc:"Не отправляй пароли, токены ботов, приватные ключи или персональные данные. Вставляй только код, который имеешь право передавать.",
   support:"Связаться с нами",projectPlaceholder:"Мой Telegram-бот",
   codePlaceholder:"// Вставь сюда код проекта...",changesPlaceholder:"Опиши, что исправить, удалить или добавить. Укажи ожидаемый результат.",
   namePlaceholder:"Имя или ник",contactPlaceholder:"@username или email",
   submitting:"Отправляем запрос…",sent:"Запрос принят! Номер заявки: ",notSaved:"Хранилище заявок пока недоступно: запрос не сохранён.",
   failed:"Не удалось сохранить запрос. Повтори отправку.",invalid:"Проверь все обязательные поля.",slow:"Слишком много запросов. Попробуй позже."},
  en:{catalog:"Catalog",back:"Home",langLabel:"Language",eyebrow:"SERVICE / DEVELOPMENT",
   heading:"Improve your own code.",description:"Paste the source code for your project and tell us what to change, remove, fix or add. We'll review the scope and quote a price before any work begins.",
   priceLabel:"Price",priceValue:"Quoted after review",priceNote:"This requests an estimate, not payment. No charge is made.",
   formTitle:"Tell us about your project",projectLabel:"Project name",languageLabel:"Technology",
   chooseLanguage:"Choose language",other:"Other",codeLabel:"Paste your source code",
   codeLimit:"Up to 30,000 characters. Do not include passwords, tokens, API keys, or confidential code that you do not own.",
   changesLabel:"What should change?",nameLabel:"Name or nickname",contactLabel:"Telegram or email",
   confirm:"I have permission to modify this code and understand that code changes are a separately priced service.",
   send:"Request an estimate",typesTitle:"What we can do",
   task1:"Fix bugs and errors",task2:"Change or remove features",task3:"Add integrations and capabilities",task4:"Improve UI and architecture",
   processTitle:"How it works",processDesc:"Submit your request. We review the scope and quote a price. Work begins only after separate agreement.",
   safeTitle:"Code safety",safeDesc:"Never send passwords, bot tokens, private keys or personal data. Submit only code you have permission to share.",
   support:"Contact us",projectPlaceholder:"My Telegram bot",
   codePlaceholder:"// Paste your project code here...",changesPlaceholder:"Explain what to fix, remove or add and describe the desired result.",
   namePlaceholder:"Name or nickname",contactPlaceholder:"@username or email",
   submitting:"Submitting request…",sent:"Request received! Reference: ",notSaved:"Request storage is unavailable; nothing has been saved.",
   failed:"Could not save your request. Please try again.",invalid:"Check the required fields.",slow:"Too many requests. Try again later."},
  ja:{catalog:"商品一覧",back:"ホーム",langLabel:"言語",eyebrow:"サービス / 開発",
   heading:"あなたのコードを改善。",description:"ご自身のソースコードを貼り付け、修正・削除・追加したい内容を説明してください。作業前に内容を確認して見積もりをご案内します。",
   priceLabel:"料金",priceValue:"内容を確認後に見積もり",priceNote:"これは見積もり依頼です。決済ではありません。",
   formTitle:"プロジェクトについて",projectLabel:"プロジェクト名",languageLabel:"技術",
   chooseLanguage:"言語を選択",other:"その他",codeLabel:"ソースコードを貼り付ける",
   codeLimit:"最大30,000文字。パスワード、トークン、APIキー、許可のない機密コードを含めないでください。",
   changesLabel:"変更したい内容",nameLabel:"名前またはニックネーム",contactLabel:"Telegram またはメール",
   confirm:"このコードを変更する権利があり、有料の作業は別途見積もりされることを理解しています。",
   send:"見積もりを依頼",typesTitle:"対応できる作業",
   task1:"バグの修正",task2:"機能の変更や削除",task3:"新機能や連携の追加",task4:"UIとコード構造の改善",
   processTitle:"依頼の流れ",processDesc:"依頼を送信し、作業範囲と料金を確認します。同意後に作業を開始します。",
   safeTitle:"安全について",safeDesc:"パスワード、トークン、秘密鍵、個人情報を送らないでください。共有権限のあるコードのみを貼り付けてください。",
   support:"お問い合わせ",projectPlaceholder:"自分のTelegramボット",
   codePlaceholder:"// コードを貼り付け...",changesPlaceholder:"修正・削除・追加したい内容と完成イメージを教えてください。",
   namePlaceholder:"名前",contactPlaceholder:"@username またはメール",
   submitting:"送信中…",sent:"依頼を受け付けました！番号: ",notSaved:"保存機能が利用できません。依頼は保存されませんでした。",
   failed:"依頼を保存できませんでした。",invalid:"必須項目を確認してください。",slow:"リクエストが多すぎます。後でお試しください。"},
  de:{catalog:"Katalog",back:"Startseite",langLabel:"Sprache",eyebrow:"SERVICE / ENTWICKLUNG",
   heading:"Wir verbessern deinen Code.",description:"Füge deinen eigenen Quellcode ein und beschreibe, was geändert, entfernt, repariert oder ergänzt werden soll. Vor Beginn nennen wir dir den Preis.",
   priceLabel:"Preis",priceValue:"Angebot nach Prüfung",priceNote:"Hier wird nur ein Angebot angefragt. Keine Zahlung.",
   formTitle:"Beschreibe dein Projekt",projectLabel:"Projektname",languageLabel:"Technologie",
   chooseLanguage:"Sprache wählen",other:"Andere",codeLabel:"Quellcode einfügen",
   codeLimit:"Bis 30.000 Zeichen. Keine Passwörter, Tokens, API-Schlüssel oder fremden vertraulichen Code eingeben.",
   changesLabel:"Was soll geändert werden?",nameLabel:"Name oder Nickname",contactLabel:"Telegram oder E-Mail",
   confirm:"Ich darf diesen Code ändern und weiß, dass die Überarbeitung separat berechnet wird.",
   send:"Angebot anfordern",typesTitle:"Unsere Leistungen",
   task1:"Fehler und Bugs beheben",task2:"Funktionen ändern oder entfernen",task3:"Funktionen und Integrationen ergänzen",task4:"UI und Code-Struktur verbessern",
   processTitle:"Ablauf",processDesc:"Sende deine Anfrage. Wir prüfen Umfang und Preis. Die Arbeit beginnt erst nach gesonderter Zustimmung.",
   safeTitle:"Sicherer Umgang mit Code",safeDesc:"Keine Passwörter, Bot-Tokens, privaten Schlüssel oder personenbezogenen Daten senden. Nur Code einreichen, den du weitergeben darfst.",
   support:"Kontakt",projectPlaceholder:"Mein Telegram-Bot",
   codePlaceholder:"// Projektcode hier einfügen...",changesPlaceholder:"Beschreibe die gewünschten Änderungen und das Ziel.",
   namePlaceholder:"Name oder Nickname",contactPlaceholder:"@username oder E-Mail",
   submitting:"Anfrage wird gesendet…",sent:"Anfrage erhalten! Nummer: ",notSaved:"Speicherung nicht verfügbar. Anfrage nicht gespeichert.",
   failed:"Anfrage konnte nicht gespeichert werden.",invalid:"Bitte Pflichtfelder prüfen.",slow:"Zu viele Anfragen. Bitte später erneut versuchen."},
  femboy:{catalog:"Каталог ♡",back:"На главную ♡",langLabel:"Язык ♡",eyebrow:"УСЛУГА / КОД ♡",
   heading:"Улучшим твой код ♡",description:"Отправь свой код и расскажи, что хочешь изменить или добавить. Сначала согласуем цену, а потом приступим ♡",
   priceLabel:"Стоимость ♡",priceValue:"После оценки",priceNote:"Пока только запрос, без оплаты ♡",
   formTitle:"Расскажи о проекте ♡",projectLabel:"Название проекта",languageLabel:"Технология",chooseLanguage:"Выбери язык",other:"Другое",
   codeLabel:"Вставь свой код ♡",changesLabel:"Что нужно изменить? ♡",send:"Отправить заявку ♡",
   typesTitle:"С чем поможем ♡",processTitle:"Как всё будет",safeTitle:"Безопасность прежде всего",
   submitting:"Отправляем ♡",sent:"Заявочка получена! Номер: ",notSaved:"Пока нет хранилища — заявка не сохранилась.",
   failed:"Не получилось сохранить заявку.",slow:"Слишком много запросов, попробуй позже ♡"}
 };
 function stored(){
  for(const key of ["viona-world","viona-language-v18"]){
   try{const v=JSON.parse(localStorage.getItem(key));if(translations[v])return v}catch{}
  }
  return"ru";
 }
 let locale=stored();
 const text=()=>({...translations.ru,...(translations[locale]||{})});
 function render(){
  root.dataset.world=locale;root.lang=locale==="femboy"?"ru":locale;
  const t=text();
  for(const el of document.querySelectorAll("[data-text]"))if(t[el.dataset.text])el.textContent=t[el.dataset.text];
  for(const el of document.querySelectorAll("[data-placeholder]"))if(t[el.dataset.placeholder])el.placeholder=t[el.dataset.placeholder];
  const sel=document.getElementById("codeLocale");if(sel)sel.value=locale;
  document.title=t.heading+" — VIONA";
 }
 function setLocale(l){
  if(!translations[l])return;locale=l;
  try{localStorage.setItem("viona-world",JSON.stringify(l));localStorage.setItem("viona-language-v18",JSON.stringify(l))}catch{}
  document.cookie="viona_language="+encodeURIComponent(l)+"; Path=/; Max-Age=31536000; SameSite=Lax";
  render();
 }
 function boot(){
  render();document.getElementById("codeLocale")?.addEventListener("change",e=>setLocale(e.target.value));
  const form=document.getElementById("codeEditForm"),status=document.getElementById("codeEditStatus");
  if(!form)return;
  form.addEventListener("submit",async event=>{
   event.preventDefault();
   if(!form.reportValidity())return;
   const data=Object.fromEntries(new FormData(form));
   const button=form.querySelector("button[type=submit]");
   button.disabled=true;status.textContent=text().submitting;
   try{
    const r=await fetch("/api/code-edit",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",
     body:JSON.stringify({project:data.project,name:data.name,contact:data.contact,language:data.language,
      source:data.source,changes:data.changes})});
    const result=await r.json().catch(()=>({}));
    if(r.status===503){status.textContent=text().notSaved;return}
    if(r.status===429){status.textContent=text().slow;return}
    if(r.status===400){status.textContent=text().invalid;return}
    if(!r.ok||!result.id)throw Error("submission_failed");
    status.textContent=text().sent+result.id;
    form.reset();
   }catch{status.textContent=text().failed}
   finally{button.disabled=false}
  });
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();