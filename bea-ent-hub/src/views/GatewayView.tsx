import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Compass, ShieldCheck } from 'lucide-react';

const NODES = [
  {
    id: 'label',
    title: 'Label Mode',
    icon: Building2,
    description: 'Enterprise roster management for managers, PR, booking agents, editors, and assistants working across multiple artists.',
    cta: 'Enter Label Mode',
    path: '/label',
  },
  {
    id: 'independent',
    title: 'Independent Mode',
    icon: Compass,
    description: 'DIY artist & producer entry — sign in to your existing account, or register a new one and activate your subscription.',
    cta: 'Enter Independent Mode',
    path: '/independent',
  },
  {
    id: 'master',
    title: 'Master Command',
    icon: ShieldCheck,
    description: 'System-wide oversight for BEA Master Control — global statistics, security ledger, and diagnostic console.',
    cta: 'Enter Master Command',
    path: '/master',
  },
];

const GatewayView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-midnight-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative w-full max-w-5xl">
        <div className="mb-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gradient-to-br from-gold-400/20 to-transparent shadow-gold">
            <span className="font-serif text-3xl text-gold-300">B</span>
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-gold-100">BEA ENT. Command Hub</h1>
          <p className="label-mono mt-3">Encrypted Executive Access Terminal</p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-charcoal-500">
            Select a system node to continue. Each node routes to a different authentication path and interface.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {NODES.map((node) => {
            const Icon = node.icon;
            return (
              <button
                key={node.id}
                onClick={() => navigate(node.path)}
                className="glass-card group flex flex-col items-start gap-4 p-7 text-left transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-gold-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 transition group-hover:bg-gold-500/20">
                  <Icon size={22} className="text-gold-300" />
                </div>
                <h2 className="font-serif text-xl text-gold-100">{node.title}</h2>
                <p className="flex-1 text-sm leading-relaxed text-charcoal-500">{node.description}</p>
                <span className="label-mono text-gold-400 transition group-hover:text-gold-200">{node.cta} →</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GatewayView;
