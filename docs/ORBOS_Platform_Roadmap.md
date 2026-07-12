# ORBOS Platform — Build Roadmap

What this is: a realistic, phased plan to turn the ORBOS system (CRM tracker, route planner, outreach playbook, 27 real prospects) into an actual hosted web application, built with Claude Code. This is written to be followed literally, one phase at a time.

What this is not: a promise that any single Claude Code session will produce a finished enterprise SaaS platform. Each phase below is scoped to what one focused Claude Code session can realistically complete and test. Skipping phases or asking for everything at once is the #1 way these builds go sideways — Claude Code (like any engineer) does its best work with a clear, bounded task and a way to verify it worked.

## Part 1 — Set Up Claude Code

This is a real tool that runs on your computer, in a terminal, against a real project folder. Here's how to get it running.

### 1. Requirements

- macOS 13+, Windows 10+ (native or WSL), or Linux (Ubuntu 20.04+/Debian 10+)
- A Claude subscription that includes Claude Code: Pro ($20/mo), Max, Team, or Enterprise — the free tier does not include it. (Or an Anthropic Console/API account, billed per token.)
- A terminal. On Windows, either PowerShell or WSL (WSL is recommended if you want a Linux-style environment).

### 2. Install (native installer — no Node.js required)

macOS / Linux / WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Alternative — Homebrew (macOS/Linux):

```bash
brew install --cask claude-code
```

Alternative — WinGet (Windows):

```powershell
winget install Anthropic.ClaudeCode
```

After installing, close and reopen your terminal so your PATH updates, then verify:

```bash
claude --version
```

### 3. First run

```bash
cd path/to/orbos-platform      # the starter project folder (see Part 2)
claude
```

This opens a browser window for you to log in with your Claude account. Trust the project directory when prompted. From there you're in an interactive session — Claude Code reads the project as needed, proposes edits, and asks for your approval before changing files (you can approve one at a time or turn on "accept all" for a session).

### 4. The one command worth running immediately

Once inside a project, run:

```
/init
```

This has Claude Code scan the codebase and generate a CLAUDE.md file — persistent instructions that load into every future session (build commands, conventions, architecture notes). I've already written a starter CLAUDE.md for this project (see the accompanying file) so `/init` will refine it rather than start from nothing.

### 5. Useful commands as you go

- `/cost` — check token usage for the session
- `/compact` — compress conversation history when it's getting long
- `claude mcp add` — register an MCP server (database, GitHub, etc.)
- `claude doctor` — diagnose install/auth/config issues

## Part 2 — Architecture

| Layer              | Choice                                                                                      | Why                                                                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------| --------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Frontend + backend  | **Next.js (App Router), TypeScript**                                                        | One framework for UI and API routes; huge ecosystem; Claude Code works with it fluently                                                                          |
| Database            | **PostgreSQL + Prisma ORM**                                                                 | Real relational data (companies, contacts, pipeline, routes) with type-safe queries                                                                              |
| Auth                | **Auth.js (NextAuth)**                                                                      | Handles login/sessions without hand-rolling security                                                                                                              |
| Hosting             | **Vercel** (app) + **Neon or Supabase** (managed Postgres)                                  | Both have generous free tiers, zero server management, and deploy straight from GitHub                                                                            |
| AI agent calls      | **Anthropic API** (`@anthropic-ai/sdk`)                                                     | Each "agent" (lead scoring, email drafting, etc.) is a scoped API call with its own prompt and tools, triggered by your backend — not a separate standing process |
| Styling             | **Tailwind CSS**                                                                             | Fast, consistent, matches what's already in the route planner artifact                                                                                            |
| Integrations        | **MCP servers** (Google Calendar, Notion, etc. already available; Airtable/Canva as needed) | Standardized way to connect external tools instead of hand-building each API client                                                                              |

This is a monolith, not microservices — correct for a single-operator business at this stage. Don't let anyone (including an AI) talk you into Kubernetes for a 27-prospect CRM.

## Part 3 — Phased Roadmap

Each phase = one or a few focused Claude Code sessions. Don't start a phase until the previous one is tested and working.

### Phase 0 — Foundation (this delivery)

- Project scaffold: Next.js + TypeScript + Tailwind + Prisma
- Database schema matching the existing CRM tabs (Companies, Contacts, Pipeline, Marketing Assets, Routes)
- CLAUDE.md project instructions
- This roadmap + phase prompts
- You do: create a GitHub repo, push this starter, create a free Neon/Supabase Postgres database, get Claude Code running locally.

### Phase 1 — Data Layer & CRUD

- Import the 27 real prospects from the CRM tracker into the real database
- Build working create/read/update/delete screens for Companies, Contacts, Pipeline
- Success test: you can add, edit, and delete a prospect in the browser and it persists after refresh.

### Phase 2 — Auth & Roles

- Login for you (and any future team member)
- Basic role distinction (owner vs. viewer) — skip complex permission matrices until you actually have a team
- Success test: logged-out users can't see the data; you can log in and out cleanly.

### Phase 3 — Dashboard & Pipeline Views

- Executive dashboard (KPIs, pipeline by stage, priority breakdown) — same content as the CRM tracker's Dashboard tab, now live and interactive
- Kanban-style pipeline board (drag a deal between stages)
- Success test: dashboard numbers update immediately when you change a deal's stage.

### Phase 4 — Route Planner Integration

- Port the route planner artifact's logic (nearest-neighbor from Dallas GA, 10-stop cap) into the app, reading live from the database instead of a CSV upload
- Success test: selecting a set of companies generates a route matching what the standalone artifact produces.

### Phase 5 — AI Agent Layer (the actual "agents")

- Start with one agent, fully working, before adding more: Lead Scoring — given a new company's industry/size/notes, the Anthropic API call suggests an A/B/C priority. Store its reasoning, don't auto-overwrite your own scoring without confirmation.
- Then Email Drafting — generate a first-touch email using the outreach playbook's templates, filled with real company data.
- Each "agent" here is a Next.js API route that calls the Claude API with a specific system prompt and returns to the UI — not a separate autonomous process.
- Success test: you can trigger each agent from the UI, see its output, and accept or edit it before it's saved.

### Phase 6 — Email Sending & Outreach Automation

- Connect a real email provider (e.g., Resend or Postmark) to actually send the sequences from the outreach playbook
- Track opens/replies if the provider supports it
- Success test: a real test email sends and the CRM logs it.

### Phase 7 — Polish & Deploy

- Mobile-responsive pass
- Deploy to Vercel with the production database
- Basic error logging (Sentry free tier is enough at this scale)
- Success test: the live URL works from your phone.

## What's deliberately deferred

Multi-agent orchestration with 35 named roles, a "self-healing department," continuous learning pipelines, and enterprise RBAC are not on this roadmap. They're real concepts, but they only earn their complexity once you have real usage data and, likely, a team. Building them now would be building infrastructure for a company that doesn't exist yet. Revisit after Phase 7 is live and used for a few months.

## Part 4 — How to Run Each Phase

1. Open the phase's prompt from `ORBOS_ClaudeCode_Prompts.md`.
2. Paste it into Claude Code inside the project directory.
3. Let it propose a plan before writing code — Claude Code will often outline steps first; review before approving.
4. Test the success criteria above before moving to the next phase.
5. Commit to git after each working phase (`git add -A && git commit -m "Phase N: ..."`) so you always have a working checkpoint to roll back to.

## Time & Cost Reality Check

This isn't a weekend project. A working Phase 0–3 (a real CRM you and nobody else uses yet) is realistically 1–3 weeks of evening/weekend sessions for a motivated non-engineer working closely with Claude Code, longer if you're learning git and Next.js concepts as you go. Phases 4–7 add more time. Ongoing costs: Claude subscription (~$20+/mo), database hosting (free tier is fine early), domain name (~$12/yr), email provider (free tier covers low volume). Budget your time, not just your money — this is the honest tradeoff for owning custom software instead of paying for HubSpot/Salesforce.
