# The Confident Learning Co. — Website and Backend

Next.js App Router public website and integration backend for The Confident Learning Co. hybrid platform. See `../confident-learning-hybrid-build-playbook/` for the full build playbook, docs, and prompts.

## Stack

Next.js (App Router, TypeScript, Server Components), Tailwind CSS, shadcn/ui (Radix), Motion + GSAP, Neon PostgreSQL + Drizzle ORM, Zod, Stripe, Vitest/Testing Library/Playwright/axe.

## Development commands

```bash
pnpm dev            # start dev server
pnpm build          # production build
pnpm start          # start production server
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint
pnpm test           # vitest unit/integration tests
pnpm test:watch     # vitest watch mode
pnpm test:e2e       # playwright end-to-end tests
pnpm format         # prettier --write
pnpm db:generate    # generate a Drizzle migration from schema changes
pnpm db:migrate     # apply migrations to DATABASE_URL
pnpm db:studio      # open Drizzle Studio
```

## Environment

Copy `.env.example` to `.env.local` and fill in values. All external side-effect flags default to `false`; see `docs/08-EnvironmentVariables.md` in the playbook for details. Never commit real secrets.

## Project structure

See `docs/04-TechnicalArchitecture.md` in the playbook for the full folder-structure rationale (`src/app`, `src/components`, `src/db`, `src/domain`, `src/integrations`, `src/jobs`, `src/lib`, `src/config`).
