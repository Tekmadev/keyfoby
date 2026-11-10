-- READ-ONLY check after 02_remove_app.sql. Every row should say ok = true.
select 'no app tables left in public' as check,
       not exists (select 1 from pg_stat_user_tables where schemaname = 'public') as ok
union all
select 'no app functions left in public',
       not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                   where n.nspname = 'public' and p.proname <> 'submit_website_lead')
union all
select 'no app triggers left on auth.users',
       not exists (select 1 from pg_trigger where tgrelid = 'auth.users'::regclass and not tgisinternal)
union all
select 'no app accounts left',
       not exists (select 1 from auth.users)
union all
select 'website: its tables are still there',
       (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
         where n.nspname = 'website' and c.relkind = 'r'
           and c.relname in ('leads', 'towns', 'consent_versions', 'settings')) = 4
union all
select 'website: submit_website_lead still there',
       to_regprocedure('public.submit_website_lead(text,jsonb)') is not null;
