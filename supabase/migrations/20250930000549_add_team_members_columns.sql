-- Add missing columns to team_members table
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS headshot TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Migrate data from old columns to new columns
-- Copy image_url to headshot
UPDATE public.team_members
SET headshot = image_url
WHERE image_url IS NOT NULL AND (headshot IS NULL OR headshot = '');

-- Migrate linkedin_url to social_links JSONB
UPDATE public.team_members
SET social_links = jsonb_build_object('linkedin', linkedin_url)
WHERE linkedin_url IS NOT NULL
  AND (social_links IS NULL OR social_links = '{}'::jsonb OR social_links = 'null'::jsonb);

-- Migrate order_index to display_order
UPDATE public.team_members
SET display_order = order_index
WHERE order_index IS NOT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active);

-- Update RLS policy
DROP POLICY IF EXISTS "Public can read active team members" ON public.team_members;
CREATE POLICY "Public can read active team members" ON public.team_members
  FOR SELECT USING (is_active = true);