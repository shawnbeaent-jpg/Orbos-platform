import { listProjects, type ProjectListFilter } from '@/lib/queries/projects';
import { PageHeader, EmptyState } from '@/components/ui';
import { ProjectTable } from '@/components/ProjectTable';

export const metadata = { title: 'Projects' };
export const dynamic = 'force-dynamic';

const FILTER_LABELS: Record<ProjectListFilter, string> = {
  all: 'All active projects',
  ready: 'Ready to start',
  blocked: 'Blocked by materials',
  'start-risk': 'Planned start within 14 days',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const filterParam = searchParams.filter;
  const filter: ProjectListFilter =
    filterParam === 'ready' || filterParam === 'blocked' || filterParam === 'start-risk' ? filterParam : 'all';
  const projects = await listProjects(filter);

  return (
    <div>
      <PageHeader title="Projects" subtitle={FILTER_LABELS[filter]} />
      {projects.length === 0 ? (
        <EmptyState
          title="No projects"
          message="No projects match this view. Projects created by a Project Manager or Administrator appear here."
        />
      ) : (
        <ProjectTable projects={projects} />
      )}
    </div>
  );
}
