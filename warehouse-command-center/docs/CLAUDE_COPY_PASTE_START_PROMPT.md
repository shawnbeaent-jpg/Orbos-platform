# Copy/Paste Prompt for Claude Code

Open the `warehouse-command-center` repository and execute the following instruction:

---

Act as the principal software architect, senior full-stack engineer, database-security engineer, warehouse operations designer, and high-end residential remodeling material-control specialist.

Read every repository file before changing code. The controlling requirements are:

1. `docs/CLAUDE_MASTER_PROMPT.md`
2. `docs/HIGH_END_KITCHEN_BATH_REQUIREMENTS.md`
3. `docs/CATEGORY_INSPECTION_TEMPLATES.md`
4. `docs/WORKFLOWS_AND_CONTROLS.md`
5. `docs/WAREHOUSE_LAYOUT_AND_LABELING.md`
6. `docs/ACCEPTANCE_TESTS.md`
7. `database/schema.sql`
8. `database/high_end_kitchen_bath_extension.sql`

This system is for a small warehouse supporting project managers who each manage four to five simultaneous high-end kitchen and bathroom remodels. The company’s default rule is that a project does not start until all required project material is received, accepted, verified against the current approved design selection, stored correctly, staged, documented, and finally approved.

Do not build a generic inventory application. Build category-specific controls for cabinetry, stone/countertops, tile, plumbing, appliances, lighting, hardware, glass, waterproofing, and finish-sensitive materials. A physically delivered item must not become usable when the model, finish, dimensions, handing, design revision, lot/dye lot, slab, cabinet tag, serial, accessory package, documentation, condition, or storage requirements fail.

Use Next.js App Router, strict TypeScript, Supabase PostgreSQL/Auth/private Storage/RLS, Zod, secure server mutations, a mobile-first PWA, immutable audit history, transactional receiving, idempotent offline synchronization, and automated unit/integration/database/RLS/end-to-end tests.

Begin by creating:

- `IMPLEMENTATION_PLAN.md`
- `ASSUMPTIONS.md`
- `REQUIREMENTS_TRACEABILITY.md`
- `ARCHITECTURE_DECISIONS.md`
- A migration plan that converts both SQL starter files into ordered migrations

Then build the production application phase by phase using `docs/CLAUDE_PHASE_PROMPTS.md`.

Mandatory controls include:

- Project rooms, trades, phases, design revisions, approved selections, and material gate classifications
- Strict whole-project default readiness with controlled deferred-template exceptions for field-measured countertops, shower glass, and similar materials
- Material-unit records for cabinet tags, cartons, lots, slabs, serials, and fabricated glass
- BOL, PO, packing-slip, label, quantity, finish/specification, condition, and storage verification
- Required receiving photos and driver exception documentation
- Automatic claims for damage, shortage, wrong item, wrong finish, lot mismatch, packaging damage, quality defects, and storage noncompliance
- Concealed-damage deadlines and escalation
- Special storage classes and location validation
- Staging by project, room, trade, and phase
- Field loadout manifests and installer chain of custody
- Daily and weekly reports with live drill-down and immutable submitted snapshots
- A server-enforced whole-project Ready to Start gate with automatic revocation

Barcode, OCR, and image analysis may assist the receiver but must never independently approve material or pass readiness. Human confirmation is mandatory and must be audited.

Do not merely provide recommendations or pseudocode. Write the production code, migrations, tests, seed data, SOP documentation, and deployment instructions. Do not weaken or remove requirements to make development easier. Run build, type check, lint, migrations, and tests after every major phase. Continue through the definition of done unless a verified technical blocker exists; document any blocker precisely with evidence and the safest next implementation step.

---
