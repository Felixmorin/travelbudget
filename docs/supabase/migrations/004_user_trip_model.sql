-- Minimal authenticated user trip model.
-- Requires Supabase Auth. User-owned tables use auth.uid() for RLS isolation.

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_destinations (
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

create table if not exists public.searches (
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

create table if not exists public.search_criteria (
  id uuid primary key default gen_random_uuid(),
  search_id uuid not null references public.searches (id) on delete cascade,
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

create table if not exists public.saved_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  search_id uuid references public.searches (id) on delete set null,
  destination_id uuid references public.saved_destinations (id) on delete set null,
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

create index if not exists user_profiles_email_idx on public.user_profiles (email);
create index if not exists saved_destinations_user_created_idx on public.saved_destinations (user_id, created_at desc);
create index if not exists searches_user_created_idx on public.searches (user_id, created_at desc);
create index if not exists search_criteria_user_idx on public.search_criteria (user_id);
create index if not exists saved_trips_user_created_idx on public.saved_trips (user_id, created_at desc);
create index if not exists saved_trips_user_destination_idx on public.saved_trips (user_id, destination_slug);

alter table public.user_profiles enable row level security;
alter table public.saved_destinations enable row level security;
alter table public.searches enable row level security;
alter table public.search_criteria enable row level security;
alter table public.saved_trips enable row level security;

drop policy if exists "users manage own profile" on public.user_profiles;
drop policy if exists "users manage own saved destinations" on public.saved_destinations;
drop policy if exists "users manage own searches" on public.searches;
drop policy if exists "users manage own search criteria" on public.search_criteria;
drop policy if exists "users manage own saved trips" on public.saved_trips;
drop policy if exists "service role manages user profiles" on public.user_profiles;
drop policy if exists "service role manages saved destinations" on public.saved_destinations;
drop policy if exists "service role manages searches" on public.searches;
drop policy if exists "service role manages search criteria" on public.search_criteria;
drop policy if exists "service role manages saved trips" on public.saved_trips;

create policy "users manage own profile"
  on public.user_profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users manage own saved destinations"
  on public.saved_destinations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own searches"
  on public.searches
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own search criteria"
  on public.search_criteria
  for all
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.searches
      where searches.id = search_criteria.search_id
      and searches.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.searches
      where searches.id = search_criteria.search_id
      and searches.user_id = auth.uid()
    )
  );

create policy "users manage own saved trips"
  on public.saved_trips
  for all
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      search_id is null
      or exists (
        select 1 from public.searches
        where searches.id = saved_trips.search_id
        and searches.user_id = auth.uid()
      )
    )
    and (
      destination_id is null
      or exists (
        select 1 from public.saved_destinations
        where saved_destinations.id = saved_trips.destination_id
        and saved_destinations.user_id = auth.uid()
      )
    )
  );

create policy "service role manages user profiles"
  on public.user_profiles
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role manages saved destinations"
  on public.saved_destinations
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role manages searches"
  on public.searches
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role manages search criteria"
  on public.search_criteria
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role manages saved trips"
  on public.saved_trips
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
