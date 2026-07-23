# High-End Kitchen & Bath Warehouse Command Center

A mobile-first warehouse and project-material control prototype for remodeling contractors managing multiple high-end kitchen and bathroom projects at the same time.

The system is designed for finish-sensitive, high-value, often custom or nonreturnable materials where the correct quantity alone is not enough. It tracks exact approved selections, models, finishes, dimensions, lot information, condition, storage, claims, staging, and field release.

## What this starter includes

- Project dashboard with whole-project readiness status
- High-end kitchen and bathroom sample projects
- Per-project material lists organized by room, trade, and installation phase
- Manufacturer, model, finish, dimensions, selection reference, lot/dye-lot, slab, cabinet-tag, and serial tracking
- Delivery receiving with BOL, PO, packing-slip, and approved-selection verification
- Camera/photo capture for load condition, product labels, approved finish comparison, damage, and storage evidence
- Barcode/SKU scanning through the browser Barcode Detection API when supported, with manual fallback
- Damage, shortage, wrong-item, wrong-finish, lot-mismatch, packaging, storage, and quality claim concepts
- Special handling and storage controls for cabinetry, stone, tile, fixtures, appliances, glass, and finish products
- Last-minute warehouse, Home Depot, Lowe's, and supply-house material requests
- Scheduled deliveries, revised ETAs, delays, and long-lead tracking concepts
- Daily and weekly operational reports
- Complete project audit history
- Automatic **Ready to Start** gate
- Production-oriented Supabase/PostgreSQL base schema and high-end extension
- Claude master prompt and phased implementation prompts

## Run the browser prototype

No installation is required.

1. Download and unzip this folder.
2. Open `index.html` in a modern browser.
3. For camera access, barcode scanning, and more reliable local file behavior, serve it locally:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Important prototype limitation

The browser prototype stores demo data and uploaded photos in `localStorage`. It is suitable for reviewing workflows, not for production operations. The production build must use authenticated users, PostgreSQL, private object storage, Row Level Security, server-side validation, and transactional receiving/readiness operations.

## Required production stack

- Next.js App Router and TypeScript
- Supabase PostgreSQL, Auth, private Storage, Realtime where useful, and Row Level Security
- Mobile-first PWA
- Server-side validation and audit logging
- Private storage for photos, approved selections, shop drawings, BOLs, packing slips, receipts, warranty information, and claims
- In-app notifications with configurable email/SMS providers

## Default roles

- Administrator
- Warehouse Manager
- Project Manager
- Receiver / Warehouse Associate
- Purchasing / Selections Coordinator
- Executive / Read-only

## High-end Ready to Start rule

A project can be finally approved **Ready to Start** only when:

1. The current design revision and required client/designer selections are approved.
2. Every required material line has the required usable quantity.
3. Manufacturer, model, finish, dimensions, handing, and configuration match the approved selection.
4. Required tile dye lots, stone bundles/slabs, cabinet tags, and serial numbers are verified.
5. Receiving inspection level, photos, BOL, delivery ticket, and packing-slip controls pass.
6. Special handling and storage requirements pass.
7. No blocking damage, shortage, wrong-item, wrong-finish, lot-mismatch, quality, packaging, storage, or document claim remains open.
8. Material is grouped and staged by project, room, trade, and installation phase.
9. Cabinet, trim, accessory, rough-in, and installation-kit completeness checks pass where applicable.
10. The loadout plan and Project Manager final review are complete.
11. An Administrator or Warehouse Manager grants final approval.

Any later controlling change automatically revokes readiness.

## Folder guide

- `index.html` — browser prototype shell
- `styles.css` — responsive design system
- `app.js` — high-end kitchen/bath prototype logic and demo data
- `database/schema.sql` — production database and RLS starter
- `database/high_end_kitchen_bath_extension.sql` — mandatory domain-specific schema extension
- `docs/HIGH_END_KITCHEN_BATH_REQUIREMENTS.md` — controlling domain requirements
- `docs/CATEGORY_INSPECTION_TEMPLATES.md` — cabinetry, stone, tile, plumbing, appliance, glass, lighting, and finish-product inspection rules
- `docs/WAREHOUSE_LAYOUT_AND_LABELING.md` — practical small-warehouse zones, material flow, and label standards
- `docs/CLAUDE_COPY_PASTE_START_PROMPT.md` — concise command to start Claude Code
- `docs/CLAUDE_MASTER_PROMPT.md` — master Claude Code build command
- `docs/CLAUDE_PHASE_PROMPTS.md` — staged Claude implementation prompts
- `docs/WORKFLOWS_AND_CONTROLS.md` — warehouse operating workflows and controls
- `docs/ACCEPTANCE_TESTS.md` — acceptance and security tests
- `docs/UPGRADE_SUMMARY_HIGH_END_V2.md` — summary of the high-end specialization
- `templates/high_end_material_import.csv` — sample structured import template
