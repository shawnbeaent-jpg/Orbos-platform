import { notFound } from 'next/navigation';
import { getProject } from '@/lib/queries/projects';
import { listClaims } from '@/lib/queries/claims';
import { PageHeader, EmptyState } from '@/components/ui';
import { ProjectTabs } from '@/components/ProjectTabs';
import { ClaimsTable } from '@/components/ClaimsTable';

export const dynamic = 'force-dynamic';

export default async function ProjectClaimsPage({ params }: { params: { projectId: string } }) {
  const [project, claims] = await Promise.all([getProject(params.projectId), listClaims({ projectId: params.projectId })]);
  if (!project) notFound();

  return (
    <div>
      <PageHeader title={`Claims — ${project.project_number}`} subtitle={`${claims.length} claims`} />
      <ProjectTabs projectId={project.id} />
      {claims.length === 0 ? (
        <EmptyState
          title="No claims"
          message="Damage, shortage, wrong-item, wrong-finish, lot-mismatch, and storage claims appear here. A receiving exception can open one automatically."
        />
      ) : (
        <ClaimsTable claims={claims} />
      )}
    </div>
  );
}
