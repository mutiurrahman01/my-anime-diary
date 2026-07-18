# ARCHITECTURE

Project: My Anime Diary

Version: 1.0

---

# Goal

This document defines the complete software architecture of the project.

It is the single source of truth for:

- Folder Structure
- Routing
- Feature Organization
- Shared Components
- Business Logic
- Data Layer
- Authentication Layer
- Server Actions
- Naming Conventions

The architecture must remain clean, scalable and maintainable.

---

# Architecture Principles

The project follows these principles:

- Feature First
- App Router
- Server First
- Reusable Components
- Separation of Concerns
- Single Responsibility
- Type Safety
- Scalable Structure

Business logic should never live inside pages.

Pages compose the UI.

Business logic belongs to features, services and lib.

This follows Next.js App Router recommendations to keep routing separate from application logic. :contentReference[oaicite:0]{index=0}

---

# Technology Stack

Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

Backend

- Supabase

Database

- PostgreSQL

Deployment

- Vercel

---

# Project Structure

src/

app/

components/

features/

hooks/

lib/

services/

types/

utils/

constants/

styles/

docs/

public/

---

# Responsibilities

## app/

Only routing.

Contains

- layouts
- pages
- loading
- error
- not-found

Do NOT place business logic here.

---

## components/

Reusable UI only.

Examples

Button

Input

Modal

Card

Avatar

Theme Toggle

Navbar

Sidebar

These components must have no business knowledge.

---

## features/

Every major feature owns its code.

Example

features/

auth/

anime/

dashboard/

diary/

favorites/

profile/

settings/

Each feature may contain

components/

actions/

hooks/

schemas/

types/

services/

Feature folders should not depend directly on other feature folders unless explicitly approved. Shared logic belongs in shared modules. :contentReference[oaicite:1]{index=1}

---

## services/

Business services.

Examples

anime.service.ts

profile.service.ts

diary.service.ts

Services communicate with Supabase.

UI never directly talks to the database.

---

## lib/

Global libraries.

Examples

supabase/

auth/

validators/

formatters/

cache/

---

## hooks/

Reusable custom hooks.

Examples

useTheme

useDebounce

useMediaQuery

useSearch

---

## utils/

Pure helper functions.

Examples

date.ts

slug.ts

rating.ts

format.ts

---

## constants/

Application constants.

Example

Routes

Theme

Limits

Status

---

## types/

Shared TypeScript types.

Never duplicate interfaces.

---

## styles/

Global styles only.

Tailwind

Globals

Theme variables

---

# App Router Structure

app/

(layout)

(auth)

(dashboard)

page.tsx

layout.tsx

loading.tsx

error.tsx

not-found.tsx

Use Route Groups only for organization without changing URLs. :contentReference[oaicite:2]{index=2}

---

# Authentication Flow

Public Routes

Landing

Login

Register

Forgot Password

Protected Routes

Dashboard

Diary

Favorites

Profile

Settings

Middleware protects authenticated routes.

---

# Data Flow

UI

↓

Feature

↓

Service

↓

Supabase

↓

Database

Never skip layers.

---

# Server Components

Default

Server Components.

Only use Client Components when necessary.

Examples

Forms

Dropdowns

Dialogs

Search Input

Theme Toggle

This matches the App Router's server-first model. :contentReference[oaicite:3]{index=3}

---

# Server Actions

Server Actions belong inside the related feature.

Example

features/diary/actions/

add-anime.ts

remove-anime.ts

update-rating.ts

---

# Component Rules

Components should

Be reusable

Have one responsibility

Stay under 300 lines where possible

Receive typed props

Avoid unnecessary state

---

# Naming Convention

Components

PascalCase

AnimeCard.tsx

Hooks

camelCase

useTheme.ts

Utilities

camelCase

slug.ts

Types

PascalCase

Anime.ts

Folders

kebab-case

anime-details

---

# Imports

Always use aliases.

Example

@/components

@/features

@/lib

Never use long relative imports.

---

# State Management

Priority

1 React State

2 Context

Avoid additional state libraries unless genuinely required.

---

# Error Handling

Every async operation must support

Loading

Success

Error

Empty State

Retry

---

# Validation

Use Zod for validation.

Client validation

+

Server validation

Never trust client input.

---

# Environment Variables

Never hardcode secrets.

Only access environment variables through a dedicated configuration layer.

---

# Documentation Rule

Whenever a new feature is added

Update

- PROJECT_SPEC.md
- DATABASE.md (if schema changes)
- README.md (if setup changes)

---

# AI Rules

Before generating code

1 Read existing files.

2 Reuse existing components.

3 Reuse services.

4 Reuse hooks.

5 Never duplicate logic.

6 Never regenerate the entire project.

7 Only modify affected files.

---

# Definition of Good Architecture

A new developer should be able to understand the project within 15 minutes.

Deleting one feature should not affect unrelated features.

Shared code should live in shared folders.

Business logic should never be scattered across pages.

The project should scale from MVP to production without major restructuring.