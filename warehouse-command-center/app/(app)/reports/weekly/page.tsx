import Link from 'next/link';
import { getWeeklyReport } from '@/lib/queries/reports';
import { PageHeader, Card, EmptyState } from '@/components/ui';
import { PrintButton } from '@/components/PrintButton';
import { CsvDownloadButton } from '@/components/CsvDownloadButton';
import { formatDate } from '@/lib/format';

export const metadata = { title: 'Weekly Project-Material Report' };
export const dynamic = 'force-dynamic';

export default async function WeeklyReportPage() {
  const report = await getWeeklyReport();

  const csvRows = report.projects.map((p) => ({
    project: p.projectNumber,
    client: p.clientName,
    planned_start: p.plannedStart ?? '',
    readiness: p.readinessApproved ? 'Ready' : 'Blocked',
    completion_percent: p.completionPercent,
    required_lines: p.requiredLines,
    complete_lines: p.completeLines,
    open_blocking_claims: p.openBlockingClaims,
  }));

  return (
    <div>
      <PageHeader
        title="Weekly Project-Material Report"
        subtitle={`Week of ${formatDate(report.weekStart)} · ${report.totals.ready} ready · ${report.totals.blocked} blocked`}
        actions={
          <>
            <CsvDownloadButton rows={csvRows} filename={`weekly-report-${report.weekStart}.csv`} />
            <PrintButton />
          </>
        }
      />

      {report.projects.length === 0 ? (
        <EmptyState title="No projects" message="Project readiness and material completion appear here once projects exist." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-steel-200 text-sm">
            <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
              <tr>
                <th className="px-3 py-3">Project</th>
                <th className="px-3 py-3">Planned start</th>
                <th className="px-3 py-3">Readiness</th>
                <th className="px-3 py-3">Material completion</th>
                <th className="px-3 py-3 text-right">Open blocking claims</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {report.projects.map((p) => (
                <tr key={p.projectId} className="hover:bg-steel-50">
                  <td className="px-3 py-3">
                    <Link href={`/projects/${p.projectId}/readiness`} className="font-medium text-steel-800 hover:underline">
                      {p.projectNumber}
                    </Link>
                    <div className="text-xs text-steel-500">{p.clientName}</div>
                  </td>
                  <td className="px-3 py-3">{formatDate(p.plannedStart)}</td>
                  <td className="px-3 py-3">
                    {p.readinessApproved ? (
                      <span className="font-semibold text-status-ready">Ready</span>
                    ) : (
                      <span className="font-semibold text-status-blocked">Blocked</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-steel-200">
                        <div
                          className="h-full bg-steel-600"
                          style={{ width: `${p.completionPercent}%` }}
                          aria-hidden
                        />
                      </div>
                      <span className="tabular-nums text-xs text-steel-600">
                        {p.completionPercent}% ({p.completeLines}/{p.requiredLines})
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {p.openBlockingClaims > 0 ? (
                      <span className="text-status-blocked">{p.openBlockingClaims}</span>
                    ) : (
                      '0'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
