-- Notifications, notification preferences, and private storage bucket.
-- Apply after 0002_high_end_extension.sql.

-- ---------- NOTIFICATION TYPES ----------
create type public.notification_type as enum (
  'delivery_delayed',
  'revised_eta_missed',
  'project_start_blocked',
  'blocking_claim_opened',
  'blocking_claim_overdue',
  'urgent_request_submitted',
  'urgent_request_unfulfilled',
  'readiness_eligible',
  'readiness_revoked',
  'concealed_inspection_deadline',
  'storage_noncompliance'
);

create type public.notification_channel as enum ('in_app', 'email', 'sms', 'push');

-- ---------- NOTIFICATIONS ----------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  notification_type public.notification_type not null,
  title text not null,
  body text not null,
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  entity_type text,
  entity_id uuid,
  action_url text,
  -- Deduplication key: repeated triggers for the same underlying condition collapse.
  dedupe_key text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (recipient_id, dedupe_key)
);
create index notifications_recipient_idx on public.notifications(recipient_id, read_at, created_at desc);
create index notifications_org_idx on public.notifications(organization_id);

create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  notification_type public.notification_type not null,
  channels public.notification_channel[] not null default array['in_app']::public.notification_channel[],
  enabled boolean not null default true,
  -- Minimum minutes between re-notifying the same recipient for the same type.
  escalation_window_minutes integer not null default 60 check (escalation_window_minutes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, notification_type)
);
create index notification_preferences_profile_idx on public.notification_preferences(profile_id);

-- ---------- RLS ----------
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;

-- A user reads only their own notifications; writes happen through trusted server code
-- (service role) or triggers, so no broad insert policy is granted to authenticated users.
create policy notifications_select_own on public.notifications
  for select using (organization_id = public.current_org_id() and recipient_id = auth.uid());

create policy notifications_update_own on public.notifications
  for update using (organization_id = public.current_org_id() and recipient_id = auth.uid())
  with check (organization_id = public.current_org_id() and recipient_id = auth.uid());

create policy notification_preferences_select_own on public.notification_preferences
  for select using (organization_id = public.current_org_id() and profile_id = auth.uid());

create policy notification_preferences_write_own on public.notification_preferences
  for all using (organization_id = public.current_org_id() and profile_id = auth.uid())
  with check (organization_id = public.current_org_id() and profile_id = auth.uid());

-- ---------- UPDATED_AT ----------
create trigger notification_preferences_set_updated_at
  before update on public.notification_preferences
  for each row execute function public.set_updated_at();

-- ---------- GRANTS ----------
grant select, update on public.notifications to authenticated;
grant select, insert, update, delete on public.notification_preferences to authenticated;

-- ---------- PRIVATE STORAGE BUCKET ----------
-- The bucket is private; access is granted only through the storage policies defined
-- in 0001_core_schema.sql, which compare the first path segment to the caller's org.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-documents',
  'project-documents',
  false,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;
