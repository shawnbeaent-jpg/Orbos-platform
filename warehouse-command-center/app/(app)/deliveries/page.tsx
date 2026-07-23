import { listDeliveries, type DeliveryWhen } from '@/lib/queries/deliveries';
import { PageHeader, EmptyState } from '@/components/ui';
import { DeliveriesTable } from '@/components/DeliveriesTable';

export const metadata = { title: 'Deliveries' };
export const dynamic = 'force-dynamic';

export default async function DeliveriesPage({ searchParams }: { searchParams: { when?: string } }) {
  const when: DeliveryWhen = searchParams.when === 'today' || searchParams.when === 'week' ? searchParams.when : 'all';
  const deliveries = await listDeliveries({ when });
  const subtitle = when === 'today' ? 'Scheduled today' : when === 'week' ? 'Next 7 days' : 'All scheduled deliveries';

  return (
    <div>
      <PageHeader title="Deliveries" subtitle={subtitle} />
      {deliveries.length === 0 ? (
        <EmptyState title="No deliveries" message="Scheduled deliveries and delays across all projects appear here." />
      ) : (
        <DeliveriesTable deliveries={deliveries} showProject />
      )}
    </div>
  );
}
