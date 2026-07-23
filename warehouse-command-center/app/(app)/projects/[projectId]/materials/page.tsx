import { notFound } from 'next/navigation';
import { getProject, getProjectMaterials } from '@/lib/queries/projects';
import { PageHeader, StatusBadge, EmptyState } from '@/components/ui';
import { ProjectTabs } from '@/components/ProjectTabs';
import { materialStatusView } from '@/lib/status';
import { formatQuantity, formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function MaterialsPage({ params }: { params: { projectId: string } }) {
  const [project, materials] = await Promise.all([
    getProject(params.projectId),
    getProjectMaterials(params.projectId),
  ]);
  if (!project) notFound();

  return (
    <div>
      <PageHeader title={`Materials — ${project.project_number}`} subtitle={`${materials.length} material lines`} />
      <ProjectTabs projectId={project.id} />

      {materials.length === 0 ? (
        <EmptyState
          title="No material lines"
          message="Add the project material list to begin tracking required quantities, selections, and receiving."
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-steel-200 text-sm">
            <thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
              <tr>
                <th className="px-3 py-3">Material</th>
                <th className="px-3 py-3">Spec</th>
                <th className="px-3 py-3">Gate</th>
                <th className="px-3 py-3 text-right">Req</th>
                <th className="px-3 py-3 text-right">Usable</th>
                <th className="px-3 py-3 text-right">Dmg</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Verified</th>
                <th className="px-3 py-3">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {materials.map((m) => {
                const view = materialStatusView(m.status);
                const fullyVerified =
                  (!m.specification_verification_required || m.latest_specification_verified) &&
                  (!m.identity_verification_required || m.latest_identity_verified) &&
                  (!m.storage_verification_required || m.latest_storage_compliant) &&
                  !m.concealed_inspection_open;
                return (
                  <tr key={m.id} className="align-top hover:bg-steel-50">
                    <td className="px-3 py-3">
                      <div className="font-medium text-steel-900">{m.name}</div>
                      <div className="text-xs text-steel-500">
                        {[m.category, m.trade].filter(Boolean).join(' · ')}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-steel-600">
                      {[m.manufacturer, m.model_number, m.finish_name].filter(Boolean).join(' / ') || '—'}
                    </td>
                    <td className="px-3 py-3 text-xs capitalize text-steel-600">
                      {m.gate_type.replace(/_/g, ' ')}
                      {m.required ? '' : ' (opt)'}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatQuantity(m.required_quantity)}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-semibold">
                      {formatQuantity(m.usable_quantity)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-status-damaged">
                      {m.damaged_quantity > 0 ? formatQuantity(m.damaged_quantity) : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge kind={view.kind} label={view.label} />
                    </td>
                    <td className="px-3 py-3">
                      {fullyVerified ? (
                        <span className="text-status-ready" aria-label="Verified">
                          ✓
                        </span>
                      ) : (
                        <span className="text-steel-400" aria-label="Not verified">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-steel-600">{formatDate(m.expected_delivery_date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
