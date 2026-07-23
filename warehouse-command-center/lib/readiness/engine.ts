import type { AppRole, MaterialGateType } from '@/lib/supabase/database.types';

/**
 * Readiness engine — the single source of truth for WHY a project is or is not
 * eligible for final "Ready to Start" approval.
 *
 * This mirrors the server-authoritative logic in the SQL view
 * `public.project_readiness_summary` (see supabase/migrations/0002_high_end_extension.sql).
 * The database remains the enforcement boundary: `approve_project_readiness()` re-checks
 * `preapproval_ready` inside one transaction and only Admin/Warehouse Manager may call it.
 * This TypeScript engine exists to (a) explain blockers to users with the responsible
 * owner, and (b) be exhaustively unit-tested without a database.
 */

export type ReadinessBlockerCode =
  | 'no_current_design_revision'
  | 'no_required_material_lines'
  | 'material_insufficient_usable'
  | 'material_spec_unverified'
  | 'material_not_staged'
  | 'material_concealed_inspection_open'
  | 'material_missing_photos'
  | 'invalid_deferred_template'
  | 'selection_not_approved'
  | 'open_blocking_claim'
  | 'no_required_checklist_items'
  | 'checklist_incomplete';

/** Role that owns the corrective action for a given blocker. */
export const BLOCKER_OWNER: Record<ReadinessBlockerCode, AppRole> = {
  no_current_design_revision: 'purchasing',
  no_required_material_lines: 'project_manager',
  material_insufficient_usable: 'warehouse_manager',
  material_spec_unverified: 'receiver',
  material_not_staged: 'warehouse_manager',
  material_concealed_inspection_open: 'receiver',
  material_missing_photos: 'receiver',
  invalid_deferred_template: 'project_manager',
  selection_not_approved: 'purchasing',
  open_blocking_claim: 'purchasing',
  no_required_checklist_items: 'project_manager',
  checklist_incomplete: 'project_manager',
};

export interface MaterialVerification {
  purchaseOrderRequired: boolean;
  purchaseOrderVerified: boolean;
  packingSlipRequired: boolean;
  packingSlipVerified: boolean;
  designRevisionRequired: boolean;
  designRevisionVerified: boolean;
  specificationRequired: boolean;
  specificationVerified: boolean;
  identityRequired: boolean;
  identityVerified: boolean;
  lotRequired: boolean;
  lotVerified: boolean;
  packageRequired: boolean;
  packageVerified: boolean;
  storageRequired: boolean;
  storageCompliant: boolean;
}

export interface ReadinessMaterialInput extends MaterialVerification {
  id: string;
  name: string;
  required: boolean;
  gateType: MaterialGateType;
  deferredExceptionApproved: boolean;
  /** Deferred-template lines must carry every control field or they are invalid. */
  deferredFieldsComplete: boolean;
  requiredQuantity: number;
  usableQuantity: number;
  staged: boolean;
  concealedInspectionOpen: boolean;
  /** At least one qualifying evidence photo exists for the line. */
  hasRequiredPhoto: boolean;
  /** When the line is tied to a selection, is that selection approved & current. */
  selectionRequired: boolean;
  selectionApproved: boolean;
}

export interface ReadinessSelectionInput {
  id: string;
  reference: string;
  required: boolean;
  approvedAndCurrent: boolean;
}

export interface ReadinessClaimInput {
  id: string;
  claimNumber: string;
  blocking: boolean;
  open: boolean;
}

export interface ReadinessChecklistInput {
  key: string;
  label: string;
  required: boolean;
  completed: boolean;
}

export interface ReadinessInput {
  hasCurrentDesignRevision: boolean;
  organizationAllowsDeferredExceptions: boolean;
  materials: ReadinessMaterialInput[];
  selections: ReadinessSelectionInput[];
  claims: ReadinessClaimInput[];
  checklist: ReadinessChecklistInput[];
}

export interface ReadinessBlocker {
  code: ReadinessBlockerCode;
  message: string;
  owner: AppRole;
  entityType: 'project' | 'material' | 'selection' | 'claim' | 'checklist';
  entityId: string | null;
}

export interface ReadinessResult {
  preapprovalReady: boolean;
  blockers: ReadinessBlocker[];
  counts: {
    requiredMaterialLines: number;
    completeMaterialLines: number;
    highEndVerifiedLines: number;
    stagedRequiredLines: number;
    invalidDeferredTemplateLines: number;
    requiredSelections: number;
    approvedCurrentSelections: number;
    openBlockingClaims: number;
    requiredChecklistItems: number;
    completeChecklistItems: number;
  };
}

/**
 * A required line is EXCLUDED from the whole-project gate only when the org permits
 * deferred-template exceptions AND the line is an approved deferred template. This
 * matches the view's `not (o.allow... and gate_type='deferred_template' and approved)`.
 */
function isExcludedByApprovedDeferral(m: ReadinessMaterialInput, orgAllows: boolean): boolean {
  return orgAllows && m.gateType === 'deferred_template' && m.deferredExceptionApproved;
}

function specVerified(m: ReadinessMaterialInput): boolean {
  return (
    (!m.selectionRequired || m.selectionApproved) &&
    (!m.purchaseOrderRequired || m.purchaseOrderVerified) &&
    (!m.packingSlipRequired || m.packingSlipVerified) &&
    (!m.designRevisionRequired || m.designRevisionVerified) &&
    (!m.specificationRequired || m.specificationVerified) &&
    (!m.identityRequired || m.identityVerified) &&
    (!m.lotRequired || m.lotVerified) &&
    (!m.packageRequired || m.packageVerified) &&
    (!m.storageRequired || m.storageCompliant) &&
    !m.concealedInspectionOpen &&
    m.hasRequiredPhoto
  );
}

export function evaluateReadiness(input: ReadinessInput): ReadinessResult {
  const blockers: ReadinessBlocker[] = [];
  const orgAllows = input.organizationAllowsDeferredExceptions;

  // Required lines that participate in the whole-project gate.
  const gatingMaterials = input.materials.filter(
    (m) => m.required && !isExcludedByApprovedDeferral(m, orgAllows),
  );

  const completeMaterials = gatingMaterials.filter((m) => m.usableQuantity >= m.requiredQuantity);
  const verifiedMaterials = gatingMaterials.filter((m) => specVerified(m));
  const stagedMaterials = gatingMaterials.filter((m) => m.staged);

  // Any deferred-template line missing its control fields is invalid regardless of org policy.
  const invalidDeferred = input.materials.filter(
    (m) => m.required && m.gateType === 'deferred_template' && !m.deferredFieldsComplete,
  );

  const requiredSelections = input.selections.filter((s) => s.required);
  const approvedSelections = requiredSelections.filter((s) => s.approvedAndCurrent);

  const openBlockingClaims = input.claims.filter((c) => c.blocking && c.open);

  const requiredChecklist = input.checklist.filter((c) => c.required);
  const completeChecklist = requiredChecklist.filter((c) => c.completed);

  // ---- Blocker collection (ordered for a readable "why blocked" list) ----
  if (!input.hasCurrentDesignRevision) {
    blockers.push({
      code: 'no_current_design_revision',
      message: 'No current issued-for-construction design revision is set.',
      owner: BLOCKER_OWNER.no_current_design_revision,
      entityType: 'project',
      entityId: null,
    });
  }

  if (gatingMaterials.length === 0) {
    blockers.push({
      code: 'no_required_material_lines',
      message: 'The project has no required material lines. Add the project material list.',
      owner: BLOCKER_OWNER.no_required_material_lines,
      entityType: 'project',
      entityId: null,
    });
  }

  for (const m of gatingMaterials) {
    if (m.usableQuantity < m.requiredQuantity) {
      blockers.push({
        code: 'material_insufficient_usable',
        message: `"${m.name}" has ${m.usableQuantity} usable of ${m.requiredQuantity} required.`,
        owner: BLOCKER_OWNER.material_insufficient_usable,
        entityType: 'material',
        entityId: m.id,
      });
    }
    if (m.concealedInspectionOpen) {
      blockers.push({
        code: 'material_concealed_inspection_open',
        message: `"${m.name}" has an unresolved concealed inspection.`,
        owner: BLOCKER_OWNER.material_concealed_inspection_open,
        entityType: 'material',
        entityId: m.id,
      });
    }
    if (!m.hasRequiredPhoto) {
      blockers.push({
        code: 'material_missing_photos',
        message: `"${m.name}" is missing required receiving/label/finish photos.`,
        owner: BLOCKER_OWNER.material_missing_photos,
        entityType: 'material',
        entityId: m.id,
      });
    }
    if (!specVerified(m) && m.hasRequiredPhoto && !m.concealedInspectionOpen) {
      // Spec/identity/lot/package/storage/selection verification incomplete.
      blockers.push({
        code: 'material_spec_unverified',
        message: `"${m.name}" has incomplete specification/identity/storage verification.`,
        owner: BLOCKER_OWNER.material_spec_unverified,
        entityType: 'material',
        entityId: m.id,
      });
    }
    if (!m.staged) {
      blockers.push({
        code: 'material_not_staged',
        message: `"${m.name}" is not staged by project/room/trade/phase.`,
        owner: BLOCKER_OWNER.material_not_staged,
        entityType: 'material',
        entityId: m.id,
      });
    }
  }

  for (const m of invalidDeferred) {
    blockers.push({
      code: 'invalid_deferred_template',
      message: `Deferred-template line "${m.name}" is missing required exception fields.`,
      owner: BLOCKER_OWNER.invalid_deferred_template,
      entityType: 'material',
      entityId: m.id,
    });
  }

  for (const s of requiredSelections) {
    if (!s.approvedAndCurrent) {
      blockers.push({
        code: 'selection_not_approved',
        message: `Selection "${s.reference}" is not approved on the current design revision.`,
        owner: BLOCKER_OWNER.selection_not_approved,
        entityType: 'selection',
        entityId: s.id,
      });
    }
  }

  for (const c of openBlockingClaims) {
    blockers.push({
      code: 'open_blocking_claim',
      message: `Blocking claim ${c.claimNumber} is still open.`,
      owner: BLOCKER_OWNER.open_blocking_claim,
      entityType: 'claim',
      entityId: c.id,
    });
  }

  if (requiredChecklist.length === 0) {
    blockers.push({
      code: 'no_required_checklist_items',
      message: 'The project has no required readiness checklist items.',
      owner: BLOCKER_OWNER.no_required_checklist_items,
      entityType: 'project',
      entityId: null,
    });
  }
  for (const c of requiredChecklist) {
    if (!c.completed) {
      blockers.push({
        code: 'checklist_incomplete',
        message: `Checklist item "${c.label}" is not complete.`,
        owner: BLOCKER_OWNER.checklist_incomplete,
        entityType: 'checklist',
        entityId: c.key,
      });
    }
  }

  const preapprovalReady =
    input.hasCurrentDesignRevision &&
    gatingMaterials.length > 0 &&
    gatingMaterials.length === completeMaterials.length &&
    gatingMaterials.length === verifiedMaterials.length &&
    gatingMaterials.length === stagedMaterials.length &&
    invalidDeferred.length === 0 &&
    requiredSelections.length === approvedSelections.length &&
    openBlockingClaims.length === 0 &&
    requiredChecklist.length > 0 &&
    requiredChecklist.length === completeChecklist.length;

  return {
    preapprovalReady,
    blockers,
    counts: {
      requiredMaterialLines: gatingMaterials.length,
      completeMaterialLines: completeMaterials.length,
      highEndVerifiedLines: verifiedMaterials.length,
      stagedRequiredLines: stagedMaterials.length,
      invalidDeferredTemplateLines: invalidDeferred.length,
      requiredSelections: requiredSelections.length,
      approvedCurrentSelections: approvedSelections.length,
      openBlockingClaims: openBlockingClaims.length,
      requiredChecklistItems: requiredChecklist.length,
      completeChecklistItems: completeChecklist.length,
    },
  };
}
