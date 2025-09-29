-- ============================================================================
-- DISRUPTORS AI MARKETING HUB - AUTHORITATIVE DATABASE SCHEMA
-- ============================================================================
-- Version: 1.0.5
-- Updated: 2025-09-29T18:55:00Z
-- Description: Complete database schema for the Disruptors AI Marketing Hub
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ensure UUID function is available
CREATE OR REPLACE FUNCTION uuid_generate_v4() RETURNS uuid AS
'SELECT gen_random_uuid();'
LANGUAGE SQL VOLATILE;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- User profiles for extended information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    preferences JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts and resources
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    content_type VARCHAR(50) DEFAULT 'blog' CHECK (content_type IN ('blog', 'resource', 'guide', 'case_study')),
    featured_image TEXT,
    gallery_images TEXT[],
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
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

-- Media files and assets
CREATE TABLE IF NOT EXISTS public.media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    mime_type VARCHAR(255),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    metadata JSONB DEFAULT '{}',
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    folder VARCHAR(255) DEFAULT 'uploads',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads and contacts
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(20),
    website TEXT,
    source VARCHAR(100),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'converted', 'lost')),
    score INTEGER DEFAULT 0,
    notes TEXT,
    interested_services TEXT[],
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    converted_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead interactions and follow-ups
CREATE TABLE IF NOT EXISTS public.lead_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    interaction_type VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings and configuration
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB,
    category VARCHAR(100) DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page views and analytics
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page_path TEXT NOT NULL,
    page_title VARCHAR(255),
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(255),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    country VARCHAR(2),
    region VARCHAR(255),
    city VARCHAR(255),
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ENHANCED EXISTING TABLES
-- ============================================================================

-- Add all missing columns to services
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS category VARCHAR(100),
  ADD COLUMN IF NOT EXISTS benefits TEXT[],
  ADD COLUMN IF NOT EXISTS pricing_model VARCHAR(100),
  ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];

-- Add all missing columns to team_members
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS skills TEXT[],
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add foreign key constraint for team_members.user_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'team_members_user_id_fkey'
        AND table_name = 'team_members'
    ) THEN
        ALTER TABLE public.team_members
        ADD CONSTRAINT team_members_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add all missing columns to case_studies
ALTER TABLE public.case_studies
  ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS services_provided TEXT[],
  ADD COLUMN IF NOT EXISTS technologies_used TEXT[],
  ADD COLUMN IF NOT EXISTS timeline_months INTEGER,
  ADD COLUMN IF NOT EXISTS testimonial_quote TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_position VARCHAR(255),
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];

-- Add all missing columns to testimonials
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS source VARCHAR(100);

-- Add all missing columns to contact_submissions
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS services_interested TEXT[],
  ADD COLUMN IF NOT EXISTS budget_range VARCHAR(100),
  ADD COLUMN IF NOT EXISTS timeline VARCHAR(100),
  ADD COLUMN IF NOT EXISTS utm_data JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_processed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS processed_by UUID,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lead_id UUID,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add foreign key constraints for contact_submissions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'contact_submissions_processed_by_fkey'
        AND table_name = 'contact_submissions'
    ) THEN
        ALTER TABLE public.contact_submissions
        ADD CONSTRAINT contact_submissions_processed_by_fkey
        FOREIGN KEY (processed_by) REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'contact_submissions_lead_id_fkey'
        AND table_name = 'contact_submissions'
    ) THEN
        ALTER TABLE public.contact_submissions
        ADD CONSTRAINT contact_submissions_lead_id_fkey
        FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Only create indexes if the columns exist
DO $$
BEGIN
    -- Check and create indexes for users table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email') THEN
        CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
    END IF;

    -- Check and create indexes for team_members table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'display_order') THEN
        CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);
    END IF;

    -- Check and create indexes for services table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'slug') THEN
        CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'category') THEN
        CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
    END IF;

    -- Check and create indexes for case_studies table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'slug') THEN
        CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'is_published') THEN
        CREATE INDEX IF NOT EXISTS idx_case_studies_is_published ON public.case_studies(is_published);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'is_featured') THEN
        CREATE INDEX IF NOT EXISTS idx_case_studies_is_featured ON public.case_studies(is_featured);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'industry') THEN
        CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON public.case_studies(industry);
    END IF;

    -- Other table indexes
    CREATE INDEX IF NOT EXISTS idx_testimonials_is_published ON public.testimonials(is_published);
    CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
    CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON public.testimonials(rating);

    CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_is_published ON public.posts(is_published);
    CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);
    CREATE INDEX IF NOT EXISTS idx_posts_content_type ON public.posts(content_type);

    CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

    CREATE INDEX IF NOT EXISTS idx_media_file_type ON public.media(file_type);
    CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media(folder);
    CREATE INDEX IF NOT EXISTS idx_media_is_public ON public.media(is_public);

    CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON public.page_views(page_path);
    CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);
    CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Create basic public read policies
DROP POLICY IF EXISTS "Public can read published team members" ON public.team_members;
CREATE POLICY "Public can read published team members" ON public.team_members
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read active services" ON public.services;
CREATE POLICY "Public can read active services" ON public.services
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read published case studies" ON public.case_studies;
CREATE POLICY "Public can read published case studies" ON public.case_studies
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can read published testimonials" ON public.testimonials;
CREATE POLICY "Public can read published testimonials" ON public.testimonials
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can read published posts" ON public.posts;
CREATE POLICY "Public can read published posts" ON public.posts
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can read public media" ON public.media;
CREATE POLICY "Public can read public media" ON public.media
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Public can read public settings" ON public.settings;
CREATE POLICY "Public can read public settings" ON public.settings
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views" ON public.page_views
    FOR INSERT WITH CHECK (true);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create basic triggers for tables with updated_at columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
        CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members;
        CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
        CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_case_studies_updated_at ON public.case_studies;
        CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON public.case_studies
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
        CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
    CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_media_updated_at ON public.media;
    CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON public.media
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
    CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_lead_interactions_updated_at ON public.lead_interactions;
    CREATE TRIGGER update_lead_interactions_updated_at BEFORE UPDATE ON public.lead_interactions
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_submissions' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
        CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
    CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES
('uploads', 'uploads', true),
('media', 'media', true),
('team', 'team', true),
('case-studies', 'case-studies', true),
('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public can view uploads" ON storage.objects;
CREATE POLICY "Public can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Public can view team images" ON storage.objects;
CREATE POLICY "Public can view team images" ON storage.objects FOR SELECT USING (bucket_id = 'team');

DROP POLICY IF EXISTS "Public can view case study images" ON storage.objects;
CREATE POLICY "Public can view case study images" ON storage.objects FOR SELECT USING (bucket_id = 'case-studies');

DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
CREATE POLICY "Public can view blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog');

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

INSERT INTO public.settings (key, value, category, description, is_public) VALUES
('site_title', '"Disruptors AI Marketing Hub"', 'general', 'Main site title', true),
('site_description', '"Transform your marketing with AI-powered strategies and innovative solutions"', 'general', 'Site meta description', true),
('contact_email', '"hello@disruptorsmedia.com"', 'contact', 'Main contact email', true),
('contact_phone', '"+1 (555) 123-4567"', 'contact', 'Main contact phone', true),
('social_links', '{"linkedin": "https://linkedin.com/company/disruptors-media", "twitter": "https://twitter.com/disruptorsmedia"}', 'social', 'Social media links', true),
('analytics_enabled', 'true', 'analytics', 'Enable analytics tracking', false),
('maintenance_mode', 'false', 'system', 'Enable maintenance mode', false)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.team_members (name, title, bio, headshot, social_links, is_active, display_order) VALUES
('Will Stevens', 'CEO & AI Strategy Director', 'Leading AI transformation initiatives for marketing teams worldwide. Specializing in implementing cutting-edge AI solutions that drive measurable business growth.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/will-stevens.jpg', '{"linkedin": "https://linkedin.com/in/willstevens"}', true, 1),
('Sarah Chen', 'Head of AI Development', 'Expert in machine learning and AI model optimization. Sarah leads our technical team in developing custom AI solutions for enterprise clients.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/sarah-chen.jpg', '{"linkedin": "https://linkedin.com/in/sarahchen"}', true, 2),
('Marcus Rodriguez', 'Creative AI Director', 'Pioneering the intersection of creativity and artificial intelligence. Marcus oversees all AI-generated content and visual strategy initiatives.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/marcus-rodriguez.jpg', '{"linkedin": "https://linkedin.com/in/marcusrodriguez"}', true, 3),
('Emma Thompson', 'Data Analytics Manager', 'Transforms complex data into actionable insights that drive strategic decision-making. Emma specializes in predictive analytics and performance optimization.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/emma-thompson.jpg', '{"linkedin": "https://linkedin.com/in/emmathompson-analytics"}', true, 4),
('James Wilson', 'Client Success Director', 'Ensures every client achieves exceptional results through personalized strategies and dedicated support. James brings over 8 years of experience in customer success.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/james-wilson.jpg', '{"linkedin": "https://linkedin.com/in/jameswilson-success"}', true, 5)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.settings (key, value, category, description, is_public) VALUES
('schema_version', '"1.0.5"', 'system', 'Database schema version', false),
('schema_updated_at', '"2025-09-29T18:55:00Z"', 'system', 'Schema update timestamp', false)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
