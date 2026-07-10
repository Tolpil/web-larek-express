# WebLarek Express

Учебный проект для изучения бэкенд-разработки на Express + TypeScript + MongoDB.

---

## ⚠️ Важно для автотестов

Для успешного прохождения автотестов используйте переменные окружения из файла [`.env.example`](backend/.env.example).
Имя переменной для хранения адреса базы данных — **`DB_ADDRESS`**, менять его нельзя.

---

## 📋 Прогресс выполнения

### ✅ Завершённые этапы

- [x] **Клонирование проекта** — репозиторий скопирован с GitHub
- [x] **Организация структуры** — проект помещён в отдельную папку `web-larek-express`
- [x] **Создание веток Git:**
  - `reviews` — от `main`, для базового задания (текущая)
  - `reviews-admin` — от `admin`, для дополнительного задания
- [x] **Проверка окружения:**
  - **Git** — установлен (v2.55.0)
  - **MongoDB** — установлена и запущена (служба Windows: Running)
  - **MongoDB Shell (mongosh)** — установлен (v2.3.9)
- [x] **Установка зависимостей:**
  - **Фронтенд** — 251 пакет (`npm ci`)
  - **Бэкенд** — 347 пакетов (`npm ci`)
- [x] **Настройка `.env` файлов** — созданы `backend/.env` и `frontend/.env` на основе `.env.example`
- [x] **Запуск фронтенда** — `npm run dev` на `http://localhost:5173`
- [x] **Создание Express сервера** — базовый `app.ts` с запуском на порту 3000
- [x] **Запуск бэкенда** — `npm run dev` (nodemon) на `http://localhost:3000`
- [x] **Шаг 1: Настройка Express сервера**
  - Express сервер на порту 3000
  - Подключен `cors` для работы с фронтендом
  - `npm run build` — сборка в `dist` работает
  - `npm run start` — запуск через `ts-node`
  - `npm run dev` — запуск с авто-перезагрузкой (nodemon)
- [x] **Модель товара** — создана схема `Product` (name, description, category, price, image)
- [x] **Шаг 2: База данных, контроллеры и роуты**
  - Обновлена модель `Product` (title, image-объект, опциональные price/description)
  - Контроллеры: `getProducts`, `createProduct`, `createOrder`
  - Роуты: `GET /product`, `POST /product`, `POST /order`
  - Подключена MongoDB (`mongoose.connect`)
  - Раздача статики через `express.static('public')`
  - Валидация заказа: проверка items, price, total, payment
  - Загружены картинки товаров в `backend/public/images/`
  - Создан скрипт `seed.ts` для заполнения БД (команда `npm run seed`)
  - В БД загружено 10 товаров из `product.json`
- [x] **Шаг 3: Централизованная обработка ошибок**
  - Классы ошибок: `BadRequestError` (400), `NotFoundError` (404), `ConflictError` (409)
  - Мидлвар `errorHandler` для централизованной обработки
  - Контроллеры передают ошибки через `next(error)`
  - Обработка `ValidationError` (400) и `E11000` duplicate key (409)
  - Роут 404 для несуществующих маршрутов
- [x] **Шаг 4: Валидация данных**
  - Установлен `celebrate` + `joi`
  - Валидация `POST /product`: title (2-30 символов), image (объект), category, description, price
  - Валидация `POST /order`: payment (card|online), email, phone, address, total, items
  - Обновлена схема Mongoose с сообщениями об ошибках
  - Обработка ошибок celebrate через `app.use(errors())`
- [x] **Шаг 5: Логирование запросов и ошибок**
  - Установлены `express-winston` и `winston`
  - `requestLogger` — логи всех запросов в `request.log`
  - `errorLogger` — логи ошибок в `error.log`
  - Логгеры подключены в правильном порядке (requestLogger до роутов, errorLogger после)
  - `*.log` в `.gitignore`
- [x] **Рефакторинг: вынос конфигурации в `config.ts`**
  - Создан [`backend/src/config.ts`](backend/src/config.ts) — экспорт `PORT` и `DB_ADDRESS` из `process.env`
  - [`backend/src/app.ts`](backend/src/app.ts) импортирует конфигурацию из отдельного модуля
  - Структура проекта приведена к единому стандарту

### ✅ Базовая часть проектной работы завершена

Все 5 шагов базового задания выполнены:
1. **Express сервер** — запуск, CORS, статика, скрипты
2. **MongoDB, модели, контроллеры, роуты** — Product, Order, seed
3. **Централизованная обработка ошибок** — классы ошибок, errorHandler
4. **Валидация celebrate/joi** — схемы для POST /product и POST /order
5. **Логирование** — express-winston + winston

Проект готов к отправке на проверку.

---

## 🚀 Быстрый запуск (локальная разработка)

### 1. Запуск MongoDB

Убедись, что MongoDB запущена (служба Windows: `MongoDB Server`).

### 2. Бэкенд

```bash
cd backend
npm run dev
```

Сервер запустится на `http://localhost:3000` с автоматической перезагрузкой при изменениях (nodemon).

### 3. Фронтенд

```bash
cd frontend
npm run dev
```

Сайт будет доступен на `http://localhost:5173`.

---

## 🛠 Стек технологий

| Компонент | Технология |
|-----------|-----------|
| **Бэкенд** | Node.js + Express + TypeScript + Mongoose |
| **Фронтенд** | React + TypeScript + Vite |
| **База данных** | MongoDB |
| **Веб-сервер** | Nginx |

## 🌿 Ветки Git

| Ветка | Назначение | Статус |
|-------|-----------|--------|
| `main` | Базовая ветка проекта | Не трогаем |
| `reviews` | Базовое задание (от `main`) | **Текущая** |
| `reviews-admin` | Дополнительное задание (от `admin`) | Ожидает |
| `admin` | Ветка с доп. заданием на GitHub | Не трогаем |

---

*README обновляется по мере выполнения проекта.*