# BEA ENT. Command Hub

Multi-role artist management, marketing, tour logistics, and financial tracking platform for independent labels, artist managers, and DIY musicians. Built with React 18, Vite, TypeScript, and Tailwind CSS in the "Gold-Standard Noir" theme.

This is a standalone project living inside the `orbos-platform` repo, separate from the ORBOS CRM app at the repo root.

## Quick start

```bash
cd bea-ent-hub
npm install
npm run dev
```

Open http://localhost:5173. Pick a role on the login screen to see the interface adapt (Admin, Manager, Indie Artist, Music Producer, PR, Booking Agent, Artist, Assistant, Editor).

Press `Ctrl+K` / `Cmd+K` anywhere in the app to open the Universal Command palette.

## Status

All 18 modules are implemented against an in-memory mock state engine (`src/state/AppContext.tsx`) seeded with fictional data (`src/data/mockData.ts`). There is no backend — this is a front-end prototype/demo of the full product surface.
