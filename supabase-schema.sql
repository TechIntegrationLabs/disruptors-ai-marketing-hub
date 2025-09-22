-- Supabase Database Schema for Base44 Migration
-- Execute this SQL in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company TEXT,
    position TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    category TEXT,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    image_url TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Studies table
CREATE TABLE IF NOT EXISTS case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    industry TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    featured BOOLEAN DEFAULT false,
    image_url TEXT,
    gallery_images JSONB,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    social_links JSONB,
    skills TEXT[],
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    type TEXT CHECK (type IN ('blog', 'whitepaper', 'case_study', 'guide', 'tool')),
    category TEXT,
    author_id UUID REFERENCES users(id),
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    image_url TEXT,
    file_url TEXT,
    tags TEXT[],
    read_time INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can manage all users" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Public read access for marketing content
CREATE POLICY "Public can view published testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can view active services" ON services FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can view case studies" ON case_studies FOR SELECT USING (true);
CREATE POLICY "Admins can manage case studies" ON case_studies FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can view active team members" ON team_members FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage team members" ON team_members FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can view published resources" ON resources FOR SELECT USING (published = true);
CREATE POLICY "Authors can manage their own resources" ON resources FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all resources" ON resources FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Insert some sample data
INSERT INTO testimonials (name, company, position, content, rating, featured) VALUES
('John Smith', 'TechCorp', 'CEO', 'Disruptors Media transformed our marketing strategy completely.', 5, true),
('Sarah Johnson', 'GrowthCo', 'Marketing Director', 'Outstanding results and professional service.', 5, false),
('Mike Davis', 'StartupX', 'Founder', 'They helped us scale from 0 to 100k users in 6 months.', 5, true)
ON CONFLICT DO NOTHING;

INSERT INTO services (title, description, category, featured, active) VALUES
('AI Automation', 'Streamline your business processes with intelligent automation solutions.', 'automation', true, true),
('Lead Generation', 'Generate high-quality leads that convert into paying customers.', 'marketing', true, true),
('Custom App Development', 'Build custom applications tailored to your business needs.', 'development', false, true),
('SEO & Local SEO', 'Improve your search rankings and local visibility.', 'marketing', true, true)
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, position, bio, active, order_index) VALUES
('Will', 'Founder & CEO', 'Visionary leader with 10+ years in digital marketing and automation.', true, 1),
('Sarah Thompson', 'Lead Developer', 'Full-stack developer specializing in modern web technologies.', true, 2),
('Mike Rodriguez', 'Marketing Strategist', 'Data-driven marketer with expertise in growth hacking.', true, 3)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(featured);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(published);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_author ON resources(author_id);

COMMENT ON TABLE users IS 'User accounts and authentication data';
COMMENT ON TABLE testimonials IS 'Customer testimonials and reviews';
COMMENT ON TABLE services IS 'Services offered by the company';
COMMENT ON TABLE case_studies IS 'Client case studies and success stories';
COMMENT ON TABLE team_members IS 'Team member profiles and information';
COMMENT ON TABLE resources IS 'Blog posts, whitepapers, and other content resources';