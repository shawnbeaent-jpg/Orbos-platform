import React, { useMemo, useState } from 'react';
import { Disc3, Plus, X, UploadCloud, CreditCard, CheckCircle2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, Table, formatCents, statusTone } from '../components/ui';
import { BeatStatus } from '../types';

const KEYS = ['C Major', 'C Minor', 'D Major', 'D Minor', 'E Minor', 'F Major', 'F# Minor', 'G Major', 'A Major', 'A Minor', 'B Minor'];
const GENRES = ['Trap', 'Drill', 'Alt R&B', 'Pop', 'Boom Bap', 'Afrobeats', 'Melodic Rap'];
const BEAT_STATUSES: BeatStatus[] = ['Pending', 'Under Review', 'Artist Hold', 'Placed', 'Passed'];
const REQUIRED_VISION_ARTISTS = 5;
const SUBMISSION_FEE_CENTS = 2500;

const WaveformBars: React.FC<{ progress: number }> = ({ progress }) => {
  const bars = useMemo(() => Array.from({ length: 40 }, () => 20 + Math.random() * 80), []);
  return (
    <div className="flex h-16 items-end gap-[3px] overflow-hidden rounded-lg border border-white/10 bg-midnight-900/60 px-2 py-2">
      {bars.map((h, i) => {
        const litUpTo = (progress / 100) * bars.length;
        const lit = i < litUpTo;
        return <div key={i} className={`w-1.5 rounded-sm transition-colors ${lit ? 'bg-gold-400' : 'bg-white/10'}`} style={{ height: `${h}%` }} />;
      })}
    </div>
  );
};

const ProducerConsole: React.FC = () => {
  const { beats, addBeatSubmission, updateBeatStatus, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState(120);
  const [key, setKey] = useState(KEYS[0]);
  const [genre, setGenre] = useState(GENRES[0]);
  const [visionInput, setVisionInput] = useState('');
  const [visionArtists, setVisionArtists] = useState<string[]>([]);

  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [feePaid, setFeePaid] = useState(false);
  const [processingFee, setProcessingFee] = useState(false);

  const visionComplete = visionArtists.length === REQUIRED_VISION_ARTISTS;
  const canSubmit = !!title.trim() && visionComplete && !!audioFileName && feePaid;

  const addVisionArtist = () => {
    const v = visionInput.trim();
    if (v && visionArtists.length < REQUIRED_VISION_ARTISTS && !visionArtists.includes(v)) {
      setVisionArtists([...visionArtists, v]);
      setVisionInput('');
    }
  };

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    setAudioFileName(file.name);
    setUploadProgress(0);
    setUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return p + 8;
      });
    }, 80);
  };

  const processFee = () => {
    if (cardNumber.replace(/\s/g, '').length < 12 || !cardExpiry) return;
    setProcessingFee(true);
    setTimeout(() => {
      setProcessingFee(false);
      setFeePaid(true);
    }, 900);
  };

  const submit = () => {
    if (!canSubmit || !currentUser) return;
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
      submissionFeePaid: true,
      contractStatus: 'N/A',
      releaseStatus: 'Unreleased',
      submittedDate: new Date().toISOString().slice(0, 10),
      audioFileName: audioFileName ?? undefined,
    });
    setTitle('');
    setBpm(120);
    setVisionArtists([]);
    setAudioFileName(null);
    setUploadProgress(0);
    setCardNumber('');
    setCardExpiry('');
    setFeePaid(false);
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Beat Marketplace & Placements"
        title="Producer Console"
        description="Submit instrumentals, tag exactly 5 vision artists, and track every submission from pending to placed."
        action={
          <button onClick={() => setShowForm((v) => !v)} className="btn-gold">
            {showForm ? <X size={15} /> : <Plus size={15} />} {showForm ? 'Cancel' : 'Submit Beat'}
          </button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <SectionTitle sub="Exactly 5 vision artists required per submission">
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
              <p className="label-mono mb-1.5">
                Vision Artists ({visionArtists.length}/{REQUIRED_VISION_ARTISTS}){!visionComplete && <span className="ml-2 text-amber-400">— exactly 5 required</span>}
              </p>
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
                  disabled={visionArtists.length >= REQUIRED_VISION_ARTISTS}
                  className="input-dark"
                  placeholder="Type an artist name and press Enter"
                />
                <button onClick={addVisionArtist} className="btn-ghost shrink-0" disabled={visionArtists.length >= REQUIRED_VISION_ARTISTS}>Add</button>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-white/5 pt-5">
            <p className="label-mono mb-2 flex items-center gap-1.5"><UploadCloud size={12} /> Audio File</p>
            <label className="flex cursor-pointer flex-col gap-3">
              <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0])} />
              <div className="rounded-lg border border-dashed border-gold-500/30 px-4 py-3 text-center text-xs text-charcoal-500 hover:border-gold-500/50">
                {audioFileName ? audioFileName : 'Click to choose an audio file (WAV/MP3)'}
              </div>
            </label>
            {audioFileName && (
              <div className="mt-3 space-y-2">
                <WaveformBars progress={uploadProgress} />
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="label-mono">{uploading ? `Uploading… ${uploadProgress}%` : 'Upload complete'}</p>
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-white/5 pt-5">
            <p className="label-mono mb-2 flex items-center gap-1.5"><CreditCard size={12} /> Submission Fee — {formatCents(SUBMISSION_FEE_CENTS)}</p>
            {feePaid ? (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                <CheckCircle2 size={15} /> Submission fee paid
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px_auto]">
                <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="input-dark font-mono" placeholder="Card number" />
                <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="input-dark font-mono" placeholder="MM/YY" />
                <button onClick={processFee} disabled={processingFee} className="btn-gold shrink-0">
                  {processingFee ? 'Processing…' : `Pay ${formatCents(SUBMISSION_FEE_CENTS)}`}
                </button>
              </div>
            )}
          </div>

          <button onClick={submit} disabled={!canSubmit} className="btn-gold mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40">
            Submit for Review
          </button>
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
