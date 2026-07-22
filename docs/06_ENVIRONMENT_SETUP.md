# ENVIRONMENT SETUP

Project: My Anime Diary

Version: 1.0

---

# Goal

This document explains how to configure the project environment.

It does NOT explain deployment.

It only covers local development.

---

# Required Accounts

Before starting, create accounts for:

- GitHub
- Supabase
- Vercel (later)

---

# Required Software

Install:

- Node.js (LTS)
- Git
- VS Code

---

# Project Structure

The environment files must exist in the project root.

Example:

my-anime-diary/

├── .env.local
├── package.json
├── next.config.ts
├── src/
└── ...

---

# Environment File

Create

.env.local

Do NOT commit this file to Git.

---

# Required Variables

The project currently requires:

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

For server-side account deletion only:

SUPABASE_SERVICE_ROLE_KEY=

---

# Where To Get These Values

Supabase Dashboard

↓

Project

↓

Settings

↓

API

Copy

- Project URL
- anon public key
- service_role key for server-only admin actions

Do NOT use the Service Role Key in the frontend.

---

# Naming Rules

Public variables must start with

NEXT_PUBLIC_

Server-only secrets must NOT use this prefix.

---

# Git Rules

Never commit

.env.local

Never commit

API Keys

Never commit

Secrets

Never commit

Service Role Keys

---

# .env.example

The repository should include

.env.example

Example

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

No real values should be stored in this file.

---

# Team Setup

Every developer creates their own

.env.local

using the project values.

The file should never be shared through Git commits.

---

# Changing Variables

If environment variables change

Restart the Next.js development server.

---

# Security Rules

Never expose

- Service Role Key
- Database Password
- Personal Access Tokens

Only expose values intended for the browser.

The service role key must remain server-only and must never be referenced in client components.

---

# Verification Checklist

Before running the project:

✓ .env.local exists

✓ Project URL added

✓ Anon Key added

✓ No secrets committed

✓ Development server restarted

---

# Documentation Rule

Whenever a new required environment variable is introduced:

- Update this document
- Update .env.example
- Update README.md