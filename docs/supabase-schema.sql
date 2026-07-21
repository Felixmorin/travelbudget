-- Aggregate Supabase schema. For production deploys, prefer applying the
-- versioned files in docs/supabase/migrations in lexical order.

create table if not exists affiliate_clicks (
  id uuid primary key,
  destination_slug text,
  affiliate_type text,
  affiliate_partner text,
  affiliate_provider text,
  href text not null,
  source text,
  page text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists analytics_events (
  id uuid primary key,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  pathname text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists email_leads (
  id uuid primary key,
  email text not null,
  label text,
  page text,
  source text,
  cta_location text,
  budget numeric,
  currency text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists trip_budget_leads (
  id uuid primary key,
  email text not null,
  origin text,
  destination text,
  budget_amount numeric,
  budget_currency text,
  trip_duration_days integer,
  travel_style text,
  traveler_count integer,
  estimated_total numeric,
  flight_estimate numeric,
  hotel_estimate numeric,
  food_estimate numeric,
  transport_estimate numeric,
  activities_estimate numeric,
  buffer_estimate numeric,
  result_payload jsonb not null,
  source_page text,
  marketing_consent boolean not null default false,
  budget_email_consent boolean not null,
  consent_timestamp timestamptz not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  referrer text,
  created_at timestamptz not null default now(),
  email_sent_at timestamptz,
  email_status text not null default 'pending',
  email_provider_id text,
  submission_fingerprint text not null,
  constraint trip_budget_leads_email_status_check
    check (email_status in ('pending', 'sent', 'failed', 'skipped'))
);

create table if not exists user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists saved_destinations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  destination_slug text not null,
  destination_name text not null,
  country_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, destination_slug)
);

create table if not exists searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  origin_code text not null,
  budget numeric not null check (budget >= 0),
  currency text not null check (currency in ('CAD', 'USD', 'EUR', 'GBP')),
  duration_days integer not null check (duration_days between 1 and 60),
  travelers integer not null check (travelers between 1 and 12),
  travel_style text not null check (travel_style in ('budget', 'balanced', 'comfort')),
  travel_month text,
  created_at timestamptz not null default now()
);

create table if not exists search_criteria (
  id uuid primary key default gen_random_uuid(),
  search_id uuid not null references searches (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  category text,
  continent text,
  climate text,
  destination_query text,
  max_flight_time text,
  visa_friendly boolean,
  sort_order text,
  created_at timestamptz not null default now(),
  unique (search_id)
);

create table if not exists saved_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  search_id uuid references searches (id) on delete set null,
  destination_id uuid references saved_destinations (id) on delete set null,
  destination_slug text not null,
  destination_name text not null,
  origin_code text not null,
  budget numeric not null check (budget >= 0),
  currency text not null check (currency in ('CAD', 'USD', 'EUR', 'GBP')),
  duration_days integer not null check (duration_days between 1 and 60),
  travelers integer not null check (travelers between 1 and 12),
  travel_style text not null check (travel_style in ('budget', 'balanced', 'comfort')),
  estimated_total numeric not null check (estimated_total >= 0),
  estimate_snapshot jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists affiliate_clicks_created_at_idx on affiliate_clicks (created_at desc);
create index if not exists affiliate_clicks_destination_idx on affiliate_clicks (destination_slug);
create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);
create index if not exists analytics_events_name_idx on analytics_events (event_name);
create index if not exists email_leads_created_at_idx on email_leads (created_at desc);
create index if not exists email_leads_email_idx on email_leads (email);
create index if not exists trip_budget_leads_email_idx on trip_budget_leads (email);
create index if not exists trip_budget_leads_created_at_idx on trip_budget_leads (created_at desc);
create index if not exists trip_budget_leads_email_status_idx on trip_budget_leads (email_status);
create index if not exists trip_budget_leads_marketing_consent_idx on trip_budget_leads (marketing_consent);
create index if not exists trip_budget_leads_submission_fingerprint_idx on trip_budget_leads (submission_fingerprint);
create index if not exists user_profiles_email_idx on user_profiles (email);
create index if not exists saved_destinations_user_created_idx on saved_destinations (user_id, created_at desc);
create index if not exists searches_user_created_idx on searches (user_id, created_at desc);
create index if not exists search_criteria_user_idx on search_criteria (user_id);
create index if not exists saved_trips_user_created_idx on saved_trips (user_id, created_at desc);
create index if not exists saved_trips_user_destination_idx on saved_trips (user_id, destination_slug);

alter table affiliate_clicks enable row level security;
alter table analytics_events enable row level security;
alter table email_leads enable row level security;
alter table trip_budget_leads enable row level security;
alter table user_profiles enable row level security;
alter table saved_destinations enable row level security;
alter table searches enable row level security;
alter table search_criteria enable row level security;
alter table saved_trips enable row level security;

drop policy if exists "server role manages affiliate clicks" on affiliate_clicks;
drop policy if exists "server role manages analytics events" on analytics_events;
drop policy if exists "server role manages email leads" on email_leads;
drop policy if exists "server role manages trip budget leads" on trip_budget_leads;
drop policy if exists "users manage own profile" on user_profiles;
drop policy if exists "users manage own saved destinations" on saved_destinations;
drop policy if exists "users manage own searches" on searches;
drop policy if exists "users manage own search criteria" on search_criteria;
drop policy if exists "users manage own saved trips" on saved_trips;

create policy "server role manages affiliate clicks"
  on affiliate_clicks
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages analytics events"
  on analytics_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages email leads"
  on email_leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages trip budget leads"
  on trip_budget_leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "users manage own profile"
  on user_profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users manage own saved destinations"
  on saved_destinations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own searches"
  on searches
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own search criteria"
  on search_criteria
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own saved trips"
  on saved_trips
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
