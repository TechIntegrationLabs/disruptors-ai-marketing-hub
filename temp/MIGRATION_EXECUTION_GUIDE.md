# Admin Nexus Migration Execution Guide

## Overview
This guide walks you through applying the Admin Nexus database schema migrations to your Supabase database.

**Project:** Disruptors AI Marketing Hub
**Supabase Project ID:** `ubqxflzuvxowigbjmqfb`
**Execution Method:** Supabase SQL Editor (Manual)

---

## Why Manual Execution?

Supabase requires SQL migrations to be executed through their SQL Editor for security. The service role key provides API access but not direct PostgreSQL access.

---

## Prerequisites

✅ Access to Supabase Dashboard
✅ Project URL: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb
✅ Admin privileges on the project

---

## Migration Files

### Migration 001: Initialize Admin Schema
- **File:** `temp/admin-nexus-COMPLETE/DB/migrations/001_init_enhanced.sql`
- **Size:** ~15 KB
- **Creates:**
  - 15+ new tables (business_brains, brain_facts, agents, conversations, etc.)
  - RPC functions (search_brain_facts, append_feedback, get_brain_health)
  - RLS policies for admin-only access
  - Seed data (default brain, sample facts, test agent)

### Migration 002: Integrate Existing Tables
- **File:** `temp/admin-nexus-COMPLETE/DB/migrations/002_integrate_existing.sql`
- **Size:** ~12 KB
- **Enhances:**
  - Existing tables (team_members, posts, site_media)
  - Creates junction tables (post_brain_facts, post_media, team_member_agents)
  - Creates views (posts_with_authors, media_with_generation, content_calendar)
  - Creates helper functions (get_team_member_stats, link_post_brain_facts)
  - **SAFE:** Only ADDS columns, never DELETES data

---

## Step-by-Step Execution

### Step 1: Open Supabase SQL Editor

1. Navigate to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new
2. You should see a blank SQL editor

### Step 2: Execute Migration 001

1. **Read the migration file:**
   ```bash
   cat "c:\Users\Will\OneDrive\Documents\Projects\dm4\disruptors-ai-marketing-hub\temp\admin-nexus-COMPLETE\DB\migrations\001_init_enhanced.sql"
   ```

2. **Or use Node.js to display it:**
   ```bash
   node temp/copy-migration-sql.js 1
   ```

3. **Copy the ENTIRE SQL content** (all ~531 lines)

4. **Paste into SQL Editor**

5. **Click "Run"** or press Ctrl+Enter

6. **Verify success:**
   - Check for green "Success" message
   - Look for "Migration executed successfully" or similar
   - If you see errors about "already exists", that's OK - it means some objects are already there

### Step 3: Verify Migration 001

Run this verification query in SQL Editor:

```sql
-- Verify tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'business_brains', 'brain_facts', 'agents',
    'conversations', 'messages', 'integrations'
  );

-- Verify seed data
SELECT * FROM business_brains WHERE slug = 'default';
SELECT * FROM brain_facts LIMIT 5;
SELECT * FROM agents WHERE name = 'Content Writer';

-- Verify functions
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'search_brain_facts', 'append_feedback', 'get_brain_health'
  );
```

**Expected Results:**
- 6 tables found
- 1 business brain with slug 'default'
- 3+ brain facts
- 1 agent named 'Content Writer'
- 3 functions found

### Step 4: Execute Migration 002

1. **Read the migration file:**
   ```bash
   cat "c:\Users\Will\OneDrive\Documents\Projects\dm4\disruptors-ai-marketing-hub\temp\admin-nexus-COMPLETE\DB\migrations\002_integrate_existing.sql"
   ```

2. **Or use Node.js:**
   ```bash
   node temp/copy-migration-sql.js 2
   ```

3. **Copy the ENTIRE SQL content** (all ~420 lines)

4. **Paste into SQL Editor**

5. **Click "Run"**

6. **Verify success**

### Step 5: Verify Migration 002

Run this verification query:

```sql
-- Verify junction tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'post_brain_facts', 'post_media',
    'team_member_agents', 'content_audit_log'
  );

-- Verify views
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN (
    'posts_with_authors', 'media_with_generation', 'content_calendar'
  );

-- Verify enhanced columns on existing tables
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'posts'
  AND column_name IN (
    'status', 'author_member_id', 'agent_id',
    'brain_snapshot', 'seo', 'generation_metadata'
  );

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'team_members'
  AND column_name IN (
    'user_id', 'can_write_content', 'default_agent_id'
  );
```

**Expected Results:**
- 4 junction tables found
- 3 views found
- 6 new columns on posts table
- 3 new columns on team_members table

---

## Verification Checklist

After both migrations complete, verify:

- [ ] All 15+ admin tables created (business_brains, brain_facts, etc.)
- [ ] RLS policies active on all admin tables
- [ ] Seed data present (default brain, sample facts, test agent)
- [ ] Junction tables created (post_brain_facts, post_media, team_member_agents)
- [ ] Views created (posts_with_authors, media_with_generation, content_calendar)
- [ ] Existing tables enhanced but data intact (team_members, posts, site_media)
- [ ] Helper functions created (get_team_member_stats, etc.)
- [ ] Audit logging enabled on posts table

---

## Common Issues & Solutions

### Issue: "relation already exists"
**Solution:** This is normal if you're re-running migrations. The `IF NOT EXISTS` clauses prevent errors.

### Issue: "column already exists"
**Solution:** This is OK - the `ADD COLUMN IF NOT EXISTS` prevents duplicate columns.

### Issue: "permission denied"
**Solution:** Make sure you're logged in as the project owner or have admin access.

### Issue: Foreign key constraint fails
**Solution:** Check if referenced tables exist. Migration 001 must complete before 002.

---

## Post-Migration Setup

### 1. Configure Admin Role

Admin access is controlled by JWT claims. To give a user admin access:

```sql
-- Create a custom claim for admin role (requires Supabase CLI or custom auth hook)
-- OR use RLS bypass with service role key for now
```

### 2. Test Admin Access

Try accessing admin tables through your application:

```javascript
import { supabase } from './lib/supabase-client';

// This should work with service role key
const { data, error } = await supabase
  .from('business_brains')
  .select('*');

console.log('Business Brains:', data);
```

### 3. Verify RLS Policies

Test that regular users (anon key) cannot access admin tables:

```javascript
// Using anon key - should fail
const { data, error } = await supabaseAnonClient
  .from('business_brains')
  .select('*');

console.log('Error (expected):', error); // Should be RLS policy error
```

---

## Rollback Instructions

If you need to rollback migrations:

```sql
-- Drop migration 002 objects
DROP VIEW IF EXISTS content_calendar;
DROP VIEW IF EXISTS media_with_generation;
DROP VIEW IF EXISTS posts_with_authors;
DROP TABLE IF EXISTS content_audit_log CASCADE;
DROP TABLE IF EXISTS team_member_agents CASCADE;
DROP TABLE IF EXISTS post_media CASCADE;
DROP TABLE IF EXISTS post_brain_facts CASCADE;

-- Drop migration 001 objects
DROP TABLE IF EXISTS telemetry_events CASCADE;
DROP TABLE IF EXISTS workflow_runs CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS integrations CASCADE;
DROP TABLE IF EXISTS agent_feedback CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS agent_runs CASCADE;
DROP TABLE IF EXISTS agent_training_examples CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS ingest_jobs CASCADE;
DROP TABLE IF EXISTS knowledge_sources CASCADE;
DROP TABLE IF EXISTS brand_rules CASCADE;
DROP TABLE IF EXISTS brain_facts CASCADE;
DROP TABLE IF EXISTS business_brains CASCADE;

DROP FUNCTION IF EXISTS search_brain_facts;
DROP FUNCTION IF EXISTS append_feedback;
DROP FUNCTION IF EXISTS get_brain_health;
DROP FUNCTION IF EXISTS update_updated_at_column;
```

---

## Quick Commands

```bash
# Display Migration 001 SQL
node temp/copy-migration-sql.js 1

# Display Migration 002 SQL
node temp/copy-migration-sql.js 2

# View migration files directly
cat "temp/admin-nexus-COMPLETE/DB/migrations/001_init_enhanced.sql"
cat "temp/admin-nexus-COMPLETE/DB/migrations/002_integrate_existing.sql"
```

---

## Support Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb
- **SQL Editor:** https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new
- **Database Settings:** https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/settings/database
- **API Settings:** https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/settings/api

---

## Success Indicators

✅ Migration 001: ~15 new tables, 3 RPC functions, seed data
✅ Migration 002: 4 junction tables, 3 views, enhanced existing tables
✅ Zero data loss on existing tables (team_members, posts, site_media)
✅ RLS policies active protecting admin tables
✅ Seed data queryable in business_brains

---

## Next Steps After Success

1. **Configure Admin Authentication**
   - Set up JWT claims for admin role
   - Or use service role key for admin operations

2. **Test Admin Dashboard**
   - Access admin routes in your application
   - Verify admin UI components load

3. **Create Content**
   - Use the new agent system to generate content
   - Link posts to brain facts
   - Track content in the new audit system

4. **Monitor Health**
   - Use `get_brain_health()` function
   - Check telemetry_events for system logs
   - Review workflow_runs for automation

---

**Ready to begin?** Start with Step 1 above!
