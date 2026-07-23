import { z } from 'zod';
import { isoDate, nonEmptyString, quantity, uuid } from './common';

/**
 * Receiving inspection input, shared between the mobile receiving client and the
 * server action. The server re-validates with this exact schema before any write.
 *
 * The refinements below enforce the "no clean receipt without required evidence"
 * rule from the brief. Photo/document presence is validated server-side against the
 * uploaded evidence (see the receiving server action), not in this schema.
 */

export const inspectionLevelEnum = z.enum([
  'packaging_and_label',
  'open_carton_visual',
  'full_piece_by_piece',
  'concealed_inspection_deferred',
]);

export const driverAckEnum = z.enum(['not_applicable', 'acknowledged', 'refused', 'driver_unavailable']);

export const receivingInspectionSchema = z
  .object({
    projectId: uuid,
    projectMaterialId: uuid,
    deliveryId: uuid.nullable().optional(),

    // Idempotency: the client generates this once per draft so retries are safe.
    idempotencyKey: z.string().uuid(),

    bolNumber: nonEmptyString.max(120),
    bolVerified: z.boolean(),
    driverName: z.string().trim().max(120).optional().default(''),

    receivedQuantity: quantity,
    damagedQuantity: quantity,
    rejectedQuantity: quantity,
    shortQuantity: quantity,

    inspectionPassed: z.boolean(),
    inspectionLevel: inspectionLevelEnum,
    packagingIntact: z.boolean(),
    packagingCondition: z.string().trim().max(500).optional().default(''),

    // Specification / identity verification flags.
    purchaseOrderVerified: z.boolean().default(false),
    packingSlipVerified: z.boolean().default(false),
    designRevisionVerified: z.boolean().default(false),
    specificationVerified: z.boolean().default(false),
    identityVerified: z.boolean().default(false),
    lotCompatibilityVerified: z.boolean().default(false),
    packageCompleteVerified: z.boolean().default(false),
    storageCompliant: z.boolean().default(false),

    driverAcknowledgmentStatus: driverAckEnum.default('not_applicable'),
    signedWithException: z.boolean().default(false),

    concealedInspectionDeferred: z.boolean().default(false),
    concealedInspectionReason: z.string().trim().max(500).optional().default(''),
    concealedDamageNoticeDeadline: isoDate.nullable().optional(),

    warehouseZone: z.string().trim().max(60).optional().default(''),
    warehouseRack: z.string().trim().max(60).optional().default(''),
    warehouseBin: z.string().trim().max(60).optional().default(''),

    notes: z.string().trim().max(2000).optional().default(''),

    // An authorized override lets a receipt complete despite missing evidence,
    // but requires a reason that is written to the audit trail.
    overrideReason: z.string().trim().max(500).optional().default(''),
  })
  .refine((v) => v.damagedQuantity + v.rejectedQuantity <= v.receivedQuantity, {
    message: 'Damaged plus rejected cannot exceed received quantity.',
    path: ['damagedQuantity'],
  })
  .refine((v) => !v.concealedInspectionDeferred || Boolean(v.concealedDamageNoticeDeadline), {
    message: 'A concealed-damage notice deadline is required when inspection is deferred.',
    path: ['concealedDamageNoticeDeadline'],
  })
  .refine((v) => !v.concealedInspectionDeferred || v.concealedInspectionReason.length > 0, {
    message: 'A reason is required when deferring concealed inspection.',
    path: ['concealedInspectionReason'],
  });

export type ReceivingInspectionInput = z.infer<typeof receivingInspectionSchema>;
