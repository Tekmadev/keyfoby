-- READ-ONLY: lists everything the KeyFoby mobile app has in this Supabase
-- project, so the removal script can be written exactly. Changes nothing.
-- Run in the SQL Editor and send a screenshot (or Export -> CSV) of the result.

with
tables as (
  select 'table' as kind, s.schemaname || '.' || s.relname as name, s.n_live_tup::text || ' rows (approx.)' as detail
  from pg_stat_user_tables s
  where s.schemaname = 'public'
),
views as (
  select 'view', v.table_schema || '.' || v.table_name, ''
  from information_schema.views v
  where v.table_schema = 'public'
),
funcs as (
  select 'function', n.nspname || '.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')', ''
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname <> 'submit_website_lead'
),
enums as (
  select 'enum type', n.nspname || '.' || t.typname, ''
  from pg_type t join pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public' and t.typtype = 'e'
),
auth_triggers as (
  select 'trigger on auth.users', t.tgname, left(pg_get_triggerdef(t.oid), 160)
  from pg_trigger t
  where t.tgrelid = 'auth.users'::regclass and not t.tgisinternal
),
auth_users as (
  select 'app accounts (auth.users)', 'count', count(*)::text from auth.users
),
buckets as (
  select 'storage bucket', b.id, (select count(*) from storage.objects o where o.bucket_id = b.id)::text || ' files'
  from storage.buckets b
),
website as (
  select 'KEEP: website schema', c.relname, s.n_live_tup::text || ' rows (approx.)'
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  left join pg_stat_user_tables s on s.relid = c.oid
  where n.nspname = 'website' and c.relkind = 'r'
)
select * from tables
union all select * from views
union all select * from funcs
union all select * from enums
union all select * from auth_triggers
union all select * from auth_users
union all select * from buckets
union all select * from website
order by 1, 2;
