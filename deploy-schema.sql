-- Deploy the complete database schema for Disruptors AI Marketing Hub
-- This script applies the complete schema including tables, indexes, RLS policies, triggers, and storage buckets

\echo 'Starting database schema deployment...'

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\echo 'Extensions enabled successfully'

-- ============================================================================
-- AUTHENTICATION & USER MANAGEMENT
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
    bio TEXT,
    phone VARCHAR(20),
    company VARCHAR(255),
    position VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

\echo 'User management tables created'

-- ============================================================================
-- TEAM MANAGEMENT
-- ============================================================================

-- Team members (for About page and team management)
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bio TEXT,
    headshot TEXT, -- URL to profile image
    email VARCHAR(255),
    phone VARCHAR(20),
    social_links JSONB DEFAULT '{}', -- LinkedIn, Twitter, etc.
    skills TEXT[], -- Array of skills
    years_experience INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Optional link to user account
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

\echo 'Team management tables created'

-- ============================================================================
-- CONTENT MANAGEMENT
-- ============================================================================

-- Services (for service pages and listings)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    features TEXT[],
    benefits TEXT[],
    pricing_model VARCHAR(100), -- 'fixed', 'hourly', 'monthly', 'custom'
    base_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    category VARCHAR(100),
    tags TEXT[],
    featured_image TEXT,
    gallery_images TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case studies (for work portfolio)
CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    project_type VARCHAR(100),
    summary TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    metrics JSONB DEFAULT '{}', -- Key metrics and KPIs
    services_provided TEXT[],
    technologies_used TEXT[],
    timeline_months INTEGER,
    featured_image TEXT,
    gallery_images TEXT[],
    testimonial_quote TEXT,
    testimonial_author VARCHAR(255),
    testimonial_position VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials (for social proof)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quote TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_position VARCHAR(255),
    author_company VARCHAR(255),
    author_avatar TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    case_study_id UUID REFERENCES public.case_studies(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    source VARCHAR(100), -- 'website', 'google', 'linkedin', etc.
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

\echo 'Content management tables created'

-- ============================================================================
-- MEDIA & ASSET MANAGEMENT
-- ============================================================================

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

\echo 'Media management tables created'

-- ============================================================================
-- LEAD MANAGEMENT & CRM
-- ============================================================================

-- Leads and contacts
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(20),
    website TEXT,
    source VARCHAR(100), -- 'website', 'social', 'referral', etc.
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
    interaction_type VARCHAR(100) NOT NULL, -- 'email', 'call', 'meeting', 'note'
    subject VARCHAR(255),
    content TEXT,
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

\echo 'CRM tables created'

-- ============================================================================
-- FORM SUBMISSIONS & CONTACT
-- ============================================================================

-- Contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    form_type VARCHAR(100) NOT NULL, -- 'contact', 'quote', 'audit', etc.
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT,
    services_interested TEXT[],
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    source_page TEXT,
    utm_data JSONB DEFAULT '{}',
    is_processed BOOLEAN DEFAULT FALSE,
    processed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    processed_at TIMESTAMPTZ,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

\echo 'Contact form tables created'

-- ============================================================================
-- SETTINGS & CONFIGURATION
-- ============================================================================

-- Site settings and configuration
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB,
    category VARCHAR(100) DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Whether setting can be accessed by frontend
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

\echo 'Settings tables created'

-- ============================================================================
-- ANALYTICS & TRACKING
-- ============================================================================

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

\echo 'Analytics tables created'

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

\echo 'Creating performance indexes...'

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- Case studies indexes
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_is_published ON public.case_studies(is_published);
CREATE INDEX IF NOT EXISTS idx_case_studies_is_featured ON public.case_studies(is_featured);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON public.case_studies(industry);

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_is_published ON public.testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON public.testimonials(rating);

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON public.posts(is_published);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON public.posts(content_type);

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_file_type ON public.media(file_type);
CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media(folder);
CREATE INDEX IF NOT EXISTS idx_media_is_public ON public.media(is_public);

-- Page views indexes
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);

\echo 'Performance indexes created'

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

\echo 'Enabling Row Level Security...'

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

\echo 'Creating RLS policies...'

-- Public read access for published content
CREATE POLICY "Public can read published team members" ON public.team_members
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active services" ON public.services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read published case studies" ON public.case_studies
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published testimonials" ON public.testimonials
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published posts" ON public.posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read public media" ON public.media
    FOR SELECT USING (is_public = true);

CREATE POLICY "Public can read public settings" ON public.settings
    FOR SELECT USING (is_public = true);

-- User access policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own profiles" ON public.profiles
    FOR ALL USING (auth.uid() = user_id);

-- Admin access policies
CREATE POLICY "Admins have full access to users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins have full access to all tables" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Similar admin policies for other tables
CREATE POLICY "Admins manage services" ON public.services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins manage case studies" ON public.case_studies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins manage testimonials" ON public.testimonials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins manage posts" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins manage media" ON public.media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins manage leads" ON public.leads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins manage settings" ON public.settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Contact form submissions - anyone can insert, admins can manage
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage contact submissions" ON public.contact_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Page views - anyone can insert, admins can view
CREATE POLICY "Anyone can insert page views" ON public.page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view page views" ON public.page_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

\echo 'RLS policies created'

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

\echo 'Creating triggers...'

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON public.case_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON public.media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_interactions_updated_at BEFORE UPDATE ON public.lead_interactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\echo 'Triggers created'

-- ============================================================================
-- INITIAL DATA SEEDS
-- ============================================================================

\echo 'Inserting initial data...'

-- Insert initial settings
INSERT INTO public.settings (key, value, category, description, is_public) VALUES
('site_title', '"Disruptors AI Marketing Hub"', 'general', 'Main site title', true),
('site_description', '"Transform your marketing with AI-powered strategies and innovative solutions"', 'general', 'Site meta description', true),
('contact_email', '"hello@disruptorsmedia.com"', 'contact', 'Main contact email', true),
('contact_phone', '"+1 (555) 123-4567"', 'contact', 'Main contact phone', true),
('social_links', '{"linkedin": "https://linkedin.com/company/disruptors-media", "twitter": "https://twitter.com/disruptorsmedia"}', 'social', 'Social media links', true),
('analytics_enabled', 'true', 'analytics', 'Enable analytics tracking', false),
('maintenance_mode', 'false', 'system', 'Enable maintenance mode', false)
ON CONFLICT (key) DO NOTHING;

-- Insert sample team members (matching the hardcoded data in about.jsx)
INSERT INTO public.team_members (name, title, bio, headshot, social_links, is_active, display_order) VALUES
('Will Stevens', 'CEO & AI Strategy Director', 'Leading AI transformation initiatives for marketing teams worldwide. Specializing in implementing cutting-edge AI solutions that drive measurable business growth.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/will-stevens.jpg', '{"linkedin": "https://linkedin.com/in/willstevens"}', true, 1),
('Sarah Chen', 'Head of AI Development', 'Expert in machine learning and AI model optimization. Sarah leads our technical team in developing custom AI solutions for enterprise clients.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/sarah-chen.jpg', '{"linkedin": "https://linkedin.com/in/sarahchen"}', true, 2),
('Marcus Rodriguez', 'Creative AI Director', 'Pioneering the intersection of creativity and artificial intelligence. Marcus oversees all AI-generated content and visual strategy initiatives.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/marcus-rodriguez.jpg', '{"linkedin": "https://linkedin.com/in/marcusrodriguez"}', true, 3),
('Emma Thompson', 'Data Analytics Manager', 'Transforms complex data into actionable insights that drive strategic decision-making. Emma specializes in predictive analytics and performance optimization.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/emma-thompson.jpg', '{"linkedin": "https://linkedin.com/in/emmathompson-analytics"}', true, 4),
('James Wilson', 'Client Success Director', 'Ensures every client achieves exceptional results through personalized strategies and dedicated support. James brings over 8 years of experience in customer success.', 'https://res.cloudinary.com/dvcvxhzmt/image/upload/f_auto,q_auto/disruptors-media/team/james-wilson.jpg', '{"linkedin": "https://linkedin.com/in/jameswilson-success"}', true, 5)
ON CONFLICT DO NOTHING;

\echo 'Initial data inserted'

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

\echo 'Creating storage buckets...'

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES
('uploads', 'uploads', true),
('media', 'media', true),
('team', 'team', true),
('case-studies', 'case-studies', true),
('blog', 'blog', true)
ON CONFLICT DO NOTHING;

\echo 'Storage buckets created'

\echo 'Creating storage policies...'

-- Storage policies
CREATE POLICY "Public can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Public can view team images" ON storage.objects FOR SELECT USING (bucket_id = 'team');
CREATE POLICY "Public can view case study images" ON storage.objects FOR SELECT USING (bucket_id = 'case-studies');
CREATE POLICY "Public can view blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog');

-- Admin upload policies
CREATE POLICY "Admins can upload to any bucket" ON storage.objects
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can update any file" ON storage.objects
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can delete any file" ON storage.objects
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

\echo 'Storage policies created'

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================

-- Schema version for tracking
INSERT INTO public.settings (key, value, category, description, is_public) VALUES
('schema_version', '"1.0.0"', 'system', 'Database schema version', false),
('schema_created_at', '"2025-09-29T18:30:00Z"', 'system', 'Schema creation timestamp', false)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

\echo 'Schema deployment completed successfully!'

-- Success message
SELECT 'Database schema deployment completed! All 14 tables, indexes, RLS policies, triggers, and storage buckets have been created.' as deployment_result;