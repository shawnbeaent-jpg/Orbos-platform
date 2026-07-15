import React, { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, statusTone } from '../components/ui';

const CATEGORIES = ['All', 'Label', 'Legal', 'Promoter', 'Photographer', 'Videographer', 'Distributor'] as const;

const NetworkingView: React.FC = () => {
  const { networking } = useApp();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [stateFilter, setStateFilter] = useState('All');

  const states = useMemo(() => ['All', ...Array.from(new Set(networking.map((n) => n.state)))], [networking]);

  const filtered = networking.filter(
    (n) => (category === 'All' || n.category === category) && (stateFilter === 'All' || n.state === stateFilter),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Industry Rolodex"
        title="Networking Directory"
        description="Categorized address book of labels, legal consultants, promoters, and creative collaborators."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${category === c ? 'border-gold-500/50 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-500 hover:border-gold-500/30'}`}>
              {c}
            </button>
          ))}
        </div>
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="input-dark ml-auto w-32 py-1.5 text-xs">
          {states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((n) => (
          <Card key={n.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-charcoal-500">{n.name}</p>
                <p className="label-mono mt-0.5">{n.org}</p>
              </div>
              <Badge tone={statusTone(n.status)}>{n.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-charcoal-600">
              <Users size={12} /> {n.category} · {n.city}, {n.state}
            </div>
            <div className="border-t border-white/5 pt-2 text-xs text-charcoal-600">
              <p>{n.email}</p>
              <p>{n.phone}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NetworkingView;
