import { describe, expect, it } from 'vitest';
import {
  enqueueDraft,
  listDrafts,
  removeDraft,
  countDrafts,
  hasDraft,
  type KeyValueStore,
  type QueuedReceivingDraft,
} from './receivingQueue';

function memoryStore(): KeyValueStore {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

function draft(key: string): QueuedReceivingDraft {
  return { idempotencyKey: key, createdAt: '2026-07-23T00:00:00Z', inspection: { bolNumber: 'B1' }, evidence: [] };
}

describe('receiving offline queue — idempotent drafts (Acceptance O)', () => {
  it('enqueues and lists drafts', () => {
    const store = memoryStore();
    enqueueDraft(store, draft('k1'));
    enqueueDraft(store, draft('k2'));
    expect(countDrafts(store)).toBe(2);
    expect(listDrafts(store).map((d) => d.idempotencyKey)).toEqual(['k1', 'k2']);
  });

  it('re-enqueuing the same key replaces, never duplicates', () => {
    const store = memoryStore();
    enqueueDraft(store, draft('k1'));
    enqueueDraft(store, draft('k1'));
    enqueueDraft(store, draft('k1'));
    expect(countDrafts(store)).toBe(1);
  });

  it('removes a draft after sync', () => {
    const store = memoryStore();
    enqueueDraft(store, draft('k1'));
    enqueueDraft(store, draft('k2'));
    removeDraft(store, 'k1');
    expect(hasDraft(store, 'k1')).toBe(false);
    expect(hasDraft(store, 'k2')).toBe(true);
  });

  it('tolerates corrupt storage', () => {
    const store = memoryStore();
    store.setItem('wcc.receiving.queue.v1', '{not json');
    expect(listDrafts(store)).toEqual([]);
  });
});
