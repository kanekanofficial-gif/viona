# VIONA — starter

Тёмный адаптивный прототип цифрового маркетплейса: Node.js + Express, демо-каталог, поиск и фильтры, форма заявки, базовая интеграция Telegram Mini App SDK.

## Запуск локально
Требуется Node.js 20+.
```bash
npm install
npm start
```
Открой http://localhost:3000

## Развёртывание на Render
1. Загрузи файлы в GitHub-репозиторий `viona`.
2. В Render создай **Web Service** и выбери этот репозиторий.
3. Build Command: `npm install`; Start Command: `npm start`.
4. Выбери Free, если он доступен для твоего аккаунта, и разверни приложение.

## PostgreSQL через Neon
1. Создай проект на https://neon.tech/
2. Скопируй connection string.
3. В Render → сервис → Environment добавь `DATABASE_URL`.
4. Выполни `schema.sql` в SQL Editor Neon, чтобы создать таблицы и демо-товары.

## Домен
После успешного деплоя в Render → Settings → Custom Domains добавь `viona.space`. Следуй DNS-записям, которые покажет Render, и внеси именно их в панели DNS REG.RU. Не угадывай IP/CNAME вручную. HTTPS настраивается после проверки домена.

## Telegram
Клиентский SDK подключён. После деплоя укажи HTTPS-адрес сайта в настройках Telegram Mini App у своего бота. Для production нужно проверять Telegram `initData` на сервере — `initDataUnsafe` не подтверждает личность.

## Пока не реализовано
Оплата, загрузка и доставка купленных файлов, кабинет продавца, админ-панель и серверная проверка Telegram. Товары демонстрационные и сейчас не продаются. Не публикуй секреты или пароли в репозитории.
