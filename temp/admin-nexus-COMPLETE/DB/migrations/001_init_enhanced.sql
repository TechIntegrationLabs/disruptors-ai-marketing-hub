-- ========================================
-- Admin Nexus + dmagent - Enhanced Schema
-- Complete with tables, RPCs, RLS, and seed data
-- ========================================

-- Extensions (optional, uncomment if needed)
-- create extension if not exists pg_trgm;      -- for fuzzy search
-- create extension if not exists vector;       -- for semantic search (Phase 3)

-- ========================================
-- Core Tables
-- ========================================

-- Business Brains (one per site or client)
create table if not exists business_brains (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Brain Facts (knowledge base with FTS)
create table if not exists brain_facts (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid not null references business_brains(id) on delete cascade,
  key text not null,
  value jsonb not null,
  source text,
  confidence numeric check (confidence >= 0 and confidence <= 1),
  last_verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Full-text search vector (auto-generated)
  fts tsvector generated always as (
    to_tsvector('english',
      coalesce(key,'') || ' ' ||
      coalesce(value::text,'') || ' ' ||
      coalesce(source,'')
    )
  ) stored

  -- Optional: embedding vector(1536) for semantic search (add in Phase 3)
);

-- Indexes for brain_facts
create index if not exists brain_facts_brain_id_idx on brain_facts (brain_id);
create index if not exists brain_facts_fts_idx on brain_facts using gin (fts);
create index if not exists brain_facts_updated_idx on brain_facts (brain_id, updated_at desc);

-- Brand Rules (voice, style, tone guidelines)
create table if not exists brand_rules (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid not null references business_brains(id) on delete cascade,
  rule_type text not null check (rule_type in ('style', 'voice', 'tone', 'lexicon', 'examples', 'taboos')),
  content jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists brand_rules_brain_type_idx on brand_rules (brain_id, rule_type);

-- Knowledge Sources (URLs, sitemaps, feeds to ingest)
create table if not exists knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid not null references business_brains(id) on delete cascade,
  type text not null check (type in ('url', 'sitemap', 'feed', 'drive', 'manual')),
  config jsonb not null,  -- {url, include, exclude, schedule, etc}
  status text default 'idle' check (status in ('idle', 'active', 'paused', 'error')),
  last_ingested_at timestamptz,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists knowledge_sources_brain_idx on knowledge_sources (brain_id);

-- Ingest Jobs (tracking crawl/extract operations)
create table if not exists ingest_jobs (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid not null references business_brains(id) on delete cascade,
  source_id uuid references knowledge_sources(id) on delete set null,
  status text not null default 'queued' check (status in ('queued', 'running', 'success', 'failed', 'cancelled')),
  progress numeric default 0 check (progress >= 0 and progress <= 100),
  logs text,
  facts_added int default 0,
  facts_updated int default 0,
  created_at timestamptz default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create index if not exists ingest_jobs_brain_created_idx on ingest_jobs (brain_id, created_at desc);
create index if not exists ingest_jobs_status_idx on ingest_jobs (status, created_at desc);

-- ========================================
-- Agent Tables
-- ========================================

-- Agents (AI personas with prompts)
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  brain_id uuid references business_brains(id) on delete set null,
  name text not null,
  system_prompt text not null,
  flags jsonb default '{}'::jsonb,  -- {temperature, max_tokens, model, etc}
  status text default 'active' check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists agents_brain_idx on agents (brain_id);
create index if not exists agents_status_idx on agents (status);

-- Agent Training Examples (for prompt improvement)
create table if not exists agent_training_examples (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  input text not null,
  expected text not null,
  label text not null check (label in ('pos', 'neg')),
  created_at timestamptz default now()
);

create index if not exists agent_training_examples_agent_idx on agent_training_examples (agent_id);

-- Agent Runs (training/eval history)
create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  type text not null check (type in ('train', 'eval')),
  status text not null default 'queued' check (status in ('queued', 'running', 'success', 'failed')),
  metrics jsonb,  -- {accuracy, latency, tokens, etc}
  started_at timestamptz,
  finished_at timestamptz
);

create index if not exists agent_runs_agent_started_idx on agent_runs (agent_id, started_at desc);

-- Conversations (chat sessions)
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete set null,
  user_id uuid references auth.users(id),
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists conversations_user_idx on conversations (user_id, created_at desc);

-- Messages (individual chat messages)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content jsonb not null,  -- {text, tools, attachments}
  tokens int,
  created_at timestamptz default now()
);

create index if not exists messages_conv_created_idx on messages (conversation_id, created_at);

-- Agent Feedback (thumbs up/down on messages)
create table if not exists agent_feedback (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete cascade,
  message_id uuid references messages(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create index if not exists agent_feedback_agent_idx on agent_feedback (agent_id, created_at desc);

-- ========================================
-- Ops Tables (Workflows, Integrations, Telemetry)
-- ========================================

-- Integrations (OAuth-based third-party connections)
create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  kind text not null,  -- ga4, gsc, meta, hubspot, etc
  auth jsonb,          -- {access_token, refresh_token, expires_at}
  status text default 'disconnected' check (status in ('connected', 'disconnected', 'error')),
  connected_at timestamptz,
  last_checked_at timestamptz,
  error_message text,
  created_at timestamptz default now()
);

create index if not exists integrations_kind_idx on integrations (kind);

-- Workflows (JSON-defined automation pipelines)
create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  spec jsonb not null,  -- {steps: [{type, config}, ...]}
  enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Workflow Runs (execution history)
create table if not exists workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references workflows(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'running', 'success', 'failed', 'cancelled')),
  progress numeric default 0 check (progress >= 0 and progress <= 100),
  logs text,
  metrics jsonb,
  started_at timestamptz,
  finished_at timestamptz
);

create index if not exists workflow_runs_workflow_started_idx on workflow_runs (workflow_id, started_at desc);

-- Telemetry Events (system-wide logging)
create table if not exists telemetry_events (
  id uuid primary key default gen_random_uuid(),
  area text not null,  -- agents, ingest, ui, errors
  name text not null,
  payload jsonb,
  created_at timestamptz default now()
);

create index if not exists telemetry_events_area_created_idx on telemetry_events (area, created_at desc);

-- ========================================
-- Posts Enhancement (existing table)
-- ========================================

-- Enhance existing posts table for agent-generated content
alter table if exists posts
  add column if not exists status text default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  add column if not exists author_id uuid references auth.users(id),
  add column if not exists brain_snapshot jsonb,  -- cached brain facts used
  add column if not exists seo jsonb,             -- {title, description, slug, keywords}
  add column if not exists published_at timestamptz;

create index if not exists posts_status_pub_idx on posts (status, published_at desc nulls last);

-- ========================================
-- Database Functions (RPCs)
-- ========================================

-- Full-text search on brain facts
create or replace function search_brain_facts(
  brain_id uuid,
  q text,
  limit_count int default 50
)
returns table (
  id uuid,
  key text,
  value jsonb,
  source text,
  confidence numeric,
  last_verified_at timestamptz,
  rank real
)
language plpgsql
stable
as $$
begin
  return query
  select
    bf.id,
    bf.key,
    bf.value,
    bf.source,
    bf.confidence,
    bf.last_verified_at,
    ts_rank(bf.fts, plainto_tsquery('english', q)) as rank
  from brain_facts bf
  where bf.brain_id = $1
    and (q = '' or q is null or bf.fts @@ plainto_tsquery('english', q))
  order by
    rank desc,
    bf.confidence desc nulls last,
    bf.last_verified_at desc nulls last
  limit limit_count;
end;
$$;

-- Append feedback (streamlined)
create or replace function append_feedback(
  p_agent_id uuid,
  p_conversation_id uuid,
  p_message_id uuid,
  p_rating int,
  p_comment text default null
)
returns uuid
language plpgsql
as $$
declare
  feedback_id uuid;
begin
  insert into agent_feedback (agent_id, conversation_id, message_id, rating, comment)
  values (p_agent_id, p_conversation_id, p_message_id, p_rating, p_comment)
  returning id into feedback_id;

  return feedback_id;
end;
$$;

-- Get brain health metrics
create or replace function get_brain_health(brain_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  result jsonb;
  total_facts int;
  verified_facts int;
  stale_facts int;
  avg_confidence numeric;
  last_ingest timestamptz;
begin
  -- Count facts
  select count(*) into total_facts
  from brain_facts bf
  where bf.brain_id = $1;

  -- Count verified facts
  select count(*) into verified_facts
  from brain_facts bf
  where bf.brain_id = $1 and bf.last_verified_at is not null;

  -- Count stale facts (>30 days since verification)
  select count(*) into stale_facts
  from brain_facts bf
  where bf.brain_id = $1
    and (bf.last_verified_at is null or bf.last_verified_at < now() - interval '30 days');

  -- Average confidence
  select avg(confidence) into avg_confidence
  from brain_facts bf
  where bf.brain_id = $1 and bf.confidence is not null;

  -- Last ingestion
  select max(last_ingested_at) into last_ingest
  from knowledge_sources ks
  where ks.brain_id = $1;

  result := jsonb_build_object(
    'total_facts', total_facts,
    'verified_facts', verified_facts,
    'verified_percentage', case when total_facts > 0 then round((verified_facts::numeric / total_facts) * 100, 2) else 0 end,
    'stale_facts', stale_facts,
    'avg_confidence', round(avg_confidence, 2),
    'last_ingest', last_ingest
  );

  return result;
end;
$$;

-- ========================================
-- Row Level Security (RLS)
-- ========================================

-- Enable RLS on all tables
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'business_brains', 'brain_facts', 'brand_rules', 'knowledge_sources', 'ingest_jobs',
      'agents', 'agent_training_examples', 'agent_runs', 'conversations', 'messages', 'agent_feedback',
      'integrations', 'workflows', 'workflow_runs', 'telemetry_events'
    ])
  loop
    execute format('alter table %I enable row level security;', tbl);

    -- Admin-only policy (JWT claim 'role' = 'admin')
    execute format($p$
      drop policy if exists admin_all_access on %I;
      create policy admin_all_access on %I
        for all
        using (
          coalesce(
            (current_setting('request.jwt.claims', true)::jsonb->>'role'),
            ''
          ) = 'admin'
        )
        with check (
          coalesce(
            (current_setting('request.jwt.claims', true)::jsonb->>'role'),
            ''
          ) = 'admin'
        );
    $p$, tbl, tbl);
  end loop;
end $$;

-- ========================================
-- Seed Data
-- ========================================

-- Default business brain
insert into business_brains (slug, name, description)
values (
  'default',
  'Disruptors AI Brain',
  'Primary knowledge base for Disruptors & Co marketing and operations'
)
on conflict (slug) do nothing;

-- Sample brain facts
insert into brain_facts (brain_id, key, value, source, confidence, last_verified_at)
select
  (select id from business_brains where slug = 'default'),
  'Company Name',
  '"Disruptors & Co"'::jsonb,
  'Company documentation',
  1.0,
  now()
where not exists (
  select 1 from brain_facts
  where brain_id = (select id from business_brains where slug = 'default')
  and key = 'Company Name'
);

insert into brain_facts (brain_id, key, value, source, confidence, last_verified_at)
select
  (select id from business_brains where slug = 'default'),
  'Industry Focus',
  '"AI-powered marketing for skilled trades"'::jsonb,
  'Company documentation',
  1.0,
  now()
where not exists (
  select 1 from brain_facts
  where brain_id = (select id from business_brains where slug = 'default')
  and key = 'Industry Focus'
);

insert into brain_facts (brain_id, key, value, source, confidence, last_verified_at)
select
  (select id from business_brains where slug = 'default'),
  'Brand Voice',
  '"Bold, contrarian, no-fluff, direct communication for skilled professionals"'::jsonb,
  'Brand guidelines',
  1.0,
  now()
where not exists (
  select 1 from brain_facts
  where brain_id = (select id from business_brains where slug = 'default')
  and key = 'Brand Voice'
);

-- Sample brand rules
insert into brand_rules (brain_id, rule_type, content)
select
  (select id from business_brains where slug = 'default'),
  'voice',
  jsonb_build_object(
    'tone', 'bold and contrarian',
    'style', 'no-fluff, direct',
    'audience', 'skilled trades professionals',
    'avoid', array['corporate jargon', 'buzzwords', 'excessive politeness']
  )
where not exists (
  select 1 from brand_rules
  where brain_id = (select id from business_brains where slug = 'default')
  and rule_type = 'voice'
);

-- Default agent
insert into agents (brain_id, name, system_prompt, flags)
select
  (select id from business_brains where slug = 'default'),
  'Content Writer',
  'You are a content writer for Disruptors & Co, an AI-powered marketing agency specializing in skilled trades. Your voice is bold, contrarian, and no-fluff. You speak directly to skilled professionals who value straight talk over corporate jargon. Use the business brain context provided to ground your responses in accurate company information.',
  jsonb_build_object(
    'temperature', 0.7,
    'max_tokens', 2000,
    'model', 'claude-sonnet-4.5'
  )
where not exists (
  select 1 from agents
  where name = 'Content Writer'
);

-- ========================================
-- Triggers for updated_at
-- ========================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to tables with updated_at
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'business_brains', 'brain_facts', 'brand_rules', 'knowledge_sources',
      'agents', 'conversations', 'workflows'
    ])
  loop
    execute format($t$
      drop trigger if exists update_%I_updated_at on %I;
      create trigger update_%I_updated_at
        before update on %I
        for each row
        execute function update_updated_at_column();
    $t$, tbl, tbl, tbl, tbl);
  end loop;
end $$;

-- ========================================
-- Complete!
-- ========================================
-- Apply this migration in Supabase SQL Editor
-- Then configure admin role assignment (see AUTH_SETUP_GUIDE.md)
