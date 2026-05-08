create table public.ranking_public_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null,
  is_anonymous boolean not null default false,
  result_kind public.saved_result_kind not null,
  role text not null,
  equipment_type text not null,
  score_total numeric(10, 2) not null,
  score_rank text not null,
  payload_snapshot jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint ranking_public_entries_display_name_length check (char_length(display_name) between 1 and 40),
  constraint ranking_public_entries_role_length check (char_length(role) between 1 and 64),
  constraint ranking_public_entries_equipment_type_length check (char_length(equipment_type) between 1 and 64),
  constraint ranking_public_entries_payload_is_object check (jsonb_typeof(payload_snapshot) = 'object'),
  constraint ranking_public_entries_payload_no_sensitive_keys check (
    not (payload_snapshot ?| array['email', 'mail', 'access_token', 'refresh_token', 'token', 'secret', 'password', 'user_id'])
  )
);

comment on table public.ranking_public_entries is
  'ランキング公開専用データ。個人保存用user_saved_resultsとは分離し、公開最小スナップショットのみ保持する。';
comment on column public.ranking_public_entries.display_name is
  'ランキング表示名。匿名表示時は匿名名を保存する。';
comment on column public.ranking_public_entries.payload_snapshot is
  '公開可能な最小スナップショット。email/access token/secret/不要PIIは保存しない。';

create index ranking_public_entries_sort_idx
  on public.ranking_public_entries (result_kind, score_total desc, created_at desc);
create index ranking_public_entries_filter_idx
  on public.ranking_public_entries (role, equipment_type, score_rank);
create index ranking_public_entries_user_created_at_idx
  on public.ranking_public_entries (user_id, created_at desc);

alter table public.ranking_public_entries enable row level security;

create policy "ranking_public_entries_select_public"
  on public.ranking_public_entries
  for select
  using (true);

create policy "ranking_public_entries_insert_own"
  on public.ranking_public_entries
  for insert
  with check (auth.uid() = user_id);

create policy "ranking_public_entries_delete_own"
  on public.ranking_public_entries
  for delete
  using (auth.uid() = user_id);
