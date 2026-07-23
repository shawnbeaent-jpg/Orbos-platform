import { notFound } from 'next/navigation';
import { getProjectReadiness } from '@/lib/queries/projects';
import { requireSession } from '@/lib/auth/session';
import { canGrantFinalReadiness, isWriteRole, ROLE_LABELS } from '@/lib/auth/rbac';
import { PageHeader, Card } from '@/components/ui';
import { ProjectTabs } from '@/components/ProjectTabs';
import { ReadinessApproval } from '@/components/ReadinessApproval';
import { ChecklistToggle } from '@/components/ChecklistToggle';
import { BLOCKER_OWNER } from '@/lib/readiness/engine';
import type { AppRole } from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

export default async function ReadinessPage({ params }: { params: { projectId: string } }) {
  const [session, data] = await Promise.all([requireSession(), getProjectReadiness(params.projectId)]);
  if (!data) notFound();
  const { project, checklist, result } = data;

  // Group blockers by responsible role for a clear "who owns what" view.
  const byOwner = new Map<AppRole, typeof result.blockers>();
  for (const b of result.blockers) {
    const list = byOwner.get(b.owner) ?? [];
    list.push(b);
    byOwner.set(b.owner, list);
  }

  return (
    <div>
      <PageHeader
        title={`Readiness — ${project.project_number}`}
        subtitle="A project may be released only when every required control passes. The server re-checks all of these inside one transaction at approval time."
      />
      <ProjectTabs projectId={project.id} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {result.blockers.length === 0 ? (
            <Card className="border-l-4 border-l-status-ready">
              <p className="text-lg font-bold text-status-ready">All pre-approval controls pass.</p>
              <p className="mt-1 text-sm text-steel-600">
                {project.readiness_approved
                  ? 'This project is approved Ready to Start.'
                  : 'This project is eligible for final Ready-to-Start approval.'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...byOwner.entries()].map(([owner, blockers]) => (
                <Card key={owner} className="border-l-4 border-l-status-blocked">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-steel-500">
                      Owner: {ROLE_LABELS[owner]}
                    </h2>
                    <span className="badge bg-status-blocked/10 text-status-blocked">
                      {blockers.length} {blockers.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {blockers.map((b, i) => (
                      <li key={`${b.code}-${b.entityId ?? i}`} className="flex items-start gap-2 text-sm text-steel-700">
                        <span aria-hidden className="mt-1 h-2 w-2 shrink-0 rounded-full bg-status-blocked" />
                        <span>{b.message}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-steel-500">Final approval</h2>
            <ReadinessApproval
              projectId={project.id}
              canApprove={canGrantFinalReadiness(session.role)}
              eligible={result.preapprovalReady}
              alreadyApproved={project.readiness_approved}
            />
          </Card>

          <Card>
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-steel-500">Readiness checklist</h2>
            <p className="mb-2 text-xs text-steel-400">Changing a required item revokes readiness automatically.</p>
            <div className="divide-y divide-steel-100">
              {checklist.length === 0 ? (
                <p className="py-2 text-sm text-steel-500">No checklist items.</p>
              ) : (
                checklist
                  .slice()
                  .sort((a, b) => Number(b.required) - Number(a.required))
                  .map((c) => (
                    <ChecklistToggle
                      key={c.checklist_key}
                      projectId={project.id}
                      checklistKey={c.checklist_key}
                      label={c.label}
                      completed={c.completed}
                      required={c.required}
                      canEdit={isWriteRole(session.role)}
                    />
                  ))
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-steel-500">Counts</h2>
            <dl className="space-y-1 text-sm text-steel-700">
              <CountRow label="Required material lines" value={result.counts.requiredMaterialLines} />
              <CountRow label="Complete (usable ≥ required)" value={result.counts.completeMaterialLines} />
              <CountRow label="Fully verified" value={result.counts.highEndVerifiedLines} />
              <CountRow label="Staged" value={result.counts.stagedRequiredLines} />
              <CountRow label="Approved current selections" value={result.counts.approvedCurrentSelections} />
              <CountRow label="Open blocking claims" value={result.counts.openBlockingClaims} />
              <CountRow
                label="Checklist complete"
                value={`${result.counts.completeChecklistItems}/${result.counts.requiredChecklistItems}`}
              />
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CountRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-steel-500">{label}</dt>
      <dd className="font-semibold text-steel-900">{value}</dd>
    </div>
  );
}
