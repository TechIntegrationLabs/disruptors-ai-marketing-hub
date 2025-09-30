-- Add keyword research fields to posts table
-- Migration: 20250131_add_keyword_fields_to_posts
-- Purpose: Support keyword-driven blog generation with DataForSEO integration

-- Add primary keyword field
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS primary_keyword text;

-- Add secondary keywords array field
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS secondary_keywords text[];

-- Add keyword research metadata (JSON for storing DataForSEO data)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS keyword_data jsonb DEFAULT '{}'::jsonb;

-- Add search volume for primary keyword
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS search_volume integer;

-- Add keyword difficulty score
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS keyword_difficulty integer;

-- Add meta description field if not exists
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS meta_description text;

-- Add featured image field if not exists
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS featured_image text;

-- Create index on primary keyword for faster searches
CREATE INDEX IF NOT EXISTS idx_posts_primary_keyword ON posts(primary_keyword);

-- Create GIN index on secondary keywords array for array searches
CREATE INDEX IF NOT EXISTS idx_posts_secondary_keywords ON posts USING GIN(secondary_keywords);

-- Create index on keyword data JSONB for JSON queries
CREATE INDEX IF NOT EXISTS idx_posts_keyword_data ON posts USING GIN(keyword_data);

-- Add comments for documentation
COMMENT ON COLUMN posts.primary_keyword IS 'Primary SEO keyword for the article';
COMMENT ON COLUMN posts.secondary_keywords IS 'Array of secondary SEO keywords';
COMMENT ON COLUMN posts.keyword_data IS 'Complete keyword research data from DataForSEO API';
COMMENT ON COLUMN posts.search_volume IS 'Monthly search volume for primary keyword';
COMMENT ON COLUMN posts.keyword_difficulty IS 'SEO difficulty score (0-100) for primary keyword';
COMMENT ON COLUMN posts.meta_description IS 'SEO meta description for search results';
COMMENT ON COLUMN posts.featured_image IS 'URL to featured image for the post';

-- Update RLS policies to allow keyword operations (if RLS is enabled)
-- These policies ensure authenticated users can work with keyword data

-- Note: Run this migration with:
-- npx supabase db push
-- or
-- psql $DATABASE_URL -f supabase/migrations/20250131_add_keyword_fields_to_posts.sql
