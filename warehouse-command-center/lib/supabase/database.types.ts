/**
 * Hand-authored database types for the subset of the schema the application reads
 * and writes today. In a full environment, regenerate the complete definitions with:
 *
 *   npm run gen:types   # supabase gen types typescript --local
 *
 * These are kept deliberately accurate for the columns used by server actions,
 * queries, and the readiness engine so the app compiles under `strict` without `any`.
 */

export type AppRole =
  | 'admin'
  | 'warehouse_manager'
  | 'project_manager'
  | 'receiver'
  | 'purchasing'
  | 'executive_readonly';

export type ProjectStatus =
  | 'draft'
  | 'materials_in_progress'
  | 'blocked'
  | 'ready_to_start'
  | 'active'
  | 'complete'
  | 'cancelled';

export type MaterialStatus =
  | 'draft'
  | 'requested'
  | 'ordered'
  | 'in_transit'
  | 'partial'
  | 'received'
  | 'damaged'
  | 'delayed'
  | 'cancelled';

export type DeliveryStatus =
  | 'draft'
  | 'scheduled'
  | 'in_transit'
  | 'arrived'
  | 'partial'
  | 'received'
  | 'delayed'
  | 'rejected'
  | 'cancelled';

export type RequestStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'purchased'
  | 'fulfilled'
  | 'cancelled';

export type ClaimStatus =
  | 'draft'
  | 'open'
  | 'vendor_acknowledged'
  | 'replacement_scheduled'
  | 'credit_pending'
  | 'resolved'
  | 'closed'
  | 'denied';

export type ClaimType =
  | 'damage'
  | 'shortage'
  | 'wrong_item'
  | 'quality_defect'
  | 'concealed_damage'
  | 'bol_discrepancy'
  | 'wrong_finish'
  | 'lot_mismatch'
  | 'packaging_damage'
  | 'storage_noncompliance'
  | 'design_revision_mismatch'
  | 'missing_accessory';

export type InventoryTxnType =
  | 'receipt'
  | 'commitment'
  | 'release_commitment'
  | 'issue_to_project'
  | 'return_from_project'
  | 'adjustment'
  | 'damage_writeoff';

export type SelectionStatus =
  | 'draft'
  | 'pending_client_approval'
  | 'pending_designer_approval'
  | 'approved'
  | 'superseded'
  | 'rejected';

export type InspectionLevel =
  | 'packaging_and_label'
  | 'open_carton_visual'
  | 'full_piece_by_piece'
  | 'concealed_inspection_deferred';

export type MaterialGateType =
  | 'pre_start_required'
  | 'phase_required'
  | 'deferred_template'
  | 'nonblocking_consumable';

export type NotificationType =
  | 'delivery_delayed'
  | 'revised_eta_missed'
  | 'project_start_blocked'
  | 'blocking_claim_opened'
  | 'blocking_claim_overdue'
  | 'urgent_request_submitted'
  | 'urgent_request_unfulfilled'
  | 'readiness_eligible'
  | 'readiness_revoked'
  | 'concealed_inspection_deadline'
  | 'storage_noncompliance';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrganizationRow = {
  id: string;
  name: string;
  timezone: string;
  readiness_rules: Json;
  high_end_material_rules: Json;
  allow_approved_deferred_template_exceptions: boolean;
  created_at: string;
  updated_at: string;
}

export type ProfileRow = {
  id: string;
  organization_id: string;
  full_name: string;
  role: AppRole;
  phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProjectRow = {
  id: string;
  organization_id: string;
  project_number: string;
  client_name: string;
  project_address: string;
  project_manager_id: string | null;
  planned_start_date: string | null;
  actual_start_date: string | null;
  planned_completion_date: string | null;
  priority: 'normal' | 'high' | 'critical';
  status: ProjectStatus;
  scope_summary: string | null;
  notes: string | null;
  readiness_approved: boolean;
  readiness_approved_by: string | null;
  readiness_approved_at: string | null;
  remodel_type: string;
  current_design_revision_id: string | null;
  selection_register_status: 'not_started' | 'in_progress' | 'approved' | 'revision_required';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type ProjectMaterialRow = {
  id: string;
  organization_id: string;
  project_id: string;
  name: string;
  sku: string | null;
  upc: string | null;
  category: string | null;
  trade: string | null;
  vendor: string | null;
  required: boolean;
  required_quantity: number;
  ordered_quantity: number;
  received_quantity: number;
  usable_quantity: number;
  damaged_quantity: number;
  rejected_quantity: number;
  unit: string;
  status: MaterialStatus;
  expected_delivery_date: string | null;
  staged: boolean;
  latest_inspection_passed: boolean;
  latest_bol_verified: boolean;
  gate_type: MaterialGateType;
  gate_phase: string | null;
  installation_phase: string | null;
  manufacturer: string | null;
  model_number: string | null;
  finish_name: string | null;
  dimensions: string | null;
  handedness: string | null;
  selection_id: string | null;
  design_revision_id: string | null;
  selection_required: boolean;
  purchase_order_verification_required: boolean;
  packing_slip_verification_required: boolean;
  design_revision_verification_required: boolean;
  specification_verification_required: boolean;
  identity_verification_required: boolean;
  lot_verification_required: boolean;
  package_verification_required: boolean;
  storage_verification_required: boolean;
  latest_purchase_order_verified: boolean;
  latest_packing_slip_verified: boolean;
  latest_design_revision_verified: boolean;
  latest_specification_verified: boolean;
  latest_identity_verified: boolean;
  latest_lot_compatibility_verified: boolean;
  latest_package_complete_verified: boolean;
  latest_storage_compliant: boolean;
  concealed_inspection_open: boolean;
  concealed_damage_notice_deadline: string | null;
  deferred_exception_approved: boolean;
  deferred_predecessor_milestone: string | null;
  deferred_template_target_date: string | null;
  deferred_fabrication_lead_days: number | null;
  deferred_exception_reason: string | null;
  deferred_exception_approved_by: string | null;
  deferred_exception_approved_at: string | null;
  high_value: boolean;
  long_lead: boolean;
  critical_path: boolean;
  required_on_site_date: string | null;
  current_storage_location_id: string | null;
  created_at: string;
  updated_at: string;
}

export type ReceivingInspectionInsert = {
  organization_id: string;
  project_id: string;
  delivery_id?: string | null;
  project_material_id: string;
  bol_number: string;
  bol_verified: boolean;
  driver_name?: string | null;
  packaging_condition?: string | null;
  received_quantity: number;
  damaged_quantity: number;
  rejected_quantity: number;
  short_quantity: number;
  inspection_passed: boolean;
  driver_acknowledged_exception?: boolean;
  signed_with_exception?: boolean;
  warehouse_zone?: string | null;
  warehouse_rack?: string | null;
  warehouse_bin?: string | null;
  notes?: string | null;
  idempotency_key?: string | null;
  purchase_order_verified?: boolean;
  packing_slip_verified?: boolean;
  design_revision_verified?: boolean;
  specification_verified?: boolean;
  identity_verified?: boolean;
  lot_compatibility_verified?: boolean;
  package_complete_verified?: boolean;
  packaging_intact?: boolean;
  storage_compliant?: boolean;
  inspection_level?: InspectionLevel;
  concealed_inspection_deferred?: boolean;
  concealed_inspection_reason?: string | null;
  concealed_damage_notice_deadline?: string | null;
  driver_acknowledgment_status?: 'not_applicable' | 'acknowledged' | 'refused' | 'driver_unavailable';
  machine_suggested_values?: Json;
  human_confirmed_values?: Json;
  override_reason?: string | null;
}

export type DamageClaimRow = {
  id: string;
  organization_id: string;
  project_id: string;
  project_material_id: string | null;
  delivery_id: string | null;
  receiving_inspection_id: string | null;
  claim_number: string;
  claim_type: ClaimType;
  status: ClaimStatus;
  blocking: boolean;
  vendor: string | null;
  carrier: string | null;
  owner_id: string | null;
  description: string;
  requested_resolution: string | null;
  vendor_reference: string | null;
  opened_at: string;
  response_due_date: string | null;
  notice_deadline: string | null;
  replacement_eta: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ReadinessSummaryRow = {
  project_id: string;
  organization_id: string;
  project_number: string;
  client_name: string;
  planned_start_date: string | null;
  readiness_approved: boolean;
  current_design_revision_id: string | null;
  required_material_lines: number;
  complete_material_lines: number;
  high_end_verified_lines: number;
  staged_required_lines: number;
  approved_deferred_template_lines: number;
  invalid_deferred_template_lines: number;
  required_selections: number;
  approved_current_selections: number;
  open_blocking_claims: number;
  required_checklist_items: number;
  complete_checklist_items: number;
  preapproval_ready: boolean;
}

export type NotificationInsert = {
  organization_id: string;
  recipient_id: string;
  project_id?: string | null;
  notification_type: NotificationType;
  title: string;
  body: string;
  severity?: 'info' | 'warning' | 'critical';
  entity_type?: string | null;
  entity_id?: string | null;
  action_url?: string | null;
  dedupe_key: string;
}

export type AuditLogInsert = {
  organization_id: string;
  actor_id: string | null;
  project_id?: string | null;
  entity_type: string;
  entity_id?: string | null;
  action: string;
  old_values?: Json;
  new_values?: Json;
  metadata?: Json;
}

export type DeliveryRow = {
  id: string;
  organization_id: string;
  project_id: string;
  vendor: string;
  carrier: string | null;
  purchase_order_number: string | null;
  bol_number: string | null;
  scheduled_date: string;
  actual_arrival_at: string | null;
  completed_at: string | null;
  status: DeliveryStatus;
  delay_reason: string | null;
  revised_eta: string | null;
  created_at: string;
  updated_at: string;
}

export type MaterialRequestRow = {
  id: string;
  organization_id: string;
  project_id: string;
  requested_by: string;
  source: 'warehouse' | 'home_depot' | 'lowes' | 'supply_house' | 'other_vendor';
  priority: 'normal' | 'urgent' | 'emergency';
  needed_by: string;
  reason: string;
  status: RequestStatus;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ReadinessChecklistRow = {
  id: string;
  organization_id: string;
  project_id: string;
  checklist_key: string;
  label: string;
  required: boolean;
  completed: boolean;
  completed_by: string | null;
  completed_at: string | null;
  notes: string | null;
}

export type DocumentRow = {
  id: string;
  organization_id: string;
  project_id: string | null;
  delivery_id: string | null;
  project_material_id: string | null;
  receiving_inspection_id: string | null;
  claim_id: string | null;
  document_type: string;
  storage_bucket: string;
  storage_path: string;
  caption: string | null;
  captured_at: string;
  created_at: string;
}

export type DocumentInsert = {
  organization_id: string;
  project_id?: string | null;
  delivery_id?: string | null;
  project_material_id?: string | null;
  receiving_inspection_id?: string | null;
  claim_id?: string | null;
  document_type: string;
  storage_bucket?: string;
  storage_path: string;
  caption?: string | null;
}

export type WarehouseInventoryRow = {
  id: string;
  organization_id: string;
  name: string;
  sku: string | null;
  unit: string;
  on_hand_quantity: number;
  committed_quantity: number;
  reorder_point: number;
  reorder_quantity: number;
  warehouse_zone: string | null;
  active: boolean;
}

export type ProjectSelectionRow = {
  id: string;
  organization_id: string;
  project_id: string;
  selection_reference: string;
  category: string;
  name: string;
  manufacturer: string | null;
  model_number: string | null;
  finish_name: string | null;
  status: SelectionStatus;
  required: boolean;
  design_revision_id: string;
}

type GenericTable<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      organizations: GenericTable<OrganizationRow>;
      profiles: GenericTable<ProfileRow>;
      projects: GenericTable<ProjectRow>;
      project_materials: GenericTable<ProjectMaterialRow>;
      damage_claims: GenericTable<DamageClaimRow>;
      deliveries: GenericTable<DeliveryRow>;
      material_requests: GenericTable<MaterialRequestRow>;
      project_readiness_checklist: GenericTable<ReadinessChecklistRow>;
      documents: GenericTable<DocumentRow, DocumentInsert>;
      warehouse_inventory: GenericTable<WarehouseInventoryRow>;
      project_selections: GenericTable<ProjectSelectionRow>;
      receiving_inspections: GenericTable<ReceivingInspectionInsert & { id: string; created_at: string }, ReceivingInspectionInsert>;
      notifications: GenericTable<NotificationInsert & { id: string; read_at: string | null; created_at: string }, NotificationInsert>;
      audit_log: GenericTable<AuditLogInsert & { id: number; occurred_at: string }, AuditLogInsert>;
    };
    Views: {
      project_readiness_summary: { Row: ReadinessSummaryRow; Relationships: [] };
    };
    Functions: {
      approve_project_readiness: { Args: { p_project_id: string }; Returns: undefined };
      current_org_id: { Args: Record<string, never>; Returns: string };
      current_app_role: { Args: Record<string, never>; Returns: AppRole };
    };
    Enums: {
      app_role: AppRole;
      project_status: ProjectStatus;
      material_status: MaterialStatus;
      delivery_status: DeliveryStatus;
      claim_status: ClaimStatus;
      claim_type: ClaimType;
    };
  };
}
