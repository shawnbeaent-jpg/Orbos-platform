import React from 'react';
import { ShieldCheck, Mail, Radio } from 'lucide-react';
import { useApp, useCurrentArtist } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle } from '../components/ui';
import { ROLE_LABELS } from '../types';

const ProfileView: React.FC = () => {
  const { currentUser } = useApp();
  const artist = useCurrentArtist();
  if (!currentUser) return null;

  return (
    <div>
      <PageHeader eyebrow="Creative Identity Card" title="Profile" description="Your role clearances, connected socials, and professional contact information." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 font-serif text-2xl text-gold-200 shadow-gold">
              {currentUser.avatarInitials}
            </div>
            <div>
              <p className="font-serif text-xl text-gold-100">{currentUser.name}</p>
              <p className="label-mono mt-1">{ROLE_LABELS[currentUser.role]}</p>
            </div>
            <Badge tone="gold"><ShieldCheck size={11} className="mr-1 inline" />Clearance L{currentUser.clearanceLevel}</Badge>
            <p className="flex items-center gap-1.5 text-xs text-charcoal-600"><Mail size={12} />{currentUser.email}</p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle sub="Public bio and streaming footprint">Creative Bio</SectionTitle>
          {artist ? (
            <>
              <p className="text-sm leading-relaxed text-charcoal-500">{artist.bio}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <p className="label-mono">Genre</p>
                  <p className="mt-1 text-sm text-charcoal-500">{artist.genre}</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <p className="label-mono">Subscription Tier</p>
                  <p className="mt-1 text-sm text-charcoal-500">{artist.subscriptionTier}</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <p className="label-mono">Monthly Listeners</p>
                  <p className="mt-1 text-sm text-charcoal-500">{artist.monthlyListeners.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="label-mono flex items-center gap-1.5"><Radio size={12} /> Connected Socials</p>
                {artist.socials.map((s) => (
                  <div key={s.platform} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                    <span className="text-charcoal-500">{s.platform} · {s.handle}</span>
                    <span className="font-mono text-gold-300">{s.followers.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-charcoal-600">No linked artist profile for this role.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;
