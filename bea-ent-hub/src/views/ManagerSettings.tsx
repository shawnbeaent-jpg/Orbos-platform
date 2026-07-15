import React, { useState } from 'react';
import { Settings, UserPlus } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card, PageHeader, SectionTitle } from '../components/ui';
import { ROLE_LABELS, UserRole } from '../types';

const INVITE_ROLES = Object.values(UserRole);

const ManagerSettings: React.FC = () => {
  const { commissionDefaultPct, setCommissionDefaultPct } = useApp();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.ARTIST);
  const [invited, setInvited] = useState<{ email: string; role: UserRole }[]>([]);

  const invite = () => {
    if (!inviteEmail.trim()) return;
    setInvited([{ email: inviteEmail.trim(), role: inviteRole }, ...invited]);
    setInviteEmail('');
  };

  return (
    <div>
      <PageHeader eyebrow="Global Configurations" title="Manager Settings" description="Adjust default commission rates, subscription scopes, and invite new stakeholders." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle sub="Applied across new invoices and royalty projections">
            <span className="inline-flex items-center gap-2"><Settings size={16} className="text-gold-400" /> Default Commission</span>
          </SectionTitle>
          <div className="mb-2 flex justify-between text-xs">
            <span className="label-mono">Commission Rate</span>
            <span className="font-mono text-gold-300">{commissionDefaultPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            value={commissionDefaultPct}
            onChange={(e) => setCommissionDefaultPct(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
        </Card>

        <Card>
          <SectionTitle sub="Grant portal access to a new team member">
            <span className="inline-flex items-center gap-2"><UserPlus size={16} className="text-gold-400" /> Invite Stakeholder</span>
          </SectionTitle>
          <div className="space-y-3">
            <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="input-dark" placeholder="name@email.com" />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as UserRole)} className="input-dark">
              {INVITE_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
            <button onClick={invite} className="btn-gold w-full">Send Invite</button>
          </div>
          {invited.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {invited.map((i, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs">
                  <span className="text-charcoal-500">{i.email}</span>
                  <span className="label-mono">{ROLE_LABELS[i.role]}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManagerSettings;
