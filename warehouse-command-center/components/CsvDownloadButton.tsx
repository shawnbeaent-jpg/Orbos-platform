'use client';

/** Serializes rows to CSV and triggers a client-side download. No server round-trip. */
export function CsvDownloadButton({
  rows,
  filename,
  label = 'Export CSV',
}: {
  rows: Array<Record<string, string | number | null>>;
  filename: string;
  label?: string;
}) {
  function download() {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]!);
    const escape = (v: string | number | null) => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const body = rows.map((r) => headers.map((h) => escape(r[h] ?? '')).join(','));
    const csv = [headers.join(','), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" className="btn-secondary no-print" onClick={download} disabled={rows.length === 0}>
      {label}
    </button>
  );
}
