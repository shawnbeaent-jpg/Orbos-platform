/**
 * Offline draft queue for receiving inspections. Drafts are keyed by their
 * idempotency key so re-enqueuing the same draft (or syncing twice) never creates
 * duplicates. Photos are stored as data URLs so a draft is fully self-contained on
 * the device. The pure functions here take a `KeyValueStore` so the queue logic is
 * unit-tested without a browser; the app injects `localStorage`.
 */

export interface QueuedEvidence {
  documentType: string;
  /** data: URL captured on-device; uploaded to storage at sync time. */
  dataUrl: string;
  filename: string;
  caption?: string;
}

export interface QueuedReceivingDraft {
  idempotencyKey: string;
  createdAt: string;
  /** The exact payload the server action validates. */
  inspection: Record<string, unknown>;
  evidence: QueuedEvidence[];
}

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const STORAGE_KEY = 'wcc.receiving.queue.v1';

function readAll(store: KeyValueStore): QueuedReceivingDraft[] {
  const raw = store.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QueuedReceivingDraft[]) : [];
  } catch {
    return [];
  }
}

function writeAll(store: KeyValueStore, drafts: QueuedReceivingDraft[]): void {
  store.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

/** Add or replace a draft by idempotency key. Returns the resulting queue. */
export function enqueueDraft(store: KeyValueStore, draft: QueuedReceivingDraft): QueuedReceivingDraft[] {
  const drafts = readAll(store).filter((d) => d.idempotencyKey !== draft.idempotencyKey);
  drafts.push(draft);
  writeAll(store, drafts);
  return drafts;
}

export function listDrafts(store: KeyValueStore): QueuedReceivingDraft[] {
  return readAll(store);
}

export function countDrafts(store: KeyValueStore): number {
  return readAll(store).length;
}

/** Remove a draft after it has been confirmed synced. */
export function removeDraft(store: KeyValueStore, idempotencyKey: string): QueuedReceivingDraft[] {
  const drafts = readAll(store).filter((d) => d.idempotencyKey !== idempotencyKey);
  writeAll(store, drafts);
  return drafts;
}

export function hasDraft(store: KeyValueStore, idempotencyKey: string): boolean {
  return readAll(store).some((d) => d.idempotencyKey === idempotencyKey);
}
