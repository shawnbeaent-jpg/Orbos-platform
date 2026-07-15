import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { LABEL_MODE_ROLES, ROLE_LABELS } from '../types';

const ROLE_DESCRIPTIONS: Record<string, string> = {
  MANAGER: 'Full-spectrum control across every artist, campaign, and contract.',
  ARTIST: 'Your dashboard, active tasks, and tour logistics at a glance.',
  PR: 'Outreach CRM, press pitches, and curator relationships.',
  BOOKING_AGENT: 'Live performance routing, venue contracts, gig calendar.',
  ASSISTANT: 'Tactical asset management and day-to-day logistics support.',
  EDITOR: 'Content editing queue and asset delivery.',
};

const LabelModeLogin: React.FC = () => {
  const { users, login } = useApp();
  const navigate = useNavigate();
  const labelUsers = users.filter((u) => LABEL_MODE_ROLES.includes(u.role));

  const handleSelect = (userId: string) => {
    login(userId);
    navigate('/app/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-midnight-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative w-full max-w-5xl">
        <button onClick={() => navigate('/')} className="btn-ghost mb-8 text-xs">
          <ArrowLeft size={14} /> Back to Gateway
        </button>

        <div className="mb-12 text-center">
          <p className="label-mono mb-2">Label Mode</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gold-100">Roster Profile Selection</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-500">
            Select your profile. Each role sees only the tools it's cleared for — unauthorized tabs trigger an Access
            Denied screen.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labelUsers.map((user) => (
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

export default LabelModeLogin;
