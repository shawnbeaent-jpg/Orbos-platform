import type { AppRole } from '@/lib/supabase/database.types';

/**
 * Role capability model. This mirrors — and must stay in sync with — the PostgreSQL
 * RLS policies and SECURITY DEFINER functions in supabase/migrations. The database is
 * the authoritative boundary; these helpers drive UI affordances and fast server-side
 * pre-checks so we fail early with a clear message instead of a raw RLS error.
 */

export const ALL_ROLES: readonly AppRole[] = [
  'admin',
  'warehouse_manager',
  'project_manager',
  'receiver',
  'purchasing',
  'executive_readonly',
] as const;

export const WRITE_ROLES: readonly AppRole[] = [
  'admin',
  'warehouse_manager',
  'project_manager',
  'receiver',
  'purchasing',
] as const;

export const FINAL_READINESS_ROLES: readonly AppRole[] = ['admin', 'warehouse_manager'] as const;

export const RECEIVING_ROLES: readonly AppRole[] = ['admin', 'warehouse_manager', 'receiver'] as const;

export const REQUEST_APPROVAL_ROLES: readonly AppRole[] = ['admin', 'warehouse_manager', 'purchasing'] as const;

export function isWriteRole(role: AppRole | null | undefined): boolean {
  return role != null && WRITE_ROLES.includes(role);
}

export function canGrantFinalReadiness(role: AppRole | null | undefined): boolean {
  return role != null && FINAL_READINESS_ROLES.includes(role);
}

export function canReceive(role: AppRole | null | undefined): boolean {
  return role != null && RECEIVING_ROLES.includes(role);
}

export function canApproveRequest(role: AppRole | null | undefined): boolean {
  return role != null && REQUEST_APPROVAL_ROLES.includes(role);
}

export function isReadOnly(role: AppRole | null | undefined): boolean {
  return role === 'executive_readonly';
}

/** Sensitive accounting fields (costs, credits, recovery) are hidden from these roles. */
export function canViewFinancials(role: AppRole | null | undefined): boolean {
  return role != null && (['admin', 'warehouse_manager', 'purchasing', 'executive_readonly'] as AppRole[]).includes(role);
}

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Administrator',
  warehouse_manager: 'Warehouse Manager',
  project_manager: 'Project Manager',
  receiver: 'Receiver / Warehouse Associate',
  purchasing: 'Purchasing / Selections',
  executive_readonly: 'Executive / Read-only',
};
