# Claude Code Phased Prompts — High-End Kitchen & Bath Warehouse Command Center

Use these prompts in order when you want more control than the master prompt. Each prompt assumes Claude is operating inside the existing repository and has read all repository documentation, especially `docs/HIGH_END_KITCHEN_BATH_REQUIREMENTS.md`.

## Phase 0 — Repository audit and implementation plan

Inspect the entire repository. Read `docs/HIGH_END_KITCHEN_BATH_REQUIREMENTS.md` first. Do not write production code until you understand the prototype, base SQL, high-end extension, workflows, and acceptance tests. Create `IMPLEMENTATION_PLAN.md`, `ASSUMPTIONS.md`, `REQUIREMENTS_TRACEABILITY.md`, and `ARCHITECTURE_DECISIONS.md`. Identify what can be retained, what must be rewritten, schema corrections, security risks, category-specific data models, material-unit/serial strategy, selection revision strategy, chain-of-custody strategy, offline plan, testing plan, and deployment sequence. Do not stop for minor questions; document sensible assumptions.

## Phase 1 — Production scaffold and high-end design system

Create the production Next.js App Router and strict TypeScript application. Configure linting, formatting, environment validation, tests, protected layouts, mobile navigation, accessible design tokens, loading/error/empty states, and PWA shell. Recreate the prototype’s professional construction-operations hierarchy. Build reusable UI patterns for project status, approved-selection comparison, finish/spec badges, exception cards, photo evidence, room/phase grouping, high-value warnings, and mobile receiving steps. Use real Supabase seed data rather than hard-coded production records. Run build, type check, lint, and tests.

## Phase 2 — Supabase schema, authentication, organizations, and RLS

Convert `database/schema.sql` and `database/high_end_kitchen_bath_extension.sql` into ordered Supabase migrations. Correct any SQL issues. Implement organizations, profiles, roles, authentication, protected routes, private storage buckets, and Row Level Security. Implement project rooms/areas, design revisions, approved selections, project materials, material units, category-specific identities, storage classes, movement history, receiving, claims, loadouts, and reports. Create database tests proving tenant isolation, role restrictions, and private file isolation. Never place a service-role key in browser code.

## Phase 3 — Projects, rooms, design revisions, selections, and material lists

Build project CRUD and assignment for high-end kitchen and bathroom remodeling. Implement material gate classifications for pre-start-required, phase-required, deferred-template, and nonblocking-consumable materials. Deferred-template exceptions must be policy-controlled, manager-approved, audited, and linked to predecessor milestones and phase gates. Add remodel type, current design revision, rooms/areas, installation phases, trade partners, scope, and planned dates. Build a versioned selection register with client/designer approval, selection reference, manufacturer, model, finish, dimensions, handing, substitution rules, images, cut sheets, shop drawings, and change history. Build project material lists with category templates for cabinetry, stone/countertops, tile, plumbing, appliances, lighting, hardware, glass, waterproofing, and consumables. Support long-lead, critical-path, high-value, cost, returnability, and special-handling fields. Add validated CSV import/export and audit logging.

## Phase 4 — Deliveries, mobile receiving, BOL/PO/selection verification, camera, and scanning

Build delivery scheduling and a one-handed mobile receiving workflow. Compare the physical shipment against the PO, BOL, packing slip, material list, approved selection, and current design revision. Capture exact manufacturer, model, finish, size, handing, configuration, cabinet tags, dye lots, slab/bundle IDs, serials, accessory completeness, packaging condition, inspection level, concealed-damage deadline, driver acknowledgment, and storage assignment. Require the correct photo evidence. Implement barcode detection with a maintained fallback and manual entry. OCR or vision may suggest label values, but human confirmation is mandatory. Receiving must be transactional, idempotent, offline-capable, and tested for duplicate retries.

## Phase 5 — Category-specific inspection templates and material-unit control

Implement structured inspection templates for:

- Cabinet package completeness, tags, finish, doors/drawers, panels, fillers, moldings, hardware, and accessories
- Tile shade, dye lot, caliber, carton count, breakage, and overage
- Stone bundle/slab identity, dimensions, finish, cracks, chips, repairs, and selected-slab match
- Appliances, serial numbers, panel-ready configuration, door swing, voltage, and installation kits
- Plumbing rough/trim compatibility, finish, and complete component sets
- Glass dimensions, handing, fabrication revision, thickness, and hardware finish
- Lighting color temperature, voltage, drivers, dimming, and finish

Use material-unit child records for unique pieces and serialized products. Add tests for mixed lots, wrong finish, missing accessories, duplicate serials, and incomplete packages.

## Phase 6 — Claims, vendor deadlines, replacements, and financial recovery

Build automatic and manual claims for damage, shortage, wrong item, wrong finish, design-revision mismatch, lot mismatch, packaging damage, concealed damage, quality defects, and storage noncompliance. Track notice deadlines, driver/BOL notation, vendor/carrier responsibility, requested resolution, replacement ETA, rush cost, credit, restocking, replacement value, schedule impact, and recovery. Escalate before vendor notice deadlines expire. A closed claim must not fabricate usable quantity or automatically clear readiness.

## Phase 7 — Material requests, shared stock, storage, movements, and field loadout

Build warehouse-stock and outside-purchase requests with field-change, missing accessory, replacement, owner upgrade, punch item, and emergency reasons. Build shared inventory with a transaction ledger. Build compliant storage-location rules for climate control, padding, no-stack, upright/A-frame, keep-dry, secure cage, oversize, and shelf-life-controlled materials. Build project material movements, staging by room/trade/phase, field loadout manifests, installer acknowledgment, returns, and surplus tracking. Never overwrite history to represent movement.

## Phase 8 — Server-enforced whole-project and optional phase readiness

Implement the default whole-project Ready to Start gate exactly as specified. Do not treat a deferred-template item as received. When organization policy permits a deferred exception, require approval, predecessor milestone, template target, fabrication lead time, required-on-site date, and a phase-specific gate. Also support configurable phase-readiness views without weakening the company’s default whole-project rule. Show every passed and failed control, blocking material, room, trade, owner, deadline, and corrective action. Restrict final approval to Administrator or Warehouse Manager. Automatically revoke readiness after a design revision, quantity change, specification mismatch, storage failure, lost movement, reopened claim, or incomplete checklist. Prove the client cannot bypass the gate.

## Phase 9 — Dashboards, reports, alerts, and exports

Build executive, warehouse, PM, purchasing/selections, receiving, claim, storage, and delivery views. Reports must show unapproved selections, outdated design revisions, long-lead risk, wrong finish/model/handing/lot/serial, cabinet package shortages, tile/stone lot conflicts, concealed-damage deadlines, noncompliant storage, unacknowledged loadouts, and project readiness by project, room, trade, and phase. Add live drill-down, immutable submitted snapshots, print styles, CSV, PDF, and notification deduplication. Reconcile report totals in tests.

## Phase 10 — Offline/PWA hardening and field usability

Complete the installable PWA, service worker, offline receiving drafts, photo persistence, sync indicators, idempotency keys, conflict resolution, and retries. Test on mobile-sized Chromium and WebKit emulation. Confirm that large photo queues, weak connectivity, and duplicate submissions do not corrupt quantities or evidence. Document actual browser limitations instead of claiming unsupported reliability.

## Phase 11 — Security, QA, performance, deployment, and handoff

Run final RLS, storage, server-validation, role-escalation, upload, rate-limit, audit, transaction, and tenant-isolation reviews. Test high-value accounting visibility by role. Run accessibility, mobile, performance, and failure-state reviews. Remove placeholders and dead code. Apply migrations to an empty environment, seed realistic high-end kitchen and bathroom data, run all tests, and complete deployment, backup/recovery, warehouse SOP, receiving checklist, PM training, and administrator documentation. Produce a final traceability report showing each requirement, implementation location, and passing test.
