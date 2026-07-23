# Acceptance Tests — High-End Kitchen & Bath Warehouse Command Center

Claude must automate these tests where practical. Manual-only testing is not sufficient for security, quantity, readiness, or tenant isolation.

## A. Project, design revision, and selection control

1. Create a high-end kitchen project with multiple rooms, trades, and phases.
2. Create an approved-selection record with manufacturer, model, finish, dimensions, image, and design revision.
3. Link a project material to that approved selection.
4. Revise the design selection after the material is ordered.
5. Verify that the order/material is flagged as tied to an outdated revision and readiness is blocked.
6. Verify that a nonauthorized user cannot approve a substitution.
7. Verify that an approved substitution preserves the original selection, approval, reason, date, and audit history.

## B. Exact complete delivery

1. Schedule a delivery with expected quantities and approved specifications.
2. Receive the exact manufacturer, model, finish, dimensions, handing, identifiers, and quantity.
3. Verify BOL/PO/packing slip, required photos, inspection level, and compliant location.
4. Confirm received and usable totals update exactly once.
5. Confirm no claim is created.
6. Confirm the material passes specification, evidence, and storage checks.

## C. Partial delivery

1. Receive fewer units than expected.
2. Verify received and usable quantities reflect only the physical shipment.
3. Verify the remaining shortage is visible.
4. Verify the project remains blocked.
5. Verify the later balance receipt increments totals correctly without overwriting history.

## D. Damage and packaging failure

1. Receive a quantity containing damaged units.
2. Require damage photos and BOL notation.
3. Verify damaged units do not increase usable quantity.
4. Verify a blocking claim is created with vendor-notice deadline.
5. Receive a replacement and verify it requires a new inspection.
6. Verify closing the claim alone does not create usable quantity.

## E. Wrong model, finish, size, handing, or design revision

1. Receive the correct general product type but the wrong model or finish.
2. Confirm the system does not mark it usable merely because the SKU or quantity is similar.
3. Verify a wrong-item/wrong-finish claim is created.
4. Verify the project remains blocked.
5. Verify an authorized approved substitution can resolve the mismatch only with documented approval.

## F. Cabinet package completeness

1. Create a cabinet package containing cabinet units, finished panels, fillers, moldings, toe kicks, hardware, and accessories.
2. Receive all cabinets but omit one finished panel and one hardware package.
3. Verify package completeness fails and readiness remains blocked.
4. Verify cabinet tags and room/elevation assignments are unique and searchable.
5. Verify a duplicate cabinet tag is rejected or explicitly resolved.

## G. Tile dye lot, shade, and caliber

1. Create one required tile material line for a room.
2. Receive cartons from two dye lots or calibers without approval.
3. Verify the system creates a lot-compatibility exception and blocks readiness.
4. Verify approved room allocation or written approval is required to use mixed lots.
5. Verify carton count, square footage, breakage, and overage calculations reconcile.

## H. Stone slab and bundle verification

1. Create approved slab-selection records with bundle and slab IDs.
2. Receive a slab from the wrong bundle or with an unapproved repair/chip.
3. Verify the mismatch is captured with photos and blocks readiness.
4. Verify A-frame/upright storage is required.
5. Move the slab to a noncompliant location and confirm an exception and audit event are created.

## I. Appliance and serialized equipment

1. Receive an appliance with model, serial, finish, voltage, door swing, and installation-kit requirements.
2. Verify duplicate serial numbers are prevented.
3. Omit the installation kit and confirm package completeness fails.
4. Receive the wrong door swing or panel-ready configuration and confirm readiness is blocked.
5. Verify serial and warranty documents remain searchable after field issue.

## J. Plumbing rough-in and trim compatibility

1. Create linked rough-in valve and trim-set requirements.
2. Receive the correct finish but incompatible valve family.
3. Verify compatibility fails and a blocking exception is created.
4. Verify exact compatible replacement must be received before readiness can pass.

## K. Concealed inspection workflow

1. Receive a product that should remain factory-packaged.
2. Select deferred concealed inspection and record reason, responsible person, deadline, and packaging photos.
3. Verify the unresolved inspection appears in dashboards and reports.
4. Verify policy can block readiness until final inspection.
5. Verify deadline escalation occurs before vendor notice rights expire.

## L. Storage compliance

1. Assign handling classes for climate-controlled cabinetry, A-frame stone, secure-cage trim, and keep-dry tile.
2. Attempt to place each item in a noncompliant location.
3. Verify acceptance or movement is blocked or creates an authorized override with reason.
4. Verify storage noncompliance can revoke readiness.
5. Verify movement history remains immutable and auditable.


## L2. Deferred-template and phase-gate control

1. Create a countertop item that requires field templating after cabinet installation.
2. Verify the system does not permit the item to be falsely marked received before fabrication.
3. With strict whole-project policy enabled, verify the item blocks Ready to Start.
4. Enable organization policy allowing approved deferred-template exceptions.
5. Require predecessor milestone, template target, fabrication lead time, required-on-site date, phase gate, manager approval, reason, and audit entry.
6. Verify the project may pass the permitted pre-start gate while the countertop phase remains blocked.
7. Complete cabinet installation, template, fabrication, delivery, and receiving.
8. Verify the countertop phase gate clears only after accepted material is present.
9. Remove or invalidate the exception and verify readiness revokes.

## M. BOL, PO, and packing-slip mismatch

1. Enter a BOL that does not match the expected delivery or purchase order.
2. Verify a clean receipt is prohibited.
3. Verify the discrepancy is documented and claim creation is available or automatic.
4. Verify the driver acknowledgment/refusal is stored.

## N. Overdelivery

1. Receive more than expected.
2. Verify the system records the physical quantity without silently increasing required quantity.
3. Require an authorized disposition: accept, return, hold, or allocate.
4. Verify unexpected material is not automatically treated as project-ready material.

## O. Offline and duplicate retry protection

1. Save an offline receiving draft with photos and material-unit identities.
2. Retry synchronization multiple times with the same idempotency key.
3. Verify only one receiving transaction, one set of quantity updates, and one evidence set are created.
4. Simulate a server-side material revision before sync and verify conflict handling.

## P. Claims and vendor deadlines

1. Create claims for damage, shortage, wrong finish, lot mismatch, packaging damage, concealed damage, quality defect, and storage noncompliance.
2. Verify response and notice deadlines calculate and escalate correctly.
3. Verify replacement value, rush cost, credit, and recovery can be tracked by authorized roles.
4. Verify read-only and receiving users cannot access restricted accounting fields when policy prohibits it.

## Q. Project staging, loadout, and chain of custody

1. Stage materials by project, room, trade, and phase.
2. Verify general warehouse location alone does not satisfy staging.
3. Create a field loadout manifest.
4. Scan items out and obtain installer acknowledgment.
5. Attempt to load an item assigned to another project and verify the action is blocked or escalated.
6. Return material and confirm custody and condition history remain intact.
7. Mark a critical loadout item missing and verify readiness or release status is revoked according to policy.

## R. Whole-project readiness approval

1. Create a project with at least one required material line.
2. Satisfy quantity but leave finish verification incomplete; approval must fail.
3. Satisfy finish but leave storage noncompliant; approval must fail.
4. Satisfy all high-end preapproval controls.
5. Attempt approval as PM; it must fail.
6. Approve as Warehouse Manager or Administrator; status becomes Ready to Start.
7. Change design revision, quantity, storage, material identity, claim status, or checklist; readiness must revoke automatically.
8. Confirm the audit trail identifies the exact reason and actor.

## S. Material requests

1. Submit normal, urgent, and emergency requests.
2. Require room, trade/phase, reason, needed-by time, and schedule impact.
3. Submit a finish-sensitive substitution and verify documented authorization is required.
4. Verify self-approval is prevented when separation of duties is enabled.
5. Verify purchase, receipt, project allocation, cost, and receipt evidence remain linked.

## T. Shared stock integrity

1. Receive shared consumable stock through a ledger transaction.
2. Commit and issue stock to multiple projects concurrently.
3. Verify available balance never becomes silently negative.
4. Test return, adjustment, damage write-off, and cycle-count reconciliation.
5. Verify every change has a transaction and audit entry.

## U. Reports and dashboard reconciliation

1. Generate daily and weekly reports from seeded data.
2. Reconcile every total to direct database queries.
3. Verify reports show unapproved selections, outdated revisions, long-lead risks, wrong finish/lot/serial exceptions, cabinet shortages, concealed-damage deadlines, noncompliant storage, claims, and unacknowledged loadouts.
4. Submit a report snapshot, change live data, and verify the historical snapshot does not change.
5. Verify PDF/print and CSV exports contain the filtered records.

## V. Security, RLS, and private storage

1. Create two organizations with projects, users, photos, and documents.
2. Verify users cannot read or mutate the other organization’s records.
3. Verify private selection photos, BOLs, shop drawings, claims, and warranty documents cannot be accessed across tenants.
4. Verify route protection and hidden buttons are not relied upon as authorization.
5. Verify service-role credentials never reach browser bundles.
6. Verify upload validation rejects prohibited types, oversized files, and forged paths.
7. Verify critical operations are server-validated and audited.

## W. Accessibility and mobile field use

1. Complete receiving using a mobile viewport and keyboard-only navigation.
2. Verify touch targets, focus order, labels, validation errors, and contrast.
3. Verify camera failure, denied permission, weak connectivity, offline queue, and retry states are understandable.
4. Verify the receiver can complete the core workflow with minimal typing.
