alter table public.admin_stats
  add column if not exists stat_kind text not null default 'fixed';

alter table public.admin_stats
  drop constraint if exists admin_stats_stat_kind_check;

alter table public.admin_stats
  add constraint admin_stats_stat_kind_check
  check (stat_kind in ('fixed', 'percent'));

comment on column public.admin_stats.stat_kind is '表示形式の種別。fixed=固定値、percent=割合';

create or replace view public.public_stats as
select id, code, display_name, unit, stat_kind, sort_order, updated_at
from public.admin_stats
where is_public = true and is_active = true;
