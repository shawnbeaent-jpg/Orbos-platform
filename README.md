# GA Land Clearing — Website

A high-converting, lead-generation website for **GA Land Clearing**, a Marietta-based
land services company serving Georgia. Built with Next.js (App Router) + TypeScript +
Tailwind + Prisma + Zod. Branch: `claude/ga-land-clearing-build-lnoibj`.

> Positioning: *Georgia's Land Clearing and Site Preparation Partner* · Tagline: *From Overgrown to Build-Ready.*

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshawnbeaent-jpg%2FOrbos-platform&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL,ADMIN_USERNAME,ADMIN_PASSWORD&envDescription=Postgres%20connection%2C%20auth%20secret%2C%20production%20URL%2C%20and%20admin%20login&envLink=https%3A%2F%2Fgithub.com%2Fshawnbeaent-jpg%2FOrbos-platform%2Fblob%2Fclaude%2Fga-land-clearing-build-lnoibj%2Fdocs%2FDEPLOY.md&project-name=ga-land-clearing&repository-name=ga-land-clearing)

The button clones this repo into your account and deploys it. You'll be prompted for the
required environment variables below; create a Postgres database first (e.g. free at
[Supabase](https://supabase.com) or [Neon](https://neon.tech)).

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Postgres connection string |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your deployment URL (e.g. `https://ga-land-clearing.vercel.app`) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin dashboard login |

The build runs `prisma migrate deploy` automatically, so your database schema is created
on first deploy. Optional keys (email, SMS, maps, analytics, uploads) are in `.env.example`
and light up features when added. Full walkthrough, rollback, and go-live steps:
[`docs/DEPLOY.md`](docs/DEPLOY.md).

> **Note:** the button deploys the repository's **default branch**. Merge PR&nbsp;#2 first so
> your deploy includes admin auth, database migrations, and file uploads.

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
