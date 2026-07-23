import { describe, expect, it } from 'vitest';
import {
  evaluateReadiness,
  type ReadinessInput,
  type ReadinessMaterialInput,
} from './engine';

/** A fully-verified, staged, complete required material line. */
function goodMaterial(overrides: Partial<ReadinessMaterialInput> = {}): ReadinessMaterialInput {
  return {
    id: overrides.id ?? 'm1',
    name: overrides.name ?? 'Custom Cabinet Run',
    required: true,
    gateType: 'pre_start_required',
    deferredExceptionApproved: false,
    deferredFieldsComplete: true,
    requiredQuantity: 10,
    usableQuantity: 10,
    staged: true,
    concealedInspectionOpen: false,
    hasRequiredPhoto: true,
    selectionRequired: true,
    selectionApproved: true,
    purchaseOrderRequired: true,
    purchaseOrderVerified: true,
    packingSlipRequired: true,
    packingSlipVerified: true,
    designRevisionRequired: true,
    designRevisionVerified: true,
    specificationRequired: true,
    specificationVerified: true,
    identityRequired: true,
    identityVerified: true,
    lotRequired: false,
    lotVerified: false,
    packageRequired: false,
    packageVerified: false,
    storageRequired: true,
    storageCompliant: true,
    ...overrides,
  };
}

function baseInput(materials: ReadinessMaterialInput[]): ReadinessInput {
  return {
    hasCurrentDesignRevision: true,
    organizationAllowsDeferredExceptions: false,
    materials,
    selections: [{ id: 's1', reference: 'SEL-001', required: true, approvedAndCurrent: true }],
    claims: [],
    checklist: [
      { key: 'material_list_approved', label: 'Material list approved', required: true, completed: true },
      { key: 'pm_final_review', label: 'PM final review', required: true, completed: true },
    ],
  };
}

describe('evaluateReadiness — whole-project gate (Acceptance R)', () => {
  it('is ready when every control passes', () => {
    const result = evaluateReadiness(baseInput([goodMaterial()]));
    expect(result.preapprovalReady).toBe(true);
    expect(result.blockers).toHaveLength(0);
  });

  it('blocks when quantity is satisfied but finish/spec verification is incomplete (R.2)', () => {
    const result = evaluateReadiness(baseInput([goodMaterial({ specificationVerified: false })]));
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('material_spec_unverified');
  });

  it('blocks when spec is satisfied but storage is noncompliant (R.3)', () => {
    const result = evaluateReadiness(baseInput([goodMaterial({ storageCompliant: false })]));
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('material_spec_unverified');
  });

  it('requires at least one required material line', () => {
    const result = evaluateReadiness(baseInput([]));
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('no_required_material_lines');
  });

  it('blocks without a current design revision', () => {
    const result = evaluateReadiness({ ...baseInput([goodMaterial()]), hasCurrentDesignRevision: false });
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('no_current_design_revision');
  });
});

describe('evaluateReadiness — partial and insufficient quantity (Acceptance C)', () => {
  it('blocks when usable is below required and names the owner', () => {
    const result = evaluateReadiness(baseInput([goodMaterial({ usableQuantity: 6 })]));
    expect(result.preapprovalReady).toBe(false);
    const blocker = result.blockers.find((b) => b.code === 'material_insufficient_usable');
    expect(blocker).toBeDefined();
    expect(blocker?.owner).toBe('warehouse_manager');
    expect(blocker?.message).toContain('6 usable of 10');
  });
});

describe('evaluateReadiness — staging (Acceptance Q)', () => {
  it('blocks when a required line is not staged even if received', () => {
    const result = evaluateReadiness(baseInput([goodMaterial({ staged: false })]));
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('material_not_staged');
  });
});

describe('evaluateReadiness — blocking claims (Acceptance D/P)', () => {
  it('blocks while a blocking claim is open', () => {
    const input = baseInput([goodMaterial()]);
    input.claims = [{ id: 'c1', claimNumber: 'CLM-1', blocking: true, open: true }];
    const result = evaluateReadiness(input);
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('open_blocking_claim');
  });

  it('is ready once the blocking claim is resolved (non-blocking claims are ignored)', () => {
    const input = baseInput([goodMaterial()]);
    input.claims = [{ id: 'c1', claimNumber: 'CLM-1', blocking: false, open: true }];
    expect(evaluateReadiness(input).preapprovalReady).toBe(true);
  });
});

describe('evaluateReadiness — selections (Acceptance A)', () => {
  it('blocks when a required selection is not approved on the current revision', () => {
    const input = baseInput([goodMaterial()]);
    input.selections = [{ id: 's1', reference: 'SEL-001', required: true, approvedAndCurrent: false }];
    const result = evaluateReadiness(input);
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('selection_not_approved');
  });
});

describe('evaluateReadiness — concealed inspection (Acceptance K)', () => {
  it('blocks while a concealed inspection remains open', () => {
    const result = evaluateReadiness(baseInput([goodMaterial({ concealedInspectionOpen: true })]));
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('material_concealed_inspection_open');
  });
});

describe('evaluateReadiness — photos required (Acceptance R photo/document)', () => {
  it('blocks when required receiving photos are missing', () => {
    const result = evaluateReadiness(baseInput([goodMaterial({ hasRequiredPhoto: false })]));
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('material_missing_photos');
  });
});

describe('evaluateReadiness — deferred template (Acceptance L2)', () => {
  it('strict policy: deferred-template line blocks Ready to Start', () => {
    const deferred = goodMaterial({
      id: 'ct',
      name: 'Fabricated Countertop',
      gateType: 'deferred_template',
      usableQuantity: 0,
      deferredExceptionApproved: false,
    });
    const result = evaluateReadiness(baseInput([goodMaterial(), deferred]));
    expect(result.preapprovalReady).toBe(false);
    // Under strict policy the deferred line participates and is incomplete.
    expect(result.blockers.map((b) => b.code)).toContain('material_insufficient_usable');
  });

  it('permitted exception: approved deferred-template line is excluded from the pre-start gate', () => {
    const input = baseInput([
      goodMaterial(),
      goodMaterial({
        id: 'ct',
        name: 'Fabricated Countertop',
        gateType: 'deferred_template',
        usableQuantity: 0,
        staged: false,
        deferredExceptionApproved: true,
        deferredFieldsComplete: true,
      }),
    ]);
    input.organizationAllowsDeferredExceptions = true;
    const result = evaluateReadiness(input);
    expect(result.preapprovalReady).toBe(true);
  });

  it('an approved deferred-template line missing control fields is invalid and blocks', () => {
    const input = baseInput([
      goodMaterial(),
      goodMaterial({
        id: 'ct',
        gateType: 'deferred_template',
        usableQuantity: 0,
        deferredExceptionApproved: true,
        deferredFieldsComplete: false,
      }),
    ]);
    input.organizationAllowsDeferredExceptions = true;
    const result = evaluateReadiness(input);
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('invalid_deferred_template');
  });
});

describe('evaluateReadiness — checklist', () => {
  it('blocks when a required checklist item is incomplete', () => {
    const input = baseInput([goodMaterial()]);
    input.checklist = [{ key: 'pm_final_review', label: 'PM final review', required: true, completed: false }];
    const result = evaluateReadiness(input);
    expect(result.preapprovalReady).toBe(false);
    expect(result.blockers.map((b) => b.code)).toContain('checklist_incomplete');
  });
});
