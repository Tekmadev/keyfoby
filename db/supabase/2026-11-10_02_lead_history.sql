-- =====================================================================
-- KeyFoby website leads: make the data ready for the future KeyFoby app
-- File: db/supabase/2026-11-10_02_lead_history.sql
-- Run AFTER 2026-11-07_01_website_leads.sql, in the Supabase SQL editor.
-- Undo (only this script): 2026-11-10_02_lead_history_rollback.sql
--
-- What it adds (additive only; the website form keeps working unchanged):
--   1. website.lead_events: an automatic history log. A lead's creation and
--      every change to its status, contact details, notes, consent, assignee,
--      quote, appointment or job link is recorded with a UTC timestamp and
--      who made it. History is the one thing that cannot be rebuilt later.
--      Note TEXT is not copied (only that notes changed), so old personal
--      details do not pile up in the history.
--   2. leads.form_version: which version of the website form produced the
--      lead. Existing leads get 'web-2026-11-07'; new ones 'web-2026-11-10'.
--      When the form's fields or option lists change, change the default
--      (see db/supabase/README.md).
--   3. Empty "job" columns the app will need: assigned_to, quoted_price_cents,
--      scheduled_for, job_ref. The owner may fill them in the Table Editor.
--
-- Same safety rules as the first script: private schema, no access for the
-- public key or app logins, RLS on with no policies. Only the trigger can
-- write history (nobody can insert or edit history rows directly).
-- Safe to run twice.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Extra columns on leads
-- ---------------------------------------------------------------------
-- The ADD's default stamps existing rows without an UPDATE (so updated_at,
-- which the retention clock uses, does not move); new rows get the SET DEFAULT.
alter table website.leads add column if not exists form_version text not null default 'web-2026-11-07'
  check (char_length(form_version) between 1 and 40);
alter table website.leads alter column form_version set default 'web-2026-11-10';

alter table website.leads add column if not exists assigned_to uuid;
alter table website.leads add column if not exists quoted_price_cents integer
  check (quoted_price_cents is null or quoted_price_cents between 0 and 10000000);
alter table website.leads add column if not exists scheduled_for timestamptz;
alter table website.leads add column if not exists job_ref text
  check (job_ref is null or char_length(job_ref) between 1 and 80);

comment on column website.leads.form_version       is 'Version of the website form that produced this lead (web-YYYY-MM-DD). Bump the default when the form fields or option lists change.';
comment on column website.leads.assigned_to        is 'Staff user id (auth.users.id) in the future KeyFoby app. Empty until the app exists.';
comment on column website.leads.quoted_price_cents is 'Quoted total in Canadian cents, as told to the customer on the phone.';
comment on column website.leads.scheduled_for      is 'Booked appointment start time.';
comment on column website.leads.job_ref            is 'Id of the job/transaction in the future app (or any job reference).';
comment on column website.leads.has_working_key    is 'spare = still has a working key (needs a spare); lost = all keys lost; null = not said.';
comment on column website.leads.key_type           is 'blade | remote | flip | smart; null = not sure.';
comment on column website.leads.phone              is 'E.164, always +1 and 10 digits (North American).';

-- ---------------------------------------------------------------------
-- 2. History log
-- ---------------------------------------------------------------------
create table if not exists website.lead_events (
  id          bigint generated always as identity primary key,
  lead_id     uuid not null references website.leads (id) on delete cascade,
  at          timestamptz not null default now(),
  kind        text not null check (kind in (
                'created', 'status_changed', 'contact_changed', 'notes_changed',
                'consent_changed', 'assignment_changed', 'quote_changed',
                'schedule_changed', 'job_ref_changed')),
  from_value  text check (char_length(from_value) <= 2000),
  to_value    text check (char_length(to_value) <= 2000),
  actor       text not null
);

create index if not exists lead_events_lead_idx on website.lead_events (lead_id, at, id);

comment on table  website.lead_events is 'Automatic history of each website lead. Sort by (at, id). Rows are written only by the trigger website.log_lead_event().';
comment on column website.lead_events.actor is 'website:<source> for new leads; backfill / backfill:<source> for reconstructed rows; otherwise the app user id (JWT sub), the API role (service_role) or the database user (postgres = Supabase dashboard).';
comment on column website.lead_events.from_value is 'Old value as text; timestamps are ISO 8601 UTC; notes_changed stores no text.';

-- SECURITY DEFINER: the trigger can write history whoever edits the lead
-- (dashboard, a server with the service key, or later an app user), while
-- nobody can write history rows directly.
create or replace function website.log_lead_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor text;
  v_utc   text := 'YYYY-MM-DD"T"HH24:MI:SS"Z"';
begin
  if tg_op = 'INSERT' then
    insert into website.lead_events (lead_id, kind, to_value, actor)
    values (new.id, 'created', new.status::text, 'website:' || new.source);
    return new;
  end if;

  v_actor := coalesce(
    nullif(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub', ''),
    nullif(nullif(current_setting('role', true), ''), 'none'),
    session_user::text);

  if new.status is distinct from old.status then
    insert into website.lead_events (lead_id, kind, from_value, to_value, actor)
    values (new.id, 'status_changed', old.status::text, new.status::text, v_actor);
  end if;
  if new.customer_name is distinct from old.customer_name or new.phone is distinct from old.phone then
    insert into website.lead_events (lead_id, kind, from_value, to_value, actor)
    values (new.id, 'contact_changed', old.customer_name || ' | ' || old.phone, new.customer_name || ' | ' || new.phone, v_actor);
  end if;
  if new.owner_notes is distinct from old.owner_notes then
    insert into website.lead_events (lead_id, kind, actor)
    values (new.id, 'notes_changed', v_actor);
  end if;
  if new.consent_withdrawn_at is distinct from old.consent_withdrawn_at then
    insert into website.lead_events (lead_id, kind, from_value, to_value, actor)
    values (new.id, 'consent_changed',
            to_char(old.consent_withdrawn_at at time zone 'UTC', v_utc),
            to_char(new.consent_withdrawn_at at time zone 'UTC', v_utc), v_actor);
  end if;
  if new.assigned_to is distinct from old.assigned_to then
    insert into website.lead_events (lead_id, kind, from_value, to_value, actor)
    values (new.id, 'assignment_changed', old.assigned_to::text, new.assigned_to::text, v_actor);
  end if;
  if new.quoted_price_cents is distinct from old.quoted_price_cents then
    insert into website.lead_events (lead_id, kind, from_value, to_value, actor)
    values (new.id, 'quote_changed', old.quoted_price_cents::text, new.quoted_price_cents::text, v_actor);
  end if;
  if new.scheduled_for is distinct from old.scheduled_for then
    insert into website.lead_events (lead_id, kind, from_value, to_value, actor)
    values (new.id, 'schedule_changed',
            to_char(old.scheduled_for at time zone 'UTC', v_utc),
            to_char(new.scheduled_for at time zone 'UTC', v_utc), v_actor);
  end if;
  if new.job_ref is distinct from old.job_ref then
    insert into website.lead_events (lead_id, kind, from_value, to_value, actor)
    values (new.id, 'job_ref_changed', old.job_ref, new.job_ref, v_actor);
  end if;
  return new;
end;
$$;

drop trigger if exists leads_log_insert on website.leads;
create trigger leads_log_insert
  after insert on website.leads
  for each row execute function website.log_lead_event();

drop trigger if exists leads_log_update on website.leads;
create trigger leads_log_update
  after update on website.leads
  for each row execute function website.log_lead_event();

-- Leads that existed before this script: every lead starts as 'new', so the
-- reconstructed history says so, plus one status change if it has moved on.
insert into website.lead_events (lead_id, at, kind, to_value, actor)
select l.id, l.created_at, 'created', 'new', 'backfill:' || l.source
from website.leads l
where not exists (select 1 from website.lead_events e where e.lead_id = l.id and e.kind = 'created');

insert into website.lead_events (lead_id, at, kind, from_value, to_value, actor)
select l.id, l.updated_at, 'status_changed', 'new', l.status::text, 'backfill'
from website.leads l
where l.status <> 'new'
  and not exists (select 1 from website.lead_events e where e.lead_id = l.id and e.kind = 'status_changed');

-- ---------------------------------------------------------------------
-- 3. Lock-down: history is read-only for everyone except the trigger
-- ---------------------------------------------------------------------
alter table website.lead_events enable row level security;
revoke all on website.lead_events from public, anon, authenticated, service_role;
grant select on website.lead_events to service_role;
revoke all on function website.log_lead_event() from public, anon, authenticated, service_role;

commit;

-- Check (read-only): every row should say true.
-- select 'lead_events exists' as check, to_regclass('website.lead_events') is not null as ok
-- union all select 'form_version column', exists (select 1 from information_schema.columns where table_schema='website' and table_name='leads' and column_name='form_version')
-- union all select 'history triggers', (select count(*) from pg_trigger where tgrelid='website.leads'::regclass and tgname in ('leads_log_insert','leads_log_update')) = 2
-- union all select 'every lead has a created event', not exists (select 1 from website.leads l where not exists (select 1 from website.lead_events e where e.lead_id=l.id and e.kind='created'));
