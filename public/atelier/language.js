"use strict";
/* Four written-language translations and an optional pink Russian theme. Persisted across VIONA pages. */
(()=>{
const langKey="viona-language-v1",allowed=new Set(["ru","en","ja","de","pink","gothic"]);
const safeRead=()=>{try{const s=localStorage.getItem(langKey);return allowed.has(s)?s:"ru"}catch{return"ru"}};
let current=safeRead();
const tr={
 ru:{show:"Языки",locale:"RU",name:"Русский"},en:{show:"Language",locale:"EN",name:"English"},
 ja:{show:"言語",locale:"日本語",name:"日本語"},de:{show:"Sprache",locale:"DE",name:"Deutsch"},
 pink:{show:"Язык и настроение",locale:"♡",name:"Фембойский"},
 gothic:{show:"Язык и настроение",locale:"✦",name:"Готический"}
};
const keystrings={
 "btn.more":["Подробнее ↗","Details ↗","詳しく見る ↗","Mehr erfahren ↗"],
 "btn.bag":["Корзина","Cart","カート","Warenkorb"],
 "btn.login":["Войти в аккаунт","Sign in","ログイン","Anmelden"],
 "btn.orders":["Мои заказы ↗","My orders ↗","注文履歴 ↗","Meine Bestellungen ↗"],
 "btn.logout":["Выйти","Sign out","ログアウト","Abmelden"],
 "btn.add":["Добавить в корзину ↗","Add to cart ↗","カートに追加 ↗","Zum Warenkorb ↗"],
 "btn.pay":["Перейти к оплате ↗","Proceed to payment ↗","支払いへ ↗","Zur Zahlung ↗"],
 "btn.music":["Оформить музыкальную заявку ↗","Request a music track ↗","楽曲を依頼する ↗","Musik anfragen ↗"],
 "cart.title":["Твоя корзина","Your cart","カート","Dein Warenkorb"],
 "cart.empty":["Пока пусто. Выбери товар в каталоге.","Your cart is empty. Choose an item.","カートは空です。商品を選択してください。","Dein Warenkorb ist leer. Wähle ein Produkt."],
 "cart.total":["Итого","Total","合計","Gesamt"],
 "details.what":["Что это","What is it?","どんな商品？","Was ist das?"],
 "details.works":["Как это работает","How it works","仕組み","So funktioniert es"],
 "details.includes":["Что входит","What's included","内容","Enthalten"],
 "details.best":["Кому подойдёт","Who it's for","おすすめの対象","Für wen geeignet"],
 "details.note":["Важные условия","Important notes","注意事項","Wichtige Hinweise"],
 "details.price":["Цена","Price","価格","Preis"],
 "details.category":["Категория","Category","カテゴリ","Kategorie"],
 "details.request":["По согласованию","Quote on request","要相談","Auf Anfrage"],
 "profile.hello":["Личный кабинет","Your account","マイページ","Dein Konto"],
 "profile.telegram":["Telegram подключён","Telegram connected","Telegram連携済み","Telegram verbunden"],
 "profile.name":["Имя","Name","名前","Name"],
 "profile.handle":["Ник","Username","ユーザー名","Benutzername"],
 "profile.id":["Telegram ID","Telegram ID","Telegram ID","Telegram-ID"],
 "profile.orders":["История заказов","Order history","注文履歴","Bestellverlauf"],
 "profile.files":["Файлы доступны в заказах после завершения работы.","Finished project files are available within completed orders.","完成したファイルは注文詳細からダウンロードできます。","Fertige Dateien stehen in den abgeschlossenen Bestellungen bereit."],
 "music.category":["Музыка","Music","音楽","Musik"],
 "music.price":["Индивидуальный заказ","Custom quote","お見積もり","Individuelles Angebot"],
 "checkout.demo":["Тестовая оплата","Demo payment","テスト決済","Testzahlung"],
 "checkout.contact":["Контакт","Contact","連絡先","Kontakt"],
 "checkout.brief":["Опиши задачу","Describe your project","ご希望の内容","Projektbeschreibung"],
 "checkout.method":["Способ оплаты","Payment method","支払い方法","Zahlungsmethode"],
 "checkout.card":["Банковская карта","Bank card","カード決済","Bankkarte"],
 "checkout.agree":["Я прочитал условия и политику конфиденциальности.","I have read the terms and privacy policy.","利用規約とプライバシーポリシーに同意します。","Ich habe die Bedingungen und Datenschutzhinweise gelesen."],
 "checkout.start":["Запустить тестовую оплату ↗","Start demo payment ↗","テスト決済へ ↗","Testzahlung starten ↗"],
 "checkout.tpay":["T-Pay доступен только если он включён на платёжной странице Т-Банка. Реальные деньги в тестовом режиме не списываются.","T-Pay appears only if enabled on the bank-hosted T-Bank form. Demo payments do not charge real money.","T-Payは銀行側の決済ページで有効な場合のみ利用できます。テスト決済では実際の請求はありません。","T-Pay ist nur verfügbar, wenn es in der Zahlungsseite der Bank aktiviert wurde. Testzahlungen belasten kein echtes Geld."],
 "toast.add":["Товар добавлен","Added to cart","カートに追加しました","Zum Warenkorb hinzugefügt"],
 "toast.empty":["Корзина пуста","Your cart is empty","カートは空です","Warenkorb ist leer"],
 "toast.sign":["Сначала войди через Telegram","Please sign in with Telegram","先にTelegramでログインしてください","Bitte zuerst mit Telegram anmelden"],
 "toast.exit":["Выход выполнен","Signed out","ログアウトしました","Abgemeldet"]
};
// Two invented interface dialects: distinct word choices, not color-only themes.
const personality={
 pink:{"btn.more":"Глянуть поближе ♡","btn.bag":"Корзиночка ♡","btn.login":"Войти в свой уголок ♡","btn.orders":"Мои заказики ♡","btn.logout":"Пока-пока ♡","btn.add":"В корзиночку ♡","btn.pay":"К оплате, ура ♡","btn.music":"Хочу свой трек ♡","cart.title":"Твоя корзиночка ♡","cart.empty":"Пока пустенько. Выбери что-нибудь милое ♡","cart.total":"Всё вместе","details.what":"Что это за чудо?","details.works":"Как это работает? ♡","details.includes":"Что получишь","details.best":"Кому подойдёт ♡","details.note":"Обязательно прочитай","details.price":"Стоит","details.category":"Раздел","details.request":"Обсудим лично ♡","profile.hello":"Мой уютный уголок ♡","profile.telegram":"Telegram подключён ♡","profile.name":"Твоё имя","profile.handle":"Твой ник","profile.id":"Твой Telegram ID","profile.orders":"Мои заказики ♡","profile.files":"Когда всё будет готово, файлик появится в заказе ♡","music.category":"Музычка ♡","music.price":"Особенный заказ ♡","checkout.demo":"Тестовая оплата ♡","checkout.contact":"Как с тобой связаться?","checkout.brief":"Расскажи о мечте ♡","checkout.method":"Как будем платить?","checkout.card":"Карточкой ♡","checkout.agree":"Условия прочитаны, всё хорошо ♡","checkout.start":"Открыть тестовую оплату ♡","toast.add":"Добавлено в корзиночку ♡","toast.empty":"В корзиночке пусто ♡","toast.sign":"Сначала зайди через Telegram ♡","toast.exit":"До скорого ♡"},
 gothic:{"btn.more":"Раскрыть подробности ✦","btn.bag":"Хранилище","btn.login":"Войти в профиль","btn.orders":"Архив заказов","btn.logout":"Покинуть профиль","btn.add":"Сохранить в хранилище","btn.pay":"Перейти к расчёту","btn.music":"Заказать композицию ✦","cart.title":"Хранилище заказов","cart.empty":"Хранилище пусто. Найди свой следующий проект.","cart.total":"Общая сумма","details.what":"Суть проекта","details.works":"Механика","details.includes":"Состав поставки","details.best":"Назначение","details.note":"Важное предупреждение","details.price":"Стоимость","details.category":"Категория","details.request":"По согласованию","profile.hello":"Личный архив","profile.telegram":"Соединение с Telegram установлено","profile.name":"Имя владельца","profile.handle":"Псевдоним","profile.id":"Идентификатор","profile.orders":"Архив заказов","profile.files":"Завершённые файлы хранятся в соответствующих заказах.","music.category":"Тёмное звучание","music.price":"Особый заказ","checkout.demo":"Проверка оплаты","checkout.contact":"Контакт","checkout.brief":"Техническое задание","checkout.method":"Платёжный способ","checkout.card":"Банковская карта","checkout.agree":"Условия и положения прочитаны.","checkout.start":"Открыть платёжную форму","toast.add":"Сохранено в хранилище","toast.empty":"Хранилище пусто","toast.sign":"Для доступа требуется Telegram","toast.exit":"Сеанс завершён"}
};
const t=(key,fallback="")=>{
 const personalized=personality[current]?.[key];if(personalized)return personalized;
 const v=keystrings[key];const index=({ru:0,en:1,ja:2,de:3,pink:0,gothic:0})[current];
 return v?.[index]??fallback;
};
const setLocaleCode=value=>{document.documentElement.lang=value==="ja"?"ja":value==="de"?"de":value==="en"?"en":"ru";document.documentElement.dataset.style=value==="pink"?"pink":value==="gothic"?"gothic":"default";document.documentElement.dataset.language=value;};
const home=[
 [".nav-links a:nth-child(1)","Services","サービス","Bereiche"],
 [".nav-links a:nth-child(2)","Catalog","カタログ","Katalog"],
 [".nav-links a:nth-child(4)","Artist","アーティスト","Künstler"],
 [".nav-links a:nth-child(5)","Team","チーム","Team"],
 [".eyebrow","<span class='spark'></span> DIGITAL ATELIER / VIONA 2026","<span class='spark'></span> デジタルスタジオ / VIONA 2026","<span class='spark'></span> DIGITALSTUDIO / VIONA 2026"],
 [".intro h1","Your idea.<br><span class='shimmer'>Our new<br>world.</span>","あなたのアイデア。<br><span class='shimmer'>新しい<br>世界へ。</span>","Deine Idee.<br><span class='shimmer'>Unsere neue<br>Welt.</span>"],
 [".intro-lead","Where ideas become real: development, design, bots and original music in one place.","プログラミング、デザイン、ボット、オリジナル音楽。アイデアを形にするスタジオ。","Aus Ideen wird Realität: Entwicklung, Design, Bots und eigene Musik an einem Ort."],
 [".intro-actions .cta-primary","Explore the catalog <span>↗</span>","カタログを見る <span>↗</span>","Katalog entdecken <span>↗</span>"],
 [".intro-actions .cta-secondary","Explore services <span>↓</span>","サービスを見る <span>↓</span>","Bereiche entdecken <span>↓</span>"],
 [".quickfacts div:nth-child(1)","<strong>01</strong> Choose a service","<strong>01</strong> サービスを選ぶ","<strong>01</strong> Bereich wählen"],
 [".quickfacts div:nth-child(2)","<strong>02</strong> Describe your idea","<strong>02</strong> アイデアを伝える","<strong>02</strong> Idee beschreiben"],
 [".quickfacts div:nth-child(3)","<strong>03</strong> Track progress","<strong>03</strong> 進捗を確認","<strong>03</strong> Fortschritt verfolgen"],
 [".quickfacts div:nth-child(4)","<strong>04</strong> Get the result","<strong>04</strong> 完成品を受け取る","<strong>04</strong> Ergebnis erhalten"],
 ["#services .section-top h2","Multiple worlds.<br><em>One approach.</em>","さまざまな世界。<br><em>一つの想い。</em>","Viele Welten.<br><em>Ein Ansatz.</em>"],
 ["#services .section-top>p","Different services, unique pages and clear terms. Choose where your next project begins.","分野ごとに専用ページと明確な条件。次のプロジェクトを始めよう。","Unterschiedliche Angebote, eigene Seiten und klare Bedingungen. Starte dein Projekt."],
 [".service-tiles .service-card:nth-child(1) h3","Bots & automation","ボットと自動化","Bots & Automatisierung"],
 [".service-tiles .service-card:nth-child(1) p","Telegram, Discord and MAX: commands, flows and integrations.","Telegram・Discord・MAXのコマンド、自動化、連携。","Telegram, Discord und MAX: Befehle, Abläufe und Integrationen."],
 [".service-tiles .service-card:nth-child(2) h3","Websites & interfaces","ウェブサイトとUI","Websites & Oberflächen"],
 [".service-tiles .service-card:nth-child(2) p","Modern websites, design and usable digital products.","モダンなサイト、デザイン、使いやすいプロダクト。","Moderne Websites, Design und benutzerfreundliche Produkte."],
 [".service-tiles .service-card:nth-child(3) h3","Software development","ソフトウェア開発","Softwareentwicklung"],
 [".service-tiles .service-card:nth-child(3) p","New features, fixes and robust application logic.","新機能、修正、アプリケーション開発。","Neue Funktionen, Fehlerbehebung und robuste Anwendungslogik."],
 [".music-feature h3","When ideas<br><em>become music.</em>","アイデアが<br><em>音楽になる。</em>","Wenn Ideen<br><em>Musik werden.</em>"],
 [".music-feature p","Witch house, pop-punk, hard rock and zoomergaze. A personal approach to your sound.","ウィッチハウス、ポップパンク、ハードロック、ズーマーゲイズ。オーダーメイドのサウンド。","Witch House, Pop-Punk, Hard Rock und Zoomergaze. Musik nach deinen Vorstellungen."],
 [".music-feature-link","Enter the music studio ↗","音楽スタジオへ ↗","Zum Musikstudio ↗"],
 [".market .section-top h2","A catalog<br><em>made to inspire.</em>","インスピレーションの<br><em>カタログ。</em>","Ein Katalog,<br><em>der inspiriert.</em>"],
 [".market .section-top>p","Digital solutions and services. Recognizable platform logos and clear pricing.","デジタル商品とサービス。正規のロゴと明確な価格。","Digitale Lösungen und Dienstleistungen. Original-Logos und klare Preise."],
 [".search-label input","Search for a project…","商品を検索…","Produkte suchen…","placeholder"],
 ["#productFilters [data-filter='Все']","All","すべて","Alle"],
 ["#productFilters [data-filter='Боты']","Bots","ボット","Bots"],
 ["#productFilters [data-filter='Шаблоны']","Templates","テンプレート","Vorlagen"],
 ["#productFilters [data-filter='Игры']","Games","ゲーム","Spiele"],
 ["#productFilters [data-filter='Услуги']","Services","サービス","Leistungen"],
 ["#productFilters [data-filter='Музыка']","Music","音楽","Musik"],
 [".process .section-top h2","More than an order.<br><em>A real process.</em>","注文だけじゃない。<br><em>制作のプロセス。</em>","Mehr als ein Auftrag.<br><em>Ein echter Prozess.</em>"],
 [".process .section-top>p","An admin updates every stage after a confirmed demo payment. Completed files are available in your account.","テスト決済確認後、管理者が進捗を更新します。ファイルはアカウントから受け取れます。","Nach bestätigter Testzahlung aktualisiert nur ein Admin die Schritte. Dateien stehen im Konto bereit."],
 [".process-grid article:nth-child(1) h3","Choose","選ぶ","Auswählen"],
 [".process-grid article:nth-child(2) h3","Discuss","相談する","Besprechen"],
 [".process-grid article:nth-child(3) h3","Receive","受け取る","Erhalten"],
 [".hire-call h2","Great ideas<br><em>take a team.</em>","素敵なアイデアは<br><em>チームから。</em>","Gute Ideen<br><em>brauchen ein Team.</em>"],
 [".hire-call p","We're looking for developers, designers, testers and people who enjoy helping clients.","開発者、デザイナー、テスター、サポートスタッフを募集しています。","Wir suchen Entwickler, Designer, Tester und Menschen für den Kundensupport."],
 [".hire-call .cta-primary","Apply to join ↗","応募する ↗","Jetzt bewerben ↗"],
 [".contact h2","Have an idea?<br><em>Tell us.</em>","アイデアがある？<br><em>聞かせて。</em>","Eine Idee?<br><em>Erzähl uns davon.</em>"],
 [".contact>div p","Even if it isn't in the catalog. Describe your project and we'll review your request.","カタログにないものも相談できます。ご希望を詳しく教えてください。","Auch wenn es nicht im Katalog steht: Beschreibe dein Projekt."],
 ["#contactRequest label:nth-child(1)","Your name or nickname","名前またはニックネーム","Name oder Spitzname","label"],
 ["#contactRequest label:nth-child(2)","Contact information","連絡先","Kontakt","label"],
 ["#contactRequest label:nth-child(3)","What would you like to create?","何を作りたいですか？","Was möchtest du erstellen?","label"],
 ["#contactRequest button[type=submit]","Send request ↗","お問い合わせを送信 ↗","Anfrage senden ↗"]
];
const music=[
 [".sound-nav nav a:nth-child(1)","Artist","アーティスト","Künstler"],
 [".sound-nav nav a:nth-child(2)","Genres","ジャンル","Genres"],
 [".sound-nav nav a:nth-child(3)","Order","依頼する","Bestellen"],
 [".sound-nav nav a:nth-child(4)","KANEKAN KAN biography ↗","KANEKAN KANの紹介 ↗","Biografie KANEKAN KAN ↗"],
 [".sound-opening h1","A sound that<br><em>tells your<br>story.</em>","あなたの物語を<br><em>音楽に<br>変えよう。</em>","Ein Sound, der<br><em>deine Geschichte<br>erzählt.</em>"],
 [".sound-opening>div:first-child>p","Original tracks created around your mood, lyrics and idea. Choose a genre and voice, then request a custom project.","気分や歌詞、アイデアに合わせたオリジナル曲。ジャンルと声を選んで依頼できます。","Individuelle Songs nach Stimmung, Text und Idee. Wähle Genre und Stimme."],
 [".sound-buttons a:nth-child(1)","Request a track ↗","楽曲を依頼する ↗","Track anfragen ↗"],
 [".sound-buttons a:nth-child(2)","Artist's story ↓","アーティスト紹介 ↓","Künstlergeschichte ↓"],
 [".artist-intro h2","Your music is made by<br><em>KANEKAN KAN.</em>","制作するのは<br><em>KANEKAN KAN。</em>","Deine Musik von<br><em>KANEKAN KAN.</em>"],
 [".artist-intro p","Independent musician working with witch house and rock, producing in FL Studio and using an original AI vocal system. Read the full biography before ordering.","ウィッチハウスとロックを中心に、FL Studioと独自のAIボーカルで制作するアーティスト。注文前にプロフィールをご覧ください。","Unabhängiger Künstler für Witch House und Rock, mit FL Studio und eigenem KI-Gesang. Lies vor der Bestellung die Biografie."],
 [".artist-intro a","Read the biography ↗","プロフィールを見る ↗","Biografie lesen ↗"],
 [".music-styles h2","Music with<br><em>character.</em>","個性を持つ<br><em>音楽。</em>","Musik mit<br><em>Charakter.</em>"],
 [".order-lead h2","Tell me<br><em>what you<br>hear.</em>","頭の中の<br><em>音を<br>教えて。</em>","Erzähl uns,<br><em>was du<br>hörst.</em>"],
 [".order-lead>p:nth-of-type(1)","From title and genre to lyrics, mood, vocal style and instrumentation — all details are part of your request.","タイトル、ジャンル、歌詞、雰囲気、声、楽器まで、ご希望を詳しく入力してください。","Von Titel und Genre bis Text, Stimmung, Gesang und Instrumenten: Deine Wünsche zählen."],
 [".order-detail:nth-of-type(1)","<b>01</b> Choose genre and vocals","<b>01</b> ジャンルと声","<b>01</b> Genre und Gesang"],
 [".order-detail:nth-of-type(2)","<b>02</b> Lyrics or concept","<b>02</b> 歌詞またはアイデア","<b>02</b> Text oder Idee"],
 [".order-detail:nth-of-type(3)","<b>03</b> Creative brief","<b>03</b> ご希望の詳細","<b>03</b> Briefing"],
 [".order-detail:nth-of-type(4)","<b>04</b> Agree on cost and schedule","<b>04</b> 料金と納期を相談","<b>04</b> Preis und Termin vereinbaren"],
 [".music-form h3","A new music project","新しい音楽プロジェクト","Neues Musikprojekt"],
 [".music-form [name='contact']","Contact for replies","返信用の連絡先","Kontakt für Rückfragen","label"],
 [".music-form [name='title']","Track title","曲名","Songtitel","label"],
 [".music-form [name='genre']","Genre — anything except excluded styles","ジャンル — 禁止ジャンル以外は自由","Genre — frei wählbar außer ausgeschlossenen Stilen","label"],
 [".music-form .genre-hint","Enter any genre. Not available: opiumcore, mylancore, brazilian funk and funk.","自由に入力できます。禁止：opiumcore、mylancore、brazilian funk、funk。","Beliebiges Genre eingeben. Ausgeschlossen: opiumcore, mylancore, brazilian funk und funk."],
 [".music-form fieldset:nth-child(1) legend","Vocal type","ボーカル","Gesang"],
 [".music-form fieldset:nth-child(2) legend","Lyrics","歌詞","Liedtext"],
 [".music-form [name='voice'][value='female']","Female","女性","Weiblich","label"],
 [".music-form [name='voice'][value='male']","Male","男性","Männlich","label"],
 [".music-form [name='lyricsMode'][value='provided']","My own lyrics","自分の歌詞","Eigener Text","label"],
 [".music-form [name='lyricsMode'][value='commission']","Artist writes lyrics (extra cost)","歌詞制作を依頼（追加料金）","Künstler schreibt Text (Aufpreis)","label"],
 [".music-form [name='mood']","Mood","雰囲気","Stimmung","label"],
 [".music-form [name='reference']","References","参考曲","Referenzen","label"],
 [".music-form [name='instrumentation']","Instruments, structure and restrictions","楽器、構成、禁止事項","Instrumente, Struktur und Vorgaben","label"],
 [".music-form .music-notice","Writing lyrics from scratch is an additional paid service. Final pricing and timing are agreed before work begins. Male or female AI vocals are available; voice cloning is not supported. <a href='/legal/terms'>Terms</a> · <a href='/legal/privacy'>Privacy</a>","歌詞の新規制作には追加料金がかかります。料金と納期は事前にご相談ください。男性・女性AIボーカルに対応します。本人の声の複製には対応しません。 <a href='/legal/terms'>利用規約</a> · <a href='/legal/privacy'>個人情報</a>","Neue Liedtexte sind eine zusätzliche kostenpflichtige Leistung. Preis und Termin werden vorher vereinbart. Männliche und weibliche KI-Stimmen sind verfügbar; Voice-Cloning wird nicht angeboten. <a href='/legal/terms'>Bedingungen</a> · <a href='/legal/privacy'>Datenschutz</a>"],
 [".music-form .agree-row","I agree to the processing of my request.","申込情報の取扱いに同意します。","Ich stimme der Bearbeitung meiner Anfrage zu.","label"],
 [".music-form button[type='submit']","Submit music request ↗","音楽の依頼を送信 ↗","Musikanfrage senden ↗"]
];
const artist=[
 [".artist-nav nav a:nth-child(1)","Story","経歴","Geschichte"],
 [".artist-nav nav a:nth-child(2)","Music","音楽","Musik"],
 [".artist-nav nav a:nth-child(3)","Official channels","公式リンク","Offizielle Links"],
 [".artist-nav nav a:nth-child(4)","AI vocals","AIボーカル","KI-Gesang"],
 [".artist-opening h1","Sound.<br>Story.<br><em>KANEKAN.</em>","音。<br>物語。<br><em>KANEKAN.</em>","Klang.<br>Geschichte.<br><em>KANEKAN.</em>"],
 [".artist-opening p","An independent artist blending emotion and atmosphere. The story behind KANEKAN KAN and the sound between witch house and rock.","感情と雰囲気を重視する独立系アーティスト。ウィッチハウスとロックの間にあるKANEKAN KANの物語。","Ein unabhängiger Künstler zwischen Witch House und Rock. Musik voller Atmosphäre und Gefühle."],
 [".artist-opening-content>a","Read the biography <span>↓</span>","経歴を読む <span>↓</span>","Biografie lesen <span>↓</span>"],
 [".artist-biography .bio-intro h2","Complete<br><em>biography.</em>","詳しい<br><em>経歴。</em>","Vollständige<br><em>Biografie.</em>"],
 [".artist-biography .bio-intro p","From childhood experiences to FL Studio, rock music and a unique AI vocal system.","幼少期からFL Studio、ロック、独自AIボーカルまで。","Von der Kindheit über FL Studio und Rock bis zum eigenen KI-Gesang."],
 [".artist-platforms .bio-intro h2","Listen. Watch.<br><em>Follow along.</em>","聴いて、見て、<br><em>つながろう。</em>","Hören. Sehen.<br><em>Dabei sein.</em>"],
 [".artist-platforms .bio-intro p","Official music and social pages of KANEKAN KAN. Links open on each platform.","KANEKAN KANの公式音楽・SNSアカウント。各サービスに移動します。","Offizielle Musik- und Social-Media-Kanäle von KANEKAN KAN."],
 [".artist-action h2","Your story<br><em>can be heard too.</em>","あなたの物語も<br><em>音楽に。</em>","Auch deine Geschichte<br><em>kann erklingen.</em>"]
];
const catalog=[
 [".category-copy .intro-actions .cta-primary","Explore services ↓","サービスを見る ↓","Angebote entdecken ↓"],
 [".category-copy .intro-actions .cta-secondary","Describe your project ↗","依頼内容を伝える ↗","Projekt beschreiben ↗"]
];
const careers=[
 [".secondary-opening h1","Create something new.<br><em>With the right team.</em>","一緒に<br><em>新しいものを。</em>","Neues schaffen.<br><em>Gemeinsam im Team.</em>"],
 [".secondary-opening p","We value responsibility, attention to detail, good communication and a passion for quality.","責任感、細部への配慮、コミュニケーション、品質を大切にします。","Wir schätzen Verantwortung, Liebe zum Detail, Kommunikation und Qualität."],
 [".secondary-opening .cta-primary","Apply ↗","応募する ↗","Bewerben ↗"],
 [".career-app h2","Tell us<br><em>about yourself.</em>","あなたについて<br><em>教えてください。</em>","Erzähl uns<br><em>von dir.</em>"]
];
const personaCopy={
 ".nav-links a:nth-child(1)":["Направления ♡","Направления"],
 ".nav-links a:nth-child(2)":["Всё красивое ♡","Каталог проектов"],
 ".nav-links a:nth-child(4)":["Наш артист ♡","Артист"],
 ".nav-links a:nth-child(5)":["Наша команда ♡","Команда"],
 ".intro h1":["Твоя мечта.<br><span class='shimmer'>Наш уютный<br>мирок ♡</span>","Твоя идея.<br><span class='shimmer'>Новая глава<br>проекта.</span>"],
 ".intro-lead":["Собираем твои идеи в прекрасные проекты: сайтики, ботики, код и музыку ♡","В мире VIONA каждая идея обретает форму: код, цифровые пространства и музыка."],
 ".intro-actions .cta-primary":["В уютный каталог ♡ <span>↗</span>","Открыть каталог <span>↗</span>"],
 ".intro-actions .cta-secondary":["Посмотреть всё ♡ <span>↓</span>","Исследовать направления <span>↓</span>"],
 "#services .section-top h2":["Разные мирочки.<br><em>Одна мечта ♡</em>","Множество путей.<br><em>Один выбор.</em>"],
 ".service-tiles .service-card:nth-child(1) h3":["Ботики и помощь ♡","Боты и автоматизация"],
 ".service-tiles .service-card:nth-child(2) h3":["Сайтики и дизайн ♡","Сайты и интерфейсы"],
 ".service-tiles .service-card:nth-child(3) h3":["Волшебство кода ♡","Программирование"],
 ".music-feature h3":["Когда мысли<br><em>поют для тебя ♡</em>","Когда чувства<br><em>обретают звук.</em>"],
 ".music-feature-link":["Хочу в SoundLab ♡ ↗","Войти в SoundLab ✦"],
 ".market .section-top h2":["Каталог мечтаний.<br><em>Выбирай с любовью ♡</em>","Каталог идей.<br><em>Без компромиссов.</em>"],
 ".process .section-top h2":["От идеи<br><em>до чудесного результата ♡</em>","От замысла<br><em>до результата.</em>"],
 ".hire-call h2":["Вместе<br><em>создавать приятнее ♡</em>","В одиночку — идея.<br><em>Вместе — проект.</em>"],
 ".contact h2":["Есть идейка?<br><em>Расскажи ♡</em>","Есть замысел?<br><em>Раскрой его.</em>"],
 ".sound-opening h1":["Песенка для<br><em>твоей истории ♡</em>","Твой сюжет.<br><em>Твой звук.</em>"],
 ".music-form h3":["Твой новый трек ♡","Новая композиция"],
 ".artist-opening h1":["Звук.<br>Чувства.<br><em>KANEKAN ♡</em>","Тени.<br>Звук.<br><em>KANEKAN.</em>"],
 ".secondary-opening h1":["С нами будет<br><em>уютнее ♡</em>","Создавай новое.<br><em>Оставь свой след.</em>"]
};
let entries=[];
for(const triple of [...home,...music,...artist,...catalog,...careers]){
 const [selector,en,ja,de,mode="html"]=triple;
 const node=document.querySelector(selector);if(!node)continue;
 let target=node;
 if(mode==="label")target=node.closest("label")||node;
 if(mode==="label"){
  // Preserve actual input/textarea/radio elements and their listeners.
  const tn=[...target.childNodes].find(x=>x.nodeType===Node.TEXT_NODE&&x.nodeValue.trim());
  if(!tn)continue;
  entries.push({node:tn,mode:"textNode",base:tn.nodeValue,vals:[en,ja,de]});continue;
 }
 const base=mode==="placeholder"?target.getAttribute("placeholder"):target.innerHTML;
 entries.push({node:target,mode,base,vals:[en,ja,de]});
}
function apply(){
 setLocaleCode(current);
 const i=({ru:-1,pink:-1,gothic:-1,en:0,ja:1,de:2})[current];
 for(const entry of entries){
  const special=(current==="pink"||current==="gothic")&&Object.entries(personaCopy).find(([selector])=>document.querySelector(selector)===entry.node);
  const value=special?special[1][current==="pink"?0:1]:i<0?entry.base:entry.vals[i];
  if(entry.mode==="placeholder")entry.node.setAttribute("placeholder",value);
  else if(entry.mode==="textNode")entry.node.nodeValue=value;
  else entry.node.innerHTML=value;
 }
 const button=document.querySelector("#vionaLanguageButton");
 if(button){
  const text=button.querySelector(".locale-code");if(text)text.textContent=tr[current].locale;
  button.setAttribute("aria-label",tr[current].show+": "+tr[current].name);
 }
 document.querySelectorAll("[data-lang-value]").forEach(btn=>{
  const selected=btn.dataset.langValue===current;
  btn.setAttribute("aria-checked",String(selected));btn.classList.toggle("selected",selected);
 });
 window.dispatchEvent(new CustomEvent("viona:locale",{detail:{language:current}}));
}
function change(next){
 if(!allowed.has(next))return;
 if(current===next)return;
 current=next;try{localStorage.setItem(langKey,current)}catch{}
 // Requested page refresh: all dynamic catalog/profile content and static copy
 // are rebuilt consistently in the selected language on every route.
 window.location.reload();return;
 const menu=document.querySelector("#vionaLanguageMenu");
 if(menu){menu.hidden=true;document.querySelector("#vionaLanguageButton")?.setAttribute("aria-expanded","false")}
}
const header=document.querySelector(".site-nav,.sound-nav,.artist-nav");
if(header){
 const wrap=document.createElement("div");wrap.className="locale-switcher";wrap.innerHTML='<button type="button" class="locale-trigger" id="vionaLanguageButton" aria-haspopup="menu" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c4 4 4 14 0 18M12 3c-4 4-4 14 0 18"/></svg><span class="locale-code"></span><svg class="locale-chevron" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></button><div class="locale-menu" id="vionaLanguageMenu" role="menu" hidden></div>';
 const menu=wrap.querySelector("#vionaLanguageMenu");
 menu.innerHTML=Object.entries(tr).map(([key,v])=>'<button type="button" role="menuitemradio" data-lang-value="'+key+'" aria-checked="false"><span>'+v.locale+'</span><strong>'+v.name+'</strong><span class="locale-check">✓</span></button>').join("");
 const tools=header.querySelector(".nav-tools");
 if(tools)tools.insertBefore(wrap,tools.firstChild);
 else {const back=header.querySelector(".back-store");if(back&&back.parentElement===header)header.insertBefore(wrap,back);else header.append(wrap)}
 const btn=wrap.querySelector("#vionaLanguageButton");
 btn.addEventListener("click",()=>{const open=menu.hidden;menu.hidden=!open;btn.setAttribute("aria-expanded",String(open))});
 menu.addEventListener("click",e=>{const option=e.target.closest("[data-lang-value]");if(option)change(option.dataset.langValue)});
 document.addEventListener("pointerdown",e=>{if(!wrap.contains(e.target)){menu.hidden=true;btn.setAttribute("aria-expanded","false")}});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!menu.hidden){menu.hidden=true;btn.setAttribute("aria-expanded","false");btn.focus()}});
}
window.VionaLocale={t,change,get:()=>current};
apply();
})();
