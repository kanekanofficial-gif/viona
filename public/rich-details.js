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
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const observer=new MutationObserver(()=>{
   const layout=content.querySelector(".detail-layout");
   if(!layout || content.querySelector(".viona-rich-details"))return;
   const title=layout.querySelector(".detail-info h2")?.textContent||"";
   const item=catalog.find(x=>x.match.test(title));
   if(!item)return;
   const section=document.createElement("section");
   section.className="viona-rich-details";
   section.innerHTML='<div class="viona-rich-kicker">VIONA / INSIDE THE PRODUCT</div><h3>'+esc(item.heading)+'</h3><p class="viona-rich-description">'+esc(item.description)+'</p><div class="viona-rich-features">'+item.features.map(x=>'<span>✦ '+esc(x)+'</span>').join("")+'</div><div class="viona-rich-code"><div class="viona-rich-code-head"><span class="viona-rich-code-dots">● ● ●</span><span>'+esc(item.file)+'</span><small>'+esc(item.language)+'</small></div><pre><code>'+esc(item.code)+'</code></pre><div class="viona-rich-fade" aria-hidden="true"></div><div class="viona-rich-code-label">ФРАГМЕНТ КОДА · ПРИМЕР</div></div><p class="viona-rich-disclaimer">Это демонстрационный пример, а не исходный код продаваемого продукта. Полный состав и готовность уточняются при заказе.</p>';
   const visual=layout.querySelector(".detail-visual"); const code=section.querySelector(".viona-rich-code"); if(visual&&code){visual.replaceChildren(code);visual.classList.add("viona-preview-visual");} layout.append(section);
 });
 observer.observe(content,{childList:true,subtree:true});
})();