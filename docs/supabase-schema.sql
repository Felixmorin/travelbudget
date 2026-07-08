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

create index if not exists affiliate_clicks_created_at_idx on affiliate_clicks (created_at desc);
create index if not exists affiliate_clicks_destination_idx on affiliate_clicks (destination_slug);
create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);
create index if not exists analytics_events_name_idx on analytics_events (event_name);
create index if not exists email_leads_created_at_idx on email_leads (created_at desc);
create index if not exists email_leads_email_idx on email_leads (email);

alter table affiliate_clicks enable row level security;
alter table analytics_events enable row level security;
alter table email_leads enable row level security;

drop policy if exists "server role manages affiliate clicks" on affiliate_clicks;
drop policy if exists "server role manages analytics events" on analytics_events;
drop policy if exists "server role manages email leads" on email_leads;

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
