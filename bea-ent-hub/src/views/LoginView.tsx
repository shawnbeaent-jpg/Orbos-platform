import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { ALL_USERS, useApp } from '../state/AppContext';
import { ROLE_LABELS } from '../types';

const ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: 'System-wide oversight, subscription ledger, clearance overrides.',
  MANAGER: 'Full-spectrum control across every artist, campaign, and contract.',
  INDIE: 'Self-managed DIY roadmap, guided release milestones.',
  PRODUCER: 'Beat marketplace, licensing pipeline, placement tracking.',
  ARTIST: 'Your dashboard, active tasks, and tour logistics at a glance.',
  PR: 'Outreach CRM, press pitches, and curator relationships.',
  BOOKING_AGENT: 'Live performance routing, venue contracts, gig calendar.',
  ASSISTANT: 'Tactical asset management and day-to-day logistics support.',
  EDITOR: 'Content editing queue and asset delivery.',
};

const LoginView: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSelect = (userId: string) => {
    login(userId);
    navigate('/app/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-midnight-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative w-full max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gradient-to-br from-gold-400/20 to-transparent shadow-gold">
            <span className="font-serif text-3xl text-gold-300">B</span>
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-gold-100">BEA ENT. Command Hub</h1>
          <p className="label-mono mt-3">Encrypted Executive Access Terminal</p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-charcoal-500">
            Select a clearance profile to enter the hub. The interface adapts in real time to your authorized role.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className="glass-card group flex flex-col gap-4 p-5 text-left transition hover:border-gold-500/40 hover:shadow-gold"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 font-mono text-sm text-gold-200">
                  {user.avatarInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-charcoal-500 group-hover:text-gold-100">{user.name}</p>
                  <p className="label-mono truncate">{ROLE_LABELS[user.role]}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-charcoal-600">{ROLE_DESCRIPTIONS[user.role]}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-gold-500/70">
                <ShieldCheck size={12} />
                <span className="font-mono uppercase tracking-wider">Clearance L{user.clearanceLevel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginView;
