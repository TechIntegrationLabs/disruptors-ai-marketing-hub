# Services Table Setup Summary

**Date**: 2025-09-30
**Status**: Ready for Manual Execution
**Database**: Supabase (ubqxflzuvxowigbjmqfb.supabase.co)

---

## Overview

This document provides instructions for setting up the Supabase `services` table with proper schema, RLS policies, triggers, and data population to support the ServiceScroller component.

## Current State

**Existing Table**: `services` table already exists with basic schema
**Existing Records**: 1 record (AI Marketing Automation)
**Missing Fields**: `hook`, `image`, `display_order`, and several optional fields
**Missing Infrastructure**: RLS policies, updated_at trigger

## Required Schema

The services table needs the following fields to support the ServiceScroller component:

### Core Fields
- `id` (uuid, primary key) - Unique identifier
- `title` (text, required) - Service name
- `slug` (text, required) - URL-safe identifier (e.g., "solutions-ai-automation")
- `hook` (text) - Short tagline/description for the service card
- `image` (text) - Path to service icon/image
- `display_order` (integer) - Order for display in UI

### Extended Fields
- `description` (text) - Longer description
- `icon` (text) - Alternative icon identifier
- `category` (text) - Service category
- `benefits` (text[]) - Array of benefit descriptions
- `pricing_model` (text) - Pricing structure
- `base_price` (numeric) - Starting price
- `currency` (text, default 'USD') - Price currency
- `tags` (text[]) - Search/filter tags

### SEO Fields
- `seo_title` (text) - Page title for SEO
- `seo_description` (text) - Meta description
- `seo_keywords` (text[]) - Target keywords

### System Fields
- `is_active` (boolean, default true) - Publication status
- `created_at` (timestamp) - Creation timestamp
- `updated_at` (timestamp) - Last update timestamp

### Existing Fields (preserve)
- `short_description` (text) - Existing description field
- `detailed_description` (text) - Existing detailed description
- `icon_name` - Existing icon reference
- `featured_image_url` - Existing image URL
- `features` (array) - Existing features list
- `pricing_tiers` (array) - Existing pricing structure
- `deliverables` (array) - Existing deliverables list
- `timeline` - Existing timeline data
- `case_study_ids` (array) - Related case studies
- `is_featured` (boolean) - Feature flag
- `order_index` (number) - Alternative ordering field

## Services Data to Populate

The following 9 services from ServiceScroller.jsx need to be added:

1. **AI Automation** (order: 1)
   - Slug: `solutions-ai-automation`
   - Hook: "Automate repetitive tasks and workflows"
   - Image: `/generated/anachron-lite/ai-automation-icon-anachron-lite.png`

2. **Social Media Marketing** (order: 2)
   - Slug: `solutions-social-media`
   - Hook: "Build and engage your community"
   - Image: `/generated/anachron-lite/social-media-marketing-icon-anachron-lite.png`

3. **SEO & GEO** (order: 3)
   - Slug: `solutions-seo-geo`
   - Hook: "Get found by your ideal customers"
   - Image: `/generated/anachron-lite/seo-geo-icon-anachron-lite.png`

4. **Lead Generation** (order: 4)
   - Slug: `solutions-lead-generation`
   - Hook: "Fill your pipeline with qualified prospects"
   - Image: `/generated/anachron-lite/lead-generation-icon-anachron-lite.png`

5. **Paid Advertising** (order: 5)
   - Slug: `solutions-paid-advertising`
   - Hook: "Maximize ROI across all channels"
   - Image: `/generated/anachron-lite/paid-advertising-icon-anachron-lite.png`

6. **Podcasting** (order: 6)
   - Slug: `solutions-podcasting`
   - Hook: "Build authority through audio content"
   - Image: `/generated/anachron-lite/podcasting-icon-anachron-lite.png`

7. **Custom Apps** (order: 7)
   - Slug: `solutions-custom-apps`
   - Hook: "Tailored solutions for your needs"
   - Image: `/generated/anachron-lite/custom-apps-icon-anachron-lite.png`

8. **CRM Management** (order: 8)
   - Slug: `solutions-crm-management`
   - Hook: "Organize and nurture your relationships"
   - Image: `/generated/anachron-lite/crm-management-icon-anachron-lite.png`

9. **Fractional CMO** (order: 9)
   - Slug: `solutions-fractional-cmo`
   - Hook: "Strategic marketing leadership"
   - Image: `/generated/anachron-lite/fractional-cmo-icon-anachron-lite.png`

## Setup Instructions

### Step 1: Access Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Execute Migration SQL

Copy and paste the contents of the migration file:

**File Location**: `C:\Users\Will\OneDrive\Documents\Projects\dm4\disruptors-ai-marketing-hub\supabase\migrations\add_services_fields.sql`

The migration will:
- Add all missing columns to the services table
- Enable Row Level Security (RLS)
- Create RLS policies for public read access
- Create updated_at trigger
- Clear existing data
- Insert all 9 services

Click **Run** to execute the migration.

### Step 3: Verify the Migration

After running the SQL, verify the results:

```sql
SELECT
  id,
  title,
  slug,
  hook,
  image,
  display_order,
  is_active
FROM services
ORDER BY display_order;
```

You should see 9 services listed in order.

### Step 4: Alternative - Use Automated Script

If you prefer to use the JavaScript automation (after manually adding columns):

```bash
node scripts/apply-services-migration.js
```

This script will:
- Read the migration file
- Execute data operations via Supabase client
- Verify the results
- Provide detailed output

### Step 5: Verify RLS Policies

Check that RLS is properly configured:

1. Go to **Authentication > Policies** in Supabase Dashboard
2. Find the `services` table
3. Verify these policies exist:
   - "Allow public read access" - SELECT for anon/authenticated where is_active = true
   - "Allow authenticated read access" - SELECT for authenticated (all records)

## Security Configuration

### RLS Policies

**Public Read Access**:
- Who: Anonymous and authenticated users
- Action: SELECT
- Condition: `is_active = true`
- Purpose: Allow public users to see active services

**Authenticated Read Access**:
- Who: Authenticated users
- Action: SELECT
- Condition: All records
- Purpose: Allow authenticated users to see all services (including inactive)

**Write Access**:
- Who: Service role only (bypasses RLS)
- Action: INSERT, UPDATE, DELETE
- Purpose: Only backend/admin operations can modify services

### Automatic Timestamp Management

The `update_updated_at_column()` trigger function automatically updates the `updated_at` timestamp whenever a record is modified.

## Integration with Application

### Current Usage (ServiceScroller.jsx)

The ServiceScroller component currently uses hardcoded data. After setting up the database:

1. Update ServiceScroller to fetch from Supabase
2. Use the custom SDK or Supabase client
3. Order by `display_order` field
4. Filter by `is_active = true` for public display

### Example Query

```javascript
import { supabase } from '@/lib/supabase-client';

// Fetch active services ordered by display_order
const { data: services, error } = await supabase
  .from('services')
  .select('id, title, slug, hook, image, display_order')
  .eq('is_active', true)
  .order('display_order', { ascending: true });
```

### Custom SDK Usage

```javascript
import customSdk from '@/lib/custom-sdk';

// Fetch services using Base44-compatible API
const services = await customSdk.Service.list({
  filters: { is_active: true },
  sort: { field: 'display_order', direction: 'asc' }
});
```

## Files Created

### Migration Files
- `supabase/migrations/add_services_fields.sql` - SQL migration for manual execution
- `scripts/apply-services-migration.js` - Automated migration script

### Diagnostic Scripts
- `scripts/check-services-table.js` - Check if services table exists
- `scripts/inspect-services-table.js` - View current table structure and data
- `scripts/setup-services-table.js` - Comprehensive setup script (requires columns)

### Documentation
- `SERVICES_TABLE_SETUP.md` - This document

## Troubleshooting

### Issue: Columns don't exist

**Error**: `column services.display_order does not exist`

**Solution**: Run the SQL migration in Supabase SQL Editor. The Supabase client cannot execute ALTER TABLE statements.

### Issue: RLS policies not working

**Error**: Users can't see active services

**Solution**:
1. Verify RLS is enabled: `ALTER TABLE services ENABLE ROW LEVEL SECURITY;`
2. Check policy conditions match your use case
3. Test with anon key vs authenticated key

### Issue: Trigger not firing

**Error**: `updated_at` timestamp not updating

**Solution**:
1. Verify trigger exists in Database > Triggers
2. Re-create trigger using the SQL in migration file
3. Test with an UPDATE statement

## Next Steps

After successful setup:

1. ✓ Verify all 9 services are in the database
2. ✓ Test RLS policies with anon and authenticated keys
3. ✓ Update ServiceScroller.jsx to fetch from database
4. ✓ Remove hardcoded services data from component
5. ✓ Add admin interface for managing services
6. ✓ Consider adding more fields as needed (pricing_tiers, features, etc.)

## Database Access Information

**Supabase URL**: https://ubqxflzuvxowigbjmqfb.supabase.co
**Project Ref**: ubqxflzuvxowigbjmqfb
**Dashboard**: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb

**Environment Variables** (already configured in `.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_SERVICE_ROLE_KEY`

---

**Status**: Ready for execution
**Estimated Time**: 5-10 minutes
**Risk Level**: Low (non-destructive, can be rolled back)
