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

create index if not exists trip_budget_leads_email_idx on trip_budget_leads (email);
create index if not exists trip_budget_leads_created_at_idx on trip_budget_leads (created_at desc);
create index if not exists trip_budget_leads_email_status_idx on trip_budget_leads (email_status);
create index if not exists trip_budget_leads_marketing_consent_idx on trip_budget_leads (marketing_consent);
create index if not exists trip_budget_leads_submission_fingerprint_idx on trip_budget_leads (submission_fingerprint);

alter table trip_budget_leads enable row level security;

drop policy if exists "server role manages trip budget leads" on trip_budget_leads;

create policy "server role manages trip budget leads"
  on trip_budget_leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
