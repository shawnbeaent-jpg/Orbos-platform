import React from 'react';
import { ShieldAlert, Database, Activity } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, StatTile, Table, formatCents, statusTone } from '../components/ui';

const AdminBackend: React.FC = () => {
  const { auditLog, invoices, artists } = useApp();
  const totalPayouts = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amountCents, 0);
  const blockedAttempts = auditLog.filter((a) => a.result === 'BLOCKED').length;

  return (
    <div>
      <PageHeader eyebrow="Master Security Ledger" title="Admin Backend" description="System-wide statistics, transaction logs, and audit trail across every clearance boundary." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Subscription Payouts" value={formatCents(totalPayouts)} />
        <StatTile label="Active Rostered Artists" value={String(artists.length)} />
        <StatTile label="Blocked Access Attempts" value={String(blockedAttempts)} positive={blockedAttempts === 0} />
        <StatTile label="Audit Entries Logged" value={String(auditLog.length)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle sub="Database write throughput, synthetic diagnostic">
            <span className="inline-flex items-center gap-2"><Database size={16} className="text-gold-400" /> Database Write Metrics</span>
          </SectionTitle>
          <div className="space-y-2">
            {[
              ['Tasks Table', '842 writes/day'],
              ['Financials Table', '211 writes/day'],
              ['Assets Table', '1,204 writes/day'],
              ['Audit Log Table', '96 writes/day'],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                <span className="inline-flex items-center gap-2 text-charcoal-500"><Activity size={13} className="text-gold-400" />{label}</span>
                <span className="font-mono text-xs text-charcoal-600">{val}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle sub="Role permission checks and security blocks">
            <span className="inline-flex items-center gap-2"><ShieldAlert size={16} className="text-gold-400" /> Audit Log</span>
          </SectionTitle>
          <div className="scrollbar-gold max-h-72 overflow-y-auto">
            <Table headers={['Actor', 'Action', 'Result']}>
              {auditLog.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 text-xs text-charcoal-500">{a.actor}</td>
                  <td className="px-4 py-3 text-xs text-charcoal-600">{a.action}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(a.result)}>{a.result}</Badge></td>
                </tr>
              ))}
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminBackend;
