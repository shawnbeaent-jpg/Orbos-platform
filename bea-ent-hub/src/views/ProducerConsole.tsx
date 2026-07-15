import React, { useState } from 'react';
import { Disc3, Plus, X } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, Table, statusTone } from '../components/ui';
import { BeatStatus } from '../types';

const KEYS = ['C Major', 'C Minor', 'D Major', 'D Minor', 'E Minor', 'F Major', 'F# Minor', 'G Major', 'A Major', 'A Minor', 'B Minor'];
const GENRES = ['Trap', 'Drill', 'Alt R&B', 'Pop', 'Boom Bap', 'Afrobeats', 'Melodic Rap'];
const BEAT_STATUSES: BeatStatus[] = ['Pending', 'Under Review', 'Artist Hold', 'Placed', 'Passed'];

const ProducerConsole: React.FC = () => {
  const { beats, addBeatSubmission, updateBeatStatus, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState(120);
  const [key, setKey] = useState(KEYS[0]);
  const [genre, setGenre] = useState(GENRES[0]);
  const [visionInput, setVisionInput] = useState('');
  const [visionArtists, setVisionArtists] = useState<string[]>([]);

  const addVisionArtist = () => {
    const v = visionInput.trim();
    if (v && visionArtists.length < 5 && !visionArtists.includes(v)) {
      setVisionArtists([...visionArtists, v]);
      setVisionInput('');
    }
  };

  const submit = () => {
    if (!title.trim() || !currentUser) return;
    addBeatSubmission({
      id: `beat-${Date.now()}`,
      producerId: currentUser.id,
      producerName: currentUser.name,
      title: title.trim(),
      bpm,
      key,
      genre,
      visionArtists,
      status: 'Pending',
      submissionFeePaid: false,
      contractStatus: 'N/A',
      releaseStatus: 'Unreleased',
      submittedDate: new Date().toISOString().slice(0, 10),
    });
    setTitle('');
    setBpm(120);
    setVisionArtists([]);
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Beat Marketplace & Placements"
        title="Producer Console"
        description="Submit instrumentals, tag vision artists, and track every submission from pending to placed."
        action={
          <button onClick={() => setShowForm((v) => !v)} className="btn-gold">
            {showForm ? <X size={15} /> : <Plus size={15} />} {showForm ? 'Cancel' : 'Submit Beat'}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <SectionTitle sub="Up to 5 vision artists per submission">
            <span className="inline-flex items-center gap-2"><Disc3 size={16} className="text-gold-400" /> New Submission</span>
          </SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="label-mono mb-1.5">Title</p>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-dark" placeholder="e.g. Midnight Ledger" />
            </div>
            <div>
              <p className="label-mono mb-1.5">Genre</p>
              <select value={genre} onChange={(e) => setGenre(e.target.value)} className="input-dark">
                {GENRES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <p className="label-mono mb-1.5">BPM: {bpm}</p>
              <input type="range" min={60} max={200} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-full accent-gold-500" />
            </div>
            <div>
              <p className="label-mono mb-1.5">Key Signature</p>
              <select value={key} onChange={(e) => setKey(e.target.value)} className="input-dark">
                {KEYS.map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <p className="label-mono mb-1.5">Vision Artists ({visionArtists.length}/5)</p>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {visionArtists.map((v) => (
                  <Badge key={v} tone="gold">
                    <span className="flex items-center gap-1">
                      {v}
                      <button onClick={() => setVisionArtists(visionArtists.filter((a) => a !== v))}><X size={11} /></button>
                    </span>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={visionInput}
                  onChange={(e) => setVisionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addVisionArtist()}
                  disabled={visionArtists.length >= 5}
                  className="input-dark"
                  placeholder="Type an artist name and press Enter"
                />
                <button onClick={addVisionArtist} className="btn-ghost shrink-0" disabled={visionArtists.length >= 5}>Add</button>
              </div>
            </div>
          </div>
          <button onClick={submit} className="btn-gold mt-4">Submit for Review</button>
        </Card>
      )}

      <Card>
        <SectionTitle sub="Track every beat from pending to placed">Submission Pipeline</SectionTitle>
        <Table headers={['Title', 'BPM / Key', 'Genre', 'Vision Artists', 'Status', 'Contract']}>
          {beats.map((b) => (
            <tr key={b.id}>
              <td className="px-4 py-3 text-charcoal-500">{b.title}</td>
              <td className="px-4 py-3 font-mono text-xs text-charcoal-600">{b.bpm} BPM · {b.key}</td>
              <td className="px-4 py-3 text-charcoal-500">{b.genre}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">{b.visionArtists.map((v) => <Badge key={v}>{v}</Badge>)}</div>
              </td>
              <td className="px-4 py-3">
                <select
                  value={b.status}
                  onChange={(e) => updateBeatStatus(b.id, e.target.value as BeatStatus)}
                  className="rounded-md border border-white/10 bg-transparent px-2 py-1 text-xs text-charcoal-500"
                >
                  {BEAT_STATUSES.map((s) => <option key={s} value={s} className="bg-midnight-900">{s}</option>)}
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

export default ProducerConsole;
