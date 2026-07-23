import Link from 'next/link';
import { StatusBadge } from '@/components/ui';
import { deliveryStatusView } from '@/lib/status';
import { formatDate, formatDateTime } from '@/lib/format';
import type { DeliveryRow } from '@/lib/supabase/database.types';

/** Presentational table shared by the project Deliveries tab and the global /deliveries view. */
export function DeliveriesTable({ deliveries, showProject = false }: { deliveries: DeliveryRow[]; showProject?: boolean }) {
  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full divide-y divide-steel-200 text-sm">
        <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
          <tr>
            <th className="px-3 py-3">Scheduled</th>
            <th className="px-3 py-3">Vendor / Carrier</th>
            <th className="px-3 py-3">PO / BOL</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Revised ETA</th>
            {showProject ? <th className="px-3 py-3">Project</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-steel-100">
          {deliveries.map((d) => {
            const view = deliveryStatusView(d.status);
            return (
              <tr key={d.id} className="hover:bg-steel-50">
                <td className="px-3 py-3">{formatDate(d.scheduled_date)}</td>
                <td className="px-3 py-3">
                  <div className="text-steel-900">{d.vendor}</div>
                  <div className="text-xs text-steel-500">{d.carrier ?? '—'}</div>
                </td>
                <td className="px-3 py-3 text-xs text-steel-600">
                  {[d.purchase_order_number, d.bol_number].filter(Boolean).join(' / ') || '—'}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge kind={view.kind} label={view.label} />
                  {d.delay_reason ? <div className="mt-1 text-xs text-status-delayed">{d.delay_reason}</div> : null}
                </td>
                <td className="px-3 py-3 text-xs text-steel-600">{formatDateTime(d.revised_eta)}</td>
                {showProject ? (
                  <td className="px-3 py-3">
                    <Link href={`/projects/${d.project_id}/deliveries`} className="text-steel-700 hover:underline">
                      View
                    </Link>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
