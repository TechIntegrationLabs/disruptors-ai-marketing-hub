-- =============================================================================
-- DISRUPTORS AI MARKETING HUB - FIXED DATABASE SCHEMA
-- =============================================================================
-- This file contains the fixed database setup for the Disruptors AI Marketing Hub
-- Run this script in your Supabase SQL editor to create all required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- DROP EXISTING TABLES IF THEY EXIST (to avoid conflicts)
-- =============================================================================
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS generation_analytics CASCADE;
DROP TABLE IF EXISTS generated_media CASCADE;
DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;
DROP TABLE IF EXISTS strategy_session_bookings CASCADE;
DROP TABLE IF EXISTS assessment_responses CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS case_studies CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;

-- =============================================================================
-- 1. CONTENT MANAGEMENT TABLES
-- =============================================================================

-- Team Members table for About page
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    linkedin_url TEXT,
    email TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Studies table for Work/Portfolio pages
CREATE TABLE case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    industry TEXT,
    project_type TEXT,
    description TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    featured_image_url TEXT,
    gallery_images JSONB DEFAULT '[]',
    technologies JSONB DEFAULT '[]',
    timeline TEXT,
    budget_range TEXT,
    testimonial TEXT,
    testimonial_author TEXT,
    testimonial_title TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image_url TEXT,
    author_id UUID REFERENCES team_members(id),
    category TEXT,
    tags JSONB DEFAULT '[]',
    reading_time INTEGER,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table for guides, whitepapers, etc.
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    resource_type TEXT NOT NULL, -- guide, whitepaper, template, checklist
    featured_image_url TEXT,
    download_url TEXT,
    file_size TEXT,
    category TEXT,
    tags JSONB DEFAULT '[]',
    download_count INTEGER DEFAULT 0,
    requires_email BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table for Solutions pages
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    icon_name TEXT,
    featured_image_url TEXT,
    features JSONB DEFAULT '[]',
    pricing_tiers JSONB DEFAULT '[]',
    deliverables JSONB DEFAULT '[]',
    timeline TEXT,
    case_study_ids JSONB DEFAULT '[]',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_title TEXT,
    client_company TEXT,
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    client_image_url TEXT,
    company_logo_url TEXT,
    case_study_id UUID REFERENCES case_studies(id),
    service_id UUID REFERENCES services(id),
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQs table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. AI GENERATION SYSTEM TABLES
-- =============================================================================

-- Generated Media table to store AI-generated content
CREATE TABLE generated_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    original_prompt TEXT,
    refined_prompt TEXT,
    media_type TEXT NOT NULL, -- image, video, audio
    generation_service TEXT NOT NULL, -- openai, gemini, replicate, elevenlabs
    model_used TEXT,
    file_url TEXT,
    thumbnail_url TEXT,
    file_size BIGINT,
    dimensions JSONB, -- {width: 1024, height: 1024}
    duration REAL, -- for video/audio in seconds
    metadata JSONB DEFAULT '{}',
    generation_cost DECIMAL(10,4),
    generation_time REAL, -- in seconds
    quality_score REAL,
    admin_user_id UUID,
    project_context TEXT,
    is_approved BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generation Analytics table
CREATE TABLE generation_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    service_name TEXT NOT NULL,
    model_name TEXT,
    media_type TEXT NOT NULL,
    total_generations INTEGER DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,
    average_generation_time REAL DEFAULT 0,
    successful_generations INTEGER DEFAULT 0,
    failed_generations INTEGER DEFAULT 0,
    total_file_size BIGINT DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, service_name, model_name, media_type)
);

-- Admin Sessions table for secure admin authentication
CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token TEXT UNIQUE NOT NULL,
    admin_email TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    ip_address INET,
    user_agent TEXT,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 3. USER INTERACTION TABLES
-- =============================================================================

-- Contact Form Submissions
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    form_type TEXT DEFAULT 'general', -- general, quote, support
    source_page TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    ip_address INET,
    user_agent TEXT,
    is_read BOOLEAN DEFAULT false,
    is_responded BOOLEAN DEFAULT false,
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Readiness Assessment Responses
CREATE TABLE assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    respondent_name TEXT,
    respondent_email TEXT,
    company_name TEXT,
    company_size TEXT,
    industry TEXT,
    responses JSONB NOT NULL, -- Store all question/answer pairs
    total_score INTEGER,
    readiness_level TEXT, -- beginner, intermediate, advanced
    recommendations JSONB DEFAULT '[]',
    follow_up_requested BOOLEAN DEFAULT false,
    is_completed BOOLEAN DEFAULT true,
    completion_time INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strategy Session Bookings
CREATE TABLE strategy_session_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    preferred_date DATE,
    preferred_time TIME,
    time_zone TEXT,
    session_type TEXT DEFAULT 'strategy', -- strategy, consultation, demo
    goals TEXT,
    current_challenges TEXT,
    budget_range TEXT,
    calendar_event_id TEXT,
    booking_status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    confirmation_sent BOOLEAN DEFAULT false,
    reminder_sent BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscriptions
CREATE TABLE newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscription_source TEXT, -- website, lead_magnet, event
    interests JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    double_opt_in_confirmed BOOLEAN DEFAULT false,
    confirmation_token TEXT,
    unsubscribe_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- 4. INDEXES FOR PERFORMANCE
-- =============================================================================

-- Content Management indexes
CREATE INDEX idx_team_members_active ON team_members(is_active, order_index);
CREATE INDEX idx_case_studies_published ON case_studies(is_published, is_featured, order_index);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_resources_published ON resources(is_published, resource_type, order_index);
CREATE INDEX idx_services_active ON services(is_active, is_featured, order_index);
CREATE INDEX idx_testimonials_published ON testimonials(is_published, is_featured);

-- AI Generation indexes
CREATE INDEX idx_generated_media_service ON generated_media(generation_service, media_type);
CREATE INDEX idx_generated_media_created ON generated_media(created_at DESC);
CREATE INDEX idx_generated_media_approved ON generated_media(is_approved, is_public);
CREATE INDEX idx_generation_analytics_date ON generation_analytics(date DESC);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_active ON admin_sessions(is_active, expires_at);

-- User Interaction indexes
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_read ON contact_submissions(is_read);
CREATE INDEX idx_assessment_responses_created ON assessment_responses(created_at DESC);
CREATE INDEX idx_strategy_bookings_status ON strategy_session_bookings(booking_status, preferred_date);
CREATE INDEX idx_newsletter_active ON newsletter_subscriptions(is_active);

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_session_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
CREATE POLICY "Public can read active team members" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published case studies" ON case_studies FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published resources" ON resources FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published testimonials" ON testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published faqs" ON faqs FOR SELECT USING (is_published = true);

-- Public insert policies for user interactions
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit assessments" ON assessment_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can book strategy sessions" ON strategy_session_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);

-- Admin-only policies for content management (requires authentication)
CREATE POLICY "Authenticated users can manage content" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage case studies" ON case_studies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage resources" ON resources FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- AI Generation policies
CREATE POLICY "Authenticated users can manage generated media" ON generated_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public can read approved media" ON generated_media FOR SELECT USING (is_approved = true AND is_public = true);
CREATE POLICY "Authenticated users can view analytics" ON generation_analytics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage admin sessions" ON admin_sessions FOR ALL USING (auth.role() = 'authenticated');

-- Admin read policies for user interactions
CREATE POLICY "Authenticated users can read contact submissions" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read assessments" ON assessment_responses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read bookings" ON strategy_session_bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read subscriptions" ON newsletter_subscriptions FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================================================
-- 6. USEFUL DATABASE FUNCTIONS
-- =============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the update trigger to tables that need it
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_media_updated_at BEFORE UPDATE ON generated_media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generation_analytics_updated_at BEFORE UPDATE ON generation_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_strategy_bookings_updated_at BEFORE UPDATE ON strategy_session_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate analytics data
CREATE OR REPLACE FUNCTION update_generation_analytics(
    p_service_name TEXT,
    p_model_name TEXT,
    p_media_type TEXT,
    p_cost DECIMAL DEFAULT 0,
    p_generation_time REAL DEFAULT 0,
    p_file_size BIGINT DEFAULT 0,
    p_success BOOLEAN DEFAULT true
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO generation_analytics (
        date, service_name, model_name, media_type,
        total_generations, total_cost, average_generation_time,
        successful_generations, failed_generations,
        total_file_size, unique_users
    )
    VALUES (
        CURRENT_DATE, p_service_name, p_model_name, p_media_type,
        1, p_cost, p_generation_time,
        CASE WHEN p_success THEN 1 ELSE 0 END,
        CASE WHEN p_success THEN 0 ELSE 1 END,
        p_file_size, 1
    )
    ON CONFLICT (date, service_name, model_name, media_type)
    DO UPDATE SET
        total_generations = generation_analytics.total_generations + 1,
        total_cost = generation_analytics.total_cost + p_cost,
        average_generation_time = (generation_analytics.average_generation_time * generation_analytics.total_generations + p_generation_time) / (generation_analytics.total_generations + 1),
        successful_generations = generation_analytics.successful_generations + CASE WHEN p_success THEN 1 ELSE 0 END,
        failed_generations = generation_analytics.failed_generations + CASE WHEN p_success THEN 0 ELSE 1 END,
        total_file_size = generation_analytics.total_file_size + p_file_size,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 7. INITIAL SAMPLE DATA
-- =============================================================================

-- Insert sample team member
INSERT INTO team_members (name, title, bio, order_index) VALUES
('Will Stevens', 'CEO & AI Strategy Director', 'Leading AI transformation initiatives for marketing teams worldwide.', 1);

-- Insert sample service
INSERT INTO services (slug, title, short_description, detailed_description, is_featured, order_index) VALUES
('ai-marketing-automation', 'AI Marketing Automation', 'Transform your marketing with intelligent automation systems.', 'Our AI-powered marketing automation platform helps businesses scale their marketing efforts while maintaining personalization at every touchpoint.', true, 1);

-- Insert sample FAQ
INSERT INTO faqs (question, answer, category, order_index) VALUES
('What is AI marketing automation?', 'AI marketing automation uses artificial intelligence to streamline and optimize marketing processes, from lead generation to customer retention.', 'general', 1);

-- =============================================================================
-- SETUP COMPLETE
-- =============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Success message
SELECT 'Fixed database setup completed successfully! All tables, indexes, RLS policies, and functions have been created.' as setup_status;