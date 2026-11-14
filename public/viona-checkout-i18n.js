"use strict";
/* Checkout i18n: all static text and asynchronous status messages, without changing payment URLs. */
(()=>{
 const base={
  "VIONA / NIGHT CHECKOUT":"brand","Оформи":"titleA","по-своему.":"titleB",
  "Выбери способ оплаты, а потом наблюдай за своим заказом в VIONA ID.":"lead",
  "Способ оплаты":"paymentMethod","Банк":"bank","Результат":"result",
  "Т-Банк · DEMO":"bankDemo","Банковская карта":"bankCard",
  "Visa, Mastercard, Мир · защищённая страница банка":"cardDesc",
  "СБП по QR-коду":"sbp","Оплата через приложение любого поддерживаемого банка":"sbpDesc",
  "Оплата через СберБанк Онлайн · без реквизитов карты":"sberDesc",
  "Сохранённые карты":"savedCards","Привязаны к твоему VIONA ID":"cardsAccount",
  "Обновить":"refresh","Загружаем карты…":"loadingCards",
  "Загружаем сохранённые карты…":"loadingCards","Карты отображаются для удобства. Оплату в один клик подключим после тестирования.":"walletFoot",
  "Сохранить новую карту":"saveCard","По желанию. Банк сохранит данные для будущих покупок.":"saveCardDesc",
  "Данные карты и CVV вводятся только у Т-Банка — не на сайте VIONA.":"security",
  "Оплата SberPay":"sberTitle",
  "На компьютере Сбер отправит подтверждение в приложение по номеру телефона. На смартфоне откроем СберБанк Онлайн, если это поддерживается.":"sberGuide",
  "Номер телефона, привязанный к СберБанк Онлайн":"sberPhone",
  "Номер телефона для SberPay":"sberPhoneAria",
  "Продолжить через SberPay ↗":"sberStart",
  "Перейти на форму Т-Банка и выбрать SberPay ↗":"sberFallbackLink",
  "Оплата через СБП":"sbpTitle","QR-код для тестовой оплаты через СБП":"qrAlt",
  "Открыть в приложении банка ↗":"qrLink","Ожидаем подтверждение оплаты…":"qrWaiting",
  "Нужно обсудить заказ?":"talk","Оставить заявку ↗":"leaveRequest",
  "Ваш заказ":"yourOrder","ТВОЙ ЗАКАЗ":"yourOrder","К оплате":"toPay",
  "Тестовая оплата":"demoPayment","Реальные деньги не списываются":"noCharge",
  "Создаём тестовый платёж…":"creatingPayment","Создаём тестовый QR СБП…":"creatingQr",
  "Ошибка оплаты":"paymentError","Ошибка СБП":"sbpError",
  "Банк не вернул QR":"qrMissing",
  "Откройте ссылку или отсканируйте QR-код банковским приложением.":"qrHow",
  "Тестовая оплата подтверждена ✓":"confirmed",
  "Банк авторизовал платёж. Ожидаем подтверждения списания…":"authorized",
  "Банк авторизовал платёж. Ожидаем окончательного подтверждения…":"authorized",
  "Оплата не прошла":"failed",
  "Банк сообщил об отказе. Попробуй другой способ оплаты.":"declined",
  "Укажи номер телефона, привязанный к СберБанк Онлайн. Номер не сохраняется на VIONA.":"phonePrompt",
  "Введи номер в международном формате, например +79990000000.":"phoneInvalid",
  "Создаём тестовый платёж SberPay…":"creatingSber",
  "Не удалось запустить SberPay.":"startFailed",
  "Банк вернул неизвестный адрес SberPay.":"untrustedSber",
  "Переходим к оплате в СберБанк Онлайн…":"redirectSber",
  "Запрос отправлен в СберБанк Онлайн. Открой приложение и подтверди тестовый платёж.":"sberPush",
  "Прямой запуск SberPay не поддерживается этим тестовым терминалом. Открой форму Т-Банка; SberPay будет доступен только если банк предложит этот способ.":"sberUnavailable",
  "Не удалось получить безопасную ссылку SberPay.":"unsafeLink",
  "Войди через Telegram, чтобы увидеть свои карты.":"needLogin",
  "Не удалось получить список карт":"cardsError",
  "Карты пока не найдены. Если ты сохранил карту, обнови список после оплаты.":"cardsNotFound",
  "Пока нет сохранённых карт. При оплате отметь «Сохранить новую карту».":"cardsEmpty",
  "Сохранена через Т-Банк":"savedTbank","Сохранена":"saved",
  "Карта ····":"cardNumber","Не удалось загрузить карты. Нажми «Обновить».":"cardsLoadError",
  "Демо-режим: заявка не сохранена. Нужна база данных.":"requestDemo",
  "Тестовый эквайринг пока не настроен.":"notConfigured",
  "Войдите через Telegram для тестовой оплаты.":"authRequired",
  "Не удалось создать тестовый платёж.":"paymentUnreachable",
  "Банк не создал тестовый платёж.":"bankInitFailed",
  "Не удалось сохранить заявку.":"requestSaveError",
  "шт.":"pieces"
 };
 const locales={
 ru:{brand:"VIONA / ОФОРМЛЕНИЕ ЗАКАЗА",sberUnavailable:"Прямой запуск SberPay не поддерживается этим тестовым терминалом. Открой форму Т-Банка; SberPay будет доступен только если банк предложит этот способ."},
 en:{brand:"VIONA / CHECKOUT",titleA:"Checkout",titleB:"your way.",lead:"Choose a payment method, then track your order in VIONA ID.",paymentMethod:"Payment method",bank:"Bank",result:"Result",bankDemo:"T-Bank · DEMO",bankCard:"Bank card",cardDesc:"Visa, Mastercard, Mir · secure bank checkout",sbp:"SBP by QR code",sbpDesc:"Pay using any supported banking app",sberDesc:"Pay through SberBank Online without entering your card details",savedCards:"Saved cards",cardsAccount:"Linked to your VIONA ID",refresh:"Refresh",loadingCards:"Loading saved cards…",walletFoot:"Saved cards are shown for convenience. One-click payment will be available after testing.",saveCard:"Save new card",saveCardDesc:"Optional. Your bank stores the details for future purchases.",security:"Enter card details and CVV only on T-Bank's website, never on VIONA.",sberTitle:"SberPay payment",sberGuide:"On desktop, SberBank may send confirmation to the app linked to your phone. On mobile, the banking app may open if supported.",sberPhone:"Phone number linked to SberBank Online",sberPhoneAria:"Phone number for SberPay",sberStart:"Continue with SberPay ↗",sberFallbackLink:"Open T-Bank checkout to look for SberPay ↗",sbpTitle:"Pay with SBP",qrAlt:"QR code for test SBP payment",qrLink:"Open banking app ↗",qrWaiting:"Waiting for payment confirmation…",talk:"Need to discuss your order?",leaveRequest:"Send a request ↗",yourOrder:"YOUR ORDER",toPay:"Total due",demoPayment:"Test payment",noCharge:"No real money will be charged",creatingPayment:"Creating test payment…",creatingQr:"Creating test SBP QR…",paymentError:"Payment error",sbpError:"SBP error",qrMissing:"The bank did not return a QR code",qrHow:"Open the link or scan the QR code in your banking app.",confirmed:"Test payment confirmed ✓",authorized:"Bank authorization received. Awaiting final confirmation…",failed:"Payment failed",declined:"The bank declined this payment. Try another method.",phonePrompt:"Enter the phone number linked to SberBank Online. VIONA does not store it.",phoneInvalid:"Enter a full international number, for example +79990000000.",creatingSber:"Creating a test SberPay payment…",startFailed:"Could not launch SberPay.",untrustedSber:"The bank returned an unrecognized SberPay URL.",redirectSber:"Opening SberBank Online…",sberPush:"Request sent to SberBank Online. Open the app to confirm this test payment.",sberUnavailable:"Direct SberPay is not supported by this test terminal. Open the T-Bank payment form; SberPay will appear only if the bank offers it.",unsafeLink:"No trusted SberPay link was received.",needLogin:"Sign in with Telegram to view saved cards.",cardsError:"Could not retrieve saved cards",cardsNotFound:"Cards not found. If you saved a card, refresh after checkout.",cardsEmpty:"No saved cards yet. Choose Save new card during checkout.",savedTbank:"Saved via T-Bank",saved:"Saved",cardNumber:"Card ····",cardsLoadError:"Could not load cards. Press Refresh.",requestDemo:"Demo mode: request not saved. Database required.",notConfigured:"Test acquiring is not configured.",authRequired:"Sign in with Telegram for test payments.",paymentUnreachable:"Could not create test payment.",bankInitFailed:"Bank could not initialize the test payment.",requestSaveError:"Could not save the request.",pieces:"items"},
 ja:{brand:"VIONA / お支払い",titleA:"お支払いは",titleB:"あなたの方法で。",lead:"決済方法を選び、VIONA ID で注文状況を確認できます。",paymentMethod:"お支払い方法",bank:"銀行",result:"結果",bankDemo:"T-Bank · デモ",bankCard:"銀行カード",cardDesc:"Visa、Mastercard、Mir · 銀行の安全な決済ページ",sbp:"SBP QRコード",sbpDesc:"対応する銀行アプリで支払います",sberDesc:"SberBank Online アプリでのお支払い",savedCards:"保存済みカード",cardsAccount:"VIONA ID に紐付け済み",refresh:"更新",loadingCards:"カードを読み込み中…",walletFoot:"保存済みカードを表示します。ワンクリック決済はテスト後に対応予定です。",saveCard:"新しいカードを保存",saveCardDesc:"任意。次回の購入のために銀行が情報を保存します。",security:"カード情報とCVVはT-Bankのサイトでのみ入力してください。",sberTitle:"SberPay 決済",sberGuide:"PCでは電話番号に紐付いたアプリで確認が必要な場合があります。スマートフォンでは対応するアプリを開きます。",sberPhone:"SberBank Online に登録した電話番号",sberPhoneAria:"SberPay の電話番号",sberStart:"SberPay で続ける ↗",sberFallbackLink:"T-Bankの決済ページを開く ↗",sbpTitle:"SBP で支払う",qrAlt:"SBPテスト決済用QRコード",qrLink:"銀行アプリで開く ↗",qrWaiting:"決済確認を待機中…",talk:"注文について相談しますか？",leaveRequest:"お問い合わせ ↗",yourOrder:"ご注文",toPay:"お支払い合計",demoPayment:"テスト決済",noCharge:"実際の料金は請求されません",creatingPayment:"テスト決済を作成中…",creatingQr:"テストQRコードを作成中…",paymentError:"決済エラー",sbpError:"SBPエラー",qrMissing:"銀行からQRコードが返されませんでした",qrHow:"リンクを開くか、銀行アプリでQRコードを読み取ってください。",confirmed:"テスト決済が確認されました ✓",authorized:"銀行で承認済み。最終確認待ち…",failed:"決済できませんでした",declined:"銀行が決済を拒否しました。別の方法をお試しください。",phonePrompt:"登録済み電話番号を入力してください。VIONAには保存されません。",phoneInvalid:"国際形式の番号を入力してください（例：+79990000000）。",creatingSber:"SberPayテスト決済を作成中…",startFailed:"SberPayを開始できません。",untrustedSber:"銀行から不明なSberPayリンクが返されました。",redirectSber:"SberBank Onlineを開いています…",sberPush:"アプリに確認依頼を送りました。テスト決済を承認してください。",sberUnavailable:"このテスト端末ではSberPayの直接起動に対応していません。T-Bankのページを開き、銀行が提供する場合のみSberPayを利用できます。",unsafeLink:"安全なSberPayリンクを取得できませんでした。",needLogin:"保存済みカードの確認にはTelegramログインが必要です。",cardsError:"カード一覧を取得できません。",cardsNotFound:"保存済みカードが見つかりません。決済後に更新してください。",cardsEmpty:"保存済みカードはありません。",savedTbank:"T-Bank経由で保存",saved:"保存済み",cardNumber:"カード ····",cardsLoadError:"カードを読み込めません。更新してください。",requestDemo:"デモモード：依頼は保存されていません。",notConfigured:"テスト決済が設定されていません。",authRequired:"テスト決済にはTelegramログインが必要です。",paymentUnreachable:"テスト決済を作成できません。",bankInitFailed:"銀行でテスト決済を開始できません。",requestSaveError:"依頼を保存できません。",pieces:"点"},
 de:{brand:"VIONA / KASSE",titleA:"Bezahlen",titleB:"auf deine Art.",lead:"Wähle eine Zahlungsart und verfolge deine Bestellung in VIONA ID.",paymentMethod:"Zahlungsart",bank:"Bank",result:"Ergebnis",bankDemo:"T-Bank · DEMO",bankCard:"Bankkarte",cardDesc:"Visa, Mastercard, Mir · sichere Bankseite",sbp:"SBP per QR-Code",sbpDesc:"Mit einer unterstützten Banking-App bezahlen",sberDesc:"Bezahlung über SberBank Online ohne Kartendaten",savedCards:"Gespeicherte Karten",cardsAccount:"Mit VIONA ID verknüpft",refresh:"Aktualisieren",loadingCards:"Karten werden geladen…",walletFoot:"Gespeicherte Karten zur Übersicht. Ein-Klick-Zahlung folgt nach den Tests.",saveCard:"Neue Karte speichern",saveCardDesc:"Optional. Die Bank speichert die Daten für spätere Zahlungen.",security:"Kartendaten und CVV nur auf der T-Bank-Seite eingeben, niemals bei VIONA.",sberTitle:"SberPay-Zahlung",sberGuide:"Am PC kann SberBank eine Bestätigung an die verknüpfte App senden. Mobil öffnet sich gegebenenfalls die Banking-App.",sberPhone:"Mit SberBank Online verknüpfte Telefonnummer",sberPhoneAria:"Telefonnummer für SberPay",sberStart:"Mit SberPay fortfahren ↗",sberFallbackLink:"T-Bank-Zahlungsseite öffnen ↗",sbpTitle:"Mit SBP bezahlen",qrAlt:"QR-Code für SBP-Testzahlung",qrLink:"Banking-App öffnen ↗",qrWaiting:"Warte auf Zahlungsbestätigung…",talk:"Fragen zur Bestellung?",leaveRequest:"Anfrage senden ↗",yourOrder:"DEINE BESTELLUNG",toPay:"Zu zahlen",demoPayment:"Testzahlung",noCharge:"Es wird kein echtes Geld abgebucht",creatingPayment:"Testzahlung wird erstellt…",creatingQr:"SBP-Test-QR wird erstellt…",paymentError:"Zahlungsfehler",sbpError:"SBP-Fehler",qrMissing:"Die Bank hat keinen QR-Code geliefert",qrHow:"Öffne den Link oder scanne den QR-Code mit deiner Banking-App.",confirmed:"Testzahlung bestätigt ✓",authorized:"Bankautorisierung erfolgt. Warte auf Bestätigung…",failed:"Zahlung fehlgeschlagen",declined:"Die Bank hat die Zahlung abgelehnt. Versuche eine andere Methode.",phonePrompt:"Gib die bei SberBank Online hinterlegte Nummer ein. VIONA speichert sie nicht.",phoneInvalid:"Gib eine Nummer im internationalen Format ein, z. B. +79990000000.",creatingSber:"SberPay-Testzahlung wird erstellt…",startFailed:"SberPay konnte nicht gestartet werden.",untrustedSber:"Die Bank hat eine unbekannte SberPay-Adresse zurückgegeben.",redirectSber:"SberBank Online wird geöffnet…",sberPush:"Bestätigung an SberBank Online gesendet. Öffne die App und bestätige die Testzahlung.",sberUnavailable:"Direktes SberPay wird von diesem Testterminal nicht unterstützt. Öffne T-Bank; SberPay ist nur verfügbar, wenn die Bank es anbietet.",unsafeLink:"Kein vertrauenswürdiger SberPay-Link erhalten.",needLogin:"Melde dich bei Telegram an, um gespeicherte Karten zu sehen.",cardsError:"Karten konnten nicht geladen werden",cardsNotFound:"Keine Karten gefunden. Nach dem Speichern bitte aktualisieren.",cardsEmpty:"Noch keine gespeicherten Karten. Beim Bezahlen kannst du eine Karte speichern.",savedTbank:"Über T-Bank gespeichert",saved:"Gespeichert",cardNumber:"Karte ····",cardsLoadError:"Karten konnten nicht geladen werden. Bitte aktualisieren.",requestDemo:"Demo-Modus: Anfrage nicht gespeichert. Datenbank erforderlich.",notConfigured:"Test-Acquiring ist nicht eingerichtet.",authRequired:"Für Testzahlungen bei Telegram anmelden.",paymentUnreachable:"Testzahlung konnte nicht erstellt werden.",bankInitFailed:"Die Bank konnte die Testzahlung nicht starten.",requestSaveError:"Anfrage konnte nicht gespeichert werden.",pieces:"Stk."},
 femboy:{brand:"VIONA / МОЯ КОРЗИНКА ♡",titleA:"Оформи",titleB:"как тебе нравится ♡",lead:"Выбирай способ оплаты и следи за заказом в VIONA ID ♡",paymentMethod:"Способ оплаты ♡",bank:"Банк",result:"Результат",bankCard:"Банковская карта ♡",savedCards:"Мои карты ♡",refresh:"Обновить ♡",talk:"Обсудить заказ? ♡",leaveRequest:"Написать нам ↗",yourOrder:"МОЯ КОРЗИНКА ♡",toPay:"Итого ♡",demoPayment:"Тестовая оплата ♡",noCharge:"Настоящие деньги не списываются ♡",sberFallbackLink:"Открыть страницу Т-Банка ↗",sberUnavailable:"В тестовом режиме прямой SberPay недоступен. На форме Т-Банка он появится, только если банк его предложит ♡",pieces:"шт."}
 };
 const locale=()=>{const l=document.documentElement.dataset.world||"ru";return locales[l]?l:"ru"};
 const words=()=>locales[locale()];
 const translation=txt=>{
  const key=base[txt];return key?(words()[key]||locales.ru[key]||txt):txt;
 };
 function translateText(node){
  if(!node||!node.nodeValue||!node.parentElement)return;
  if(["SCRIPT","STYLE","TEXTAREA"].includes(node.parentElement.tagName))return;
  const current=node.nodeValue;const trimmed=current.trim();
  if(!trimmed)return;
  const dynamic=trimmed.match(/^(\d+)\s+шт\.$/);
  const translated=dynamic?dynamic[1]+" "+(words().pieces||"шт."):translation(trimmed);
  if(translated!==trimmed)node.nodeValue=current.replace(trimmed,translated);
 }
 function apply(element){
  const checkout=element?.querySelector?.(".vx-checkout")||element?.closest?.(".vx-checkout");
  if(!checkout)return;
  const iter=document.createTreeWalker(checkout,NodeFilter.SHOW_TEXT);
  const nodes=[];while(iter.nextNode())nodes.push(iter.currentNode);
  for(const n of nodes)translateText(n);
  for(const el of checkout.querySelectorAll("[placeholder],[aria-label],[title]")){
   for(const attr of ["placeholder","aria-label","title"]){
    const value=el.getAttribute(attr);if(value){const next=translation(value.trim());if(next!==value)el.setAttribute(attr,next)}
   }
  }
  checkout.setAttribute("lang",locale()==="femboy"?"ru":locale());
 }
 const mount=()=>{
  const target=document.querySelector("#v15Content");
  if(!target)return;
  let pending=false;
  const schedule=()=>{
   if(pending)return;pending=true;
   queueMicrotask(()=>{pending=false;apply(target)});
  };
  new MutationObserver(schedule).observe(target,{childList:true,subtree:true,characterData:true});
  schedule();
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
 window.VionaCheckoutI18n={apply,translate:translation};
})();