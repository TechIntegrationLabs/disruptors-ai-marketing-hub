# Admin Nexus - Integration Changes

## Overview

This document provides a complete, detailed list of every change required to integrate Admin Nexus into the Disruptors AI Marketing Hub. All changes are designed to be **non-breaking** and **additive** to the existing codebase.

---

## Table of Contents

1. [New Files Being Added](#new-files-being-added)
2. [Existing Files Being Modified](#existing-files-being-modified)
3. [Database Schema Changes](#database-schema-changes)
4. [Environment Variables](#environment-variables)
5. [Dependencies](#dependencies)
6. [Build Configuration](#build-configuration)
7. [Deployment Configuration](#deployment-configuration)

---

## New Files Being Added

### Frontend Files (12 files)

#### Admin Shell & Routing

**`src/admin-portal.jsx`** (56 lines)
- Standalone entry point for admin panel
- React Router configuration with `/admin/secret` basename
- Complete isolation from main site routing
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin-portal.jsx`

**`src/admin/AdminShell.jsx`** (165 lines)
- Main admin container with Matrix-style UI
- Sidebar navigation (10 modules)
- Header with logout button
- Responsive layout with toggle
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/AdminShell.jsx`

**`src/admin/routes.jsx`** (45 lines)
- Internal admin routing configuration
- Lazy-loaded modules for code splitting
- Protected route wrappers
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/routes.jsx`

#### Authentication Components

**`src/admin/auth/AdminLogin.jsx`** (175 lines)
- Matrix-style login interface
- Email/password authentication via Supabase
- Secret key access pattern support
- Loading states and error handling
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/auth/AdminLogin.jsx`

**`src/admin/auth/ProtectedRoute.jsx`** (70 lines)
- Authentication guard wrapper
- JWT role verification
- Auto-redirect to login if unauthorized
- Session state management
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/auth/ProtectedRoute.jsx`

#### Admin Modules (6 files)

**`src/admin/modules/DashboardOverview.jsx`** (200+ lines)
- System overview dashboard
- Content stats (posts, media, team)
- Brain health metrics
- Recent activity feed
- Quick actions panel
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/modules/DashboardOverview.jsx`

**`src/admin/modules/ContentManagement.jsx`** (250+ lines)
- Post listing with status filters
- Author attribution (team_members)
- AI-generated vs manual content indicators
- SEO metadata editing
- Bulk operations (publish, archive, delete)
- "Generate with AI" button
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/modules/ContentManagement.jsx`

**`src/admin/modules/TeamManagement.jsx`** (200+ lines)
- Team member listing
- Content permission toggles
- Agent assignment interface
- Content creation statistics
- User-to-member linking
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/modules/TeamManagement.jsx`

**`src/admin/modules/MediaLibrary.jsx`** (220+ lines)
- Site media browser with grid/list views
- AI-generated vs manual filters
- Tag-based search
- Generation metadata display
- Upload new media
- Generate with AI workflow
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/modules/MediaLibrary.jsx`

**`src/admin/modules/BusinessBrainBuilder.jsx`** (197 lines)
- Brain fact explorer with FTS search
- Manual fact entry form
- Knowledge source management
- Ingestion job triggers
- Health dashboard
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/modules/BusinessBrainBuilder.jsx`

**`src/admin/modules/AgentChat.jsx`** (174 lines)
- Chat interface with message history
- Real-time responses from agents
- Feedback buttons (thumbs up/down)
- Context-aware conversations
- Agent selector dropdown
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/admin/modules/AgentChat.jsx`

#### API Layer (3 files)

**`src/api/auth.ts`** (207 lines)
- `loginAdmin(email, password)` - Login function
- `logoutAdmin()` - Logout function
- `getCurrentUser()` - Get current session
- `checkAdminRole()` - Verify admin JWT claim
- `refreshSession()` - Refresh JWT
- Secret access pattern helpers
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/api/auth.ts`

**`src/api/client.ts`** (45 lines)
- Base API client with fetch wrapper
- Auth token injection
- Error handling and parsing
- Request/response interceptors
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/api/client.ts`

**`src/api/entities.ts`** (198 lines)
- `BrainFacts` - CRUD for brain facts
- `Agents` - Agent configuration management
- `Conversations` - Chat history
- `IngestJobs` - Scraping job tracking
- `BrandRules` - Brand DNA management
- Direct Supabase access + Netlify Function wrappers
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/api/entities.ts`

#### Integration Guide

**`src/integration/admin-router-integration.jsx`** (109 lines)
- Example integration patterns (Methods A, B, C)
- Secret access hooks
- Usage documentation
- Code examples for different routing approaches
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/integration/admin-router-integration.jsx`

---

### Backend Files (8 files)

#### Netlify Functions (3 production implementations)

**`netlify/functions/ai_invoke.ts`** (92 lines)
- Endpoint: `/.netlify/functions/ai_invoke`
- Handles agent chat requests
- Retrieves brain facts via FTS
- Composes prompts with context + brand DNA
- Calls Anthropic Claude or OpenAI
- Saves conversation to database
- Returns streaming or full response
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/netlify/functions/ai_invoke.ts`

**`netlify/functions/agent_train-background.ts`** (121 lines)
- Endpoint: `/.netlify/functions/agent_train-background`
- Background function (15 min timeout)
- Collects training examples from feedback
- Aggregates thumbs up/down ratings
- Calls LLM to improve system prompt
- Applies brand rules to suggestions
- Updates agent configuration
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/netlify/functions/agent_train-background.ts`

**`netlify/functions/ingest_dispatch-background.ts`** (177 lines)
- Endpoint: `/.netlify/functions/ingest_dispatch-background`
- Background function (15 min timeout)
- Scrapes URLs and sitemaps
- Extracts clean content via Readability
- Calls LLM for fact extraction
- Deduplicates via FTS search
- Saves facts to brain
- Updates progress in real-time
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/netlify/functions/ingest_dispatch-background.ts`

#### Supporting Libraries (4 files)

**`netlify/lib/llm.ts`** (235 lines)
- Unified LLM interface for Anthropic + OpenAI
- `invokeLLM(messages, options)` - Call any LLM
- `composePromptWithContext(...)` - Inject brain facts + brand DNA
- `extractQueryTerms(text)` - Extract keywords for FTS
- Token counting utilities
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/netlify/lib/llm.ts`

**`netlify/lib/scraper.ts`** (241 lines)
- `scrapeURL(url)` - Fetch and extract content
- `scrapeSitemap(url)` - Parse sitemap XML
- `extractContent(html)` - Readability extraction
- URL discovery and normalization
- Rate limiting helpers
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/netlify/lib/scraper.ts`

**`netlify/lib/fact-extractor.ts`** (169 lines)
- `extractFacts(content, brainId)` - AI-powered fact extraction
- `deduplicateFacts(facts, brainId)` - FTS-based deduplication
- `validateFact(fact)` - Quality checks
- Batch processing helpers
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/netlify/lib/fact-extractor.ts`

**`netlify/lib/supabase.ts`** (23 lines)
- `getServiceClient()` - Service role client (bypasses RLS)
- `getAnonClient()` - Anonymous client (respects RLS)
- Environment-aware configuration
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/netlify/lib/supabase.ts`

#### Edge Functions (1 file)

**`netlify/edge-functions/set-admin-role.ts`** (84 lines)
- Supabase Edge Function (deployed to Supabase, not Netlify)
- Triggered on user login
- Checks email whitelist
- Verifies secret key if provided
- Updates JWT with admin role claim
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/netlify/edge-functions/set-admin-role.ts`
- **Deployment**: `supabase functions deploy set-admin-role`

---

### Database Files (2 migrations)

**`DB/migrations/001_init_enhanced.sql`** (786 lines)
- Creates 15+ new admin tables
- Implements 3 RPC functions
- Sets up RLS policies for all tables
- Creates automatic update triggers
- Adds seed data (default brain, sample agent)
- Full-text search indexes
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/DB/migrations/001_init_enhanced.sql`
- **Execution**: Run in Supabase SQL Editor

**`DB/migrations/002_integrate_existing.sql`** (300+ lines)
- Enhances existing `team_members` table (adds 5 columns)
- Enhances existing `posts` table (adds 9 columns)
- Enhances existing `site_media` table (adds 7 columns)
- Creates junction tables (`post_brain_facts`, `media_workflows`)
- Creates views (`posts_with_authors`, `media_with_generation`, `content_calendar`)
- Creates helper functions (`get_posts_using_brain_fact`, `get_team_member_stats`)
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/DB/migrations/002_integrate_existing.sql`
- **Execution**: Run in Supabase SQL Editor AFTER 001

---

### Scripts (2 files)

**`scripts/setup-admin-user.js`** (84 lines)
- Automated admin user creation
- CLI interface: `node scripts/setup-admin-user.js email password`
- Creates user account
- Grants admin role
- Verifies setup
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/scripts/setup-admin-user.js`

**`scripts/migrate-existing-data.js`** (150+ lines)
- Safe data migration script
- Links team_members to admin system
- Updates posts with metadata
- Catalogs site_media
- Creates content snapshot in brain
- **Location**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/scripts/migrate-existing-data.js`

---

### Documentation Files (7 files)

**`docs/admin-nexus/SYSTEM_OVERVIEW.md`**
- Executive summary
- Architecture diagrams
- Feature overview

**`docs/admin-nexus/INTEGRATION_CHANGES.md`** (this file)
- Complete file listing
- Change details

**`docs/admin-nexus/IMPLEMENTATION_TODO.md`**
- Step-by-step checklist
- Phase-by-phase guide

**`docs/admin-nexus/TECHNICAL_REFERENCE.md`**
- API specifications
- Database schemas
- Function signatures

**`docs/admin-nexus/DATA_MODEL.md`**
- Entity relationships
- Table documentation

**`docs/admin-nexus/ADMIN_MODULES.md`**
- Module usage guides
- User workflows

**`docs/admin-nexus/TROUBLESHOOTING.md`**
- Common issues
- Solutions and fixes

---

## Existing Files Being Modified

### CRITICAL: Only ONE Line Added to Existing Codebase

**Option A: Modify `src/pages/index.jsx`** (RECOMMENDED)

**File**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/src/pages/index.jsx`

**Change**: Add admin route guard at the TOP of the main component

**Before** (lines 1-18):
```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Layout from "./Layout.jsx";

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy load all pages for optimal performance
// Home page loaded immediately for faster initial render
import Home from "./Home.jsx";
```

**After** (ADD these lines):
```javascript
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Layout from "./Layout.jsx";

// ============ ADMIN NEXUS INTEGRATION ============
import AdminPortal from '../admin-portal';
// =================================================

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy load all pages for optimal performance
// Home page loaded immediately for faster initial render
import Home from "./Home.jsx";
```

**Then, find the main export function** (around line 270) and add guard:

**Before**:
```javascript
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* All your existing routes */}
      </Routes>
    </Router>
  );
}
```

**After**:
```javascript
export default function AppRouter() {
  // ============ ADMIN NEXUS ROUTE GUARD ============
  // Intercept admin routes BEFORE public site routing
  if (window.location.pathname.startsWith('/admin/secret')) {
    return <AdminPortal />;
  }
  // =================================================

  return (
    <Router>
      <Routes>
        {/* All your existing routes */}
      </Routes>
    </Router>
  );
}
```

**Total Changes**:
- 1 import statement added (line 6)
- 4 lines added in function (route guard)
- **ZERO changes to existing routing logic**

---

**Option B: Create New Wrapper (ZERO changes to existing files)**

**Instead of modifying `src/pages/index.jsx`, create new file:**

**File**: `src/index-wrapper.jsx` (NEW FILE)

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';

// Check URL before loading anything
if (window.location.pathname.startsWith('/admin/secret')) {
  // Load admin portal
  import('./admin-portal').then(({ default: AdminPortal }) => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <AdminPortal />
      </React.StrictMode>
    );
  });
} else {
  // Load existing app
  import('./main').then((module) => {
    // Your existing main.jsx logic
  });
}
```

**Then update `index.html`:**

**File**: `C:/Users/Will/OneDrive/Documents/Projects/dm4/disruptors-ai-marketing-hub/index.html`

**Before** (line ~12):
```html
<script type="module" src="/src/main.jsx"></script>
```

**After**:
```html
<script type="module" src="/src/index-wrapper.jsx"></script>
```

**Total Changes**:
- 1 new file created
- 1 line changed in `index.html`

---

### No Other Existing Files Modified

**The beauty of Admin Nexus integration:**
- Public site pages: **UNCHANGED**
- Public components: **UNCHANGED**
- Existing routing: **UNCHANGED**
- Existing API calls: **UNCHANGED**
- Existing styles: **UNCHANGED**

---

## Database Schema Changes

### New Tables (15 tables)

All tables created by `001_init_enhanced.sql`:

1. **`business_brains`** - One per site/client
2. **`brain_facts`** - Knowledge base with FTS
3. **`brand_rules`** - Voice, tone, style guidelines
4. **`knowledge_sources`** - URLs/sitemaps to ingest
5. **`ingest_jobs`** - Scraping job tracking
6. **`agents`** - AI agent configurations
7. **`conversations`** - Chat sessions
8. **`messages`** - Individual chat messages
9. **`workflows`** - Automation definitions
10. **`workflow_runs`** - Execution history
11. **`integrations`** - OAuth connections
12. **`telemetry_events`** - Audit log
13. **`api_keys`** - Admin API access (future)
14. **`training_examples`** - Agent training data
15. **`feedback_ratings`** - Thumbs up/down

### Enhanced Existing Tables (3 tables)

Changes made by `002_integrate_existing.sql`:

#### `team_members` (5 new columns)

```sql
ALTER TABLE team_members
  ADD COLUMN user_id uuid REFERENCES auth.users(id),
  ADD COLUMN can_write_content boolean DEFAULT false,
  ADD COLUMN default_agent_id uuid REFERENCES agents(id),
  ADD COLUMN content_permissions jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN admin_notes text;
```

**Impact**:
- Existing data preserved
- New columns nullable or have defaults
- Backward compatible

#### `posts` (9 new columns)

```sql
ALTER TABLE posts
  ADD COLUMN status text DEFAULT 'draft',
  ADD COLUMN author_member_id uuid REFERENCES team_members(id),
  ADD COLUMN agent_id uuid REFERENCES agents(id),
  ADD COLUMN brain_snapshot jsonb,
  ADD COLUMN seo jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN generation_metadata jsonb,
  ADD COLUMN published_at timestamptz,
  ADD COLUMN scheduled_for timestamptz,
  ADD COLUMN word_count int,
  ADD COLUMN reading_time_minutes int;
```

**Impact**:
- Existing posts unaffected
- New posts use new columns
- Migration script calculates word_count for existing posts

#### `site_media` (7 new columns)

```sql
ALTER TABLE site_media
  ADD COLUMN generated_by_workflow_id uuid REFERENCES workflows(id),
  ADD COLUMN generated_by_agent_id uuid REFERENCES agents(id),
  ADD COLUMN ai_generated boolean DEFAULT false,
  ADD COLUMN generation_prompt text,
  ADD COLUMN generation_metadata jsonb,
  ADD COLUMN usage_rights text,
  ADD COLUMN tags text[],
  ADD COLUMN indexed_for_search boolean DEFAULT false;
```

**Impact**:
- Existing media marked as NOT ai_generated
- New AI media tracked properly
- Tags extracted from existing alt text

### New Junction Tables (3 tables)

1. **`post_brain_facts`** - Links posts to facts used during generation
2. **`media_workflows`** - Links media to workflows that created them
3. **`content_calendar`** - Scheduled content planning

### New Database Views (3 views)

1. **`posts_with_authors`** - Joins posts + team_members
2. **`media_with_generation`** - Joins site_media + workflows + agents
3. **`content_calendar_view`** - Upcoming scheduled posts

### New RPC Functions (3 functions)

1. **`search_brain_facts(brain_id, query, limit)`**
   - Full-text search on brain facts
   - Returns ranked results with scores
   - Used by AI agent for context retrieval

2. **`get_brain_health(brain_id)`**
   - Returns health metrics:
     - `total_facts` - Total fact count
     - `verified_percentage` - % with last_verified_at set
     - `avg_confidence` - Average confidence score
     - `stale_facts` - Facts not verified in 90 days

3. **`append_feedback(message_id, rating, comment)`**
   - Streamlined feedback submission
   - Creates feedback_ratings record
   - Updates message metadata
   - Returns success status

### New Helper Functions (2 functions)

1. **`get_posts_using_brain_fact(fact_id)`**
   - Returns all posts that used a specific fact
   - Useful for impact analysis

2. **`get_team_member_stats(member_id)`**
   - Returns content creation statistics
   - Total posts, words, avg reading time

### Indexes Created

**On new tables:**
- `brain_facts_fts_idx` - GIN index for full-text search
- `brain_facts_brain_id_idx` - Fast lookup by brain
- `messages_conversation_idx` - Chat history retrieval
- `telemetry_events_created_idx` - Audit log queries

**On enhanced tables:**
- `posts_status_published_idx` - Published content queries
- `posts_author_idx` - Author attribution
- `site_media_tags_idx` - Tag-based search

### RLS Policies Created

**All new tables protected with:**
```sql
create policy admin_all_access on [table_name]
  for all using (
    (current_setting('request.jwt.claims', true)::jsonb->>'role') = 'admin'
  )
```

**Result**: Only users with `app_metadata.role = 'admin'` can access admin tables.

---

## Environment Variables

### Required Variables (Add to `.env` and Netlify Dashboard)

```bash
# ============================================
# ADMIN NEXUS - REQUIRED VARIABLES
# ============================================

# Supabase (EXISTING - verify these are set)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-key  # Server-side only!

# Admin Authentication (NEW)
ADMIN_SECRET_KEY=your-random-secret-key-min-32-chars

# LLM APIs (NEW)
VITE_ANTHROPIC_API_KEY=sk-ant-...your-anthropic-key
VITE_OPENAI_API_KEY=sk-...your-openai-key  # Optional if using GPT models

# Admin Email Whitelist (NEW - optional)
ADMIN_EMAILS=admin@disruptors.co,team@disruptors.co
```

### Optional Variables

```bash
# Web Scraping (for advanced features)
USER_AGENT=DisruptorsBot/1.0 (+https://disruptors.co)

# Rate Limiting
MAX_REQUESTS_PER_HOUR=100

# Feature Flags
ENABLE_VECTOR_SEARCH=false  # Phase 4 feature
ENABLE_STREAMING_RESPONSES=false  # Future enhancement
```

### Netlify Configuration

**In Netlify Dashboard** → Site Settings → Environment Variables:

1. Add all `VITE_*` variables (client-side, safe)
2. Add `SUPABASE_SERVICE_ROLE_KEY` (server-side, sensitive)
3. Add `ADMIN_SECRET_KEY` (server-side, sensitive)
4. Add `ADMIN_EMAILS` (optional)

**IMPORTANT**:
- `VITE_*` variables are public (compiled into frontend bundle)
- Non-`VITE_*` variables are server-side only (Netlify Functions)

---

## Dependencies

### New Dependencies to Install

Run this command:

```bash
npm install @anthropic-ai/sdk openai jsdom @mozilla/readability lucide-react
```

**Breakdown:**

1. **`@anthropic-ai/sdk`** (Latest)
   - Purpose: Claude AI integration
   - Used in: `netlify/lib/llm.ts`, `netlify/functions/ai_invoke.ts`
   - Size: ~200KB

2. **`openai`** (Latest)
   - Purpose: GPT models (optional)
   - Used in: `netlify/lib/llm.ts`
   - Size: ~150KB

3. **`jsdom`** (Latest)
   - Purpose: HTML parsing for web scraping
   - Used in: `netlify/lib/scraper.ts`
   - Size: ~2MB (server-side only)

4. **`@mozilla/readability`** (Latest)
   - Purpose: Content extraction from web pages
   - Used in: `netlify/lib/scraper.ts`
   - Size: ~50KB (server-side only)

5. **`lucide-react`** (Latest)
   - Purpose: Icon system for admin UI
   - Used in: All `src/admin/` components
   - Size: ~500KB (tree-shakable)

### Existing Dependencies (Already Installed)

These are already in your `package.json`:
- `react@^18.2.0`
- `react-router-dom@^7.2.0`
- `@supabase/supabase-js@^2.57.4`
- `tailwindcss@^3.4.17`

### Peer Dependencies

None additional required. All peer dependencies already satisfied.

### Dev Dependencies

No new dev dependencies needed.

---

## Build Configuration

### No Changes Required to `vite.config.js`

Your existing Vite configuration works perfectly. The admin portal:
- Uses the same build system
- Same path aliases (`@/`)
- Same bundling strategy
- Lazy loads via React Router

### Build Output

After running `npm run build`:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js          # Main site bundle (~2MB)
│   ├── admin-portal-[hash].js   # Admin bundle (~500KB)
│   ├── index-[hash].css
│   └── [module-chunks].js       # Lazy-loaded modules
└── _redirects                    # SPA routing (unchanged)
```

**Bundle Size Impact:**
- Main site: **No change** (admin lazy-loaded)
- Admin portal: **+500KB** (only loaded when accessing `/admin/secret`)
- Total: **+500KB** (conditional loading)

### Code Splitting

Admin modules automatically code-split:
```javascript
// src/admin/routes.jsx
const BusinessBrainBuilder = lazy(() =>
  import('./modules/BusinessBrainBuilder')
);
const ContentManagement = lazy(() =>
  import('./modules/ContentManagement')
);
// etc.
```

**Result**: Each module loads on-demand, not upfront.

---

## Deployment Configuration

### Netlify Configuration

**No changes to `netlify.toml` required.**

Your existing configuration handles:
- SPA routing via `_redirects`
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions` (auto-detected)

### Netlify Functions Deployment

**Automatic**: Functions deploy when you push code to git.

```
netlify/functions/
├── ai_invoke.ts                    → /.netlify/functions/ai_invoke
├── agent_train-background.ts       → /.netlify/functions/agent_train-background
└── ingest_dispatch-background.ts   → /.netlify/functions/ingest_dispatch-background
```

**Function Configuration:**
- Runtime: Node.js 18
- Timeout: 10s (regular), 15 min (background)
- Memory: 1024MB
- Concurrency: 50 requests

### Supabase Edge Function Deployment

**Manual deployment required:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy edge function
supabase functions deploy set-admin-role --no-verify-jwt
```

**Configuration:**
- Runtime: Deno
- Trigger: User login event
- Environment: Supabase Edge (not Netlify)

### Database Migrations

**Manual execution in Supabase Dashboard:**

1. Open Supabase Dashboard → SQL Editor
2. Run `001_init_enhanced.sql`
3. Verify all tables created
4. Run `002_integrate_existing.sql`
5. Verify existing tables enhanced

**No automatic migration system** - run manually for safety.

### DNS & Routing

**No DNS changes required.**

Admin accessible at:
- Local: `http://localhost:5173/admin/secret`
- Production: `https://dm4.wjwelsh.com/admin/secret`

**SPA routing** handled by existing `_redirects` file:
```
/*    /index.html   200
```

---

## Rollback Plan

### If Integration Fails

**Frontend Rollback:**
```bash
# Revert single line in src/pages/index.jsx
git checkout HEAD -- src/pages/index.jsx

# Or delete admin-portal.jsx import
# Public site continues unchanged
```

**Database Rollback:**
```sql
-- Drop new tables (keeps existing data)
DROP TABLE IF EXISTS business_brains CASCADE;
DROP TABLE IF EXISTS brain_facts CASCADE;
-- etc.

-- Remove columns from existing tables
ALTER TABLE team_members
  DROP COLUMN IF EXISTS user_id,
  DROP COLUMN IF EXISTS can_write_content,
  DROP COLUMN IF EXISTS default_agent_id;
-- etc.
```

**Function Rollback:**
```bash
# Delete functions from Netlify Dashboard
# Or remove from netlify/functions/ directory
rm -rf netlify/functions/ai_invoke.ts
```

**Full Rollback Time**: ~5 minutes

---

## Testing Checklist

### After Integration

- [ ] Public site loads at `/` (unchanged)
- [ ] All existing pages work (39 pages)
- [ ] Admin login shows at `/admin/secret`
- [ ] Can log in with admin user
- [ ] Dashboard overview displays
- [ ] Database tables visible in Supabase
- [ ] Netlify functions deployed
- [ ] No console errors on public site
- [ ] No console errors in admin panel
- [ ] Build completes without errors

### Acceptance Criteria

**Must Pass:**
1. Public site 100% functional (zero regression)
2. Admin login accessible
3. Database migrations successful
4. Functions deployed

**Can Fix Later:**
1. Individual module bugs
2. UI polish
3. Performance optimization

---

## File Summary

### Total Files Added: 37

- Frontend: 12 files (~2,500 lines)
- Backend: 8 files (~1,200 lines)
- Database: 2 migrations (~1,100 lines)
- Scripts: 2 files (~250 lines)
- Documentation: 7 files (~8,000 lines)
- Configuration: 6 files

### Total Lines of Code: ~13,000

- Production code: ~4,000 lines
- Documentation: ~8,000 lines
- SQL: ~1,100 lines

### Files Modified: 1

- `src/pages/index.jsx` (1 import + 4 lines)
- **OR** create new `src/index-wrapper.jsx` (0 existing files modified)

---

## Integration Impact Assessment

### Risk Level: **LOW**

**Why:**
- Only 1 file modified (or 0 with wrapper approach)
- All new code isolated in `/admin/` directory
- Database changes additive only
- No breaking changes to existing functionality

### Testing Effort: **MEDIUM**

**Required Testing:**
- Public site regression: 2 hours
- Admin panel functionality: 4 hours
- Database integrity: 1 hour
- **Total**: ~7 hours

### Timeline: **3-5 days**

- Day 1: Database + environment setup (4 hours)
- Day 2: Frontend integration (2 hours)
- Day 3: Backend deployment (3 hours)
- Day 4-5: Testing + bug fixes (6 hours)

---

## Next Steps

1. Review this document completely
2. Proceed to `IMPLEMENTATION_TODO.md` for step-by-step guide
3. Reference `TECHNICAL_REFERENCE.md` during implementation
4. Use `TROUBLESHOOTING.md` if issues arise

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-01
**Author**: Claude Code (Anthropic)
**Project**: Disruptors AI Marketing Hub - Admin Nexus Integration
