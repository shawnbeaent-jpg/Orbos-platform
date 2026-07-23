import { StatusBadge } from '@/components/ui';
import { claimStatusView } from '@/lib/status';
import { formatDate } from '@/lib/format';
import { computeClaimAging } from '@/lib/claims/deadlines';
import type { DamageClaimRow } from '@/lib/supabase/database.types';

const ESCALATION_LABEL: Record<string, { text: string; cls: string }> = {
  none: { text: '—', cls: 'text-steel-400' },
  due_soon: { text: 'Due soon', cls: 'text-status-delayed' },
  overdue: { text: 'Overdue', cls: 'text-status-blocked' },
  critical: { text: 'Notice lapsing', cls: 'text-status-damaged font-semibold' },
};

export function ClaimsTable({ claims }: { claims: DamageClaimRow[] }) {
  const now = new Date();
  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full divide-y divide-steel-200 text-sm">
        <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
          <tr>
            <th className="px-3 py-3">Claim</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Impact</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Notice deadline</th>
            <th className="px-3 py-3">Escalation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-steel-100">
          {claims.map((c) => {
            const view = claimStatusView(c.status);
            const aging = computeClaimAging(
              {
                openedAt: new Date(c.opened_at),
                noticeDeadline: c.notice_deadline ? new Date(c.notice_deadline) : null,
                responseDueDate: c.response_due_date ? new Date(c.response_due_date) : null,
                resolved: ['resolved', 'closed', 'denied'].includes(c.status),
              },
              now,
            );
            const esc = ESCALATION_LABEL[aging.escalation] ?? ESCALATION_LABEL.none!;
            return (
              <tr key={c.id} className="hover:bg-steel-50">
                <td className="px-3 py-3">
                  <div className="font-medium text-steel-900">{c.claim_number}</div>
                  <div className="max-w-xs truncate text-xs text-steel-500">{c.description}</div>
                </td>
                <td className="px-3 py-3 text-xs capitalize text-steel-600">{c.claim_type.replace(/_/g, ' ')}</td>
                <td className="px-3 py-3">
                  {c.blocking ? (
                    <span className="badge bg-status-blocked/10 text-status-blocked">Blocking</span>
                  ) : (
                    <span className="badge bg-steel-200 text-steel-700">Non-blocking</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge kind={view.kind} label={view.label} />
                </td>
                <td className="px-3 py-3 text-xs text-steel-600">{formatDate(c.notice_deadline)}</td>
                <td className={`px-3 py-3 text-xs ${esc.cls}`}>{esc.text}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
