import { getDailyReport } from '@/lib/queries/reports';
import { PageHeader, Card, KpiCard } from '@/components/ui';
import { PrintButton } from '@/components/PrintButton';
import { formatDate } from '@/lib/format';

export const metadata = { title: 'Daily Warehouse Report' };
export const dynamic = 'force-dynamic';

export default async function DailyReportPage() {
  const report = await getDailyReport();

  return (
    <div>
      <PageHeader
        title="Daily Warehouse Report"
        subtitle={`Generated live from the database for ${formatDate(report.date)}`}
        actions={<PrintButton />}
      />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Deliveries Scheduled" value={report.deliveries.scheduled} />
        <KpiCard label="Received" value={report.deliveries.received} tone="ready" />
        <KpiCard label="Partial" value={report.deliveries.partial} tone="delayed" />
        <KpiCard label="Rejected" value={report.deliveries.rejected} tone="blocked" />
        <KpiCard label="Delayed" value={report.deliveries.delayed} tone="delayed" />
        <KpiCard label="Receiving Inspections" value={report.materialsReceivedInspections} />
        <KpiCard label="Exceptions Opened" value={report.exceptionsOpenedToday} tone="blocked" />
        <KpiCard label="Open Urgent Requests" value={report.openUrgentRequests} tone="awaiting" />
      </section>

      <Card className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-steel-500">Tomorrow&apos;s delivery plan</h2>
        <p className="mt-2 text-3xl font-bold text-steel-900">{report.tomorrowDeliveries}</p>
        <p className="text-sm text-steel-500">deliveries scheduled for tomorrow.</p>
      </Card>

      <p className="mt-6 text-xs text-steel-400">
        Snapshots: submitting this report stores an immutable copy in <code>daily_reports</code> so historical reports
        never change even as live data moves.
      </p>
    </div>
  );
}
