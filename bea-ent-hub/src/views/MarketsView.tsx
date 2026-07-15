import React from 'react';
import { Globe2, CloudSun, Music } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, statusTone } from '../components/ui';

const MarketsView: React.FC = () => {
  const { markets } = useApp();
  const sorted = [...markets].sort((a, b) => b.tourDemand - a.tourDemand);

  return (
    <div>
      <PageHeader
        eyebrow="Geographic Market Intel"
        title="Market Intelligence"
        description="Streaming density, live tour demand, and regional priority scoring across active target markets."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((m) => (
          <Card key={m.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-1.5 font-serif text-lg text-gold-100">
                  <Globe2 size={15} className="text-gold-400" /> {m.city}
                </p>
                <p className="label-mono mt-0.5">{m.state}</p>
              </div>
              <Badge tone={statusTone(m.priority === 'High' ? 'Completed' : m.priority === 'Medium' ? 'Pending' : 'Cancelled')}>{m.priority} Priority</Badge>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs text-charcoal-600">
                <span className="inline-flex items-center gap-1"><Music size={11} /> Streaming Density</span>
                <span>{m.streamingDensity}/100</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gold-500" style={{ width: `${m.streamingDensity}%` }} />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs text-charcoal-600">
                <span>Tour Demand</span>
                <span>{m.tourDemand}/100</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${m.tourDemand}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-t border-white/5 pt-2 text-xs text-charcoal-600">
              <CloudSun size={12} /> {m.weather} · {m.temperatureF}°F
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketsView;
