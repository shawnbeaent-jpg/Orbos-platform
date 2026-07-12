# ORBOS Platform

Business development platform for a Metro Atlanta odor removal company. Starter scaffold — see `docs/ORBOS_Platform_Roadmap.md` before building anything further.

## Quick start

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL at minimum
npx prisma migrate dev --name init
npx prisma db seed          # loads the 27 real prospects
npm run dev
```

Then open http://localhost:3000.

## Where to look first

1. `CLAUDE.md` — instructions Claude Code reads automatically every session
2. `docs/ORBOS_Platform_Roadmap.md` — the phased build plan
3. `docs/ORBOS_ClaudeCode_Prompts.md` — copy-paste prompts for each phase
4. `prisma/schema.prisma` — the data model
5. `prisma/seed.ts` — the real prospect data

## Status

Phase 0 (foundation) complete: schema, seed data, project config. Everything past that (working CRUD screens, auth, dashboard, AI agents, deploy) is unbuilt — start with Phase 1 in the roadmap.
