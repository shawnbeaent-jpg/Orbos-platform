import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface DailyReport {
  date: string;
  deliveries: { scheduled: number; received: number; partial: number; rejected: number; delayed: number };
  materialsReceivedInspections: number;
  exceptionsOpenedToday: number;
  openUrgentRequests: number;
  tomorrowDeliveries: number;
}

export async function getDailyReport(date = new Date()): Promise<DailyReport> {
  const supabase = createSupabaseServerClient();
  const day = isoDay(date);
  const tomorrow = isoDay(new Date(date.getTime() + 86_400_000));
  const dayStart = `${day}T00:00:00.000Z`;
  const nextStart = `${tomorrow}T00:00:00.000Z`;

  const [scheduled, received, partial, rejected, delayed, inspections, exceptions, urgent, tomorrowCount] =
    await Promise.all([
      countRows(supabase, 'deliveries', (q) => q.eq('scheduled_date', day)),
      countRows(supabase, 'deliveries', (q) => q.eq('scheduled_date', day).eq('status', 'received')),
      countRows(supabase, 'deliveries', (q) => q.eq('scheduled_date', day).eq('status', 'partial')),
      countRows(supabase, 'deliveries', (q) => q.eq('scheduled_date', day).eq('status', 'rejected')),
      countRows(supabase, 'deliveries', (q) => q.eq('scheduled_date', day).eq('status', 'delayed')),
      countRows(supabase, 'receiving_inspections', (q) => q.gte('created_at', dayStart).lt('created_at', nextStart)),
      countRows(supabase, 'damage_claims', (q) => q.gte('opened_at', dayStart).lt('opened_at', nextStart)),
      countRows(supabase, 'material_requests', (q) => q.in('priority', ['urgent', 'emergency']).eq('status', 'pending')),
      countRows(supabase, 'deliveries', (q) => q.eq('scheduled_date', tomorrow)),
    ]);

  return {
    date: day,
    deliveries: { scheduled, received, partial, rejected, delayed },
    materialsReceivedInspections: inspections,
    exceptionsOpenedToday: exceptions,
    openUrgentRequests: urgent,
    tomorrowDeliveries: tomorrowCount,
  };
}

export interface WeeklyProjectRow {
  projectId: string;
  projectNumber: string;
  clientName: string;
  plannedStart: string | null;
  readinessApproved: boolean;
  requiredLines: number;
  completeLines: number;
  completionPercent: number;
  openBlockingClaims: number;
}

export interface WeeklyReport {
  weekStart: string;
  projects: WeeklyProjectRow[];
  totals: { ready: number; blocked: number };
}

export async function getWeeklyReport(reference = new Date()): Promise<WeeklyReport> {
  const supabase = createSupabaseServerClient();
  // Week starts Monday.
  const day = reference.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(reference.getTime() - diffToMonday * 86_400_000);

  const { data } = await supabase
    .from('project_readiness_summary')
    .select(
      'project_id, project_number, client_name, planned_start_date, readiness_approved, required_material_lines, complete_material_lines, open_blocking_claims, preapproval_ready',
    )
    .order('planned_start_date', { ascending: true, nullsFirst: false });

  const rows = (data ?? []).map((r) => ({
    projectId: r.project_id,
    projectNumber: r.project_number,
    clientName: r.client_name,
    plannedStart: r.planned_start_date,
    readinessApproved: r.readiness_approved,
    requiredLines: r.required_material_lines,
    completeLines: r.complete_material_lines,
    completionPercent:
      r.required_material_lines > 0 ? Math.round((r.complete_material_lines / r.required_material_lines) * 100) : 0,
    openBlockingClaims: r.open_blocking_claims,
  }));

  return {
    weekStart: isoDay(monday),
    projects: rows,
    totals: {
      ready: (data ?? []).filter((r) => r.readiness_approved).length,
      blocked: (data ?? []).filter((r) => !r.readiness_approved && r.required_material_lines > 0 && !r.preapproval_ready)
        .length,
    },
  };
}

// --- helpers ---
type CountableTable =
  | 'deliveries'
  | 'receiving_inspections'
  | 'damage_claims'
  | 'material_requests';

function countRows(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  table: CountableTable,
  refine: (q: CountBuilder) => CountBuilder,
): Promise<number> {
  const base = supabase.from(table).select('id', { count: 'exact', head: true }) as unknown as CountBuilder;
  return refine(base).then((res) => res.count ?? 0);
}

// Minimal structural type for the chained PostgREST count builder.
interface CountBuilder extends Promise<{ count: number | null }> {
  eq(column: string, value: string): CountBuilder;
  gte(column: string, value: string): CountBuilder;
  lt(column: string, value: string): CountBuilder;
  in(column: string, values: string[]): CountBuilder;
}
