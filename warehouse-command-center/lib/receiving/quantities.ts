import type { MaterialVerification } from '@/lib/readiness/engine';

/**
 * Receiving quantity math. This mirrors the SQL function
 * `public.apply_receiving_inspection()` so the client can preview exactly what a
 * receipt will do before submitting, and so the rule is unit-tested. The database
 * trigger remains authoritative and runs atomically.
 *
 * Key rule: quantity acceptance is NOT specification acceptance. Units only become
 * "usable" when the shipment passes BOL and every required verification for the line.
 */

export interface ReceiptCounts {
  receivedQuantity: number;
  damagedQuantity: number;
  rejectedQuantity: number;
}

export interface InspectionOutcome {
  bolVerified: boolean;
  inspectionPassed: boolean;
  purchaseOrderVerified: boolean;
  packingSlipVerified: boolean;
  designRevisionVerified: boolean;
  specificationVerified: boolean;
  identityVerified: boolean;
  lotCompatibilityVerified: boolean;
  packageCompleteVerified: boolean;
}

export class QuantityError extends Error {}

/** Non-negative good units physically in hand (received minus damaged/rejected). */
export function goodQuantity(counts: ReceiptCounts): number {
  const good = counts.receivedQuantity - counts.damagedQuantity - counts.rejectedQuantity;
  return Math.max(good, 0);
}

/**
 * Units that may be counted as USABLE. Zero unless BOL + inspection + every
 * verification the material line requires all pass.
 */
export function acceptedQuantity(
  counts: ReceiptCounts,
  outcome: InspectionOutcome,
  requirements: Pick<
    MaterialVerification,
    | 'purchaseOrderRequired'
    | 'packingSlipRequired'
    | 'designRevisionRequired'
    | 'specificationRequired'
    | 'identityRequired'
    | 'lotRequired'
    | 'packageRequired'
  >,
): number {
  const specOk =
    outcome.inspectionPassed &&
    outcome.bolVerified &&
    (!requirements.purchaseOrderRequired || outcome.purchaseOrderVerified) &&
    (!requirements.packingSlipRequired || outcome.packingSlipVerified) &&
    (!requirements.designRevisionRequired || outcome.designRevisionVerified) &&
    (!requirements.specificationRequired || outcome.specificationVerified) &&
    (!requirements.identityRequired || outcome.identityVerified) &&
    (!requirements.lotRequired || outcome.lotCompatibilityVerified) &&
    (!requirements.packageRequired || outcome.packageCompleteVerified);

  return specOk ? goodQuantity(counts) : 0;
}

/** Validate counts before they ever reach the database (defense in depth vs. CHECK constraints). */
export function assertValidCounts(counts: ReceiptCounts): void {
  const { receivedQuantity, damagedQuantity, rejectedQuantity } = counts;
  if ([receivedQuantity, damagedQuantity, rejectedQuantity].some((n) => !Number.isFinite(n) || n < 0)) {
    throw new QuantityError('Quantities must be finite and non-negative.');
  }
  if (damagedQuantity + rejectedQuantity > receivedQuantity) {
    throw new QuantityError('Damaged plus rejected quantity cannot exceed received quantity.');
  }
}

export interface MaterialTotals {
  requiredQuantity: number;
  receivedQuantity: number;
  usableQuantity: number;
  damagedQuantity: number;
  rejectedQuantity: number;
}

export type ProjectedMaterialStatus = 'received' | 'damaged' | 'partial' | 'unchanged';

export interface ProjectedTotals extends MaterialTotals {
  status: ProjectedMaterialStatus;
}

/** Preview the material line totals + status after applying a receipt (pure). */
export function projectTotals(
  current: MaterialTotals,
  counts: ReceiptCounts,
  accepted: number,
): ProjectedTotals {
  assertValidCounts(counts);
  const receivedQuantity = current.receivedQuantity + counts.receivedQuantity;
  const usableQuantity = current.usableQuantity + accepted;
  const damagedQuantity = current.damagedQuantity + counts.damagedQuantity;
  const rejectedQuantity = current.rejectedQuantity + counts.rejectedQuantity;

  let status: ProjectedMaterialStatus;
  if (usableQuantity >= current.requiredQuantity) {
    status = 'received';
  } else if (counts.damagedQuantity > 0 || counts.rejectedQuantity > 0) {
    status = 'damaged';
  } else if (counts.receivedQuantity > 0) {
    status = 'partial';
  } else {
    status = 'unchanged';
  }

  return {
    requiredQuantity: current.requiredQuantity,
    receivedQuantity,
    usableQuantity,
    damagedQuantity,
    rejectedQuantity,
    status,
  };
}
