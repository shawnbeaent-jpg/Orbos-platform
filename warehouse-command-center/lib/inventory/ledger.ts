import type { InventoryTxnType } from '@/lib/supabase/database.types';

/**
 * Shared-stock balances are DERIVED from an immutable transaction ledger, never by
 * overwriting a total. This module reconciles a ledger and guards operations so
 * available stock can never go silently negative.
 */

export interface InventoryTransaction {
  transactionType: InventoryTxnType;
  quantity: number; // signed convention below is normalized here
}

export interface InventoryBalance {
  onHand: number;
  committed: number;
  available: number; // onHand - committed
}

/**
 * Effect of each transaction type on (onHand, committed). Quantities in the ledger
 * are stored as positive magnitudes; the type determines direction.
 */
function applyTransaction(balance: { onHand: number; committed: number }, txn: InventoryTransaction): void {
  const q = Math.abs(txn.quantity);
  switch (txn.transactionType) {
    case 'receipt':
      balance.onHand += q;
      break;
    case 'issue_to_project':
      balance.onHand -= q;
      balance.committed -= q; // issuing consumes a prior commitment
      break;
    case 'return_from_project':
      balance.onHand += q;
      break;
    case 'commitment':
      balance.committed += q;
      break;
    case 'release_commitment':
      balance.committed -= q;
      break;
    case 'adjustment':
      balance.onHand += txn.quantity; // adjustments are signed
      break;
    case 'damage_writeoff':
      balance.onHand -= q;
      break;
    default: {
      // Exhaustiveness guard: a new txn type must be handled explicitly.
      const _never: never = txn.transactionType;
      throw new Error(`Unhandled inventory transaction type: ${String(_never)}`);
    }
  }
}

export function computeBalance(transactions: InventoryTransaction[]): InventoryBalance {
  const balance = { onHand: 0, committed: 0 };
  for (const txn of transactions) {
    applyTransaction(balance, txn);
  }
  // Committed is clamped at zero for reporting; underflow indicates a data error upstream.
  const committed = Math.max(balance.committed, 0);
  return {
    onHand: balance.onHand,
    committed,
    available: balance.onHand - committed,
  };
}

export class InventoryError extends Error {}

/**
 * Validate a proposed operation against the current derived balance. Throws rather
 * than allowing a negative available balance. Mirrors the intent of the DB CHECK
 * constraints and the "never silently negative" rule.
 */
export function assertOperationAllowed(
  current: InventoryBalance,
  operation: { transactionType: InventoryTxnType; quantity: number },
): void {
  const q = Math.abs(operation.quantity);
  if (!Number.isFinite(operation.quantity) || operation.quantity === 0) {
    throw new InventoryError('Transaction quantity must be a non-zero finite number.');
  }
  if (operation.transactionType === 'commitment' && q > current.available) {
    throw new InventoryError(
      `Cannot commit ${q}: only ${current.available} available.`,
    );
  }
  if (operation.transactionType === 'issue_to_project' && q > current.onHand) {
    throw new InventoryError(`Cannot issue ${q}: only ${current.onHand} on hand.`);
  }
  if (operation.transactionType === 'damage_writeoff' && q > current.onHand) {
    throw new InventoryError(`Cannot write off ${q}: only ${current.onHand} on hand.`);
  }
}
