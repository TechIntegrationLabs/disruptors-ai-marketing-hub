# Admin Nexus - Data Model Reference

## Table of Contents

1. [Entity Relationship Overview](#entity-relationship-overview)
2. [Core Entities](#core-entities)
3. [Enhancement Entities](#enhancement-entities)
4. [Junction Tables](#junction-tables)
5. [Views](#views)
6. [Data Constraints](#data-constraints)
7. [Relationships](#relationships)
8. [ERD Diagrams](#erd-diagrams)

---

## Entity Relationship Overview

The Admin Nexus data model consists of **three layers**:

1. **New Admin Tables**: Core admin functionality (15 tables)
2. **Enhanced Existing Tables**: Extended with admin columns (3 tables)
3. **Junction Tables**: Many-to-many relationships (3 tables)

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE LAYER                          │
│                                                             │
│  business_brains ──┬── brain_facts (with FTS)             │
│                    ├── brand_rules                          │
│                    └── knowledge_sources → ingest_jobs      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ provides context to
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AGENT LAYER                            │
│                                                             │
│  agents ──┬── conversations → messages                     │
│           ├── agent_feedback                                │
│           ├── agent_training_examples                       │
│           └── agent_runs                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ generates
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONTENT LAYER                            │
│                                                             │
│  posts ──┬── post_brain_facts (junction)                   │
│          └── post_media (junction) → site_media            │
│                                                             │
│  team_members ──┬── team_member_agents (junction)          │
│                 └── content_permissions                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ managed by
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   OPERATIONS LAYER                          │
│                                                             │
│  workflows ──→ workflow_runs                                │
│  integrations                                               │
│  telemetry_events                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Entities

### business_brains

**Purpose**: Container for all knowledge about a business/client. One brain per site or client.

**Relationships**:
- HAS MANY `brain_facts`
- HAS MANY `brand_rules`
- HAS MANY `knowledge_sources`
- HAS MANY `agents` (optional link)

**Schema**:
```typescript
interface BusinessBrain {
  id: string;                    // UUID primary key
  slug: string;                  // URL-safe unique identifier (e.g., 'disruptors-ai')
  name: string;                  // Human-readable name
  description?: string;          // Brain description
  created_by?: string;           // UUID of auth.users who created
  created_at: Date;              // Creation timestamp
  updated_at: Date;              // Last update timestamp
}
```

**Constraints**:
- `slug` must be UNIQUE
- `slug` must be lowercase, alphanumeric with hyphens only

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "disruptors-ai",
  "name": "Disruptors AI Brain",
  "description": "Knowledge base for Disruptors & Co marketing operations",
  "created_at": "2025-10-01T10:00:00Z",
  "updated_at": "2025-10-01T10:00:00Z"
}
```

**Indexes**:
- Primary: `id`
- Unique: `slug`

---

### brain_facts

**Purpose**: Individual knowledge entries within a business brain. Searchable via full-text search.

**Relationships**:
- BELONGS TO `business_brains` (brain_id → id)
- HAS MANY `post_brain_facts` (junction)

**Schema**:
```typescript
interface BrainFact {
  id: string;                    // UUID primary key
  brain_id: string;              // Foreign key to business_brains
  key: string;                   // Fact identifier (snake_case, e.g., 'service_pricing')
  value: any;                    // JSONB: string, number, array, or object
  source?: string;               // Source URL or 'manual'
  confidence?: number;           // 0.0-1.0 (0% to 100%)
  last_verified_at?: Date;       // Last verification timestamp
  created_at: Date;              // Creation timestamp
  updated_at: Date;              // Last update timestamp
  fts: TsVector;                 // GENERATED: Full-text search vector
}
```

**Value Types**:
```typescript
// Simple string
{ key: "company_name", value: "Disruptors & Co" }

// Number
{ key: "team_size", value: 12 }

// Object (structured data)
{
  key: "service_web_design",
  value: {
    service: "Web Design",
    description: "Custom website design and development",
    pricing: "Starting at $5,000",
    turnaround: "4-6 weeks"
  }
}

// Array
{
  key: "target_industries",
  value: ["plumbing", "electrical", "HVAC", "general contracting"]
}
```

**FTS Generation** (automatic):
```sql
fts = to_tsvector('english',
  coalesce(key,'') || ' ' ||
  coalesce(value::text,'') || ' ' ||
  coalesce(source,'')
)
```

**Constraints**:
- `brain_id` must reference valid `business_brains.id`
- `confidence` must be between 0.0 and 1.0
- `key` should follow snake_case convention

**Indexes**:
- Primary: `id`
- Foreign: `brain_id`
- GIN: `fts` (full-text search)
- Composite: `(brain_id, updated_at DESC)` for efficient queries

---

### agents

**Purpose**: AI agent configurations including system prompts and LLM settings.

**Relationships**:
- BELONGS TO `business_brains` (brain_id → id, optional)
- HAS MANY `conversations`
- HAS MANY `agent_training_examples`
- HAS MANY `agent_runs`
- HAS MANY `agent_feedback`
- HAS MANY `team_member_agents` (junction)

**Schema**:
```typescript
interface Agent {
  id: string;                    // UUID primary key
  brain_id?: string;             // Optional: linked business brain
  name: string;                  // Agent name (e.g., "Customer Support Agent")
  system_prompt: string;         // LLM system prompt (full text)
  flags: AgentFlags;             // JSONB: Configuration settings
  status: 'active' | 'inactive' | 'archived';
  created_at: Date;
  updated_at: Date;
}

interface AgentFlags {
  provider?: 'anthropic' | 'openai';
  model?: string;                // e.g., 'claude-sonnet-4.5'
  temperature?: number;          // 0.0-1.0
  max_tokens?: number;           // Max response tokens
  max_context_facts?: number;    // Max facts to retrieve (default: 15)
  use_brand_rules?: boolean;     // Apply brand DNA (default: true)
  [key: string]: any;            // Extensible
}
```

**Example**:
```json
{
  "id": "agent-uuid-123",
  "brain_id": "brain-uuid-456",
  "name": "Customer Support Agent",
  "system_prompt": "You are a helpful customer support agent for Disruptors & Co. Use the provided brain facts to answer questions accurately about our services, pricing, and processes. Maintain a professional yet friendly tone.",
  "flags": {
    "provider": "anthropic",
    "model": "claude-sonnet-4.5",
    "temperature": 0.7,
    "max_tokens": 2000,
    "max_context_facts": 15,
    "use_brand_rules": true
  },
  "status": "active",
  "created_at": "2025-10-01T10:00:00Z",
  "updated_at": "2025-10-01T10:00:00Z"
}
```

**Indexes**:
- Primary: `id`
- Foreign: `brain_id`
- Filter: `status`

---

### conversations

**Purpose**: Chat sessions between users and AI agents. Groups related messages.

**Relationships**:
- BELONGS TO `agents` (agent_id → id, optional)
- BELONGS TO `auth.users` (user_id → id, optional)
- HAS MANY `messages`
- HAS MANY `agent_feedback`

**Schema**:
```typescript
interface Conversation {
  id: string;                    // UUID primary key
  agent_id?: string;             // Agent used for this conversation
  user_id?: string;              // User who started conversation
  title?: string;                // Auto-generated or custom title
  created_at: Date;              // First message timestamp
  updated_at: Date;              // Last message timestamp
}
```

**Title Generation** (automatic):
- First 50 characters of first user message
- Or "Conversation with [Agent Name]"

**Example**:
```json
{
  "id": "conv-uuid-789",
  "agent_id": "agent-uuid-123",
  "user_id": "user-uuid-abc",
  "title": "What services do you offer?",
  "created_at": "2025-10-01T14:30:00Z",
  "updated_at": "2025-10-01T14:35:00Z"
}
```

**Indexes**:
- Primary: `id`
- Composite: `(user_id, created_at DESC)` for user history

---

### messages

**Purpose**: Individual chat messages in a conversation (user or assistant).

**Relationships**:
- BELONGS TO `conversations` (conversation_id → id)
- HAS MANY `agent_feedback`

**Schema**:
```typescript
interface Message {
  id: string;                    // UUID primary key
  conversation_id: string;       // Parent conversation
  role: 'user' | 'assistant' | 'system';
  content: MessageContent;       // JSONB: Message data
  tokens?: number;               // Token count (for assistant messages)
  created_at: Date;              // Message timestamp
}

interface MessageContent {
  text: string;                  // Message text
  tools?: any[];                 // Tool calls (future)
  attachments?: any[];           // Attachments (future)
}
```

**Example**:
```json
[
  {
    "id": "msg-uuid-001",
    "conversation_id": "conv-uuid-789",
    "role": "user",
    "content": {
      "text": "What services do you offer?"
    },
    "created_at": "2025-10-01T14:30:00Z"
  },
  {
    "id": "msg-uuid-002",
    "conversation_id": "conv-uuid-789",
    "role": "assistant",
    "content": {
      "text": "We offer web design, SEO/GEO, social media marketing, AI automation, and fractional CMO services for skilled trades businesses like plumbers, electricians, and contractors."
    },
    "tokens": 87,
    "created_at": "2025-10-01T14:30:05Z"
  }
]
```

**Indexes**:
- Primary: `id`
- Composite: `(conversation_id, created_at)` for message order

---

### knowledge_sources

**Purpose**: External sources to ingest knowledge from (URLs, sitemaps, feeds).

**Relationships**:
- BELONGS TO `business_brains` (brain_id → id)
- HAS MANY `ingest_jobs`

**Schema**:
```typescript
interface KnowledgeSource {
  id: string;                    // UUID primary key
  brain_id: string;              // Parent brain
  type: 'url' | 'sitemap' | 'feed' | 'drive' | 'manual';
  config: SourceConfig;          // JSONB: Source-specific config
  status: 'idle' | 'active' | 'paused' | 'error';
  last_ingested_at?: Date;       // Last successful ingestion
  error_message?: string;        // Last error (if any)
  created_at: Date;
  updated_at: Date;
}

// Config schemas by type
interface UrlConfig {
  url: string;                   // Single URL to scrape
}

interface SitemapConfig {
  url: string;                   // Sitemap XML URL
  include?: string[];            // Include patterns (glob)
  exclude?: string[];            // Exclude patterns (glob)
  max_pages?: number;            // Limit (default: 50)
  schedule?: string;             // Cron expression (future)
}

interface FeedConfig {
  url: string;                   // RSS/Atom feed URL
  poll_interval?: number;        // Minutes between checks
}
```

**Example**:
```json
{
  "id": "source-uuid-xyz",
  "brain_id": "brain-uuid-456",
  "type": "sitemap",
  "config": {
    "url": "https://disruptors.co/sitemap.xml",
    "include": ["*/services/*", "*/solutions/*"],
    "exclude": ["*/work/*", "*/blog/*"],
    "max_pages": 20
  },
  "status": "idle",
  "last_ingested_at": "2025-10-01T09:00:00Z",
  "created_at": "2025-09-15T12:00:00Z",
  "updated_at": "2025-10-01T09:00:00Z"
}
```

**Indexes**:
- Primary: `id`
- Foreign: `brain_id`

---

### ingest_jobs

**Purpose**: Track ingestion operations (scraping, fact extraction).

**Relationships**:
- BELONGS TO `business_brains` (brain_id → id)
- BELONGS TO `knowledge_sources` (source_id → id, optional)

**Schema**:
```typescript
interface IngestJob {
  id: string;                    // UUID primary key
  brain_id: string;              // Target brain
  source_id?: string;            // Source that triggered job
  status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
  progress: number;              // 0-100 percentage
  logs?: string;                 // Progress logs (text)
  facts_added: number;           // Count of new facts
  facts_updated: number;         // Count of updated facts
  created_at: Date;              // Job created
  started_at?: Date;             // Job started
  finished_at?: Date;            // Job completed/failed
}
```

**Example**:
```json
{
  "id": "job-uuid-001",
  "brain_id": "brain-uuid-456",
  "source_id": "source-uuid-xyz",
  "status": "success",
  "progress": 100,
  "logs": "Processed 20/20 URLs. Extracted 147 facts.",
  "facts_added": 134,
  "facts_updated": 13,
  "created_at": "2025-10-01T09:00:00Z",
  "started_at": "2025-10-01T09:00:01Z",
  "finished_at": "2025-10-01T09:05:23Z"
}
```

**Indexes**:
- Primary: `id`
- Composite: `(brain_id, created_at DESC)`
- Composite: `(status, created_at DESC)` for active jobs

---

## Enhancement Entities

### Enhanced: team_members

**Original Purpose**: Team member profiles for public site.

**Admin Enhancements**: Links to auth system, content permissions, agent assignments.

**New Columns**:
```typescript
interface TeamMember {
  // Existing columns (unchanged)
  id: string;
  name: string;
  email: string;
  role: string;                  // e.g., "Marketing Director"
  image_url?: string;
  bio?: string;
  // ... other existing columns

  // NEW ADMIN COLUMNS
  user_id?: string;              // Link to auth.users (for login)
  can_write_content: boolean;    // Content creation permission
  default_agent_id?: string;     // Default AI agent
  content_permissions: ContentPermissions; // Fine-grained permissions
  admin_notes?: string;          // Internal notes
}

interface ContentPermissions {
  can_publish?: boolean;         // Can publish posts
  can_delete?: boolean;          // Can delete posts
  categories?: string[];         // Allowed categories
  max_posts_per_month?: number;  // Usage quota
}
```

**Relationships (new)**:
- BELONGS TO `auth.users` (user_id → id)
- BELONGS TO `agents` (default_agent_id → id)
- HAS MANY `posts` (author_member_id)
- HAS MANY `team_member_agents` (junction)

**Migration Safety**:
- All new columns are NULLABLE or have defaults
- No data loss on existing rows
- RLS policies unchanged for public access

---

### Enhanced: posts

**Original Purpose**: Blog posts for public site.

**Admin Enhancements**: Workflow states, AI generation tracking, SEO metadata.

**New Columns**:
```typescript
interface Post {
  // Existing columns (unchanged)
  id: string;
  title: string;
  content: string;
  slug: string;
  // ... other existing columns

  // NEW ADMIN COLUMNS
  status: 'draft' | 'review' | 'published' | 'archived' | 'scheduled';
  author_member_id?: string;     // FK: team_members
  agent_id?: string;             // FK: agents (if AI-generated)
  brain_snapshot?: BrainSnapshot; // Cached facts used
  seo: SEOMetadata;              // SEO optimization data
  generation_metadata?: GenerationMetadata;
  published_at?: Date;           // Actual publication time
  scheduled_for?: Date;          // Scheduled publication time
  word_count?: number;           // Calculated word count
  reading_time_minutes?: number; // Estimated reading time
}

interface BrainSnapshot {
  fact_ids: string[];            // UUIDs of facts used
  facts: Array<{
    key: string;
    value: any;
    confidence: number;
  }>;
  retrieved_at: string;          // ISO timestamp
}

interface SEOMetadata {
  title?: string;                // SEO title (60 chars)
  description?: string;          // Meta description (160 chars)
  keywords?: string[];           // Target keywords
  og_image?: string;             // Open Graph image URL
  canonical_url?: string;        // Canonical URL
}

interface GenerationMetadata {
  prompt?: string;               // Generation prompt
  model?: string;                // Model used
  temperature?: number;          // Generation temperature
  tokens?: number;               // Total tokens
  cost?: number;                 // API cost (USD)
  generated_at?: string;         // ISO timestamp
}
```

**Relationships (new)**:
- BELONGS TO `team_members` (author_member_id)
- BELONGS TO `agents` (agent_id)
- HAS MANY `post_brain_facts` (junction)
- HAS MANY `post_media` (junction)

**Constraints**:
- `status` must be one of: draft, review, published, archived, scheduled
- `published_at` is automatically set when status changes to 'published'

---

### Enhanced: site_media

**Original Purpose**: Media assets (images, videos) for public site.

**Admin Enhancements**: AI generation tracking, workflow integration, tags.

**New Columns**:
```typescript
interface SiteMedia {
  // Existing columns (unchanged)
  id: string;
  url: string;
  alt_text?: string;
  caption?: string;
  // ... other existing columns

  // NEW ADMIN COLUMNS
  generated_by_workflow_id?: string; // FK: workflows
  generated_by_agent_id?: string;    // FK: agents
  ai_generated: boolean;             // AI-generated flag
  generation_prompt?: string;        // Prompt used
  generation_metadata?: MediaGenerationMetadata;
  usage_rights?: string;             // License info
  tags: string[];                    // Searchable tags
  indexed_for_search: boolean;       // Search index flag
}

interface MediaGenerationMetadata {
  provider?: string;             // e.g., 'openai', 'gemini', 'replicate'
  model?: string;                // Model name
  prompt?: string;               // Full prompt
  parameters?: any;              // Generation parameters
  cost?: number;                 // API cost (USD)
  generated_at?: string;         // ISO timestamp
}
```

**Relationships (new)**:
- BELONGS TO `workflows` (generated_by_workflow_id)
- BELONGS TO `agents` (generated_by_agent_id)
- HAS MANY `post_media` (junction)

---

## Junction Tables

### post_brain_facts

**Purpose**: Many-to-many relationship between posts and brain facts. Tracks which facts were used in which posts.

**Schema**:
```typescript
interface PostBrainFact {
  id: string;                    // UUID primary key
  post_id: string;               // FK: posts
  brain_fact_id: string;         // FK: brain_facts
  relevance_score?: number;      // 0.0-1.0 (how relevant to post)
  used_in_section?: string;      // Section where fact was used
  created_at: Date;
}
```

**Constraints**:
- UNIQUE constraint on `(post_id, brain_fact_id)`

**Use Cases**:
- Track fact usage for analytics
- Find all posts that use a specific fact
- Update posts when facts change
- Audit AI content generation

**Example Query**:
```sql
-- Find all posts using a specific fact
SELECT p.title, pbf.relevance_score, pbf.used_in_section
FROM posts p
JOIN post_brain_facts pbf ON p.id = pbf.post_id
WHERE pbf.brain_fact_id = 'fact-uuid-123'
ORDER BY pbf.relevance_score DESC;
```

---

### post_media

**Purpose**: Many-to-many relationship between posts and media. Tracks media usage in posts.

**Schema**:
```typescript
interface PostMedia {
  id: string;                    // UUID primary key
  post_id: string;               // FK: posts
  media_id: string;              // FK: site_media
  display_order: number;         // Order in post (0, 1, 2, ...)
  caption?: string;              // Media caption in this post
  alt_text?: string;             // Alt text override
  usage_context?: string;        // Where/how used (hero, inline, etc.)
  created_at: Date;
}
```

**Constraints**:
- UNIQUE constraint on `(post_id, media_id)`

**Use Cases**:
- Manage media in posts
- Track media usage analytics
- Generate image galleries
- Bulk media operations

**Example Query**:
```sql
-- Get all media for a post, ordered
SELECT sm.url, pm.caption, pm.display_order
FROM post_media pm
JOIN site_media sm ON pm.media_id = sm.id
WHERE pm.post_id = 'post-uuid-456'
ORDER BY pm.display_order;
```

---

### team_member_agents

**Purpose**: Many-to-many relationship between team members and agents. Controls which agents team members can use and tracks usage.

**Schema**:
```typescript
interface TeamMemberAgent {
  id: string;                    // UUID primary key
  team_member_id: string;        // FK: team_members
  agent_id: string;              // FK: agents
  can_use: boolean;              // Permission to use agent
  can_train: boolean;            // Permission to train agent
  usage_quota?: number;          // Max invocations per month
  usage_count: number;           // Current month usage
  created_at: Date;
}
```

**Constraints**:
- UNIQUE constraint on `(team_member_id, agent_id)`

**Use Cases**:
- Control agent access per team member
- Track agent usage quotas
- Generate usage reports
- Billing/cost allocation

**Example Query**:
```sql
-- Check if team member can use agent
SELECT can_use, usage_quota, usage_count
FROM team_member_agents
WHERE team_member_id = 'member-uuid'
  AND agent_id = 'agent-uuid';
```

---

## Views

### posts_with_authors

**Purpose**: Convenient view combining posts with author and agent details.

**Schema**:
```sql
CREATE OR REPLACE VIEW posts_with_authors AS
SELECT
  p.*,
  tm.name as author_name,
  tm.email as author_email,
  tm.role as author_role,
  a.name as agent_name,
  a.id as agent_id
FROM posts p
LEFT JOIN team_members tm ON p.author_member_id = tm.id
LEFT JOIN agents a ON p.agent_id = a.id;
```

**Usage**:
```sql
-- Get all published posts with author info
SELECT * FROM posts_with_authors
WHERE status = 'published'
ORDER BY published_at DESC;
```

---

### media_with_generation

**Purpose**: Media assets with AI generation details.

**Schema**:
```sql
CREATE OR REPLACE VIEW media_with_generation AS
SELECT
  sm.*,
  a.name as agent_name,
  w.name as workflow_name
FROM site_media sm
LEFT JOIN agents a ON sm.generated_by_agent_id = a.id
LEFT JOIN workflows w ON sm.generated_by_workflow_id = w.id;
```

**Usage**:
```sql
-- Get all AI-generated images
SELECT * FROM media_with_generation
WHERE ai_generated = true
ORDER BY created_at DESC;
```

---

### content_calendar

**Purpose**: Unified view of published, scheduled, and in-review content.

**Schema**:
```sql
CREATE OR REPLACE VIEW content_calendar AS
SELECT
  p.id,
  p.title,
  p.status,
  p.published_at,
  p.scheduled_for,
  tm.name as author_name,
  a.name as agent_name,
  COALESCE(p.published_at, p.scheduled_for, p.created_at) as sort_date
FROM posts p
LEFT JOIN team_members tm ON p.author_member_id = tm.id
LEFT JOIN agents a ON p.agent_id = a.id
WHERE p.status IN ('published', 'scheduled', 'review')
ORDER BY sort_date DESC;
```

**Usage**:
```sql
-- Content calendar for this month
SELECT * FROM content_calendar
WHERE sort_date >= date_trunc('month', CURRENT_DATE)
  AND sort_date < date_trunc('month', CURRENT_DATE) + interval '1 month'
ORDER BY sort_date;
```

---

## Data Constraints

### Primary Keys
All tables use UUID primary keys generated with `gen_random_uuid()`.

**Benefits**:
- Globally unique identifiers
- No collisions in distributed systems
- Obscured record counts (security)
- Easy replication/merging

**Format**: `550e8400-e29b-41d4-a716-446655440000`

---

### Foreign Keys

#### Cascade Behaviors

**ON DELETE CASCADE**:
- `brain_facts.brain_id` → `business_brains.id`
- `messages.conversation_id` → `conversations.id`
- `agent_training_examples.agent_id` → `agents.id`
- `post_brain_facts.brain_fact_id` → `brain_facts.id`

**Meaning**: When parent is deleted, children are automatically deleted.

**ON DELETE SET NULL**:
- `knowledge_sources.source_id` → `knowledge_sources.id` (ingest_jobs)
- `agents.brain_id` → `business_brains.id`
- `posts.author_member_id` → `team_members.id`

**Meaning**: When parent is deleted, child's foreign key is set to NULL.

---

### Check Constraints

#### Numeric Ranges
```sql
-- Confidence scores
ALTER TABLE brain_facts
  ADD CONSTRAINT confidence_range
  CHECK (confidence >= 0 AND confidence <= 1);

-- Progress percentage
ALTER TABLE ingest_jobs
  ADD CONSTRAINT progress_range
  CHECK (progress >= 0 AND progress <= 100);

-- Ratings
ALTER TABLE agent_feedback
  ADD CONSTRAINT rating_range
  CHECK (rating BETWEEN 1 AND 5);
```

#### Enum Values
```sql
-- Agent status
ALTER TABLE agents
  ADD CONSTRAINT status_values
  CHECK (status IN ('active', 'inactive', 'archived'));

-- Post status
ALTER TABLE posts
  ADD CONSTRAINT status_values
  CHECK (status IN ('draft', 'review', 'published', 'archived', 'scheduled'));

-- Message roles
ALTER TABLE messages
  ADD CONSTRAINT role_values
  CHECK (role IN ('user', 'assistant', 'system'));

-- Job status
ALTER TABLE ingest_jobs
  ADD CONSTRAINT status_values
  CHECK (status IN ('queued', 'running', 'success', 'failed', 'cancelled'));
```

---

### Unique Constraints

```sql
-- Only one brain per slug
ALTER TABLE business_brains
  ADD CONSTRAINT unique_slug UNIQUE (slug);

-- No duplicate facts in same brain
ALTER TABLE post_brain_facts
  ADD CONSTRAINT unique_post_fact UNIQUE (post_id, brain_fact_id);

-- No duplicate media in same post
ALTER TABLE post_media
  ADD CONSTRAINT unique_post_media UNIQUE (post_id, media_id);

-- One agent permission record per team member
ALTER TABLE team_member_agents
  ADD CONSTRAINT unique_member_agent UNIQUE (team_member_id, agent_id);
```

---

### NOT NULL Constraints

**Critical Fields** (must always have value):
- All `id` columns (primary keys)
- All `created_at` columns
- `business_brains.slug`, `business_brains.name`
- `brain_facts.brain_id`, `brain_facts.key`, `brain_facts.value`
- `agents.name`, `agents.system_prompt`
- `messages.conversation_id`, `messages.role`, `messages.content`

---

## Relationships

### One-to-Many Relationships

```
business_brains (1) ──→ (N) brain_facts
business_brains (1) ──→ (N) brand_rules
business_brains (1) ──→ (N) knowledge_sources
business_brains (1) ──→ (N) ingest_jobs
business_brains (1) ──→ (N) agents (optional)

agents (1) ──→ (N) conversations
agents (1) ──→ (N) agent_training_examples
agents (1) ──→ (N) agent_runs
agents (1) ──→ (N) agent_feedback

conversations (1) ──→ (N) messages
conversations (1) ──→ (N) agent_feedback

knowledge_sources (1) ──→ (N) ingest_jobs

team_members (1) ──→ (N) posts (as author)

workflows (1) ──→ (N) workflow_runs
workflows (1) ──→ (N) site_media (as generator)

auth.users (1) ──→ (N) conversations
auth.users (1) ──→ (N) team_members
```

---

### Many-to-Many Relationships

```
posts (N) ←→ (N) brain_facts
  via: post_brain_facts

posts (N) ←→ (N) site_media
  via: post_media

team_members (N) ←→ (N) agents
  via: team_member_agents
```

---

## ERD Diagrams

### Knowledge Layer ERD

```
┌────────────────────────────┐
│     business_brains        │
│ ──────────────────────────│
│ PK  id (uuid)              │
│ UK  slug (text)            │
│     name (text)            │
│     description (text)     │
│     created_at             │
│     updated_at             │
└────────────────────────────┘
             │
             │ 1:N
             ├─────────────────────────────┐
             │                             │
             ▼                             ▼
┌────────────────────────────┐  ┌────────────────────────────┐
│      brain_facts           │  │      brand_rules           │
│ ──────────────────────────│  │ ──────────────────────────│
│ PK  id (uuid)              │  │ PK  id (uuid)              │
│ FK  brain_id               │  │ FK  brain_id               │
│     key (text)             │  │     rule_type (text)       │
│     value (jsonb)          │  │     content (jsonb)        │
│     source (text)          │  │     created_at             │
│     confidence (numeric)   │  │     updated_at             │
│     last_verified_at       │  └────────────────────────────┘
│     fts (tsvector)         │
│     created_at             │
│     updated_at             │
└────────────────────────────┘
             │
             │ 1:N
             ▼
┌────────────────────────────┐
│   knowledge_sources        │
│ ──────────────────────────│
│ PK  id (uuid)              │
│ FK  brain_id               │
│     type (text)            │
│     config (jsonb)         │
│     status (text)          │
│     last_ingested_at       │
│     error_message (text)   │
└────────────────────────────┘
             │
             │ 1:N
             ▼
┌────────────────────────────┐
│      ingest_jobs           │
│ ──────────────────────────│
│ PK  id (uuid)              │
│ FK  brain_id               │
│ FK  source_id              │
│     status (text)          │
│     progress (numeric)     │
│     logs (text)            │
│     facts_added (int)      │
│     facts_updated (int)    │
│     created_at             │
│     started_at             │
│     finished_at            │
└────────────────────────────┘
```

---

### Agent Layer ERD

```
┌────────────────────────────┐
│        agents              │
│ ──────────────────────────│
│ PK  id (uuid)              │
│ FK  brain_id (optional)    │
│     name (text)            │
│     system_prompt (text)   │
│     flags (jsonb)          │
│     status (text)          │
│     created_at             │
│     updated_at             │
└────────────────────────────┘
             │
             │ 1:N
             ├─────────────────┬──────────────────┬──────────────────┐
             │                 │                  │                  │
             ▼                 ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  conversations   │ │ agent_training_  │ │   agent_runs     │ │  agent_feedback  │
│ ────────────────│ │    examples      │ │ ────────────────│ │ ────────────────│
│ PK  id           │ │ ────────────────│ │ PK  id           │ │ PK  id           │
│ FK  agent_id     │ │ PK  id           │ │ FK  agent_id     │ │ FK  agent_id     │
│ FK  user_id      │ │ FK  agent_id     │ │     type         │ │ FK  conversation │
│     title        │ │     input        │ │     status       │ │ FK  message_id   │
│     created_at   │ │     expected     │ │     metrics      │ │     rating       │
│     updated_at   │ │     label        │ │     started_at   │ │     comment      │
└──────────────────┘ │     created_at   │ │     finished_at  │ │     created_at   │
         │           └──────────────────┘ └──────────────────┘ └──────────────────┘
         │ 1:N
         ▼
┌──────────────────┐
│    messages      │
│ ────────────────│
│ PK  id           │
│ FK  conversation │
│     role         │
│     content      │
│     tokens       │
│     created_at   │
└──────────────────┘
```

---

### Content Layer ERD

```
┌────────────────────────────┐          ┌────────────────────────────┐
│      team_members          │          │        agents              │
│ ──────────────────────────│          │ ──────────────────────────│
│ PK  id (uuid)              │          │ PK  id (uuid)              │
│ FK  user_id (NEW)          │◄────┐    │ FK  brain_id               │
│ FK  default_agent_id (NEW) │     │    └────────────────────────────┘
│     name                   │     │                 │
│     email                  │     │                 │
│     can_write_content(NEW) │     │    ┌────────────┘
│     content_permissions    │     │    │
│     (NEW)                  │     │    │
└────────────────────────────┘     │    │
         │                         │    │
         │ 1:N                     │    │
         ▼                         │    │
┌────────────────────────────┐     │    │
│         posts              │     │    │
│ ──────────────────────────│     │    │
│ PK  id (uuid)              │     │    │
│ FK  author_member_id (NEW) │─────┘    │
│ FK  agent_id (NEW) ────────│──────────┘
│     title                  │
│     content                │
│     status (NEW)           │
│     brain_snapshot (NEW)   │
│     seo (NEW)              │
│     published_at (NEW)     │
│     word_count (NEW)       │
└────────────────────────────┘
         │                    │
         │ N:M                │ N:M
         │                    │
         ▼                    ▼
┌────────────────────┐   ┌────────────────────┐
│ post_brain_facts   │   │    post_media      │
│ ──────────────────│   │ ──────────────────│
│ PK  id             │   │ PK  id             │
│ FK  post_id        │   │ FK  post_id        │
│ FK  brain_fact_id  │   │ FK  media_id       │
│     relevance      │   │     display_order  │
│     used_in_section│   │     caption        │
└────────────────────┘   └────────────────────┘
         │                         │
         │                         │
         ▼                         ▼
┌────────────────────┐   ┌────────────────────────────┐
│   brain_facts      │   │      site_media            │
│ ──────────────────│   │ ──────────────────────────│
│ PK  id             │   │ PK  id (uuid)              │
│ FK  brain_id       │   │ FK  generated_by_workflow  │
│     key            │   │ FK  generated_by_agent     │
│     value          │   │     url                    │
│     source         │   │     ai_generated (NEW)     │
│     confidence     │   │     generation_prompt(NEW) │
└────────────────────┘   │     tags (NEW)             │
                         └────────────────────────────┘
```

---

### Complete System ERD (Simplified)

```
                    ┌──────────────────┐
                    │ auth.users       │
                    │ (Supabase Auth)  │
                    └──────────────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
         ┌────────────────┐    ┌────────────────┐
         │ team_members   │    │ conversations  │
         └────────────────┘    └────────────────┘
                  │                     │
                  ▼                     ▼
              ┌───────┐            ┌──────────┐
              │ posts │            │ messages │
              └───────┘            └──────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌─────────────┐
│post_brain_facts │  │ post_media  │
└─────────────────┘  └─────────────┘
         │                 │
         ▼                 ▼
  ┌────────────┐    ┌────────────┐
  │brain_facts │    │site_media  │
  └────────────┘    └────────────┘
         │
         ▼
┌──────────────────┐
│business_brains   │
└──────────────────┘
         │
    ┌────┴────┬────────────────┬──────────────┐
    │         │                │              │
    ▼         ▼                ▼              ▼
┌────────┐ ┌─────────┐ ┌──────────────┐ ┌────────┐
│agents  │ │brand_   │ │knowledge_    │ │ingest_ │
│        │ │rules    │ │sources       │ │jobs    │
└────────┘ └─────────┘ └──────────────┘ └────────┘
    │
    ├──────────┬──────────────┬─────────────┐
    │          │              │             │
    ▼          ▼              ▼             ▼
┌────────┐ ┌────────┐ ┌────────────┐ ┌────────────┐
│agent_  │ │agent_  │ │agent_      │ │team_member │
│training│ │runs    │ │feedback    │ │_agents     │
└────────┘ └────────┘ └────────────┘ └────────────┘
```

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-01
**Author**: Claude Code (Anthropic)
**Project**: Disruptors AI Marketing Hub - Admin Nexus Data Model Reference
