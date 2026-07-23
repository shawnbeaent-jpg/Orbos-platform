import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { daysUntil } from '@/lib/format';

export interface DashboardData {
  activeProjects: number;
  readyProjects: number;
  blockedProjects: number;
  startsWithin: { in3: number; in7: number; in14: number };
  deliveriesToday: number;
  deliveriesThisWeek: number;
  delayedDeliveries: number;
  openBlockingClaims: number;
  urgentRequests: number;
  lowStockItems: number;
  exceptions: ExceptionCard[];
}

export interface ExceptionCard {
  id: string;
  title: string;
  detail: string;
  owner: string;
  href: string;
  tone: 'blocked' | 'delayed' | 'awaiting';
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

async function count(
  build: () => PromiseLike<{ count: number | null; error: unknown }>,
): Promise<number> {
  const { count: c } = await build();
  return c ?? 0;
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = createSupabaseServerClient();
  const today = todayISO();

  // Readiness view drives project-level KPIs so the numbers match the gate exactly.
  const readiness = await supabase
    .from('project_readiness_summary')
    .select('project_id, project_number, client_name, planned_start_date, readiness_approved, preapproval_ready, required_material_lines, open_blocking_claims');

  const rows = readiness.data ?? [];
  const readyProjects = rows.filter((r) => r.readiness_approved).length;
  const blockedProjects = rows.filter((r) => !r.readiness_approved && r.required_material_lines > 0 && !r.preapproval_ready).length;

  const notReadyWithin = (days: number) =>
    rows.filter((r) => {
      if (r.readiness_approved) return false;
      const d = daysUntil(r.planned_start_date);
      return d !== null && d >= 0 && d <= days;
    }).length;

  const [
    activeProjects,
    deliveriesToday,
    deliveriesThisWeek,
    delayedDeliveries,
    openBlockingClaims,
    urgentRequests,
  ] = await Promise.all([
    count(() =>
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .in('status', ['materials_in_progress', 'blocked', 'ready_to_start', 'active']),
    ),
    count(() =>
      supabase
        .from('deliveries')
        .select('id', { count: 'exact', head: true })
        .eq('scheduled_date', today)
        .in('status', ['scheduled', 'in_transit', 'arrived']),
    ),
    count(() =>
      supabase
        .from('deliveries')
        .select('id', { count: 'exact', head: true })
        .gte('scheduled_date', today)
        .lte('scheduled_date', new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10))
        .in('status', ['scheduled', 'in_transit', 'arrived']),
    ),
    count(() =>
      supabase.from('deliveries').select('id', { count: 'exact', head: true }).eq('status', 'delayed'),
    ),
    count(() =>
      supabase
        .from('damage_claims')
        .select('id', { count: 'exact', head: true })
        .eq('blocking', true)
        .not('status', 'in', '("resolved","closed","denied")'),
    ),
    count(() =>
      supabase
        .from('material_requests')
        .select('id', { count: 'exact', head: true })
        .in('priority', ['urgent', 'emergency'])
        .eq('status', 'pending'),
    ),
  ]);

  // Low stock needs a row comparison (on_hand <= reorder_point), computed here.
  const inventory = await supabase
    .from('warehouse_inventory')
    .select('id, on_hand_quantity, reorder_point, active')
    .eq('active', true);
  const lowStockItems = (inventory.data ?? []).filter((i) => i.on_hand_quantity <= i.reorder_point).length;

  // Actionable exception cards: blocked projects with an imminent start.
  const exceptions: ExceptionCard[] = rows
    .filter((r) => !r.readiness_approved && !r.preapproval_ready && r.required_material_lines > 0)
    .map((r) => ({ r, d: daysUntil(r.planned_start_date) }))
    .filter((x) => x.d !== null && x.d <= 14)
    .sort((a, b) => (a.d ?? 99) - (b.d ?? 99))
    .slice(0, 6)
    .map(({ r, d }) => ({
      id: r.project_id,
      title: `${r.project_number} — ${r.client_name}`,
      detail:
        d !== null && d < 0
          ? `Start date passed ${Math.abs(d)}d ago and materials are not ready`
          : `Starts in ${d}d and is blocked by incomplete materials`,
      owner: r.open_blocking_claims > 0 ? 'Purchasing / Warehouse Manager' : 'Warehouse Manager',
      href: `/projects/${r.project_id}/readiness`,
      tone: (d !== null && d <= 3 ? 'blocked' : 'delayed') as 'blocked' | 'delayed',
    }));

  return {
    activeProjects,
    readyProjects,
    blockedProjects,
    startsWithin: { in3: notReadyWithin(3), in7: notReadyWithin(7), in14: notReadyWithin(14) },
    deliveriesToday,
    deliveriesThisWeek,
    delayedDeliveries,
    openBlockingClaims,
    urgentRequests,
    lowStockItems,
    exceptions,
  };
}
