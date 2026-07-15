import React, { useState } from 'react';
import { Archive, UploadCloud, AlertTriangle } from 'lucide-react';
import { useApp, useCurrentArtist } from '../state/AppContext';
import { Badge, Card, EmptyState, PageHeader, SectionTitle } from '../components/ui';
import { AssetCategory } from '../types';

const CATEGORIES: (AssetCategory | 'All')[] = ['All', 'Master', 'Stem', 'Artwork', 'BTS Footage', 'Promo Clip'];

const ArtistVault: React.FC = () => {
  const { assets, addAsset, activeArtistId } = useApp();
  const artist = useCurrentArtist();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All');
  const [uploading, setUploading] = useState(false);

  const scoped = assets.filter((a) => a.artistId === activeArtistId);
  const filtered = filter === 'All' ? scoped : scoped.filter((a) => a.category === filter);
  const now = new Date();

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      addAsset({
        id: `asset-${Date.now()}`,
        artistId: activeArtistId,
        name: `Untitled Upload — ${new Date().toLocaleTimeString()}`,
        category: 'Promo Clip',
        fileType: 'MP4',
        sizeMb: Math.round(40 + Math.random() * 300),
        uploadedDate: new Date().toISOString().slice(0, 10),
      });
      setUploading(false);
    }, 900);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Content & Asset Bank"
        title={`${artist?.name ?? 'Artist'} Vault`}
        description="Central repository for masters, stems, artwork, and behind-the-scenes footage."
        action={
          <button onClick={simulateUpload} className="btn-gold">
            <UploadCloud size={15} /> {uploading ? 'Uploading…' : 'Batch Upload'}
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${filter === c ? 'border-gold-500/50 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-500 hover:border-gold-500/30'}`}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No assets in this category yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => {
            const isExpiringSoon = a.expiresAt && new Date(a.expiresAt).getTime() - now.getTime() < 1000 * 60 * 60 * 24 * 30;
            return (
              <Card key={a.id} className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/15">
                    <Archive size={16} className="text-gold-300" />
                  </div>
                  <Badge>{a.fileType}</Badge>
                </div>
                <p className="text-sm text-charcoal-500">{a.name}</p>
                <p className="label-mono">{a.category} · {a.sizeMb} MB</p>
                <p className="text-xs text-charcoal-600">Uploaded {a.uploadedDate}</p>
                {a.scheduledPlatform && (
                  <p className="text-xs text-gold-400">Scheduled: {a.scheduledPlatform} on {a.scheduledDate}</p>
                )}
                {a.expiresAt && (
                  <p className={`flex items-center gap-1 text-xs ${isExpiringSoon ? 'text-amber-400' : 'text-charcoal-600'}`}>
                    {isExpiringSoon && <AlertTriangle size={11} />} Expires {a.expiresAt}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ArtistVault;
