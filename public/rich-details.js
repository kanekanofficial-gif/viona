"use strict";
(() => {
 const content=document.getElementById("v15Content");
 if(!content)return;
 const catalog=[
 {match:/telegram bot starter/i,heading:"Telegram-бот на Node.js",description:"Стартовая архитектура бота: обработка команд, ответы на сообщения и место для подключения собственных сценариев.",features:["Команды и обработчики сообщений","Расширяемая структура проекта","Подходит для собственных интеграций"],file:"src/bot.js",language:"JavaScript",code:`import { Bot } from "grammy";
const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", async (ctx) => {
  await ctx.reply("Добро пожаловать!");
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  // Подключите собственную бизнес-логику
  await ctx.reply("Получено: " + text);
});

// Остальная часть проекта скрыта…`},
 {match:/portfolio ui kit/i,heading:"UI-компоненты для портфолио",description:"Тёмный адаптивный набор интерфейсных компонентов: карточки проектов, навигация, акцентные кнопки и секции портфолио.",features:["Адаптивная сетка","Переиспользуемые компоненты","Тёмная палитра"],file:"components/ProjectCard.jsx",language:"React / JSX",code:`export function ProjectCard({ title, tags }) {
  return (
    <article className="project-card">
      <span className="project-label">SELECTED WORK</span>
      <h3>{title}</h3>
      <div className="project-tags">
        {tags.map(tag => <span key={tag}>{tag}</span>)}
      </div>
      {/* Дополнительные элементы скрыты */}
    </article>
  );
}`},
 {match:/discord utility bot/i,heading:"Discord-бот с командами",description:"Основа Discord-приложения с обработкой slash-команд, модульной логикой и возможностью добавлять собственные инструменты.",features:["Slash-команды","Асинхронные обработчики","Модульное расширение"],file:"src/commands/ping.js",language:"JavaScript",code:`import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Проверить отклик бота");

export async function execute(interaction) {
  await interaction.reply("Pong!");
}

// Остальные команды и настройки скрыты…`},
 {match:/game mod toolkit/i,heading:"Инструменты для игровых модов",description:"Набор вспомогательных утилит для разрешённой настройки и модификации одиночных игр.",features:["Работа с конфигурациями","Простая структура утилит","Возможность расширения"],file:"tools/config.py",language:"Python",code:`from pathlib import Path
import json

def load_config(path: str):
    file = Path(path)
    if not file.exists():
        return {"enabled": False}
    return json.loads(file.read_text(encoding="utf-8"))

# Дополнительные инструменты скрыты…`},
 {match:/landing page pack/i,heading:"Адаптивные страницы для запуска",description:"Коллекция HTML/CSS-шаблонов для лендингов с чистой типографикой, карточками и мобильной компоновкой.",features:["Адаптивная вёрстка","Чистая HTML-структура","Настраиваемые CSS-переменные"],file:"styles/landing.css",language:"CSS",code:`:root {
  --surface: #10121c;
  --text: #f7f4f0;
  --accent: #f0b98e;
}

.hero {
  display: grid;
  min-height: 80vh;
  place-items: center;
  padding: clamp(24px, 6vw, 96px);
}

/* Остальные стили скрыты… */`},
 {match:/custom development/i,heading:"Разработка под твою идею",description:"Расскажи, какой проект нужен: игровая механика, бот, сайт или собственный инструмент. Ниже — пример C++-логики управления персонажем: направление, скорость и обработка движения.",features:["Индивидуальное техническое задание","Проектирование механик","Разработка и доработка под задачу"],file:"PlayerController.cpp",language:"C++",code:`// Player movement logic
#include <cmath>

struct PlayerInput {
    float horizontal;
    float vertical;
    bool jump;
};

struct PlayerMotion {
    float velocityX = 0.0f;
    float velocityZ = 0.0f;
    float speed = 5.0f;
};

void UpdateMovement(PlayerMotion& player,
                    const PlayerInput& input) {
    const float length = std::sqrt(
        input.horizontal * input.horizontal +
        input.vertical * input.vertical
    );
    if (length > 0.001f) {
        player.velocityX = input.horizontal / length * player.speed;
        player.velocityZ = input.vertical / length * player.speed;
    }
    // Передача движения в Unity и прыжок — в полной версии…
}`},
 {match:/max bot starter/i,heading:"Шаблон бота для MAX",description:"Концепция стартового бота с маршрутизацией сообщений и отдельными обработчиками. Это пример архитектуры, не готовый подключённый бот.",features:["Разделение обработчиков","Маршрутизация команд","Место для интеграции API"],file:"src/router.js",language:"JavaScript",code:`export async function handleMessage(message, api) {
  const text = String(message.text || "").trim();
  if (text === "/start") {
    return api.sendMessage(message.chatId, "Привет!");
  }
  // Другие обработчики и API-адаптер скрыты…
}`}
 ];
 const detailsCopy={
 en:[
  {heading:"Telegram bot on Node.js",description:"A starter architecture for a Telegram bot: command handling, message replies and room for your own workflows.",features:["Commands and message handlers","Expandable project structure","Ready for your own integrations"]},
  {heading:"Portfolio UI components",description:"A responsive interface kit with project cards, navigation, clear actions and reusable portfolio sections.",features:["Responsive grid","Reusable components","Consistent visual system"]},
  {heading:"Discord bot with commands",description:"A foundation for a Discord app with slash commands, modular handlers and room for custom tools.",features:["Slash commands","Async handlers","Modular structure"]},
  {heading:"Single-player game tools",description:"A set of helper utilities for permitted configuration and single-player game customization.",features:["Configuration helpers","Simple project structure","Easy to extend"]},
  {heading:"Responsive landing pages",description:"A collection of HTML and CSS layouts with clean typography, flexible cards and mobile-ready sections.",features:["Responsive layout","Clean HTML structure","Editable CSS variables"]},
  {heading:"Development for your idea",description:"Describe the project you need: a bot, website, game mechanic or custom tool. The sample below shows basic movement logic.",features:["Custom technical brief","Mechanics planning","Build and iteration"]},
  {heading:"Starter template for MAX bots",description:"A starter concept with message routing and separate handlers. It is an architecture example, not a connected bot.",features:["Separated handlers","Command routing","Space for API integration"]}
 ],
 ja:[
  {heading:"Node.js Telegram ボット",description:"Telegram ボットの基本構成。コマンド処理、メッセージへの返信、独自の処理を追加できます。",features:["コマンドとメッセージ処理","拡張しやすい構成","独自連携に対応"]},
  {heading:"ポートフォリオ UI",description:"プロジェクトカード、ナビゲーション、ボタン、再利用可能なセクションを備えた UI キット。",features:["レスポンシブグリッド","再利用可能な部品","統一されたデザイン"]},
  {heading:"Discord コマンドボット",description:"スラッシュコマンドとモジュール式ハンドラーを備えた Discord アプリの基盤。",features:["スラッシュコマンド","非同期処理","モジュール構成"]},
  {heading:"シングルプレイヤー向けツール",description:"許可された設定変更やシングルプレイヤーゲームのカスタマイズを支援するツール。",features:["設定ファイルの補助","シンプルな構成","自由に拡張可能"]},
  {heading:"レスポンシブページ集",description:"タイポグラフィ、カード、モバイル表示を整えた HTML / CSS テンプレート。",features:["レスポンシブ対応","整理された HTML","編集可能な CSS"]},
  {heading:"アイデアに合わせた開発",description:"ボット、ウェブサイト、ゲームの仕組みなど、作りたいプロジェクトを教えてください。",features:["要件の整理","仕組みの設計","開発と改善"]},
  {heading:"MAX ボットのテンプレート",description:"メッセージ振り分けと個別ハンドラーの構成例です。接続済みのボットではありません。",features:["ハンドラーの分割","コマンドの振り分け","API連携用の構成"]}
 ],
 de:[
  {heading:"Telegram-Bot mit Node.js",description:"Eine Startarchitektur für Telegram-Bots mit Befehlen, Antworten und Platz für eigene Abläufe.",features:["Befehle und Nachrichtenhandler","Erweiterbare Projektstruktur","Für eigene Integrationen"]},
  {heading:"Portfolio-UI-Komponenten",description:"Ein responsives UI-Kit mit Projektkarten, Navigation, klaren Aktionen und wiederverwendbaren Bereichen.",features:["Responsives Raster","Wiederverwendbare Komponenten","Einheitliches Design"]},
  {heading:"Discord-Bot mit Befehlen",description:"Eine Grundlage für Discord-Apps mit Slash-Befehlen, modularen Handlern und eigenen Tools.",features:["Slash-Befehle","Asynchrone Handler","Modularer Aufbau"]},
  {heading:"Tools für Einzelspieler-Spiele",description:"Hilfswerkzeuge für erlaubte Konfigurationen und Anpassungen von Einzelspieler-Spielen.",features:["Konfigurationshilfen","Einfache Struktur","Leicht erweiterbar"]},
  {heading:"Responsive Landingpages",description:"HTML- und CSS-Vorlagen mit klarer Typografie, flexiblen Karten und mobiler Darstellung.",features:["Responsives Layout","Saubere HTML-Struktur","Anpassbare CSS-Variablen"]},
  {heading:"Entwicklung für deine Idee",description:"Beschreibe dein Projekt: Bot, Website, Spielmechanik oder eigenes Tool. Wir planen die passende Umsetzung.",features:["Individuelle Anforderungen","Planung der Funktionen","Entwicklung und Feinschliff"]},
  {heading:"MAX-Bot-Starter",description:"Ein Architekturbeispiel mit Nachrichten-Routing und separaten Handlern, noch kein verbundener Bot.",features:["Getrennte Handler","Befehlsrouting","Vorbereitung für API-Anbindung"]}
 ]
};
const detailLocale=document.documentElement.dataset.world||"ru";
const detailUi={
 ru:{codeLabel:"ФРАГМЕНТ КОДА · ПРИМЕР",disclaimer:"Это демонстрационный пример, а не исходный код продаваемого продукта. Полный состав и готовность уточняются при заказе."},
 en:{codeLabel:"CODE SNIPPET · EXAMPLE",disclaimer:"This is an illustrative example, not the source code of the product being sold. Final scope and readiness are confirmed when ordering."},
 ja:{codeLabel:"コード例 · サンプル",disclaimer:"これは説明用のサンプルであり、販売商品のソースコードではありません。内容と完成度は注文時に確認できます。"},
 de:{codeLabel:"CODEAUSSCHNITT · BEISPIEL",disclaimer:"Dies ist ein Demonstrationsbeispiel und nicht der Quellcode des angebotenen Produkts. Umfang und Fertigstellung werden bei der Anfrage abgestimmt."},
 femboy:{codeLabel:"ФРАГМЕНТ КОДА · ПРИМЕР ♡",disclaimer:"Это демонстрационный пример, а не исходный код продаваемого продукта. Полный состав уточняется при заказе ♡"}
};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const observer=new MutationObserver(()=>{
   const layout=content.querySelector(".detail-layout");
   if(!layout || content.querySelector(".viona-rich-details"))return;
   const title=layout.querySelector(".detail-info h2")?.textContent||"";
   const productId=Number(layout.dataset.productId);
   const item=catalog[productId-1]||catalog.find(x=>x.match.test(title));
   if(!item)return;
   const detailIndex=catalog.indexOf(item),localized=(detailsCopy[detailLocale]||detailsCopy.ru)[detailIndex]||item,ui=detailUi[detailLocale]||detailUi.ru;
   const section=document.createElement("section");
   section.className="viona-rich-details";
   section.innerHTML='<div class="viona-rich-kicker">VIONA / INSIDE THE PRODUCT</div><h3>'+esc(localized.heading||item.heading)+'</h3><p class="viona-rich-description">'+esc(localized.description||item.description)+'</p><div class="viona-rich-features">'+(localized.features||item.features).map(x=>'<span>✦ '+esc(x)+'</span>').join("")+'</div><div class="viona-rich-code"><div class="viona-rich-code-head"><span class="viona-rich-code-dots">● ● ●</span><span>'+esc(item.file)+'</span><small>'+esc(item.language)+'</small></div><pre><code>'+esc(item.code)+'</code></pre><div class="viona-rich-fade" aria-hidden="true"></div><div class="viona-rich-code-label">'+esc(ui.codeLabel)+'</div></div><p class="viona-rich-disclaimer">'+esc(ui.disclaimer)+'</p>';
   const visual=layout.querySelector(".detail-visual"); const code=section.querySelector(".viona-rich-code"); if(visual&&code){const glyph=visual.querySelector(".detail-glyph");const badge=document.createElement("span");badge.className="viona-detail-icon-overlay";badge.setAttribute("aria-hidden","true");if(glyph){badge.append(...[...glyph.childNodes].map(n=>n.cloneNode(true)))}visual.replaceChildren(code,badge);visual.classList.add("viona-preview-visual");} layout.append(section);
 });
 observer.observe(content,{childList:true,subtree:true});
})();