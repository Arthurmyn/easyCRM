# easyCRM — Корпоративная платформа на Bitrix/Bitrix24

Полноценный коммерческий Full Stack SaaS-проект для продвижения услуг разработки сайтов и внедрения CRM.

## Стек технологий

| Слой | Технологии |
|------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion, Shadcn/UI |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| **Auth** | JWT (7d TTL), bcrypt, Role-based (Admin / Manager) |
| **Deploy** | Docker, Docker Compose |
| **Quality** | ESLint, Prettier, Zod validation |

## Быстрый старт

### Через Docker (рекомендуется)

```bash
# 1. Клонировать и перейти в папку
git clone <repo-url> easycrm && cd easycrm

# 2. Создать файл окружения
cp .env.example .env

# 3. Запустить всё
docker compose up -d

# 4. Применить миграции и сидеры (первый запуск)
docker exec easycrm_backend sh -c "npx prisma migrate deploy && node dist/prisma/seed.js"
```

Приложение доступно:
- **Сайт**: http://localhost:3000
- **API**: http://localhost:4000
- **Админ**: http://localhost:3000/admin

### Локальная разработка

#### Требования
- Node.js 20+
- PostgreSQL 16+

```bash
# Backend
cd backend
cp .env.example .env        # заполните DATABASE_URL
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev                 # :4000

# Frontend (новый терминал)
cd frontend
npm install
npm run dev                 # :3000
```

## Структура проекта

```
easycrm/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma   # Схема БД
│   │   └── seed.ts         # Тестовые данные
│   └── src/
│       ├── routes/         # API маршруты
│       ├── middleware/      # Auth & Admin guards
│       └── types/          # TypeScript типы
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx    # Главная страница
│       │   └── admin/      # Панель администратора
│       ├── components/
│       │   ├── sections/   # Секции лендинга
│       │   ├── admin/      # Компоненты админки
│       │   ├── common/     # Navbar, Footer
│       │   └── ui/         # Shadcn UI компоненты
│       └── lib/
│           ├── api.ts      # API клиент
│           ├── auth.ts     # Хелперы авторизации
│           └── utils.ts    # Утилиты
├── docker-compose.yml
└── .env.example
```

## API Reference

### Публичные эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| `POST` | `/api/leads` | Создать заявку |
| `GET` | `/api/projects` | Список проектов |
| `GET` | `/api/services` | Список услуг |
| `GET` | `/api/reviews` | Список отзывов |
| `GET` | `/api/faq` | Список FAQ |

### Авторизация

| Метод | URL | Описание |
|-------|-----|----------|
| `POST` | `/api/auth/login` | Войти |
| `POST` | `/api/auth/register` | Зарегистрироваться |
| `GET` | `/api/auth/me` | Текущий пользователь |

### Защищённые (требуют JWT)

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/api/stats` | Статистика dashboard |
| `GET/PATCH/DELETE` | `/api/leads/:id` | Управление заявками |
| `GET/POST/PUT/DELETE` | `/api/projects` | CRUD проектов |
| `GET/POST/PUT/DELETE` | `/api/services` | CRUD услуг |
| `GET/POST/PUT/DELETE` | `/api/reviews` | CRUD отзывов |
| `GET/POST/PUT/DELETE` | `/api/faq` | CRUD FAQ |
| `GET/POST/PUT/DELETE` | `/api/users` | CRUD пользователей (Admin only) |

## Тестовые учётные данные

```
Admin:   admin@easycrm.ru   / admin123456
Manager: manager@easycrm.ru / manager123456
```

## Страницы сайта

| Секция | Описание |
|--------|----------|
| **Hero** | Большой заголовок + CRM dashboard иллюстрация |
| **О компании** | Статистика и преимущества |
| **Услуги** | 6 карточек услуг с ценами |
| **Почему мы** | 6 преимуществ с иконками |
| **Процесс** | Timeline 6 шагов |
| **Кейсы** | 6 кейсов с фильтрацией по категориям |
| **Отзывы** | Слайдер отзывов |
| **FAQ** | Аккордеон с 8 вопросами |
| **Контакты** | Форма заявки + карта + контакты |

## Административная панель `/admin`

| Раздел | Функционал |
|--------|-----------|
| **Dashboard** | Метрики, графики заявок, последние обращения |
| **Заявки** | Таблица с фильтрами, статусы, поиск, пагинация |
| **Проекты** | CRUD, публикация/скрытие |
| **Услуги** | CRUD, публикация/скрытие |
| **Отзывы** | CRUD, рейтинг, публикация |
| **FAQ** | CRUD, аккордеон предпросмотр |
| **Пользователи** | CRUD, роли Admin/Manager |
| **Настройки** | Профиль, смена пароля |

## Дизайн

- Тёмная тема по умолчанию
- Glassmorphism эффекты
- Анимации Framer Motion (scroll, fade, slide, parallax)
- Цветовая схема: Primary `#2563EB`, Accent `#38BDF8`, BG `#020617`
- Полная адаптивность (mobile, tablet, desktop)

## Переменные окружения

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/easycrm_db

# Backend
JWT_SECRET=min_32_chars_secret_key
PORT=4000
CORS_ORIGIN=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Лицензия

MIT © easyCRM 2024
