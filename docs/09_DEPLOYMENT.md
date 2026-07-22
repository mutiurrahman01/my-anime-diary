# DEPLOYMENT

Project: My Anime Diary

Version: 1.0

---

# Goal

This document defines the production deployment process.

Target Platform

- Vercel
- Supabase

The deployment process must be repeatable and documented.

---

# Deployment Strategy

Production deployment uses:

GitHub

↓

Vercel

↓

Supabase

Every deployment should come from the main branch.

Never deploy local code directly to production.

---

# Production Requirements

Before deployment, verify:

- Project builds successfully
- TypeScript has zero errors
- ESLint passes
- Environment variables are configured
- Database migrations are applied
- Authentication works
- Row Level Security (RLS) is enabled

Do not deploy if any of these checks fail.

---

# Environment Variables

Production environment must contain:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

Do not expose any secret keys to the browser.

`SUPABASE_SERVICE_ROLE_KEY` is required for the account deletion action and must remain server-only.

---

# Git Workflow

Development

↓

Commit

↓

Push to GitHub

↓

Automatic Vercel Deployment

Avoid editing production directly.

---

# Build Verification

Run before every deployment:

npm install

npm run build

The build must complete successfully.

Fix all errors before deployment.

---

# Vercel Project

Configure:

- Framework: Next.js
- Root Directory: Project Root
- Build Command: Default
- Output: Default

Do not change defaults unless required.

---

# Supabase

Production database should:

- Enable RLS
- Use production environment variables
- Keep schema synchronized with migrations

Never modify production tables manually.

---

# Deployment Checklist

Before Deploy

- Build passes
- No TypeScript errors
- No ESLint errors
- Environment variables configured
- Database migrations complete
- Authentication tested

After Deploy

- Homepage loads
- Login works
- Logout works
- Protected routes work
- Search works
- Add to Diary works
- Rating works
- Favorites work
- Dark Mode works
- Light Mode works
- Mobile layout verified

---

# Rollback

If a deployment introduces critical issues:

- Restore the previous deployment
- Investigate the issue
- Fix locally
- Redeploy

Never hot-fix production without testing.

---

# Monitoring

After deployment verify:

- Browser console has no errors
- Network requests succeed
- Authentication sessions persist
- Database operations succeed

---

# Security Checklist

Verify:

- RLS enabled
- No Service Role Key exposed
- No secrets committed
- HTTPS enabled
- Environment variables configured correctly

---

# Documentation

Whenever deployment changes:

Update

- README.md
- ENVIRONMENT_SETUP.md
- DEPLOYMENT.md

---

# Definition of Successful Deployment

Deployment is successful only if:

- Build succeeds
- Application is accessible
- Authentication works
- Database connectivity works
- No critical console errors
- Core MVP features function correctly