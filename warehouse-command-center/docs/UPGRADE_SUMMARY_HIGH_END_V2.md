# High-End Kitchen & Bath Upgrade Summary

The original generic remodeling warehouse package was revised for high-end kitchen and bathroom operations.

## Added to the browser prototype

- High-end kitchen, kitchen/powder-room, and primary-bath demo projects
- Rooms/areas and design-revision fields
- Manufacturer, model, finish, dimensions, selection reference, lot/dye-lot, slab/cabinet/serial identity fields
- Long-lead, critical-path, high-value, and special-handling fields
- Exact-specification, identity, packaging, storage, and concealed-damage receiving checks
- Automatic claims for wrong finish/model/lot, packaging failure, and storage noncompliance
- Readiness controls for approved selections, exact specification, and compliant storage
- High-end material CSV export fields

## Added to the production design

- Versioned project design revisions and approved selections
- Project rooms/areas and installation phases
- Material-unit records for cabinet tags, cartons, dye lots, slabs, serials, and glass fabrication IDs
- Category-specific inspection templates
- Storage-location capabilities and handling-class validation
- Project material movement history
- Field loadout manifests and installer chain of custody
- Vendor notice deadlines and claim financial recovery
- Deferred-template controls for field-measured countertops, shower glass, mirrors, and similar products
- Strict whole-project readiness by default with policy-controlled exceptions
- Expanded RLS-covered tables and high-end readiness logic

## Important operating decision

The company may keep the strict rule that every material must be present before project start. However, high-end countertop fabrication and shower-glass fabrication often depend on final field measurements after preceding work is installed. The revised system makes this conflict visible and supports an explicit, audited deferred-template exception rather than falsely marking the material received.
