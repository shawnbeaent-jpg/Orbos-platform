# Claude Code Master Build Prompt

Copy everything below into Claude Code while the `warehouse-command-center` folder is open.

---

You are the principal software architect, senior full-stack engineer, construction operations manager, warehouse-control specialist, database security engineer, and QA lead for this project.

Build a production-grade **High-End Kitchen & Bath Warehouse Command Center** for a residential remodeling company whose project managers each manage approximately four to five luxury kitchen and bathroom projects and multiple trade crews at the same time.

The operating rule is strict: **a project cannot be released to the field or marked Ready to Start until every required project material is received in usable condition, matches the current approved design selection, is stored correctly, and all documentation, exception, staging, loadout, and approval controls pass.**

## Existing repository

Inspect every existing file before changing anything. The repository contains:

- A working browser prototype in `index.html`, `styles.css`, and `app.js`
- A production-oriented Supabase/PostgreSQL starter schema in `database/schema.sql`
- A mandatory high-end domain extension in `database/high_end_kitchen_bath_extension.sql`
- Mandatory domain requirements in `docs/HIGH_END_KITCHEN_BATH_REQUIREMENTS.md`
- Category inspection templates in `docs/CATEGORY_INSPECTION_TEMPLATES.md`
- Small-warehouse layout and label controls in `docs/WAREHOUSE_LAYOUT_AND_LABELING.md`
- Workflow and acceptance-test documents under `docs/`

Preserve the useful workflow logic and user experience, but rebuild the production application using the architecture below. Do not treat the browser `localStorage` prototype as the production data layer.

## Controlling high-end kitchen and bathroom scope

Read `docs/HIGH_END_KITCHEN_BATH_REQUIREMENTS.md` before designing the schema or user interface. Treat every requirement in that document as mandatory unless it conflicts with a security or data-integrity requirement.

This is not a generic warehouse or retail inventory application. The system must control high-value, finish-sensitive, frequently custom or nonreturnable materials such as cabinetry, panels, countertops, tile, stone, plumbing trim, rough-in valves, appliances, lighting, hardware, mirrors, shower glass, tubs, waterproofing systems, and specialty installation components.

The application must distinguish **quantity acceptance** from **specification acceptance**. A material does not count as usable merely because the correct number of boxes arrived. The receiver must verify the exact approved manufacturer, model, finish, color, dimensions, handing, configuration, design revision, lot/dye lot, slab, cabinet tag, serial number, accessory package, and storage requirements when applicable.

Build category-specific inspection templates rather than one generic checklist. Use structured child records for unique cabinets, cartons, slabs, lots, and serialized equipment. Do not hide category-specific data inside unsearchable notes or a single JSON blob when it should be indexed, validated, or reported.

Barcode, OCR, and image analysis may assist label reading and visual comparison, but must never be the sole authority for acceptance or readiness. Preserve the original evidence, show machine-suggested values separately, and require human confirmation.

High-end remodeling also includes field-measured products that cannot always be finally fabricated before work begins, especially countertops and shower glass. Do not fake receipt or quietly weaken the company rule. Implement explicit gate classifications for pre-start-required, phase-required, deferred-template, and nonblocking-consumable materials. Default to strict whole-project readiness. Permit a deferred-template exception only when organization policy allows it, the predecessor milestone and phase gate are documented, and an authorized manager approves it with an audit trail.

## Required production architecture

Use:

- Next.js App Router with TypeScript
- React Server Components where appropriate and client components only where interactivity requires them
- Supabase PostgreSQL, Auth, private Storage, Realtime where valuable, and Row Level Security
- Zod validation shared between client and server
- Server Actions or secure route handlers for mutations
- A mobile-first responsive PWA interface suitable for iPhone, Android, tablet, and desktop
- Automated testing with unit, integration, database/RLS, and end-to-end tests
- Structured application logging and an immutable business audit trail

Use currently supported package versions. Before adding a dependency, verify that it is maintained, needed, and compatible with the selected Next.js version. Prefer fewer dependable dependencies over a large package list.

## Core users and permissions

Implement these roles:

1. **Administrator** — manage organization settings, users, roles, all records, readiness rules, and final release.
2. **Warehouse Manager** — full project-material, receiving, staging, inventory, claim, report, and final-readiness authority.
3. **Project Manager** — create and maintain assigned projects, project material lists, requests, delivery schedules, and PM readiness review; no authority to bypass warehouse controls.
4. **Receiver / Warehouse Associate** — receive deliveries, verify BOLs, count and inspect material, capture photos, assign warehouse locations, and report exceptions; cannot grant final project readiness.
5. **Purchasing / Selections Coordinator** — maintain approved selections, design revisions, orders, vendors, delivery dates, request fulfillment, claims, credits, replacements, and revised ETAs.
6. **Executive / Read-only** — view dashboards and reports without changing operational records.

Enforce permissions in PostgreSQL Row Level Security and trusted server code. Hiding a button in the interface is not sufficient authorization.

## Required application modules

### 1. Executive dashboard

Show:

- Active projects
- Projects Ready to Start
- Projects blocked by incomplete materials
- Planned starts within 3, 7, and 14 days that are not ready
- Scheduled deliveries today and this week
- Delayed deliveries
- Open blocking claims
- Urgent material requests awaiting approval or fulfillment
- Warehouse low-stock items
- Actionable exception cards with owner and required next action

Every KPI must drill into the records that produced it.

### 2. Project control

Each project must include:

- Project number
- Client name
- Project address
- Assigned project manager
- Project tradesmen, subcontractors, or crews by trade
- Planned and actual start dates
- Priority
- Scope summary and notes
- Remodel type and current issued-for-construction or approved design revision
- Rooms/areas and installation phases
- Approved-selection register and revision history
- Project material list
- Delivery schedule and delay log
- Material requests
- Claims
- Photos and documents
- Readiness checklist
- Complete audit history from project setup through field release and completion

### 3. Project material list

Each material line must support:

- Product name and description
- Category and responsible trade
- Manufacturer, vendor, SKU, UPC, model, collection/series, purchase order, and unit of measure
- Room/area, installation phase, gate classification, predecessor milestone, selection reference, and design revision
- Exact finish/color/sheens, dimensions, handing, configuration, and approved substitution rules
- Cabinet tag, tile dye lot/shade/caliber, stone bundle/slab, appliance serial, glass fabrication ID, or other category-specific identifiers
- Handling class, storage requirements, high-value flag, long-lead flag, and critical-path flag
- Product image, approved-selection image, cut sheet, shop drawing, and specification documents
- Required, ordered, received, usable, damaged, rejected, short, and returned quantities
- Expected delivery date and status
- Warehouse zone, rack, bin, pallet, A-frame, padded bay, climate-controlled area, secure cage, or staging location
- Storage compliance and movement/chain-of-custody history
- Required versus optional flag
- Substitution approval and notes
- Link to orders, deliveries, receiving inspections, requests, claims, photos, and documents

Quantity calculations must be transactionally safe and must not allow silent negative inventory or impossible damaged quantities.

### 4. Delivery scheduling and delay control

Support:

- Vendor, carrier, driver/contact, PO, BOL, scheduled date and time window
- Delivery items and expected quantities
- Actual arrival and completion timestamps
- Delivery status
- Delay reason, responsible party, revised ETA, date discovered, and schedule impact
- Notification and escalation rules for late or schedule-critical deliveries
- Calendar and project views

### 5. Mobile receiving and BOL verification

Create a guided receiving workflow that a warehouse employee can complete with one hand on a mobile device.

The workflow must require the receiver to:

1. Select or scan the project/delivery.
2. Enter or scan the BOL/delivery ticket number.
3. Compare BOL line items to the expected project material list.
4. Scan barcode, UPC, SKU, or QR code when available.
5. Count received quantity.
6. Record damaged, rejected, and short quantities.
7. Inspect visible packaging and product condition.
8. Verify the current design revision and exact approved manufacturer, model, finish, dimensions, handing, configuration, lot/dye lot, slab, cabinet tag, serial, and required accessory package when applicable.
9. Select the inspection level: packaging/label, open-carton visual, full piece-by-piece, or deferred concealed inspection under vendor/manufacturer rules.
10. Capture required photos: overall load, every label/SKU, approved finish comparison, BOL, packing slip, staging location, and each damage exception.
11. Record whether the driver acknowledged exceptions.
12. Record whether the BOL was signed with exceptions or the delivery was rejected.
13. Record the concealed-damage notice deadline when full inspection is deferred.
14. Assign a warehouse location that satisfies the material handling class.
15. Save the receiving inspection and update project material totals atomically.

Do not allow a clean receiving completion when required inspection evidence is missing. Allow an authorized override only with a required reason and audit entry.

Use the browser Barcode Detection API when supported and provide a dependable fallback such as a maintained barcode library or manual entry. Camera capture must work on mobile browsers over HTTPS.

### 6. Damage, shortage, wrong-item, and quality claims

A receiving exception must be able to create a claim automatically.

Track:

- Claim number and type
- Project, material, delivery, inspection, vendor, and carrier
- Blocking versus nonblocking impact
- Description and evidence
- Driver acknowledgment and BOL notation
- Claim owner
- Notice date, response due date, aging, and escalation level
- Requested resolution
- Vendor reference
- Replacement ETA, credit status, and resolution
- Photos, documents, emails, notes, and audit history

Closing a claim must not automatically make a project ready unless usable quantities and all other readiness controls pass.

### 7. Material requests

Create mobile-friendly requests for:

- Warehouse stock pulls
- Home Depot, Lowe's, supply-house, or other vendor purchases
- Normal, urgent, and emergency priority
- Needed-by date and time
- Request reason and schedule impact
- Requested item, SKU, quantity, unit, substitution permission, and photo
- Approval, rejection, purchasing, pickup, delivery, receipt upload, fulfillment, and project charge allocation

Prevent unauthorized self-approval when separation of duties is configured.

### 8. Shared warehouse inventory

Project-specific purchased material remains tied to its project. Shared stock and consumables must support:

- On hand, committed, available, issued, returned, damaged, and adjusted quantities
- Zone/rack/bin
- Reorder point and reorder quantity
- Cycle counts
- Inventory transaction ledger
- Project allocation
- Low-stock and discrepancy alerts

Never update stock only by overwriting a total. Record inventory transactions and derive or reconcile balances.

### 9. Readiness gate

Implement a server-enforced readiness engine.

A project may receive final **Ready to Start** approval only when all configured required conditions are true:

- At least one required material line exists.
- Every required material line has usable quantity greater than or equal to required quantity.
- Every received required material line has a passed inspection.
- Required receiving photos and documents exist.
- BOL or delivery-ticket verification is complete.
- No open blocking damage, shortage, wrong-item, wrong-finish, lot-mismatch, packaging, quality, storage, or document claim exists.
- Current design revision and required client/designer selections are approved.
- Exact manufacturer, model, finish, dimensions, handing, configuration, and category-specific identities are verified.
- Tile/stone lot compatibility, cabinet package completeness, and rough-in/trim compatibility are verified when applicable.
- Special handling and storage requirements pass.
- All required project material is grouped and staged by project, room, trade, and installation phase in the warehouse.
- A field loadout plan and installer chain-of-custody package are complete.
- Any allowed deferred-template item has an authorized exception, predecessor milestone, template target, fabrication lead time, and phase-specific blocking rule; otherwise it remains a whole-project blocker.
- The project material list has been approved.
- The PM final material review is complete.
- Any organization-specific checklist items are complete.
- An authorized Administrator or Warehouse Manager grants final approval.

The final approval operation must run on the server in one transaction. Any later change to required material quantities, usable quantities, inspection status, BOL verification, blocking claims, or required checklist items must automatically revoke readiness and create an audit event.

Show exactly why a project is blocked and who owns each corrective action.

### 10. Daily and weekly reports

Daily warehouse report:

- Deliveries scheduled, received, partial, rejected, and delayed
- Materials received and staged
- Damage/shortage exceptions
- Open urgent requests
- Warehouse work completed
- Outstanding actions and owners
- Tomorrow's delivery plan

Weekly project-material report:

- Readiness and planned start by project
- Material-completion percentage
- Unapproved selections or materials ordered against an outdated design revision
- Missing or incomplete material lines
- Delivery delays and revised ETAs
- Open claims, vendor-notice deadlines, and aging
- Wrong finish/model/handing/lot/serial exceptions
- Long-lead and critical-path items without confirmed dates
- High-value materials in noncompliant storage
- Urgent requests
- Upcoming project-start risk
- Purchasing and warehouse action plan

Reports must be filterable, printable, exportable to PDF/CSV, and generated from live database data. Store submitted report snapshots so historical reports do not silently change.

## Required user experience

- Clean professional construction-operations design, not a generic e-commerce inventory interface
- Mobile-first receiving screens with large controls and minimal typing
- Desktop dashboards with dense but readable tables and filters
- Clear statuses: Ready, Blocked, Delayed, Damaged, Partial, In Transit, Awaiting Approval
- Persistent search by project number, client, address, PM, room, phase, selection reference, design revision, manufacturer, model, finish, SKU, UPC, cabinet tag, dye lot, slab, serial, vendor, BOL, PO, and claim number
- Photo thumbnails with full-screen review and captions
- Empty, loading, error, offline, and permission-denied states
- Accessible labels, keyboard navigation, contrast, and screen-reader support
- Confirmation for destructive or schedule-impacting actions
- No fake buttons, nonfunctional navigation, placeholder analytics, or hard-coded production records

## Offline and PWA behavior

Receiving often occurs in weak-connectivity areas. Implement:

- Installable PWA shell
- Offline draft queue for receiving inspections, photos, and material requests
- Clear pending-sync status
- Idempotent server synchronization so retries do not duplicate receipts or quantities
- Conflict handling when data changed while the device was offline
- No claim that offline data is safely stored until the feature has been tested on supported mobile browsers

## Security and data integrity

- Multi-tenant organization isolation
- Supabase RLS on every business table and private storage object
- No service-role key in browser code
- Validate every mutation server-side with Zod
- File type, size, and path validation for uploads
- Signed URLs for private documents
- Rate limiting for sensitive endpoints
- CSRF-safe mutation patterns
- Audit user, timestamp, entity, project, old value, new value, and reason for critical changes
- Database constraints for impossible quantities and invalid states
- Transactional receiving, inventory, readiness, and claim operations
- Backups, migration discipline, seed data, and environment-variable documentation

## Notifications

Create an abstraction for email/SMS/push notifications. Implement in-app notifications first and leave providers configurable.

Trigger notifications for:

- Delivery delayed or revised ETA missed
- Project start within configured days while blocked
- Blocking damage/shortage claim opened or overdue
- Urgent/emergency request submitted or unfulfilled near needed-by time
- Project becomes eligible for final readiness approval
- Ready status is revoked

Avoid notification spam through deduplication, escalation windows, and user preferences.

## Engineering method

1. Inspect the repository and summarize what should be retained, rewritten, or removed.
2. Create `IMPLEMENTATION_PLAN.md` with architecture, data model, routes, components, permissions, migration plan, testing plan, risks, and sequence.
3. Create a traceability matrix mapping every business requirement to code modules and tests.
4. Work in small vertical slices that produce usable functionality.
5. Run linting, type checks, migrations, and tests after each slice.
6. Do not suppress TypeScript or lint errors to make builds pass.
7. Do not use `any` except where a documented third-party boundary makes it unavoidable.
8. Do not leave TODO placeholders for core requirements.
9. Record assumptions in `ASSUMPTIONS.md`; do not repeatedly stop for minor questions.
10. Update the README with exact local setup, Supabase setup, environment variables, test commands, seed instructions, deployment, and recovery steps.

## Required route structure

Create logical routes similar to:

- `/dashboard`
- `/projects`
- `/projects/[projectId]`
- `/projects/[projectId]/materials`
- `/projects/[projectId]/deliveries`
- `/projects/[projectId]/claims`
- `/projects/[projectId]/readiness`
- `/receiving/new`
- `/deliveries`
- `/requests`
- `/claims`
- `/inventory`
- `/reports/daily`
- `/reports/weekly`
- `/audit`
- `/settings/users`
- `/settings/readiness`

Use route groups and layouts where they improve maintainability.

## Testing requirements

Implement and pass the scenarios in `docs/ACCEPTANCE_TESTS.md`, including:

- Exact complete delivery matching the approved selection and current design revision
- Partial delivery
- Damaged material with automatic blocking claim
- BOL mismatch
- Wrong SKU
- Wrong finish, model, dimensions, handing, or design revision
- Deferred-template exception authorization and phase blocking
- Mixed tile dye lot or wrong stone slab/bundle
- Missing cabinet accessory, appliance installation kit, or plumbing trim component
- Noncompliant special storage
- Deferred concealed inspection and notice deadline
- Field loadout and chain-of-custody discrepancy
- Overdelivery
- Duplicate/offline retry protection
- Project-ready approval and automatic revocation
- Role and tenant isolation
- Report accuracy
- Photo/document requirements
- Warehouse stock transaction integrity

Include database tests that prove RLS prevents users from reading or changing another organization's records.

## Definition of done

The work is not complete until:

- The production Next.js application runs locally.
- Supabase migrations apply cleanly to an empty project.
- Seed data creates multiple PMs and multiple high-end kitchen/bath projects with cabinetry, stone, tile, plumbing, appliance, glass, lighting, and hardware examples.
- Every primary screen works on mobile and desktop.
- Camera upload works over HTTPS and barcode scanning has a fallback.
- Core mutations are transactional and audited.
- RLS and storage policies are tested.
- The readiness gate cannot be bypassed from the client.
- Daily and weekly reports are accurate and printable/exportable.
- Offline retries do not duplicate receiving quantities.
- Unit, integration, and end-to-end tests pass.
- The README allows a new developer to configure and deploy the application without guessing.

Begin by inspecting the repository. Then create the implementation plan and immediately start Phase 1. Do not only describe the system—write the code, migrations, tests, and documentation.

---
