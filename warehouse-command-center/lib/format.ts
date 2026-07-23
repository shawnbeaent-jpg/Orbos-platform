/** Presentation helpers. Money in this domain is stored as numeric(12,2) dollars. */

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatMoney(value: number | null | undefined): string {
  if (value == null) return '—';
  return usd.format(value);
}

export function formatQuantity(value: number | null | undefined, unit?: string | null): string {
  if (value == null) return '—';
  const n = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');
  return unit ? `${n} ${unit}` : n;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

/** Whole days from today (UTC-agnostic, local midnight) to a date string; null-safe. */
export function daysUntil(dateStr: string | null | undefined, now = new Date()): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}
