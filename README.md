# WebLarek Express

Учебный проект для изучения бэкенд-разработки на Express + TypeScript + MongoDB.

---

## ⚠️ Важно для автотестов

Для успешного прохождения автотестов используйте переменные окружения из файла [`.env.example`](backend/.env.example).
Имя переменной для хранения адреса базы данных — **`DB_ADDRESS`**, менять его нельзя.

---

## 📋 Прогресс выполнения

### Базовая часть (ветка `reviews`)

#### ✅ Завершённые этапы

- [x] **Клонирование проекта** — репозиторий скопирован с GitHub
- [x] **Организация структуры** — проект помещён в отдельную папку `web-larek-express`
- [x] **Создание веток Git:**
  - `reviews` — от `main`, для базового задания
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

### Дополнительное задание (ветка `reviews-admin`)

#### ✅ Завершённые этапы

- [x] **Переход на ветку `reviews-admin`**
  - Создана ветка от `admin`
  - Перенесён код бэкенда из `reviews` командой `git checkout reviews -- backend`
  - Установлены недостающие пакеты фронтенда (`react-toastify`, `vite-plugin-svgr`)
- [x] **Шаг 6: Регистрация и авторизация**
  - Установлены пакеты: `bcryptjs`, `jsonwebtoken`, `cookie-parser`, `ms`
  - Создана модель [`User`](backend/src/models/user.ts) (name, email, password, tokens)
  - Поля `password` и `tokens` имеют `select: false` для безопасности
  - Создан контроллер [`auth`](backend/src/controllers/auth.ts):
    - `login` — аутентификация, возврат accessToken + httpOnly refreshToken
    - `register` — регистрация, хеширование пароля, возврат токенов
    - `getCurrentUser` — получение пользователя по Bearer-токену
    - `logout` — удаление refreshToken из БД, очистка куки
    - `refreshAccessToken` — обновление пары токенов по refreshToken из куки
  - Создан роут [`auth`](backend/src/routes/auth.ts):
    - `POST /auth/login`, `POST /auth/register`
    - `GET /auth/token`, `GET /auth/logout`, `GET /auth/user`
  - Обновлён [`app.ts`](backend/src/app.ts): `cookie-parser`, `authRouter`, CORS с `credentials: true`
  - Добавлен `UnauthorizedError` (401) в [`errors/index.ts`](backend/src/errors/index.ts)
  - Обновлён [`config.ts`](backend/src/config.ts): `JWT_SECRET`, `AUTH_ACCESS_TOKEN_EXPIRY`, `AUTH_REFRESH_TOKEN_EXPIRY`, `ORIGIN_ALLOW`

#### ⏳ Ожидают выполнения

- [ ] Шаг 7: Загрузка файлов (аватар, изображения товаров)
- [ ] Шаг 8: Создание pull request `reviews-admin` → `admin`

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
| `reviews` | Базовое задание (от `main`) | ✅ Завершено |
| `reviews-admin` | Дополнительное задание (от `admin`) | **Текущая** |
| `admin` | Ветка с доп. заданием на GitHub | Не трогаем |

---

*README обновляется по мере выполнения проекта.*