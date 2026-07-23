import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectReadiness } from '@/lib/queries/projects';
import { PageHeader, Card, StatusBadge } from '@/components/ui';
import { ProjectTabs } from '@/components/ProjectTabs';
import { projectStatusView } from '@/lib/status';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function ProjectOverviewPage({ params }: { params: { projectId: string } }) {
  const data = await getProjectReadiness(params.projectId);
  if (!data) notFound();
  const { project, result } = data;
  const view = projectStatusView(project.status);

  return (
    <div>
      <PageHeader
        title={`${project.project_number} — ${project.client_name}`}
        subtitle={project.project_address}
        actions={<StatusBadge kind={view.kind} label={view.label} />}
      />
      <ProjectTabs projectId={project.id} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-steel-500">Project detail</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Detail label="Remodel type" value={project.remodel_type.replace(/_/g, ' ')} />
            <Detail label="Priority" value={project.priority} />
            <Detail label="Planned start" value={formatDate(project.planned_start_date)} />
            <Detail label="Actual start" value={formatDate(project.actual_start_date)} />
            <Detail label="Design revision" value={project.current_design_revision_id ? 'Set' : 'Not set'} />
            <Detail label="Selection register" value={project.selection_register_status.replace(/_/g, ' ')} />
          </dl>
          {project.scope_summary ? (
            <p className="mt-4 border-t border-steel-100 pt-4 text-sm text-steel-600">{project.scope_summary}</p>
          ) : null}
        </Card>

        <Card
          className={`border-l-4 ${
            project.readiness_approved
              ? 'border-l-status-ready'
              : result.preapprovalReady
                ? 'border-l-status-awaiting'
                : 'border-l-status-blocked'
          }`}
        >
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-steel-500">Readiness</h2>
          {project.readiness_approved ? (
            <p className="text-lg font-bold text-status-ready">Ready to Start</p>
          ) : result.preapprovalReady ? (
            <p className="text-lg font-bold text-status-awaiting">Eligible — awaiting approval</p>
          ) : (
            <>
              <p className="text-lg font-bold text-status-blocked">Blocked</p>
              <p className="mt-1 text-sm text-steel-600">
                {result.blockers.length} open {result.blockers.length === 1 ? 'blocker' : 'blockers'}
              </p>
            </>
          )}
          <Link href={`/projects/${project.id}/readiness`} className="btn-secondary mt-4 w-full">
            View readiness
          </Link>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-steel-400">{label}</dt>
      <dd className="mt-0.5 capitalize text-steel-800">{value || '—'}</dd>
    </div>
  );
}
