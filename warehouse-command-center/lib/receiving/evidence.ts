/**
 * Required receiving evidence rules. Pure and unit-tested so the "no clean receipt
 * without required evidence" control is verifiable independent of storage/UI.
 */

export type DocumentType =
  | 'material_photo'
  | 'approved_selection_photo'
  | 'label_photo'
  | 'finish_comparison_photo'
  | 'damage_photo'
  | 'bol'
  | 'delivery_ticket'
  | 'packing_slip'
  | 'purchase_order'
  | 'receipt'
  | 'claim_document'
  | 'signature'
  | 'cut_sheet'
  | 'shop_drawing'
  | 'design_revision'
  | 'warranty'
  | 'installation_instruction'
  | 'loadout_manifest'
  | 'other';

export interface EvidenceDescriptor {
  documentType: DocumentType;
  storagePath: string;
  caption?: string;
}

export interface EvidenceContext {
  damagedQuantity: number;
  rejectedQuantity: number;
  concealedInspectionDeferred: boolean;
}

/**
 * The minimum evidence a clean (non-override) receipt must carry:
 * - BOL/delivery ticket image
 * - at least one product/label photo of the load
 * - a damage photo whenever any damaged/rejected units are recorded
 * - packaging/label photos when concealed inspection is deferred
 */
export function requiredEvidence(ctx: EvidenceContext): DocumentType[] {
  const required: DocumentType[] = ['bol', 'material_photo'];
  if (ctx.damagedQuantity > 0 || ctx.rejectedQuantity > 0) {
    required.push('damage_photo');
  }
  if (ctx.concealedInspectionDeferred) {
    required.push('label_photo');
  }
  return required;
}

export interface EvidenceCheck {
  satisfied: boolean;
  missing: DocumentType[];
}

/** A BOL image also satisfies delivery_ticket, and vice versa. */
function normalizePresent(types: Set<DocumentType>): Set<DocumentType> {
  const present = new Set(types);
  if (present.has('delivery_ticket')) present.add('bol');
  if (present.has('bol')) present.add('delivery_ticket');
  // Any label/finish/selection photo satisfies the generic "material_photo" evidence.
  if (present.has('label_photo') || present.has('finish_comparison_photo') || present.has('approved_selection_photo')) {
    present.add('material_photo');
  }
  return present;
}

export function checkEvidence(ctx: EvidenceContext, provided: EvidenceDescriptor[]): EvidenceCheck {
  const present = normalizePresent(new Set(provided.map((d) => d.documentType)));
  const missing = requiredEvidence(ctx).filter((t) => !present.has(t));
  return { satisfied: missing.length === 0, missing };
}
