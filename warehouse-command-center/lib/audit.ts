import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuditLogInsert, Database, Json } from '@/lib/supabase/database.types';
import { logger } from '@/lib/logger';

/**
 * Append an immutable business audit event. The audit_log table has no update/delete
 * policy for users, so entries cannot be altered after the fact. Failures to write an
 * audit row are logged but never swallow the primary operation's error handling here —
 * callers decide whether an audit failure should fail the mutation (for critical
 * operations like readiness approval, it should).
 */
export async function writeAudit(
  client: SupabaseClient<Database>,
  entry: AuditLogInsert,
): Promise<{ ok: boolean }> {
  const { error } = await client.from('audit_log').insert(entry as never);
  if (error) {
    logger.error('audit_write_failed', {
      action: entry.action,
      entityType: entry.entity_type,
      entityId: entry.entity_id,
      error: error.message,
    });
    return { ok: false };
  }
  return { ok: true };
}

export function diffValues<T extends Record<string, unknown>>(
  before: T,
  after: Partial<T>,
): { old_values: Json; new_values: Json } {
  const oldValues: Record<string, unknown> = {};
  const newValues: Record<string, unknown> = {};
  for (const key of Object.keys(after)) {
    if (before[key] !== after[key]) {
      oldValues[key] = before[key] ?? null;
      newValues[key] = after[key] ?? null;
    }
  }
  return { old_values: oldValues as Json, new_values: newValues as Json };
}
