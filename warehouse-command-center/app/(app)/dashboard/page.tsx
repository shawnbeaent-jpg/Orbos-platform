import Link from 'next/link';
import { getDashboardData } from '@/lib/queries/dashboard';
import { PageHeader, KpiCard, Card, EmptyState } from '@/components/ui';

export const metadata = { title: 'Executive Dashboard' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        subtitle="Live operational status. Every tile drills into the records behind it."
      />

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Active Projects" value={data.activeProjects} href="/projects" />
        <KpiCard label="Ready to Start" value={data.readyProjects} tone="ready" href="/projects?filter=ready" />
        <KpiCard
          label="Blocked by Materials"
          value={data.blockedProjects}
          tone="blocked"
          href="/projects?filter=blocked"
        />
        <KpiCard
          label="Open Blocking Claims"
          value={data.openBlockingClaims}
          tone="blocked"
          href="/claims?filter=blocking-open"
        />
        <KpiCard
          label="Starts ≤3d, Not Ready"
          value={data.startsWithin.in3}
          tone="blocked"
          hint={`≤7d: ${data.startsWithin.in7} · ≤14d: ${data.startsWithin.in14}`}
          href="/projects?filter=start-risk"
        />
        <KpiCard label="Deliveries Today" value={data.deliveriesToday} href="/deliveries?when=today" />
        <KpiCard
          label="Deliveries This Week"
          value={data.deliveriesThisWeek}
          hint={`Delayed: ${data.delayedDeliveries}`}
          href="/deliveries?when=week"
        />
        <KpiCard
          label="Urgent Requests"
          value={data.urgentRequests}
          tone="awaiting"
          href="/requests?filter=urgent-pending"
        />
        <KpiCard label="Low-Stock Items" value={data.lowStockItems} tone="delayed" href="/inventory?filter=low" />
      </section>

      <section aria-label="Actionable exceptions" className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-steel-800">Actionable exceptions</h2>
        {data.exceptions.length === 0 ? (
          <EmptyState
            title="No imminent blockers"
            message="No blocked projects have a planned start within 14 days. New exceptions will appear here with the responsible owner and next action."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.exceptions.map((ex) => (
              <Link key={ex.id} href={ex.href} className="block">
                <Card
                  className={`border-l-4 ${
                    ex.tone === 'blocked' ? 'border-l-status-blocked' : 'border-l-status-delayed'
                  }`}
                >
                  <p className="font-semibold text-steel-900">{ex.title}</p>
                  <p className="mt-1 text-sm text-steel-600">{ex.detail}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-steel-500">
                    Owner: {ex.owner} · View readiness →
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
