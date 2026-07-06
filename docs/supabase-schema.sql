create table if not exists leads (
  id uuid primary key,
  email text not null,
  intent text not null,
  destination text,
  origin text,
  budget numeric,
  duration integer,
  source text,
  pathname text,
  created_at timestamptz not null default now()
);

create table if not exists saved_trips (
  id uuid primary key,
  email text not null,
  destination_slug text not null,
  source text,
  pathname text,
  created_at timestamptz not null default now(),
  unique (email, destination_slug)
);

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

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists saved_trips_email_idx on saved_trips (email);
create index if not exists affiliate_clicks_created_at_idx on affiliate_clicks (created_at desc);
create index if not exists affiliate_clicks_destination_idx on affiliate_clicks (destination_slug);
create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);
create index if not exists analytics_events_name_idx on analytics_events (event_name);
