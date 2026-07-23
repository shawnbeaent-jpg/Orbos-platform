import { requireSession } from '@/lib/auth/session';
import { canReceive } from '@/lib/auth/rbac';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PageHeader, EmptyState } from '@/components/ui';
import { ReceivingWorkflow, type ReceivingProject } from '@/components/receiving/ReceivingWorkflow';

export const metadata = { title: 'Receive Delivery' };
export const dynamic = 'force-dynamic';

export default async function ReceivingPage() {
  const session = await requireSession();

  if (!canReceive(session.role)) {
    return (
      <div>
        <PageHeader title="Receive Delivery" />
        <EmptyState
          title="Permission denied"
          message="Only a Receiver, Warehouse Manager, or Administrator can complete receiving. Ask an administrator if you need access."
        />
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  const projectsRes = await supabase
    .from('projects')
    .select('id, project_number, client_name')
    .in('status', ['materials_in_progress', 'blocked', 'ready_to_start', 'active'])
    .order('project_number');
  const projectRows = projectsRes.data ?? [];

  const projectIds = projectRows.map((p) => p.id);
  const materialsRes =
    projectIds.length > 0
      ? await supabase
          .from('project_materials')
          .select('*')
          .in('project_id', projectIds)
          .order('name')
      : { data: [] as never[] };

  const materialsByProject = new Map<string, ReceivingProject['materials']>();
  for (const m of materialsRes.data ?? []) {
    const list = materialsByProject.get(m.project_id) ?? [];
    list.push({
      id: m.id,
      name: m.name,
      unit: m.unit,
      requiredQuantity: m.required_quantity,
      usableQuantity: m.usable_quantity,
      receivedQuantity: m.received_quantity,
      damagedQuantity: m.damaged_quantity,
      rejectedQuantity: m.rejected_quantity,
      manufacturer: m.manufacturer,
      modelNumber: m.model_number,
      finishName: m.finish_name,
      requires: {
        purchaseOrder: m.purchase_order_verification_required,
        packingSlip: m.packing_slip_verification_required,
        designRevision: m.design_revision_verification_required,
        specification: m.specification_verification_required,
        identity: m.identity_verification_required,
        lot: m.lot_verification_required,
        package: m.package_verification_required,
        storage: m.storage_verification_required,
      },
    });
    materialsByProject.set(m.project_id, list);
  }

  const projects: ReceivingProject[] = projectRows.map((p) => ({
    id: p.id,
    projectNumber: p.project_number,
    clientName: p.client_name,
    materials: materialsByProject.get(p.id) ?? [],
  }));

  return (
    <div>
      <PageHeader
        title="Receive Delivery"
        subtitle="Guided mobile receiving. Complete each step; required evidence is enforced before a clean receipt."
      />
      {projects.length === 0 ? (
        <EmptyState title="No active projects" message="There are no active projects with material lines to receive against." />
      ) : (
        <ReceivingWorkflow orgId={session.organizationId} projects={projects} />
      )}
    </div>
  );
}
