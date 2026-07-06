alter table leads enable row level security;
alter table saved_trips enable row level security;
alter table affiliate_clicks enable row level security;
alter table analytics_events enable row level security;

drop policy if exists "server role manages leads" on leads;
drop policy if exists "server role manages saved trips" on saved_trips;
drop policy if exists "server role manages affiliate clicks" on affiliate_clicks;
drop policy if exists "server role manages analytics events" on analytics_events;

create policy "server role manages leads"
  on leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages saved trips"
  on saved_trips
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

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
