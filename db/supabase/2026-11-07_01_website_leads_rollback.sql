-- ROLLBACK for 2026-11-07_01_website_leads.sql
-- Removes ONLY what that script created: schema "website" (leads, towns,
-- consent_versions, settings, lead_status) and public.submit_website_lead.
-- Nothing of the mobile app is touched.
--
-- It refuses to run if any lead is stored, so real customer requests and
-- consent records are never deleted by accident. To remove stored leads too,
-- export them first (Table Editor -> website.leads -> Export to CSV), then
-- delete the safety-check block below on purpose.

begin;

do $$
declare
  v_has boolean := false;
begin
  if to_regclass('website.leads') is not null then
    execute 'select exists (select 1 from website.leads)' into v_has;
    if v_has then
      raise exception 'website.leads has rows. Export them, then remove this safety check to drop them.';
    end if;
  end if;
end;
$$;

drop function if exists public.submit_website_lead(text, jsonb);
drop schema if exists website cascade;

commit;
