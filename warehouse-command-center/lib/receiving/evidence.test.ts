import { describe, expect, it } from 'vitest';
import { checkEvidence, requiredEvidence, type EvidenceDescriptor } from './evidence';

const clean = { damagedQuantity: 0, rejectedQuantity: 0, concealedInspectionDeferred: false };

describe('requiredEvidence', () => {
  it('always requires BOL and a material photo', () => {
    expect(requiredEvidence(clean)).toEqual(['bol', 'material_photo']);
  });

  it('requires a damage photo when damage is recorded (Acceptance D)', () => {
    expect(requiredEvidence({ ...clean, damagedQuantity: 2 })).toContain('damage_photo');
  });

  it('requires packaging/label photo when concealed inspection is deferred (Acceptance K)', () => {
    expect(requiredEvidence({ ...clean, concealedInspectionDeferred: true })).toContain('label_photo');
  });
});

describe('checkEvidence', () => {
  it('is satisfied with a BOL and a label photo (label satisfies material photo)', () => {
    const provided: EvidenceDescriptor[] = [
      { documentType: 'bol', storagePath: 'o/p/bol/1.jpg' },
      { documentType: 'label_photo', storagePath: 'o/p/label/1.jpg' },
    ];
    expect(checkEvidence(clean, provided).satisfied).toBe(true);
  });

  it('reports missing damage photo (Acceptance D)', () => {
    const provided: EvidenceDescriptor[] = [
      { documentType: 'bol', storagePath: 'o/p/bol/1.jpg' },
      { documentType: 'material_photo', storagePath: 'o/p/mat/1.jpg' },
    ];
    const result = checkEvidence({ ...clean, damagedQuantity: 1 }, provided);
    expect(result.satisfied).toBe(false);
    expect(result.missing).toContain('damage_photo');
  });

  it('accepts a delivery ticket in place of a BOL image', () => {
    const provided: EvidenceDescriptor[] = [
      { documentType: 'delivery_ticket', storagePath: 'o/p/dt/1.jpg' },
      { documentType: 'material_photo', storagePath: 'o/p/mat/1.jpg' },
    ];
    expect(checkEvidence(clean, provided).satisfied).toBe(true);
  });

  it('is unsatisfied with no evidence at all', () => {
    expect(checkEvidence(clean, []).missing).toEqual(['bol', 'material_photo']);
  });
});
