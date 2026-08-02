# GA Land Clearing — Website

A high-converting, lead-generation website for **GA Land Clearing**, a Marietta-based
land services company serving Georgia. Built with Next.js (App Router) + TypeScript +
Tailwind + Prisma + Zod. Branch: `claude/ga-land-clearing-build-lnoibj`.

> Positioning: *Georgia's Land Clearing and Site Preparation Partner* · Tagline: *From Overgrown to Build-Ready.*

## Quick start

```bash
npm install                 # also runs prisma generate
cp .env.example .env.local  # optional to boot; set DATABASE_URL to persist leads
# optional local database:
docker compose up -d
npx prisma migrate deploy   # apply schema (needs DATABASE_URL)
npm run seed:leads          # optional demo leads for the admin pipeline
npm run dev                 # http://localhost:3000
```

The site boots and captures leads even **without** a database — leads just aren't
persisted until `DATABASE_URL` is set. Admin lives at `/admin` (set `ADMIN_USERNAME` +
`ADMIN_PASSWORD` + `NEXTAUTH_SECRET` to require sign-in).

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server |
| `npm run build` | Prod build (`prisma generate && next build`) |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm test` | Lead-scoring unit tests (no runner dep) |
| `npm run prisma:deploy` | Apply migrations (`prisma migrate deploy`) |
| `npm run seed:leads` | Seed demo leads |

## Project map

- `app/` — pages (home, services, service-areas, commercial, about, projects, faq,
  contact, request-quote, legal, admin) + `api/` routes + `sitemap.ts`/`robots.ts`.
- `components/` — Header, Footer, LeadForm, hero, cards, map, analytics, auth UI, etc.
- `lib/` — `site.ts` (company facts), `services.ts`, `locations.ts`, `leadScore.ts`,
  `leadSchema.ts`, `notify.ts`, `auth.ts`, `admin.ts`.
- `prisma/schema.prisma` + `prisma/migrations/` — data model & migrations.

## Docs
- `docs/GA_LAND_CLEARING_BUILD.md` — what was built and why.
- `docs/DEPLOY.md` — Vercel + Postgres deployment, env vars, rollback, go-live checklist.

## Before go-live
Edit `lib/site.ts`: real **phone**, **email**, and **domain** (`site.url`) — they flow
into every CTA, canonical URL, JSON-LD, and the sitemap.

---
*This repository began as the ORBOS platform scaffold; see `docs/ORBOS_Platform_Roadmap.md`
for that original context. The GA Land Clearing build lives alongside it on this branch.*
