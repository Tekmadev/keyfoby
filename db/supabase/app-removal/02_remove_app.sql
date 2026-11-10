-- =====================================================================
-- REMOVE the old KeyFoby mobile app from Supabase (permanent).
-- Written from the inventory the owner ran on 2026-11-10 (01_inventory.sql).
--
-- KEEPS: the website's schema "website" (leads, towns, consent_versions,
--        settings) and public.submit_website_lead. Nothing the website
--        needs is touched.
-- REMOVES: the app's 10 tables (and their data, policies and indexes),
--          1 view, 15 functions, 3 sign-up triggers on auth.users,
--          the enum type public.user_role, and the 2 app accounts.
--
-- BEFORE RUNNING, export what you want to keep (Table Editor -> table ->
-- Export -> CSV). At minimum:
--   * transactions                (404 rows: your job history / tax records)
--   * inventory_items             (93 rows)
--   * transaction_inventory_items (8 rows)
--   * newsletter_subscribers      (4 emails)
-- Then change `false` to `true` on the marked line below. The script
-- refuses to run until you do.
--
-- The old live site (Firebase) reads public.service_types for its quote form
-- dropdown. When that table is gone, the form falls back to its built-in list,
-- so the old site keeps working until the new one replaces it.
--
-- Runs in one transaction: if anything fails, nothing is removed.
-- =====================================================================

begin;

do $$
begin
  if not (
    false   -- <<< CHANGE TO true AFTER YOU HAVE EXPORTED THE DATA YOU WANT TO KEEP
  ) then
    raise exception 'Stopped: export your data first (see the top of this file), then change false to true.';
  end if;
end;
$$;

-- 1. Sign-up triggers on auth.users (must go before their functions/tables)
drop trigger if exists on_auth_user_created                  on auth.users;
drop trigger if exists on_auth_user_created_business_profile on auth.users;
drop trigger if exists on_user_created_check_newsletter      on auth.users;

-- 2. Scheduled jobs that call app functions (only if pg_cron is installed)
do $$
begin
  if to_regclass('cron.job') is not null then
    perform cron.unschedule(j.jobid)
    from cron.job j
    where j.command ilike any (array['%cleanup_deleted_businesses%', '%backfill_newsletter%', '%notification%', '%invitation%']);
  end if;
end;
$$;

-- 3. View
drop view if exists public.user_active_services;

-- 4. Tables (CASCADE also removes their policies, indexes, foreign keys and
--    their own triggers; nothing in schema "website" depends on them)
drop table if exists public.transaction_inventory_items cascade;
drop table if exists public.transactions                cascade;
drop table if exists public.inventory_items             cascade;
drop table if exists public.notifications               cascade;
drop table if exists public.user_invitations            cascade;
drop table if exists public.business_users              cascade;
drop table if exists public.business_profiles           cascade;
drop table if exists public.service_types               cascade;
drop table if exists public.newsletter_subscribers      cascade;

-- 5. Functions
drop function if exists public.backfill_newsletter_subscriber_status();
drop function if exists public.check_and_mark_newsletter_subscriber();
drop function if exists public.cleanup_deleted_businesses();
drop function if exists public.create_business_profile_for_new_user();
drop function if exists public.dismiss_notification(uuid);
drop function if exists public.get_unread_notification_count();
drop function if exists public.get_user_role(uuid, uuid);
drop function if exists public.is_business_owner(uuid, uuid);
drop function if exists public.mark_all_notifications_read();
drop function if exists public.mark_notification_read(uuid);
drop function if exists public.reset_user_services_to_default(uuid);
drop function if exists public.send_employee_invitation_magic_link(uuid);
drop function if exists public.soft_delete_business(uuid, uuid);
drop function if exists public.update_notifications_updated_at();
drop function if exists public.update_updated_at_column();

-- 6. Enum type
drop type if exists public.user_role;

-- 7. The 2 app accounts (the website does not use accounts)
delete from auth.users;

-- 8. Safety check: the website must still be intact
do $$
begin
  if to_regclass('website.leads') is null
     or to_regprocedure('public.submit_website_lead(text,jsonb)') is null then
    raise exception 'Website objects missing; rolling back everything.';
  end if;
end;
$$;

commit;

-- =====================================================================
-- AFTER RUNNING (in the Supabase dashboard, not SQL):
--   * Edge Functions: delete "invite-employee" if it is listed.
--   * Authentication -> Sign In / Providers: turn off "Allow new users to
--     sign up" (and the Google provider), so nobody can create accounts.
--     The website never uses sign-in.
--   * Run 03_check_after.sql: it should list only the website's objects.
-- =====================================================================
