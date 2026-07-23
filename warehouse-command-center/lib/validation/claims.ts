import { z } from 'zod';
import { isoDate, nonEmptyString, uuid } from './common';

export const claimTypeEnum = z.enum([
  'damage',
  'shortage',
  'wrong_item',
  'quality_defect',
  'concealed_damage',
  'bol_discrepancy',
  'wrong_finish',
  'lot_mismatch',
  'packaging_damage',
  'storage_noncompliance',
  'design_revision_mismatch',
  'missing_accessory',
]);

export const createClaimSchema = z.object({
  projectId: uuid,
  projectMaterialId: uuid.nullable().optional(),
  deliveryId: uuid.nullable().optional(),
  receivingInspectionId: uuid.nullable().optional(),
  claimType: claimTypeEnum,
  blocking: z.boolean().default(true),
  vendor: z.string().trim().max(200).optional().default(''),
  carrier: z.string().trim().max(200).optional().default(''),
  description: nonEmptyString.max(2000),
  requestedResolution: z.string().trim().max(1000).optional().default(''),
  responseDueDate: isoDate.nullable().optional(),
  noticeDeadline: isoDate.nullable().optional(),
});

export type CreateClaimInput = z.infer<typeof createClaimSchema>;

export const claimStatusEnum = z.enum([
  'draft',
  'open',
  'vendor_acknowledged',
  'replacement_scheduled',
  'credit_pending',
  'resolved',
  'closed',
  'denied',
]);

export const updateClaimStatusSchema = z.object({
  claimId: uuid,
  status: claimStatusEnum,
  resolutionNotes: z.string().trim().max(2000).optional().default(''),
});

export type UpdateClaimStatusInput = z.infer<typeof updateClaimStatusSchema>;
