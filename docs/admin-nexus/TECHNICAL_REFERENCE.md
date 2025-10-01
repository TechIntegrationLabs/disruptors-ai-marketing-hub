# Admin Nexus - Technical Reference

## Table of Contents

1. [API Endpoints](#api-endpoints)
2. [Database Schema](#database-schema)
3. [RPC Functions](#rpc-functions)
4. [Frontend Component API](#frontend-component-api)
5. [Authentication Flow](#authentication-flow)
6. [Data Flow Diagrams](#data-flow-diagrams)
7. [Environment Variables](#environment-variables)
8. [Configuration Options](#configuration-options)

---

## API Endpoints

### Netlify Functions

All Netlify Functions are deployed to `/.netlify/functions/` and use TypeScript.

#### 1. `ai_invoke` - LLM Chat Invocation

**Purpose**: Process chat messages with AI agents using business brain context.

**Path**: `/.netlify/functions/ai_invoke`

**Method**: `POST`

**Authentication**: Required (Service Role)

**Request Body**:
```typescript
{
  agentId: string;           // UUID of agent to use
  brainId: string;           // UUID of business brain for context
  messages: Array<{          // Conversation history
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  conversationId?: string;   // Optional: existing conversation to continue
  userId?: string;           // Optional: user initiating chat
}
```

**Response**:
```typescript
{
  success: boolean;
  message: {
    id: string;              // Message UUID
    role: 'assistant';
    content: string;         // AI response
    tokens?: number;         // Token count
    created_at: string;      // ISO timestamp
  };
  conversationId: string;    // Conversation UUID (created or existing)
  facts_used: number;        // Count of brain facts retrieved
  latency_ms: number;        // Response time
}
```

**Function Implementation** (`netlify/functions/ai_invoke.ts`):
```typescript
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export const handler: Handler = async (event, context) => {
  // 1. Parse request body
  const { agentId, brainId, messages, conversationId, userId } = JSON.parse(event.body);

  // 2. Initialize Supabase client with service role
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 3. Fetch agent configuration
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();

  // 4. Extract query terms from last user message
  const lastMessage = messages[messages.length - 1];
  const queryTerms = extractKeywords(lastMessage.content);

  // 5. Search brain facts using FTS
  const { data: facts } = await supabase
    .rpc('search_brain_facts', {
      brain_id: brainId,
      q: queryTerms,
      limit_count: 15
    });

  // 6. Retrieve brand rules
  const { data: brandRules } = await supabase
    .from('brand_rules')
    .select('*')
    .eq('brain_id', brainId);

  // 7. Compose full prompt with context
  const systemPrompt = composePrompt({
    agentPrompt: agent.system_prompt,
    facts: facts,
    brandRules: brandRules,
    flags: agent.flags
  });

  // 8. Call LLM API
  const llmResponse = await callLLM({
    provider: agent.flags.provider || 'anthropic',
    model: agent.flags.model || 'claude-sonnet-4.5',
    temperature: agent.flags.temperature || 0.7,
    maxTokens: agent.flags.max_tokens || 2000,
    systemPrompt: systemPrompt,
    messages: messages
  });

  // 9. Save conversation and messages
  const conversation = await saveConversation({
    supabase,
    conversationId,
    agentId,
    userId,
    userMessage: lastMessage,
    assistantMessage: llmResponse
  });

  // 10. Log telemetry event
  await supabase.from('telemetry_events').insert({
    area: 'agents',
    name: 'ai_invoke',
    payload: {
      agent_id: agentId,
      conversation_id: conversation.id,
      tokens: llmResponse.tokens,
      facts_used: facts.length,
      latency_ms: Date.now() - startTime
    }
  });

  // 11. Return response
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: llmResponse.message,
      conversationId: conversation.id,
      facts_used: facts.length,
      latency_ms: Date.now() - startTime
    })
  };
};
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Invalid authentication
- `404 Not Found`: Agent or brain not found
- `500 Internal Server Error`: LLM API error or database error

---

#### 2. `ingest_dispatch-background` - Web Scraping & Fact Extraction

**Purpose**: Scrape URLs/sitemaps and extract facts using AI.

**Path**: `/.netlify/functions/ingest_dispatch-background`

**Method**: `POST`

**Authentication**: Required (Service Role)

**Timeout**: 15 minutes (background function)

**Request Body**:
```typescript
{
  brainId: string;           // UUID of business brain
  sourceId?: string;         // Optional: knowledge source to ingest
  urls?: string[];           // Optional: direct URLs to scrape
  maxPages?: number;         // Optional: limit for sitemap (default: 50)
}
```

**Response**:
```typescript
{
  success: boolean;
  jobId: string;             // Ingest job UUID for tracking
  message: string;
}
```

**Function Implementation** (`netlify/functions/ingest_dispatch-background.ts`):
```typescript
import { Handler } from '@netlify/functions';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import Anthropic from '@anthropic-ai/sdk';

export const handler: Handler = async (event, context) => {
  const { brainId, sourceId, urls, maxPages = 50 } = JSON.parse(event.body);

  const supabase = createClient(/*...*/);

  // 1. Create ingest job record
  const { data: job } = await supabase
    .from('ingest_jobs')
    .insert({
      brain_id: brainId,
      source_id: sourceId,
      status: 'running',
      progress: 0
    })
    .select()
    .single();

  try {
    // 2. Get URLs to scrape
    let urlsToScrape = urls || [];

    if (sourceId) {
      const { data: source } = await supabase
        .from('knowledge_sources')
        .select('*')
        .eq('id', sourceId)
        .single();

      if (source.type === 'sitemap') {
        // Fetch and parse sitemap XML
        urlsToScrape = await fetchSitemapUrls(source.config.url, {
          include: source.config.include,
          exclude: source.config.exclude,
          maxPages
        });
      } else if (source.type === 'url') {
        urlsToScrape = [source.config.url];
      }
    }

    let factsAdded = 0;
    let factsUpdated = 0;

    // 3. Process each URL
    for (let i = 0; i < urlsToScrape.length; i++) {
      const url = urlsToScrape[i];

      // Update progress
      const progress = Math.round(((i + 1) / urlsToScrape.length) * 100);
      await supabase
        .from('ingest_jobs')
        .update({ progress, logs: `Processing ${i + 1}/${urlsToScrape.length}: ${url}` })
        .eq('id', job.id);

      try {
        // 4. Fetch page HTML
        const response = await fetch(url);
        const html = await response.text();

        // 5. Extract content using Readability
        const dom = new JSDOM(html, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (!article) {
          console.log(`Failed to extract content from ${url}`);
          continue;
        }

        // 6. Call LLM to extract facts
        const anthropic = new Anthropic({
          apiKey: process.env.VITE_ANTHROPIC_API_KEY
        });

        const factExtractionPrompt = `
Extract key business facts from this web page content. Return a JSON array of facts.

Page URL: ${url}
Page Title: ${article.title}
Content:
${article.textContent.slice(0, 50000)}

Return format:
[
  {
    "key": "short_snake_case_key",
    "value": "Fact content or JSON object",
    "confidence": 0.0-1.0
  }
]

Extract facts about: services, pricing, team, locations, specializations, technology, processes, case studies, testimonials, contact info.
`;

        const completion = await anthropic.messages.create({
          model: 'claude-sonnet-4.5',
          max_tokens: 4000,
          temperature: 0.3,
          messages: [{ role: 'user', content: factExtractionPrompt }]
        });

        // 7. Parse AI response
        const factsJson = extractJsonFromText(completion.content[0].text);
        const facts = JSON.parse(factsJson);

        // 8. Check for duplicates using FTS
        for (const fact of facts) {
          const { data: existing } = await supabase
            .rpc('search_brain_facts', {
              brain_id: brainId,
              q: fact.key + ' ' + JSON.stringify(fact.value),
              limit_count: 1
            });

          if (existing.length > 0 && existing[0].rank > 0.8) {
            // Update existing fact
            await supabase
              .from('brain_facts')
              .update({
                value: fact.value,
                confidence: fact.confidence,
                last_verified_at: new Date().toISOString()
              })
              .eq('id', existing[0].id);

            factsUpdated++;
          } else {
            // Insert new fact
            await supabase
              .from('brain_facts')
              .insert({
                brain_id: brainId,
                key: fact.key,
                value: fact.value,
                source: url,
                confidence: fact.confidence,
                last_verified_at: new Date().toISOString()
              });

            factsAdded++;
          }
        }

      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        // Continue with next URL
      }

      // Rate limiting: delay between requests
      await sleep(2000);
    }

    // 9. Mark job as complete
    await supabase
      .from('ingest_jobs')
      .update({
        status: 'success',
        progress: 100,
        facts_added: factsAdded,
        facts_updated: factsUpdated,
        finished_at: new Date().toISOString(),
        logs: `Completed: ${factsAdded} facts added, ${factsUpdated} updated`
      })
      .eq('id', job.id);

    // 10. Update source last_ingested_at
    if (sourceId) {
      await supabase
        .from('knowledge_sources')
        .update({ last_ingested_at: new Date().toISOString() })
        .eq('id', sourceId);
    }

  } catch (error) {
    // Mark job as failed
    await supabase
      .from('ingest_jobs')
      .update({
        status: 'failed',
        logs: `Error: ${error.message}`,
        finished_at: new Date().toISOString()
      })
      .eq('id', job.id);

    throw error;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      jobId: job.id,
      message: 'Ingestion started'
    })
  };
};
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Scraping error or LLM error

---

#### 3. `agent_train-background` - Agent Prompt Improvement

**Purpose**: Train agent using feedback and examples to improve system prompt.

**Path**: `/.netlify/functions/agent_train-background`

**Method**: `POST`

**Authentication**: Required (Service Role)

**Timeout**: 15 minutes (background function)

**Request Body**:
```typescript
{
  agentId: string;           // UUID of agent to train
  brainId?: string;          // Optional: brain for brand context
}
```

**Response**:
```typescript
{
  success: boolean;
  runId: string;             // Agent run UUID for tracking
  message: string;
}
```

**Function Implementation** (`netlify/functions/agent_train-background.ts`):
```typescript
export const handler: Handler = async (event, context) => {
  const { agentId, brainId } = JSON.parse(event.body);

  const supabase = createClient(/*...*/);

  // 1. Create agent run record
  const { data: run } = await supabase
    .from('agent_runs')
    .insert({
      agent_id: agentId,
      type: 'train',
      status: 'running',
      started_at: new Date().toISOString()
    })
    .select()
    .single();

  try {
    // 2. Fetch current agent config
    const { data: agent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    // 3. Collect training examples
    const { data: examples } = await supabase
      .from('agent_training_examples')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(50);

    // 4. Aggregate feedback
    const { data: feedback } = await supabase
      .from('agent_feedback')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(100);

    const positiveFeedback = feedback.filter(f => f.rating >= 4);
    const negativeFeedback = feedback.filter(f => f.rating <= 2);

    // 5. Get brand rules if brain provided
    let brandRules = [];
    if (brainId) {
      const { data: rules } = await supabase
        .from('brand_rules')
        .select('*')
        .eq('brain_id', brainId);
      brandRules = rules || [];
    }

    // 6. Call LLM to improve system prompt
    const anthropic = new Anthropic({
      apiKey: process.env.VITE_ANTHROPIC_API_KEY
    });

    const trainingPrompt = `
You are an AI agent trainer. Your task is to improve an agent's system prompt based on training data.

CURRENT SYSTEM PROMPT:
${agent.system_prompt}

TRAINING EXAMPLES (${examples.length} total):
${examples.map(ex => `
Input: ${ex.input}
Expected: ${ex.expected}
Label: ${ex.label === 'pos' ? 'Good Example' : 'Bad Example'}
`).join('\n')}

POSITIVE FEEDBACK (${positiveFeedback.length} instances):
${positiveFeedback.slice(0, 10).map(f => f.comment).filter(Boolean).join('\n')}

NEGATIVE FEEDBACK (${negativeFeedback.length} instances):
${negativeFeedback.slice(0, 10).map(f => f.comment).filter(Boolean).join('\n')}

BRAND RULES:
${JSON.stringify(brandRules, null, 2)}

INSTRUCTIONS:
1. Analyze the current prompt and identify areas for improvement
2. Incorporate lessons from training examples
3. Address issues mentioned in negative feedback
4. Reinforce patterns from positive feedback
5. Ensure brand rules are integrated
6. Return ONLY the improved system prompt, no explanation

Return the improved system prompt:
`;

    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4.5',
      max_tokens: 2000,
      temperature: 0.5,
      messages: [{ role: 'user', content: trainingPrompt }]
    });

    const improvedPrompt = completion.content[0].text.trim();

    // 7. Update agent's system_prompt
    await supabase
      .from('agents')
      .update({
        system_prompt: improvedPrompt,
        updated_at: new Date().toISOString()
      })
      .eq('id', agentId);

    // 8. Mark run as complete
    await supabase
      .from('agent_runs')
      .update({
        status: 'success',
        finished_at: new Date().toISOString(),
        metrics: {
          examples_used: examples.length,
          positive_feedback: positiveFeedback.length,
          negative_feedback: negativeFeedback.length,
          prompt_length: improvedPrompt.length
        }
      })
      .eq('id', run.id);

  } catch (error) {
    await supabase
      .from('agent_runs')
      .update({
        status: 'failed',
        finished_at: new Date().toISOString()
      })
      .eq('id', run.id);

    throw error;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      runId: run.id,
      message: 'Training complete'
    })
  };
};
```

---

## Database Schema

### Core Tables

#### `business_brains`
Primary knowledge base container (one per client/site).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `slug` | text | NO | - | URL-safe unique identifier |
| `name` | text | NO | - | Human-readable name |
| `description` | text | YES | - | Brain description |
| `created_by` | uuid | YES | - | User who created (FK: auth.users) |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NO | `now()` | Last update timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `slug`

**RLS**: Admin-only access

---

#### `brain_facts`
Knowledge base entries with full-text search.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `brain_id` | uuid | NO | - | Parent brain (FK: business_brains) |
| `key` | text | NO | - | Fact identifier (snake_case) |
| `value` | jsonb | NO | - | Fact content (string or object) |
| `source` | text | YES | - | Source URL or 'manual' |
| `confidence` | numeric | YES | - | Confidence score (0.0-1.0) |
| `last_verified_at` | timestamptz | YES | - | Last verification timestamp |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NO | `now()` | Last update timestamp |
| `fts` | tsvector | NO (GENERATED) | - | Full-text search vector (auto-generated) |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `brain_id`
- GIN INDEX on `fts` (full-text search)
- INDEX on `(brain_id, updated_at DESC)`

**FTS Generation**:
```sql
fts tsvector GENERATED ALWAYS AS (
  to_tsvector('english',
    coalesce(key,'') || ' ' ||
    coalesce(value::text,'') || ' ' ||
    coalesce(source,'')
  )
) STORED
```

**RLS**: Admin-only access

---

#### `agents`
AI agent configurations and prompts.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `brain_id` | uuid | YES | - | Associated brain (FK: business_brains) |
| `name` | text | NO | - | Agent name |
| `system_prompt` | text | NO | - | LLM system prompt |
| `flags` | jsonb | NO | `{}` | Configuration (model, temperature, etc.) |
| `status` | text | NO | `'active'` | Status (active/inactive/archived) |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NO | `now()` | Last update timestamp |

**Flags Schema**:
```typescript
{
  provider?: 'anthropic' | 'openai';     // LLM provider
  model?: string;                         // Model name
  temperature?: number;                   // 0.0-1.0
  max_tokens?: number;                    // Max response tokens
  [key: string]: any;                     // Extensible
}
```

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `brain_id`
- INDEX on `status`

**RLS**: Admin-only access

---

#### `conversations`
Chat sessions between users and agents.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `agent_id` | uuid | YES | - | Agent used (FK: agents) |
| `user_id` | uuid | YES | - | User (FK: auth.users) |
| `title` | text | YES | - | Conversation title (auto-generated) |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NO | `now()` | Last message timestamp |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `(user_id, created_at DESC)`

**RLS**: Admin-only access

---

#### `messages`
Individual chat messages in conversations.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `conversation_id` | uuid | NO | - | Parent conversation (FK: conversations) |
| `role` | text | NO | - | Message role (user/assistant/system) |
| `content` | jsonb | NO | - | Message content |
| `tokens` | int | YES | - | Token count (if applicable) |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |

**Content Schema**:
```typescript
{
  text: string;                // Message text
  tools?: any[];               // Tool calls (future)
  attachments?: any[];         // Attachments (future)
}
```

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `(conversation_id, created_at)`

**RLS**: Admin-only access

---

### Enhancement Tables

#### Enhanced `team_members`
Existing table with new admin columns.

**New Columns**:
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `user_id` | uuid | YES | - | Supabase auth user (FK: auth.users) |
| `can_write_content` | boolean | NO | `false` | Content creation permission |
| `default_agent_id` | uuid | YES | - | Default AI agent (FK: agents) |
| `content_permissions` | jsonb | NO | `{}` | Fine-grained permissions |
| `admin_notes` | text | YES | - | Internal admin notes |

**Content Permissions Schema**:
```typescript
{
  can_publish?: boolean;       // Can publish posts
  can_delete?: boolean;        // Can delete posts
  categories?: string[];       // Allowed categories
  max_posts_per_month?: number; // Usage quota
}
```

**New Indexes**:
- INDEX on `user_id`

---

#### Enhanced `posts`
Existing table with workflow and AI generation tracking.

**New Columns**:
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `status` | text | NO | `'draft'` | Workflow status |
| `author_member_id` | uuid | YES | - | Author (FK: team_members) |
| `agent_id` | uuid | YES | - | AI agent used (FK: agents) |
| `brain_snapshot` | jsonb | YES | - | Cached brain facts used |
| `seo` | jsonb | NO | `{}` | SEO metadata |
| `generation_metadata` | jsonb | YES | - | AI generation details |
| `published_at` | timestamptz | YES | - | Publication timestamp |
| `scheduled_for` | timestamptz | YES | - | Scheduled publish time |
| `word_count` | int | YES | - | Word count |
| `reading_time_minutes` | int | YES | - | Estimated reading time |

**Status Values**: `draft`, `review`, `published`, `archived`, `scheduled`

**SEO Schema**:
```typescript
{
  title?: string;              // SEO title (60 chars)
  description?: string;        // Meta description (160 chars)
  keywords?: string[];         // Target keywords
  og_image?: string;           // Open Graph image URL
  canonical_url?: string;      // Canonical URL
}
```

**Brain Snapshot Schema**:
```typescript
{
  fact_ids: string[];          // UUIDs of facts used
  facts: Array<{               // Cached fact data
    key: string;
    value: any;
    confidence: number;
  }>;
  retrieved_at: string;        // ISO timestamp
}
```

**New Indexes**:
- INDEX on `(status, published_at DESC NULLS LAST)`
- INDEX on `author_member_id`
- INDEX on `agent_id`
- INDEX on `scheduled_for WHERE status = 'scheduled'`

---

#### Enhanced `site_media`
Existing table with AI generation tracking.

**New Columns**:
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `generated_by_workflow_id` | uuid | YES | - | Workflow (FK: workflows) |
| `generated_by_agent_id` | uuid | YES | - | Agent (FK: agents) |
| `ai_generated` | boolean | NO | `false` | AI-generated flag |
| `generation_prompt` | text | YES | - | Generation prompt |
| `generation_metadata` | jsonb | YES | - | AI generation details |
| `usage_rights` | text | YES | - | License/rights info |
| `tags` | text[] | YES | - | Searchable tags |
| `indexed_for_search` | boolean | NO | `false` | Search index flag |

**Generation Metadata Schema**:
```typescript
{
  provider?: string;           // AI provider (openai, gemini, etc.)
  model?: string;              // Model used
  prompt?: string;             // Full prompt
  parameters?: any;            // Generation parameters
  cost?: number;               // API cost (USD)
  generated_at?: string;       // ISO timestamp
}
```

**New Indexes**:
- INDEX on `ai_generated`
- GIN INDEX on `tags`
- INDEX on `generated_by_workflow_id`

---

## RPC Functions

### `search_brain_facts`
Full-text search on brain facts.

**Signature**:
```sql
search_brain_facts(
  brain_id uuid,
  q text,
  limit_count int DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  key text,
  value jsonb,
  source text,
  confidence numeric,
  last_verified_at timestamptz,
  rank real
)
```

**Usage**:
```sql
-- Search for pricing facts
SELECT * FROM search_brain_facts(
  'brain-uuid-here',
  'pricing cost fees',
  10
);

-- Search all facts (empty query)
SELECT * FROM search_brain_facts(
  'brain-uuid-here',
  '',
  100
);
```

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION search_brain_facts(
  brain_id uuid,
  q text,
  limit_count int DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  key text,
  value jsonb,
  source text,
  confidence numeric,
  last_verified_at timestamptz,
  rank real
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bf.id,
    bf.key,
    bf.value,
    bf.source,
    bf.confidence,
    bf.last_verified_at,
    ts_rank(bf.fts, plainto_tsquery('english', q)) as rank
  FROM brain_facts bf
  WHERE bf.brain_id = $1
    AND (q = '' OR q IS NULL OR bf.fts @@ plainto_tsquery('english', q))
  ORDER BY
    rank DESC,
    bf.confidence DESC NULLS LAST,
    bf.last_verified_at DESC NULLS LAST
  LIMIT limit_count;
END;
$$;
```

**Returns**: Ordered by relevance (FTS rank), then confidence, then recency.

---

### `append_feedback`
Add feedback to agent message.

**Signature**:
```sql
append_feedback(
  p_agent_id uuid,
  p_conversation_id uuid,
  p_message_id uuid,
  p_rating int,
  p_comment text DEFAULT NULL
)
RETURNS uuid
```

**Usage**:
```sql
-- Add thumbs up
SELECT append_feedback(
  'agent-uuid',
  'conversation-uuid',
  'message-uuid',
  5,  -- rating 1-5
  'Great response!'
);
```

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION append_feedback(
  p_agent_id uuid,
  p_conversation_id uuid,
  p_message_id uuid,
  p_rating int,
  p_comment text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  feedback_id uuid;
BEGIN
  INSERT INTO agent_feedback (agent_id, conversation_id, message_id, rating, comment)
  VALUES (p_agent_id, p_conversation_id, p_message_id, p_rating, p_comment)
  RETURNING id INTO feedback_id;

  RETURN feedback_id;
END;
$$;
```

---

### `get_brain_health`
Get health metrics for a brain.

**Signature**:
```sql
get_brain_health(brain_id uuid)
RETURNS jsonb
```

**Usage**:
```sql
SELECT * FROM get_brain_health('brain-uuid-here');
```

**Returns**:
```json
{
  "total_facts": 127,
  "verified_facts": 89,
  "verified_percentage": 70.08,
  "stale_facts": 23,
  "avg_confidence": 0.87,
  "last_ingest": "2025-10-01T14:23:00Z"
}
```

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION get_brain_health(brain_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result jsonb;
  total_facts int;
  verified_facts int;
  stale_facts int;
  avg_confidence numeric;
  last_ingest timestamptz;
BEGIN
  -- Count facts
  SELECT count(*) INTO total_facts
  FROM brain_facts bf
  WHERE bf.brain_id = $1;

  -- Count verified facts
  SELECT count(*) INTO verified_facts
  FROM brain_facts bf
  WHERE bf.brain_id = $1 AND bf.last_verified_at IS NOT NULL;

  -- Count stale facts (>30 days since verification)
  SELECT count(*) INTO stale_facts
  FROM brain_facts bf
  WHERE bf.brain_id = $1
    AND (bf.last_verified_at IS NULL OR bf.last_verified_at < now() - interval '30 days');

  -- Average confidence
  SELECT avg(confidence) INTO avg_confidence
  FROM brain_facts bf
  WHERE bf.brain_id = $1 AND bf.confidence IS NOT NULL;

  -- Last ingestion
  SELECT max(last_ingested_at) INTO last_ingest
  FROM knowledge_sources ks
  WHERE ks.brain_id = $1;

  result := jsonb_build_object(
    'total_facts', total_facts,
    'verified_facts', verified_facts,
    'verified_percentage', CASE WHEN total_facts > 0 THEN round((verified_facts::numeric / total_facts) * 100, 2) ELSE 0 END,
    'stale_facts', stale_facts,
    'avg_confidence', round(avg_confidence, 2),
    'last_ingest', last_ingest
  );

  RETURN result;
END;
$$;
```

---

### `get_team_member_stats`
Get content creation statistics for a team member.

**Signature**:
```sql
get_team_member_stats(member_id uuid)
RETURNS jsonb
```

**Usage**:
```sql
SELECT * FROM get_team_member_stats('member-uuid-here');
```

**Returns**:
```json
{
  "total_posts": 42,
  "published_posts": 31,
  "draft_posts": 11,
  "total_words": 45230,
  "avg_reading_time": 8.5
}
```

---

## Frontend Component API

### AdminPortal Component

**File**: `src/admin-portal.jsx`

**Purpose**: Root component for admin panel with routing.

**Props**: None (entry point)

**Routes**:
- `/admin/secret` → Redirect to `/admin/secret/overview`
- `/admin/secret/overview` → DashboardOverview
- `/admin/secret/content` → ContentManagement
- `/admin/secret/team` → TeamManagement
- `/admin/secret/media` → MediaLibrary
- `/admin/secret/business-brain` → BusinessBrainBuilder
- `/admin/secret/brand-dna` → BrandDNABuilder
- `/admin/secret/agents` → AgentBuilder
- `/admin/secret/agents/:agentId/chat` → AgentChat
- `/admin/secret/workflows` → WorkflowManager
- `/admin/secret/integrations` → IntegrationsHub
- `/admin/secret/telemetry` → TelemetryDashboard

**Usage**:
```jsx
import AdminPortal from './admin-portal';

// In App.jsx or main routing
if (window.location.pathname.startsWith('/admin/secret')) {
  return <AdminPortal />;
}
```

---

### Entity API (TypeScript)

**File**: `src/api/entities.ts`

All entity APIs follow a consistent pattern:

#### BusinessBrains

```typescript
import { BusinessBrains } from '@/api/entities';

// List all brains
const brains = await BusinessBrains.list();

// Get single brain
const brain = await BusinessBrains.get(brainId);

// Create brain
const newBrain = await BusinessBrains.create({
  slug: 'my-brain',
  name: 'My Business Brain',
  description: 'Knowledge base for...'
});

// Update brain
await BusinessBrains.update(brainId, {
  name: 'Updated Name'
});

// Delete brain
await BusinessBrains.delete(brainId);

// Get health metrics
const health = await BusinessBrains.getHealth(brainId);
```

#### BrainFacts

```typescript
import { BrainFacts } from '@/api/entities';

// List facts for brain
const facts = await BrainFacts.list(brainId);

// Search facts (FTS)
const results = await BrainFacts.search(brainId, 'pricing', 10);

// Get single fact
const fact = await BrainFacts.get(factId);

// Create fact
const newFact = await BrainFacts.create({
  brain_id: brainId,
  key: 'service_pricing',
  value: { service: 'Web Design', price: '$5,000' },
  source: 'manual',
  confidence: 1.0
});

// Update fact
await BrainFacts.update(factId, {
  value: { service: 'Web Design', price: '$6,000' }
});

// Delete fact
await BrainFacts.delete(factId);
```

#### Agents

```typescript
import { Agents } from '@/api/entities';

// List agents
const agents = await Agents.list();

// Get agent
const agent = await Agents.get(agentId);

// Create agent
const newAgent = await Agents.create({
  name: 'Customer Support',
  system_prompt: 'You are a helpful...',
  brain_id: brainId,
  flags: {
    provider: 'anthropic',
    model: 'claude-sonnet-4.5',
    temperature: 0.7,
    max_tokens: 2000
  }
});

// Invoke agent (chat)
const response = await Agents.invoke({
  agentId: agentId,
  brainId: brainId,
  messages: [
    { role: 'user', content: 'What services do you offer?' }
  ]
});

// Add feedback
await Agents.feedback({
  agentId: agentId,
  conversationId: conversationId,
  messageId: messageId,
  rating: 5,
  comment: 'Great response!'
});

// Train agent
await Agents.train({
  agentId: agentId,
  brainId: brainId
});
```

---

## Authentication Flow

### Login Flow

```
┌────────────────────────────────────────────────────────┐
│ 1. User visits /admin/secret                           │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 2. AdminLogin.jsx renders                              │
│    - Email/password form                               │
│    - Matrix-style UI                                   │
└────────────────────────────────────────────────────────┘
                          │
                          ▼ User submits credentials
┌────────────────────────────────────────────────────────┐
│ 3. supabase.auth.signInWithPassword()                  │
│    - Validates credentials                             │
│    - Returns JWT with claims                           │
└────────────────────────────────────────────────────────┘
                          │
                          ▼ Check JWT claims
┌────────────────────────────────────────────────────────┐
│ 4. Verify admin role                                   │
│    JWT: { sub: 'user-uuid', role: 'admin', ... }      │
└────────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
         YES (admin)           NO (not admin)
                │                   │
                ▼                   ▼
┌───────────────────────┐  ┌──────────────────┐
│ 5. Redirect to        │  │ Show error       │
│    /admin/secret/     │  │ "Not authorized" │
│    overview           │  └──────────────────┘
└───────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────┐
│ 6. AdminShell renders                                  │
│    - Sidebar navigation                                │
│    - Protected routes                                  │
│    - <Outlet /> for active module                      │
└────────────────────────────────────────────────────────┘
```

### Protected Route Flow

```typescript
// ProtectedRoute.jsx
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  if (!session) {
    // Not authenticated
    return <Navigate to="/admin/secret" />;
  }

  // Check admin role in JWT
  const isAdmin = session.user.app_metadata?.role === 'admin';

  if (!isAdmin) {
    // Authenticated but not admin
    return <div>Not authorized</div>;
  }

  // Admin authenticated
  return children;
}
```

---

## Data Flow Diagrams

### AI Chat Flow (Detailed)

```
┌────────────────────────────────────────────────────────┐
│ USER: Types message in AgentChat.jsx                   │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: Agents.invoke() called                       │
│ - Build message array (history + new message)          │
│ - Call POST /.netlify/functions/ai_invoke             │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: ai_invoke function receives request           │
│ 1. Parse { agentId, brainId, messages }               │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 2. Supabase: Fetch agent config                        │
│    SELECT * FROM agents WHERE id = agentId             │
│    Returns: { system_prompt, flags, ... }             │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 3. Extract keywords from user message                  │
│    "What services do you offer?"                       │
│    → ["services", "offer"]                             │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 4. Supabase RPC: search_brain_facts()                  │
│    SELECT * FROM search_brain_facts(                   │
│      brainId,                                          │
│      'services offer',                                 │
│      15                                                │
│    )                                                   │
│    Returns: [fact1, fact2, ..., fact15]               │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 5. Supabase: Fetch brand rules                         │
│    SELECT * FROM brand_rules WHERE brain_id = brainId  │
│    Returns: [{ type: 'voice', content: {...} }, ...]  │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 6. Compose full LLM prompt                             │
│                                                        │
│    SYSTEM PROMPT:                                      │
│    ${agent.system_prompt}                             │
│                                                        │
│    BUSINESS CONTEXT:                                   │
│    ${facts.map(f => f.key + ': ' + f.value).join()}  │
│                                                        │
│    BRAND RULES:                                        │
│    Voice: ${brandRules.voice}                         │
│    Tone: ${brandRules.tone}                           │
│    Lexicon: ${brandRules.lexicon}                     │
│                                                        │
│    CONVERSATION:                                       │
│    ${messages}                                         │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 7. Call LLM API (Anthropic or OpenAI)                 │
│    anthropic.messages.create({                         │
│      model: 'claude-sonnet-4.5',                      │
│      messages: composedMessages                        │
│    })                                                  │
│                                                        │
│    Wait for response (2-5 seconds)                     │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 8. Save conversation & messages to DB                  │
│    - INSERT INTO conversations (if new)                │
│    - INSERT INTO messages (user message)               │
│    - INSERT INTO messages (assistant response)         │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 9. Log telemetry event                                 │
│    INSERT INTO telemetry_events                        │
│    { area: 'agents', name: 'ai_invoke', ... }         │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ 10. Return response to frontend                        │
│     { message, conversationId, facts_used, latency }   │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: Display assistant message                    │
│ - Append to message list                               │
│ - Render with feedback buttons                         │
└────────────────────────────────────────────────────────┘
```

---

## Environment Variables

### Required Variables

#### Supabase

```bash
# Supabase Project URL
VITE_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (public, client-side)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (secret, server-side only)
# Used in Netlify Functions for admin operations
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### AI Services

```bash
# Anthropic API Key (required for LLM features)
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# OpenAI API Key (optional)
VITE_OPENAI_API_KEY=sk-...
```

#### Admin Security

```bash
# Admin Secret Key (min 32 characters)
# Used for edge function admin role assignment
ADMIN_SECRET_KEY=your-random-secret-min-32-chars

# Admin Email Whitelist (comma-separated)
ADMIN_EMAILS=admin@disruptors.co,team@disruptors.co
```

### Optional Variables

```bash
# Google Gemini (for image generation)
VITE_GEMINI_API_KEY=...

# Replicate (for Flux models)
VITE_REPLICATE_API_TOKEN=...

# ElevenLabs (for voice)
VITE_ELEVENLABS_API_KEY=...
```

### Environment Setup

**Local Development** (`.env`):
```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_SECRET_KEY=...
VITE_ANTHROPIC_API_KEY=...
```

**Netlify Production** (Dashboard → Environment Variables):
1. Navigate to Site Settings → Environment Variables
2. Add each variable
3. Set scope: "All scopes" (or "Build time" for VITE_ vars, "Functions" for others)
4. Redeploy to apply changes

**Supabase Edge Functions** (CLI):
```bash
supabase secrets set ADMIN_SECRET_KEY=your-secret-key
supabase secrets set ADMIN_EMAILS=admin@example.com
```

---

## Configuration Options

### Agent Configuration

**Agent Flags** (stored in `agents.flags` jsonb column):

```typescript
interface AgentFlags {
  // LLM Provider
  provider?: 'anthropic' | 'openai';

  // Model Selection
  model?: string;  // e.g., 'claude-sonnet-4.5', 'gpt-4'

  // Generation Parameters
  temperature?: number;       // 0.0-1.0, default 0.7
  max_tokens?: number;        // Default 2000
  top_p?: number;             // 0.0-1.0, default 1.0
  frequency_penalty?: number; // -2.0 to 2.0 (OpenAI only)
  presence_penalty?: number;  // -2.0 to 2.0 (OpenAI only)

  // Context
  max_context_facts?: number; // Max facts to retrieve, default 15
  use_brand_rules?: boolean;  // Apply brand DNA, default true

  // Behavior
  stream_response?: boolean;  // Enable streaming (future)
  save_conversations?: boolean; // Save to DB, default true

  // Extensible
  [key: string]: any;
}
```

**Usage**:
```typescript
await Agents.create({
  name: 'Customer Support',
  system_prompt: 'You are a helpful...',
  flags: {
    provider: 'anthropic',
    model: 'claude-sonnet-4.5',
    temperature: 0.7,
    max_tokens: 2000,
    max_context_facts: 20,
    use_brand_rules: true
  }
});
```

---

### Brand Rules Configuration

**Brand Rule Types** (stored in `brand_rules.content` jsonb):

#### Voice Rules
```json
{
  "rule_type": "voice",
  "content": {
    "characteristics": ["bold", "contrarian", "no-fluff", "direct"],
    "examples": [
      "We don't do corporate BS. Just results.",
      "Your competitors are sleeping. We're not."
    ],
    "avoid": ["corporate jargon", "buzzwords", "excessive politeness"]
  }
}
```

#### Tone Rules
```json
{
  "rule_type": "tone",
  "content": {
    "professional": true,
    "friendly": true,
    "authoritative": true,
    "casual": false,
    "humor": "occasionally"
  }
}
```

#### Lexicon Rules
```json
{
  "rule_type": "lexicon",
  "content": {
    "preferred_terms": {
      "skilled trades": ["plumbers", "electricians", "contractors"],
      "client": ["never 'customer'"],
      "contractor": ["not 'tradesperson'"]
    },
    "forbidden_words": ["cheap", "discount", "affordable", "budget"],
    "technical_terms": ["SEO", "GEO", "ROI", "CRM"]
  }
}
```

#### Example Rules
```json
{
  "rule_type": "examples",
  "content": {
    "good_examples": [
      "Stop wasting money on marketing that doesn't work.",
      "Your website should make you money, not excuses."
    ],
    "bad_examples": [
      "Our affordable services help small businesses succeed.",
      "We're here to assist you with your marketing needs."
    ]
  }
}
```

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-01
**Author**: Claude Code (Anthropic)
**Project**: Disruptors AI Marketing Hub - Admin Nexus Technical Reference
