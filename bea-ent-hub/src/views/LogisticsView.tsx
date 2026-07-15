import React from 'react';
import { Plane, Hotel, Package, CheckSquare, Square } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, statusTone } from '../components/ui';

const LogisticsView: React.FC = () => {
  const { flights, hotels, gear, toggleGearPacked } = useApp();
  const packedCount = gear.filter((g) => g.packed).length;
  const totalWeight = gear.reduce((sum, g) => sum + g.weightLbs, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Tour Coordination & Manifests"
        title="Tour Logistics"
        description="Flight itineraries, hotel confirmations, and the full gear manifest for the next leg of the tour."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle sub="Flight codes, gates, and confirmation numbers">
            <span className="inline-flex items-center gap-2"><Plane size={16} className="text-gold-400" /> Flight Itineraries</span>
          </SectionTitle>
          <div className="space-y-3">
            {flights.map((f) => (
              <div key={f.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm text-gold-200">{f.flightCode}</p>
                  <Badge tone={statusTone(f.status === 'Checked-in' ? 'Completed' : 'Pending')}>{f.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-charcoal-500">{f.airline} · Gate {f.departureGate}</p>
                <p className="text-xs text-charcoal-600">Depart {new Date(f.departure).toLocaleString()}</p>
                <p className="text-xs text-charcoal-600">Arrive {new Date(f.arrival).toLocaleString()}</p>
                <p className="label-mono mt-1">Confirmation: {f.confirmationCode}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle sub="Check-in windows and room confirmations">
            <span className="inline-flex items-center gap-2"><Hotel size={16} className="text-gold-400" /> Hotel Stays</span>
          </SectionTitle>
          <div className="space-y-3">
            {hotels.map((h) => (
              <div key={h.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-charcoal-500">{h.hotelName}</p>
                  <Badge tone={statusTone(h.status)}>{h.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-charcoal-600">{h.city} · {h.roomType}</p>
                <p className="text-xs text-charcoal-600">{h.checkIn} → {h.checkOut}</p>
                <p className="label-mono mt-1">Confirmation: {h.confirmationCode}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <SectionTitle sub="Weight, transport category, and packing status">
              <span className="inline-flex items-center gap-2"><Package size={16} className="text-gold-400" /> Gear Manifest</span>
            </SectionTitle>
            <div className="text-right">
              <p className="label-mono">{packedCount}/{gear.length} packed</p>
              <p className="text-xs text-charcoal-600">{totalWeight} lbs total</p>
            </div>
          </div>
          <div className="space-y-2">
            {gear.map((g) => (
              <button key={g.id} onClick={() => toggleGearPacked(g.id)} className="flex w-full items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5 text-left transition hover:border-gold-500/30">
                {g.packed ? <CheckSquare size={16} className="text-gold-400" /> : <Square size={16} className="text-charcoal-600" />}
                <span className={`flex-1 text-sm ${g.packed ? 'text-charcoal-600 line-through' : 'text-charcoal-500'}`}>{g.name}</span>
                <span className="label-mono">{g.category}</span>
                <span className="label-mono">{g.weightLbs} lbs</span>
                <Badge>{g.transportCategory}</Badge>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LogisticsView;
