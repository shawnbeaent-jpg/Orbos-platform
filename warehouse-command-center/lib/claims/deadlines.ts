/**
 * Claim aging and escalation. Carriers and vendors impose notice windows; missing a
 * deadline can forfeit recovery rights. These pure helpers compute aging and an
 * escalation level so dashboards and notifications can act before a deadline lapses.
 */

export type EscalationLevel = 'none' | 'due_soon' | 'overdue' | 'critical';

export interface ClaimDeadlineInput {
  openedAt: Date;
  /** Vendor/carrier notice deadline; the hard date recovery rights may lapse. */
  noticeDeadline: Date | null;
  /** Internal response-due date for the claim owner. */
  responseDueDate: Date | null;
  resolved: boolean;
}

export interface ClaimAging {
  ageDays: number;
  daysUntilNotice: number | null;
  escalation: EscalationLevel;
}

const MS_PER_DAY = 86_400_000;

export function wholeDaysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY);
}

/**
 * @param dueSoonDays how many days before the notice deadline we begin warning.
 */
export function computeClaimAging(
  input: ClaimDeadlineInput,
  now: Date,
  dueSoonDays = 3,
): ClaimAging {
  const ageDays = Math.max(wholeDaysBetween(input.openedAt, now), 0);

  if (input.resolved) {
    return { ageDays, daysUntilNotice: null, escalation: 'none' };
  }

  let daysUntilNotice: number | null = null;
  let escalation: EscalationLevel = 'none';

  if (input.noticeDeadline) {
    daysUntilNotice = wholeDaysBetween(now, input.noticeDeadline);
    if (daysUntilNotice < 0) {
      escalation = 'critical'; // notice window has lapsed
    } else if (daysUntilNotice === 0) {
      escalation = 'critical';
    } else if (daysUntilNotice <= dueSoonDays) {
      escalation = 'due_soon';
    }
  }

  if (input.responseDueDate && escalation !== 'critical') {
    const daysUntilResponse = wholeDaysBetween(now, input.responseDueDate);
    if (daysUntilResponse < 0) {
      escalation = 'overdue';
    } else if (daysUntilResponse <= dueSoonDays && escalation === 'none') {
      escalation = 'due_soon';
    }
  }

  return { ageDays, daysUntilNotice, escalation };
}
