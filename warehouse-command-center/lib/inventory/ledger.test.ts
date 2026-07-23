import { describe, expect, it } from 'vitest';
import {
  assertOperationAllowed,
  computeBalance,
  InventoryError,
  type InventoryTransaction,
} from './ledger';

describe('computeBalance — derived from the ledger (Acceptance T)', () => {
  it('reconciles receipts, commitments, and issues', () => {
    const txns: InventoryTransaction[] = [
      { transactionType: 'receipt', quantity: 100 },
      { transactionType: 'commitment', quantity: 30 },
      { transactionType: 'issue_to_project', quantity: 20 },
      { transactionType: 'return_from_project', quantity: 5 },
      { transactionType: 'adjustment', quantity: -3 },
      { transactionType: 'damage_writeoff', quantity: 2 },
    ];
    const balance = computeBalance(txns);
    // onHand: 100 - 20 + 5 - 3 - 2 = 80 ; committed: 30 - 20 = 10 ; available: 70
    expect(balance.onHand).toBe(80);
    expect(balance.committed).toBe(10);
    expect(balance.available).toBe(70);
  });

  it('handles a release of commitment', () => {
    const balance = computeBalance([
      { transactionType: 'receipt', quantity: 10 },
      { transactionType: 'commitment', quantity: 10 },
      { transactionType: 'release_commitment', quantity: 4 },
    ]);
    expect(balance.available).toBe(4);
  });
});

describe('assertOperationAllowed — never silently negative (Acceptance T)', () => {
  it('blocks committing more than available', () => {
    const balance = computeBalance([
      { transactionType: 'receipt', quantity: 10 },
      { transactionType: 'commitment', quantity: 8 },
    ]);
    expect(() => assertOperationAllowed(balance, { transactionType: 'commitment', quantity: 5 })).toThrow(
      InventoryError,
    );
  });

  it('blocks issuing more than on hand', () => {
    const balance = computeBalance([{ transactionType: 'receipt', quantity: 3 }]);
    expect(() => assertOperationAllowed(balance, { transactionType: 'issue_to_project', quantity: 4 })).toThrow(
      InventoryError,
    );
  });

  it('rejects a zero-quantity transaction', () => {
    const balance = computeBalance([{ transactionType: 'receipt', quantity: 3 }]);
    expect(() => assertOperationAllowed(balance, { transactionType: 'adjustment', quantity: 0 })).toThrow(
      InventoryError,
    );
  });

  it('allows a valid commitment within available', () => {
    const balance = computeBalance([{ transactionType: 'receipt', quantity: 10 }]);
    expect(() => assertOperationAllowed(balance, { transactionType: 'commitment', quantity: 10 })).not.toThrow();
  });
});
