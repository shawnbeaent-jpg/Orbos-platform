import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PageHeader, EmptyState, StatusBadge } from '@/components/ui';
import { formatDateTime } from '@/lib/format';
import type { OperationalStatus } from '@/lib/status';

export const metadata = { title: 'Material Requests' };
export const dynamic = 'force-dynamic';

const PRIORITY_TONE: Record<string, OperationalStatus> = {
  normal: 'neutral',
  urgent: 'delayed',
  emergency: 'blocked',
};

export default async function RequestsPage({ searchParams }: { searchParams: { filter?: string } }) {
  const supabase = createSupabaseServerClient();
  let query = supabase.from('material_requests').select('*').order('needed_by', { ascending: true });
  if (searchParams.filter === 'urgent-pending') {
    query = query.in('priority', ['urgent', 'emergency']).eq('status', 'pending');
  }
  const { data } = await query;
  const requests = data ?? [];

  return (
    <div>
      <PageHeader
        title="Material Requests"
        subtitle={searchParams.filter === 'urgent-pending' ? 'Urgent & emergency, pending' : 'Warehouse pulls and outside purchases'}
      />
      {requests.length === 0 ? (
        <EmptyState
          title="No requests"
          message="Warehouse stock pulls and Home Depot / Lowe's / supply-house purchase requests appear here with approval and fulfillment status."
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-steel-200 text-sm">
            <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
              <tr>
                <th className="px-3 py-3">Needed by</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Reason</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-steel-50">
                  <td className="px-3 py-3">{formatDateTime(r.needed_by)}</td>
                  <td className="px-3 py-3 capitalize">{r.source.replace(/_/g, ' ')}</td>
                  <td className="px-3 py-3">
                    <StatusBadge kind={PRIORITY_TONE[r.priority] ?? 'neutral'} label={r.priority} />
                  </td>
                  <td className="px-3 py-3 max-w-sm truncate text-steel-600">{r.reason}</td>
                  <td className="px-3 py-3 capitalize">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
