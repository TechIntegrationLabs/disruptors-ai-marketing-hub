-- Create site_media table for managing all images and videos across the Disruptors AI website
-- Migration: 20250930000000_create_site_media_table.sql

CREATE TABLE IF NOT EXISTS site_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core Fields
  media_key text UNIQUE NOT NULL, -- e.g., "hero-home-background", "service-icon-ai-automation"
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url text NOT NULL, -- Full URL (Cloudinary, local, or external)

  -- Context & Organization
  page_slug text, -- e.g., "home", "solutions-ai-automation", "work-segpro"
  section_name text, -- e.g., "hero", "features", "gallery", "testimonials"
  purpose text, -- e.g., "hero background", "service icon", "team photo"

  -- Media Details
  alt_text text,
  caption text,
  title text,
  width integer,
  height integer,
  file_size integer, -- in bytes
  mime_type text,

  -- Cloudinary Specific
  cloudinary_public_id text,
  cloudinary_folder text,
  cloudinary_version text,
  cloudinary_format text,

  -- Display & Behavior
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  lazy_load boolean DEFAULT true,

  -- SEO & Accessibility
  seo_optimized boolean DEFAULT false,
  accessibility_checked boolean DEFAULT false,

  -- Metadata
  tags text[],
  metadata jsonb, -- For any additional data

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_site_media_page_slug ON site_media(page_slug);
CREATE INDEX IF NOT EXISTS idx_site_media_section ON site_media(section_name);
CREATE INDEX IF NOT EXISTS idx_site_media_type ON site_media(media_type);
CREATE INDEX IF NOT EXISTS idx_site_media_active ON site_media(is_active);
CREATE INDEX IF NOT EXISTS idx_site_media_media_key ON site_media(media_key);
CREATE INDEX IF NOT EXISTS idx_site_media_tags ON site_media USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_site_media_metadata ON site_media USING GIN(metadata);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_site_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger
CREATE TRIGGER update_site_media_updated_at
  BEFORE UPDATE ON site_media
  FOR EACH ROW
  EXECUTE FUNCTION update_site_media_updated_at();

-- Enable Row Level Security
ALTER TABLE site_media ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read access for active media
CREATE POLICY "Allow public read access to active media"
  ON site_media
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- RLS Policy: Authenticated users can read all media
CREATE POLICY "Allow authenticated read access to all media"
  ON site_media
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Service role can insert media
CREATE POLICY "Allow service role to insert media"
  ON site_media
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RLS Policy: Service role can update media
CREATE POLICY "Allow service role to update media"
  ON site_media
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policy: Service role can delete media
CREATE POLICY "Allow service role to delete media"
  ON site_media
  FOR DELETE
  TO service_role
  USING (true);

-- Add helpful comments
COMMENT ON TABLE site_media IS 'Central media management table for all images and videos across the Disruptors AI website';
COMMENT ON COLUMN site_media.media_key IS 'Unique identifier for the media asset (e.g., hero-home-background, service-icon-ai-automation)';
COMMENT ON COLUMN site_media.media_type IS 'Type of media: image or video';
COMMENT ON COLUMN site_media.media_url IS 'Full URL to the media asset (Cloudinary, local, or external)';
COMMENT ON COLUMN site_media.page_slug IS 'Page identifier where this media is used (e.g., home, solutions-ai-automation)';
COMMENT ON COLUMN site_media.section_name IS 'Section identifier within the page (e.g., hero, features, gallery)';
COMMENT ON COLUMN site_media.purpose IS 'Description of the media purpose (e.g., hero background, service icon)';
COMMENT ON COLUMN site_media.cloudinary_public_id IS 'Cloudinary public ID for API operations';
COMMENT ON COLUMN site_media.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN site_media.metadata IS 'Flexible JSONB field for additional data';
