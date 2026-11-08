-- Read-only checks after running 2026-11-07_01_website_leads.sql.
-- Run in the Supabase SQL editor. Every row should say ok = true.
-- (It changes nothing and never shows the secret hash.)

select 'schema website exists' as check,
       exists (select 1 from pg_namespace where nspname = 'website') as ok
union all
select 'tables leads, towns, consent_versions, settings exist',
       (select count(*) from pg_class
         where relnamespace = 'website'::regnamespace and relkind = 'r'
           and relname in ('leads', 'towns', 'consent_versions', 'settings')) = 4
union all
select 'RLS on for all website tables',
       not exists (select 1 from pg_class
                    where relnamespace = 'website'::regnamespace and relkind = 'r'
                      and not relrowsecurity)
union all
select 'anon has no access to schema website',
       not has_schema_privilege('anon', 'website', 'usage')
union all
select 'authenticated has no access to schema website',
       not has_schema_privilege('authenticated', 'website', 'usage')
union all
select 'anon can execute submit_website_lead',
       has_function_privilege('anon', 'public.submit_website_lead(text,jsonb)', 'execute')
union all
select 'authenticated cannot execute submit_website_lead',
       not has_function_privilege('authenticated', 'public.submit_website_lead(text,jsonb)', 'execute')
union all
select 'function is SECURITY DEFINER with a fixed search_path',
       (select prosecdef and array_to_string(proconfig, ',') like '%search_path=%'
          from pg_proc where oid = 'public.submit_website_lead(text,jsonb)'::regprocedure)
union all
select '10 towns seeded',
       (select count(*) from website.towns) = 10
union all
select 'leads has client_request_id and request_hash columns',
       (select count(*) from information_schema.columns
         where table_schema = 'website' and table_name = 'leads'
           and column_name in ('client_request_id', 'request_hash')) = 2
union all
select 'consent wording 2026-11-07 seeded',
       exists (select 1 from website.consent_versions where version = '2026-11-07')
union all
select 'ingest secret hash is set (64 hex chars)',
       coalesce((select value ~ '^[0-9a-f]{64}$' from website.settings
                  where key = 'ingest_secret_sha256'), false);

-- How many leads so far (0 right after setup):
-- select count(*) from website.leads;
