-- UNDO 2026-11-10_02_lead_history.sql only (keeps the leads themselves).
-- Removes the history log and the extra job columns. The history and any
-- values typed into the job columns are lost; export them first if needed.
-- Order matters: the trigger refers to the new columns, so it goes first.

begin;

drop trigger if exists leads_log_insert on website.leads;
drop trigger if exists leads_log_update on website.leads;
drop function if exists website.log_lead_event();
drop table if exists website.lead_events;

alter table website.leads
  drop column if exists job_ref,
  drop column if exists scheduled_for,
  drop column if exists quoted_price_cents,
  drop column if exists assigned_to,
  drop column if exists form_version;

commit;
