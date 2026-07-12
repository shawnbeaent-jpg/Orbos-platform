# CLAUDE.md — ORBOS Platform

This file loads into every Claude Code session in this project. Keep it accurate and under ~200 lines; update it whenever a convention changes.

## What this project is

ORBOS is a business development platform for a professional odor removal company in Metro Atlanta, GA. It replaces/extends an Excel CRM tracker + standalone route planner artifact with a real web app. Target markets: apartment/senior-living/property-management communities, auto dealerships, and hotels — routes dispatch from Dallas, GA, max 10 stops per route.

Full context: `docs/ORBOS_Platform_Roadmap.md` (phased build plan), `docs/DATA_MODEL.md` (schema notes).

## Stack

- Next.js (App Router) + TypeScript
- PostgreSQL via Prisma ORM (`prisma/schema.prisma`)
- Tailwind CSS
- Auth.js for authentication
- `@anthropic-ai/sdk` for AI agent calls (lead scoring, email drafting)

## Build & test commands

- `npm run dev` — start local dev server
- `npm run build` — production build (run before considering any phase "done")
- `npx prisma migrate dev` — apply schema changes locally
- `npx prisma studio` — inspect the database visually
- `npm run lint` — lint before committing

## Conventions

- All database access goes through Prisma — no raw SQL unless a query genuinely can't be expressed otherwise.
- API routes live in `app/api/**/route.ts` and return typed JSON; validate input with `zod` before touching the database.
- UI components in `components/`, page-level layout in `app/**/page.tsx`.
- Priority values are always one of exactly: `"A"`, `"B"`, `"C"` — matching the CRM tracker's scoring.
- Pipeline stages are always one of: `New Lead, Contacted, Qualified, Appointment Set, Proposal Sent, Closed Won, Closed Lost` — matching the CRM tracker's Status column. Don't invent new stage names.
- Money values stored as integers (cents) in the database, formatted as dollars only at render time.
- Dates stored as ISO 8601 (`YYYY-MM-DD`) / Postgres `timestamp`, never as free text.
- Never auto-send an email or auto-change a prospect's status without an explicit user action — AI agent output is a suggestion until a human confirms it, per the "no invented facts, no unconfirmed changes" rule from the original ORBOS spec.

## Working style for this project

- Work one phase at a time (see `docs/ORBOS_Platform_Roadmap.md`). Propose a short plan before writing code for a new phase; wait for confirmation on anything that touches auth, payments, or sends real email.
- After finishing a phase, run `npm run build` and `npm run lint` and report the result before declaring it done.
- Prefer the smallest change that satisfies the phase's stated success test over a larger refactor, unless the existing code is actively blocking the task.
- If a request would mix multiple phases together (e.g., "also add the AI agents" while doing Phase 1 CRUD), flag that it's out of scope for the current phase and ask whether to proceed anyway.

## Do not

- Do not introduce a second database, ORM, or frontend framework "for flexibility." One stack, used consistently.
- Do not add authentication providers, payment processing, or third-party integrations that weren't asked for in the current phase.
- Do not fabricate business data (fake contact names, fake reviews, fake phone numbers). All prospect data comes from `prisma/seed.ts`, sourced from real business listings.
