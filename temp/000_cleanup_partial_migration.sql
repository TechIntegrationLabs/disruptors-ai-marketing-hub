-- ========================================
-- Admin Nexus - Cleanup Partial Migration
-- Run this BEFORE applying 002_integrate_existing.sql
-- Safe to run multiple times (uses IF EXISTS)
-- ========================================

-- Drop RLS policies that might already exist
DROP POLICY IF EXISTS admin_all_access_post_brain_facts ON post_brain_facts;
DROP POLICY IF EXISTS admin_all_access_post_media ON post_media;
DROP POLICY IF EXISTS admin_all_access_team_member_agents ON team_member_agents;

-- Drop triggers that might already exist
DROP TRIGGER IF EXISTS audit_posts_changes ON posts;

-- Drop functions that might already exist
DROP FUNCTION IF EXISTS audit_content_changes() CASCADE;
DROP FUNCTION IF EXISTS link_post_brain_facts(uuid, uuid, numeric);
DROP FUNCTION IF EXISTS get_team_member_stats(uuid);
DROP FUNCTION IF EXISTS get_posts_using_brain_fact(uuid);

-- Drop views that might already exist
DROP VIEW IF EXISTS content_calendar;
DROP VIEW IF EXISTS media_with_generation;
DROP VIEW IF EXISTS posts_with_authors;

-- Drop junction tables that might already exist (CASCADE will handle foreign keys)
DROP TABLE IF EXISTS team_member_agents CASCADE;
DROP TABLE IF EXISTS post_media CASCADE;
DROP TABLE IF EXISTS post_brain_facts CASCADE;
DROP TABLE IF EXISTS content_audit_log CASCADE;

-- Remove columns from existing tables (if they exist)
DO $$
BEGIN
  -- Remove columns from team_members
  ALTER TABLE IF EXISTS team_members DROP COLUMN IF EXISTS user_id CASCADE;
  ALTER TABLE IF EXISTS team_members DROP COLUMN IF EXISTS can_write_content CASCADE;
  ALTER TABLE IF EXISTS team_members DROP COLUMN IF EXISTS default_agent_id CASCADE;
  ALTER TABLE IF EXISTS team_members DROP COLUMN IF EXISTS content_permissions CASCADE;
  ALTER TABLE IF EXISTS team_members DROP COLUMN IF EXISTS admin_notes CASCADE;

  -- Remove columns from posts
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS status CASCADE;
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS author_member_id CASCADE;
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS agent_id CASCADE;
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS brain_snapshot CASCADE;
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS seo CASCADE;
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS generation_metadata CASCADE;
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS published_at CASCADE;
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS scheduled_for CASCADE;
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS word_count CASCADE;
  ALTER TABLE IF EXISTS posts DROP COLUMN IF EXISTS reading_time_minutes CASCADE;

  -- Remove columns from site_media
  ALTER TABLE IF EXISTS site_media DROP COLUMN IF EXISTS generated_by_workflow_id CASCADE;
  ALTER TABLE IF EXISTS site_media DROP COLUMN IF EXISTS generated_by_agent_id CASCADE;
  ALTER TABLE IF EXISTS site_media DROP COLUMN IF EXISTS ai_generated CASCADE;
  ALTER TABLE IF EXISTS site_media DROP COLUMN IF EXISTS generation_prompt CASCADE;
  ALTER TABLE IF EXISTS site_media DROP COLUMN IF EXISTS generation_metadata CASCADE;
  ALTER TABLE IF EXISTS site_media DROP COLUMN IF EXISTS usage_rights CASCADE;
  ALTER TABLE IF EXISTS site_media DROP COLUMN IF EXISTS tags CASCADE;
  ALTER TABLE IF EXISTS site_media DROP COLUMN IF EXISTS indexed_for_search CASCADE;
END $$;

-- Cleanup complete
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Cleanup complete! You can now run:';
  RAISE NOTICE '002_integrate_existing.sql';
  RAISE NOTICE '========================================';
END $$;
