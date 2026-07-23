-- High-End Kitchen & Bathroom Material-Control Extension
-- Apply after database/schema.sql.
-- This is a production-oriented starter. Validate through ordered Supabase migrations,
-- database tests, and a fresh local environment before deployment.

-- ---------- ENUMS ----------
create type public.selection_status as enum (
  'draft',
  'pending_client_approval',
  'pending_designer_approval',
  'approved',
  'superseded',
  'rejected'
);

create type public.inspection_level as enum (
  'packaging_and_label',
  'open_carton_visual',
  'full_piece_by_piece',
  'concealed_inspection_deferred'
);

create type public.material_unit_status as enum (
  'expected',
  'received_hold',
  'accepted',
  'damaged',
  'rejected',
  'returned',
  'staged',
  'issued_to_field',
  'installed',
  'missing'
);

create type public.project_material_movement_type as enum (
  'receipt',
  'location_transfer',
  'stage',
  'unstage',
  'issue_to_field',
  'return_from_field',
  'vendor_return',
  'damage_hold',
  'release_hold',
  'surplus_transfer',
  'missing_adjustment'
);

create type public.loadout_status as enum (
  'draft',
  'ready_for_pick',
  'loading',
  'dispatched',
  'acknowledged',
  'exception',
  'returned',
  'cancelled'
);

create type public.material_gate_type as enum (
  'pre_start_required',
  'phase_required',
  'deferred_template',
  'nonblocking_consumable'
);

alter type public.claim_type add value if not exists 'wrong_finish';
alter type public.claim_type add value if not exists 'lot_mismatch';
alter type public.claim_type add value if not exists 'packaging_damage';
alter type public.claim_type add value if not exists 'storage_noncompliance';
alter type public.claim_type add value if not exists 'design_revision_mismatch';
alter type public.claim_type add value if not exists 'missing_accessory';

-- ---------- ORGANIZATION / PROJECT SETTINGS ----------
alter table public.organizations
  add column if not exists allow_approved_deferred_template_exceptions boolean not null default false,
  add column if not exists high_end_material_rules jsonb not null default jsonb_build_object(
    'default_whole_project_gate', true,
    'allow_phase_readiness_view', true,
    'require_current_design_revision', true,
    'require_approved_selections', true,
    'require_specification_verification', true,
    'require_storage_compliance', true,
    'require_loadout_plan', true,
    'ai_verification_requires_human_confirmation', true
  );

alter table public.projects
  add column if not exists remodel_type text not null default 'high_end_kitchen',
  add column if not exists current_design_revision_id uuid,
  add column if not exists selection_register_status text not null default 'in_progress'
    check (selection_register_status in ('not_started','in_progress','approved','revision_required'));

create table public.project_areas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  area_type text,
  sequence_no integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, name)
);
create index project_areas_project_idx on public.project_areas(project_id);

create table public.project_design_revisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  revision_code text not null,
  title text,
  issued_at timestamptz not null,
  approved_at timestamptz,
  approved_by uuid references public.profiles(id),
  is_current boolean not null default false,
  source_document_path text,
  notes text,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, revision_code)
);
create unique index one_current_design_revision_per_project
  on public.project_design_revisions(project_id)
  where is_current;

alter table public.projects
  add constraint projects_current_design_revision_fk
  foreign key (current_design_revision_id)
  references public.project_design_revisions(id)
  on delete set null;

create table public.project_selections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  project_area_id uuid references public.project_areas(id) on delete set null,
  design_revision_id uuid not null references public.project_design_revisions(id) on delete restrict,
  selection_reference text not null,
  category text not null,
  name text not null,
  manufacturer text,
  collection_series text,
  model_number text,
  finish_name text,
  color_code text,
  sheen_or_temperature text,
  dimensions text,
  handedness text,
  configuration text,
  status public.selection_status not null default 'draft',
  required boolean not null default true,
  substitution_allowed boolean not null default false,
  substitution_requirements text,
  client_approved_at timestamptz,
  client_approval_reference text,
  designer_approved_at timestamptz,
  designer_approved_by uuid references public.profiles(id),
  supersedes_selection_id uuid references public.project_selections(id) on delete set null,
  notes text,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, selection_reference, design_revision_id)
);
create index project_selections_project_idx on public.project_selections(project_id);
create index project_selections_status_idx on public.project_selections(status);
create index project_selections_model_idx on public.project_selections(organization_id, manufacturer, model_number);

-- ---------- STORAGE LOCATIONS ----------
create table public.storage_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text not null,
  name text not null,
  zone text,
  rack text,
  bin text,
  location_type text not null default 'general'
    check (location_type in ('general','climate_controlled','padded_bay','a_frame','flat_storage','secure_cage','keep_dry','oversize','chemical_control','project_staging','quarantine')),
  climate_controlled boolean not null default false,
  padded boolean not null default false,
  upright_supported boolean not null default false,
  flat_storage_supported boolean not null default false,
  no_stack_enforced boolean not null default false,
  secure_access boolean not null default false,
  keep_dry boolean not null default true,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, code)
);
create index storage_locations_org_idx on public.storage_locations(organization_id);

-- ---------- HIGH-END MATERIAL FIELDS ----------
alter table public.material_catalog
  add column if not exists collection_series text,
  add column if not exists model_number text,
  add column if not exists default_finish text,
  add column if not exists default_dimensions text,
  add column if not exists default_handling_requirements text,
  add column if not exists default_inspection_template_key text,
  add column if not exists serial_tracking_default boolean not null default false;

alter table public.project_materials
  add column if not exists project_area_id uuid references public.project_areas(id) on delete set null,
  add column if not exists selection_id uuid references public.project_selections(id) on delete set null,
  add column if not exists design_revision_id uuid references public.project_design_revisions(id) on delete set null,
  add column if not exists installation_phase text,
  add column if not exists gate_type public.material_gate_type not null default 'pre_start_required',
  add column if not exists gate_phase text,
  add column if not exists deferred_predecessor_milestone text,
  add column if not exists deferred_template_target_date date,
  add column if not exists deferred_fabrication_lead_days integer check (deferred_fabrication_lead_days is null or deferred_fabrication_lead_days >= 0),
  add column if not exists deferred_exception_approved boolean not null default false,
  add column if not exists deferred_exception_reason text,
  add column if not exists deferred_exception_approved_by uuid references public.profiles(id),
  add column if not exists deferred_exception_approved_at timestamptz,
  add column if not exists required_on_site_date date,
  add column if not exists manufacturer text,
  add column if not exists collection_series text,
  add column if not exists model_number text,
  add column if not exists finish_name text,
  add column if not exists color_code text,
  add column if not exists sheen_or_temperature text,
  add column if not exists dimensions text,
  add column if not exists handedness text,
  add column if not exists configuration text,
  add column if not exists material_class text,
  add column if not exists selection_required boolean not null default true,
  add column if not exists purchase_order_verification_required boolean not null default true,
  add column if not exists packing_slip_verification_required boolean not null default true,
  add column if not exists design_revision_verification_required boolean not null default true,
  add column if not exists specification_verification_required boolean not null default true,
  add column if not exists identity_verification_required boolean not null default false,
  add column if not exists lot_verification_required boolean not null default false,
  add column if not exists package_verification_required boolean not null default false,
  add column if not exists storage_verification_required boolean not null default true,
  add column if not exists latest_purchase_order_verified boolean not null default false,
  add column if not exists latest_packing_slip_verified boolean not null default false,
  add column if not exists latest_design_revision_verified boolean not null default false,
  add column if not exists latest_specification_verified boolean not null default false,
  add column if not exists latest_identity_verified boolean not null default false,
  add column if not exists latest_lot_compatibility_verified boolean not null default false,
  add column if not exists latest_package_complete_verified boolean not null default false,
  add column if not exists latest_storage_compliant boolean not null default false,
  add column if not exists concealed_inspection_open boolean not null default false,
  add column if not exists concealed_damage_notice_deadline date,
  add column if not exists handling_requirements text,
  add column if not exists current_storage_location_id uuid references public.storage_locations(id) on delete set null,
  add column if not exists long_lead boolean not null default false,
  add column if not exists critical_path boolean not null default false,
  add column if not exists high_value boolean not null default false,
  add column if not exists budgeted_unit_cost numeric(12,2) check (budgeted_unit_cost is null or budgeted_unit_cost >= 0),
  add column if not exists actual_unit_cost numeric(12,2) check (actual_unit_cost is null or actual_unit_cost >= 0),
  add column if not exists freight_cost numeric(12,2) check (freight_cost is null or freight_cost >= 0),
  add column if not exists replacement_value numeric(12,2) check (replacement_value is null or replacement_value >= 0),
  add column if not exists order_release_date date,
  add column if not exists vendor_acknowledged_at timestamptz,
  add column if not exists promised_date date,
  add column if not exists revised_eta timestamptz,
  add column if not exists returnable boolean,
  add column if not exists restocking_percent numeric(5,2) check (restocking_percent is null or restocking_percent between 0 and 100),
  add column if not exists substitution_approval_reference text;

create index project_materials_area_idx on public.project_materials(project_area_id);
create index project_materials_selection_idx on public.project_materials(selection_id);
create index project_materials_design_revision_idx on public.project_materials(design_revision_id);
create index project_materials_required_on_site_idx on public.project_materials(required_on_site_date);
create index project_materials_gate_type_idx on public.project_materials(project_id, gate_type);
create index project_materials_model_finish_idx on public.project_materials(organization_id, manufacturer, model_number, finish_name);

-- Unique or individually controlled cabinets, cartons, slabs, appliances, glass pieces, and fixtures.
create table public.material_units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  project_material_id uuid not null references public.project_materials(id) on delete cascade,
  project_area_id uuid references public.project_areas(id) on delete set null,
  unit_identifier text,
  barcode_value text,
  cabinet_tag text,
  room_elevation text,
  carton_number text,
  lot_number text,
  dye_lot text,
  shade text,
  caliber text,
  bundle_number text,
  slab_number text,
  manufacturer_serial_number text,
  glass_fabrication_id text,
  manufacturer text,
  model_number text,
  finish_name text,
  dimensions text,
  handedness text,
  status public.material_unit_status not null default 'expected',
  accepted boolean not null default false,
  condition_notes text,
  storage_location_id uuid references public.storage_locations(id) on delete set null,
  received_inspection_id uuid references public.receiving_inspections(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index material_units_material_idx on public.material_units(project_material_id);
create index material_units_project_idx on public.material_units(project_id);
create index material_units_identity_idx on public.material_units(organization_id, unit_identifier);
create unique index material_units_unique_serial
  on public.material_units(organization_id, manufacturer_serial_number)
  where manufacturer_serial_number is not null;
create unique index material_units_unique_cabinet_tag
  on public.material_units(project_id, cabinet_tag)
  where cabinet_tag is not null;
create unique index material_units_unique_slab
  on public.material_units(project_id, bundle_number, slab_number)
  where slab_number is not null;

-- Package/dependency relationships such as cabinet accessories or plumbing rough/trim compatibility.
create table public.project_material_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  parent_material_id uuid not null references public.project_materials(id) on delete cascade,
  dependent_material_id uuid not null references public.project_materials(id) on delete cascade,
  relationship_type text not null
    check (relationship_type in ('required_accessory','compatible_rough_in','compatible_trim','installation_kit','package_component','same_lot_group','same_finish_group','other')),
  required boolean not null default true,
  verified boolean not null default false,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (parent_material_id <> dependent_material_id),
  unique(parent_material_id, dependent_material_id, relationship_type)
);
create index material_dependencies_project_idx on public.project_material_dependencies(project_id);

-- ---------- RECEIVING EXTENSION ----------
alter table public.deliveries
  add column if not exists packing_slip_number text,
  add column if not exists design_revision_id uuid references public.project_design_revisions(id) on delete set null,
  add column if not exists required_storage_summary text;

alter table public.receiving_inspections
  add column if not exists idempotency_key text,
  add column if not exists purchase_order_verified boolean not null default false,
  add column if not exists packing_slip_verified boolean not null default false,
  add column if not exists design_revision_verified boolean not null default false,
  add column if not exists specification_verified boolean not null default false,
  add column if not exists identity_verified boolean not null default false,
  add column if not exists lot_compatibility_verified boolean not null default false,
  add column if not exists package_complete_verified boolean not null default false,
  add column if not exists packaging_intact boolean not null default true,
  add column if not exists storage_compliant boolean not null default false,
  add column if not exists inspection_level public.inspection_level not null default 'packaging_and_label',
  add column if not exists concealed_inspection_deferred boolean not null default false,
  add column if not exists concealed_inspection_reason text,
  add column if not exists concealed_damage_notice_deadline date,
  add column if not exists final_inspection_owner_id uuid references public.profiles(id),
  add column if not exists driver_acknowledgment_status text not null default 'not_applicable'
    check (driver_acknowledgment_status in ('not_applicable','acknowledged','refused','driver_unavailable')),
  add column if not exists machine_suggested_values jsonb not null default '{}'::jsonb,
  add column if not exists human_confirmed_values jsonb not null default '{}'::jsonb,
  add column if not exists override_reason text;

create unique index receiving_inspections_idempotency_idx
  on public.receiving_inspections(organization_id, idempotency_key)
  where idempotency_key is not null;
create index receiving_concealed_deadline_idx
  on public.receiving_inspections(concealed_damage_notice_deadline)
  where concealed_inspection_deferred;

alter table public.documents
  drop constraint if exists documents_document_type_check;

alter table public.documents
  add column if not exists selection_id uuid references public.project_selections(id) on delete cascade,
  add column if not exists material_unit_id uuid references public.material_units(id) on delete cascade,
  add constraint documents_document_type_check check (
    document_type in (
      'material_photo','approved_selection_photo','label_photo','finish_comparison_photo','damage_photo',
      'bol','delivery_ticket','packing_slip','purchase_order','receipt','claim_document','signature',
      'cut_sheet','shop_drawing','design_revision','warranty','installation_instruction','loadout_manifest','other'
    )
  );

alter table public.damage_claims
  add column if not exists material_unit_id uuid references public.material_units(id) on delete set null,
  add column if not exists notice_deadline date,
  add column if not exists responsible_party text,
  add column if not exists schedule_impact_days integer check (schedule_impact_days is null or schedule_impact_days >= 0),
  add column if not exists replacement_value numeric(12,2) check (replacement_value is null or replacement_value >= 0),
  add column if not exists rush_cost numeric(12,2) check (rush_cost is null or rush_cost >= 0),
  add column if not exists restocking_cost numeric(12,2) check (restocking_cost is null or restocking_cost >= 0),
  add column if not exists recovery_amount numeric(12,2) check (recovery_amount is null or recovery_amount >= 0),
  add column if not exists affected_design_revision_id uuid references public.project_design_revisions(id) on delete set null;
create index damage_claims_notice_deadline_idx on public.damage_claims(notice_deadline)
  where status not in ('resolved','closed','denied');

alter table public.material_requests
  add column if not exists project_area_id uuid references public.project_areas(id) on delete set null,
  add column if not exists installation_phase text,
  add column if not exists gate_type public.material_gate_type not null default 'pre_start_required',
  add column if not exists gate_phase text,
  add column if not exists deferred_predecessor_milestone text,
  add column if not exists deferred_template_target_date date,
  add column if not exists deferred_fabrication_lead_days integer check (deferred_fabrication_lead_days is null or deferred_fabrication_lead_days >= 0),
  add column if not exists deferred_exception_approved boolean not null default false,
  add column if not exists deferred_exception_reason text,
  add column if not exists deferred_exception_approved_by uuid references public.profiles(id),
  add column if not exists deferred_exception_approved_at timestamptz,
  add column if not exists request_type text not null default 'field_condition'
    check (request_type in ('field_condition','missing_accessory','approved_design_change','damage_replacement','owner_upgrade','punch_item','consumable','emergency','other')),
  add column if not exists change_order_reference text,
  add column if not exists schedule_impact text;

-- ---------- MOVEMENT, STAGING, AND LOADOUT ----------
create table public.project_material_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  project_material_id uuid not null references public.project_materials(id) on delete cascade,
  material_unit_id uuid references public.material_units(id) on delete cascade,
  movement_type public.project_material_movement_type not null,
  quantity numeric(14,3) not null check (quantity > 0),
  from_location_id uuid references public.storage_locations(id) on delete set null,
  to_location_id uuid references public.storage_locations(id) on delete set null,
  condition_at_movement text,
  reference text,
  notes text,
  performed_by uuid not null default auth.uid() references public.profiles(id),
  performed_at timestamptz not null default now()
);
create index project_material_movements_project_idx on public.project_material_movements(project_id, performed_at desc);
create index project_material_movements_material_idx on public.project_material_movements(project_material_id, performed_at desc);

create table public.field_loadouts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  project_area_id uuid references public.project_areas(id) on delete set null,
  installation_phase text,
  loadout_number text not null,
  status public.loadout_status not null default 'draft',
  scheduled_at timestamptz,
  dispatched_at timestamptz,
  vehicle text,
  driver_name text,
  installer_company text,
  installer_name text,
  installer_phone text,
  acknowledged_at timestamptz,
  acknowledged_by_name text,
  exception_notes text,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, loadout_number)
);
create index field_loadouts_project_idx on public.field_loadouts(project_id);

create table public.field_loadout_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  field_loadout_id uuid not null references public.field_loadouts(id) on delete cascade,
  project_material_id uuid not null references public.project_materials(id) on delete restrict,
  material_unit_id uuid references public.material_units(id) on delete restrict,
  planned_quantity numeric(14,3) not null check (planned_quantity > 0),
  loaded_quantity numeric(14,3) not null default 0 check (loaded_quantity >= 0),
  acknowledged_quantity numeric(14,3) not null default 0 check (acknowledged_quantity >= 0),
  condition_at_loadout text,
  exception_notes text,
  created_at timestamptz not null default now(),
  check (loaded_quantity <= planned_quantity),
  check (acknowledged_quantity <= loaded_quantity)
);
create index field_loadout_items_loadout_idx on public.field_loadout_items(field_loadout_id);

alter table public.documents
  add column if not exists field_loadout_id uuid references public.field_loadouts(id) on delete cascade;

-- ---------- DEFERRED-TEMPLATE APPROVAL CONTROL ----------
create or replace function public.validate_deferred_template_exception()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.gate_type = 'deferred_template' and new.deferred_exception_approved then
    if not exists (
      select 1 from public.organizations o
      where o.id = new.organization_id
        and o.allow_approved_deferred_template_exceptions
    ) then
      raise exception 'Organization policy does not allow deferred-template exceptions';
    end if;

    if new.deferred_predecessor_milestone is null
       or new.deferred_template_target_date is null
       or new.deferred_fabrication_lead_days is null
       or new.required_on_site_date is null
       or new.gate_phase is null
       or new.deferred_exception_reason is null
    then
      raise exception 'Deferred-template exception requires predecessor milestone, phase, template date, fabrication lead, required-on-site date, and reason';
    end if;

    if tg_op = 'INSERT' or not old.deferred_exception_approved then
      if public.current_app_role() not in ('admin','warehouse_manager') then
        raise exception 'Only an administrator or warehouse manager can approve a deferred-template exception';
      end if;
      new.deferred_exception_approved_by := auth.uid();
      new.deferred_exception_approved_at := now();
    elsif old.deferred_exception_approved then
      new.deferred_exception_approved_by := old.deferred_exception_approved_by;
      new.deferred_exception_approved_at := old.deferred_exception_approved_at;
    end if;
  elsif new.gate_type <> 'deferred_template' then
    new.deferred_exception_approved := false;
    new.deferred_exception_reason := null;
    new.deferred_exception_approved_by := null;
    new.deferred_exception_approved_at := null;
  end if;

  return new;
end;
$$;

create trigger project_material_validate_deferred_template
  before insert or update on public.project_materials
  for each row execute function public.validate_deferred_template_exception();

-- ---------- HIGH-END RECEIVING BUSINESS LOGIC ----------
create or replace function public.apply_receiving_inspection()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_material public.project_materials%rowtype;
  v_accepted_qty numeric(14,3);
  v_rows integer;
begin
  select * into v_material
  from public.project_materials
  where id = new.project_material_id
    and project_id = new.project_id
    and organization_id = new.organization_id
  for update;

  if v_material.id is null then
    raise exception 'Receiving inspection material, project, or organization mismatch';
  end if;

  if new.concealed_inspection_deferred and new.concealed_damage_notice_deadline is null then
    raise exception 'A concealed-damage notice deadline is required when inspection is deferred';
  end if;

  v_accepted_qty := case
    when new.inspection_passed
      and new.bol_verified
      and (not v_material.purchase_order_verification_required or new.purchase_order_verified)
      and (not v_material.packing_slip_verification_required or new.packing_slip_verified)
      and (not v_material.design_revision_verification_required or new.design_revision_verified)
      and (not v_material.specification_verification_required or new.specification_verified)
      and (not v_material.identity_verification_required or new.identity_verified)
      and (not v_material.lot_verification_required or new.lot_compatibility_verified)
      and (not v_material.package_verification_required or new.package_complete_verified)
    then greatest(new.received_quantity - new.damaged_quantity - new.rejected_quantity, 0)
    else 0
  end;

  update public.project_materials
  set
    received_quantity = received_quantity + new.received_quantity,
    usable_quantity = usable_quantity + v_accepted_qty,
    damaged_quantity = damaged_quantity + new.damaged_quantity,
    rejected_quantity = rejected_quantity + new.rejected_quantity,
    latest_inspection_passed = new.inspection_passed,
    latest_bol_verified = new.bol_verified,
    latest_purchase_order_verified = new.purchase_order_verified,
    latest_packing_slip_verified = new.packing_slip_verified,
    latest_design_revision_verified = new.design_revision_verified,
    latest_specification_verified = new.specification_verified,
    latest_identity_verified = new.identity_verified,
    latest_lot_compatibility_verified = new.lot_compatibility_verified,
    latest_package_complete_verified = new.package_complete_verified,
    latest_storage_compliant = new.storage_compliant,
    concealed_inspection_open = new.concealed_inspection_deferred,
    concealed_damage_notice_deadline = new.concealed_damage_notice_deadline,
    warehouse_zone = coalesce(new.warehouse_zone, warehouse_zone),
    warehouse_rack = coalesce(new.warehouse_rack, warehouse_rack),
    warehouse_bin = coalesce(new.warehouse_bin, warehouse_bin),
    status = case
      when usable_quantity + v_accepted_qty >= required_quantity then 'received'::public.material_status
      when new.damaged_quantity > 0 or new.rejected_quantity > 0 then 'damaged'::public.material_status
      when new.received_quantity > 0 then 'partial'::public.material_status
      else status
    end,
    updated_at = now()
  where id = new.project_material_id
    and organization_id = new.organization_id;

  get diagnostics v_rows = row_count;
  if v_rows <> 1 then
    raise exception 'Receiving inspection failed to update exactly one material line';
  end if;

  update public.projects
  set readiness_approved = false,
      readiness_approved_by = null,
      readiness_approved_at = null,
      status = case when status = 'ready_to_start' then 'blocked'::public.project_status else status end,
      updated_at = now()
  where id = new.project_id
    and organization_id = new.organization_id;

  return new;
end;
$$;

-- ---------- HIGH-END READINESS VIEW ----------
create or replace view public.project_readiness_summary
with (security_invoker = true)
as
with material_counts as (
  select
    pm.project_id,
    count(*) filter (
      where pm.required
        and not (
          o.allow_approved_deferred_template_exceptions
          and pm.gate_type = 'deferred_template'
          and pm.deferred_exception_approved
        )
    ) as required_material_lines,
    count(*) filter (
      where pm.required
        and not (
          o.allow_approved_deferred_template_exceptions
          and pm.gate_type = 'deferred_template'
          and pm.deferred_exception_approved
        )
        and pm.usable_quantity >= pm.required_quantity
    ) as complete_material_lines,
    count(*) filter (
      where pm.required
        and not (
          o.allow_approved_deferred_template_exceptions
          and pm.gate_type = 'deferred_template'
          and pm.deferred_exception_approved
        )
        and (not pm.selection_required or (ps.id is not null and ps.status = 'approved'))
        and (not pm.purchase_order_verification_required or pm.latest_purchase_order_verified)
        and (not pm.packing_slip_verification_required or pm.latest_packing_slip_verified)
        and (not pm.design_revision_verification_required or pm.latest_design_revision_verified)
        and (not pm.specification_verification_required or pm.latest_specification_verified)
        and (not pm.identity_verification_required or pm.latest_identity_verified)
        and (not pm.lot_verification_required or pm.latest_lot_compatibility_verified)
        and (not pm.package_verification_required or pm.latest_package_complete_verified)
        and (not pm.storage_verification_required or pm.latest_storage_compliant)
        and not pm.concealed_inspection_open
        and exists (
          select 1 from public.documents d
          where d.project_material_id = pm.id
            and d.document_type in ('material_photo','label_photo','finish_comparison_photo','approved_selection_photo')
        )
    ) as high_end_verified_lines,
    count(*) filter (
      where pm.required
        and not (
          o.allow_approved_deferred_template_exceptions
          and pm.gate_type = 'deferred_template'
          and pm.deferred_exception_approved
        )
        and pm.staged
    ) as staged_required_lines,
    count(*) filter (
      where pm.required
        and pm.gate_type = 'deferred_template'
        and pm.deferred_exception_approved
    ) as approved_deferred_template_lines,
    count(*) filter (
      where pm.required
        and pm.gate_type = 'deferred_template'
        and (
          pm.deferred_predecessor_milestone is null
          or pm.deferred_template_target_date is null
          or pm.deferred_fabrication_lead_days is null
          or pm.required_on_site_date is null
          or pm.gate_phase is null
          or pm.deferred_exception_reason is null
          or pm.deferred_exception_approved_by is null
          or pm.deferred_exception_approved_at is null
        )
    ) as invalid_deferred_template_lines
  from public.project_materials pm
  join public.organizations o on o.id = pm.organization_id
  left join public.project_selections ps on ps.id = pm.selection_id
  group by pm.project_id
),
claim_counts as (
  select
    project_id,
    count(*) filter (
      where blocking and status not in ('resolved','closed')
    ) as open_blocking_claims
  from public.damage_claims
  group by project_id
),
checklist_counts as (
  select
    project_id,
    count(*) filter (where required) as required_checklist_items,
    count(*) filter (where required and completed) as complete_checklist_items
  from public.project_readiness_checklist
  group by project_id
),
selection_counts as (
  select
    p.id as project_id,
    count(ps.id) filter (where ps.required) as required_selections,
    count(ps.id) filter (
      where ps.required
        and ps.status = 'approved'
        and ps.design_revision_id = p.current_design_revision_id
    ) as approved_current_selections
  from public.projects p
  left join public.project_selections ps on ps.project_id = p.id
  group by p.id
)
select
  p.id as project_id,
  p.organization_id,
  p.project_number,
  p.client_name,
  p.planned_start_date,
  p.readiness_approved,
  p.current_design_revision_id,
  coalesce(mc.required_material_lines, 0) as required_material_lines,
  coalesce(mc.complete_material_lines, 0) as complete_material_lines,
  coalesce(mc.high_end_verified_lines, 0) as high_end_verified_lines,
  coalesce(mc.staged_required_lines, 0) as staged_required_lines,
  coalesce(mc.approved_deferred_template_lines, 0) as approved_deferred_template_lines,
  coalesce(mc.invalid_deferred_template_lines, 0) as invalid_deferred_template_lines,
  coalesce(sc.required_selections, 0) as required_selections,
  coalesce(sc.approved_current_selections, 0) as approved_current_selections,
  coalesce(cc.open_blocking_claims, 0) as open_blocking_claims,
  coalesce(rc.required_checklist_items, 0) as required_checklist_items,
  coalesce(rc.complete_checklist_items, 0) as complete_checklist_items,
  (
    p.current_design_revision_id is not null
    and coalesce(mc.required_material_lines, 0) > 0
    and coalesce(mc.required_material_lines, 0) = coalesce(mc.complete_material_lines, 0)
    and coalesce(mc.required_material_lines, 0) = coalesce(mc.high_end_verified_lines, 0)
    and coalesce(mc.required_material_lines, 0) = coalesce(mc.staged_required_lines, 0)
    and coalesce(mc.invalid_deferred_template_lines, 0) = 0
    and coalesce(sc.required_selections, 0) = coalesce(sc.approved_current_selections, 0)
    and coalesce(cc.open_blocking_claims, 0) = 0
    and coalesce(rc.required_checklist_items, 0) > 0
    and coalesce(rc.required_checklist_items, 0) = coalesce(rc.complete_checklist_items, 0)
  ) as preapproval_ready
from public.projects p
left join material_counts mc on mc.project_id = p.id
left join claim_counts cc on cc.project_id = p.id
left join checklist_counts rc on rc.project_id = p.id
left join selection_counts sc on sc.project_id = p.id;

-- ---------- READINESS REVOCATION ----------
create or replace function public.revoke_project_readiness(p_project_id uuid, p_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.projects
  set readiness_approved = false,
      readiness_approved_by = null,
      readiness_approved_at = null,
      status = case when status = 'ready_to_start' then 'blocked'::public.project_status else status end,
      updated_at = now()
  where id = p_project_id
    and organization_id = p_organization_id;
end;
$$;

create or replace function public.revoke_readiness_from_high_end_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_project_id uuid;
  v_org_id uuid;
begin
  if tg_op = 'DELETE' then
    v_project_id := old.project_id;
    v_org_id := old.organization_id;
    perform public.revoke_project_readiness(v_project_id, v_org_id);
    return old;
  end if;

  v_project_id := new.project_id;
  v_org_id := new.organization_id;
  perform public.revoke_project_readiness(v_project_id, v_org_id);
  return new;
end;
$$;

create trigger design_revision_change_revokes_readiness
  after insert or update or delete on public.project_design_revisions
  for each row execute function public.revoke_readiness_from_high_end_change();

create trigger selection_change_revokes_readiness
  after insert or update or delete on public.project_selections
  for each row execute function public.revoke_readiness_from_high_end_change();

create or replace function public.revoke_readiness_on_material_unit_risk()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.revoke_project_readiness(old.project_id, old.organization_id);
    return old;
  end if;

  if tg_op = 'INSERT'
     or new.status in ('damaged','rejected','missing')
     or (tg_op = 'UPDATE' and old.accepted and not new.accepted)
     or (tg_op = 'UPDATE' and (
          old.manufacturer_serial_number is distinct from new.manufacturer_serial_number
          or old.cabinet_tag is distinct from new.cabinet_tag
          or old.dye_lot is distinct from new.dye_lot
          or old.bundle_number is distinct from new.bundle_number
          or old.slab_number is distinct from new.slab_number
          or old.finish_name is distinct from new.finish_name
        ))
  then
    perform public.revoke_project_readiness(new.project_id, new.organization_id);
  end if;
  return new;
end;
$$;

create trigger material_unit_risk_revokes_readiness
  after insert or update or delete on public.material_units
  for each row execute function public.revoke_readiness_on_material_unit_risk();

create trigger dependency_change_revokes_readiness
  after insert or update or delete on public.project_material_dependencies
  for each row execute function public.revoke_readiness_from_high_end_change();

create or replace function public.revoke_readiness_on_movement_risk()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.revoke_project_readiness(old.project_id, old.organization_id);
    return old;
  end if;

  if new.movement_type in ('unstage','vendor_return','damage_hold','missing_adjustment') then
    perform public.revoke_project_readiness(new.project_id, new.organization_id);
  end if;
  return new;
end;
$$;

create trigger movement_risk_revokes_readiness
  after insert or update or delete on public.project_material_movements
  for each row execute function public.revoke_readiness_on_movement_risk();

create or replace function public.revoke_readiness_on_loadout_risk()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.revoke_project_readiness(old.project_id, old.organization_id);
    return old;
  end if;

  if new.status in ('exception','cancelled') then
    perform public.revoke_project_readiness(new.project_id, new.organization_id);
  end if;
  return new;
end;
$$;

create trigger loadout_risk_revokes_readiness
  after insert or update or delete on public.field_loadouts
  for each row execute function public.revoke_readiness_on_loadout_risk();

-- Synchronize the one current design revision to the project.
create or replace function public.clear_other_current_design_revisions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_current then
    update public.project_design_revisions
    set is_current = false,
        updated_at = now()
    where project_id = new.project_id
      and id <> new.id
      and is_current;
  end if;
  return new;
end;
$$;

create trigger design_revision_clear_other_current
  before insert or update on public.project_design_revisions
  for each row execute function public.clear_other_current_design_revisions();

create or replace function public.sync_project_current_design_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_id uuid;
begin
  if tg_op = 'DELETE' then
    if old.is_current then
      select id into v_current_id
      from public.project_design_revisions
      where project_id = old.project_id and is_current
      order by issued_at desc
      limit 1;

      update public.projects
      set current_design_revision_id = v_current_id,
          selection_register_status = 'revision_required',
          updated_at = now()
      where id = old.project_id
        and organization_id = old.organization_id;
    end if;
    return old;
  end if;

  if new.is_current then
    update public.projects
    set current_design_revision_id = new.id,
        selection_register_status = 'revision_required',
        updated_at = now()
    where id = new.project_id
      and organization_id = new.organization_id;
  elsif tg_op = 'UPDATE' and old.is_current and not new.is_current then
    select id into v_current_id
    from public.project_design_revisions
    where project_id = new.project_id and is_current
    order by issued_at desc
    limit 1;

    update public.projects
    set current_design_revision_id = v_current_id,
        selection_register_status = 'revision_required',
        updated_at = now()
    where id = new.project_id
      and organization_id = new.organization_id;
  end if;
  return new;
end;
$$;

create trigger design_revision_sync_project
  after insert or update or delete on public.project_design_revisions
  for each row execute function public.sync_project_current_design_revision();

-- ---------- CHECKLIST SEED ----------
create or replace function public.seed_high_end_project_readiness_checklist()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_readiness_checklist (organization_id, project_id, checklist_key, label, required)
  values
    (new.organization_id, new.id, 'design_selections_approved', 'Current design revision and required selections approved', true),
    (new.organization_id, new.id, 'finish_lot_compatibility_verified', 'Finish, dye-lot, stone-bundle, and package compatibility verified', true),
    (new.organization_id, new.id, 'special_handling_storage_verified', 'Special handling and storage requirements verified', true),
    (new.organization_id, new.id, 'loadout_plan_complete', 'Field loadout plan and installer chain of custody prepared', true)
  on conflict (project_id, checklist_key) do nothing;
  return new;
end;
$$;

create trigger project_seed_high_end_readiness_checklist
  after insert on public.projects
  for each row execute function public.seed_high_end_project_readiness_checklist();

insert into public.project_readiness_checklist (organization_id, project_id, checklist_key, label, required)
select p.organization_id, p.id, v.checklist_key, v.label, true
from public.projects p
cross join (values
  ('design_selections_approved', 'Current design revision and required selections approved'),
  ('finish_lot_compatibility_verified', 'Finish, dye-lot, stone-bundle, and package compatibility verified'),
  ('special_handling_storage_verified', 'Special handling and storage requirements verified'),
  ('loadout_plan_complete', 'Field loadout plan and installer chain of custody prepared')
) as v(checklist_key, label)
on conflict (project_id, checklist_key) do nothing;

-- ---------- UPDATED_AT TRIGGERS ----------
do $$
declare
  t text;
begin
  foreach t in array array[
    'project_areas','project_design_revisions','project_selections','storage_locations',
    'material_units','project_material_dependencies','field_loadouts'
  ] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ---------- RLS ----------
alter table public.project_areas enable row level security;
alter table public.project_design_revisions enable row level security;
alter table public.project_selections enable row level security;
alter table public.storage_locations enable row level security;
alter table public.material_units enable row level security;
alter table public.project_material_dependencies enable row level security;
alter table public.project_material_movements enable row level security;
alter table public.field_loadouts enable row level security;
alter table public.field_loadout_items enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'project_areas','project_design_revisions','project_selections','storage_locations',
    'material_units','project_material_dependencies','project_material_movements',
    'field_loadouts','field_loadout_items'
  ] loop
    execute format('create policy %I_select_org on public.%I for select using (organization_id = public.current_org_id())', t, t);
    execute format('create policy %I_insert_org on public.%I for insert with check (organization_id = public.current_org_id() and public.is_write_role())', t, t);
    execute format('create policy %I_update_org on public.%I for update using (organization_id = public.current_org_id() and public.is_write_role()) with check (organization_id = public.current_org_id() and public.is_write_role())', t, t);
    execute format('create policy %I_delete_org on public.%I for delete using (organization_id = public.current_org_id() and public.current_app_role() in (''admin'',''warehouse_manager''))', t, t);
  end loop;
end $$;

-- ---------- GRANTS ----------
grant select, insert, update, delete on public.project_areas to authenticated;
grant select, insert, update, delete on public.project_design_revisions to authenticated;
grant select, insert, update, delete on public.project_selections to authenticated;
grant select, insert, update, delete on public.storage_locations to authenticated;
grant select, insert, update, delete on public.material_units to authenticated;
grant select, insert, update, delete on public.project_material_dependencies to authenticated;
grant select, insert, update, delete on public.project_material_movements to authenticated;
grant select, insert, update, delete on public.field_loadouts to authenticated;
grant select, insert, update, delete on public.field_loadout_items to authenticated;
grant execute on function public.revoke_project_readiness(uuid, uuid) to authenticated;

-- The production implementation must add automated database tests for every RLS policy,
-- readiness condition, material-unit identity constraint, and idempotent receiving operation.
