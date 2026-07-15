import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card, PageHeader, SectionTitle } from '../components/ui';
import { IndieMilestone } from '../types';

const STAGES: IndieMilestone['stage'][] = ['Pre-Release', 'Release Week', 'Post-Release', 'Long-Tail Sync'];
const STAGE_DESC: Record<IndieMilestone['stage'], string> = {
  'Pre-Release': 'Distribution setup, PRO registration, and pre-save infrastructure.',
  'Release Week': 'Coordinated release-day push across every platform you own.',
  'Post-Release': 'Playlist pitching and sustained curator outreach.',
  'Long-Tail Sync': 'Passive revenue through sync licensing and catalog placement.',
};

const IndieRoadmap: React.FC = () => {
  const { indieMilestones, toggleIndieMilestone } = useApp();
  const completedCount = indieMilestones.filter((m) => m.done).length;

  return (
    <div>
      <PageHeader
        eyebrow="DIY Milestone Matrix"
        title="Indie Roadmap"
        description="A step-by-step guide through marketing, release setup, and long-tail licensing for self-managed artists."
        action={
          <div className="glass-card px-4 py-2 text-right">
            <p className="label-mono">Overall Progress</p>
            <p className="font-serif text-xl text-gold-100">{completedCount}/{indieMilestones.length}</p>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {STAGES.map((stage) => {
          const items = indieMilestones.filter((m) => m.stage === stage);
          return (
            <Card key={stage}>
              <SectionTitle sub={STAGE_DESC[stage]}>{stage}</SectionTitle>
              <div className="space-y-2">
                {items.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleIndieMilestone(m.id)}
                    className="flex w-full items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-gold-500/30"
                  >
                    {m.done ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold-400" /> : <Circle size={18} className="mt-0.5 shrink-0 text-charcoal-600" />}
                    <div>
                      <p className={`text-sm ${m.done ? 'text-charcoal-600 line-through' : 'text-charcoal-500'}`}>{m.label}</p>
                      <p className="mt-0.5 text-xs text-charcoal-600">{m.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default IndieRoadmap;
