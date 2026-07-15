import React from 'react';
import { Check, Crown } from 'lucide-react';
import { Card, PageHeader, SectionTitle } from '../components/ui';

const PLANS = [
  {
    name: 'Hustler',
    price: '$29/mo',
    commission: '20% platform commission',
    features: ['Indie Roadmap access', 'Up to 2 active campaigns', 'Artist Vault (10GB)', 'Standard contract templates', 'Community chat channels'],
  },
  {
    name: 'Mogul',
    price: '$149/mo',
    commission: '8% platform commission',
    features: ['Full Campaign Architect + Lyrical DNA', 'Unlimited active campaigns', 'Artist Vault (500GB)', 'All legal templates + custom variables', 'Priority booking routing', 'Manager multi-artist oversight'],
  },
];

const SubscriptionVault: React.FC = () => (
  <div>
    <PageHeader eyebrow="Hustler vs. Mogul Plan Architect" title="Subscription Vault" description="Compare unlocked features, commission differences, and payment details across tiers." />

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {PLANS.map((plan) => (
        <Card key={plan.name} className={plan.name === 'Mogul' ? 'border-gold-500/40 shadow-gold' : ''}>
          <div className="mb-4 flex items-center justify-between">
            <SectionTitle sub={plan.commission}>
              <span className="inline-flex items-center gap-2">
                {plan.name === 'Mogul' && <Crown size={16} className="text-gold-400" />} {plan.name}
              </span>
            </SectionTitle>
            <p className="font-serif text-2xl text-gold-100">{plan.price}</p>
          </div>
          <ul className="space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-charcoal-500">
                <Check size={15} className="mt-0.5 shrink-0 text-gold-400" /> {f}
              </li>
            ))}
          </ul>
          <button className={plan.name === 'Mogul' ? 'btn-gold mt-5 w-full' : 'btn-ghost mt-5 w-full'}>
            {plan.name === 'Mogul' ? 'Upgrade to Mogul' : 'Continue on Hustler'}
          </button>
        </Card>
      ))}
    </div>
  </div>
);

export default SubscriptionVault;
