import React from 'react';
import { Check, Lock, Crown, Flame } from 'lucide-react';
import { Card, PageHeader, SectionTitle, formatCents } from '../components/ui';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { useApp } from '../state/AppContext';

const PLAN_ICON = { Hustler: Flame, Mogul: Crown, Hitmaker: Crown } as const;

const SubscriptionVault: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div>
      <PageHeader eyebrow="Hustler vs. Mogul vs. Hitmaker Plan Architect" title="Subscription Vault" description="Compare unlocked features, commission differences, and payment details across every tier." />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const Icon = PLAN_ICON[plan.id];
          const isCurrent = currentUser?.subscriptionTier === plan.id;
          return (
            <Card key={plan.id} className={plan.id === 'Mogul' ? 'border-gold-500/40 shadow-gold' : ''}>
              <div className="mb-4 flex items-center justify-between">
                <SectionTitle sub={`${plan.commissionPct}% platform commission`}>
                  <span className="inline-flex items-center gap-2">
                    <Icon size={16} className="text-gold-400" /> {plan.id}
                  </span>
                </SectionTitle>
                {isCurrent && <span className="label-mono rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-gold-300">Current</span>}
              </div>
              <p className="font-serif text-2xl text-gold-100">{formatCents(plan.monthlyCostCents)}<span className="text-sm text-charcoal-600">/mo</span></p>
              <p className="mt-1 mb-4 text-xs text-charcoal-600">{plan.audience}</p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-charcoal-500">
                    <Check size={15} className="mt-0.5 shrink-0 text-gold-400" /> {f}
                  </li>
                ))}
                {plan.locked.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-charcoal-600">
                    <Lock size={13} className="mt-0.5 shrink-0 text-charcoal-600" /> {f}
                  </li>
                ))}
              </ul>
              <button className={plan.id === 'Hustler' ? 'btn-ghost mt-5 w-full' : 'btn-gold mt-5 w-full'} disabled={isCurrent}>
                {isCurrent ? 'Active Plan' : `Upgrade to ${plan.id}`}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionVault;
