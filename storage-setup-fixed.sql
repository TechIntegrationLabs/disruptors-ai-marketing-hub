-- =============================================================================
-- SUPABASE STORAGE BUCKETS SETUP - FIXED VERSION
-- =============================================================================
-- This file creates storage buckets for AI-generated media and other assets
-- Handles existing buckets and policies gracefully

-- =============================================================================
-- DROP EXISTING POLICIES IF THEY EXIST
-- =============================================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view AI generated images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload AI images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update AI images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete AI images" ON storage.objects;

DROP POLICY IF EXISTS "Public can view AI generated videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload AI videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update AI videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete AI videos" ON storage.objects;

DROP POLICY IF EXISTS "Public can view AI generated audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload AI audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update AI audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete AI audio" ON storage.objects;

DROP POLICY IF EXISTS "Public can view team photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload team photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update team photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete team photos" ON storage.objects;

DROP POLICY IF EXISTS "Public can view case study images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload case study images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update case study images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete case study images" ON storage.objects;

DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

DROP POLICY IF EXISTS "Public can view resource files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resource files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resource files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resource files" ON storage.objects;

-- =============================================================================
-- CREATE STORAGE BUCKETS
-- =============================================================================

-- Create storage buckets (handle conflicts gracefully)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('ai-generated-images', 'ai-generated-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('ai-generated-videos', 'ai-generated-videos', true, 524288000, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
    ('ai-generated-audio', 'ai-generated-audio', true, 104857600, ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']),
    ('team-photos', 'team-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('case-study-images', 'case-study-images', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('resource-files', 'resource-files', true, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =============================================================================
-- CREATE STORAGE POLICIES
-- =============================================================================

-- AI Generated Images bucket policies
CREATE POLICY "Public can view AI generated images" ON storage.objects FOR SELECT USING (bucket_id = 'ai-generated-images');
CREATE POLICY "Authenticated users can upload AI images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ai-generated-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update AI images" ON storage.objects FOR UPDATE USING (bucket_id = 'ai-generated-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete AI images" ON storage.objects FOR DELETE USING (bucket_id = 'ai-generated-images' AND auth.role() = 'authenticated');

-- AI Generated Videos bucket policies
CREATE POLICY "Public can view AI generated videos" ON storage.objects FOR SELECT USING (bucket_id = 'ai-generated-videos');
CREATE POLICY "Authenticated users can upload AI videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ai-generated-videos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update AI videos" ON storage.objects FOR UPDATE USING (bucket_id = 'ai-generated-videos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete AI videos" ON storage.objects FOR DELETE USING (bucket_id = 'ai-generated-videos' AND auth.role() = 'authenticated');

-- AI Generated Audio bucket policies
CREATE POLICY "Public can view AI generated audio" ON storage.objects FOR SELECT USING (bucket_id = 'ai-generated-audio');
CREATE POLICY "Authenticated users can upload AI audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ai-generated-audio' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update AI audio" ON storage.objects FOR UPDATE USING (bucket_id = 'ai-generated-audio' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete AI audio" ON storage.objects FOR DELETE USING (bucket_id = 'ai-generated-audio' AND auth.role() = 'authenticated');

-- Team Photos bucket policies
CREATE POLICY "Public can view team photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');
CREATE POLICY "Authenticated users can upload team photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update team photos" ON storage.objects FOR UPDATE USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete team photos" ON storage.objects FOR DELETE USING (bucket_id = 'team-photos' AND auth.role() = 'authenticated');

-- Case Study Images bucket policies
CREATE POLICY "Public can view case study images" ON storage.objects FOR SELECT USING (bucket_id = 'case-study-images');
CREATE POLICY "Authenticated users can upload case study images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'case-study-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update case study images" ON storage.objects FOR UPDATE USING (bucket_id = 'case-study-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete case study images" ON storage.objects FOR DELETE USING (bucket_id = 'case-study-images' AND auth.role() = 'authenticated');

-- Blog Images bucket policies
CREATE POLICY "Public can view blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Authenticated users can upload blog images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update blog images" ON storage.objects FOR UPDATE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete blog images" ON storage.objects FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Resource Files bucket policies
CREATE POLICY "Public can view resource files" ON storage.objects FOR SELECT USING (bucket_id = 'resource-files');
CREATE POLICY "Authenticated users can upload resource files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resource-files' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update resource files" ON storage.objects FOR UPDATE USING (bucket_id = 'resource-files' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete resource files" ON storage.objects FOR DELETE USING (bucket_id = 'resource-files' AND auth.role() = 'authenticated');

-- Success message
SELECT 'Fixed storage buckets and policies created successfully!' as storage_status;