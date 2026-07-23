import { describe, expect, it } from 'vitest';
import { computeClaimAging, wholeDaysBetween } from './deadlines';

const now = new Date('2026-07-23T12:00:00Z');

function daysFromNow(n: number): Date {
  return new Date(now.getTime() + n * 86_400_000);
}

describe('wholeDaysBetween', () => {
  it('counts whole days', () => {
    expect(wholeDaysBetween(now, daysFromNow(3))).toBe(3);
    expect(wholeDaysBetween(now, daysFromNow(-2))).toBe(-2);
  });
});

describe('computeClaimAging — vendor notice escalation (Acceptance P)', () => {
  it('is none when far from the deadline', () => {
    const aging = computeClaimAging(
      { openedAt: daysFromNow(-2), noticeDeadline: daysFromNow(10), responseDueDate: null, resolved: false },
      now,
    );
    expect(aging.ageDays).toBe(2);
    expect(aging.escalation).toBe('none');
  });

  it('warns due_soon within the window', () => {
    const aging = computeClaimAging(
      { openedAt: daysFromNow(-1), noticeDeadline: daysFromNow(2), responseDueDate: null, resolved: false },
      now,
    );
    expect(aging.escalation).toBe('due_soon');
  });

  it('is critical when the notice deadline has lapsed', () => {
    const aging = computeClaimAging(
      { openedAt: daysFromNow(-10), noticeDeadline: daysFromNow(-1), responseDueDate: null, resolved: false },
      now,
    );
    expect(aging.escalation).toBe('critical');
  });

  it('is overdue when internal response date passed but notice is still open', () => {
    const aging = computeClaimAging(
      { openedAt: daysFromNow(-5), noticeDeadline: daysFromNow(10), responseDueDate: daysFromNow(-1), resolved: false },
      now,
    );
    expect(aging.escalation).toBe('overdue');
  });

  it('is none once resolved regardless of dates', () => {
    const aging = computeClaimAging(
      { openedAt: daysFromNow(-30), noticeDeadline: daysFromNow(-10), responseDueDate: daysFromNow(-10), resolved: true },
      now,
    );
    expect(aging.escalation).toBe('none');
  });
});
