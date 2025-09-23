-- Disruptors AI Marketing Hub - Supabase Database Setup
-- This script creates all necessary tables, functions, and policies for the AI media generation system

-- ============================================================================
-- TABLES
-- ============================================================================

-- Generated Media Assets Table
CREATE TABLE IF NOT EXISTS generated_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Media Information
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'audio')),
    prompt TEXT NOT NULL,
    url TEXT NOT NULL,
    cloudinary_public_id TEXT,
    filename VARCHAR(255),
    file_size BIGINT,
    dimensions JSONB, -- {width: 1200, height: 600}
    duration FLOAT, -- for video/audio in seconds

    -- Generation Details
    provider VARCHAR(50) NOT NULL, -- 'openai', 'google', 'replicate', etc.
    model VARCHAR(100) NOT NULL,
    generation_params JSONB, -- all parameters used
    cost DECIMAL(10,6) DEFAULT 0, -- cost in USD

    -- Metadata
    admin_user VARCHAR(100),
    session_id UUID,
    project_context VARCHAR(255), -- 'hero-image', 'service-icon', etc.
    tags TEXT[], -- searchable tags
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),

    -- Usage Tracking
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,

    -- Quality Metrics
    quality_score FLOAT DEFAULT 0.8, -- 0-1 quality rating
    brand_consistency_score FLOAT DEFAULT 0.8, -- 0-1 brand alignment
    performance_score FLOAT DEFAULT 0.8 -- 0-1 loading performance
);

-- Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Session Details
    username VARCHAR(100) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,

    -- Activity Tracking
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actions_performed INTEGER DEFAULT 0,
    media_generated INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked'))
);

-- Media Collections Table
CREATE TABLE IF NOT EXISTS media_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Collection Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    collection_type VARCHAR(50), -- 'service-suite', 'brand-package', 'campaign', etc.

    -- Metadata
    admin_user VARCHAR(100),
    total_items INTEGER DEFAULT 0,
    total_cost DECIMAL(10,2) DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted'))
);

-- Junction table for collection items
CREATE TABLE IF NOT EXISTS collection_items (
    collection_id UUID REFERENCES media_collections(id) ON DELETE CASCADE,
    media_id UUID REFERENCES generated_media(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sort_order INTEGER DEFAULT 0,

    PRIMARY KEY (collection_id, media_id)
);

-- Generation Analytics Table
CREATE TABLE IF NOT EXISTS generation_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Time Periods
    date DATE NOT NULL,
    hour INTEGER, -- 0-23 for hourly analytics

    -- Metrics
    total_generations INTEGER DEFAULT 0,
    total_cost DECIMAL(10,6) DEFAULT 0,
    avg_generation_time FLOAT, -- seconds
    success_rate FLOAT DEFAULT 1.0, -- 0-1

    -- By Type
    images_generated INTEGER DEFAULT 0,
    videos_generated INTEGER DEFAULT 0,
    audio_generated INTEGER DEFAULT 0,

    -- By Provider
    openai_usage INTEGER DEFAULT 0,
    google_usage INTEGER DEFAULT 0,
    replicate_usage INTEGER DEFAULT 0,
    elevenlabs_usage INTEGER DEFAULT 0,

    -- Quality Metrics
    avg_quality_score FLOAT DEFAULT 0.8,
    avg_brand_consistency FLOAT DEFAULT 0.8,

    UNIQUE(date, hour)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Generated Media Indexes
CREATE INDEX IF NOT EXISTS idx_generated_media_type ON generated_media(type);
CREATE INDEX IF NOT EXISTS idx_generated_media_provider ON generated_media(provider);
CREATE INDEX IF NOT EXISTS idx_generated_media_created_at ON generated_media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_media_admin_user ON generated_media(admin_user);
CREATE INDEX IF NOT EXISTS idx_generated_media_status ON generated_media(status);
CREATE INDEX IF NOT EXISTS idx_generated_media_tags ON generated_media USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_generated_media_project_context ON generated_media(project_context);

-- Admin Sessions Indexes
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_status ON admin_sessions(status);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_username ON admin_sessions(username);

-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_date ON generation_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_date_hour ON generation_analytics(date, hour);

-- Collections Indexes
CREATE INDEX IF NOT EXISTS idx_collections_admin_user ON media_collections(admin_user);
CREATE INDEX IF NOT EXISTS idx_collections_type ON media_collections(collection_type);
CREATE INDEX IF NOT EXISTS idx_collections_status ON media_collections(status);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_generated_media_updated_at
    BEFORE UPDATE ON generated_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_sessions_updated_at
    BEFORE UPDATE ON admin_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_collections_updated_at
    BEFORE UPDATE ON media_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Store generated media function
CREATE OR REPLACE FUNCTION store_generated_media(
    p_type VARCHAR,
    p_prompt TEXT,
    p_url TEXT,
    p_provider VARCHAR,
    p_model VARCHAR,
    p_generation_params JSONB,
    p_cost DECIMAL,
    p_admin_user VARCHAR,
    p_session_id UUID,
    p_cloudinary_public_id TEXT DEFAULT NULL,
    p_dimensions JSONB DEFAULT NULL,
    p_duration FLOAT DEFAULT NULL,
    p_project_context VARCHAR DEFAULT 'manual_generation'
) RETURNS UUID AS $$
DECLARE
    media_id UUID;
    current_date DATE := CURRENT_DATE;
    current_hour INTEGER := EXTRACT(hour FROM NOW());
BEGIN
    -- Insert media record
    INSERT INTO generated_media (
        type, prompt, url, provider, model, generation_params,
        cost, admin_user, session_id, cloudinary_public_id,
        dimensions, duration, project_context
    ) VALUES (
        p_type, p_prompt, p_url, p_provider, p_model, p_generation_params,
        p_cost, p_admin_user, p_session_id, p_cloudinary_public_id,
        p_dimensions, p_duration, p_project_context
    ) RETURNING id INTO media_id;

    -- Update analytics
    INSERT INTO generation_analytics (
        date, hour, total_generations, total_cost,
        images_generated, videos_generated, audio_generated
    ) VALUES (
        current_date, current_hour, 1, p_cost,
        CASE WHEN p_type = 'image' THEN 1 ELSE 0 END,
        CASE WHEN p_type = 'video' THEN 1 ELSE 0 END,
        CASE WHEN p_type = 'audio' THEN 1 ELSE 0 END
    )
    ON CONFLICT (date, hour)
    DO UPDATE SET
        total_generations = generation_analytics.total_generations + 1,
        total_cost = generation_analytics.total_cost + p_cost,
        images_generated = generation_analytics.images_generated +
            CASE WHEN p_type = 'image' THEN 1 ELSE 0 END,
        videos_generated = generation_analytics.videos_generated +
            CASE WHEN p_type = 'video' THEN 1 ELSE 0 END,
        audio_generated = generation_analytics.audio_generated +
            CASE WHEN p_type = 'audio' THEN 1 ELSE 0 END;

    -- Update session activity
    UPDATE admin_sessions
    SET
        last_activity = NOW(),
        media_generated = media_generated + 1,
        actions_performed = actions_performed + 1
    WHERE id = p_session_id;

    RETURN media_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin session function
CREATE OR REPLACE FUNCTION create_admin_session(
    p_username VARCHAR,
    p_ip_address INET,
    p_user_agent TEXT
) RETURNS TABLE(session_id UUID, session_token VARCHAR, expires_at TIMESTAMP WITH TIME ZONE) AS $$
DECLARE
    new_session_id UUID;
    new_token VARCHAR;
    expiry_time TIMESTAMP WITH TIME ZONE;
BEGIN
    new_session_id := gen_random_uuid();
    new_token := encode(gen_random_bytes(32), 'base64');
    expiry_time := NOW() + INTERVAL '24 hours';

    INSERT INTO admin_sessions (id, username, session_token, ip_address, user_agent, expires_at)
    VALUES (new_session_id, p_username, new_token, p_ip_address, p_user_agent, expiry_time);

    RETURN QUERY SELECT new_session_id, new_token, expiry_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update generation analytics function
CREATE OR REPLACE FUNCTION update_generation_analytics(
    p_date DATE,
    p_hour INTEGER,
    p_type VARCHAR,
    p_cost DECIMAL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO generation_analytics (
        date, hour, total_generations, total_cost,
        images_generated, videos_generated, audio_generated
    ) VALUES (
        p_date, p_hour, 1, p_cost,
        CASE WHEN p_type = 'image' THEN 1 ELSE 0 END,
        CASE WHEN p_type = 'video' THEN 1 ELSE 0 END,
        CASE WHEN p_type = 'audio' THEN 1 ELSE 0 END
    )
    ON CONFLICT (date, hour)
    DO UPDATE SET
        total_generations = generation_analytics.total_generations + 1,
        total_cost = generation_analytics.total_cost + p_cost,
        images_generated = generation_analytics.images_generated +
            CASE WHEN p_type = 'image' THEN 1 ELSE 0 END,
        videos_generated = generation_analytics.videos_generated +
            CASE WHEN p_type = 'video' THEN 1 ELSE 0 END,
        audio_generated = generation_analytics.audio_generated +
            CASE WHEN p_type = 'audio' THEN 1 ELSE 0 END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    cleanup_count INTEGER;
BEGIN
    UPDATE admin_sessions
    SET status = 'expired'
    WHERE expires_at < NOW()
    AND status = 'active';

    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    RETURN cleanup_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get media statistics
CREATE OR REPLACE FUNCTION get_media_statistics(
    p_admin_user VARCHAR DEFAULT NULL,
    p_days INTEGER DEFAULT 7
) RETURNS TABLE(
    total_media INTEGER,
    total_cost DECIMAL,
    avg_quality FLOAT,
    images_count INTEGER,
    videos_count INTEGER,
    audio_count INTEGER,
    top_provider VARCHAR
) AS $$
DECLARE
    start_date TIMESTAMP WITH TIME ZONE;
BEGIN
    start_date := NOW() - (p_days || ' days')::INTERVAL;

    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER as total_media,
        COALESCE(SUM(cost), 0) as total_cost,
        COALESCE(AVG(quality_score), 0) as avg_quality,
        COUNT(CASE WHEN type = 'image' THEN 1 END)::INTEGER as images_count,
        COUNT(CASE WHEN type = 'video' THEN 1 END)::INTEGER as videos_count,
        COUNT(CASE WHEN type = 'audio' THEN 1 END)::INTEGER as audio_count,
        (
            SELECT provider
            FROM generated_media gm2
            WHERE gm2.created_at >= start_date
            AND (p_admin_user IS NULL OR gm2.admin_user = p_admin_user)
            AND gm2.status = 'active'
            GROUP BY provider
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) as top_provider
    FROM generated_media gm
    WHERE gm.created_at >= start_date
    AND (p_admin_user IS NULL OR gm.admin_user = p_admin_user)
    AND gm.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE generated_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for generated_media
CREATE POLICY "Admin can access all media" ON generated_media
    FOR ALL USING (
        auth.role() = 'service_role'
        OR admin_user IS NOT NULL
    );

CREATE POLICY "Public can view active media" ON generated_media
    FOR SELECT USING (
        status = 'active'
        AND project_context IN ('public', 'website', 'portfolio')
    );

-- Policies for admin_sessions
CREATE POLICY "Admin can manage own sessions" ON admin_sessions
    FOR ALL USING (
        auth.role() = 'service_role'
        OR username = current_setting('app.current_user', true)
    );

-- Policies for media_collections
CREATE POLICY "Admin can access collections" ON media_collections
    FOR ALL USING (
        auth.role() = 'service_role'
        OR admin_user IS NOT NULL
    );

-- Policies for collection_items
CREATE POLICY "Admin can manage collection items" ON collection_items
    FOR ALL USING (
        auth.role() = 'service_role'
        OR EXISTS (
            SELECT 1 FROM media_collections mc
            WHERE mc.id = collection_id
            AND mc.admin_user IS NOT NULL
        )
    );

-- Policies for generation_analytics
CREATE POLICY "Admin can view analytics" ON generation_analytics
    FOR SELECT USING (
        auth.role() = 'service_role'
        OR current_setting('app.current_user', true) IS NOT NULL
    );

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Create initial analytics record for today
INSERT INTO generation_analytics (date, hour)
VALUES (CURRENT_DATE, EXTRACT(hour FROM NOW()))
ON CONFLICT (date, hour) DO NOTHING;

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ============================================================================
-- CLEANUP SCHEDULER (Optional - requires pg_cron extension)
-- ============================================================================

-- Schedule daily cleanup of expired sessions
-- SELECT cron.schedule('cleanup-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');

-- ============================================================================
-- COMPLETION
-- ============================================================================

-- Insert a completion marker
INSERT INTO generation_analytics (date, hour, total_generations)
VALUES (CURRENT_DATE, EXTRACT(hour FROM NOW()), 0)
ON CONFLICT (date, hour) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Disruptors AI Marketing Hub database setup completed successfully!';
    RAISE NOTICE 'Tables created: generated_media, admin_sessions, media_collections, collection_items, generation_analytics';
    RAISE NOTICE 'Functions created: store_generated_media, create_admin_session, cleanup_expired_sessions, get_media_statistics';
    RAISE NOTICE 'RLS policies enabled for security';
    RAISE NOTICE 'Ready for deployment!';
END
$$;