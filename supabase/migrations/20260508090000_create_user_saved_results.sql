create extension if not exists pgcrypto;

create type public.saved_result_kind as enum ('score', 'card');

create table public.user_saved_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  result_kind public.saved_result_kind not null,
  title text,
  payload jsonb not null,
  score_total numeric(10, 2),
  score_rank text,
  source_version text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint payload_is_object check (jsonb_typeof(payload) = 'object')
);

comment on table public.user_saved_results is
  'ログインユーザー向けの個人保存データ。公開/ランキング用途のデータは別テーブルで管理する。';
comment on column public.user_saved_results.payload is
  'スコア計算・カード生成結果のJSON。secret/不要PIIは保存しない。';

create index user_saved_results_user_id_created_at_idx
  on public.user_saved_results (user_id, created_at desc);
create index user_saved_results_kind_idx
  on public.user_saved_results (result_kind);

alter table public.user_saved_results enable row level security;

create policy "user_saved_results_select_own"
  on public.user_saved_results
  for select
  using (auth.uid() = user_id);

create policy "user_saved_results_insert_own"
  on public.user_saved_results
  for insert
  with check (auth.uid() = user_id);

create policy "user_saved_results_update_own"
  on public.user_saved_results
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_saved_results_delete_own"
  on public.user_saved_results
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger set_user_saved_results_updated_at
before update on public.user_saved_results
for each row
execute function public.set_updated_at();
