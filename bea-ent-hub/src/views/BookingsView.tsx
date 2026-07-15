import React, { useState } from 'react';
import { CalendarClock, MapPin, Plus, X } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, Table, formatCents, statusTone } from '../components/ui';
import { BookingStatus, BookingType } from '../types';

const STATUSES: BookingStatus[] = ['Inquiry', 'Confirmed', 'Completed', 'Cancelled'];
const CONTRACT_STAGES = ['Draft', 'Sent', 'Signed', 'Countersigned'];
const TYPES: BookingType[] = ['Live Show', 'Festival', 'Private Event', 'Radio Appearance', 'TV/Press'];

const BookingsView: React.FC = () => {
  const { bookings, updateBookingStatus, addBooking, activeArtistId } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<BookingType>('Live Show');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const submit = () => {
    if (!title.trim() || !date || !location.trim()) return;
    addBooking({
      id: `bk-${Date.now()}`,
      artistId: activeArtistId,
      type,
      title: title.trim(),
      date,
      location: location.trim(),
      status: 'Inquiry',
      contractStatus: 'Draft',
    });
    setTitle('');
    setDate('');
    setLocation('');
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Live Gigs & Performance Routing"
        title="Bookings"
        description="Multi-stage contract routing from draft through countersigned, alongside the full live gig database."
        action={
          <button onClick={() => setShowForm((v) => !v)} className="btn-gold">
            {showForm ? <X size={15} /> : <Plus size={15} />} {showForm ? 'Cancel' : 'New Booking'}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <SectionTitle>New Booking Request</SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="label-mono mb-1.5">Title</p>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-dark" placeholder="e.g. Fall Regional Run" />
            </div>
            <div>
              <p className="label-mono mb-1.5">Type</p>
              <select value={type} onChange={(e) => setType(e.target.value as BookingType)} className="input-dark">
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <p className="label-mono mb-1.5">Date</p>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-dark" />
            </div>
            <div>
              <p className="label-mono mb-1.5">Location</p>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-dark" placeholder="Venue, City, State" />
            </div>
          </div>
          <button onClick={submit} className="btn-gold mt-4">Create Booking</button>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {CONTRACT_STAGES.map((stage) => (
          <Card key={stage} className="text-center">
            <p className="label-mono mb-1">{stage}</p>
            <p className="font-serif text-2xl text-gold-100">{bookings.filter((b) => b.contractStatus === stage).length}</p>
          </Card>
        ))}
      </div>

      <Card>
        <SectionTitle sub="Every live gig, festival slot, and private booking">
          <span className="inline-flex items-center gap-2"><CalendarClock size={16} className="text-gold-400" /> Gig Database</span>
        </SectionTitle>
        <Table headers={['Event', 'Date', 'Venue', 'Capacity', 'Fee', 'Status', 'Contract']}>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className="px-4 py-3">
                <p className="text-charcoal-500">{b.title}</p>
                <p className="label-mono">{b.type}</p>
              </td>
              <td className="px-4 py-3 text-xs text-charcoal-600">{b.date}</td>
              <td className="px-4 py-3 text-xs text-charcoal-600"><span className="inline-flex items-center gap-1"><MapPin size={11} />{b.location}</span></td>
              <td className="px-4 py-3 text-xs text-charcoal-600">{b.venueCapacity?.toLocaleString() ?? '—'}</td>
              <td className="px-4 py-3 text-xs text-charcoal-600">{b.performanceFeeCents ? formatCents(b.performanceFeeCents) : '—'}</td>
              <td className="px-4 py-3">
                <select
                  value={b.status}
                  onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                  className="rounded-md border border-white/10 bg-transparent px-2 py-1 text-xs text-charcoal-500"
                >
                  {STATUSES.map((s) => <option key={s} value={s} className="bg-midnight-900">{s}</option>)}
                </select>
              </td>
              <td className="px-4 py-3"><Badge tone={statusTone(b.contractStatus)}>{b.contractStatus}</Badge></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};

export default BookingsView;
