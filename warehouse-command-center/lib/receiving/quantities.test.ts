import { describe, expect, it } from 'vitest';
import {
  acceptedQuantity,
  assertValidCounts,
  goodQuantity,
  projectTotals,
  QuantityError,
  type InspectionOutcome,
} from './quantities';

const allRequired = {
  purchaseOrderRequired: true,
  packingSlipRequired: true,
  designRevisionRequired: true,
  specificationRequired: true,
  identityRequired: true,
  lotRequired: true,
  packageRequired: true,
};

function passingOutcome(overrides: Partial<InspectionOutcome> = {}): InspectionOutcome {
  return {
    bolVerified: true,
    inspectionPassed: true,
    purchaseOrderVerified: true,
    packingSlipVerified: true,
    designRevisionVerified: true,
    specificationVerified: true,
    identityVerified: true,
    lotCompatibilityVerified: true,
    packageCompleteVerified: true,
    ...overrides,
  };
}

describe('goodQuantity', () => {
  it('subtracts damaged and rejected, never below zero', () => {
    expect(goodQuantity({ receivedQuantity: 10, damagedQuantity: 2, rejectedQuantity: 1 })).toBe(7);
    expect(goodQuantity({ receivedQuantity: 3, damagedQuantity: 3, rejectedQuantity: 3 })).toBe(0);
  });
});

describe('acceptedQuantity — quantity acceptance is not specification acceptance (Acceptance B/E)', () => {
  it('accepts full good quantity when every required check passes', () => {
    const qty = acceptedQuantity(
      { receivedQuantity: 10, damagedQuantity: 0, rejectedQuantity: 0 },
      passingOutcome(),
      allRequired,
    );
    expect(qty).toBe(10);
  });

  it('accepts zero when the wrong finish fails specification even if quantity matches (Acceptance E)', () => {
    const qty = acceptedQuantity(
      { receivedQuantity: 10, damagedQuantity: 0, rejectedQuantity: 0 },
      passingOutcome({ specificationVerified: false }),
      allRequired,
    );
    expect(qty).toBe(0);
  });

  it('accepts zero when BOL is not verified (Acceptance M)', () => {
    const qty = acceptedQuantity(
      { receivedQuantity: 10, damagedQuantity: 0, rejectedQuantity: 0 },
      passingOutcome({ bolVerified: false }),
      allRequired,
    );
    expect(qty).toBe(0);
  });

  it('accepts zero when a mixed dye lot fails lot compatibility (Acceptance G)', () => {
    const qty = acceptedQuantity(
      { receivedQuantity: 40, damagedQuantity: 0, rejectedQuantity: 0 },
      passingOutcome({ lotCompatibilityVerified: false }),
      allRequired,
    );
    expect(qty).toBe(0);
  });

  it('ignores checks the line does not require', () => {
    const qty = acceptedQuantity(
      { receivedQuantity: 5, damagedQuantity: 0, rejectedQuantity: 0 },
      passingOutcome({ lotCompatibilityVerified: false, packageCompleteVerified: false }),
      { ...allRequired, lotRequired: false, packageRequired: false },
    );
    expect(qty).toBe(5);
  });

  it('excludes damaged units from usable even when specification passes (Acceptance D)', () => {
    const qty = acceptedQuantity(
      { receivedQuantity: 10, damagedQuantity: 3, rejectedQuantity: 0 },
      passingOutcome(),
      allRequired,
    );
    expect(qty).toBe(7);
  });
});

describe('assertValidCounts — impossible quantities rejected (Acceptance T)', () => {
  it('rejects negative quantities', () => {
    expect(() => assertValidCounts({ receivedQuantity: -1, damagedQuantity: 0, rejectedQuantity: 0 })).toThrow(
      QuantityError,
    );
  });

  it('rejects damaged+rejected exceeding received', () => {
    expect(() => assertValidCounts({ receivedQuantity: 5, damagedQuantity: 4, rejectedQuantity: 3 })).toThrow(
      QuantityError,
    );
  });
});

describe('projectTotals — partial then balance receipt increments without overwrite (Acceptance C)', () => {
  it('first partial receipt is partial, second completes', () => {
    const current = {
      requiredQuantity: 10,
      receivedQuantity: 0,
      usableQuantity: 0,
      damagedQuantity: 0,
      rejectedQuantity: 0,
    };
    const first = projectTotals(current, { receivedQuantity: 6, damagedQuantity: 0, rejectedQuantity: 0 }, 6);
    expect(first.usableQuantity).toBe(6);
    expect(first.status).toBe('partial');

    const second = projectTotals(first, { receivedQuantity: 4, damagedQuantity: 0, rejectedQuantity: 0 }, 4);
    expect(second.usableQuantity).toBe(10);
    expect(second.receivedQuantity).toBe(10);
    expect(second.status).toBe('received');
  });

  it('overdelivery records physical quantity without raising required (Acceptance N)', () => {
    const current = {
      requiredQuantity: 10,
      receivedQuantity: 0,
      usableQuantity: 0,
      damagedQuantity: 0,
      rejectedQuantity: 0,
    };
    const result = projectTotals(current, { receivedQuantity: 13, damagedQuantity: 0, rejectedQuantity: 0 }, 13);
    expect(result.receivedQuantity).toBe(13);
    expect(result.requiredQuantity).toBe(10);
    expect(result.status).toBe('received');
  });
});
