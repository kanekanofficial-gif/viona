"use strict";
/* VIONA ID settings: local preferences only, no remote account sync. */
(()=>{
 const KEY="viona-preferences-v1";
 const root=document.documentElement;
 const defaults={motion:"system",density:"comfortable",font:"normal",contrast:"normal",badge:true,start:"home",privacy:false,water:true};
 const choices={motion:["system","reduce"],density:["comfortable","compact"],font:["normal","large"],contrast:["normal","high"],start:["home","catalog"]};
 const translations={
  ru:{
   title:"Настройки",profileLink:"Настройки профиля",profileCaption:"Оформление, удобство и приватность",eyebrow:"VIONA ID / PREFERENCES",
   subtitle:"Настрой VIONA под себя. Эти параметры хранятся только в этом браузере.",
   close:"Закрыть настройки",appearance:"Оформление",interface:"Интерфейс",data:"Данные",
   themeTitle:"Тема сайта",themeHelp:"Автоматическая тема следует настройкам твоего устройства.",system:"Как в системе",light:"Светлая",dark:"Тёмная",
   pinkNote:"Фембойский язык включает розово-чёрное оформление независимо от режима темы.",
   motionTitle:"Анимации",motionHelp:"Сравни живой интерфейс и мгновенные переходы прямо здесь.",motionPreviewOn:"Плавная анимация",motionPreviewOff:"Без анимации",privacyTitle:"Приватный режим",privacyHelp:"Размытие личной информации при демонстрации экрана.",privacyOn:"Скрывать личные данные на экране",waterTitle:"Жидкое стекло · эксперимент",waterHelp:"Глянцевые потёки и капли по краям избранных карточек.",waterOn:"Показывать водяной глянец",toolsTitle:"Новые инструменты",toolsHelp:"Виджеты профиля, редактор и VIONA LAB.",widgetLink:"Настроить виджеты",editorLink:"Редактор кода",motionSystem:"По системе",motionReduce:"Минимум анимаций",
   densityTitle:"Плотность каталога",densityHelp:"Компактный режим уменьшает отступы и размеры карточек.",comfortable:"Обычная",compact:"Компактная",
   fontTitle:"Размер текста",fontHelp:"Увеличивает текст в основных разделах без масштабирования страницы.",normal:"Обычный",large:"Крупнее",
   contrastTitle:"Контраст",contrastHelp:"Более выраженные границы и вторичный текст.",contrastNormal:"Обычный",contrastHigh:"Повышенный",
   languageTitle:"Язык интерфейса",languageHelp:"Смена языка обновит страницу. Оформление заказа тоже переведётся.",language:"Язык",
   startTitle:"Стартовый раздел",startHelp:"Куда открывать VIONA при посещении главной страницы без ссылки на раздел.",home:"Главная",catalog:"Каталог",
   badgeTitle:"Значок уведомлений",badgeHelp:"Скрывает только точку возле уведомлений. Сообщения в VIONA ID сохраняются.",badgeOn:"Показывать новые уведомления",
   storedTitle:"Мои локальные данные",storedHelp:"Настройки, избранное и корзина находятся в этом браузере. Удаление не затрагивает покупки, платежи или данные аккаунта на сервере.",
   exportTitle:"Скачать копию",exportHelp:"Экспортируй настройки, избранное и корзину в JSON-файл.",export:"Экспортировать",
   clearTitle:"Очистить избранное и корзину",clearHelp:"Удалит только местные списки на этом устройстве.",clear:"Очистить списки",
   resetTitle:"Сбросить настройки интерфейса",resetHelp:"Возвращает тему к системной, размеры, контраст и анимации к исходным. Язык и покупки не изменятся.",reset:"Сбросить",
   saved:"Настройки сохранены на этом устройстве",exported:"Файл настроек создан",cleared:"Списки очищены",resetDone:"Настройки интерфейса сброшены",
   clearConfirm:"Удалить избранное и корзину из этого браузера? Данные аккаунта и оплаты останутся без изменений.",
   resetConfirm:"Сбросить тему и настройки интерфейса в этом браузере?",
   dataError:"Не удалось выполнить действие в этом браузере.",
   note:"VIONA не синхронизирует эти настройки между устройствами.",tabHint:"Раздел настроек"
  },
  en:{
   title:"Settings",profileLink:"Profile settings",profileCaption:"Appearance, comfort & privacy",eyebrow:"VIONA ID / PREFERENCES",
   subtitle:"Make VIONA yours. These settings are stored only in this browser.",
   close:"Close settings",appearance:"Appearance",interface:"Interface",data:"Data",
   themeTitle:"Site theme",themeHelp:"System mode follows your device's appearance.",system:"System",light:"Light",dark:"Dark",
   pinkNote:"The Femboy language uses a pink-and-black palette in every theme mode.",
   motionTitle:"Animations",motionHelp:"Compare smooth motion and instant transitions.",motionPreviewOn:"Smooth animation",motionPreviewOff:"No animation",privacyTitle:"Privacy mode",privacyHelp:"Blur sensitive text while sharing your screen.",privacyOn:"Hide sensitive details",waterTitle:"Liquid Glass experiment",waterHelp:"Animated glossy droplets on selected cards.",waterOn:"Show flowing glass highlights",toolsTitle:"New tools",toolsHelp:"Custom dashboard, code editor and LAB.",widgetLink:"Customize widgets",editorLink:"Code editor",motionSystem:"System",motionReduce:"Reduced motion",
   densityTitle:"Catalog density",densityHelp:"Compact mode reduces spacing and card height.",comfortable:"Comfortable",compact:"Compact",
   fontTitle:"Text size",fontHelp:"Larger text in main sections without zooming the whole page.",normal:"Normal",large:"Larger",
   contrastTitle:"Contrast",contrastHelp:"Stronger borders and secondary text.",contrastNormal:"Normal",contrastHigh:"High contrast",
   languageTitle:"Interface language",languageHelp:"Switching language reloads the page, including translated checkout.",language:"Language",
   startTitle:"Start page",startHelp:"Choose the default section for visits to the VIONA home page.",home:"Home",catalog:"Catalog",
   badgeTitle:"Notification indicator",badgeHelp:"Only hides the unread dot. VIONA ID messages are unaffected.",badgeOn:"Show unread notification dot",
   storedTitle:"My local data",storedHelp:"Preferences, favorites and cart stay in this browser. Server-side payments and account records are unaffected.",
   exportTitle:"Download a copy",exportHelp:"Export your preferences, favorites and cart as JSON.",export:"Export",
   clearTitle:"Clear favorites and cart",clearHelp:"Removes only local lists on this device.",clear:"Clear lists",
   resetTitle:"Reset interface preferences",resetHelp:"Restores system theme, default text, contrast and animations. Language is preserved.",reset:"Reset",
   saved:"Saved on this device",exported:"Settings file created",cleared:"Lists cleared",resetDone:"Interface settings reset",
   clearConfirm:"Clear favorites and cart in this browser? Server-side orders and payments are unchanged.",
   resetConfirm:"Reset local appearance and interface preferences?",
   dataError:"This action could not be completed in your browser.",
   note:"VIONA doesn't sync these preferences between devices.",tabHint:"Settings section"
  },
  de:{
   title:"Einstellungen",profileLink:"Profileinstellungen",profileCaption:"Design, Komfort und Privatsphäre",eyebrow:"VIONA ID / EINSTELLUNGEN",
   subtitle:"Passe VIONA an dich an. Diese Einstellungen bleiben nur in diesem Browser.",
   close:"Einstellungen schließen",appearance:"Design",interface:"Oberfläche",data:"Daten",
   themeTitle:"Designmodus",themeHelp:"Im Systemmodus richtet sich die Farbe nach deinem Gerät.",system:"System",light:"Hell",dark:"Dunkel",
   pinkNote:"Die Femboy-Sprache verwendet unabhängig vom Designmodus Rosa und Schwarz.",
   motionTitle:"Animationen",motionHelp:"Animierte und sofortige Übergänge vergleichen.",motionPreviewOn:"Flüssig",motionPreviewOff:"Ohne Animation",privacyTitle:"Privatmodus",privacyHelp:"Persönliche Daten auf dem Bildschirm weichzeichnen.",privacyOn:"Private Daten verbergen",waterTitle:"Liquid Glass Experiment",waterHelp:"Glänzende Tropfen an ausgewählten Karten.",waterOn:"Glaseffekt anzeigen",toolsTitle:"Neue Werkzeuge",toolsHelp:"Profil-Widgets, Editor und LAB.",widgetLink:"Widgets anpassen",editorLink:"Code-Editor",motionSystem:"System",motionReduce:"Weniger Bewegung",
   densityTitle:"Katalogdichte",densityHelp:"Kompakte Karten und kleinere Abstände.",comfortable:"Normal",compact:"Kompakt",
   fontTitle:"Schriftgröße",fontHelp:"Größerer Text in wichtigen Bereichen.",normal:"Normal",large:"Größer",
   contrastTitle:"Kontrast",contrastHelp:"Deutlichere Ränder und Hinweise.",contrastNormal:"Normal",contrastHigh:"Hoch",
   languageTitle:"Sprache",languageHelp:"Bei Sprachwechsel lädt die Seite inklusive Kasse neu.",language:"Sprache",
   startTitle:"Startbereich",startHelp:"Standardbereich beim Öffnen der Startseite.",home:"Startseite",catalog:"Katalog",
   badgeTitle:"Benachrichtigungspunkt",badgeHelp:"Blendet nur den Hinweis aus; Nachrichten bleiben erhalten.",badgeOn:"Punkt für neue Nachrichten anzeigen",
   storedTitle:"Lokale Daten",storedHelp:"Einstellungen, Favoriten und Warenkorb bleiben im Browser. Bestellungen und Zahlungen sind nicht betroffen.",
   exportTitle:"Kopie herunterladen",exportHelp:"Einstellungen und lokale Listen als JSON speichern.",export:"Exportieren",
   clearTitle:"Favoriten und Warenkorb leeren",clearHelp:"Löscht nur lokale Listen.",clear:"Listen leeren",
   resetTitle:"Oberfläche zurücksetzen",resetHelp:"Setzt Design, Schrift, Kontrast und Animationen zurück. Sprache bleibt bestehen.",reset:"Zurücksetzen",
   saved:"Auf diesem Gerät gespeichert",exported:"Datei erstellt",cleared:"Listen geleert",resetDone:"Oberfläche zurückgesetzt",
   clearConfirm:"Lokale Favoriten und Warenkorb löschen? Konto und Zahlungen bleiben unverändert.",
   resetConfirm:"Lokale Einstellungen zurücksetzen?",dataError:"Aktion fehlgeschlagen.",note:"VIONA synchronisiert diese Einstellungen nicht zwischen Geräten.",tabHint:"Einstellungen"
  },
  ja:{
   title:"設定",profileLink:"プロフィール設定",profileCaption:"外観、使いやすさ、プライバシー",eyebrow:"VIONA ID / 設定",
   subtitle:"VIONAを使いやすく調整できます。設定はこのブラウザーに保存されます。",
   close:"設定を閉じる",appearance:"外観",interface:"表示と操作",data:"データ",
   themeTitle:"テーマ",themeHelp:"システム設定に合わせて自動で切り替えます。",system:"システム",light:"ライト",dark:"ダーク",
   pinkNote:"フェムボーイ言語では常にピンクと黒の配色になります。",
   motionTitle:"アニメーション",motionHelp:"動きありと動きなしの違いを表示します。",motionPreviewOn:"なめらか",motionPreviewOff:"アニメーションなし",privacyTitle:"プライバシーモード",privacyHelp:"画面上の個人情報をぼかします。",privacyOn:"個人情報を隠す",waterTitle:"リキッドグラス実験",waterHelp:"カードの縁に流れる光沢のある水滴。",waterOn:"液体の光沢を表示",toolsTitle:"新しいツール",toolsHelp:"ウィジェット、エディター、LAB。",widgetLink:"ウィジェット",editorLink:"コードエディター",motionSystem:"システム",motionReduce:"動きを減らす",
   densityTitle:"カードの密度",densityHelp:"カードと余白をコンパクトにします。",comfortable:"標準",compact:"コンパクト",
   fontTitle:"文字サイズ",fontHelp:"主な画面の文字を大きくします。",normal:"標準",large:"大きめ",
   contrastTitle:"コントラスト",contrastHelp:"境界線と補助テキストを見やすくします。",contrastNormal:"標準",contrastHigh:"高コントラスト",
   languageTitle:"表示言語",languageHelp:"言語の変更でページが再読み込みされます。",language:"言語",
   startTitle:"初期画面",startHelp:"ホームページを開いたときの表示セクションです。",home:"ホーム",catalog:"カタログ",
   badgeTitle:"通知の印",badgeHelp:"未読の点だけを非表示にします。メッセージは残ります。",badgeOn:"未読マークを表示する",
   storedTitle:"ローカルデータ",storedHelp:"設定、お気に入り、カートはブラウザー内にあります。サーバーの注文や決済情報は削除しません。",
   exportTitle:"コピーを保存",exportHelp:"設定とローカルのリストをJSONで保存します。",export:"エクスポート",
   clearTitle:"お気に入りとカートを消去",clearHelp:"この端末のリストだけを削除します。",clear:"消去",
   resetTitle:"画面設定をリセット",resetHelp:"テーマや文字、アニメーションを標準に戻します。言語は保持します。",reset:"リセット",
   saved:"この端末に保存しました",exported:"ファイルを作成しました",cleared:"リストを削除しました",resetDone:"表示設定を戻しました",
   clearConfirm:"このブラウザーのお気に入りとカートを削除しますか？注文や決済は残ります。",
   resetConfirm:"ローカルの画面設定をリセットしますか？",dataError:"操作できませんでした。",note:"VIONAの設定は端末間で同期されません。",tabHint:"設定"
  },
  femboy:{
   title:"Настроечки ♡",profileLink:"Мои настройки ♡",profileCaption:"Темы, комфорт и приватность ♡",eyebrow:"VIONA ID / MY SPACE ♡",
   subtitle:"Сделай VIONA удобной для себя. Всё сохраняется на этом устройстве ♡",
   close:"Закрыть настройки",appearance:"Оформление ♡",interface:"Интерфейс ♡",data:"Мои данные",
   themeTitle:"Тема сайта ♡",themeHelp:"Можно следовать системе или выбрать светлую/тёмную тему.",system:"Как в системе",light:"Светлая",dark:"Тёмная",
   pinkNote:"Розово-чёрные оттенки остаются с этим языком всегда ♡",
   motionTitle:"Анимации ♡",motionPreviewOn:"Плавненько ♡",motionPreviewOff:"Без движения",privacyTitle:"Приватность ♡",privacyOn:"Скрыть личное ♡",waterTitle:"Глянцевая водичка ♡",waterOn:"Включить глянец ♡",toolsTitle:"Мои инструменты ♡",densityTitle:"Карточки ♡",fontTitle:"Текст ♡",contrastTitle:"Контраст ♡",
   languageTitle:"Мой язык ♡",badgeTitle:"Уведомления ♡",storedTitle:"Мои данные ♡",
   saved:"Сохранилось ♡",exported:"Файлик готов ♡",cleared:"Списки очищены ♡",resetDone:"Настройки сброшены ♡"
  }
 };
 const lang=()=>{const v=root.dataset.world||"ru";return translations[v]?v:"ru"};
 const copy=()=>({...translations.ru,...translations[lang()]});
 const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const safeStore=(key)=>{try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}};
 function read(){
  const stored=safeStore(KEY);
  const obj=stored&&typeof stored==="object"&&!Array.isArray(stored)?stored:{};
  const value={...defaults};
  for(const k of Object.keys(choices))if(choices[k].includes(obj[k]))value[k]=obj[k];
  if(typeof obj.badge==="boolean")value.badge=obj.badge;
  if(typeof obj.privacy==="boolean")value.privacy=obj.privacy;
  if(typeof obj.water==="boolean")value.water=obj.water;
  return value;
 }
 let prefs=read();
 function persist(){
  try{localStorage.setItem(KEY,JSON.stringify(prefs));return true}catch{return false}
 }
 function apply(){
  root.dataset.prefMotion=prefs.motion;
  root.dataset.prefDensity=prefs.density;
  root.dataset.prefFont=prefs.font;
  root.dataset.prefContrast=prefs.contrast;
  root.dataset.prefBadge=prefs.badge?"on":"off";
  root.dataset.vionaPrivate=prefs.privacy?"on":"off";
  root.classList.toggle("vst-privacy-active",prefs.privacy);
  root.dataset.prefWater=prefs.water?"on":"off";
  root.dataset.prefStart=prefs.start;
 }
 apply();
 const themeOptions=[["auto","system"],["light","light"],["dark","dark"]];
 const langOptions=[["ru","Русский"],["en","English"],["ja","日本語"],["de","Deutsch"],["femboy","♡ Femboy"]];
 const group=(text,detail,controls,icon)=>'<section class="vs-group"><div class="vs-group-head"><span class="vs-group-icon" aria-hidden="true">'+icon+'</span><div><h3>'+escape(text)+'</h3><p>'+escape(detail)+'</p></div></div>'+controls+'</section>';
 const segmented=(name,items,current)=>'<div class="vs-segments" role="group" aria-label="'+escape(name)+'">'+items.map(item=>'<button type="button" class="vs-segment" data-settings-'+escape(name)+'="'+escape(item[0])+'" aria-pressed="'+(item[0]===current)+'">'+escape(item[1])+'</button>').join("")+'</div>';
 function create(){
  const l=copy();
  const theme=window.VionaTheme?.current?.()||"auto";
  const motionPreview='<div class="vs-motion-preview" aria-label="'+escape(l.motionTitle)+'">'+
    [['system',l.motionSystem,l.motionPreviewOn||'Плавные переходы','animated'],['reduce',l.motionReduce,l.motionPreviewOff||'Мгновенно','static']].map(([value,label,description,mode])=>
     '<button type="button" class="vs-preview-card" data-preview="'+mode+'" data-settings-motion="'+value+'" aria-pressed="'+(prefs.motion===value)+'">'+
     '<span class="vs-preview-demo" aria-hidden="true"><span class="vs-preview-line"></span><span class="vs-preview-line short"></span><span class="vs-preview-switch"></span></span>'+
     '<strong>'+escape(label)+'</strong><small>'+escape(description)+'</small></button>').join("")+'</div>';
   const motion=motionPreview+segmented("motion",[["system",l.motionSystem],["reduce",l.motionReduce]],prefs.motion);
  const density=segmented("density",[["comfortable",l.comfortable],["compact",l.compact]],prefs.density);
  const font=segmented("font",[["normal",l.normal],["large",l.large]],prefs.font);
  const contrast=segmented("contrast",[["normal",l.contrastNormal],["high",l.contrastHigh]],prefs.contrast);
  const start=segmented("start",[["home",l.home],["catalog",l.catalog]],prefs.start);
  const themeRow='<div class="vs-segments" role="group" aria-label="'+escape(l.themeTitle)+'">'+themeOptions.map(([value,key])=>'<button type="button" class="vs-segment" data-settings-theme="'+value+'" aria-pressed="'+(value===theme)+'">'+escape(l[key])+'</button>').join("")+'</div>';
  const current=lang();
  const languageSelect='<label class="vs-select-wrap"><span class="vs-sr">'+escape(l.language)+'</span><select id="vionaSettingsLanguage" aria-label="'+escape(l.language)+'">'+langOptions.map(([value,label])=>'<option value="'+value+'"'+(value===current?" selected":"")+'>'+escape(label)+'</option>').join("")+'</select></label>';
  const badge='<label class="vs-switch"><input id="vionaSettingsBadge" type="checkbox"'+(prefs.badge?" checked":"")+'><span class="vs-switch-track" aria-hidden="true"></span><span>'+escape(l.badgeOn)+'</span></label>';
  const appearance=group(l.themeTitle,l.themeHelp,themeRow+"<p class='vs-note'>"+escape(l.pinkNote)+"</p>","◐")+
   group(l.motionTitle,l.motionHelp,motion,"✦")+
   group(l.densityTitle,l.densityHelp,density,"▦")+
   group(l.fontTitle,l.fontHelp,font,"Aa")+
   group(l.contrastTitle,l.contrastHelp,contrast,"◑");
  const privateSwitch='<label class="vs-switch"><input id="vionaSettingsPrivacy" type="checkbox"'+(prefs.privacy?" checked":"")+'><span class="vs-switch-track" aria-hidden="true"></span><span>'+escape(l.privacyOn||'Скрывать личные данные на экране')+'</span></label>';
   const waterSwitch='<label class="vs-switch"><input id="vionaSettingsWater" type="checkbox"'+(prefs.water?" checked":"")+'><span class="vs-switch-track" aria-hidden="true"></span><span>'+escape(l.waterOn||'Стеклянные потёки на избранных карточках')+'</span></label>';
   const experimentLinks='<div class="vs-extra-links"><a class="vs-action" href="/studio?view=dashboard">'+escape(l.widgetLink||'Мой профиль / виджеты')+' ↗</a><a class="vs-action" href="/studio?view=editor">'+escape(l.editorLink||'Редактор кода')+' ↗</a><a class="vs-action" href="/studio?view=lab">VIONA LAB ↗</a></div>';
   const general=group(l.languageTitle,l.languageHelp,languageSelect,"◎")+
   group(l.startTitle,l.startHelp,start,"⌂")+
   group(l.badgeTitle,l.badgeHelp,badge,"◉")+
    group(l.privacyTitle||"Приватный режим",l.privacyHelp||"Скрывает персональные данные на экране, не удаляя их.",privateSwitch,"◌")+
    group(l.toolsTitle||"Персонализация VIONA",l.toolsHelp||"Рабочие пространства, виджеты и редактор кода.",experimentLinks,"▦")+
    group(l.waterTitle||"Эксперимент: жидкий глянец",l.waterHelp||"Включает декоративные потёки воды по краям некоторых карточек.",waterSwitch,"◈");
  const data=group(l.exportTitle,l.exportHelp,'<button class="vs-action" type="button" data-settings-command="export">'+escape(l.export)+' <span aria-hidden="true">↓</span></button>',"↓")+
   group(l.clearTitle,l.clearHelp,'<button class="vs-action vs-danger" type="button" data-settings-command="clear">'+escape(l.clear)+'</button>',"⌫")+
   group(l.resetTitle,l.resetHelp,'<button class="vs-action" type="button" data-settings-command="reset">'+escape(l.reset)+'</button>',"↺");
  return '<div class="vs-scrim" data-settings-dismiss></div><section class="vs-dialog" role="dialog" aria-modal="true" aria-labelledby="vionaSettingsTitle" aria-describedby="vionaSettingsSubtitle" tabindex="-1">'+
   '<header class="vs-header"><div><small>'+escape(l.eyebrow)+'</small><h2 id="vionaSettingsTitle">'+escape(l.title)+'</h2><p id="vionaSettingsSubtitle">'+escape(l.subtitle)+'</p></div><button type="button" class="vs-close" aria-label="'+escape(l.close)+'" data-settings-dismiss>×</button></header>'+
   '<div class="vs-frame"><nav class="vs-tabs" role="tablist" aria-label="'+escape(l.tabHint)+'">'+
   [["appearance",l.appearance,"◐"],["interface",l.interface,"⚙"],["data",l.data,"▤"]].map(([id,title,icon],i)=>'<button type="button" role="tab" id="vsTab-'+id+'" data-settings-tab="'+id+'" aria-controls="vsPanel-'+id+'" aria-selected="'+(i===0)+'" tabindex="'+(i===0?"0":"-1")+'"><span aria-hidden="true">'+icon+'</span>'+escape(title)+'</button>').join("")+
   '</nav><div class="vs-panels">'+
   '<section id="vsPanel-appearance" role="tabpanel" aria-labelledby="vsTab-appearance">'+appearance+'</section>'+
   '<section id="vsPanel-interface" role="tabpanel" aria-labelledby="vsTab-interface" hidden>'+general+'</section>'+
   '<section id="vsPanel-data" role="tabpanel" aria-labelledby="vsTab-data" hidden><p class="vs-data-intro">'+escape(l.storedHelp)+'</p>'+data+'</section>'+
   '</div></div><footer class="vs-footer"><span>'+escape(l.note)+'</span><p id="vionaSettingsStatus" aria-live="polite" role="status"></p></footer></section>';
 }
 let overlay=null,priorFocus=null,restore=[],previousOverflow="",opened=false,currentTab="appearance";
 function activateTab(id,focus=false){
  if(!opened||!["appearance","interface","data"].includes(id))return;
  currentTab=id;
  for(const b of overlay.querySelectorAll("[data-settings-tab]")){
   const active=b.dataset.settingsTab===id;b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;
   if(active&&focus)b.focus();
  }
  for(const section of overlay.querySelectorAll('[role="tabpanel"]'))section.hidden=section.id!=="vsPanel-"+id;
 }
 function status(message){const s=overlay?.querySelector("#vionaSettingsStatus");if(s)s.textContent=message}
 function open(){
  if(opened)return;
  priorFocus=document.activeElement;previousOverflow=document.body.style.overflow;
  overlay=document.createElement("div");overlay.id="vionaSettingsOverlay";overlay.className="vs-overlay";overlay.innerHTML=create();
  document.body.append(overlay);opened=true;document.body.style.overflow="hidden";
  restore=[];
  for(const id of ["v15Dialog","v16Workspace"]){
   const el=document.getElementById(id);
   if(el && el.getClientRects().length && !el.hidden){
    restore.push({el,inert:el.inert,aria:el.getAttribute("aria-hidden")});
    el.inert=true;el.setAttribute("aria-hidden","true");
   }
  }
  activateTab("appearance");overlay.querySelector(".vs-close")?.focus();
 }
 function close(){
  if(!opened)return;
  opened=false;overlay.remove();overlay=null;document.body.style.overflow=previousOverflow;
  for(const entry of restore){entry.el.inert=entry.inert;if(entry.aria===null)entry.el.removeAttribute("aria-hidden");else entry.el.setAttribute("aria-hidden",entry.aria)}
  restore=[];if(priorFocus?.isConnected && !priorFocus.closest("[inert]"))priorFocus.focus({preventScroll:true});
 }
 function savePref(name,value){
  if(!choices[name]?.includes(value))return;
  prefs[name]=value;
  if(!persist()){status(copy().dataError);return}
  apply();
  for(const b of overlay.querySelectorAll("[data-settings-"+name+"]"))b.setAttribute("aria-pressed",String(b.getAttribute("data-settings-"+name)===value));
  status(copy().saved);
 }
 function exportData(){
  const publicProfile=safeStore("viona-id-local-v15");
  const collection=safeStore("viona-halloween-v1");
  const exportObj={
   version:1,exportedAt:new Date().toISOString(),notice:"Local browser preferences only. No account records or payment credentials.",
   theme:window.VionaTheme?.current?.()||"auto",
   language:lang(),preferences:prefs,
   nickname:typeof publicProfile?.nick==="string"?publicProfile.nick.slice(0,32):"",
   favorites:Array.isArray(collection?.favorites)?collection.favorites.map(String):[],
   cart:Array.isArray(collection?.cart)?collection.cart.map(String):[]
  };
  const content=new Blob([JSON.stringify(exportObj,null,2)],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(content),link=document.createElement("a");
  link.href=url;link.download="viona-local-preferences.json";document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  status(copy().exported);
 }
 function clearLists(){
  if(!window.confirm(copy().clearConfirm))return;
  try{localStorage.removeItem("viona-halloween-v1");status(copy().cleared);close();location.reload()}catch{status(copy().dataError)}
 }
 function reset(){
  if(!window.confirm(copy().resetConfirm))return;
  prefs={...defaults};if(!persist()){status(copy().dataError);return}
  window.VionaTheme?.choose?.("auto");
  apply();const tab=currentTab;
  overlay.querySelector(".vs-dialog").parentElement.innerHTML=create();
  activateTab(tab);status(copy().resetDone);
 }
 const languageChange=target=>{
  if(!langOptions.some(a=>a[0]===target)||target===lang())return;
  try{
   localStorage.setItem("viona-world",JSON.stringify(target));
   localStorage.setItem("viona-language-v18",JSON.stringify(target));
   document.cookie="viona_language="+encodeURIComponent(target)+"; Max-Age=31536000; Path=/; SameSite=Lax; Secure";
   location.reload();
  }catch{status(copy().dataError)}
 };
 function chooseTheme(value){
  if(!themeOptions.some(x=>x[0]===value))return;
  window.VionaTheme?.choose?.(value);
  for(const b of overlay.querySelectorAll("[data-settings-theme]"))b.setAttribute("aria-pressed",String(b.dataset.settingsTheme===value));
  status(copy().saved);
 }
 document.addEventListener("click",e=>{
  const button=e.target.closest(".viona-settings-entry");if(button){e.preventDefault();open();return}
  if(!opened||!overlay?.contains(e.target))return;
  if(e.target.closest("[data-settings-dismiss]")){close();return}
  const tab=e.target.closest("[data-settings-tab]");if(tab){activateTab(tab.dataset.settingsTab,true);return}
  const theme=e.target.closest("[data-settings-theme]");if(theme){chooseTheme(theme.dataset.settingsTheme);return}
  for(const type of Object.keys(choices)){
   const b=e.target.closest("[data-settings-"+type+"]");if(b){savePref(type,b.getAttribute("data-settings-"+type));return}
  }
  const cmd=e.target.closest("[data-settings-command]");
  if(cmd){
   if(cmd.dataset.settingsCommand==="export")try{exportData()}catch{status(copy().dataError)}
   if(cmd.dataset.settingsCommand==="clear")clearLists();
   if(cmd.dataset.settingsCommand==="reset")reset();
  }
 });
 document.addEventListener("change",e=>{
  if(!opened||!overlay?.contains(e.target))return;
  if(e.target.id==="vionaSettingsLanguage")languageChange(e.target.value);
  if(e.target.id==="vionaSettingsPrivacy"){prefs.privacy=e.target.checked;persist();apply();status(copy().saved)}
   if(e.target.id==="vionaSettingsWater"){prefs.water=e.target.checked;persist();apply();status(copy().saved)}
   if(e.target.id==="vionaSettingsBadge"){
   prefs.badge=e.target.checked;persist();apply();status(copy().saved);
  }
 });
 document.addEventListener("keydown",e=>{
  if(!opened)return;
  if(e.key==="Escape"){e.preventDefault();e.stopImmediatePropagation();close();return}
  const tabs=[...overlay.querySelectorAll("[data-settings-tab]")];
  if((e.key==="ArrowRight"||e.key==="ArrowLeft")&&tabs.includes(document.activeElement)){
   e.preventDefault();e.stopImmediatePropagation();
   const next=(tabs.indexOf(document.activeElement)+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;
   activateTab(tabs[next].dataset.settingsTab,true);return;
  }
  if(e.key!=="Tab")return;
  e.stopImmediatePropagation();
  const focusable=[...overlay.querySelectorAll("button:not([disabled]),select:not([disabled]),input:not([disabled]),a[href]")].filter(el=>el.getClientRects().length&&!el.closest("[hidden]")&&el.tabIndex>=0);
  if(!focusable.length){e.preventDefault();overlay.querySelector(".vs-dialog").focus();return}
  const first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey&&(document.activeElement===first||!overlay.contains(document.activeElement))){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&(document.activeElement===last||!overlay.contains(document.activeElement))){e.preventDefault();first.focus()}
 },true);
 function addButton(container,id,after){
  if(!container||container.querySelector("#"+id))return;
  const l=copy(),button=document.createElement("button");
  button.type="button";button.id=id;button.className="viona-settings-entry";
  button.setAttribute("aria-haspopup","dialog");
  button.innerHTML='<span class="vs-entry-icon" aria-hidden="true">⚙</span><span class="vs-entry-text"><strong>'+escape(l.profileLink)+'</strong><small>'+escape(l.profileCaption)+'</small></span><span class="vs-entry-chevron" aria-hidden="true">›</span>';
  if(after)after.after(button);else container.append(button);
 }
 function inject(){
  const localForm=document.querySelector("#v15Content #v15ProfileForm");
  if(localForm)addButton(localForm.parentElement,"vionaSettingsEntryLocal",localForm);
  const account=document.querySelector("#v16WorkspaceBody .v16-account");
  if(account)addButton(account.parentElement,"vionaSettingsEntryAccount",account);
 }
 function startDefault(){
  if(prefs.start!=="catalog"||location.pathname!=="/"||location.hash||window.history.state)return;
  const target=document.getElementById("catalog");
  if(target)requestAnimationFrame(()=>{if(!location.hash)target.scrollIntoView({block:"start",behavior:"instant"})});
 }
 function boot(){
  inject();
  new MutationObserver(inject).observe(document.body,{childList:true,subtree:true});
  startDefault();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
 window.VionaSettings={open,close,current:()=>({...prefs})};
})();