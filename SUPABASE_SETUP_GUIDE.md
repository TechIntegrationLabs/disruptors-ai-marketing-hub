# Supabase Database Setup Guide

## Overview
This guide will help you set up the complete Supabase database infrastructure for the Disruptors AI Marketing Hub project. All the SQL files have been created and are ready to execute.

## Database Schema Overview

### Content Management Tables
- `team_members` - Team profiles for About page
- `case_studies` - Portfolio items for Work page
- `blog_posts` - Blog content with full metadata
- `resources` - Downloadable guides and resources
- `services` - Service offerings for Solutions pages
- `testimonials` - Client testimonials and reviews
- `faqs` - Frequently asked questions

### AI Generation System Tables
- `generated_media` - Store AI-generated images, videos, audio
- `generation_analytics` - Track AI usage and performance
- `admin_sessions` - Secure admin authentication

### User Interaction Tables
- `contact_submissions` - Contact form submissions
- `assessment_responses` - AI readiness assessment results
- `strategy_session_bookings` - Strategy session requests
- `newsletter_subscriptions` - Email list management

## Setup Steps

### 1. Access Your Supabase Project
- Go to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb
- Navigate to the SQL Editor

### 2. Execute Database Schema
1. Open the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `database-setup.sql`
3. Click "Run" to execute the schema creation
4. Verify all tables were created successfully

### 3. Set Up Storage Buckets
1. In the SQL Editor, copy and paste the contents of `storage-setup.sql`
2. Click "Run" to create all storage buckets and policies
3. Verify buckets are created in the Storage section

### 4. Add Sample Data (Development)
1. Copy and paste the contents of `seed-data.sql`
2. Click "Run" to populate with sample data
3. This provides realistic data for development and testing

### 5. Get Your API Keys
1. Go to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/settings/api
2. Copy the following values:
   - **Project URL**: `https://ubqxflzuvxowigbjmqfb.supabase.co`
   - **Anon (public) key**: Copy the `anon` key
   - **Service role (secret) key**: Copy the `service_role` key

### 6. Configure Environment Variables
1. Create a `.env` file in your project root
2. Copy the contents of `.env.example` to `.env`
3. Replace the placeholder values with your actual Supabase keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ubqxflzuvxowigbjmqfb.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

## Database Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Public read access for published content
- Authenticated access required for admin operations
- Secure policies for user data submission

### Storage Buckets
- `ai-generated-images` - AI-generated images (50MB limit)
- `ai-generated-videos` - AI-generated videos (500MB limit)
- `ai-generated-audio` - AI-generated audio (100MB limit)
- `team-photos` - Team member photos (10MB limit)
- `case-study-images` - Case study images (20MB limit)
- `blog-images` - Blog post images (10MB limit)
- `resource-files` - Downloadable resources (50MB limit)

### Automated Features
- Automatic `updated_at` timestamp updates
- Analytics tracking for AI generation usage
- UUID generation for all primary keys
- Comprehensive indexing for performance

### Security Features
- Row Level Security on all tables
- Secure admin session management
- Public access only to published content
- Encrypted storage for sensitive data

## Testing Your Setup

### 1. Verify Database Connection
```javascript
import { supabase } from './src/lib/supabase-client.js'

// Test the connection
const { data, error } = await supabase.from('services').select('*')
console.log('Services:', data)
```

### 2. Test Storage Access
```javascript
// Test storage bucket access
const { data, error } = await supabase.storage.listBuckets()
console.log('Storage buckets:', data)
```

### 3. Verify Sample Data
- Check that sample team members, services, and blog posts are visible
- Confirm that the seed data appears in your application

## Production Considerations

### Security
- Keep your `service_role` key secure and never expose it in client-side code
- Use the `anon` key for client-side operations
- Regularly rotate your API keys
- Monitor access logs in the Supabase dashboard

### Performance
- Database includes optimized indexes for common queries
- Storage buckets have appropriate file size limits
- RLS policies are efficient for your use case

### Monitoring
- Use the Analytics section in Supabase dashboard
- Monitor API usage and performance metrics
- Set up alerts for high usage or errors

## API Integration

### Base44 SDK Compatibility
The database schema is designed to work seamlessly with your existing Base44 SDK wrapper. Key considerations:

- All tables use UUID primary keys compatible with the SDK
- JSON fields support complex data structures
- Timestamps use ISO format for consistency

### MCP Server Integration
The schema supports the Supabase MCP server patterns:

- Proper foreign key relationships
- Consistent naming conventions
- Optimized for MCP operations

## Next Steps

1. **Execute the SQL files** in your Supabase dashboard
2. **Configure your environment variables** with the actual API keys
3. **Test the database connection** in your application
4. **Verify all features work** with the sample data
5. **Begin integrating** with your React components

## Support

If you encounter any issues:
1. Check the Supabase dashboard logs
2. Verify your API keys are correct
3. Ensure RLS policies allow your operations
4. Check the browser console for detailed error messages

Your Supabase database is now ready for production use with the Disruptors AI Marketing Hub!