-- Migration: Add missing fields to services table
-- Description: Adds hook, image, display_order, and other fields to support ServiceScroller data
-- Date: 2025-09-30

-- Add missing columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS hook TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER;
ALTER TABLE services ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS benefits TEXT[];
ALTER TABLE services ADD COLUMN IF NOT EXISTS pricing_model TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS base_price NUMERIC;
ALTER TABLE services ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE services ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE services ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];

-- Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON services;
DROP POLICY IF EXISTS "Allow authenticated read access" ON services;
DROP POLICY IF EXISTS "Allow service role full access" ON services;

-- Policy: Allow public read access to active services
CREATE POLICY "Allow public read access"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policy: Allow authenticated users to read all services
CREATE POLICY "Allow authenticated read access"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_services_updated_at ON services;

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert services data (delete existing first)
DELETE FROM services;

INSERT INTO services (title, slug, hook, image, display_order, is_active, created_at, updated_at) VALUES
  ('AI Automation', 'solutions-ai-automation', 'Automate repetitive tasks and workflows', '/generated/anachron-lite/ai-automation-icon-anachron-lite.png', 1, true, NOW(), NOW()),
  ('Social Media Marketing', 'solutions-social-media', 'Build and engage your community', '/generated/anachron-lite/social-media-marketing-icon-anachron-lite.png', 2, true, NOW(), NOW()),
  ('SEO & GEO', 'solutions-seo-geo', 'Get found by your ideal customers', '/generated/anachron-lite/seo-geo-icon-anachron-lite.png', 3, true, NOW(), NOW()),
  ('Lead Generation', 'solutions-lead-generation', 'Fill your pipeline with qualified prospects', '/generated/anachron-lite/lead-generation-icon-anachron-lite.png', 4, true, NOW(), NOW()),
  ('Paid Advertising', 'solutions-paid-advertising', 'Maximize ROI across all channels', '/generated/anachron-lite/paid-advertising-icon-anachron-lite.png', 5, true, NOW(), NOW()),
  ('Podcasting', 'solutions-podcasting', 'Build authority through audio content', '/generated/anachron-lite/podcasting-icon-anachron-lite.png', 6, true, NOW(), NOW()),
  ('Custom Apps', 'solutions-custom-apps', 'Tailored solutions for your needs', '/generated/anachron-lite/custom-apps-icon-anachron-lite.png', 7, true, NOW(), NOW()),
  ('CRM Management', 'solutions-crm-management', 'Organize and nurture your relationships', '/generated/anachron-lite/crm-management-icon-anachron-lite.png', 8, true, NOW(), NOW()),
  ('Fractional CMO', 'solutions-fractional-cmo', 'Strategic marketing leadership', '/generated/anachron-lite/fractional-cmo-icon-anachron-lite.png', 9, true, NOW(), NOW());

-- Verify the insert
SELECT
  id,
  title,
  slug,
  hook,
  display_order,
  is_active
FROM services
ORDER BY display_order;
