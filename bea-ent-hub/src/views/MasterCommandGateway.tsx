import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Fingerprint } from 'lucide-react';
import { useApp } from '../state/AppContext';

const MasterCommandGateway: React.FC = () => {
  const { users, login } = useApp();
  const navigate = useNavigate();
  const [authenticating, setAuthenticating] = useState(false);
  const admin = users.find((u) => u.role === 'ADMIN');

  const handleAuthenticate = () => {
    if (!admin) return;
    setAuthenticating(true);
    setTimeout(() => {
      login(admin.id);
      navigate('/app/dashboard');
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-midnight-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative w-full max-w-md text-center">
        <button onClick={() => navigate('/')} className="btn-ghost mb-8 text-xs">
          <ArrowLeft size={14} /> Back to Gateway
        </button>

        <div className="glass-card flex flex-col items-center gap-5 p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 shadow-gold">
            <ShieldCheck size={28} className="text-gold-300" />
          </div>
          <div>
            <p className="label-mono mb-2">Master Command</p>
            <h1 className="font-serif text-2xl text-gold-100">BEA Master Control</h1>
            <p className="mt-2 text-sm text-charcoal-500">System-wide oversight of every roster, transaction, and security event.</p>
          </div>
          {admin && (
            <div className="w-full rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-left text-sm">
              <p className="text-charcoal-500">{admin.name}</p>
              <p className="label-mono">Clearance Level {admin.clearanceLevel} / 5</p>
            </div>
          )}
          <button onClick={handleAuthenticate} disabled={authenticating} className="btn-gold w-full">
            <Fingerprint size={15} className={authenticating ? 'animate-pulse' : ''} />
            {authenticating ? 'Authenticating…' : 'Authenticate & Enter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterCommandGateway;
