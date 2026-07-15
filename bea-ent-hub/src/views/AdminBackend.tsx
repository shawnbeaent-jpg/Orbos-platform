import React, { useState } from 'react';
import { ShieldAlert, Database, Activity, Disc3, CheckCircle2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, StatTile, Table, formatCents, statusTone } from '../components/ui';
import { BeatStatus } from '../types';

const BEAT_STATUSES: BeatStatus[] = ['Pending', 'Under Review', 'Artist Hold', 'Placed', 'Passed'];

const AdminBackend: React.FC = () => {
  const { auditLog, invoices, artists, beats, updateBeatStatus, updateBeatAdminFeedback, placeBeatWithArtist } = useApp();
  const totalPayouts = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amountCents, 0);
  const blockedAttempts = auditLog.filter((a) => a.result === 'BLOCKED').length;
  const [placementDrafts, setPlacementDrafts] = useState<Record<string, string>>({});

  const handleStatusChange = (id: string, status: BeatStatus) => {
    if (status === 'Placed') return; // handled via the dedicated placement confirm flow below
    updateBeatStatus(id, status);
  };

  return (
    <div>
      <PageHeader eyebrow="Master Security Ledger" title="Admin Backend" description="System-wide statistics, transaction logs, audit trail, and the global beat placement engine." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Subscription Payouts" value={formatCents(totalPayouts)} />
        <StatTile label="Active Rostered Artists" value={String(artists.length)} />
        <StatTile label="Blocked Access Attempts" value={String(blockedAttempts)} positive={blockedAttempts === 0} />
        <StatTile label="Audit Entries Logged" value={String(auditLog.length)} />
      </div>

      <Card className="mb-6">
        <SectionTitle sub="Review every global submission, leave feedback, and finalize placements">
          <span className="inline-flex items-center gap-2"><Disc3 size={16} className="text-gold-400" /> Beat Placement Engine</span>
        </SectionTitle>
        <div className="space-y-3">
          {beats.map((b) => (
            <div key={b.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-charcoal-500">{b.title} <span className="label-mono">by {b.producerName}</span></p>
                  <p className="label-mono mt-0.5">{b.bpm} BPM · {b.key} · {b.genre} · fee {b.submissionFeePaid ? 'paid' : 'unpaid'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value as BeatStatus)}
                    className="rounded-md border border-white/10 bg-transparent px-2 py-1 text-xs text-charcoal-500"
                  >
                    {BEAT_STATUSES.map((s) => <option key={s} value={s} className="bg-midnight-900">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">{b.visionArtists.map((v) => <Badge key={v}>{v}</Badge>)}</div>

              <div className="mt-3">
                <p className="label-mono mb-1.5">Admin Feedback</p>
                <textarea
                  defaultValue={b.adminFeedback ?? ''}
                  onBlur={(e) => updateBeatAdminFeedback(b.id, e.target.value)}
                  rows={2}
                  className="input-dark resize-none text-xs"
                  placeholder="Notes for the producer — mix feedback, artist interest, next steps..."
                />
              </div>

              {b.status === 'Placed' ? (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                  <CheckCircle2 size={15} /> Placed with {b.acceptedBy} — beat license contract auto-generated
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input
                    value={placementDrafts[b.id] ?? ''}
                    onChange={(e) => setPlacementDrafts({ ...placementDrafts, [b.id]: e.target.value })}
                    className="input-dark max-w-xs text-xs"
                    placeholder="Artist name accepting this beat"
                    list={`vision-${b.id}`}
                  />
                  <datalist id={`vision-${b.id}`}>
                    {b.visionArtists.map((v) => <option key={v} value={v} />)}
                  </datalist>
                  <button
                    onClick={() => placementDrafts[b.id]?.trim() && placeBeatWithArtist(b.id, placementDrafts[b.id].trim())}
                    disabled={!placementDrafts[b.id]?.trim()}
                    className="btn-gold px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Confirm Placement
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

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
