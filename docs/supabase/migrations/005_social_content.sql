-- Social content agent metadata and review model.
-- The MVP does not publish automatically. Publication rows are future-facing audit records only.

create table if not exists content_topics (
  id uuid primary key,
  title text not null,
  template text not null check (template in ('three_destinations', 'destination_cost', 'destination_comparison', 'daily_budget')),
  origin_code text not null,
  destination_slugs text[] not null default '{}',
  budget numeric not null check (budget > 0),
  currency text not null check (currency in ('CAD', 'USD', 'EUR', 'GBP')),
  duration_days integer not null check (duration_days between 1 and 60),
  language text not null check (language in ('fr', 'en')),
  platform text not null check (platform in ('tiktok', 'instagram')),
  score numeric not null check (score >= 0 and score <= 100),
  landing_page_path text not null,
  reasons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists content_generations (
  id uuid primary key,
  run_id uuid not null,
  status text not null check (status in (
    'draft',
    'topic_selected',
    'data_validated',
    'script_generated',
    'assets_ready',
    'rendering',
    'ready_for_review',
    'approved',
    'rejected',
    'published',
    'failed'
  )),
  request jsonb not null,
  topic_id uuid references content_topics (id) on delete set null,
  budget_breakdown jsonb,
  hook text,
  script text,
  scenes jsonb not null default '[]'::jsonb,
  captions jsonb,
  landing_page_url text,
  video_path text,
  thumbnail_path text,
  warnings jsonb not null default '[]'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  cost_estimate_usd numeric not null default 0 check (cost_estimate_usd >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_assets (
  id uuid primary key,
  content_id uuid not null references content_generations (id) on delete cascade,
  asset_type text not null check (asset_type in ('voice', 'visual', 'subtitle', 'video', 'thumbnail', 'music', 'metadata')),
  path text,
  source_url text,
  source_license text,
  provider text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists content_scripts (
  id uuid primary key,
  content_id uuid not null references content_generations (id) on delete cascade,
  language text not null check (language in ('fr', 'en')),
  template text not null,
  hook text not null,
  script text not null,
  numeric_claims jsonb not null default '[]'::jsonb,
  validation_warnings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists content_reviews (
  id uuid primary key,
  content_id uuid not null references content_generations (id) on delete cascade,
  decision text check (decision in ('approved', 'rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_publications (
  id uuid primary key,
  content_id uuid not null references content_generations (id) on delete cascade,
  platform text not null check (platform in ('tiktok', 'instagram')),
  mode text not null default 'simulation' check (mode in ('simulation', 'official_api')),
  status text not null check (status in ('queued', 'published', 'failed')),
  external_id text,
  external_url text,
  error text,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists content_metrics (
  id uuid primary key,
  content_id uuid not null references content_generations (id) on delete cascade,
  platform text not null check (platform in ('tiktok', 'instagram')),
  views integer,
  reach integer,
  watch_time_seconds numeric,
  average_watch_seconds numeric,
  retention_3s_rate numeric,
  completion_rate numeric,
  likes integer,
  comments integer,
  shares integer,
  saves integer,
  profile_visits integer,
  gobybudget_clicks integer,
  gobybudget_searches integer,
  conversions integer,
  attributed_revenue numeric,
  collected_at timestamptz not null default now()
);

create table if not exists content_experiments (
  id uuid primary key,
  content_id uuid not null references content_generations (id) on delete cascade,
  dimension text not null,
  variant text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists content_topics_created_at_idx on content_topics (created_at desc);
create index if not exists content_topics_template_idx on content_topics (template);
create index if not exists content_generations_created_at_idx on content_generations (created_at desc);
create index if not exists content_generations_status_idx on content_generations (status);
create index if not exists content_generations_run_id_idx on content_generations (run_id);
create index if not exists content_assets_content_idx on content_assets (content_id);
create index if not exists content_scripts_content_idx on content_scripts (content_id);
create index if not exists content_reviews_content_idx on content_reviews (content_id);
create index if not exists content_publications_content_idx on content_publications (content_id);
create index if not exists content_metrics_content_collected_idx on content_metrics (content_id, collected_at desc);
create index if not exists content_experiments_content_idx on content_experiments (content_id);

alter table content_topics enable row level security;
alter table content_generations enable row level security;
alter table content_assets enable row level security;
alter table content_scripts enable row level security;
alter table content_reviews enable row level security;
alter table content_publications enable row level security;
alter table content_metrics enable row level security;
alter table content_experiments enable row level security;

drop policy if exists "server role manages content topics" on content_topics;
drop policy if exists "server role manages content generations" on content_generations;
drop policy if exists "server role manages content assets" on content_assets;
drop policy if exists "server role manages content scripts" on content_scripts;
drop policy if exists "server role manages content reviews" on content_reviews;
drop policy if exists "server role manages content publications" on content_publications;
drop policy if exists "server role manages content metrics" on content_metrics;
drop policy if exists "server role manages content experiments" on content_experiments;

create policy "server role manages content topics"
  on content_topics for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages content generations"
  on content_generations for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages content assets"
  on content_assets for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages content scripts"
  on content_scripts for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages content reviews"
  on content_reviews for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages content publications"
  on content_publications for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages content metrics"
  on content_metrics for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages content experiments"
  on content_experiments for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
