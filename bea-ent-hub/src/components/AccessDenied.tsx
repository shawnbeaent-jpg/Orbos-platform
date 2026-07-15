import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { ROLE_LABELS } from '../types';

const AccessDenied: React.FC<{ node: string }> = ({ node }) => {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10">
        <ShieldAlert size={26} className="text-red-400" />
      </div>
      <div>
        <p className="label-mono mb-2 text-red-400/80">Encrypted Data Node — Access Denied</p>
        <h1 className="font-serif text-2xl text-gold-100">Insufficient Clearance</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-charcoal-500">
          {currentUser ? ROLE_LABELS[currentUser.role] : 'This profile'} is not authorized to reach{' '}
          <span className="font-mono text-charcoal-600">{node}</span>. This attempt has been written to the Master
          Security Ledger.
        </p>
      </div>
      <button onClick={() => navigate('/app/dashboard')} className="btn-gold">
        Return to Command Hub
      </button>
    </div>
  );
};

export default AccessDenied;
