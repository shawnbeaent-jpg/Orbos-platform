# BEA ENT. Command Hub — Phase 2 Master Prompt
### Legal Onboarding, AI Concierge, Real-Data Networking, Rollout Automation & Travel

This is the build spec for Phase 2. Phase 1 shipped the 18-module shell (React 18 + Vite + TypeScript + Tailwind, "Gold-Standard Noir" theme) with role-based access and an in-memory mock state engine. Phase 2 turns four of those modules from prototypes into real, data-backed, partially-automated tools, and adds one new capability (AI Concierge) that cuts across all of them.

Read the **Guardrails** section first — it governs every module below and is not optional.

---

## 0. Guardrails (apply to every section below)

1. **No auto-send, ever.** Anything that leaves the app and reaches a real third party — an email to a venue, a pitch to a curator, a DM to a promoter — is drafted by the AI and staged for review. A human clicks "Send." No exceptions, no "smart defaults" that skip the click.
2. **No fabricated business data.** Venue names, promoter contacts, radio station listings, curator emails — every record in these modules must come from a real data source (an API, a user-imported list, or manual entry) or be visibly, unmistakably marked as a demo/sample record. Never present invented contact info as if it were real.
3. **Real registration sites get deep links and status tracking, not automated form-filling.** ASCAP, BMI, SESAC, SoundExchange, the U.S. Copyright Office, and distributors like DistroKid/TuneCore do not expose public self-serve signup APIs. "Connect to real registration sites" means: correct deep links, a guided checklist, and locally-tracked completion status — not scripted account creation on the user's behalf.
4. **Every external integration needs its own credentials and its own go/no-go decision.** Nothing in this doc should be wired up against a live API without first confirming which provider, what it costs, and who's paying for the account. Build the UI and the integration seam; stop at the point where a real API key would be required, and flag it.
5. **Secrets never touch the frontend.** Phase 1 has no backend. Every feature here that needs an API key (Claude, a travel API, a radio directory, a maps/places API) requires a minimal backend or serverless proxy — the key lives server-side, the frontend calls your own endpoint.

---

## 1. Role & Access Model (formalizing what Phase 1 built)

No new roles. Codify the existing matrix as the source of truth for every module added below — new nav items must declare which roles see them by extending `ROLE_NAV_ACCESS` in `src/state/AppContext.tsx`, not by ad hoc checks in components.

| Role | Full-spectrum? | Owns |
|---|---|---|
| Admin | Yes | Everything, plus Security Ledger + Debugger |
| Manager | Yes | Everything for their roster |
| Indie Artist | Self-scoped, full toolkit | Roadmap, Campaign, Vault, Financials, Legal, Markets, Chat, Profile — **plus the new Legal Onboarding Wizard and AI Concierge (Sections 2–3)** |
| Artist (managed) | Self-scoped, no back-office | Campaign, Vault, Logistics, Bookings, Financials, Chat, Profile |
| Producer | Beat pipeline | Producer Console, Financials, Legal, Chat, Profile |
| PR/Publicist | Outreach | Outreach CRM, **Networking + Rollout Tool (Section 5)**, Campaign, Chat, Profile |
| Booking Agent | Live ops | Bookings, Logistics, **Show/Tour Planner (Section 6)**, Legal, Chat, Profile |
| Assistant | Tactical | Vault, Logistics, Chat, Profile |
| Editor | Content | Vault, Chat, Profile |

New modules attach to existing roles per the bold entries above — no role gets a standalone new tab unless noted.

---

## 2. Legal Foundation → Indie Registration Wizard

**Where:** Extends `LegalFoundationModule.tsx`, surfaced prominently in `IndieRoadmap.tsx`'s Pre-Release stage.

**Goal:** Walk an Indie Artist (or a Manager on behalf of an Artist) through every step required to legally register and actually collect royalties — not just contract templates.

**Steps to model as a tracked checklist** (each with: what it is, why it matters, a real deep link, and a manual "mark complete" toggle stored per-artist):

1. **Business entity setup** — LLC/sole proprietorship decision, EIN application (link: IRS EIN online application).
2. **Performance Rights Organization (PRO) registration** — pick one of ASCAP / BMI / SESAC (mutually exclusive; the wizard should explain the difference, not auto-pick), register as a songwriter, register your publishing entity.
3. **SoundExchange registration** — separate from a PRO, covers digital/satellite performance royalties; commonly missed by indie artists.
4. **U.S. Copyright Office registration** — for the composition and/or sound recording, with the real copyright.gov e-filing link.
5. **ISRC / UPC codes** — needed before distribution; link to a registrant-code provider or explain that most distributors (DistroKid/TuneCore/CD Baby) issue these automatically.
6. **Distribution setup** — pick a DSP aggregator, connect your existing account if you have one (no OAuth automation unless the provider publishes a partner API — check before promising this).
7. **Publishing administration (optional)** — explain what a publisher/admin does vs. self-publishing, with links to common self-serve admins (e.g., Songtrust, CD Baby Pro).
8. **Mechanical royalties (MLC)** — U.S.-specific: register with the Mechanical Licensing Collective for streaming mechanicals.

**UI requirements:**
- Progress ring/percentage per artist, persisted in the same state engine pattern as `indieMilestones`.
- Each step expandable with a plain-language "why this matters" blurb and the real link (open in new tab).
- A note field per step so a user can log confirmation numbers/account names locally — **never** store PRO/SSN/EIN credentials in this app; that's a hard no, flag it explicitly in the UI copy.

---

## 3. AI Concierge (cross-cutting)

**Where:** A persistent chat affordance (bottom-right launcher, not the existing team Chat) available to Indie Artists everywhere, and contextually surfaced inside the Legal Wizard, Campaign Architect, and Producer Console.

**What it does:**
- Answers questions about the registration steps in Section 2 in plain language ("what's the difference between ASCAP and BMI," "do I need an LLC before I register with a PRO").
- Can pre-fill draft pitch copy in Outreach CRM and Campaign Architect (already partially stubbed via the Lyrical DNA analyzer — extend that pattern).
- Cannot see or touch other artists' data outside the current role's scope — same `ROLE_NAV_ACCESS` boundary applies to what context gets passed into the model.

**Technical requirement (blocks everything else in this section):**
- Stand up a minimal backend — a Node/Express server or serverless function (Vercel/Netlify function, or a small Fastify app) — that holds `ANTHROPIC_API_KEY` server-side and exposes one endpoint, e.g. `POST /api/concierge`, following the same pattern ORBOS uses with `@anthropic-ai/sdk`.
- Frontend calls that endpoint only; no key, no direct Anthropic calls from the browser.
- This is the one piece of Phase 2 that cannot ship as a static frontend — decide hosting for the backend before starting.

---

## 4. Subscription Tiers with Travel Booking

**Where:** Extends `SubscriptionVault.tsx`.

**Goal:** Make the Hustler/Mogul comparison real enough to gate an actual feature, not just copy.

- Add a third tier or keep two, but make **travel booking assistance** a Mogul-only line item: AI-assisted itinerary building (flights + hotel) tied into `LogisticsView.tsx`.
- **Decision needed before building:** which travel API. Realistic options: **Duffel** (flights, developer-friendly, supports test mode) or **Amadeus for Developers** (broader but heavier onboarding). Both require a real business account and API credentials — this is not something to fake with mock flight data presented as bookable.
- Until a provider is chosen and credentials exist, keep this feature in "Request travel concierge" mode: the AI Concierge (Section 3) drafts an itinerary request that a human (Assistant/Manager role) fulfills manually — same human-in-the-loop pattern as outreach.
- Commission/pricing differences between tiers stay as configurable values in `ManagerSettings.tsx`, not hardcoded.

---

## 5. Networking Tool → Rollout & Outreach Automation

**Where:** Extends `NetworkingView.tsx` and `OutreachCRM.tsx`, both already PR-owned.

**Goal:** Let the app actually help build and work a real contact list for a rollout, without ever sending anything without a human click.

- **Contact sourcing:** integrate a real business-data source for venues/promoters/curators rather than typed-in guesses — e.g., Google Places API (for venues by city) plus a user-maintained import (CSV/manual entry) for promoter and curator relationships, since there's no public "promoter directory" API. Every imported record should show its source (API vs. manually entered) in the UI.
- **Rollout planning:** connect `CampaignArchitect.tsx` milestones to Networking contacts — a milestone like "curator seeding wave 1" should be able to pull a filtered contact list (by genre/region/category) directly from Networking rather than being a free-text checkbox.
- **AI-drafted outreach:** the Concierge (Section 3) drafts a personalized pitch per contact, staged in `OutreachCRM.tsx` exactly like the existing "Compose Pitch" flow — sending still requires the existing human click, and actually dispatching email needs a transactional email provider (e.g., Resend or Postmark) wired into the backend from Section 3, with the sender identity being the real user's own verified email/domain, not a shared BEA ENT address.

---

## 6. Show/Tour Planner — Venues × Promoters × Cities

**Where:** New capability inside `BookingsView.tsx` + `LogisticsView.tsx`, owned by Booking Agent + Manager.

**Goal:** For a target city, show real venues, cross-reference which promoters in Networking work that city, and let the Booking Agent build a routing plan.

- Venue data: Google Places API (venues by type/city) or a live-events API like Bandsintown/Songkick if available for venue+capacity data — pick one and document the tradeoff (Places gives location/category but not capacity or booking contact; events APIs give more music-industry-specific data but narrower coverage).
- Promoter cross-reference: pulls from the same Networking contact list built in Section 5, filtered by city — this is why Sections 5 and 6 must share one contact model, not two separate lists.
- Output: a routing view (map or ordered list) respecting the existing "max 10 stops per route, dispatch logistics" pattern already established for ORBOS — reuse that routing concept rather than inventing a second one.

---

## 7. Radio Station Directory

**Where:** New section inside `MarketsView.tsx`.

**Goal:** Real station listings per market city — not a "hottest stations" ranking, since true trending/spin data requires a paid panel (Mediabase/Nielsen BDS) that's a real subscription decision, not something to fake.

- Use the free, open **Radio-Browser API** to list real stations by city/genre/format as a starting point (station name, stream/website, genre tags — all real, publicly listed data).
- Label this clearly as a station directory, not a chart/ranking, unless/until a paid spin-data provider is actually purchased and integrated.
- Surface alongside the existing `streamingDensity`/`tourDemand` metrics already in `MarketCity`, as a new `stations` panel per city card.

---

## 8. Data & Integration Summary (what needs a decision before code)

| Feature | Data source needed | Requires |
|---|---|---|
| AI Concierge | Claude API | Backend + `ANTHROPIC_API_KEY` |
| Legal Wizard links | None (static real URLs) | Nothing — buildable now |
| Travel booking | Duffel or Amadeus | Business account + API keys + choice of provider |
| Venue data | Google Places (or events API) | API key, billing account |
| Promoter/curator contacts | User-imported + manual entry | No API — just good data-entry UX |
| Outreach sending | Resend/Postmark or similar | Backend + verified sender domain |
| Radio directory | Radio-Browser API | Free, no key required — buildable now |
| "Hottest" radio ranking | Mediabase/Nielsen BDS | Paid panel subscription — separate decision |

**Buildable immediately, no new credentials:** Legal Wizard checklist + links (Section 2), Radio-Browser directory (Section 7), the shared Networking/Booking contact model (Sections 5–6 data layer, sourced by manual entry until Places is wired in).

**Blocked on a decision from you:** AI Concierge backend hosting, travel API provider, Places/events API provider, outreach email provider.

---

## 9. Suggested build order

1. Legal Foundation wizard (Section 2) — no new infra, pure UI/state work on top of the existing pattern.
2. Radio-Browser directory (Section 7) — first real external API call, low stakes, no key required, good test of the "real data, clearly labeled" principle before doing anything with contacts.
3. Minimal backend + AI Concierge (Section 3) — unlocks everything else that needs drafting.
4. Networking/Outreach real-data model (Section 5) — decide Places vs. manual-only first.
5. Show/Tour Planner (Section 6) — depends on Section 5's contact model.
6. Travel booking (Section 4) — last, since it's the highest-stakes integration (real money, real bookings).
