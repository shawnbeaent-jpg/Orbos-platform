import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { publicEnv } from '@/lib/env';
import { serverEnv } from '@/lib/env';
import type { Database } from './database.types';

/**
 * Service-role client that BYPASSES Row Level Security.
 *
 * Use only for trusted, tenant-scoped server operations that genuinely require it
 * (seeding, cross-tenant admin jobs, sending notifications on behalf of the system).
 * Every call site must apply its own organization_id filter — RLS will not protect you.
 * This module imports `server-only`, so bundling it into client code fails the build.
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> {
  return createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv().SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
