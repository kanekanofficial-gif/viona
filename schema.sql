CREATE TABLE IF NOT EXISTS products (id BIGSERIAL PRIMARY KEY,title TEXT NOT NULL,category TEXT NOT NULL,description TEXT NOT NULL,price INTEGER NOT NULL DEFAULT 0 CHECK(price>=0),icon TEXT NOT NULL DEFAULT '◇',tag TEXT NOT NULL DEFAULT 'Digital',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS requests (id BIGSERIAL PRIMARY KEY,name VARCHAR(100) NOT NULL DEFAULT '',contact VARCHAR(200) NOT NULL DEFAULT '',details TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
INSERT INTO products(title,category,description,price,icon,tag) VALUES
('Telegram Bot Starter','Боты','Стартовый шаблон Telegram-бота на Node.js.',490,'⌘','Шаблон'),
('Portfolio UI Kit','Шаблоны','Тёмный UI-набор для личного портфолио.',290,'◈','Дизайн'),
('Discord Utility Bot','Боты','Основа Discord-бота с командами и настройками.',690,'✳','Node.js'),
('Game Mod Toolkit','Игры','Инструменты для разрешённых модификаций одиночных игр.',390,'⬡','Инструменты'),
('Landing Page Pack','Шаблоны','Набор адаптивных страниц для небольших проектов.',350,'▧','HTML/CSS'),
('Custom Development','Услуги','Опиши задачу и найди разработчика для своего проекта.',0,'↗','Заказ')
ON CONFLICT DO NOTHING;