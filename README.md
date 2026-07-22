# My Anime Diary

A private anime tracking application built with Next.js and Supabase.

Users can privately keep track of the anime they have watched, rate them, and mark favorites.

This is **NOT** a social platform, streaming platform, or anime download website.

---

# Project Status

🚧 MVP in Development

Current Focus

- Project Architecture
- Authentication
- Anime Database
- Personal Diary
- Favorites
- Ratings

---

# Features (MVP)

- User Authentication
- Private Dashboard
- Anime Search
- Anime Details
- Add Anime to Diary
- Personal Ratings
- Favorites
- Profile
- Settings
- Light Theme
- Dark Theme
- Responsive Design

---

# Tech Stack

Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend

- Supabase

Database

- PostgreSQL

Authentication

- Supabase Auth

Deployment

- Vercel

---

# Project Structure

```
.

├── docs/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
│
├── .env.example
├── package.json
└── README.md
```

---

# Documentation

Project documentation is located inside:

```
docs/
```

Available Documents

- MASTER_PROMPT.md
- PROJECT_SPEC.md
- DATABASE.md
- UI_GUIDELINES.md
- ARCHITECTURE.md
- ENVIRONMENT_SETUP.md
- DEVELOPMENT_PLAN.md
- AI_RULES.md
- DEPLOYMENT.md

Read these documents before making architectural or database changes.

---

# Getting Started

## 1 Clone Repository

```bash
git clone <repository-url>
```

---

## 2 Install Dependencies

```bash
npm install
```

---

## 3 Configure Environment Variables

Create

```
.env.local
```

Copy values from

```
.env.example
```

Fill in

```
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

Do not commit `.env.local`.

`SUPABASE_SERVICE_ROLE_KEY` is used only by server-side account deletion and must never be exposed to the browser.

---

## 4 Start Development Server

```bash
npm run dev
```

---

## 5 Open Browser

```
http://localhost:3000
```

---

# Development Workflow

Every new feature should follow this order

1. Read PROJECT_SPEC.md
2. Read ARCHITECTURE.md
3. Check DATABASE.md (if needed)
4. Implement the feature
5. Test
6. Update documentation (if required)

---

# Coding Standards

- TypeScript only
- Reusable components
- Feature-based architecture
- Server-first approach
- No duplicated code
- No unnecessary dependencies
- Keep files small and maintainable

---

# Security

- Never commit secrets
- Never expose Service Role Key
- Use Supabase Row Level Security
- Validate user input
- Follow least-privilege principles

---

# Deployment

Deployment instructions are available in

```
docs/DEPLOYMENT.md
```

---

# Environment Setup

Environment configuration is documented in

```
docs/ENVIRONMENT_SETUP.md
```

---

# AI Development

If using an AI coding assistant:

Read these documents first:

1. docs/MASTER_PROMPT.md
2. docs/PROJECT_SPEC.md
3. docs/ARCHITECTURE.md
4. docs/AI_RULES.md

These files define the project architecture and development standards.

---

# Current MVP Scope

Included

- Authentication
- Dashboard
- Search
- Anime Details
- My Diary
- Favorites
- Ratings
- Profile
- Settings

Not Included

- Streaming
- Downloads
- Social Features
- Comments
- Reviews
- Friends
- Notifications
- Premium
- Mobile App

---

# License

Private Project

Not licensed for public distribution at this stage.