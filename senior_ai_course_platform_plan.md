# Senior-Level AI Course Platform

## 1. Стек проекта

**Frontend:**
- Nuxt 3 + TypeScript + Composition API
- Pinia (state management)
- Vue Router
- Vite (сборка)
- TailwindCSS / SCSS
- Storybook (UI компоненты)

**Backend (MVP / mock):**
- Node.js + NestJS / Express
- GraphQL API (если успеешь, иначе REST)
- Stripe (тестовые платежи)
- Gemini API (AI проверка домашних заданий)
- PostgreSQL / SQLite

**Дополнительно:**
- WebSocket (статусы проверки домашек)
- PDF certificate generation (Canvas / jsPDF)
- Git + GitHub (CI/CD через Actions)
- Docker

---

## 2. Архитектура проекта (FSD)

```
src/
├─ app/            
│   ├─ plugins/    
│   │   ├─ websocket.ts
│   │   ├─ stripe.ts
│   │   └─ gemini.ts          # подключение Gemini API
│   └─ config.ts
├─ pages/          
│   ├─ index.vue
│   ├─ dashboard.vue
│   └─ course/[id].vue
├─ entities/       
│   ├─ user/
│   ├─ course/
│   └─ homework/
├─ features/       
│   ├─ homework-checker/     # интеграция с Gemini API
│   ├─ payments/
│   ├─ certificate/
│   └─ course-builder/
├─ widgets/        
│   ├─ Card/
│   ├─ Modal/
│   └─ Button/
├─ shared/         
│   ├─ api/                  # GraphQL/REST клиенты
│   ├─ ui/
│   └─ types/
└─ services/       
    ├─ apiClient.ts
    ├─ stripeService.ts
    └─ geminiService.ts       # сервис для проверки домашних
```

---

## 3. Фичи MVP

### 3.1 Course Builder
- CRUD курсов
- Видео + текст + квизы
- Drag & drop загрузка видео (MUX/Cloudflare Stream)

### 3.2 Student Dashboard
- Список курсов
- Подписка (Stripe)
- Загрузка домашних заданий

### 3.3 AI Homework Checker (Gemini API)
- Проверка текста/кода/эссе через Gemini API
- Статусы проверки через WebSocket
- Feedback + Score

**GraphQL пример:**
```graphql
mutation submitHomework($input: HomeworkInput!) : HomeworkResult
query getHomeworkStatus($id: ID!) : HomeworkStatus
query getHomeworkFeedback($id: ID!) : HomeworkFeedback
```

### 3.4 Certificate Generation
- PDF / Canvas генерация сертификатов

**GraphQL endpoint:**
```graphql
query generateCertificate($courseId: ID!, $userId: ID!) : CertificateURL
```

### 3.5 Payments (Stripe)
- Подписка Teacher / School
- Free tier для 1 курса

**GraphQL endpoint:**
```graphql
mutation subscribe($planId: ID!) : Subscription
```

### 3.6 Дополнительные фичи
- Plagiarism detection
- Lazy loading компонентов
- Unit и E2E тесты (Vitest + Cypress)
- Docker + CI/CD

---

## 4. План по неделям (1 месяц)

**Неделя 1 – Setup**
- Nuxt 3 + TypeScript
- Pinia + Vue Router
- FSD структура
- GraphQL mock API
- Docker setup

**Неделя 2 – Core Features**
- Course Builder + Dashboard
- CRUD курсов
- Video upload (MUX / Cloudflare Stream)
- Stripe integration

**Неделя 3 – AI Checker + Certificates**
- Gemini API integration
- WebSocket статусы проверки
- Certificate generation

**Неделя 4 – Полировка + Senior фичи**
- Storybook + UI components
- Refactor с SOLID / KISS / DRY
- Unit + E2E тесты
- CI/CD
- Минимальная документация

---

## 5. Особенности Senior-Level

- Использование FSD (Feature-Sliced Design)
- Типизация TypeScript во всех слоях
- Чистая архитектура и модули
- Lazy loading и оптимизация SPA
- WebSocket и асинхронные операции
- Unit и E2E тестирование для критичных модулей
- CI/CD и Docker контейнеризация
- Возможность масштабирования и подключения микросервисов

---

## 6. API ключевые сущности

**User:** id, name, email, role (student/teacher/admin)

**Course:** id, title, description, videoUrls, quizzes

**Homework:** id, courseId, studentId, status, score, feedback

**Subscription:** id, userId, plan, startDate, endDate

**Certificate:** id, userId, courseId, url, generatedAt

