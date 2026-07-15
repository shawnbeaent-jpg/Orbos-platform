import React from 'react';

export const PageHeader: React.FC<{ eyebrow: string; title: string; description?: string; action?: React.ReactNode }> = ({
  eyebrow,
  title,
  description,
  action,
}) => (
  <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="label-mono mb-2">{eyebrow}</p>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-gold-100">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm text-charcoal-500">{description}</p>}
    </div>
    {action}
  </div>
);

export const Card: React.FC<{ className?: string; children: React.ReactNode; flash?: boolean }> = ({
  className = '',
  children,
  flash = false,
}) => (
  <div className={`glass-card p-5 ${flash ? 'gold-outline-flash' : ''} ${className}`}>{children}</div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div className="mb-4">
    <h2 className="font-serif text-lg text-gold-100">{children}</h2>
    {sub && <p className="mt-0.5 text-xs text-charcoal-600">{sub}</p>}
  </div>
);

const BADGE_TONES: Record<string, string> = {
  gold: 'bg-gold-500/15 text-gold-300 border-gold-500/30',
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  red: 'bg-red-500/15 text-red-300 border-red-500/30',
  blue: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  gray: 'bg-white/5 text-charcoal-500 border-white/10',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
};

export const Badge: React.FC<{ tone?: keyof typeof BADGE_TONES; children: React.ReactNode }> = ({
  tone = 'gray',
  children,
}) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${BADGE_TONES[tone]}`}>
    {children}
  </span>
);

export const StatTile: React.FC<{ label: string; value: string; delta?: string; positive?: boolean }> = ({
  label,
  value,
  delta,
  positive = true,
}) => (
  <Card className="flex flex-col gap-1.5">
    <p className="label-mono">{label}</p>
    <p className="font-serif text-2xl text-gold-100">{value}</p>
    {delta && <p className={`text-xs font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>{delta}</p>}
  </Card>
);

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-12 text-center">
    <p className="text-sm text-charcoal-600">{message}</p>
  </div>
);

export const Table: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
  <div className="scrollbar-gold overflow-x-auto rounded-xl border border-white/5">
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead>
        <tr className="border-b border-white/5 bg-white/[0.02]">
          {headers.map((h) => (
            <th key={h} className="label-mono px-4 py-3 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">{children}</tbody>
    </table>
  </div>
);

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function statusTone(status: string): keyof typeof BADGE_TONES {
  const positive = ['Completed', 'Placed', 'Secured', 'Confirmed', 'Countersigned', 'Signed', 'Paid', 'Active', 'ALLOWED'];
  const negative = ['Blocked', 'Cancelled', 'Declined', 'Overdue', 'Passed', 'BLOCKED', 'Cold'];
  const warning = ['Pending', 'In Progress', 'Contacted', 'Follow-up', 'Under Review', 'Artist Hold', 'Sent', 'Draft', 'Inquiry', 'Scheduled', 'New'];
  if (positive.includes(status)) return 'green';
  if (negative.includes(status)) return 'red';
  if (warning.includes(status)) return 'amber';
  return 'gray';
}
