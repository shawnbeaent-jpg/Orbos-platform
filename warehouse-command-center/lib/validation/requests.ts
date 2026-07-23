import { z } from 'zod';
import { nonEmptyString, positiveQuantity, priorityEnum, uuid } from './common';

/** Material request (warehouse pull or outside purchase). */
export const materialRequestSchema = z.object({
  projectId: uuid,
  source: z.enum(['warehouse', 'home_depot', 'lowes', 'supply_house', 'other_vendor']),
  priority: priorityEnum,
  neededBy: z.string().datetime({ message: 'Provide a valid needed-by date/time' }),
  reason: nonEmptyString.max(1000),
  requestType: z.enum([
    'field_condition',
    'missing_accessory',
    'approved_design_change',
    'damage_replacement',
    'owner_upgrade',
    'punch_item',
    'consumable',
    'emergency',
    'other',
  ]),
  scheduleImpact: z.string().trim().max(1000).optional().default(''),
  installationPhase: z.string().trim().max(120).optional().default(''),
  items: z
    .array(
      z.object({
        description: nonEmptyString.max(500),
        sku: z.string().trim().max(120).optional().default(''),
        requestedQuantity: positiveQuantity,
        unit: nonEmptyString.max(20),
        substitutionAllowed: z.boolean().default(false),
        estimatedUnitCost: z.number().nonnegative().optional(),
      }),
    )
    .min(1, 'At least one item is required'),
});

export type MaterialRequestInput = z.infer<typeof materialRequestSchema>;

/** Approve/reject decision. Self-approval is blocked server-side when SoD is enabled. */
export const requestDecisionSchema = z.object({
  requestId: uuid,
  decision: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().trim().max(1000).optional().default(''),
});

export type RequestDecisionInput = z.infer<typeof requestDecisionSchema>;
