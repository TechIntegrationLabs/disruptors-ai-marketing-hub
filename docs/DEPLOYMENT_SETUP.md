# Netlify + Supabase Deployment Setup Guide

This guide covers the complete setup for deploying the Disruptors AI Marketing Hub with full AI generation capabilities to Netlify with Supabase backend.

## 🚀 Netlify Deployment Configuration

### Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18+

### Environment Variables (Netlify Dashboard)

#### Core Application
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI Generation Services
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_REPLICATE_API_TOKEN=your_replicate_api_token_here
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Media Storage & CDN
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here

# Optional: Google Cloud for Vertex AI
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_CREDENTIALS=your_google_cloud_credentials_json
```

#### Admin Security
```bash
# Admin Interface Security
VITE_ADMIN_SECRET_HASH=DMadmin
VITE_ADMIN_SESSION_DURATION=86400000
VITE_ADMIN_ENCRYPTION_KEY=your_32_character_encryption_key
```

## 🗄️ Supabase Database Schema

### Required Tables

#### 1. Generated Media Assets
```sql
CREATE TABLE generated_media (
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
    cost DECIMAL(10,6), -- cost in USD

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
    quality_score FLOAT, -- 0-1 quality rating
    brand_consistency_score FLOAT, -- 0-1 brand alignment
    performance_score FLOAT -- 0-1 loading performance
);

-- Indexes for efficient queries
CREATE INDEX idx_generated_media_type ON generated_media(type);
CREATE INDEX idx_generated_media_provider ON generated_media(provider);
CREATE INDEX idx_generated_media_created_at ON generated_media(created_at DESC);
CREATE INDEX idx_generated_media_admin_user ON generated_media(admin_user);
CREATE INDEX idx_generated_media_status ON generated_media(status);
CREATE INDEX idx_generated_media_tags ON generated_media USING GIN(tags);
```

#### 2. Admin Sessions
```sql
CREATE TABLE admin_sessions (
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

-- Indexes
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_status ON admin_sessions(status);
```

#### 3. Media Collections
```sql
CREATE TABLE media_collections (
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
CREATE TABLE collection_items (
    collection_id UUID REFERENCES media_collections(id) ON DELETE CASCADE,
    media_id UUID REFERENCES generated_media(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sort_order INTEGER DEFAULT 0,

    PRIMARY KEY (collection_id, media_id)
);
```

#### 4. Generation Analytics
```sql
CREATE TABLE generation_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Time Periods
    date DATE NOT NULL,
    hour INTEGER, -- 0-23 for hourly analytics

    -- Metrics
    total_generations INTEGER DEFAULT 0,
    total_cost DECIMAL(10,6) DEFAULT 0,
    avg_generation_time FLOAT, -- seconds
    success_rate FLOAT, -- 0-1

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
    avg_quality_score FLOAT,
    avg_brand_consistency FLOAT,

    UNIQUE(date, hour)
);

-- Indexes
CREATE INDEX idx_analytics_date ON generation_analytics(date DESC);
CREATE INDEX idx_analytics_date_hour ON generation_analytics(date, hour);
```

## 🔧 Supabase Functions

### Media Storage Function
```sql
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
    p_duration FLOAT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    media_id UUID;
BEGIN
    INSERT INTO generated_media (
        type, prompt, url, provider, model, generation_params,
        cost, admin_user, session_id, cloudinary_public_id,
        dimensions, duration
    ) VALUES (
        p_type, p_prompt, p_url, p_provider, p_model, p_generation_params,
        p_cost, p_admin_user, p_session_id, p_cloudinary_public_id,
        p_dimensions, p_duration
    ) RETURNING id INTO media_id;

    -- Update analytics
    INSERT INTO generation_analytics (date, hour, total_generations, total_cost)
    VALUES (CURRENT_DATE, EXTRACT(hour FROM NOW()), 1, p_cost)
    ON CONFLICT (date, hour)
    DO UPDATE SET
        total_generations = generation_analytics.total_generations + 1,
        total_cost = generation_analytics.total_cost + p_cost;

    RETURN media_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Admin Session Management
```sql
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
```

## 🔒 Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE generated_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_analytics ENABLE ROW LEVEL SECURITY;

-- Admin access policies
CREATE POLICY "Admin can access all media" ON generated_media
    FOR ALL USING (auth.role() = 'service_role' OR admin_user IS NOT NULL);

CREATE POLICY "Admin can manage sessions" ON admin_sessions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin can access collections" ON media_collections
    FOR ALL USING (auth.role() = 'service_role' OR admin_user IS NOT NULL);

CREATE POLICY "Admin can view analytics" ON generation_analytics
    FOR SELECT USING (auth.role() = 'service_role');
```

## 📁 File Upload & Storage Workflow

### Cloudinary Integration
```javascript
// Updated AI Orchestrator with Supabase storage
const storeGeneratedMedia = async (mediaData, generationResult) => {
    try {
        // Upload to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(generationResult.url, {
            folder: 'disruptors-ai/generated',
            public_id: `${mediaData.type}_${Date.now()}`,
            resource_type: mediaData.type === 'video' ? 'video' : 'image'
        });

        // Store in Supabase
        const { data, error } = await supabase
            .from('generated_media')
            .insert({
                type: mediaData.type,
                prompt: mediaData.prompt,
                url: cloudinaryResult.secure_url,
                cloudinary_public_id: cloudinaryResult.public_id,
                provider: generationResult.provider,
                model: generationResult.model,
                generation_params: mediaData.options,
                cost: generationResult.cost,
                admin_user: getCurrentUser(),
                session_id: getCurrentSessionId(),
                dimensions: cloudinaryResult.width ? {
                    width: cloudinaryResult.width,
                    height: cloudinaryResult.height
                } : null,
                duration: cloudinaryResult.duration || null
            })
            .select()
            .single();

        if (error) throw error;
        return data;

    } catch (error) {
        console.error('Failed to store media:', error);
        throw error;
    }
};
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Set up Supabase project and get credentials
- [ ] Create all required tables and functions
- [ ] Configure RLS policies
- [ ] Set up Cloudinary account and get API keys
- [ ] Get API keys from all AI providers
- [ ] Test all integrations locally

### Netlify Setup
- [ ] Connect GitHub repository to Netlify
- [ ] Configure build settings (Node 18+, `npm run build`, `dist`)
- [ ] Add all environment variables in Netlify dashboard
- [ ] Enable automatic deployments on main branch push
- [ ] Configure custom domain (if applicable)

### Post-Deployment
- [ ] Test admin access (5 clicks + DMadmin password)
- [ ] Verify AI generation works across all providers
- [ ] Confirm media storage in Supabase
- [ ] Test Cloudinary integration
- [ ] Verify analytics collection
- [ ] Monitor error logs and performance

### Security Verification
- [ ] Confirm RLS policies are working
- [ ] Test admin session expiration
- [ ] Verify environment variables are secure
- [ ] Check API rate limits and quotas
- [ ] Confirm no secrets in client-side code

## 📊 Monitoring & Analytics

### Supabase Dashboard Queries
```sql
-- Daily generation summary
SELECT
    date,
    total_generations,
    total_cost,
    avg_quality_score
FROM generation_analytics
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;

-- Top performing models
SELECT
    provider,
    model,
    COUNT(*) as usage_count,
    AVG(cost) as avg_cost,
    AVG(quality_score) as avg_quality
FROM generated_media
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY provider, model
ORDER BY usage_count DESC;

-- Media usage trends
SELECT
    type,
    DATE_TRUNC('day', created_at) as day,
    COUNT(*) as generated_count,
    SUM(cost) as daily_cost
FROM generated_media
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY type, day
ORDER BY day DESC, type;
```

This setup provides a complete, production-ready deployment with secure API key management, comprehensive media storage, and powerful analytics. All generated media will be stored in Supabase with full metadata tracking and Cloudinary CDN delivery.