-- 001_init.sql — Supabase schema for Admin Nexus + dmagent

-- Optional extensions
-- create extension if not exists pg_trgm;
-- create extension if not exists vector;

create table if not exists business_brains (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists brain_facts (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid not null references business_brains(id) on delete cascade,
  key text not null,
  value jsonb not null,
  source text,
  confidence numeric,
  last_verified_at timestamptz,
  created_at timestamptz default now(),
  fts tsvector generated always as (
    to_tsvector('english',
      coalesce(key,'') || ' ' || coalesce(value::text,'') || ' ' || coalesce(source,'')
    )
  ) stored
);
create index if not exists brain_facts_brain_id_idx on brain_facts (brain_id);
create index if not exists brain_facts_fts_idx on brain_facts using gin (fts);

create table if not exists brand_rules (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid not null references business_brains(id) on delete cascade,
  rule_type text not null,
  content jsonb not null,
  created_at timestamptz default now()
);

create table if not exists knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid not null references business_brains(id) on delete cascade,
  type text not null,      -- url|sitemap|feed|drive|manual
  config jsonb not null,
  status text default 'idle',
  last_ingested_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists ingest_jobs (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid not null references business_brains(id) on delete cascade,
  source_id uuid references knowledge_sources(id) on delete set null,
  status text not null default 'queued',
  progress numeric default 0,
  logs text,
  created_at timestamptz default now(),
  finished_at timestamptz
);
create index if not exists ingest_jobs_brain_id_created_idx on ingest_jobs (brain_id, created_at desc);

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid references business_brains(id) on delete set null,
  name text not null,
  system_prompt text not null,
  flags jsonb default '{}'::jsonb,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists agent_training_examples (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  input text not null,
  expected text not null,
  label text not null check (label in ('pos','neg')),
  created_at timestamptz default now()
);

create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  type text not null check (type in ('train','eval')),
  status text not null default 'queued',
  metrics jsonb,
  started_at timestamptz,
  finished_at timestamptz
);
create index if not exists agent_runs_agent_started_idx on agent_runs (agent_id, started_at desc);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete set null,
  user_id uuid references auth.users(id),
  title text,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content jsonb not null,
  tokens int,
  created_at timestamptz default now()
);
create index if not exists messages_conv_created_idx on messages (conversation_id, created_at);

create table if not exists agent_feedback (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete cascade,
  message_id uuid references messages(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  auth jsonb,
  status text default 'disconnected',
  connected_at timestamptz,
  last_checked_at timestamptz
);

create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  spec jsonb not null,
  enabled boolean default true,
  created_at timestamptz default now()
);

create table if not exists workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references workflows(id) on delete cascade,
  status text not null default 'queued',
  progress numeric default 0,
  logs text,
  metrics jsonb,
  started_at timestamptz,
  finished_at timestamptz
);

create table if not exists telemetry_events (
  id uuid primary key default gen_random_uuid(),
  area text not null,
  name text not null,
  payload jsonb,
  created_at timestamptz default now()
);

alter table if exists posts
  add column if not exists status text default 'draft',
  add column if not exists author_id uuid references auth.users(id),
  add column if not exists brain_snapshot jsonb,
  add column if not exists seo jsonb,
  add column if not exists published_at timestamptz;
create index if not exists posts_status_pub_idx on posts (status, published_at desc);

-- RLS starter: admin-only by JWT 'role' claim
do $$
declare tbl text;
begin
  for tbl in
    select unnest(array[
      'business_brains','brain_facts','brand_rules','knowledge_sources','ingest_jobs',
      'agents','agent_training_examples','agent_runs','conversations','messages','agent_feedback',
      'integrations','workflows','workflow_runs','telemetry_events'
    ])
  loop
    execute format('alter table %I enable row level security;', tbl);
    execute format($p$
      drop policy if exists admin_all_access on %I;
      create policy admin_all_access on %I
      for all using (coalesce(current_setting(''request.jwt.claims'', true)::jsonb->>'role','''') = 'admin')
      with check (coalesce(current_setting(''request.jwt.claims'', true)::jsonb->>'role','''') = 'admin');
    $p$, tbl, tbl);
  end loop;
end $$;
