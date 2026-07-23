import type { MaterialStatus, ProjectStatus, DeliveryStatus, ClaimStatus } from '@/lib/supabase/database.types';

/** Canonical operational status vocabulary shown to users. */
export type OperationalStatus =
  | 'ready'
  | 'blocked'
  | 'delayed'
  | 'damaged'
  | 'partial'
  | 'transit'
  | 'awaiting'
  | 'neutral';

export const STATUS_BADGE_CLASS: Record<OperationalStatus, string> = {
  ready: 'bg-status-ready/10 text-status-ready',
  blocked: 'bg-status-blocked/10 text-status-blocked',
  delayed: 'bg-status-delayed/10 text-status-delayed',
  damaged: 'bg-status-damaged/10 text-status-damaged',
  partial: 'bg-status-partial/10 text-status-partial',
  transit: 'bg-status-transit/10 text-status-transit',
  awaiting: 'bg-status-awaiting/10 text-status-awaiting',
  neutral: 'bg-steel-200 text-steel-700',
};

export function projectStatusView(status: ProjectStatus): { label: string; kind: OperationalStatus } {
  switch (status) {
    case 'ready_to_start':
      return { label: 'Ready to Start', kind: 'ready' };
    case 'blocked':
      return { label: 'Blocked', kind: 'blocked' };
    case 'materials_in_progress':
      return { label: 'Materials In Progress', kind: 'awaiting' };
    case 'active':
      return { label: 'Active', kind: 'transit' };
    case 'complete':
      return { label: 'Complete', kind: 'neutral' };
    case 'cancelled':
      return { label: 'Cancelled', kind: 'neutral' };
    case 'draft':
      return { label: 'Draft', kind: 'neutral' };
    default:
      return { label: status, kind: 'neutral' };
  }
}

export function materialStatusView(status: MaterialStatus): { label: string; kind: OperationalStatus } {
  switch (status) {
    case 'received':
      return { label: 'Received', kind: 'ready' };
    case 'partial':
      return { label: 'Partial', kind: 'partial' };
    case 'damaged':
      return { label: 'Damaged', kind: 'damaged' };
    case 'delayed':
      return { label: 'Delayed', kind: 'delayed' };
    case 'in_transit':
      return { label: 'In Transit', kind: 'transit' };
    case 'ordered':
      return { label: 'Ordered', kind: 'awaiting' };
    case 'requested':
      return { label: 'Requested', kind: 'awaiting' };
    case 'cancelled':
      return { label: 'Cancelled', kind: 'neutral' };
    case 'draft':
      return { label: 'Draft', kind: 'neutral' };
    default:
      return { label: status, kind: 'neutral' };
  }
}

export function deliveryStatusView(status: DeliveryStatus): { label: string; kind: OperationalStatus } {
  switch (status) {
    case 'received':
      return { label: 'Received', kind: 'ready' };
    case 'partial':
      return { label: 'Partial', kind: 'partial' };
    case 'delayed':
      return { label: 'Delayed', kind: 'delayed' };
    case 'rejected':
      return { label: 'Rejected', kind: 'damaged' };
    case 'in_transit':
      return { label: 'In Transit', kind: 'transit' };
    case 'arrived':
      return { label: 'Arrived', kind: 'awaiting' };
    case 'scheduled':
      return { label: 'Scheduled', kind: 'awaiting' };
    case 'cancelled':
      return { label: 'Cancelled', kind: 'neutral' };
    case 'draft':
      return { label: 'Draft', kind: 'neutral' };
    default:
      return { label: status, kind: 'neutral' };
  }
}

export function claimStatusView(status: ClaimStatus): { label: string; kind: OperationalStatus } {
  switch (status) {
    case 'resolved':
    case 'closed':
      return { label: status === 'resolved' ? 'Resolved' : 'Closed', kind: 'ready' };
    case 'denied':
      return { label: 'Denied', kind: 'neutral' };
    case 'open':
      return { label: 'Open', kind: 'blocked' };
    case 'vendor_acknowledged':
      return { label: 'Vendor Acknowledged', kind: 'awaiting' };
    case 'replacement_scheduled':
      return { label: 'Replacement Scheduled', kind: 'transit' };
    case 'credit_pending':
      return { label: 'Credit Pending', kind: 'awaiting' };
    case 'draft':
      return { label: 'Draft', kind: 'neutral' };
    default:
      return { label: status, kind: 'neutral' };
  }
}
