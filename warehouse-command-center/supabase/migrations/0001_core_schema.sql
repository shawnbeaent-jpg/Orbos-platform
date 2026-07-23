-- Warehouse Command Center
-- Supabase/PostgreSQL production schema starter
-- Review in a development Supabase project before production deployment.

create extension if not exists pgcrypto;

-- ---------- ENUMS ----------
create type public.app_role as enum (
  'admin',
  'warehouse_manager',
  'project_manager',
  'receiver',
  'purchasing',
  'executive_readonly'
);

create type public.project_status as enum (
  'draft',
  'materials_in_progress',
  'blocked',
  'ready_to_start',
  'active',
  'complete',
  'cancelled'
);

create type public.material_status as enum (
  'draft',
  'requested',
  'ordered',
  'in_transit',
  'partial',
  'received',
  'damaged',
  'delayed',
  'cancelled'
);

create type public.delivery_status as enum (
  'draft',
  'scheduled',
  'in_transit',
  'arrived',
  'partial',
  'received',
  'delayed',
  'rejected',
  'cancelled'
);

create type public.request_status as enum (
  'draft',
  'pending',
  'approved',
  'rejected',
  'purchased',
  'fulfilled',
  'cancelled'
);

create type public.claim_status as enum (
  'draft',
  'open',
  'vendor_acknowledged',
  'replacement_scheduled',
  'credit_pending',
  'resolved',
  'closed',
  'denied'
);

create type public.claim_type as enum (
  'damage',
  'shortage',
  'wrong_item',
  'quality_defect',
  'concealed_damage',
  'bol_discrepancy'
);

create type public.inventory_txn_type as enum (
  'receipt',
  'commitment',
  'release_commitment',
  'issue_to_project',
  'return_from_project',
  'adjustment',
  'damage_writeoff'
);

-- ---------- COMMON FUNCTIONS ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- ORGANIZATIONS / USERS ----------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'America/New_York',
  address text,
  phone text,
  readiness_rules jsonb not null default jsonb_build_object(
    'require_all_usable_quantities', true,
    'require_no_blocking_claims', true,
    'require_receiving_photos', true,
    'require_bol_verification', true,
    'require_warehouse_staging', true,
    'require_pm_final_review', true
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  full_name text not null,
  role public.app_role not null,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_org_idx on public.profiles(organization_id);

create or replace function public.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.profiles where id = auth.uid() and active = true
$$;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and active = true
$$;

create or replace function public.is_write_role()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('admin','warehouse_manager','project_manager','receiver','purchasing'), false)
$$;

create or replace function public.is_admin_or_warehouse_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('admin','warehouse_manager'), false)
$$;

-- ---------- PROJECTS ----------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_number text not null,
  client_name text not null,
  project_address text not null,
  project_manager_id uuid references public.profiles(id),
  planned_start_date date,
  actual_start_date date,
  planned_completion_date date,
  priority text not null default 'normal' check (priority in ('normal','high','critical')),
  status public.project_status not null default 'draft',
  scope_summary text,
  notes text,
  readiness_approved boolean not null default false,
  readiness_approved_by uuid references public.profiles(id),
  readiness_approved_at timestamptz,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, project_number)
);

create index projects_org_idx on public.projects(organization_id);
create index projects_pm_idx on public.projects(project_manager_id);
create index projects_start_idx on public.projects(planned_start_date);

create table public.project_trades (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  trade_name text not null,
  company_or_crew text,
  foreman_name text,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);
create index project_trades_project_idx on public.project_trades(project_id);

-- ---------- MATERIAL CATALOG / PROJECT MATERIALS ----------
create table public.material_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  sku text,
  upc text,
  manufacturer text,
  category text,
  default_vendor text,
  unit text not null default 'EA',
  default_image_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku)
);
create index material_catalog_org_idx on public.material_catalog(organization_id);
create index material_catalog_upc_idx on public.material_catalog(upc);

create table public.project_materials (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  catalog_item_id uuid references public.material_catalog(id) on delete set null,
  name text not null,
  sku text,
  upc text,
  category text,
  trade text,
  vendor text,
  purchase_order_number text,
  required boolean not null default true,
  required_quantity numeric(14,3) not null check (required_quantity >= 0),
  ordered_quantity numeric(14,3) not null default 0 check (ordered_quantity >= 0),
  received_quantity numeric(14,3) not null default 0 check (received_quantity >= 0),
  usable_quantity numeric(14,3) not null default 0 check (usable_quantity >= 0),
  damaged_quantity numeric(14,3) not null default 0 check (damaged_quantity >= 0),
  rejected_quantity numeric(14,3) not null default 0 check (rejected_quantity >= 0),
  unit text not null default 'EA',
  status public.material_status not null default 'draft',
  expected_delivery_date date,
  warehouse_zone text,
  warehouse_rack text,
  warehouse_bin text,
  staged boolean not null default false,
  staged_at timestamptz,
  staged_by uuid references public.profiles(id),
  latest_inspection_passed boolean not null default false,
  latest_bol_verified boolean not null default false,
  notes text,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index project_materials_project_idx on public.project_materials(project_id);
create index project_materials_sku_idx on public.project_materials(organization_id, sku);
create index project_materials_status_idx on public.project_materials(status);

-- ---------- DELIVERIES / RECEIVING ----------
create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  vendor text not null,
  carrier text,
  driver_name text,
  driver_phone text,
  purchase_order_number text,
  bol_number text,
  scheduled_date date not null,
  scheduled_window_start time,
  scheduled_window_end time,
  actual_arrival_at timestamptz,
  completed_at timestamptz,
  status public.delivery_status not null default 'scheduled',
  delay_reason text,
  revised_eta timestamptz,
  unloading_requirements text,
  notes text,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index deliveries_project_idx on public.deliveries(project_id);
create index deliveries_date_idx on public.deliveries(scheduled_date);
create index deliveries_status_idx on public.deliveries(status);

create table public.delivery_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  delivery_id uuid not null references public.deliveries(id) on delete cascade,
  project_material_id uuid not null references public.project_materials(id) on delete cascade,
  expected_quantity numeric(14,3) not null default 0,
  created_at timestamptz not null default now(),
  unique(delivery_id, project_material_id)
);
create index delivery_items_delivery_idx on public.delivery_items(delivery_id);

create table public.receiving_inspections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  delivery_id uuid references public.deliveries(id) on delete set null,
  project_material_id uuid not null references public.project_materials(id) on delete cascade,
  receiver_id uuid not null default auth.uid() references public.profiles(id),
  inspected_at timestamptz not null default now(),
  bol_number text not null,
  bol_verified boolean not null,
  driver_name text,
  packaging_condition text,
  received_quantity numeric(14,3) not null default 0 check (received_quantity >= 0),
  damaged_quantity numeric(14,3) not null default 0 check (damaged_quantity >= 0),
  rejected_quantity numeric(14,3) not null default 0 check (rejected_quantity >= 0),
  short_quantity numeric(14,3) not null default 0 check (short_quantity >= 0),
  inspection_passed boolean not null,
  driver_acknowledged_exception boolean not null default false,
  signed_with_exception boolean not null default false,
  warehouse_zone text,
  warehouse_rack text,
  warehouse_bin text,
  notes text,
  created_at timestamptz not null default now(),
  check (damaged_quantity + rejected_quantity <= received_quantity)
);
create index receiving_project_idx on public.receiving_inspections(project_id);
create index receiving_material_idx on public.receiving_inspections(project_material_id);
create index receiving_delivery_idx on public.receiving_inspections(delivery_id);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  delivery_id uuid references public.deliveries(id) on delete cascade,
  project_material_id uuid references public.project_materials(id) on delete cascade,
  receiving_inspection_id uuid references public.receiving_inspections(id) on delete cascade,
  claim_id uuid,
  document_type text not null check (document_type in ('material_photo','damage_photo','bol','delivery_ticket','packing_slip','receipt','claim_document','signature','other')),
  storage_bucket text not null default 'project-documents',
  storage_path text not null,
  caption text,
  captured_at timestamptz not null default now(),
  uploaded_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now()
);
create index documents_project_idx on public.documents(project_id);
create index documents_inspection_idx on public.documents(receiving_inspection_id);

-- ---------- CLAIMS ----------
create table public.damage_claims (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  project_material_id uuid references public.project_materials(id) on delete set null,
  delivery_id uuid references public.deliveries(id) on delete set null,
  receiving_inspection_id uuid references public.receiving_inspections(id) on delete set null,
  claim_number text not null,
  claim_type public.claim_type not null,
  status public.claim_status not null default 'open',
  blocking boolean not null default true,
  vendor text,
  carrier text,
  owner_id uuid references public.profiles(id),
  description text not null,
  requested_resolution text,
  vendor_reference text,
  opened_at timestamptz not null default now(),
  response_due_date date,
  replacement_eta timestamptz,
  resolved_at timestamptz,
  resolution_notes text,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, claim_number)
);
create index damage_claims_project_idx on public.damage_claims(project_id);
create index damage_claims_status_idx on public.damage_claims(status);

alter table public.documents
  add constraint documents_claim_fk foreign key (claim_id) references public.damage_claims(id) on delete cascade;

-- ---------- MATERIAL REQUESTS ----------
create table public.material_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  requested_by uuid not null default auth.uid() references public.profiles(id),
  source text not null check (source in ('warehouse','home_depot','lowes','supply_house','other_vendor')),
  priority text not null default 'normal' check (priority in ('normal','urgent','emergency')),
  needed_by timestamptz not null,
  reason text not null,
  status public.request_status not null default 'pending',
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  fulfilled_by uuid references public.profiles(id),
  fulfilled_at timestamptz,
  receipt_document_id uuid references public.documents(id) on delete set null,
  total_cost numeric(12,2),
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index material_requests_project_idx on public.material_requests(project_id);
create index material_requests_status_idx on public.material_requests(status);

create table public.material_request_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  material_request_id uuid not null references public.material_requests(id) on delete cascade,
  description text not null,
  sku text,
  requested_quantity numeric(14,3) not null check (requested_quantity > 0),
  fulfilled_quantity numeric(14,3) not null default 0 check (fulfilled_quantity >= 0),
  unit text not null default 'EA',
  estimated_unit_cost numeric(12,2),
  actual_unit_cost numeric(12,2),
  substitution_allowed boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);
create index material_request_items_request_idx on public.material_request_items(material_request_id);

-- ---------- SHARED WAREHOUSE STOCK ----------
create table public.warehouse_inventory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  catalog_item_id uuid references public.material_catalog(id) on delete set null,
  name text not null,
  sku text,
  unit text not null default 'EA',
  on_hand_quantity numeric(14,3) not null default 0,
  committed_quantity numeric(14,3) not null default 0,
  reorder_point numeric(14,3) not null default 0,
  reorder_quantity numeric(14,3) not null default 0,
  warehouse_zone text,
  warehouse_rack text,
  warehouse_bin text,
  active boolean not null default true,
  last_counted_at timestamptz,
  last_counted_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku),
  check (committed_quantity >= 0),
  check (on_hand_quantity >= 0)
);
create index warehouse_inventory_org_idx on public.warehouse_inventory(organization_id);

create table public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  warehouse_inventory_id uuid not null references public.warehouse_inventory(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  material_request_id uuid references public.material_requests(id) on delete set null,
  transaction_type public.inventory_txn_type not null,
  quantity numeric(14,3) not null check (quantity <> 0),
  reference text,
  notes text,
  performed_by uuid not null default auth.uid() references public.profiles(id),
  performed_at timestamptz not null default now()
);
create index inventory_transactions_item_idx on public.inventory_transactions(warehouse_inventory_id);

-- ---------- READINESS / REPORTS / AUDIT ----------
create table public.project_readiness_checklist (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  checklist_key text not null,
  label text not null,
  required boolean not null default true,
  completed boolean not null default false,
  completed_by uuid references public.profiles(id),
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, checklist_key)
);
create index readiness_checklist_project_idx on public.project_readiness_checklist(project_id);

create table public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  report_date date not null,
  prepared_by uuid not null default auth.uid() references public.profiles(id),
  summary jsonb not null default '{}'::jsonb,
  narrative text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, report_date)
);

create table public.weekly_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  week_start date not null,
  prepared_by uuid not null default auth.uid() references public.profiles(id),
  summary jsonb not null default '{}'::jsonb,
  narrative text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, week_start)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  old_values jsonb,
  new_values jsonb,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index audit_log_org_time_idx on public.audit_log(organization_id, occurred_at desc);
create index audit_log_project_idx on public.audit_log(project_id);

-- ---------- READINESS VIEW ----------
create or replace view public.project_readiness_summary
with (security_invoker = true)
as
with material_counts as (
  select
    project_id,
    count(*) filter (where required) as required_material_lines,
    count(*) filter (where required and usable_quantity >= required_quantity) as complete_material_lines,
    count(*) filter (where required and received_quantity > 0) as received_required_lines,
    count(*) filter (
      where required
        and received_quantity > 0
        and latest_inspection_passed
        and latest_bol_verified
    ) as verified_received_lines
  from public.project_materials
  group by project_id
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
)
select
  p.id as project_id,
  p.organization_id,
  p.project_number,
  p.client_name,
  p.planned_start_date,
  p.readiness_approved,
  coalesce(mc.required_material_lines, 0) as required_material_lines,
  coalesce(mc.complete_material_lines, 0) as complete_material_lines,
  coalesce(mc.verified_received_lines, 0) as verified_received_lines,
  coalesce(cc.open_blocking_claims, 0) as open_blocking_claims,
  coalesce(rc.required_checklist_items, 0) as required_checklist_items,
  coalesce(rc.complete_checklist_items, 0) as complete_checklist_items,
  (
    coalesce(mc.required_material_lines, 0) > 0
    and coalesce(mc.required_material_lines, 0) = coalesce(mc.complete_material_lines, 0)
    and coalesce(mc.received_required_lines, 0) = coalesce(mc.verified_received_lines, 0)
    and coalesce(cc.open_blocking_claims, 0) = 0
    and coalesce(rc.required_checklist_items, 0) > 0
    and coalesce(rc.required_checklist_items, 0) = coalesce(rc.complete_checklist_items, 0)
  ) as preapproval_ready
from public.projects p
left join material_counts mc on mc.project_id = p.id
left join claim_counts cc on cc.project_id = p.id
left join checklist_counts rc on rc.project_id = p.id;

-- ---------- BUSINESS-LOGIC TRIGGERS ----------
create or replace function public.apply_receiving_inspection()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  good_qty numeric(14,3);
begin
  good_qty := greatest(new.received_quantity - new.damaged_quantity - new.rejected_quantity, 0);

  update public.project_materials
  set
    received_quantity = received_quantity + new.received_quantity,
    usable_quantity = usable_quantity + good_qty,
    damaged_quantity = damaged_quantity + new.damaged_quantity,
    latest_inspection_passed = new.inspection_passed,
    latest_bol_verified = new.bol_verified,
    warehouse_zone = coalesce(new.warehouse_zone, warehouse_zone),
    warehouse_rack = coalesce(new.warehouse_rack, warehouse_rack),
    warehouse_bin = coalesce(new.warehouse_bin, warehouse_bin),
    status = case
      when usable_quantity + good_qty >= required_quantity then 'received'::public.material_status
      when new.damaged_quantity > 0 or new.rejected_quantity > 0 then 'damaged'::public.material_status
      else 'partial'::public.material_status
    end,
    updated_at = now()
  where id = new.project_material_id;

  update public.projects
  set readiness_approved = false,
      readiness_approved_by = null,
      readiness_approved_at = null,
      status = case when status = 'ready_to_start' then 'blocked'::public.project_status else status end,
      updated_at = now()
  where id = new.project_id;

  return new;
end;
$$;

create trigger receiving_apply_material_totals
  after insert on public.receiving_inspections
  for each row execute function public.apply_receiving_inspection();

create or replace function public.revoke_readiness_on_material_change()
returns trigger
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
  where id = coalesce(new.project_id, old.project_id);
  return coalesce(new, old);
end;
$$;

create trigger project_material_change_revokes_readiness
  after insert or update or delete on public.project_materials
  for each row execute function public.revoke_readiness_on_material_change();

create trigger damage_claim_change_revokes_readiness
  after insert or update or delete on public.damage_claims
  for each row execute function public.revoke_readiness_on_material_change();

create or replace function public.approve_project_readiness(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_summary public.project_readiness_summary%rowtype;
begin
  if not public.is_admin_or_warehouse_manager() then
    raise exception 'Only an administrator or warehouse manager can grant final readiness approval';
  end if;

  select * into v_summary
  from public.project_readiness_summary
  where project_id = p_project_id
    and organization_id = public.current_org_id();

  if v_summary.project_id is null then
    raise exception 'Project not found';
  end if;

  if not v_summary.preapproval_ready then
    raise exception 'Project has not passed all pre-approval readiness controls';
  end if;

  update public.projects
  set readiness_approved = true,
      readiness_approved_by = auth.uid(),
      readiness_approved_at = now(),
      status = 'ready_to_start',
      updated_at = now()
  where id = p_project_id
    and organization_id = public.current_org_id();
end;
$$;

-- ---------- UPDATED_AT TRIGGERS ----------
do $$
declare
  t text;
begin
  foreach t in array array[
    'organizations','profiles','projects','material_catalog','project_materials','deliveries',
    'damage_claims','material_requests','warehouse_inventory','project_readiness_checklist',
    'daily_reports','weekly_reports'
  ] loop
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ---------- ROW LEVEL SECURITY ----------
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_trades enable row level security;
alter table public.material_catalog enable row level security;
alter table public.project_materials enable row level security;
alter table public.deliveries enable row level security;
alter table public.delivery_items enable row level security;
alter table public.receiving_inspections enable row level security;
alter table public.documents enable row level security;
alter table public.damage_claims enable row level security;
alter table public.material_requests enable row level security;
alter table public.material_request_items enable row level security;
alter table public.warehouse_inventory enable row level security;
alter table public.inventory_transactions enable row level security;
alter table public.project_readiness_checklist enable row level security;
alter table public.daily_reports enable row level security;
alter table public.weekly_reports enable row level security;
alter table public.audit_log enable row level security;

-- Organization/profile policies are explicit because they bootstrap tenant identity.
create policy organizations_select_same_org on public.organizations
for select using (id = public.current_org_id());

create policy organizations_update_admin on public.organizations
for update using (id = public.current_org_id() and public.current_app_role() = 'admin')
with check (id = public.current_org_id() and public.current_app_role() = 'admin');

create policy profiles_select_same_org on public.profiles
for select using (organization_id = public.current_org_id());

create policy profiles_admin_write on public.profiles
for all using (organization_id = public.current_org_id() and public.current_app_role() = 'admin')
with check (organization_id = public.current_org_id() and public.current_app_role() = 'admin');

-- Generic tenant policies for tables containing organization_id.
do $$
declare
  t text;
begin
  foreach t in array array[
    'projects','project_trades','material_catalog','project_materials','deliveries','delivery_items',
    'receiving_inspections','documents','damage_claims','material_requests','material_request_items',
    'warehouse_inventory','inventory_transactions','project_readiness_checklist','daily_reports','weekly_reports'
  ] loop
    execute format('create policy %I_select_org on public.%I for select using (organization_id = public.current_org_id())', t, t);
    execute format('create policy %I_insert_org on public.%I for insert with check (organization_id = public.current_org_id() and public.is_write_role())', t, t);
    execute format('create policy %I_update_org on public.%I for update using (organization_id = public.current_org_id() and public.is_write_role()) with check (organization_id = public.current_org_id() and public.is_write_role())', t, t);
    execute format('create policy %I_delete_org on public.%I for delete using (organization_id = public.current_org_id() and public.current_app_role() in (''admin'',''warehouse_manager''))', t, t);
  end loop;
end $$;

create policy audit_select_org on public.audit_log
for select using (organization_id = public.current_org_id());

create policy audit_insert_org on public.audit_log
for insert with check (organization_id = public.current_org_id() and actor_id = auth.uid());

-- ---------- STORAGE POLICIES ----------
-- Create a private bucket named `project-documents` in Supabase Storage.
-- Store objects under: <organization_id>/<project_id>/<document_type>/<uuid>-<filename>
-- These policies compare the first path segment to the signed-in user's organization.

create policy project_documents_select_org
on storage.objects for select
using (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = public.current_org_id()::text
);

create policy project_documents_insert_org
on storage.objects for insert
with check (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = public.current_org_id()::text
  and public.is_write_role()
);

create policy project_documents_update_org
on storage.objects for update
using (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = public.current_org_id()::text
  and public.is_write_role()
)
with check (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = public.current_org_id()::text
  and public.is_write_role()
);

create policy project_documents_delete_manager
on storage.objects for delete
using (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = public.current_org_id()::text
  and public.current_app_role() in ('admin','warehouse_manager')
);

-- ---------- SEED CHECKLIST FUNCTION ----------
create or replace function public.seed_project_readiness_checklist()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_readiness_checklist (organization_id, project_id, checklist_key, label, required)
  values
    (new.organization_id, new.id, 'material_list_approved', 'Project material list approved', true),
    (new.organization_id, new.id, 'warehouse_staging_complete', 'All project material grouped and staged', true),
    (new.organization_id, new.id, 'delivery_documents_complete', 'Delivery documents filed and verified', true),
    (new.organization_id, new.id, 'pm_final_review', 'Project Manager final material review complete', true);
  return new;
end;
$$;

create trigger project_seed_readiness_checklist
  after insert on public.projects
  for each row execute function public.seed_project_readiness_checklist();

-- ---------- GRANTS ----------
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on public.project_readiness_summary to authenticated;
grant execute on function public.current_org_id() to authenticated;
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.approve_project_readiness(uuid) to authenticated;

-- Service-role keys must never be exposed to the browser. Use them only in trusted server code.
