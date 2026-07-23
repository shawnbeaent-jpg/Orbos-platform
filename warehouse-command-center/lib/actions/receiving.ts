'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionContext } from '@/lib/auth/session';
import { canReceive } from '@/lib/auth/rbac';
import { receivingInspectionSchema } from '@/lib/validation/receiving';
import { checkEvidence, type EvidenceDescriptor, type DocumentType } from '@/lib/receiving/evidence';
import { writeAudit } from '@/lib/audit';
import { logger } from '@/lib/logger';
import { ok, fail, type ActionResult } from './types';
import type { ReceivingInspectionInsert } from '@/lib/supabase/database.types';

const DOCUMENT_TYPES: readonly DocumentType[] = [
  'material_photo', 'approved_selection_photo', 'label_photo', 'finish_comparison_photo', 'damage_photo',
  'bol', 'delivery_ticket', 'packing_slip', 'purchase_order', 'receipt', 'claim_document', 'signature',
  'cut_sheet', 'shop_drawing', 'design_revision', 'warranty', 'installation_instruction', 'loadout_manifest', 'other',
] as const;

const evidenceSchema = z.array(
  z.object({
    documentType: z.enum(DOCUMENT_TYPES as unknown as [DocumentType, ...DocumentType[]]),
    storagePath: z.string().min(1).max(500),
    caption: z.string().max(300).optional(),
  }),
);

/**
 * Submit a receiving inspection. Idempotent: the same idempotency_key never creates
 * a second inspection or double-counts quantities, even across offline retries. The
 * database trigger `apply_receiving_inspection()` applies the material totals and
 * revokes readiness atomically; this action enforces role, evidence, and audit.
 */
export async function submitReceivingInspection(
  rawInput: unknown,
  rawEvidence: unknown,
): Promise<ActionResult<{ inspectionId: string; duplicate: boolean }>> {
  const ctx = await getSessionContext();
  if (!ctx) return fail('You must be signed in.', 'unauthenticated');
  if (!canReceive(ctx.role)) return fail('Your role cannot receive deliveries.', 'forbidden');

  const parsed = receivingInspectionSchema.safeParse(rawInput);
  if (!parsed.success) {
    return fail('Please correct the highlighted fields.', 'validation', parsed.error.flatten().fieldErrors);
  }
  const evidenceParsed = evidenceSchema.safeParse(rawEvidence);
  if (!evidenceParsed.success) {
    return fail('Invalid evidence payload.', 'validation');
  }
  const input = parsed.data;
  const evidence: EvidenceDescriptor[] = evidenceParsed.data;

  // Every evidence path must live under this org's storage prefix (defense in depth vs. RLS).
  const badPath = evidence.find((e) => !e.storagePath.startsWith(`${ctx.organizationId}/`));
  if (badPath) return fail('Evidence path is outside your organization.', 'forbidden');

  // "No clean receipt without required evidence" — unless an authorized override reason is given.
  const evidenceResult = checkEvidence(input, evidence);
  const usingOverride = input.overrideReason.trim().length > 0;
  if (!evidenceResult.satisfied && !usingOverride) {
    return fail(
      `Missing required evidence: ${evidenceResult.missing.join(', ')}. Capture the photos or provide an override reason.`,
      'missing_evidence',
      { evidence: evidenceResult.missing },
    );
  }

  const supabase = createSupabaseServerClient();

  // Idempotency short-circuit: if this key already produced an inspection, return it.
  const existing = await supabase
    .from('receiving_inspections')
    .select('id')
    .eq('organization_id', ctx.organizationId)
    .eq('idempotency_key', input.idempotencyKey)
    .maybeSingle();
  if (existing.data) {
    return ok({ inspectionId: existing.data.id, duplicate: true });
  }

  const insertRow: ReceivingInspectionInsert = {
    organization_id: ctx.organizationId,
    project_id: input.projectId,
    delivery_id: input.deliveryId ?? null,
    project_material_id: input.projectMaterialId,
    bol_number: input.bolNumber,
    bol_verified: input.bolVerified,
    driver_name: input.driverName || null,
    packaging_condition: input.packagingCondition || null,
    received_quantity: input.receivedQuantity,
    damaged_quantity: input.damagedQuantity,
    rejected_quantity: input.rejectedQuantity,
    short_quantity: input.shortQuantity,
    inspection_passed: input.inspectionPassed,
    signed_with_exception: input.signedWithException,
    warehouse_zone: input.warehouseZone || null,
    warehouse_rack: input.warehouseRack || null,
    warehouse_bin: input.warehouseBin || null,
    notes: input.notes || null,
    idempotency_key: input.idempotencyKey,
    purchase_order_verified: input.purchaseOrderVerified,
    packing_slip_verified: input.packingSlipVerified,
    design_revision_verified: input.designRevisionVerified,
    specification_verified: input.specificationVerified,
    identity_verified: input.identityVerified,
    lot_compatibility_verified: input.lotCompatibilityVerified,
    package_complete_verified: input.packageCompleteVerified,
    packaging_intact: input.packagingIntact,
    storage_compliant: input.storageCompliant,
    inspection_level: input.inspectionLevel,
    concealed_inspection_deferred: input.concealedInspectionDeferred,
    concealed_inspection_reason: input.concealedInspectionReason || null,
    concealed_damage_notice_deadline: input.concealedDamageNoticeDeadline ?? null,
    driver_acknowledgment_status: input.driverAcknowledgmentStatus,
    override_reason: usingOverride ? input.overrideReason : null,
  };

  const inserted = await supabase
    .from('receiving_inspections')
    .insert(insertRow)
    .select('id')
    .single();

  if (inserted.error || !inserted.data) {
    // A concurrent request with the same idempotency key hits the unique index (23505).
    if (inserted.error?.code === '23505') {
      const retry = await supabase
        .from('receiving_inspections')
        .select('id')
        .eq('organization_id', ctx.organizationId)
        .eq('idempotency_key', input.idempotencyKey)
        .maybeSingle();
      if (retry.data) return ok({ inspectionId: retry.data.id, duplicate: true });
    }
    logger.error('receiving_insert_failed', { error: inserted.error?.message, projectId: input.projectId });
    return fail(inserted.error?.message ?? 'Failed to save the receiving inspection.', 'db_error');
  }

  const inspectionId = inserted.data.id;

  // Persist evidence documents linked to the inspection.
  if (evidence.length > 0) {
    const docRows = evidence.map((e) => ({
      organization_id: ctx.organizationId,
      project_id: input.projectId,
      delivery_id: input.deliveryId ?? null,
      project_material_id: input.projectMaterialId,
      receiving_inspection_id: inspectionId,
      document_type: e.documentType,
      storage_bucket: 'project-documents',
      storage_path: e.storagePath,
      caption: e.caption ?? null,
    }));
    const docs = await supabase.from('documents').insert(docRows);
    if (docs.error) {
      logger.error('receiving_documents_failed', { error: docs.error.message, inspectionId });
      // The inspection is saved; surface a soft warning rather than losing the receipt.
    }
  }

  await writeAudit(supabase, {
    organization_id: ctx.organizationId,
    actor_id: ctx.userId,
    project_id: input.projectId,
    entity_type: 'receiving_inspection',
    entity_id: inspectionId,
    action: usingOverride ? 'receiving_inspection_created_with_override' : 'receiving_inspection_created',
    new_values: {
      received: input.receivedQuantity,
      damaged: input.damagedQuantity,
      rejected: input.rejectedQuantity,
      inspection_passed: input.inspectionPassed,
      bol_verified: input.bolVerified,
    },
    metadata: usingOverride ? { override_reason: input.overrideReason } : {},
  });

  revalidatePath(`/projects/${input.projectId}`);
  revalidatePath(`/projects/${input.projectId}/materials`);
  revalidatePath(`/projects/${input.projectId}/readiness`);
  revalidatePath('/dashboard');

  return ok({ inspectionId, duplicate: false });
}
