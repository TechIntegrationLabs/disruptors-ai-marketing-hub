-- Database Schema Setup for Disruptors AI Marketing Hub
-- This file creates the necessary tables for the application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    featured_image_url TEXT,
    tags TEXT[],
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Projects table
CREATE TABLE IF NOT EXISTS project (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'on_hold')),
    client_name TEXT,
    client_logo_url TEXT,
    project_url TEXT,
    github_url TEXT,
    image_url TEXT,
    gallery_images TEXT[],
    technologies TEXT[],
    category TEXT,
    start_date DATE,
    end_date DATE,
    budget_range TEXT,
    team_members TEXT[],
    testimonial TEXT,
    testimonial_author TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS service (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    price_starting_at DECIMAL(10,2),
    price_display TEXT, -- For custom pricing like "Starting at $X" or "Contact for quote"
    features TEXT[] NOT NULL DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    process_steps TEXT[] DEFAULT '{}',
    duration_estimate TEXT,
    image_url TEXT,
    icon_name TEXT, -- For UI icons
    popular BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work cases (portfolio/case studies)
CREATE TABLE IF NOT EXISTS work_case (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_name TEXT NOT NULL,
    project_title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    image_url TEXT,
    gallery_images TEXT[],
    client_logo_url TEXT,
    client_website_url TEXT,
    project_url TEXT,
    industry TEXT,
    services_provided TEXT[],
    technologies_used TEXT[],
    project_duration TEXT,
    team_size INTEGER,
    budget_range TEXT,
    testimonial TEXT,
    testimonial_author TEXT,
    testimonial_position TEXT,
    metrics JSONB, -- For storing key performance indicators
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at DATE
);

-- Solutions (service categories or solution pages)
CREATE TABLE IF NOT EXISTS solution (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL, -- Display title
    description TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    overview TEXT,
    features TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    use_cases TEXT[] DEFAULT '{}',
    process_overview TEXT,
    pricing_info TEXT,
    image_url TEXT,
    hero_image_url TEXT,
    icon_name TEXT,
    related_services UUID[], -- Array of service IDs
    related_cases UUID[], -- Array of work_case IDs
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_form (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    service_interest TEXT,
    budget_range TEXT,
    project_timeline TEXT,
    how_heard_about_us TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived')),
    notes TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_signup (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscribed BOOLEAN DEFAULT true,
    source TEXT DEFAULT 'website', -- website, popup, footer, etc.
    interests TEXT[], -- Areas of interest
    double_opt_in_confirmed BOOLEAN DEFAULT false,
    confirmation_token TEXT,
    unsubscribe_token TEXT UNIQUE DEFAULT uuid_generate_v4(),
    ip_address INET,
    user_agent TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to all tables
CREATE TRIGGER update_blog_updated_at BEFORE UPDATE ON blog FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_updated_at BEFORE UPDATE ON project FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_updated_at BEFORE UPDATE ON service FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_case_updated_at BEFORE UPDATE ON work_case FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solution_updated_at BEFORE UPDATE ON solution FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_form_updated_at BEFORE UPDATE ON contact_form FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_signup_updated_at BEFORE UPDATE ON newsletter_signup FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog(status);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog(slug);

CREATE INDEX IF NOT EXISTS idx_project_status ON project(status);
CREATE INDEX IF NOT EXISTS idx_project_featured ON project(featured);
CREATE INDEX IF NOT EXISTS idx_project_slug ON project(slug);

CREATE INDEX IF NOT EXISTS idx_service_category ON service(category);
CREATE INDEX IF NOT EXISTS idx_service_active ON service(active);
CREATE INDEX IF NOT EXISTS idx_service_featured ON service(featured);
CREATE INDEX IF NOT EXISTS idx_service_slug ON service(slug);

CREATE INDEX IF NOT EXISTS idx_work_case_published ON work_case(published);
CREATE INDEX IF NOT EXISTS idx_work_case_featured ON work_case(featured);
CREATE INDEX IF NOT EXISTS idx_work_case_slug ON work_case(slug);

CREATE INDEX IF NOT EXISTS idx_solution_active ON solution(active);
CREATE INDEX IF NOT EXISTS idx_solution_featured ON solution(featured);
CREATE INDEX IF NOT EXISTS idx_solution_slug ON solution(slug);

CREATE INDEX IF NOT EXISTS idx_contact_form_status ON contact_form(status);
CREATE INDEX IF NOT EXISTS idx_contact_form_created_at ON contact_form(created_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON newsletter_signup(subscribed);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_signup(email);

-- RLS (Row Level Security) policies
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE project ENABLE ROW LEVEL SECURITY;
ALTER TABLE service ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_case ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_form ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_signup ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published blogs" ON blog FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read active projects" ON project FOR SELECT USING (true);
CREATE POLICY "Public can read active services" ON service FOR SELECT USING (active = true);
CREATE POLICY "Public can read published work cases" ON work_case FOR SELECT USING (published = true);
CREATE POLICY "Public can read active solutions" ON solution FOR SELECT USING (active = true);

-- Public insert access for contact forms and newsletter
CREATE POLICY "Anyone can submit contact form" ON contact_form FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_signup FOR INSERT WITH CHECK (true);

-- Admin full access (service role bypasses RLS anyway, but good to be explicit)
CREATE POLICY "Service role has full access to blog" ON blog FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to project" ON project FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to service" ON service FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to work_case" ON work_case FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to solution" ON solution FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to contact_form" ON contact_form FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to newsletter_signup" ON newsletter_signup FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON blog, project, service, work_case, solution TO anon, authenticated;
GRANT INSERT ON contact_form, newsletter_signup TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Insert some sample data
INSERT INTO service (name, description, slug, category, price_display, features, active, featured, order_position) VALUES
('AI Marketing Strategy', 'Comprehensive AI-powered marketing strategy development for modern businesses', 'ai-marketing-strategy', 'Strategy', 'Starting at $2,500', ARRAY['AI-powered market analysis', 'Competitive intelligence', 'Customer persona development', 'Content strategy roadmap'], true, true, 1),
('SEO & Content Optimization', 'Drive organic traffic with AI-enhanced SEO and content strategies', 'seo-content-optimization', 'Digital Marketing', 'Starting at $1,500', ARRAY['Technical SEO audit', 'Keyword research & optimization', 'Content strategy', 'Performance tracking'], true, true, 2),
('Paid Advertising Management', 'Maximize ROI with data-driven advertising campaigns across all platforms', 'paid-advertising', 'Digital Marketing', 'Starting at $1,000/month', ARRAY['Google Ads management', 'Social media advertising', 'Campaign optimization', 'Detailed reporting'], true, false, 3);

INSERT INTO blog (title, content, slug, excerpt, status, published_at) VALUES
('The Future of AI in Marketing', 'Artificial Intelligence is revolutionizing the marketing landscape...', 'future-of-ai-marketing', 'Discover how AI is transforming marketing strategies and customer engagement', 'published', NOW() - INTERVAL '7 days'),
('5 SEO Trends to Watch in 2025', 'Search engine optimization continues to evolve rapidly...', 'seo-trends-2025', 'Stay ahead of the curve with these emerging SEO trends and strategies', 'published', NOW() - INTERVAL '14 days');

-- Success message
SELECT 'Database schema created successfully!' AS status;