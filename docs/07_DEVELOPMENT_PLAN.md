# DEVELOPMENT PLAN

Project: My Anime Diary

Version: 1.0

Status: Planning

---

# Goal

This document defines the complete development roadmap.

The AI must follow this order.

Do not skip phases.

Do not implement future features early.

---

# Development Rules

- Complete one phase before starting the next.
- Every phase must compile successfully.
- Every phase must be reviewed.
- Do not leave broken code.
- Do not create placeholder implementations.

---

# Phase 1 — Project Setup

Tasks

- Initialize Next.js project
- Configure TypeScript
- Configure Tailwind CSS
- Install shadcn/ui
- Configure ESLint
- Configure Prettier (optional)
- Configure path aliases
- Create project structure
- Create Git repository
- Connect Supabase

Deliverable

A clean project that runs successfully.

---

# Phase 2 — Database

Tasks

- Create database schema
- Create tables
- Create relationships
- Create indexes
- Enable RLS
- Create RLS policies
- Generate TypeScript types

Deliverable

Working database with security enabled.

---

# Phase 3 — Authentication

Tasks

- Register
- Login
- Logout
- Forgot Password
- Google Login
- Protected Routes
- Session Persistence

Deliverable

Users can securely authenticate.

---

# Phase 4 — Layout

Tasks

- Root Layout
- Header
- Sidebar
- Theme Toggle
- Mobile Navigation
- Footer (if required)

Deliverable

Complete application shell.

---

# Phase 5 — Dashboard

Tasks

- Statistics Cards
- Recent Activity
- Empty State
- Loading State

Deliverable

Functional dashboard.

---

# Phase 6 — Anime

Tasks

- Anime Table
- Anime Details
- Search
- Filters
- Pagination (if required)

Deliverable

Working anime catalogue.

---

# Phase 7 — My Diary

Tasks

- Add Anime
- Remove Anime
- Rating
- Favorites
- Sorting
- Filtering

Deliverable

Fully functional private diary.

---

# Phase 8 — Profile

Tasks

- User Profile
- Avatar
- Statistics
- Edit Profile

Deliverable

Working profile page.

---

# Phase 9 — Settings

Tasks

- Theme
- Change Password
- Delete Account

Deliverable

Settings page complete.

---

# Phase 10 — Testing

Tasks

- Fix TypeScript errors
- Fix ESLint errors
- Responsive testing
- Accessibility review
- Performance review

Deliverable

Stable MVP.

---

# Phase 11 — Deployment

Tasks

- Configure environment variables
- Deploy to Vercel
- Production verification

Deliverable

Production-ready MVP.

---

# Definition of Done

A phase is complete only when:

- Builds successfully
- No TypeScript errors
- No console errors
- Responsive
- Accessible
- Documentation updated

Do not continue to the next phase until the current phase is complete.

---

# AI Instructions

Before every phase:

1. Explain the implementation plan.
2. List affected files.
3. Implement only that phase.
4. Verify the result.
5. Stop and wait for approval.

Never implement multiple phases at once unless explicitly requested.

---

# Future Phases (Not MVP)

- Episode Tracking
- Personal Notes
- Custom Lists
- Statistics
- Import / Export
- Mobile App
- Premium
- Admin Panel