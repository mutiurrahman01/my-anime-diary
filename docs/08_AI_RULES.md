# AI RULES

Project: My Anime Diary

Version: 1.0

---

# Purpose

This file defines how AI coding agents must work inside this repository.

These rules apply to every task.

---

# Before Writing Code

Always:

1. Read the existing code.
2. Read the relevant documentation in /docs.
3. Understand the current architecture.
4. Identify the minimum required changes.
5. Explain the implementation plan.

Never start coding immediately.

---

# Source of Truth

Follow these documents in order:

1. PROJECT_SPEC.md
2. DATABASE.md
3. ARCHITECTURE.md
4. UI_GUIDELINES.md
5. DEVELOPMENT_PLAN.md

If documentation conflicts with code, stop and explain the conflict.

Never guess.

---

# Change Policy

Only change files related to the requested task.

Never refactor unrelated code.

Never rename files unless required.

Never move folders without approval.

---

# Code Quality

Always

- Use TypeScript
- Use strict typing
- Reuse existing code
- Write readable code

Never

- Use any unless unavoidable
- Duplicate logic
- Leave TODOs
- Leave placeholder code

---

# UI Rules

Before creating a component:

Search for an existing reusable component.

If one exists:

Reuse it.

Do not duplicate it.

---

# Database Rules

Never modify database schema directly.

If schema changes are needed:

- Create migration
- Update DATABASE.md
- Update generated types

---

# Security

Never expose:

- Service Role Key
- Secrets
- Tokens
- Passwords

Always validate user input.

Always respect Row Level Security.

---

# Dependencies

Before installing a package:

Check whether the project already has a suitable solution.

Do not add unnecessary dependencies.

---

# Error Handling

Every async operation must handle:

- Loading
- Success
- Error
- Empty State

Never ignore exceptions.

---

# Documentation

If implementation changes:

Update documentation where applicable.

Never leave documentation outdated.

---

# Performance

Prefer:

- Server Components
- Lazy loading where appropriate
- Small reusable components

Avoid unnecessary client components.

---

# Git Rules

Generate small logical changes.

Never rewrite the whole project.

Never generate unrelated edits.

---

# Definition of Done

A task is complete only if:

- Build succeeds
- TypeScript has no errors
- Existing functionality is preserved
- Documentation is updated (if needed)

---

# If Unsure

Do not guess.

Explain what information is missing.

Ask for clarification before making assumptions.