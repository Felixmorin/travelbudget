create table if not exists agent_runtime_controls (
  id uuid primary key,
  control_key text not null,
  is_enabled boolean not null,
  reason text,
  requested_by text,
  created_at timestamptz not null default now()
);

create index if not exists agent_runtime_controls_key_created_at_idx
  on agent_runtime_controls (control_key, created_at desc);

alter table agent_runtime_controls enable row level security;

drop policy if exists "server role manages agent runtime controls" on agent_runtime_controls;

create policy "server role manages agent runtime controls"
  on agent_runtime_controls
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
