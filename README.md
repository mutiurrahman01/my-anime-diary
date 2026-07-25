# 🎌 Anime Diary

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

</p>

A modern, production-ready anime tracking application built with **Next.js 16**, **Supabase**, and **TypeScript**.

Users can privately track the anime they have watched, manage favorites, rate anime, and maintain their own personal anime diary.

> **Anime Diary is NOT a streaming platform, social network, or anime download website.**

---

# 🌐 Live Demo

### Website

https://myanimediary.vercel.app

### GitHub Repository

https://github.com/mutiurrahman01/my-anime-diary

---

# 🚀 Project Status

| Item | Status |
|------|--------|
| Version | ✅ v1.0.0 |
| Deployment | ✅ Live on Vercel |
| Production Ready | ✅ Yes |
| SEO | ✅ Optimized |
| Google Search Console | ✅ Verified |
| Build | ✅ Passing |
| TypeScript | ✅ Clean |
| ESLint | ✅ Passing |

---

# ✨ Features

| Feature | Details |
|----------|---------|
| 🔐 Authentication | ✅ Email Signup, Login, Logout, Protected Routes |
| 🔍 Anime Search | ✅ Search anime from local database seeded via Jikan API |
| 📖 Anime Details | ✅ Detailed information with dynamic metadata and SEO |
| 📝 Diary CRUD | ✅ Add, Edit, Delete diary entries |
| ⭐ Ratings | ✅ Personal ratings (1–10) |
| ❤️ Favorites | ✅ Toggle and manage favorites |
| 📺 Watch Status | ✅ Plan to Watch, Watching, Completed, On Hold, Dropped |
| 🎬 Episode Progress | ✅ Track watched episodes |
| 📊 Dashboard | ✅ Personal statistics and recent activity |
| 📚 Diary Page | ✅ View all diary entries with real-time data |
| 💖 Favorites Page | ✅ View favorite anime |
| 👤 Profile | ✅ Avatar upload, username, bio, website editing |
| ⚙️ Settings | ✅ Change email, password, delete account |
| 🌙 Theme | ✅ Light & Dark Mode |
| 📱 Responsive Design | ✅ Mobile, Tablet & Desktop |
| ⚡ Loading States | ✅ Skeleton loaders |
| 📭 Empty States | ✅ Friendly empty screens |
| 🚨 Error Handling | ✅ Graceful error UI |
| 🔎 SEO | ✅ Dynamic Metadata, OpenGraph, Twitter Cards, JSON-LD |
| 🗺 Sitemap | ✅ sitemap.xml |
| 🤖 Robots | ✅ robots.txt |
| 🔐 Security | ✅ Supabase Row Level Security (RLS) |

---

# 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## 📁 Project Structure

```text
my-anime-diary/
│
├── docs/                               # Project documentation
│   ├── MASTER_PROMPT.md
│   ├── PROJECT_SPEC.md
│   ├── DATABASE.md
│   ├── UI_GUIDELINES.md
│   ├── ARCHITECTURE.md
│   ├── ENVIRONMENT_SETUP.md
│   ├── DEVELOPMENT_PLAN.md
│   ├── AI_RULES.md
│   └── DEPLOYMENT.md
│
├── public/                             # Static assets
│
├── scripts/                            # Utility scripts
│   ├── seed-anime.mjs                  # Seed anime from Jikan API
│   ├── check-slugs.mjs
│   ├── check-slugs-full.mjs
│   └── fix-slugs.mjs
│
├── src/
│   ├── app/                            # Next.js App Router
│   ├── components/                     # Reusable React components
│   ├── hooks/                          # Custom React hooks
│   ├── lib/
│   │   ├── actions/                    # Server Actions
│   │   └── supabase/                   # Supabase clients
│   ├── services/                       # Business logic layer
│   ├── types/                          # TypeScript definitions
│   └── utils/                          # Helper functions
│
├── supabase/
│   ├── migrations/                     # Database migrations
│   └── rollback/                       # Rollback scripts (optional)
│
├── .env.example                        # Environment variables template
├── .gitignore
├── AGENTS.md                           # AI agent instructions
├── components.json                     # shadcn/ui configuration
├── eslint.config.mjs                   # ESLint configuration
├── middleware.ts                       # Next.js middleware
├── next-env.d.ts
├── next.config.ts                      # Next.js configuration
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json                       # TypeScript configuration
```

# 📚 Documentation

Project documentation is available inside the **docs/** folder.

- MASTER_PROMPT.md
- PROJECT_SPEC.md
- DATABASE.md
- UI_GUIDELINES.md
- ARCHITECTURE.md
- ENVIRONMENT_SETUP.md
- DEVELOPMENT_PLAN.md
- AI_RULES.md
- DEPLOYMENT.md

---

# ⚙️ Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/mutiurrahman01/my-anime-diary.git

cd my-anime-diary
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create

```text
.env.local
```

Copy values from

```text
.env.example
```

Fill in

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

> Never commit `.env.local`

---

## 4. Apply Database Migrations

Run all SQL migration files inside your Supabase project.

This creates:

- profiles
- anime
- user_anime
- RLS Policies
- Indexes
- Triggers

---

## 5. Seed Anime Database (Optional)

```bash
npm run seed:anime
```

Imports starter anime data from the Jikan API.

---

## 6. Start Development Server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 📦 Production

Build

```bash
npm run build
```

Lint

```bash
npm run lint
```

Production Server

```bash
npm run start
```

---

# 🔐 Security

- ✅ Supabase Row Level Security (RLS)
- ✅ Protected Server Actions
- ✅ Secure Authentication
- ✅ Service Role Key never exposed to client
- ✅ Input Validation
- ✅ Least Privilege Access

---

# 📈 Lighthouse Scores

| Metric | Desktop | Mobile |
|---------|---------|---------|
| Performance | 98 | 95 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

---

# 🚫 Not Included

- Anime Streaming
- Anime Downloads
- Social Feed
- Reviews
- Comments
- Friends
- Notifications
- Premium Features
- Mobile App

---

# 🗺 Roadmap

## ✅ v1.0.0

- Authentication
- Anime Search
- Anime Details
- Diary CRUD
- Favorites
- Dashboard
- Profile
- Settings
- SEO
- Deployment

---

## 🚀 v1.1.0 (Planned)

- Google OAuth Login
- Forgot Password
- Password Reset
- Import from MyAnimeList
- Anime Recommendations
- Progressive Web App (PWA)

---

## 🔮 Future

- Reviews
- Public Profiles
- Follow System
- Notifications
- Admin Panel

---

# 🤝 Contributing

Contributions, suggestions and bug reports are welcome.

Please open an Issue or Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

See the **LICENSE** file for details.

---

# 🙏 Acknowledgements

- Next.js
- React
- Supabase
- shadcn/ui
- Tailwind CSS
- Jikan API
- Lucide Icons

---

<p align="center">

Built and maintained by **Muti Ur Rahman**

**Anime Diary v1.0.0**

</p>