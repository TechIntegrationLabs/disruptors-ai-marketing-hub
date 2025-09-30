-- ============================================================================
-- CREATE POSTS TABLE FOR BLOG MANAGEMENT
-- ============================================================================
-- Migration: 20250930010000_create_posts_table
-- Description: Creates the posts table for blog content management
-- ============================================================================

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    content_type VARCHAR(50) DEFAULT 'blog' CHECK (content_type IN ('blog', 'resource', 'guide', 'case_study')),
    featured_image TEXT,
    gallery_images TEXT[],
    author_id UUID, -- References auth.users(id) but not enforced due to auth schema
    category VARCHAR(100),
    tags TEXT[],
    read_time_minutes INTEGER,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for slug lookups (most common query)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);

-- Create index for published posts
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(is_published, published_at DESC) WHERE is_published = TRUE;

-- Create index for featured posts
CREATE INDEX IF NOT EXISTS idx_posts_featured ON public.posts(is_featured, created_at DESC) WHERE is_featured = TRUE;

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);

-- Create GIN index for tag searches
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Public read access for published posts
CREATE POLICY "Public can read published posts"
    ON public.posts
    FOR SELECT
    USING (is_published = TRUE);

-- Authenticated users can read all posts (for admin)
CREATE POLICY "Authenticated users can read all posts"
    ON public.posts
    FOR SELECT
    TO authenticated
    USING (TRUE);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
    ON public.posts
    FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
    ON public.posts
    FOR UPDATE
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
    ON public.posts
    FOR DELETE
    TO authenticated
    USING (TRUE);

-- Grant permissions
GRANT SELECT ON public.posts TO anon;
GRANT ALL ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

-- Add comment for documentation
COMMENT ON TABLE public.posts IS 'Blog posts, resources, guides, and case studies';
COMMENT ON COLUMN public.posts.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN public.posts.content_type IS 'Type of content: blog, resource, guide, or case_study';
COMMENT ON COLUMN public.posts.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN public.posts.seo_keywords IS 'Array of SEO keywords';