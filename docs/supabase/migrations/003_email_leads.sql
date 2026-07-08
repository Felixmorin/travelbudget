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

create index if not exists email_leads_created_at_idx on email_leads (created_at desc);
create index if not exists email_leads_email_idx on email_leads (email);

alter table email_leads enable row level security;

drop policy if exists "server role manages email leads" on email_leads;

create policy "server role manages email leads"
  on email_leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
