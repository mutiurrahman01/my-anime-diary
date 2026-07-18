<!-- BEGIN:nextjs-agent-rules -->

# Next.js: Read official docs first

Before implementing any Next.js feature, always read the relevant documentation inside:

node_modules/next/dist/docs/

Official documentation is the source of truth.

<!-- END:nextjs-agent-rules -->

# Repository Rules

Read these documents in order before writing code:

1. docs/MASTER_PROMPT.md
2. docs/PROJECT_SPEC.md
3. docs/ARCHITECTURE.md
4. docs/DATABASE.md
5. docs/UI_GUIDELINES.md
6. docs/AI_RULES.md
7. docs/DEVELOPMENT_PLAN.md

---

# Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- PostgreSQL
- Vercel

---

# Working Rules

- Understand the existing code before making changes.
- Never rewrite unrelated files.
- Reuse existing components.
- Keep changes small and focused.
- Never expose secrets.
- Never use the Service Role Key in frontend code.
- Follow feature-based architecture.
- Use TypeScript strict mode.
- Keep files maintainable.
- Update documentation if architecture or database changes.

---

# Build Rules

Before considering a task complete:

- No TypeScript errors
- No ESLint errors
- Build succeeds
- Existing functionality still works