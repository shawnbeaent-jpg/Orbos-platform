# Deploying GA Land Clearing

The site runs anywhere Next.js runs. These steps use **Vercel + a Postgres host**
(Supabase, Neon, or Vercel Postgres), which matches the intended stack.

## 0. Prerequisites
- A Postgres database URL (Supabase / Neon / Vercel Postgres).
- A Vercel account connected to the GitHub repo.

## 1. Database
Create a Postgres database and copy its connection string. Then apply the schema:

```bash
export DATABASE_URL="postgresql://…"
npm ci
npm run prisma:deploy      # runs prisma migrate deploy (applies prisma/migrations)
# optional demo data for the admin pipeline:
npm run seed:leads
```

Locally you can instead run `docker compose up -d` (see `docker-compose.yml`) and use
`DATABASE_URL="postgresql://galc:galc@localhost:5432/galandclearing?schema=public"`.

## 2. Environment variables (set in Vercel → Project → Settings → Environment Variables)

**Required for a real deployment**
| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Postgres connection (leads + admin) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | your production URL, e.g. `https://galandclearing.com` |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | admin dashboard login (both required to lock `/admin`) |

**Optional (features light up when present)**
`RESEND_API_KEY`, `LEAD_INBOX` · `TWILIO_ACCOUNT_SID`/`TWILIO_AUTH_TOKEN`/`TWILIO_FROM` ·
`GOOGLE_MAPS_API_KEY`/`NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` ·
`NEXT_PUBLIC_GA4_MEASUREMENT_ID`/`NEXT_PUBLIC_META_PIXEL_ID` ·
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY` · `SENTRY_DSN` · `ANTHROPIC_API_KEY`.

See `.env.example` for the full list.

## 3. Deploy
Vercel auto-detects Next.js. `vercel.json` sets the build to
`prisma generate && prisma migrate deploy && next build`, so **migrations run on every
deploy** (make sure `DATABASE_URL` is set, or the build will fail by design).

- Import the repo in Vercel.
- Set the Production Branch (either merge this branch to `main`, or point Production at
  `claude/ga-land-clearing-build-lnoibj`).
- Add the env vars above and deploy.

## 4. Post-deploy checklist
- [ ] Home, a service page, a county/city page, `/request-quote` load.
- [ ] Submit a test quote → lands on `/thank-you` with a `GLC-…` id.
- [ ] `/admin` requires login; lead appears in the pipeline; CSV export works.
- [ ] `sitemap.xml` and `robots.txt` resolve; update `site.url` in `lib/site.ts` to the
      real domain (canonicals/sitemap use it) and set the real phone/email.
- [ ] Point DNS at Vercel; verify `NEXTAUTH_URL` matches the final domain.

## Rollback
Every deploy is immutable on Vercel — use **Deployments → … → Promote to Production** on a
previous good build to roll back instantly. Database migrations are forward-only; to undo a
schema change, ship a new migration.

## Before go-live (edit `lib/site.ts`)
Replace the placeholder **phone number** and **email**, and set the real **domain** in
`site.url`. These flow into canonicals, JSON-LD, sitemap, and every call/text CTA.
