import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { DeliveryRow } from '@/lib/supabase/database.types';

export type DeliveryWhen = 'all' | 'today' | 'week';

export async function listDeliveries(opts: { projectId?: string; when?: DeliveryWhen } = {}): Promise<DeliveryRow[]> {
  const supabase = createSupabaseServerClient();
  let query = supabase.from('deliveries').select('*').order('scheduled_date', { ascending: true });

  if (opts.projectId) query = query.eq('project_id', opts.projectId);

  const today = new Date().toISOString().slice(0, 10);
  if (opts.when === 'today') {
    query = query.eq('scheduled_date', today);
  } else if (opts.when === 'week') {
    const weekEnd = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
    query = query.gte('scheduled_date', today).lte('scheduled_date', weekEnd);
  }

  const { data } = await query;
  return data ?? [];
}
