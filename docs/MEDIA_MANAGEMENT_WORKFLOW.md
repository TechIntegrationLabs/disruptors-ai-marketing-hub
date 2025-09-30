# Media Management Workflow

Complete guide to managing all site media (images and videos) through the Data Manager admin panel with two-way database sync.

## Overview

The media management system provides centralized control over all images and videos across the site through:
- **Database-driven media**: All media stored in `site_media` table
- **Two-way sync**: Edit in Data Manager, changes reflect immediately on site
- **Fallback support**: Graceful degradation to hardcoded values if database unavailable
- **Cloudinary integration**: Automatic tracking of Cloudinary assets with public IDs and folders
- **SEO & Accessibility**: Built-in fields for alt text, captions, and optimization flags

## Architecture

### Database Table: `site_media`

28-column table with comprehensive metadata:

**Core Fields:**
- `media_key` (text, unique): Unique identifier for the asset
- `media_type` (text): 'image' or 'video'
- `media_url` (text): Full URL to the asset

**Context Fields:**
- `page_slug` (text): Which page uses this asset (e.g., 'home', 'hero', 'about')
- `section_name` (text): Section within the page
- `purpose` (text): Descriptive purpose of the asset

**Media Details:**
- `alt_text` (text): Accessibility description
- `caption` (text): Optional caption
- `title` (text): Optional title
- `width`, `height` (integer): Dimensions
- `file_size` (integer): Size in bytes
- `mime_type` (text): MIME type

**Cloudinary Fields:**
- `cloudinary_public_id` (text): Cloudinary public ID
- `cloudinary_folder` (text): Cloudinary folder path
- `cloudinary_version` (text): Version number
- `cloudinary_format` (text): File format

**Display Fields:**
- `display_order` (integer): Order within section
- `is_active` (boolean): Active/inactive flag
- `is_featured` (boolean): Featured asset flag
- `lazy_load` (boolean): Enable lazy loading

**SEO Fields:**
- `seo_optimized` (boolean): SEO optimization flag
- `accessibility_checked` (boolean): Accessibility review flag

**Metadata:**
- `tags` (text[]): Array of tags for categorization
- `metadata` (jsonb): Flexible JSON metadata
- `created_at`, `updated_at` (timestamp): Audit timestamps

## Setup Complete ✓

The following components are fully configured and operational:

### 1. Database Infrastructure
- ✓ `site_media` table created in Supabase
- ✓ 9 performance indexes (B-tree and GIN)
- ✓ 5 RLS policies for security
- ✓ Automatic `updated_at` trigger
- ✓ 55 media records populated from audit

### 2. Admin UI
- ✓ TableSchemaManager configured with site_media schema
- ✓ Data Manager UI automatically includes site_media table
- ✓ Full CRUD operations available in spreadsheet interface
- ✓ Service role access configured in custom SDK

### 3. Component Integration
- ✓ ServiceScroller loads service icons from database
- ✓ Hero component loads background, video, and logo from database
- ✓ Both components have fallback to hardcoded values

## Using the Data Manager

### Accessing Media Management

1. **Open Admin Panel**: Navigate to `/admin` or use secret access (5 logo clicks in 3 seconds)
2. **Login**: Enter admin credentials in Matrix-style login
3. **Navigate to Data Manager**: Click "Data Manager" in admin dashboard
4. **Select site_media**: Choose "Site Media" from the table dropdown

### Managing Media Assets

**View All Assets:**
- Spreadsheet interface shows all 55+ media records
- Filter by page_slug, media_type, or purpose
- Sort by any column (display_order, created_at, etc.)

**Add New Asset:**
1. Click "Add Row" button
2. Fill in required fields:
   - `media_key`: Unique identifier (e.g., `home_hero_video_1`)
   - `media_type`: Select 'image' or 'video'
   - `media_url`: Full URL to the asset
   - `page_slug`: Which page (e.g., 'home', 'hero', 'about')
3. Optional fields:
   - `purpose`: Description (e.g., "Hero background image")
   - `alt_text`: Accessibility description
   - `display_order`: Position in sequence
   - Cloudinary fields if applicable
4. Click "Save" or press Enter

**Edit Existing Asset:**
1. Click any cell to edit inline
2. Change media_url to replace the asset
3. Update alt_text, purpose, or other metadata
4. Changes sync to database immediately
5. Refresh site to see updates

**Deactivate Asset:**
1. Find the asset row
2. Change `is_active` to false
3. Asset remains in database but won't display on site

**Delete Asset:**
1. Select row
2. Click "Delete Row" button
3. Confirm deletion
4. Asset removed from database and site

## Extending to Other Components

### Pattern: Database-Driven Media Loading

Follow this pattern to make any component load media from the database:

#### 1. Import Required Dependencies

```javascript
import React, { useState, useEffect } from 'react';
import { customClient } from '@/lib/custom-sdk';
```

#### 2. Define Fallback Constants

```javascript
// Fallback hardcoded media (used if database fetch fails)
const FALLBACK_MEDIA = {
  background: {
    url: "https://example.com/image.jpg",
    alt: "Description"
  },
  // ... other media slots
};
```

#### 3. Add State and Loading Logic

```javascript
export default function MyComponent() {
  const [media, setMedia] = useState(FALLBACK_MEDIA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      // Load media from database
      const dbMedia = await customClient.entities.SiteMedia.list('display_order', 100);

      if (dbMedia && dbMedia.length > 0) {
        // Filter for this component's page
        const pageAssets = dbMedia.filter(asset =>
          asset.page_slug === 'your-page-slug' && asset.is_active !== false
        );

        if (pageAssets.length > 0) {
          const mediaMap = { ...FALLBACK_MEDIA };

          // Map database records to media slots by purpose
          pageAssets.forEach(asset => {
            const purpose = asset.purpose?.toLowerCase() || '';

            if (purpose.includes('background')) {
              mediaMap.background = {
                url: asset.media_url,
                alt: asset.alt_text || asset.purpose
              };
            }
            // ... map other media slots
          });

          setMedia(mediaMap);
          console.log(`✓ Loaded ${pageAssets.length} media assets from database`);
        }
      }
    } catch (error) {
      console.warn('⚠ Failed to load media from database:', error.message);
      setMedia(FALLBACK_MEDIA);
    } finally {
      setIsLoading(false);
    }
  }

  // Component JSX...
}
```

#### 4. Use Media State in JSX

```javascript
<img
  src={media.background.url}
  alt={media.background.alt}
  className="..."
/>
```

### Example: Hero Component

See `src/components/shared/Hero.jsx` for a complete implementation:
- Loads 3 media assets (background, video, logo)
- Maps by purpose field
- Graceful fallback to hardcoded URLs
- Console logging for debugging

### Example: ServiceScroller Component

See `src/components/shared/ServiceScroller.jsx` for another implementation:
- Loads 9 service icons
- Filters by `is_active` flag
- Maps database fields to component format
- Loading state with spinner

## Scripts and Utilities

### Population Script: `scripts/populate-site-media.js`

Populates the `site_media` table from the audit data:

```bash
node scripts/populate-site-media.js
```

**Features:**
- Reads `MEDIA_ASSET_AUDIT.json`
- Transforms audit data to database format
- Extracts Cloudinary metadata automatically
- Batch inserts with upsert (50 records per batch)
- Progress reporting and statistics
- Verification of inserted records

**Output:**
```
======================================================================
POPULATING SITE_MEDIA TABLE FROM AUDIT DATA
======================================================================

[1/3] Reading audit file...
   ✓ Found 15 pages with 187 total assets

[2/3] Transforming audit data...
   ✓ Transformed 55 media records

[3/3] Inserting records into site_media table...
   ✓ Batch 1: 50 records
   ✓ Batch 2: 5 records

   Summary: 55 records inserted, 0 failed

✓ site_media table contains 55 records
```

### Verification Script: `scripts/verify-site-media-table.js`

Verifies the table structure and data:

```bash
node scripts/verify-site-media-table.js
```

Checks:
- Table exists
- All 28 columns present with correct types
- All 9 indexes created
- RLS policies active
- Trigger function operational
- Sample data present

### Helper Script: `scripts/site-media-helper.js`

CLI utility for CRUD operations:

```bash
# List all media
node scripts/site-media-helper.js list

# Add new media
node scripts/site-media-helper.js add home_new_bg image https://example.com/bg.jpg

# Update media
node scripts/site-media-helper.js update home_new_bg --url https://new-url.com/bg.jpg

# Delete media
node scripts/site-media-helper.js delete home_new_bg

# Show statistics
node scripts/site-media-helper.js stats
```

## Workflow Examples

### Example 1: Replace Hero Background

**Goal:** Replace the hero background image with a new one

**Steps:**
1. Upload new image to Cloudinary
2. Copy the Cloudinary URL
3. Open Data Manager → Site Media
4. Find record with `page_slug: 'hero'` and `purpose: 'Hero background image'`
5. Update `media_url` field with new Cloudinary URL
6. Optionally update `cloudinary_public_id`, `cloudinary_folder`, etc.
7. Save changes
8. Refresh website to see new background

### Example 2: Add New Service Icon

**Goal:** Add a new service with icon

**Steps:**
1. Generate or upload icon to Cloudinary (or local)
2. Open Data Manager → Services
3. Add new service with title, slug, hook, and image URL
4. Open Data Manager → Site Media
5. Add new record:
   - `media_key`: `servicescroller_new_service_icon_1`
   - `media_type`: `image`
   - `media_url`: Icon URL
   - `page_slug`: `servicescroller`
   - `purpose`: `Service icon for New Service`
   - `alt_text`: `New Service icon`
6. Set `display_order` to position it correctly
7. Refresh website to see new service and icon

### Example 3: Temporarily Disable Media

**Goal:** Hide a video without deleting it

**Steps:**
1. Open Data Manager → Site Media
2. Find the video record
3. Change `is_active` from `true` to `false`
4. Save changes
5. Video will not display on site but remains in database
6. To re-enable, change `is_active` back to `true`

### Example 4: Bulk Update Alt Text

**Goal:** Add accessibility descriptions to all images

**Steps:**
1. Open Data Manager → Site Media
2. Filter by `media_type: 'image'`
3. For each row:
   - Click `alt_text` cell
   - Enter descriptive text
   - Press Enter or Tab to save
4. Update `accessibility_checked` to `true` after review
5. Changes sync immediately

## Best Practices

### Media Keys

- Use descriptive, unique identifiers
- Pattern: `{page_slug}_{purpose}_{type}_{number}`
- Example: `home_hero_background_image_1`
- Keep under 255 characters
- Use lowercase with underscores

### Purpose Field

- Be descriptive and specific
- Include context: "Hero background image (opacity 15%)"
- Helps identify media in Data Manager
- Used for automatic mapping in components

### Page Slugs

- Match actual page filenames without .jsx
- Examples: 'home', 'hero', 'about', 'solutions-ai-automation'
- Consistency enables filtering and organization

### Cloudinary Fields

- Fill in automatically when possible
- Enables advanced Cloudinary features
- Helps track asset versions
- Required for Cloudinary transformations

### Display Order

- Use increments of 10 (10, 20, 30...)
- Allows inserting between existing items
- 0 = highest priority / first position

### Tags Array

- Use for categorization and search
- Include: page_slug, media_type, source_type, theme
- Example: `['home', 'image', 'cloudinary', 'hero', 'background']`

### Metadata JSON

- Store additional custom data
- Example: `{"original_context": "Hero section", "theme": "dark"}`
- Flexible for future needs

## Troubleshooting

### Media Not Loading

**Symptoms:** Fallback media displays instead of database media

**Fixes:**
1. Check browser console for errors
2. Verify `page_slug` matches component filter
3. Ensure `is_active` is `true`
4. Check Supabase RLS policies allow read access
5. Verify `media_url` is accessible (not 404)

### Changes Not Reflecting

**Symptoms:** Updated media in Data Manager but site shows old media

**Fixes:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check if component caches media (shouldn't with current implementation)
4. Verify save succeeded in Data Manager (no error toast)

### Service Role Errors

**Symptoms:** Cannot edit site_media in Data Manager

**Fixes:**
1. Verify logged in as admin
2. Check `VITE_SUPABASE_SERVICE_ROLE_KEY` is set
3. Confirm 'media' in `serviceRoleEntities` array in `custom-sdk.js`
4. Test with: `node scripts/site-media-helper.js list`

### Cloudinary URL Parsing

**Symptoms:** Cloudinary fields not auto-populated

**Fixes:**
1. Verify URL matches pattern: `/v{version}/{path}.{format}`
2. Check URL contains 'cloudinary.com'
3. Use populate script which handles parsing
4. Or manually fill Cloudinary fields

## Future Enhancements

### Planned Features

1. **Media Library UI**: Dedicated media browser with thumbnails
2. **Bulk Upload**: Upload multiple files at once
3. **Image Transformations**: Apply Cloudinary transformations in UI
4. **Version History**: Track changes to media records
5. **Usage Tracking**: Show which pages use each asset
6. **Broken Link Detection**: Automated 404 checking
7. **File Size Optimization**: Automatic compression recommendations
8. **AI Alt Text Generation**: Generate accessibility descriptions

### Component Coverage

**Already Database-Driven:**
- ✓ ServiceScroller (9 service icons)
- ✓ Hero (3 media assets)

**High Priority for Migration:**
- AlternatingLayout sections (5 videos)
- ClientLogoMarquee (9 logos)
- Work case study pages (multiple images/videos)
- About page (5 team photos)

**Extension Pattern:**
Apply the same database-loading pattern from Hero.jsx to any component with hardcoded media URLs.

## Related Documentation

- **Table Schema**: `docs/SITE_MEDIA_TABLE.md`
- **Quick Start**: `docs/SITE_MEDIA_QUICK_START.md`
- **Media Audit**: `MEDIA_ASSET_AUDIT_REPORT.md`
- **Services Setup**: Similar pattern documented in services migration

## Support

For issues or questions:
1. Check browser console for error messages
2. Review this documentation
3. Test with helper scripts for debugging
4. Check Supabase dashboard for table/RLS issues
5. Verify environment variables are set correctly

---

**Last Updated:** 2025-09-30
**Status:** Fully Operational ✓
**Assets Managed:** 55+ (expanding)
