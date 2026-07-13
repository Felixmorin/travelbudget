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

create table if not exists agent_definitions (
  id text primary key,
  name text not null,
  description text not null,
  version text not null,
  status text not null,
  permissions jsonb not null default '[]'::jsonb,
  default_cost_limit_cents integer not null,
  default_step_limit integer not null,
  requires_approval_for jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agent_missions (
  id uuid primary key,
  agent_id text not null,
  objective text not null,
  status text not null,
  requested_by text,
  input jsonb not null default '{}'::jsonb,
  cost_limit_cents integer not null,
  step_limit integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agent_executions (
  id uuid primary key,
  mission_id uuid not null,
  agent_id text not null,
  status text not null,
  trigger_type text not null,
  model text,
  step_count integer not null default 0,
  estimated_cost_cents integer not null default 0,
  output jsonb,
  error text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists agent_approvals (
  id uuid primary key,
  mission_id uuid,
  execution_id uuid,
  tool_call_id uuid,
  action_type text not null,
  status text not null,
  requested_by text,
  reviewed_by text,
  reason text,
  requested_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  expires_at timestamptz
);

create table if not exists agent_tool_calls (
  id uuid primary key,
  execution_id uuid not null,
  tool_name text not null,
  permission text not null,
  status text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  requires_approval boolean not null default false,
  approval_id uuid,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  estimated_cost_cents integer not null default 0,
  error text
);

create table if not exists agent_logs (
  id uuid primary key,
  mission_id uuid,
  execution_id uuid,
  level text not null,
  event_name text not null,
  message text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists agent_runtime_controls (
  id uuid primary key,
  control_key text not null,
  is_enabled boolean not null,
  reason text,
  requested_by text,
  created_at timestamptz not null default now()
);

create index if not exists affiliate_clicks_created_at_idx on affiliate_clicks (created_at desc);
create index if not exists affiliate_clicks_destination_idx on affiliate_clicks (destination_slug);
create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc);
create index if not exists analytics_events_name_idx on analytics_events (event_name);
create index if not exists email_leads_created_at_idx on email_leads (created_at desc);
create index if not exists email_leads_email_idx on email_leads (email);
create index if not exists agent_missions_agent_idx on agent_missions (agent_id);
create index if not exists agent_missions_created_at_idx on agent_missions (created_at desc);
create index if not exists agent_missions_status_idx on agent_missions (status);
create index if not exists agent_executions_mission_idx on agent_executions (mission_id);
create index if not exists agent_executions_started_at_idx on agent_executions (started_at desc);
create index if not exists agent_tool_calls_execution_idx on agent_tool_calls (execution_id);
create index if not exists agent_tool_calls_status_idx on agent_tool_calls (status);
create index if not exists agent_approvals_status_idx on agent_approvals (status);
create index if not exists agent_approvals_created_at_idx on agent_approvals (created_at desc);
create index if not exists agent_logs_execution_idx on agent_logs (execution_id);
create index if not exists agent_logs_created_at_idx on agent_logs (created_at desc);
create index if not exists agent_runtime_controls_key_created_at_idx on agent_runtime_controls (control_key, created_at desc);

alter table affiliate_clicks enable row level security;
alter table analytics_events enable row level security;
alter table email_leads enable row level security;
alter table agent_definitions enable row level security;
alter table agent_missions enable row level security;
alter table agent_executions enable row level security;
alter table agent_tool_calls enable row level security;
alter table agent_approvals enable row level security;
alter table agent_logs enable row level security;
alter table agent_runtime_controls enable row level security;

drop policy if exists "server role manages affiliate clicks" on affiliate_clicks;
drop policy if exists "server role manages analytics events" on analytics_events;
drop policy if exists "server role manages email leads" on email_leads;
drop policy if exists "server role manages agent definitions" on agent_definitions;
drop policy if exists "server role manages agent missions" on agent_missions;
drop policy if exists "server role manages agent executions" on agent_executions;
drop policy if exists "server role manages agent tool calls" on agent_tool_calls;
drop policy if exists "server role manages agent approvals" on agent_approvals;
drop policy if exists "server role manages agent logs" on agent_logs;
drop policy if exists "server role manages agent runtime controls" on agent_runtime_controls;

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

create policy "server role manages agent definitions"
  on agent_definitions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages agent missions"
  on agent_missions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages agent executions"
  on agent_executions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages agent tool calls"
  on agent_tool_calls
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages agent approvals"
  on agent_approvals
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages agent logs"
  on agent_logs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "server role manages agent runtime controls"
  on agent_runtime_controls
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
