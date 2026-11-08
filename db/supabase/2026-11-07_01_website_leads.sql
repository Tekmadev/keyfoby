-- =====================================================================
-- KeyFoby website: store quote requests ("leads") from the new site
-- File: db/supabase/2026-11-07_01_website_leads.sql
--
-- WHERE: Supabase project grytdgpmewmxbdimpgrr, SQL editor.
-- That project is ALSO the live database of the KeyFoby mobile app, so this
-- script is ADDITIVE ONLY:
--   * everything lives in a new schema "website", plus one function
--     public.submit_website_lead(...)
--   * it does not alter, drop or read any existing table, trigger, policy or
--     extension (auth.users, service_types, transactions, business_*,
--     newsletter_*), and changes no default privileges outside "website".
--   * it is safe to run twice (IF NOT EXISTS / OR REPLACE / ON CONFLICT).
--
-- HOW LEADS GET IN:
--   website form -> Vercel function (validates, bot check)
--   -> calls public.submit_website_lead(secret, lead) with the PUBLIC key.
--   The function accepts the call only if the secret matches the hash stored
--   in website.settings, so the browser cannot write leads directly and no
--   service-role key is ever needed on Vercel.
--
-- WHO CAN READ LEADS: nobody through the public API (anon/authenticated have
--   no access to schema "website"). The owner reads them in the dashboard:
--   Table Editor -> schema "website" -> table "leads".
--
-- SECURITY ADVISOR after running (both expected, both intentional):
--   * 0028 "anon can execute SECURITY DEFINER function" on submit_website_lead:
--     it is a secret-gated ingest endpoint that validates everything.
--   * 0008 "RLS enabled, no policy" on website.*: deny-by-default on purpose.
--
-- AFTER RUNNING: set the ingest secret hash (step at the bottom of this file).
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Private schema, closed to the public API roles.
--    The real protection is that anon/authenticated have no USAGE on it;
--    the default-privilege lines below are belt-and-braces only.
-- ---------------------------------------------------------------------
create schema if not exists website;

revoke all on schema website from public;
revoke all on schema website from anon, authenticated;
grant usage on schema website to service_role;

alter default privileges in schema website revoke all on tables from public, anon, authenticated;
alter default privileges in schema website revoke all on sequences from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. Lookup tables
-- ---------------------------------------------------------------------
-- Towns we serve (edit rows here to change the list; 'active' hides one)
create table if not exists website.towns (
  name    text primary key check (char_length(name) between 2 and 60),
  sort    smallint not null default 100,
  active  boolean  not null default true
);

insert into website.towns (name, sort) values
  ('Hamilton', 10), ('Ancaster', 20), ('Dundas', 30), ('Stoney Creek', 40),
  ('Burlington', 50), ('Grimsby', 60), ('Oakville', 70), ('Mississauga', 80),
  ('Brampton', 90), ('Toronto', 100)
on conflict (name) do nothing;

-- Exact consent wordings the site has shown (CASL proof). The form sends only
-- the version; the database copies the wording from here, so the record shows
-- exactly what the person agreed to. To change the wording: INSERT a new
-- version (never edit an old one) and update the website to send it.
create table if not exists website.consent_versions (
  version        text primary key check (char_length(version) between 1 and 40),
  consent_text   text not null check (char_length(consent_text) between 20 and 600),
  first_used_at  timestamptz not null default now()
);

insert into website.consent_versions (version, consent_text) values
  ('2026-11-07',
   'Yes, KeyFoby ((905) 467-6860, keyfoby@gmail.com) may contact me by phone or text about this quote. I can withdraw consent at any time. Our mailing address is in our privacy policy.')
on conflict (version) do nothing;

-- Settings (holds only the SHA-256 hash of the ingest secret)
create table if not exists website.settings (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

-- Lead status: an enum so the Table Editor shows a dropdown
do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'website' and t.typname = 'lead_status') then
    create type website.lead_status as enum ('new', 'quoted', 'booked', 'completed', 'lost', 'spam');
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- 3. Leads
-- ---------------------------------------------------------------------
create table if not exists website.leads (
  id                    uuid primary key default gen_random_uuid(),
  ref_no                bigint generated always as identity (start with 1001) unique,
  ref                   text generated always as ('KF-' || ref_no::text) stored,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- one id per form attempt (sent by the browser): a retried or double-clicked
  -- submit returns the same lead instead of creating a duplicate
  client_request_id     uuid unique,
  request_hash          text,         -- fingerprint of the submitted fields, to tell a retry from a corrected resubmit

  -- where it came from ('key_picker' is reserved: the picker only opens
  -- WhatsApp today and stores nothing)
  source                text not null check (source in ('quote_form', 'key_picker')),
  page_path             text check (char_length(page_path) <= 200),
  utm_source            text check (char_length(utm_source) <= 100),
  utm_medium            text check (char_length(utm_medium) <= 100),
  utm_campaign          text check (char_length(utm_campaign) <= 100),
  gclid                 text check (char_length(gclid) <= 200),

  -- the key and the car (null = "not sure" / not given)
  key_type              text check (key_type in ('blade', 'remote', 'flip', 'smart')),
  has_working_key       text check (has_working_key in ('spare', 'lost')),
  vehicle_year          smallint check (vehicle_year between 1980 and 2100),
  vehicle_make          text check (char_length(vehicle_make) between 1 and 40),
  vehicle_model         text check (char_length(vehicle_model) between 1 and 60),
  ignition              text check (ignition in ('key', 'push')),

  -- where the car is
  town                  text references website.towns (name) on update cascade,
  other_town            text check (char_length(other_town) between 1 and 80),

  -- the person (phone only, no email: the quote is given by phone or text)
  customer_name         text not null check (char_length(customer_name) between 1 and 80),
  phone                 text not null check (phone ~ '^\+1[2-9][0-9]{9}$'),
  details               text check (char_length(details) <= 1000),
  photo_path            text check (char_length(photo_path) <= 300),  -- unused in v1 (photos go by WhatsApp)

  -- CASL proof of consent: which wording (and its text), and when
  consent               boolean not null check (consent),
  consent_version       text not null references website.consent_versions (version),
  consent_text          text not null,
  consent_at            timestamptz not null default now(),
  consent_withdrawn_at  timestamptz,  -- fill in when someone asks us to stop

  -- the owner's workflow
  status                website.lead_status not null default 'new',
  owner_notes           text check (char_length(owner_notes) <= 2000),

  constraint leads_one_town check (town is null or other_town is null)
);

-- columns added after the first draft (no-op on a fresh install)
alter table website.leads add column if not exists client_request_id uuid unique;
alter table website.leads add column if not exists request_hash text;

create index if not exists leads_created_at_idx   on website.leads (created_at desc);
create index if not exists leads_status_idx       on website.leads (status, created_at desc);
create index if not exists leads_phone_recent_idx on website.leads (phone, created_at desc);

-- keep updated_at current when the owner edits a row
create or replace function website.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists leads_touch_updated_at on website.leads;
create trigger leads_touch_updated_at
  before update on website.leads
  for each row execute function website.touch_updated_at();

-- ---------------------------------------------------------------------
-- 4. Row Level Security on, with NO policies: the API roles get nothing,
--    even if a grant is added by mistake later. (Dashboard/postgres and
--    service_role bypass RLS.)
-- ---------------------------------------------------------------------
alter table website.towns            enable row level security;
alter table website.consent_versions enable row level security;
alter table website.settings         enable row level security;
alter table website.leads            enable row level security;

revoke all on all tables    in schema website from public, anon, authenticated;
revoke all on all sequences in schema website from public, anon, authenticated;
revoke all on function website.touch_updated_at() from public, anon, authenticated;

grant select, insert, update on website.leads to service_role;
grant select on website.towns, website.consent_versions to service_role;

-- ---------------------------------------------------------------------
-- 5. The only way in: public.submit_website_lead(secret, lead)
--    SECURITY DEFINER so it can write to the closed schema. It checks the
--    secret first, accepts only known fields, validates everything and
--    rate-limits (per phone and in total). Returns
--    {id, ref, created_at, duplicate, notify, flood_alert}. Errors: 'forbidden',
--    'not_configured', 'rate_limited', 'rate_limited_global', 'invalid:<field>'.
-- ---------------------------------------------------------------------
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
                    'consent', 'consent_version', 'client_request_id')
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
    select l.id, l.ref, l.request_hash, l.created_at into v_id, v_ref, v_old_hash, v_created
    from website.leads l where l.client_request_id = v_req;
    if v_id is not null then
      if v_old_hash is not distinct from v_req_hash then
        return jsonb_build_object('id', v_id, 'ref', v_ref, 'created_at', v_created,
                                  'duplicate', true, 'notify', true, 'flood_alert', false);
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
      consent, consent_version, consent_text, client_request_id, request_hash
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
      v_req_hash
    )
    returning id, ref, created_at into v_id, v_ref, v_created;
  exception
    when check_violation or not_null_violation or foreign_key_violation
         or invalid_text_representation or string_data_right_truncation then
      get stacked diagnostics v_con = constraint_name, v_col = column_name;
      raise exception 'invalid:%', coalesce(nullif(v_con, ''), nullif(v_col, ''), 'lead') using errcode = '22023';
    when unique_violation then
      -- the same client_request_id raced in: return the stored lead
      select l.id, l.ref, l.created_at into v_id, v_ref, v_created from website.leads l where l.client_request_id = v_req;
      if v_id is null then raise; end if;
      return jsonb_build_object('id', v_id, 'ref', v_ref, 'created_at', v_created,
                                'duplicate', true, 'notify', true, 'flood_alert', false);
  end;

  return jsonb_build_object('id', v_id, 'ref', v_ref, 'created_at', v_created,
                            'duplicate', false, 'notify', v_notify, 'flood_alert', v_flood);
end;
$$;

revoke all on function public.submit_website_lead(text, jsonb) from public;
revoke all on function public.submit_website_lead(text, jsonb) from anon, authenticated;
grant execute on function public.submit_website_lead(text, jsonb) to anon, service_role;

comment on function public.submit_website_lead(text, jsonb) is
  'KeyFoby website: the only write path into website.leads. Requires the ingest secret (hash in website.settings). Called by the Vercel lead function.';

commit;

-- =====================================================================
-- STEP AFTER RUNNING (once, separately):
--
-- 1. On your Mac, make a random secret and its hash. The secret goes into
--    Vercel as LEAD_INGEST_SECRET; only the HASH goes into Supabase:
--
--      SECRET=$(openssl rand -hex 32); printf %s "$SECRET" | pbcopy
--      printf %s "$SECRET" | shasum -a 256 | cut -d' ' -f1
--
--    (line 1 copies the secret to your clipboard: paste it into a password
--     manager now; line 2 prints the 64-character hash)
--
-- 2. In the Supabase SQL editor, run (paste the HASH, not the secret):
--
--      insert into website.settings (key, value)
--      values ('ingest_secret_sha256', 'PASTE_THE_64_CHARACTER_HASH_HERE')
--      on conflict (key) do update set value = excluded.value, updated_at = now();
--
-- 3. Run 2026-11-07_01_website_leads_verify.sql: every row should say true.
-- =====================================================================
