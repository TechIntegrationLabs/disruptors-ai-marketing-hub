# Admin Nexus Database Migration Instructions

## ⚠️ IMPORTANT: Manual Migration Required

Due to Supabase client API limitations, database migrations must be applied manually through the Supabase SQL Editor.

## Steps to Apply Migrations

### 1. Open Supabase SQL Editor

Navigate to your project's SQL Editor:
```
https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new
```

### 2. Apply Migration 1 - Init Enhanced Schema

**File Location:** `temp/001_init_enhanced.sql`

**What it does:**
- Creates 15 new tables for admin system:
  - business_brains
  - brain_facts
  - brand_rules
  - knowledge_sources
  - ingest_jobs
  - agents
  - agent_training_examples
  - agent_runs
  - conversations
  - messages
  - agent_feedback
  - integrations
  - workflows
  - workflow_runs
  - telemetry_events
- Creates database functions (RPCs)
- Sets up Row Level Security (RLS) policies
- Adds seed data (default brain, sample facts, default agent)

**Instructions:**
1. Open the file `temp/001_init_enhanced.sql` in a text editor
2. Copy ALL the SQL content (lines 1-531)
3. Paste into Supabase SQL Editor
4. Click "Run" button
5. Wait for completion (should see "Success" message)
6. Verify no errors in output

### 3. Apply Migration 2 - Integrate Existing Tables

**File Location:** `temp/002_integrate_existing.sql`

**What it does:**
- Enhances existing `team_members` table with admin columns
- Enhances existing `posts` table with workflow columns
- Enhances existing `site_media` table with AI generation tracking
- Creates junction tables (post_brain_facts, post_media, team_member_agents)
- Creates views (posts_with_authors, media_with_generation, content_calendar)
- Creates helper functions
- Adds content audit logging

**Instructions:**
1. Open the file `temp/002_integrate_existing.sql` in a text editor
2. Copy ALL the SQL content (lines 1-420)
3. Paste into Supabase SQL Editor (new query or same window)
4. Click "Run" button
5. Wait for completion (should see "Success" message)
6. Verify "Admin Nexus integration complete!" notice appears

### 4. Verify Migration Success

Check that key tables exist:
```sql
-- Run this query in SQL Editor to verify:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'business_brains', 'brain_facts', 'agents',
  'conversations', 'messages', 'workflows'
)
ORDER BY table_name;
```

Expected output: 6 rows showing all tables exist

### 5. Check Seed Data

Verify default business brain was created:
```sql
SELECT * FROM business_brains WHERE slug = 'default';
```

Expected: 1 row with name "Disruptors AI Brain"

Verify default agent was created:
```sql
SELECT * FROM agents WHERE name = 'Content Writer';
```

Expected: 1 row with system prompt for Disruptors & Co

### 6. Continue to Code Integration

After successful migration, you can proceed with:
1. Run data migration script: `node temp/admin-nexus-COMPLETE/scripts/migrate-existing-data.js`
2. Create admin user: `node temp/admin-nexus-COMPLETE/scripts/setup-admin-user.js admin@disruptors.co YourPassword123`
3. Continue with admin code integration

## Common Issues

### Error: "relation already exists"
- **Cause:** Migration was partially applied before
- **Solution:** Safe to ignore if tables already exist, or drop and recreate

### Error: "permission denied"
- **Cause:** Not using service role credentials in SQL Editor
- **Solution:** SQL Editor uses service role by default, ensure you're logged in correctly

### Error: "function already exists"
- **Cause:** Migration was partially applied before
- **Solution:** Add `CREATE OR REPLACE` to function definitions (already included in migrations)

### Error: RLS policy conflicts
- **Cause:** Policies from previous attempts
- **Solution:** Drop existing policies first:
```sql
DROP POLICY IF EXISTS admin_all_access ON business_brains;
-- Repeat for other tables as needed
```

## Support

If you encounter issues:
1. Check the Supabase dashboard logs
2. Review the SQL output for specific error messages
3. Verify your project ref and credentials
4. Try migrations one section at a time (copy smaller chunks)

## Security Note

These migrations:
- ✅ Enable RLS on all new tables
- ✅ Restrict access to admin role only
- ✅ Use parameterized functions
- ✅ Include audit logging
- ✅ Safe to apply on production (non-destructive)
