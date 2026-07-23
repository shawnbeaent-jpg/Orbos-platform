import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PageHeader, EmptyState } from '@/components/ui';
import { formatDateTime } from '@/lib/format';

export const metadata = { title: 'Audit Trail' };
export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('audit_log')
    .select('id, occurred_at, action, entity_type, entity_id, project_id')
    .order('occurred_at', { ascending: false })
    .limit(200);
  const rows = data ?? [];

  return (
    <div>
      <PageHeader
        title="Audit Trail"
        subtitle="Immutable business audit events. Entries cannot be edited or deleted after they are written."
      />
      {rows.length === 0 ? (
        <EmptyState title="No audit events yet" message="Critical operations — receiving, readiness approval, claims, and checklist changes — record an entry here." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-steel-200 text-sm">
            <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
              <tr>
                <th className="px-3 py-3">When</th>
                <th className="px-3 py-3">Action</th>
                <th className="px-3 py-3">Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-steel-50">
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-steel-600">{formatDateTime(r.occurred_at)}</td>
                  <td className="px-3 py-3 font-medium text-steel-800">{r.action.replace(/_/g, ' ')}</td>
                  <td className="px-3 py-3 text-xs text-steel-500">{r.entity_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
