'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionContext } from '@/lib/auth/session';
import { canGrantFinalReadiness, isWriteRole } from '@/lib/auth/rbac';
import { approveReadinessSchema, checklistToggleSchema } from '@/lib/validation/readiness';
import { writeAudit } from '@/lib/audit';
import { logger } from '@/lib/logger';
import { ok, fail, type ActionResult } from './types';

/**
 * Grant final "Ready to Start" approval. Authorization AND every gate condition are
 * re-checked inside the SQL function `approve_project_readiness()` in one transaction;
 * this action cannot bypass them. A client that forges the call still hits RLS + the
 * function's role check and `preapproval_ready` re-evaluation.
 */
export async function approveProjectReadiness(rawInput: unknown): Promise<ActionResult> {
  const ctx = await getSessionContext();
  if (!ctx) return fail('You must be signed in.', 'unauthenticated');

  const parsed = approveReadinessSchema.safeParse(rawInput);
  if (!parsed.success) return fail('Invalid request.', 'validation');

  // Fast pre-check for a clean message; the database remains the real boundary.
  if (!canGrantFinalReadiness(ctx.role)) {
    return fail('Only an Administrator or Warehouse Manager can grant final readiness.', 'forbidden');
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc('approve_project_readiness', {
    p_project_id: parsed.data.projectId,
  });

  if (error) {
    logger.warn('readiness_approval_rejected', { projectId: parsed.data.projectId, error: error.message });
    // The function raises with a human-readable reason (role, or not all controls passed).
    return fail(error.message, 'readiness_blocked');
  }

  await writeAudit(supabase, {
    organization_id: ctx.organizationId,
    actor_id: ctx.userId,
    project_id: parsed.data.projectId,
    entity_type: 'project',
    entity_id: parsed.data.projectId,
    action: 'readiness_approved',
    new_values: { readiness_approved: true },
  });

  revalidatePath(`/projects/${parsed.data.projectId}`);
  revalidatePath(`/projects/${parsed.data.projectId}/readiness`);
  revalidatePath('/dashboard');
  return ok(undefined);
}

/** Toggle a readiness checklist item. Any change to a required item revokes readiness via DB trigger. */
export async function toggleReadinessChecklist(rawInput: unknown): Promise<ActionResult> {
  const ctx = await getSessionContext();
  if (!ctx) return fail('You must be signed in.', 'unauthenticated');
  if (!isWriteRole(ctx.role)) return fail('Your role cannot change the checklist.', 'forbidden');

  const parsed = checklistToggleSchema.safeParse(rawInput);
  if (!parsed.success) return fail('Invalid request.', 'validation');
  const { projectId, checklistKey, completed, notes } = parsed.data;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('project_readiness_checklist')
    .update({
      completed,
      completed_by: completed ? ctx.userId : null,
      completed_at: completed ? new Date().toISOString() : null,
      notes: notes || null,
    })
    .eq('organization_id', ctx.organizationId)
    .eq('project_id', projectId)
    .eq('checklist_key', checklistKey);

  if (error) {
    logger.error('checklist_toggle_failed', { projectId, checklistKey, error: error.message });
    return fail(error.message, 'db_error');
  }

  await writeAudit(supabase, {
    organization_id: ctx.organizationId,
    actor_id: ctx.userId,
    project_id: projectId,
    entity_type: 'readiness_checklist',
    entity_id: null,
    action: 'checklist_item_toggled',
    new_values: { checklist_key: checklistKey, completed },
  });

  revalidatePath(`/projects/${projectId}/readiness`);
  revalidatePath('/dashboard');
  return ok(undefined);
}
