# Admin Nexus - System Overview

## Executive Summary

**Admin Nexus** is a comprehensive admin control panel system being integrated into the Disruptors AI Marketing Hub. It provides a unified interface for managing content, team members, media assets, AI agents, and business intelligence - all while maintaining complete isolation from the public-facing website.

### What Admin Nexus Is

Admin Nexus is a production-ready administrative system that combines:
- **Content Management**: Full control over blog posts, pages, and published content
- **Team Management**: User roles, permissions, and content authoring controls
- **Media Library**: Asset management with AI generation capabilities
- **Business Brain**: Knowledge base that powers AI agents with contextual information
- **AI Agents**: Configurable AI assistants for content generation and customer interaction
- **Workflow Automation**: Scheduled tasks, auto-ingestion, and content pipelines
- **Brand DNA Management**: Voice, tone, style guidelines enforcement across all AI outputs
- **Telemetry & Analytics**: System health monitoring and usage tracking

### Core Principles

1. **Zero-Touch Public Site**: The existing marketing site remains completely unchanged
2. **Database Integration**: New admin tables work alongside existing `team_members`, `posts`, and `site_media` tables
3. **Security-First**: Row-Level Security (RLS), JWT authentication, admin-only access
4. **Modular Architecture**: Each admin feature is an independent module
5. **AI-Powered**: Real LLM integration for content generation, fact extraction, and agent conversations

---

## How It Relates to Existing Architecture

### Current Disruptors AI Marketing Hub

```
┌─────────────────────────────────────────────────────────┐
│                   PUBLIC WEBSITE                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React SPA (Vite)                                 │  │
│  │  - Custom routing in src/pages/index.jsx         │  │
│  │  - 39 page components                             │  │
│  │  - Radix UI component system                      │  │
│  │  - GSAP + Spline animations                       │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Supabase (Database)                              │  │
│  │  - team_members                                   │  │
│  │  - posts                                          │  │
│  │  - site_media                                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### With Admin Nexus Integration

```
┌─────────────────────────────────────────────────────────┐
│                   PUBLIC WEBSITE                        │
│                  (UNCHANGED)                            │
└─────────────────────────────────────────────────────────┘
                         │
                    ISOLATED
                         │
┌─────────────────────────────────────────────────────────┐
│              ADMIN PANEL (/admin/secret)                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Admin Portal (Standalone React App)             │  │
│  │  - Matrix-style UI                                │  │
│  │  - Separate routing (React Router)               │  │
│  │  - 10 admin modules                               │  │
│  │  - JWT authentication                             │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Netlify Functions (Backend)                      │  │
│  │  - ai_invoke.ts (LLM chat)                        │  │
│  │  - ingest_dispatch.ts (web scraping)             │  │
│  │  - agent_train.ts (prompt improvement)           │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Supabase (Enhanced Database)                     │  │
│  │  EXISTING: team_members, posts, site_media       │  │
│  │  NEW: business_brains, brain_facts, agents,      │  │
│  │       conversations, workflows, brand_rules       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Integration Strategy

**The admin system integrates via THREE isolated touch points:**

1. **Routing Guard** (ONE line in `src/App.jsx` or `src/pages/index.jsx`)
   ```javascript
   if (window.location.pathname.startsWith('/admin/secret')) {
     return <AdminPortal />
   }
   ```

2. **Database Schema** (Additive columns to existing tables)
   - `team_members` gets `user_id`, `can_write_content`, `default_agent_id`
   - `posts` gets `status`, `agent_id`, `word_count`, `seo` metadata
   - `site_media` gets `ai_generated`, `generation_prompt`, `tags`

3. **Netlify Functions** (New backend endpoints)
   - Deployed to `/netlify/functions/` directory
   - No conflicts with existing functions
   - Secured with service role keys

---

## Key Features & Capabilities

### 1. Business Brain (Knowledge Management)

The Business Brain is a searchable knowledge base that powers AI agents with contextual information about your business.

**Features:**
- Manual fact entry with confidence scores
- Automated web scraping and fact extraction
- Full-text search (FTS) for fast retrieval
- Optional semantic search (pgvector) for Phase 4
- Health metrics (total facts, verification status, staleness)
- Source tracking (URL, sitemap, manual entry)

**Use Cases:**
- "What are our service offerings?" → Retrieves service facts
- "What's our pricing model?" → Retrieves pricing facts
- Agent uses facts to answer customer questions accurately

### 2. Content Management

Unified interface for managing all blog posts and content published to the public site.

**Features:**
- View all posts with status (draft, review, published, archived)
- Author tracking (links to `team_members`)
- AI-generated vs manual content identification
- SEO metadata management (title, description, keywords, OG image)
- Word count, reading time calculations
- Bulk operations (publish, archive, delete)
- Direct editing or AI-assisted generation

**Integration with Existing:**
- Works with existing `posts` table
- Preserves all current blog content
- Adds workflow states and metadata

### 3. Team Management

Manage team members, content permissions, and agent assignments.

**Features:**
- View all team members from existing table
- Grant/revoke content writing permissions
- Assign default AI agents to team members
- Track content creation stats (word count, post count)
- Fine-grained permissions (can_publish, can_delete, categories)
- Link Supabase auth users to team profiles

**Integration with Existing:**
- Enhances existing `team_members` table
- Non-destructive additions only
- Preserves all current team data

### 4. Media Library

Centralized asset management with AI generation capabilities.

**Features:**
- Browse all existing site media
- Filter by AI-generated vs manual upload
- Tag-based search and organization
- View generation metadata (prompt, workflow, agent)
- Generate new images with AI (OpenAI gpt-image-1, Gemini, Replicate)
- Track usage rights and licensing
- Integration with workflow automation

**Integration with Existing:**
- Works with existing `site_media` table
- Catalogs all current media assets
- Adds generation tracking for new AI assets

### 5. AI Agents

Configurable AI assistants for various tasks (content writing, customer support, research).

**Features:**
- Create/edit agent configurations
- Set system prompts and behavior
- Configure LLM provider (Anthropic Claude, OpenAI)
- Temperature, max tokens, model selection
- Training via feedback loop (thumbs up/down)
- Prompt improvement automation
- Context retrieval from Business Brain
- Brand DNA enforcement

**Agent Types:**
- **Content Writer**: Generates blog posts using brain facts
- **Customer Support**: Answers questions about services
- **Research Assistant**: Extracts facts from web content
- **SEO Optimizer**: Generates metadata and keywords

### 6. Workflow Automation

Schedule and automate recurring tasks.

**Features:**
- Automated web scraping from knowledge sources
- Scheduled content generation
- Fact verification and staleness checks
- Background job processing (Netlify background functions)
- Progress tracking and logs
- Error handling and retry logic

**Example Workflows:**
- Daily sitemap scraping → fact extraction → brain update
- Weekly content generation → draft creation → team notification
- Monthly fact verification → confidence score updates

### 7. Brand DNA Management

Define and enforce brand voice, tone, and style across all AI outputs.

**Features:**
- Style rules (formal/casual, technical/simple)
- Voice guidelines (bold, contrarian, no-fluff)
- Tone settings (professional, friendly, authoritative)
- Lexicon (preferred terms, forbidden words)
- Example content for AI training
- Taboo topics and phrases

**Integration:**
- Automatically injected into agent prompts
- Used during training to improve system prompts
- Ensures consistency across all AI-generated content

### 8. Telemetry & Analytics

System health monitoring and usage tracking.

**Features:**
- Event stream (AI invocations, ingestion jobs, user actions)
- Performance metrics (response times, token usage)
- Error monitoring and alerting
- Usage analytics (most active agents, content stats)
- Audit trail for all admin actions

---

## Architecture Overview

### Frontend Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      AdminPortal                           │
│                  (src/admin-portal.jsx)                    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │            AdminShell                             │    │
│  │        (src/admin/AdminShell.jsx)                │    │
│  │                                                   │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │  Sidebar Navigation                      │    │    │
│  │  │  - Overview                              │    │    │
│  │  │  - Content Management                    │    │    │
│  │  │  - Team Management                       │    │    │
│  │  │  - Media Library                         │    │    │
│  │  │  - Business Brain                        │    │    │
│  │  │  - Brand DNA                             │    │    │
│  │  │  - Agents                                │    │    │
│  │  │  - Workflows                             │    │    │
│  │  │  - Integrations                          │    │    │
│  │  │  - Telemetry                             │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  │                                                   │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │  <Outlet /> (React Router)              │    │    │
│  │  │  Renders active module                   │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  Protected by:                                            │
│  - ProtectedRoute.jsx (JWT verification)                 │
│  - AdminLogin.jsx (Matrix-style auth)                    │
└────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
┌────────────────────────────────────────────────────────────┐
│                  Netlify Functions                         │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  ai_invoke.ts                                     │    │
│  │  - Receives chat messages                         │    │
│  │  - Retrieves brain facts (FTS)                    │    │
│  │  - Composes prompt with context                   │    │
│  │  - Calls LLM (Claude/OpenAI)                      │    │
│  │  - Saves conversation                             │    │
│  │  - Returns response                               │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  ingest_dispatch-background.ts                    │    │
│  │  - Scrapes URLs/sitemaps                          │    │
│  │  - Extracts content (Readability)                 │    │
│  │  - Calls LLM for fact extraction                  │    │
│  │  - Deduplicates facts                             │    │
│  │  - Saves to brain_facts                           │    │
│  │  - Updates progress                               │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  agent_train-background.ts                        │    │
│  │  - Collects training examples                     │    │
│  │  - Aggregates feedback                            │    │
│  │  - Calls LLM to improve prompt                    │    │
│  │  - Applies brand rules                            │    │
│  │  - Updates agent config                           │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  Supporting Libraries:                                    │
│  - lib/llm.ts (unified LLM interface)                    │
│  - lib/scraper.ts (web scraping)                         │
│  - lib/fact-extractor.ts (AI extraction)                 │
│  - lib/supabase.ts (DB client)                           │
└────────────────────────────────────────────────────────────┘
```

### Database Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Supabase PostgreSQL                     │
│                                                            │
│  EXISTING TABLES (Enhanced):                              │
│  ┌──────────────────────────────────────────────────┐    │
│  │  team_members                                     │    │
│  │  + user_id, can_write_content, default_agent_id  │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  posts                                            │    │
│  │  + status, agent_id, seo, word_count             │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  site_media                                       │    │
│  │  + ai_generated, generation_prompt, tags         │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  NEW ADMIN TABLES:                                        │
│  ┌──────────────────────────────────────────────────┐    │
│  │  business_brains                                  │    │
│  │  One per site/client                              │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  brain_facts (with FTS)                           │    │
│  │  Knowledge base entries                           │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  agents                                           │    │
│  │  AI agent configurations                          │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  conversations, messages                          │    │
│  │  Chat history                                     │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  workflows, integrations                          │    │
│  │  Automation configuration                         │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │  brand_rules, knowledge_sources                   │    │
│  │  Brand DNA and data sources                       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  JUNCTION TABLES:                                         │
│  - post_brain_facts (posts ↔ brain_facts)               │
│  - media_workflows (site_media ↔ workflows)              │
│  - content_calendar (scheduled publishing)                │
│                                                            │
│  RPC FUNCTIONS:                                           │
│  - search_brain_facts(brain_id, query, limit)            │
│  - get_brain_health(brain_id)                            │
│  - append_feedback(message_id, rating, comment)          │
│                                                            │
│  RLS POLICIES:                                            │
│  - Admin-only access (JWT role check)                    │
│  - Automatic enforcement on all tables                    │
└────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### AI Agent Chat Flow

```
User (Admin Panel) → Agent Chat UI
                          ↓
              [Composes message array]
                          ↓
            POST /ai_invoke function
                          ↓
        [Retrieves agent config from DB]
                          ↓
    [Extracts query terms from message]
                          ↓
    [Calls search_brain_facts RPC]
    ← Returns top 15 relevant facts
                          ↓
        [Retrieves brand rules]
                          ↓
    [Composes full prompt with context:
     - Agent system prompt
     - Brain facts (context)
     - Brand DNA rules
     - User message]
                          ↓
         [Calls LLM API]
      (Anthropic or OpenAI)
                          ↓
    [Saves message + response to DB]
                          ↓
       [Logs to telemetry]
                          ↓
    Returns response to UI
                          ↓
        User sees response
     (with feedback buttons)
```

### Web Scraping & Fact Extraction Flow

```
User (Admin Panel) → Knowledge Source form
                          ↓
           [Enters URL or sitemap]
                          ↓
         Creates knowledge_source
                          ↓
     POST /ingest_dispatch function
                          ↓
        [Creates ingest_job record]
                          ↓
         [Background processing]
                          ↓
    ┌─────────────────────────────────┐
    │  For each URL:                  │
    │  1. Fetch HTML                  │
    │  2. Extract content (Readability)│
    │  3. Call LLM for fact extraction│
    │  4. Parse JSON response         │
    │  5. Check for duplicates (FTS)  │
    │  6. Save new facts to brain     │
    │  7. Update progress %           │
    └─────────────────────────────────┘
                          ↓
        [Job status → success]
                          ↓
       [Updates UI via polling
        or Supabase Realtime]
                          ↓
    User sees new facts in Brain
```

### Content Generation Flow

```
User (Content Management) → "Generate with AI"
                          ↓
           [Selects agent + topic]
                          ↓
         POST /ai_invoke function
      [with special content generation prompt]
                          ↓
    [Retrieves relevant brain facts
     about the topic]
                          ↓
    [Composes full article prompt:
     - Topic/keywords
     - Brain facts (research)
     - Brand DNA (voice/tone)
     - SEO requirements]
                          ↓
       [Calls LLM (Claude Sonnet 4.5)]
                          ↓
    [Receives full article with:
     - Title
     - Meta description
     - Body content
     - Headings/structure]
                          ↓
    [Creates post record:
     - status: 'draft'
     - agent_id: (selected agent)
     - brain_snapshot: (facts used)
     - seo: (metadata)
     - word_count, reading_time]
                          ↓
    [Links to post_brain_facts junction]
                          ↓
        User reviews draft
    (can edit or publish directly)
```

---

## Security Architecture

### Authentication Flow

```
1. User visits /admin/secret
   ↓
2. AdminLogin.jsx renders
   ↓
3. User enters email + password
   ↓
4. Calls supabase.auth.signInWithPassword()
   ↓
5. Supabase verifies credentials
   ↓
6. Returns JWT with claims
   ↓
7. Frontend checks for 'admin' role in JWT
   ↓
8. If admin → redirect to /admin/secret/overview
   If not admin → show error
```

### Admin Role Assignment

**Method 1: Supabase Edge Function (Recommended)**
```
Admin user signs in → Edge Function triggered
                          ↓
       [Checks email against whitelist]
                          ↓
     [Verifies secret key if provided]
                          ↓
    [Updates user metadata:
     app_metadata.role = 'admin']
                          ↓
    [Refreshes JWT with new claims]
```

**Method 2: Manual (Supabase Dashboard)**
```
1. Navigate to Authentication → Users
2. Find user by email
3. Edit user → app_metadata
4. Add: {"role": "admin"}
5. Save
6. User refreshes session
```

**Method 3: Setup Script**
```bash
node scripts/setup-admin-user.js admin@disruptors.co SecurePass123!
```

### Row-Level Security (RLS)

**All admin tables protected:**
```sql
create policy admin_all_access on table_name
  for all using (
    (current_setting('request.jwt.claims', true)::jsonb->>'role') = 'admin'
  )
```

**What this means:**
- Non-admin users CANNOT see admin tables
- Service role key bypasses RLS (used in Netlify Functions)
- Public anon key respects RLS (used in frontend)
- Automatic enforcement, no manual checks needed

### Secret Access Patterns

**For public-facing admin access (optional):**
1. **5 logo clicks in 3 seconds** → Grants temporary admin access
2. **Ctrl+Shift+D** → Immediate admin portal access
3. **Ctrl+Shift+Escape** → Emergency exit

*Note: These are convenience methods. Production should use standard login.*

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router DOM v7** - Admin routing (isolated from main site)
- **Lucide React** - Icon system
- **Tailwind CSS** - Styling (Matrix theme)
- **Supabase JS Client** - Database access

### Backend
- **Netlify Functions** - Serverless backend
- **TypeScript** - Type safety
- **Supabase PostgreSQL** - Database
- **Supabase Edge Functions** - JWT claim management
- **Anthropic SDK** - Claude integration
- **OpenAI SDK** - GPT integration
- **jsdom + Readability** - Web scraping

### Database
- **PostgreSQL 15+** - Core database
- **Full-Text Search (FTS)** - Fast fact retrieval
- **Row-Level Security (RLS)** - Authorization
- **Triggers** - Auto-update timestamps
- **pgvector** (optional) - Semantic search

### Infrastructure
- **Netlify** - Hosting + Functions
- **Supabase** - Database + Auth + Realtime
- **GitHub** - Version control + CI/CD

---

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        NETLIFY                             │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Static Site (React SPA)                          │    │
│  │  - Build: npm run build                           │    │
│  │  - Output: dist/                                  │    │
│  │  - Routing: _redirects file                       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Netlify Functions                                │    │
│  │  - Auto-deploy from netlify/functions/           │    │
│  │  - Environment variables from dashboard          │    │
│  │  - Background functions (15 min timeout)         │    │
│  └──────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
                          ↓
                  Communicates with
                          ↓
┌────────────────────────────────────────────────────────────┐
│                       SUPABASE                             │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  PostgreSQL Database                              │    │
│  │  - Existing + new tables                          │    │
│  │  - RLS policies                                   │    │
│  │  - RPC functions                                  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Authentication                                   │    │
│  │  - Email/password                                 │    │
│  │  - JWT with custom claims                         │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Edge Functions                                   │    │
│  │  - set-admin-role (JWT claims)                    │    │
│  └──────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
                          ↓
                 Calls external APIs
                          ↓
┌────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                       │
│  - Anthropic (Claude Sonnet 4.5)                          │
│  - OpenAI (GPT models)                                    │
│  - Google (Gemini for image generation)                   │
│  - Replicate (Flux models)                                │
└────────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

### Frontend Optimization
- **Lazy Loading**: Admin portal only loads when accessing `/admin/secret`
- **Code Splitting**: Each module is a separate chunk
- **Bundle Size**: ~500KB for admin portal (separate from main site)
- **Caching**: Static assets cached by Netlify CDN

### Database Optimization
- **FTS Indexes**: Fast full-text search on brain_facts
- **Partial Indexes**: Optimized queries for common filters
- **Connection Pooling**: Supabase handles automatically
- **RPC Functions**: Reduce round-trips for complex queries

### Backend Optimization
- **Background Functions**: Long-running tasks (scraping, training)
- **Rate Limiting**: Prevent API abuse
- **Caching**: Fact retrieval cached during conversation
- **Streaming**: LLM responses can stream (future enhancement)

---

## Scalability

### Current Capacity
- **Brain Facts**: 100,000+ facts per brain with fast FTS
- **Conversations**: Unlimited, archived after 90 days
- **Concurrent Users**: 10+ admins (typical usage)
- **API Requests**: Netlify Functions scale automatically

### Future Scaling
- **Vector Search**: Add pgvector for semantic search (Phase 4)
- **Message Queues**: Supabase Queues for background jobs (Phase 4)
- **Horizontal Scaling**: Supabase handles automatically
- **CDN**: Static assets already on Netlify CDN

---

## Maintenance & Monitoring

### Health Checks
- **Brain Health RPC**: `get_brain_health(brain_id)` returns metrics
- **Telemetry Events**: All admin actions logged
- **Error Tracking**: Function errors logged to Netlify
- **Database Logs**: Supabase dashboard query inspector

### Backup & Recovery
- **Supabase Auto-Backups**: Daily backups, 7-day retention
- **Manual Snapshots**: Before major migrations
- **Git Version Control**: All code changes tracked
- **Rollback Procedures**: Documented in TROUBLESHOOTING.md

---

## Success Metrics

### Phase 0 (Foundation)
- Admin can log in to `/admin/secret`
- Database schema deployed without errors
- Public site functions exactly as before

### Phase 1 (Core MVP)
- Business brain has 50+ facts
- Agent chat uses facts correctly
- Feedback loop works

### Phase 2 (Automation)
- Web scraping extracts 100+ facts automatically
- Agent training improves prompts
- No manual intervention needed

### Phase 3 (Full Features)
- All 10 modules functional
- Team uses admin daily
- AI-generated content published to public site

---

## Next Steps

1. **Read**: `INTEGRATION_CHANGES.md` for detailed code changes
2. **Follow**: `IMPLEMENTATION_TODO.md` for step-by-step integration
3. **Reference**: `TECHNICAL_REFERENCE.md` for API specs
4. **Understand**: `DATA_MODEL.md` for database relationships
5. **Learn**: `ADMIN_MODULES.md` for module usage
6. **Troubleshoot**: `TROUBLESHOOTING.md` if issues arise

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-01
**Author**: Claude Code (Anthropic)
**Project**: Disruptors AI Marketing Hub - Admin Nexus Integration
