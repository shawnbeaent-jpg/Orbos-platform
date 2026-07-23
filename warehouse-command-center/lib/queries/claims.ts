import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { DamageClaimRow } from '@/lib/supabase/database.types';

export type ClaimFilter = 'all' | 'blocking-open';

export async function listClaims(opts: { projectId?: string; filter?: ClaimFilter } = {}): Promise<DamageClaimRow[]> {
  const supabase = createSupabaseServerClient();
  let query = supabase.from('damage_claims').select('*').order('opened_at', { ascending: false });

  if (opts.projectId) query = query.eq('project_id', opts.projectId);
  if (opts.filter === 'blocking-open') {
    query = query.eq('blocking', true).not('status', 'in', '("resolved","closed","denied")');
  }

  const { data } = await query;
  return data ?? [];
}
