import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { evaluateReadiness, type ReadinessInput, type ReadinessResult } from '@/lib/readiness/engine';
import type {
  ProjectRow,
  ProjectMaterialRow,
  DamageClaimRow,
  ReadinessChecklistRow,
  ProjectSelectionRow,
} from '@/lib/supabase/database.types';

const PHOTO_TYPES = ['material_photo', 'label_photo', 'finish_comparison_photo', 'approved_selection_photo'];

export type ProjectListFilter = 'all' | 'ready' | 'blocked' | 'start-risk';

export async function listProjects(filter: ProjectListFilter = 'all'): Promise<
  Array<ProjectRow & { preapproval_ready: boolean; required_material_lines: number; open_blocking_claims: number }>
> {
  const supabase = createSupabaseServerClient();
  const projects = await supabase
    .from('projects')
    .select('*')
    .not('status', 'in', '("cancelled")')
    .order('planned_start_date', { ascending: true, nullsFirst: false });

  const summary = await supabase
    .from('project_readiness_summary')
    .select('project_id, preapproval_ready, required_material_lines, open_blocking_claims');

  const summaryById = new Map((summary.data ?? []).map((s) => [s.project_id, s]));
  const rows = (projects.data ?? []).map((p) => {
    const s = summaryById.get(p.id);
    return {
      ...p,
      preapproval_ready: s?.preapproval_ready ?? false,
      required_material_lines: s?.required_material_lines ?? 0,
      open_blocking_claims: s?.open_blocking_claims ?? 0,
    };
  });

  switch (filter) {
    case 'ready':
      return rows.filter((r) => r.readiness_approved);
    case 'blocked':
      return rows.filter((r) => !r.readiness_approved && r.required_material_lines > 0 && !r.preapproval_ready);
    case 'start-risk':
      return rows.filter((r) => {
        if (r.readiness_approved || !r.planned_start_date) return false;
        const days = Math.round((new Date(r.planned_start_date).getTime() - Date.now()) / 86_400_000);
        return days <= 14;
      });
    default:
      return rows;
  }
}

export async function getProject(projectId: string): Promise<ProjectRow | null> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('projects').select('*').eq('id', projectId).maybeSingle();
  return data ?? null;
}

export async function getProjectMaterials(projectId: string): Promise<ProjectMaterialRow[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from('project_materials')
    .select('*')
    .eq('project_id', projectId)
    .order('category', { ascending: true });
  return data ?? [];
}

export interface ProjectReadiness {
  project: ProjectRow;
  materials: ProjectMaterialRow[];
  checklist: ReadinessChecklistRow[];
  result: ReadinessResult;
}

/** Assemble the full readiness picture and evaluate it with the shared engine. */
export async function getProjectReadiness(projectId: string): Promise<ProjectReadiness | null> {
  const supabase = createSupabaseServerClient();
  const project = await getProject(projectId);
  if (!project) return null;

  const [materialsRes, selectionsRes, claimsRes, checklistRes] = await Promise.all([
    supabase.from('project_materials').select('*').eq('project_id', projectId),
    supabase.from('project_selections').select('*').eq('project_id', projectId),
    supabase.from('damage_claims').select('*').eq('project_id', projectId),
    supabase.from('project_readiness_checklist').select('*').eq('project_id', projectId),
  ]);

  const materials: ProjectMaterialRow[] = materialsRes.data ?? [];
  const selections: ProjectSelectionRow[] = selectionsRes.data ?? [];
  const claims: DamageClaimRow[] = claimsRes.data ?? [];
  const checklist: ReadinessChecklistRow[] = checklistRes.data ?? [];

  // Which materials have at least one qualifying evidence photo.
  const materialIds = materials.map((m) => m.id);
  const photoSet = new Set<string>();
  if (materialIds.length > 0) {
    const docs = await supabase
      .from('documents')
      .select('project_material_id, document_type')
      .in('project_material_id', materialIds)
      .in('document_type', PHOTO_TYPES);
    for (const d of docs.data ?? []) {
      if (d.project_material_id) photoSet.add(d.project_material_id);
    }
  }

  const selectionById = new Map(selections.map((s) => [s.id, s]));

  const input: ReadinessInput = {
    hasCurrentDesignRevision: project.current_design_revision_id != null,
    // Whole-project strict gate by default; the SQL view honors the org flag authoritatively.
    organizationAllowsDeferredExceptions: false,
    materials: materials.map((m) => {
      const selection = m.selection_id ? selectionById.get(m.selection_id) : undefined;
      const selectionApproved =
        selection != null &&
        selection.status === 'approved' &&
        selection.design_revision_id === project.current_design_revision_id;
      const deferredFieldsComplete =
        m.deferred_predecessor_milestone != null &&
        m.deferred_template_target_date != null &&
        m.deferred_fabrication_lead_days != null &&
        m.required_on_site_date != null &&
        m.gate_phase != null &&
        m.deferred_exception_reason != null &&
        m.deferred_exception_approved_by != null &&
        m.deferred_exception_approved_at != null;
      return {
        id: m.id,
        name: m.name,
        required: m.required,
        gateType: m.gate_type,
        deferredExceptionApproved: m.deferred_exception_approved,
        deferredFieldsComplete,
        requiredQuantity: m.required_quantity,
        usableQuantity: m.usable_quantity,
        staged: m.staged,
        concealedInspectionOpen: m.concealed_inspection_open,
        hasRequiredPhoto: photoSet.has(m.id),
        selectionRequired: m.selection_required,
        selectionApproved,
        purchaseOrderRequired: m.purchase_order_verification_required,
        purchaseOrderVerified: m.latest_purchase_order_verified,
        packingSlipRequired: m.packing_slip_verification_required,
        packingSlipVerified: m.latest_packing_slip_verified,
        designRevisionRequired: m.design_revision_verification_required,
        designRevisionVerified: m.latest_design_revision_verified,
        specificationRequired: m.specification_verification_required,
        specificationVerified: m.latest_specification_verified,
        identityRequired: m.identity_verification_required,
        identityVerified: m.latest_identity_verified,
        lotRequired: m.lot_verification_required,
        lotVerified: m.latest_lot_compatibility_verified,
        packageRequired: m.package_verification_required,
        packageVerified: m.latest_package_complete_verified,
        storageRequired: m.storage_verification_required,
        storageCompliant: m.latest_storage_compliant,
      };
    }),
    selections: selections.map((s) => ({
      id: s.id,
      reference: s.selection_reference,
      required: s.required,
      approvedAndCurrent: s.status === 'approved' && s.design_revision_id === project.current_design_revision_id,
    })),
    claims: claims.map((c) => ({
      id: c.id,
      claimNumber: c.claim_number,
      blocking: c.blocking,
      open: !['resolved', 'closed', 'denied'].includes(c.status),
    })),
    checklist: checklist.map((c) => ({
      key: c.checklist_key,
      label: c.label,
      required: c.required,
      completed: c.completed,
    })),
  };

  return { project, materials, checklist, result: evaluateReadiness(input) };
}
