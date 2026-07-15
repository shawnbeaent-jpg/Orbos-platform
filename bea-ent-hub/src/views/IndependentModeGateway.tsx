import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { INDEPENDENT_MODE_ROLES, ROLE_LABELS } from '../types';

const IndependentModeGateway: React.FC = () => {
  const { users, login } = useApp();
  const navigate = useNavigate();
  const independentUsers = users.filter((u) => INDEPENDENT_MODE_ROLES.includes(u.role));

  const handleSelect = (userId: string) => {
    login(userId);
    navigate('/app/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-midnight-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative w-full max-w-4xl">
        <button onClick={() => navigate('/')} className="btn-ghost mb-8 text-xs">
          <ArrowLeft size={14} /> Back to Gateway
        </button>

        <div className="mb-10 text-center">
          <p className="label-mono mb-2">Independent Mode</p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-gold-100">DIY Artist &amp; Producer Entry</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-500">
            Sign in to an existing account, or register as a new independent artist or producer and activate your
            subscription.
          </p>
        </div>

        <div className="glass-card mb-8 flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10">
            <UserPlus size={22} className="text-gold-300" />
          </div>
          <h2 className="font-serif text-xl text-gold-100">New here?</h2>
          <p className="max-w-md text-sm text-charcoal-500">
            Register as an Indie Artist or Music Producer, pick a subscription plan, and execute your digital
            onboarding contract to activate your account.
          </p>
          <button onClick={() => navigate('/independent/register')} className="btn-gold">
            Start Registration
          </button>
        </div>

        <div>
          <p className="label-mono mb-3 flex items-center gap-2"><LogIn size={12} /> Existing Accounts</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {independentUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelect(user.id)}
                className="glass-card group flex items-center gap-3 p-4 text-left transition hover:border-gold-500/40 hover:shadow-gold"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 font-mono text-sm text-gold-200">
                  {user.avatarInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-charcoal-500 group-hover:text-gold-100">{user.name}</p>
                  <p className="label-mono truncate">{ROLE_LABELS[user.role]} · {user.subscriptionTier ?? 'Hustler'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndependentModeGateway;
