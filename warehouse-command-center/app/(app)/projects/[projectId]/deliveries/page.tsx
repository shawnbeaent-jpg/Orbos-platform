import { notFound } from 'next/navigation';
import { getProject } from '@/lib/queries/projects';
import { listDeliveries } from '@/lib/queries/deliveries';
import { PageHeader, EmptyState } from '@/components/ui';
import { ProjectTabs } from '@/components/ProjectTabs';
import { DeliveriesTable } from '@/components/DeliveriesTable';

export const dynamic = 'force-dynamic';

export default async function ProjectDeliveriesPage({ params }: { params: { projectId: string } }) {
  const [project, deliveries] = await Promise.all([
    getProject(params.projectId),
    listDeliveries({ projectId: params.projectId }),
  ]);
  if (!project) notFound();

  return (
    <div>
      <PageHeader title={`Deliveries — ${project.project_number}`} subtitle={`${deliveries.length} scheduled`} />
      <ProjectTabs projectId={project.id} />
      {deliveries.length === 0 ? (
        <EmptyState title="No deliveries" message="Scheduled deliveries and their delay log appear here." />
      ) : (
        <DeliveriesTable deliveries={deliveries} />
      )}
    </div>
  );
}
