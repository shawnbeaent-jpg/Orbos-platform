import React, { useState } from 'react';
import { Wallet, Radio } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, Table, formatCents, statusTone } from '../components/ui';

const FinancialsView: React.FC = () => {
  const { splits, updateSplit, invoices, commissionDefaultPct } = useApp();
  const [selectedSplitId, setSelectedSplitId] = useState(splits[0]?.id ?? '');
  const selected = splits.find((s) => s.id === selectedSplitId) ?? splits[0];

  const setPct = (key: 'artistPct' | 'producerPct' | 'managerPct' | 'labelPct', value: number) => {
    if (!selected) return;
    updateSplit(selected.id, { [key]: value });
  };

  const total = selected ? selected.artistPct + selected.producerPct + selected.managerPct + selected.labelPct : 0;
  const projectedSpins = 4200;
  const projectedRate = 0.004;

  return (
    <div>
      <PageHeader
        eyebrow="Splits, Invoices & Royalty Accounting"
        title="Financials"
        description="Adjust royalty splits, dispatch invoices, and project radio spin licensing revenue."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle sub={total !== 100 ? `⚠ Splits total ${total}% — should equal 100%` : 'Splits total 100%'}>
            <span className="inline-flex items-center gap-2"><Wallet size={16} className="text-gold-400" /> Split Calculator</span>
          </SectionTitle>
          <select value={selectedSplitId} onChange={(e) => setSelectedSplitId(e.target.value)} className="input-dark mb-4">
            {splits.map((s) => <option key={s.id} value={s.id}>{s.trackTitle}</option>)}
          </select>
          {selected && (
            <div className="space-y-4">
              {([
                ['artistPct', 'Artist'],
                ['producerPct', 'Producer'],
                ['managerPct', 'Manager'],
                ['labelPct', 'Label'],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="label-mono">{label}</span>
                    <span className="font-mono text-gold-300">{selected[key]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={selected[key]}
                    onChange={(e) => setPct(key, Number(e.target.value))}
                    className="w-full accent-gold-500"
                  />
                </div>
              ))}
              <div className={`rounded-lg border px-3 py-2 text-center text-sm font-medium ${total === 100 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}>
                Total: {total}%
              </div>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle sub="Simulated based on recent regional spin counts">
            <span className="inline-flex items-center gap-2"><Radio size={16} className="text-gold-400" /> Radio Spin Licensing Projection</span>
          </SectionTitle>
          <div className="space-y-3">
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <p className="label-mono mb-1">Tracked Spins (30-day)</p>
              <p className="font-serif text-2xl text-gold-100">{projectedSpins.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <p className="label-mono mb-1">Projected Licensing Revenue</p>
              <p className="font-serif text-2xl text-gold-100">{formatCents(Math.round(projectedSpins * projectedRate * 100))}</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <p className="label-mono mb-1">Manager Commission Rate</p>
              <p className="font-serif text-2xl text-gold-100">{commissionDefaultPct}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <SectionTitle sub="Dispatch status across festival, venue, and event clients">Invoices</SectionTitle>
          <Table headers={['Client', 'Amount', 'Issued', 'Due', 'Status']}>
            {invoices.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-3 text-charcoal-500">{i.client}</td>
                <td className="px-4 py-3 font-mono text-gold-200">{formatCents(i.amountCents)}</td>
                <td className="px-4 py-3 text-xs text-charcoal-600">{i.issuedDate}</td>
                <td className="px-4 py-3 text-xs text-charcoal-600">{i.dueDate}</td>
                <td className="px-4 py-3"><Badge tone={statusTone(i.status)}>{i.status}</Badge></td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default FinancialsView;
