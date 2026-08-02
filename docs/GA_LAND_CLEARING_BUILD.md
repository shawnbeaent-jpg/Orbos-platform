# GA Land Clearing — Website Build

A high-converting, lead-generation website for **GA Land Clearing**, a Marietta-based
land services company serving Georgia. Built on the existing Next.js + Prisma + Tailwind
stack in this repository (branch `claude/ga-land-clearing-build-lnoibj`).

> **Positioning:** Georgia's Land Clearing and Site Preparation Partner
> **Tagline:** From Overgrown to Build-Ready.

## What was built

A production-shaped MVP covering the highest-value slices of the full spec, with every
page carrying a clear conversion path.

### Pages (40+ routes)
- **Home** — hero with 5-second value prop, compact lead form, audience segments,
  services grid, before/after slider, 5-step process, differentiators, coverage map,
  commercial band, FAQ, final CTA.
- **Services** — hub + **12 data-driven service pages** from one template
  (`app/services/[slug]`): land clearing, brush clearing, forestry mulching, stump
  removal, grading, site development, excavation, right-of-way, storm cleanup, retention
  pond, residential, commercial. Each has overview, use cases, scope, benefits, FAQs,
  related services, a sticky quote form, and `Service` + `FAQPage` structured data.
- **Service Areas** — hub + **6 county** + **18 city** template pages, each with unique
  local context (no thin/duplicated content), `Service`/`areaServed` structured data.
- **Commercial** — builder / GC / realtor / PM segments with separate lead flows
  (`#bid`, `#builder`, `#realtor`), capabilities, and an "Invite Us to Bid" CTA.
- **About, Projects (before/after placeholders), FAQ, Contact.**
- **Request a Quote** — the full **7-step lead form**.
- **Legal** — Privacy, Terms, Accessibility (WCAG 2.2 AA statement).
- **Thank-you**, **404**.
- **Admin** — lead pipeline Kanban (10 stages), metrics, lead detail with stage updates,
  score override, notes, tasks, and CSV export.

### Lead system
- **Multi-step form** (`components/LeadForm.tsx`) — 7 steps, progress bar, chip inputs,
  file attach, review; shared compact variant in the hero.
- **API** (`app/api/leads/route.ts`) — Zod validation, honeypot, in-memory rate limit,
  distance-from-HQ lookup, **0–100 lead scoring** (`lib/leadScore.ts`), public lead ID,
  Prisma persistence, email/SMS notifications. **Degrades gracefully** with no DB or no
  provider keys (returns a lead ID + score, never crashes).
- **Scoring factors:** project size, property type, service intent, timeline, budget,
  ownership, location, completeness/uploads → category (Priority / Qualified / Needs
  review / Low quality), with manual override in admin.

### Brand & design system
- Full brand palette + typography (Space Grotesk / Inter via `next/font`, self-hosted).
- Original **logo system** (`components/Logo.tsx`) — horizontal / stacked / icon,
  light/dark, GA monogram with contour/grading motif.
- Dynamic **favicon** (`app/icon.tsx`) and **Open Graph image** (`app/opengraph-image.tsx`).
- Reusable components: Header (sticky, mobile menu), Footer, mobile Call/Text/Quote bar,
  Icon set, PageHero, CTABand, FAQ accordion, before/after slider, service-area map.

### SEO, security, a11y
- Per-page metadata + canonicals, `sitemap.xml`, `robots.txt`, JSON-LD (LocalBusiness,
  Service, FAQPage).
- Security headers incl. CSP (`next.config.js`), honeypot, rate limiting.
- Skip link, visible focus rings, semantic headings, labeled controls, AA-minded contrast.

## Running locally

```bash
npm install                 # also runs prisma generate
cp .env.example .env.local   # fill in DATABASE_URL to persist leads (optional to boot)
npx prisma migrate dev       # create tables (needs DATABASE_URL)
npm run dev                  # http://localhost:3000
```

`npm run build` and `npm run lint` both pass clean. The site boots and captures leads
even without a database — leads just aren't persisted until `DATABASE_URL` is set.

## Honest-content guardrails (per spec + repo rules)

No fabricated business facts. Placeholders are clearly labeled (project gallery, phone
number, email). No unverified claims (insurance, veteran-owned, awards, reviews). The
subcontractor-coordination model is disclosed in the footer, About, and legal pages. No
email/SMS is ever sent without configured providers and, for SMS, explicit consent.

## Not yet wired (needs decisions / credentials — escalation items)

These are stubbed with env vars + graceful no-ops, ready to enable:
- **Auth on `/admin`** — Auth.js is a dependency; `/admin` is currently unauthenticated
  and must be protected before production (banner shown in the dashboard).
- **Database** — provide `DATABASE_URL` (Supabase/Postgres) + run migrations.
- **Email (Resend)** / **SMS (Twilio)** — add keys to enable notifications.
- **Google Maps/Places** address autocomplete — key placeholder present.
- **Analytics (GA4/Meta), Turnstile, Sentry** — env placeholders present.
- **Secure file uploads** — form captures file references; wire cloud storage (e.g.
  Supabase Storage) to persist the files themselves.
- **AI "GA Land Advisor" assistant** — optional; not built this pass.

See `.env.example` for every variable.
