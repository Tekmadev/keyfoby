-- =====================================================================
-- KeyFoby website leads: optional customer email (for a confirmation email)
-- File: db/supabase/2026-11-10_03_lead_email.sql
-- Run AFTER 2026-11-07_01_website_leads.sql and 2026-11-10_02_lead_history.sql,
-- in the Supabase SQL editor, BEFORE the website update that adds the email
-- field goes live (the website will send 'email' and consent version
-- '2026-11-10', which only exist after this script).
--
-- What it changes (additive; old submissions keep working):
--   1. leads.email: optional, one address, stored lower-case.
--   2. consent_versions: adds '2026-11-10' ("by phone, text or email").
--      The old '2026-11-07' wording stays valid for old records.
--   3. public.submit_website_lead: same as before, plus it accepts and checks
--      'email'. Same signature, grants and security as the original.
--   4. History: a change of email is logged as 'contact_changed'.
--   5. Abuse limits for the customer confirmation email: at most one per
--      address per 24 hours and 30 per day in total (the lead is always
--      stored; only the confirmation is skipped). The decision is stored on
--      the lead (columns notify / confirm), so a replayed request can never
--      send more than the original was allowed to.
--   The function now returns {id, ref, created_at, duplicate, notify, confirm, flood_alert}.
-- Safe to run twice.
-- =====================================================================

begin;

alter table website.leads add column if not exists email text
  check (email is null or (char_length(email) <= 254 and email = lower(email)));
alter table website.leads add column if not exists notify  boolean not null default true;   -- owner email allowed for this lead
alter table website.leads add column if not exists confirm boolean not null default false;  -- customer confirmation allowed for this lead
create index if not exists leads_email_recent_idx on website.leads (email, created_at desc) where email is not null;
create index if not exists leads_confirm_recent_idx on website.leads (created_at desc) where confirm;

comment on column website.leads.email is 'Optional customer email (lower-case), used only to confirm the request and for this quote.';

insert into website.consent_versions (version, consent_text) values
  ('2026-11-10',
   'Yes, KeyFoby ((905) 467-6860, keyfoby@gmail.com, 40 Courtland Ave, Hamilton, ON L9B 1X6) may contact me by phone, text or email about this quote. I can withdraw consent at any time.')
on conflict (version) do nothing;

create or replace function public.submit_website_lead(p_secret text, p_lead jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hash      text;
  v_digits    text;
  v_phone     text;
  v_year_txt  text;
  v_year      smallint;
  v_town      text;
  v_other     text;
  v_cversion  text;
  v_ctext     text;
  v_recent    int;
  v_id        uuid;
  v_ref       text;
  v_con       text;
  v_col       text;
  v_req_txt   text;
  v_req       uuid;
  v_req_hash  text;
  v_old_hash  text;
  v_created   timestamptz;
  v_hour      int;
  v_notify    boolean := true;
  v_flood     boolean := false;
  v_email     text;
  v_confirm   boolean := false;
  v_l_notify  boolean;
  v_l_confirm boolean;
begin
  -- 1) caller must hold the ingest secret (always 64 hex characters)
  if p_secret is null or char_length(p_secret) <> 64 then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select s.value into v_hash from website.settings s where s.key = 'ingest_secret_sha256';
  if v_hash is null then
    raise exception 'not_configured' using errcode = 'P0001';
  end if;
  if encode(sha256(convert_to(p_secret, 'UTF8')), 'hex') <> v_hash then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  -- 2) a small JSON object with known fields only
  if p_lead is null or jsonb_typeof(p_lead) <> 'object' or pg_column_size(p_lead) > 16384 then
    raise exception 'invalid:lead' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_object_keys(p_lead) k
    where k not in ('source', 'page_path', 'utm_source', 'utm_medium', 'utm_campaign', 'gclid',
                    'key_type', 'has_working_key', 'vehicle_year', 'vehicle_make', 'vehicle_model',
                    'ignition', 'town', 'other_town', 'customer_name', 'phone', 'details',
                    'consent', 'consent_version', 'client_request_id', 'email')
  ) then
    raise exception 'invalid:unknown_field' using errcode = '22023';
  end if;

  -- 3) phone: accept (905) 467-6860, 905-467-6860, +1 905 467 6860 ...
  v_digits := regexp_replace(coalesce(p_lead->>'phone', ''), '\D', '', 'g');
  if char_length(v_digits) = 11 and left(v_digits, 1) = '1' then
    v_digits := substr(v_digits, 2);
  end if;
  if v_digits !~ '^[2-9][0-9]{9}$' then
    raise exception 'invalid:phone' using errcode = '22023';
  end if;
  v_phone := '+1' || v_digits;

  -- 4) year (optional)
  v_year_txt := nullif(btrim(coalesce(p_lead->>'vehicle_year', '')), '');
  if v_year_txt is not null then
    if v_year_txt !~ '^[0-9]{4}$'
       or v_year_txt::int < 1980
       or v_year_txt::int > extract(year from now())::int + 1 then
      raise exception 'invalid:vehicle_year' using errcode = '22023';
    end if;
    v_year := v_year_txt::smallint;
  end if;

  -- 5) town: one of the active towns, or "other" with a name
  v_town  := nullif(btrim(coalesce(p_lead->>'town', '')), '');
  v_other := nullif(btrim(coalesce(p_lead->>'other_town', '')), '');
  if v_town is not null and lower(v_town) = 'other' then
    v_town := null;
    if v_other is null then
      raise exception 'invalid:other_town' using errcode = '22023';
    end if;
  elsif v_town is not null then
    if not exists (select 1 from website.towns t where t.name = v_town and t.active) then
      raise exception 'invalid:town' using errcode = '22023';
    end if;
    v_other := null;
  end if;

  -- 5b) email (optional): one plain address, stored lower-case
  v_email := nullif(lower(btrim(coalesce(p_lead->>'email', ''))), '');
  if v_email is not null
     and (char_length(v_email) > 254
          or v_email !~ '^[a-z0-9_%+''-]+(\.[a-z0-9_%+''-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$') then
    raise exception 'invalid:email' using errcode = '22023';
  end if;

  -- 6) consent: an explicit true, and a wording version we know
  if coalesce(p_lead->'consent' = 'true'::jsonb, false) is not true then
    raise exception 'invalid:consent' using errcode = '22023';
  end if;
  v_cversion := nullif(btrim(coalesce(p_lead->>'consent_version', '')), '');
  select c.consent_text into v_ctext from website.consent_versions c where c.version = v_cversion;
  if v_ctext is null then
    raise exception 'invalid:consent_version' using errcode = '22023';
  end if;

  -- 7) same form attempt sent twice (retry, double click)? Return the lead we
  --    already have. If the fields changed (a corrected resubmit), treat it as
  --    a new lead instead of silently keeping the old details.
  v_req_hash := encode(sha256(convert_to((p_lead - 'client_request_id')::text, 'UTF8')), 'hex');
  v_req_txt  := nullif(btrim(coalesce(p_lead->>'client_request_id', '')), '');
  if v_req_txt is not null then
    if v_req_txt !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      raise exception 'invalid:client_request_id' using errcode = '22023';
    end if;
    v_req := v_req_txt::uuid;
    perform pg_advisory_xact_lock(hashtext('website_lead_req:' || v_req::text));
    select l.id, l.ref, l.request_hash, l.created_at, l.notify, l.confirm
      into v_id, v_ref, v_old_hash, v_created, v_l_notify, v_l_confirm
    from website.leads l where l.client_request_id = v_req;
    if v_id is not null then
      if v_old_hash is not distinct from v_req_hash then
        -- a replay may only (re)send what the original was allowed to send,
        -- and only within the hour (Resend's idempotency covers the rest)
        return jsonb_build_object('id', v_id, 'ref', v_ref, 'created_at', v_created, 'duplicate', true,
                                  'notify', v_l_notify and v_created > now() - interval '1 hour',
                                  'confirm', v_l_confirm and v_created > now() - interval '1 hour',
                                  'flood_alert', false);
      end if;
      v_id := null; v_ref := null;
      v_req := null;   -- corrected resubmit: store as a new lead
    end if;
  end if;

  -- 8) flood guards. The lock makes parallel requests for one phone wait their
  --    turn, so they cannot all pass the per-phone count at once.
  --    * max 3 leads per phone number per 10 minutes          -> 'rate_limited'
  --    * over 20 leads in an hour: still STORED, but no email per lead; the
  --      21st sends one "flood" alert instead                  -> notify = false
  --    * over 200 leads in an hour: refused                    -> 'rate_limited_global'
  perform pg_advisory_xact_lock(hashtext('website_lead_phone:' || v_phone));
  select count(*) into v_hour
  from website.leads l
  where l.created_at > now() - interval '1 hour';
  if v_hour >= 200 then
    raise exception 'rate_limited_global' using errcode = 'P0001';
  end if;
  if v_hour >= 20 then
    v_notify := false;
    v_flood  := (v_hour = 20);
  end if;

  -- customer confirmation: only with an address, outside a flood, at most one
  -- per address per 24 hours and 30 per day in total (keeps the email quota
  -- free for the owner's own notifications). The lead is stored either way.
  if v_email is not null and v_notify then
    perform pg_advisory_xact_lock(hashtext('website_lead_email:' || v_email));
    v_confirm := not exists (select 1 from website.leads l
                             where l.email = v_email and l.confirm and l.created_at > now() - interval '24 hours')
                 and (select count(*) from website.leads l
                      where l.confirm and l.created_at > now() - interval '24 hours') < 30;
  end if;

  select count(*) into v_recent
  from website.leads l
  where l.phone = v_phone and l.created_at > now() - interval '10 minutes';
  if v_recent >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  -- 9) insert (table CHECK constraints catch anything else)
  begin
    insert into website.leads (
      source, page_path, utm_source, utm_medium, utm_campaign, gclid,
      key_type, has_working_key, vehicle_year, vehicle_make, vehicle_model, ignition,
      town, other_town,
      customer_name, phone, details,
      consent, consent_version, consent_text, client_request_id, request_hash, email,
      notify, confirm
    ) values (
      coalesce(nullif(p_lead->>'source', ''), 'quote_form'),
      nullif(left(btrim(coalesce(p_lead->>'page_path', '')), 200), ''),
      nullif(left(btrim(coalesce(p_lead->>'utm_source', '')), 100), ''),
      nullif(left(btrim(coalesce(p_lead->>'utm_medium', '')), 100), ''),
      nullif(left(btrim(coalesce(p_lead->>'utm_campaign', '')), 100), ''),
      nullif(left(btrim(coalesce(p_lead->>'gclid', '')), 200), ''),
      nullif(p_lead->>'key_type', ''),
      nullif(p_lead->>'has_working_key', ''),
      v_year,
      nullif(btrim(coalesce(p_lead->>'vehicle_make', '')), ''),
      nullif(btrim(coalesce(p_lead->>'vehicle_model', '')), ''),
      nullif(p_lead->>'ignition', ''),
      v_town,
      v_other,
      btrim(coalesce(p_lead->>'customer_name', '')),
      v_phone,
      nullif(btrim(coalesce(p_lead->>'details', '')), ''),
      true,
      v_cversion,
      v_ctext,
      v_req,
      v_req_hash,
      v_email,
      v_notify or v_flood,
      v_confirm
    )
    returning id, ref, created_at into v_id, v_ref, v_created;
  exception
    when check_violation or not_null_violation or foreign_key_violation
         or invalid_text_representation or string_data_right_truncation then
      get stacked diagnostics v_con = constraint_name, v_col = column_name;
      raise exception 'invalid:%', coalesce(nullif(v_con, ''), nullif(v_col, ''), 'lead') using errcode = '22023';
    when unique_violation then
      -- the same client_request_id raced in: return the stored lead
      select l.id, l.ref, l.created_at, l.notify, l.confirm into v_id, v_ref, v_created, v_l_notify, v_l_confirm
      from website.leads l where l.client_request_id = v_req;
      if v_id is null then raise; end if;
      return jsonb_build_object('id', v_id, 'ref', v_ref, 'created_at', v_created, 'duplicate', true,
                                'notify', v_l_notify, 'confirm', v_l_confirm, 'flood_alert', false);
  end;

  return jsonb_build_object('id', v_id, 'ref', v_ref, 'created_at', v_created,
                            'duplicate', false, 'notify', v_notify, 'confirm', v_confirm, 'flood_alert', v_flood);
end;
$$;

revoke all on function public.submit_website_lead(text, jsonb) from public;
revoke all on function public.submit_website_lead(text, jsonb) from anon, authenticated;
grant execute on function public.submit_website_lead(text, jsonb) to anon, service_role;

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
  if new.customer_name is distinct from old.customer_name or new.phone is distinct from old.phone
     or new.email is distinct from old.email then
    insert into website.lead_events (lead_id, kind, from_value, to_value, actor)
    values (new.id, 'contact_changed',
            old.customer_name || ' | ' || old.phone || ' | ' || coalesce(old.email, '-'),
            new.customer_name || ' | ' || new.phone || ' | ' || coalesce(new.email, '-'), v_actor);
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

revoke all on function website.log_lead_event() from public, anon, authenticated, service_role;

commit;

-- Check (read-only): both rows should say true.
-- select 'email column' as check, exists (select 1 from information_schema.columns where table_schema='website' and table_name='leads' and column_name='email') as ok
-- union all select 'consent 2026-11-10', exists (select 1 from website.consent_versions where version='2026-11-10');
