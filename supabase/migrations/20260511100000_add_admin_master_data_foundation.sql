create type public.admin_role as enum ('admin', 'editor', 'viewer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.admin_role not null,
  granted_by uuid references auth.users (id) on delete set null,
  granted_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  revoked_at timestamptz,
  constraint user_roles_reason_length check (granted_reason is null or char_length(granted_reason) <= 200),
  constraint user_roles_unique_active_role unique nulls not distinct (user_id, role, revoked_at)
);

comment on table public.user_roles is
  '管理者権限の一次情報。admin/editor/viewer のRBAC判定に利用する。';

create table public.admin_characters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.admin_roles_master (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text not null,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.admin_stats (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text not null,
  unit text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.admin_score_weights (
  id uuid primary key default gen_random_uuid(),
  profile_key text not null,
  character_slug text references public.admin_characters (slug) on delete set null,
  role_code text references public.admin_roles_master (code) on delete set null,
  stat_code text not null references public.admin_stats (code) on delete cascade,
  weight numeric(10, 4) not null,
  is_public boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint admin_score_weights_period_valid check (ends_at is null or starts_at is null or starts_at <= ends_at)
);

create table public.admin_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_public boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.admin_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_public boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.admin_update_histories (
  id uuid primary key default gen_random_uuid(),
  version_label text not null,
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint admin_update_histories_details_is_object check (jsonb_typeof(details) = 'object')
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users (id) on delete restrict,
  actor_role public.admin_role,
  action text not null,
  target_table text not null,
  target_id text,
  before_json jsonb,
  after_json jsonb,
  request_id text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint admin_audit_logs_before_is_object check (before_json is null or jsonb_typeof(before_json) = 'object'),
  constraint admin_audit_logs_after_is_object check (after_json is null or jsonb_typeof(after_json) = 'object')
);

comment on table public.admin_audit_logs is
  '管理操作の監査ログ。secret/access token/service role key/不要PIIは保存しない。';

create or replace view public.public_characters as
select id, slug, display_name, sort_order, updated_at
from public.admin_characters
where is_public = true and is_active = true;

create or replace view public.public_roles as
select id, code, display_name, sort_order, updated_at
from public.admin_roles_master
where is_public = true and is_active = true;

create or replace view public.public_stats as
select id, code, display_name, unit, sort_order, updated_at
from public.admin_stats
where is_public = true and is_active = true;

create or replace view public.public_score_weights as
select id, profile_key, character_slug, role_code, stat_code, weight, starts_at, ends_at, updated_at
from public.admin_score_weights
where is_public = true;

create or replace view public.public_faqs as
select id, question, answer, sort_order, published_at, updated_at
from public.admin_faqs
where is_public = true;

create or replace view public.public_announcements as
select id, title, body, published_at, updated_at
from public.admin_announcements
where is_public = true;

create or replace view public.public_update_histories as
select id, version_label, summary, details, published_at, updated_at
from public.admin_update_histories
where is_public = true;

create or replace function public.has_admin_role(roles public.admin_role[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.revoked_at is null
      and ur.role = any (roles)
  );
$$;

alter table public.user_roles enable row level security;
alter table public.admin_characters enable row level security;
alter table public.admin_roles_master enable row level security;
alter table public.admin_stats enable row level security;
alter table public.admin_score_weights enable row level security;
alter table public.admin_faqs enable row level security;
alter table public.admin_announcements enable row level security;
alter table public.admin_update_histories enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "user_roles_select_admin_only" on public.user_roles for select
using (public.has_admin_role(array['admin']::public.admin_role[]));

create policy "user_roles_manage_admin_only" on public.user_roles for all
using (public.has_admin_role(array['admin']::public.admin_role[]))
with check (public.has_admin_role(array['admin']::public.admin_role[]));

create policy "admin_characters_select_admin" on public.admin_characters for select
using (public.has_admin_role(array['admin', 'editor', 'viewer']::public.admin_role[]));
create policy "admin_characters_write_admin_editor" on public.admin_characters for all
using (public.has_admin_role(array['admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['admin', 'editor']::public.admin_role[]));

create policy "admin_roles_master_select_admin" on public.admin_roles_master for select
using (public.has_admin_role(array['admin', 'editor', 'viewer']::public.admin_role[]));
create policy "admin_roles_master_write_admin_editor" on public.admin_roles_master for all
using (public.has_admin_role(array['admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['admin', 'editor']::public.admin_role[]));

create policy "admin_stats_select_admin" on public.admin_stats for select
using (public.has_admin_role(array['admin', 'editor', 'viewer']::public.admin_role[]));
create policy "admin_stats_write_admin_editor" on public.admin_stats for all
using (public.has_admin_role(array['admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['admin', 'editor']::public.admin_role[]));

create policy "admin_score_weights_select_admin" on public.admin_score_weights for select
using (public.has_admin_role(array['admin', 'editor', 'viewer']::public.admin_role[]));
create policy "admin_score_weights_write_admin_editor" on public.admin_score_weights for all
using (public.has_admin_role(array['admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['admin', 'editor']::public.admin_role[]));

create policy "admin_faqs_select_admin" on public.admin_faqs for select
using (public.has_admin_role(array['admin', 'editor', 'viewer']::public.admin_role[]));
create policy "admin_faqs_write_admin_editor" on public.admin_faqs for all
using (public.has_admin_role(array['admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['admin', 'editor']::public.admin_role[]));

create policy "admin_announcements_select_admin" on public.admin_announcements for select
using (public.has_admin_role(array['admin', 'editor', 'viewer']::public.admin_role[]));
create policy "admin_announcements_write_admin_editor" on public.admin_announcements for all
using (public.has_admin_role(array['admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['admin', 'editor']::public.admin_role[]));

create policy "admin_update_histories_select_admin" on public.admin_update_histories for select
using (public.has_admin_role(array['admin', 'editor', 'viewer']::public.admin_role[]));
create policy "admin_update_histories_write_admin_editor" on public.admin_update_histories for all
using (public.has_admin_role(array['admin', 'editor']::public.admin_role[]))
with check (public.has_admin_role(array['admin', 'editor']::public.admin_role[]));

create policy "admin_audit_logs_select_admin_only" on public.admin_audit_logs for select
using (public.has_admin_role(array['admin']::public.admin_role[]));

create policy "admin_audit_logs_insert_admin_editor" on public.admin_audit_logs for insert
with check (public.has_admin_role(array['admin', 'editor']::public.admin_role[]));

grant select on public.public_characters to anon, authenticated;
grant select on public.public_roles to anon, authenticated;
grant select on public.public_stats to anon, authenticated;
grant select on public.public_score_weights to anon, authenticated;
grant select on public.public_faqs to anon, authenticated;
grant select on public.public_announcements to anon, authenticated;
grant select on public.public_update_histories to anon, authenticated;

create trigger set_user_roles_updated_at
before update on public.user_roles
for each row
execute function public.set_updated_at();

create trigger set_admin_characters_updated_at
before update on public.admin_characters
for each row
execute function public.set_updated_at();

create trigger set_admin_roles_master_updated_at
before update on public.admin_roles_master
for each row
execute function public.set_updated_at();

create trigger set_admin_stats_updated_at
before update on public.admin_stats
for each row
execute function public.set_updated_at();

create trigger set_admin_score_weights_updated_at
before update on public.admin_score_weights
for each row
execute function public.set_updated_at();

create trigger set_admin_faqs_updated_at
before update on public.admin_faqs
for each row
execute function public.set_updated_at();

create trigger set_admin_announcements_updated_at
before update on public.admin_announcements
for each row
execute function public.set_updated_at();

create trigger set_admin_update_histories_updated_at
before update on public.admin_update_histories
for each row
execute function public.set_updated_at();
