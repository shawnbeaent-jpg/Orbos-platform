import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { AppRole } from '@/lib/supabase/database.types';

export interface SessionContext {
  userId: string;
  organizationId: string;
  role: AppRole;
  fullName: string;
}

/**
 * Resolve the current user's profile (org + role). Cached per request so multiple
 * server components share one round-trip. Returns null when unauthenticated.
 *
 * `auth.getUser()` validates the JWT with Supabase rather than trusting the cookie.
 */
export const getSessionContext = cache(async (): Promise<SessionContext | null> => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('organization_id, role, full_name')
    .eq('id', user.id)
    .eq('active', true)
    .single();

  if (error || !profile) return null;

  return {
    userId: user.id,
    organizationId: profile.organization_id,
    role: profile.role,
    fullName: profile.full_name,
  };
});

/** Require a signed-in, active profile or redirect to login. */
export async function requireSession(): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (!ctx) redirect('/login');
  return ctx;
}

/** Require one of the given roles or throw (server actions convert this to a result). */
export function assertRole(ctx: SessionContext, allowed: readonly AppRole[]): void {
  if (!allowed.includes(ctx.role)) {
    throw new AuthorizationError(`This action requires one of: ${allowed.join(', ')}.`);
  }
}

export class AuthorizationError extends Error {}
