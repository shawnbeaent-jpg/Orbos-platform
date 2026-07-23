import Link from 'next/link';
import { STATUS_BADGE_CLASS, type OperationalStatus } from '@/lib/status';

export function StatusBadge({ kind, label }: { kind: OperationalStatus; label: string }) {
  return <span className={`badge ${STATUS_BADGE_CLASS[kind]}`}>{label}</span>;
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-steel-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-steel-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`card p-4 ${className}`}>{children}</div>;
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-10 text-center">
      <p className="text-lg font-semibold text-steel-700">{title}</p>
      <p className="max-w-md text-sm text-steel-500">{message}</p>
      {action}
    </div>
  );
}

/**
 * KPI tile. When `href` is provided the whole card drills into the records that
 * produced the number — required by the brief ("every KPI must drill in").
 */
export function KpiCard({
  label,
  value,
  hint,
  href,
  tone = 'neutral',
}: {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  tone?: OperationalStatus;
}) {
  const toneRing =
    tone === 'blocked'
      ? 'border-l-status-blocked'
      : tone === 'delayed'
        ? 'border-l-status-delayed'
        : tone === 'ready'
          ? 'border-l-status-ready'
          : tone === 'awaiting'
            ? 'border-l-status-awaiting'
            : 'border-l-steel-400';
  const inner = (
    <div className={`card h-full border-l-4 p-4 ${toneRing}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-steel-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-steel-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-steel-500">{hint}</p> : null}
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block transition hover:-translate-y-0.5">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function DataTable({ head, children }: { head: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full divide-y divide-steel-200 text-sm">
        <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">{head}</thead>
        <tbody className="divide-y divide-steel-100">{children}</tbody>
      </table>
    </div>
  );
}
