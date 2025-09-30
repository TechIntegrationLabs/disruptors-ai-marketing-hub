# Site Media Table Documentation

## Overview

The `site_media` table is a comprehensive media management system for the Disruptors AI website. It centralizes all image and video assets with rich metadata, SEO optimization, accessibility tracking, and Cloudinary integration.

## Table Structure

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | uuid | Yes | Primary key (auto-generated) |
| `media_key` | text | Yes | Unique identifier (e.g., "hero-home-background") |
| `media_type` | text | Yes | Either 'image' or 'video' |
| `media_url` | text | Yes | Full URL to the media asset |

### Context & Organization

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page_slug` | text | No | Page identifier (e.g., "home", "solutions-ai-automation") |
| `section_name` | text | No | Section within page (e.g., "hero", "features") |
| `purpose` | text | No | Description of media purpose |

### Media Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `alt_text` | text | No | Alt text for accessibility |
| `caption` | text | No | Caption text |
| `title` | text | No | Title attribute |
| `width` | integer | No | Width in pixels |
| `height` | integer | No | Height in pixels |
| `file_size` | integer | No | File size in bytes |
| `mime_type` | text | No | MIME type (e.g., "image/png") |

### Cloudinary Integration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cloudinary_public_id` | text | No | Cloudinary public ID |
| `cloudinary_folder` | text | No | Cloudinary folder path |
| `cloudinary_version` | text | No | Cloudinary version string |
| `cloudinary_format` | text | No | File format in Cloudinary |

### Display & Behavior

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `display_order` | integer | No | 0 | Sort order for display |
| `is_active` | boolean | No | true | Whether media is active |
| `is_featured` | boolean | No | false | Featured media flag |
| `lazy_load` | boolean | No | true | Enable lazy loading |

### SEO & Accessibility

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `seo_optimized` | boolean | No | false | SEO optimization flag |
| `accessibility_checked` | boolean | No | false | Accessibility audit flag |

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tags` | text[] | No | Array of tags for categorization |
| `metadata` | jsonb | No | Flexible JSON field for additional data |

### Timestamps

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `created_at` | timestamp | No | now() | Creation timestamp |
| `updated_at` | timestamp | No | now() | Last update timestamp (auto-updated) |

## Indexes

The table includes the following performance indexes:

- `site_media_pkey` - Primary key on `id`
- `site_media_media_key_key` - Unique index on `media_key`
- `idx_site_media_page_slug` - Index on `page_slug` for page-based queries
- `idx_site_media_section` - Index on `section_name` for section queries
- `idx_site_media_type` - Index on `media_type` for type filtering
- `idx_site_media_active` - Index on `is_active` for active media queries
- `idx_site_media_media_key` - Index on `media_key` for key lookups
- `idx_site_media_tags` - GIN index on `tags` array for tag searches
- `idx_site_media_metadata` - GIN index on `metadata` JSONB for JSON queries

## Constraints

- **Primary Key**: `id` (uuid)
- **Unique Constraint**: `media_key` must be unique
- **Check Constraint**: `media_type` must be either 'image' or 'video'

## Row Level Security (RLS)

RLS is enabled with the following policies:

1. **Public Read Access**: Anonymous and authenticated users can read active media (`is_active = true`)
2. **Authenticated Read All**: Authenticated users can read all media (including inactive)
3. **Service Role Insert**: Only service role can insert new media
4. **Service Role Update**: Only service role can update media
5. **Service Role Delete**: Only service role can delete media

## Triggers

- **update_site_media_updated_at**: Automatically updates `updated_at` timestamp on every UPDATE operation

## Usage Examples

### JavaScript/TypeScript (Supabase Client)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch all active media for home page
const { data, error } = await supabase
  .from('site_media')
  .select('*')
  .eq('page_slug', 'home')
  .eq('is_active', true)
  .order('display_order');

// Add new media
const { data, error } = await supabase
  .from('site_media')
  .insert({
    media_key: 'hero-home-background',
    media_type: 'image',
    media_url: 'https://res.cloudinary.com/...',
    page_slug: 'home',
    section_name: 'hero',
    purpose: 'Hero background image',
    alt_text: 'Disruptors AI hero background',
    cloudinary_public_id: 'dmsite/hero-bg',
    width: 1920,
    height: 1080,
    tags: ['hero', 'background', 'home']
  });

// Update media
const { data, error } = await supabase
  .from('site_media')
  .update({
    alt_text: 'Updated alt text',
    seo_optimized: true
  })
  .eq('media_key', 'hero-home-background');

// Search by tags
const { data, error } = await supabase
  .from('site_media')
  .select('*')
  .contains('tags', ['hero'])
  .eq('is_active', true);
```

### Custom SDK Integration

```javascript
import { customSDK } from '@/lib/custom-sdk';

// Using the custom SDK wrapper
const media = await customSDK.getAll('site_media', {
  filters: { page_slug: 'home', is_active: true },
  sort: 'display_order'
});

const newMedia = await customSDK.create('site_media', {
  media_key: 'service-icon-ai',
  media_type: 'image',
  media_url: 'https://...',
  page_slug: 'solutions-ai-automation'
});
```

### CLI Helper Script

```bash
# List all media
node scripts/site-media-helper.js list

# List media for specific page
node scripts/site-media-helper.js list home

# Add new media
node scripts/site-media-helper.js add hero-home-bg https://cloudinary.com/... image

# Update media
node scripts/site-media-helper.js update hero-home-bg alt_text="New alt text" seo_optimized=true

# Delete media
node scripts/site-media-helper.js delete hero-home-bg

# Get statistics
node scripts/site-media-helper.js stats
```

## Media Key Naming Convention

Use descriptive, kebab-case naming:

**Pattern**: `{section}-{page}-{descriptor}` or `{type}-{purpose}-{page}`

**Examples**:
- `hero-home-background`
- `service-icon-ai-automation`
- `team-photo-john-doe`
- `feature-image-crm-dashboard`
- `video-testimonial-client-abc`
- `gallery-image-project-xyz-001`

## Best Practices

### 1. Always Set Media Keys Uniquely
```javascript
media_key: 'hero-home-background' // Good
media_key: 'image1' // Bad
```

### 2. Populate Alt Text for Accessibility
```javascript
alt_text: 'Disruptors AI team collaborating on AI automation project'
```

### 3. Use Tags for Categorization
```javascript
tags: ['hero', 'background', 'home', 'primary']
```

### 4. Track Cloudinary Assets
```javascript
cloudinary_public_id: 'dmsite/hero-backgrounds/home-v2',
cloudinary_folder: 'dmsite/hero-backgrounds',
cloudinary_format: 'webp'
```

### 5. Set Display Order for Galleries
```javascript
display_order: 1, // First item
display_order: 2, // Second item
```

### 6. Use Metadata for Flexible Data
```javascript
metadata: {
  photographer: 'John Doe',
  license: 'CC-BY-4.0',
  keywords: ['AI', 'automation', 'technology'],
  crop_focal_point: { x: 0.5, y: 0.3 }
}
```

### 7. Mark SEO and Accessibility Status
```javascript
seo_optimized: true,
accessibility_checked: true
```

## Common Queries

### Get Hero Images for All Pages
```javascript
const { data } = await supabase
  .from('site_media')
  .select('*')
  .eq('section_name', 'hero')
  .eq('media_type', 'image')
  .eq('is_active', true);
```

### Get All Service Icons
```javascript
const { data } = await supabase
  .from('site_media')
  .select('*')
  .like('media_key', 'service-icon-%')
  .eq('is_active', true);
```

### Get Cloudinary Assets
```javascript
const { data } = await supabase
  .from('site_media')
  .select('*')
  .not('cloudinary_public_id', 'is', null)
  .eq('is_active', true);
```

### Get Featured Media
```javascript
const { data } = await supabase
  .from('site_media')
  .select('*')
  .eq('is_featured', true)
  .eq('is_active', true)
  .order('display_order');
```

### Search by Multiple Tags
```javascript
const { data } = await supabase
  .from('site_media')
  .select('*')
  .contains('tags', ['hero', 'primary']);
```

## Migration Files

- **Location**: `supabase/migrations/20250930000000_create_site_media_table.sql`
- **Applied**: September 30, 2025
- **Status**: Active

## Related Scripts

- `scripts/verify-site-media-table.js` - Verify table structure and configuration
- `scripts/site-media-helper.js` - CLI utility for managing media records
- `scripts/execute-migration-via-api.js` - Migration execution script

## Database Dashboard

View and manage the table in Supabase Dashboard:
https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/editor/site_media

## Future Enhancements

Potential future additions:

- Image transformation presets (Cloudinary)
- Version history tracking
- CDN integration status
- Performance metrics (load time, views)
- A/B testing variants
- Automatic image optimization status
- Responsive image variant tracking
- WebP/AVIF format optimization flags
