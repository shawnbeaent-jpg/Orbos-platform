# ORBOS Claude Code — Phase Prompts

Copy one prompt at a time into Claude Code, inside the `orbos-platform` project directory. Wait for each phase to pass its success test (see the Roadmap doc) before starting the next one. Claude Code already has `CLAUDE.md` loaded automatically — these prompts assume that context.

---

## Phase 1

```
We're starting Phase 1 of the roadmap in docs/ORBOS_Platform_Roadmap.md.

Goal: working CRUD screens for Companies, Contacts, and Pipeline entries, backed by
the existing Prisma schema and seed data.

Do this in order:
1. Confirm the Prisma schema and seed.ts are consistent, then run the migration and
   seed so we have 27 real companies in a local Postgres database.
2. Build API routes under app/api/companies (GET list with filtering by priority/status,
   POST create, PATCH update, DELETE) and equivalent for app/api/contacts. Validate all
   input with zod before touching the database.
3. Build a Companies list page at app/companies/page.tsx: a filterable, sortable table
   (filter by priority and status, sort by name or dateAdded) showing the real seeded
   data.
4. Build a Company detail page at app/companies/[id]/page.tsx showing full company info,
   its contacts, and its pipeline entries, with inline edit and a delete-with-confirmation
   flow.
5. Build a simple "Add Company" form that matches the fields in prisma/schema.prisma.

Propose your file-by-file plan first before writing code. After you're done, run
npm run build and npm run lint and tell me the result.
```

## Phase 2

```
We're starting Phase 2 of the roadmap. Goal: basic login so only I can access this data.

1. Set up Auth.js (NextAuth) with email/password or magic-link login — pick whichever is
   simpler to run locally without extra infrastructure, and tell me which you chose and why.
2. Protect all /app/companies, /app/dashboard, and /app/api/** routes behind auth —
   redirect unauthenticated users to a login page.
3. Seed one owner-role user (me) using an email I'll provide.
4. Don't build a full permission matrix — just owner vs. viewer, per CLAUDE.md. Viewer
   role isn't used yet; just have the field ready on the User model.

Ask me for my email before seeding the user. Propose your plan first. After you're done,
run npm run build and confirm auth actually blocks an unauthenticated request to
/api/companies.
```

## Phase 3

```
We're starting Phase 3. Goal: an executive dashboard and a Kanban pipeline board,
matching the content of the Dashboard tab in the original ORBOS_CRM_Tracker.xlsx.

1. Build app/dashboard/page.tsx showing: total companies, count by priority (A/B/C),
   count by status, open pipeline value (sum of estDealValueCents where status isn't
   Closed Won/Lost), and weighted pipeline value (sum of estimatedValueCents * probability
   from PipelineEntry). Use real aggregation queries via Prisma, not client-side math on
   a full data dump.
2. Build a Kanban-style board at app/pipeline/page.tsx with one column per PipelineStage,
   showing PipelineEntry cards with company name and value. Support drag-and-drop between
   columns that updates the stage via a PATCH request.
3. Make sure the dashboard numbers update immediately (revalidate or refetch) when a
   pipeline entry's stage changes.

Propose your plan first, including which charting approach you'll use (keep it simple —
recharts is already a reasonable default, no need to introduce a new library).
```

## Phase 4

```
We're starting Phase 4. Goal: port the standalone route planner artifact's logic into
the app, reading live company data instead of a CSV upload.

Reference algorithm (already validated in the standalone artifact):
- HQ / route start: Dallas, GA at lat 33.9229, lng -84.8460
- Nearest-neighbor traversal across ALL selected companies from HQ (not chunk-then-optimize
  — sequence the full list first, then split into groups of 10 in visiting order, since
  that keeps each route geographically tight)
- Distance: haversine formula between lat/lng, multiplied by a 1.35 road factor to
  approximate real driving distance
- Drive time: distance / 32 mph average speed

Build:
1. app/routes/page.tsx: a page where I can select a set of companies (checkbox list,
   filterable by priority/city) and generate an optimized route.
2. An API route that runs the nearest-neighbor algorithm above and returns route groups
   with per-stop distance and drive time.
3. Save the generated route to the Route/RouteStop tables so it persists.
4. A simple route display: ordered stop list per route with cumulative distance/time,
   similar to what's in the standalone route planner artifact.

Propose your plan first. After building, generate a route from all 27 seeded companies
and confirm it produces 3 routes (10/10/7) similar to what's documented in our chat history.
```

## Phase 5a

```
We're starting Phase 5. Goal: ONE working AI agent end-to-end before adding more —
Lead Scoring — using the Anthropic API.

1. Add an API route app/api/agents/lead-score/route.ts that takes a companyId, pulls
   that company's industry/size/notes from the database, calls the Claude API
   (@anthropic-ai/sdk, model claude-sonnet-5) with a system prompt asking it to suggest
   an A/B/C priority and a one-sentence justification, and returns the result.
2. Store every call's input/output in the AgentSuggestion table — do NOT write to
   Company.priority directly. This is a suggestion, not an automatic change.
3. Build a UI affordance on the company detail page: a "Suggest priority" button that
   calls this route, shows the suggestion and reasoning, and only updates the company's
   real priority if I click "Accept."
4. Keep the system prompt honest: it should only use the data actually on the company
   record, and should say so if there's not enough information to score confidently.

Do not add any other agents yet, even if it seems easy — Phase 5 is scoped to this one,
fully working, before we add Email Drafting in a follow-up session. Propose your plan first.
```

## Phase 5b

```
Now add a second agent: Email Drafting, following the same pattern as Lead Scoring
(AgentSuggestion table, human-confirms-before-anything-is-sent).

1. app/api/agents/draft-email/route.ts: takes a companyId and a sequence step
   ("intro" | "proof_offer" | "breakup"), pulls the company's industry to pick the right
   vertical framing (apartments / dealerships / hotels — see the outreach playbook
   templates we already wrote), and calls the Claude API to fill in the bracketed fields
   with real company data.
2. UI: on the company detail page, a "Draft outreach email" section with a step selector
   and a text area showing the draft, editable before it's used anywhere.
3. This does NOT send email yet (that's Phase 6) — it only produces text I can copy or,
   once Phase 6 exists, send.

Propose your plan first.
```

## Phase 6

```
We're starting Phase 6. Goal: actually send the drafted emails and log them.

1. Set up Resend (or your recommendation if you have a good reason for a different
   provider — tell me the tradeoff) for transactional email sending.
2. Add a "Send" action next to the email draft UI from Phase 5b that sends the email to
   a contact's email address and creates a log entry (reuse or extend AgentSuggestion,
   or propose a new EmailLog model if that's cleaner — tell me which and why).
3. Update the company's lastContactDate when an email sends successfully.
4. Add basic guardrails: don't allow sending to a company with no contact email on file;
   confirm before sending (no silent sends).

Propose your plan first. Send a real test email to an address I provide before we call
this phase done.
```

## Phase 7

```
We're starting Phase 7, the last one on the current roadmap. Goal: a live, working,
mobile-usable app.

1. Do a responsive pass on Companies, Dashboard, Pipeline, and Routes pages — check at
   375px width (phone) and fix anything broken or unusable.
2. Add basic error handling: a global error boundary, and user-facing error messages
   instead of raw stack traces on any failed action.
3. Set up Sentry (free tier) for error logging in production.
4. Prepare for Vercel deployment: environment variable checklist, confirm the Prisma
   build step works in Vercel's build environment, and write deployment steps into
   docs/DEPLOY.md.
5. Do NOT deploy without me explicitly confirming — walk me through what you're about to
   do first, since this touches real hosting and a real database connection string.

Propose your plan first.
```

## Resuming a session / checking status

```
Read CLAUDE.md and docs/ORBOS_Platform_Roadmap.md. Tell me what phase we're on based on
what's implemented so far, and what you'd propose doing next.
```

## End-of-session wrap-up

```
Run npm run build and npm run lint. If both pass, summarize what changed this session in
plain language (for a non-engineer to read later), and remind me to commit.
```

## If something breaks

```
Something's broken: [describe what you were doing and what happened]. Don't guess —
reproduce it, find the actual cause, and explain what you find before fixing it.
```
