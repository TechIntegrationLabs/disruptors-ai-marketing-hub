# Site Media Table - Quick Start Guide

## Adding Your First Media Record

### Method 1: Using the Helper Script (Easiest)

```bash
# Basic add (media_key, url, type)
node scripts/site-media-helper.js add hero-home-bg "https://res.cloudinary.com/dvcvxhzmt/image/upload/v1234567890/dmsite/hero-bg.jpg" image

# The script will create the record with default values
```

### Method 2: Using JavaScript/Node.js (Most Flexible)

Create a file `scripts/add-first-media.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function addFirstMedia() {
  const { data, error } = await supabase
    .from('site_media')
    .insert({
      // Required fields
      media_key: 'hero-home-background',
      media_type: 'image',
      media_url: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/v1234567890/dmsite/hero-bg.jpg',

      // Context
      page_slug: 'home',
      section_name: 'hero',
      purpose: 'Hero background image for home page',

      // Media details
      alt_text: 'Disruptors AI - AI-powered marketing automation hero background',
      width: 1920,
      height: 1080,
      mime_type: 'image/jpeg',

      // Cloudinary
      cloudinary_public_id: 'dmsite/hero-backgrounds/home-main',
      cloudinary_folder: 'dmsite/hero-backgrounds',
      cloudinary_format: 'jpg',

      // Display
      display_order: 1,
      is_active: true,
      is_featured: true,
      lazy_load: false, // Hero images shouldn't lazy load

      // SEO
      seo_optimized: true,
      accessibility_checked: true,

      // Tags
      tags: ['hero', 'background', 'home', 'primary'],

      // Metadata
      metadata: {
        photographer: 'Disruptors Team',
        created_date: '2025-09-30',
        keywords: ['AI', 'automation', 'marketing', 'technology']
      }
    })
    .select()
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('✓ Media added successfully!');
  console.log('ID:', data.id);
  console.log('Media Key:', data.media_key);
  console.log('Created:', data.created_at);
}

addFirstMedia();
```

Run it:
```bash
node scripts/add-first-media.js
```

### Method 3: Using Custom SDK (Integrated Approach)

In your React component or script:

```javascript
import { customSDK } from '@/lib/custom-sdk';

// Add media using custom SDK
const newMedia = await customSDK.create('site_media', {
  media_key: 'service-icon-ai-automation',
  media_type: 'image',
  media_url: 'https://res.cloudinary.com/dvcvxhzmt/image/upload/dmsite/service-icons/ai-automation.png',
  page_slug: 'solutions-ai-automation',
  section_name: 'hero',
  alt_text: 'AI Automation service icon',
  tags: ['service-icon', 'ai', 'automation'],
  is_active: true
});
```

### Method 4: Directly in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/editor/site_media
2. Click "Insert row"
3. Fill in at minimum:
   - `media_key` (unique identifier)
   - `media_type` ('image' or 'video')
   - `media_url` (full URL)
4. Optionally fill in other fields
5. Click "Save"

## Field Priority Guide

### ⭐ Essential (Always Populate)
- `media_key` - Unique identifier (e.g., "hero-home-background")
- `media_type` - Either "image" or "video"
- `media_url` - Full URL to the asset
- `alt_text` - For accessibility (especially for images)
- `page_slug` - Which page uses this media
- `is_active` - Set to true for live media

### 🔧 Important (Highly Recommended)
- `section_name` - Where on the page (e.g., "hero", "features")
- `purpose` - Brief description
- `cloudinary_public_id` - If using Cloudinary
- `tags` - For organization and search
- `display_order` - For galleries and lists

### 📝 Optional (Nice to Have)
- `width`, `height` - Dimensions
- `file_size` - For performance monitoring
- `mime_type` - File type
- `cloudinary_folder` - Cloudinary organization
- `is_featured` - Highlight important media
- `lazy_load` - Performance optimization flag
- `seo_optimized` - Track SEO status
- `accessibility_checked` - Track a11y status
- `metadata` - Any additional data

## Common Media Key Patterns

```javascript
// Hero images
'hero-home-background'
'hero-about-team'
'hero-solutions-ai-automation'

// Service icons
'service-icon-ai-automation'
'service-icon-crm-management'
'service-icon-seo-geo'

// Team photos
'team-photo-john-doe'
'team-photo-jane-smith'

// Feature images
'feature-image-dashboard-overview'
'feature-image-analytics-panel'

// Gallery images
'gallery-project-segpro-001'
'gallery-project-segpro-002'

// Testimonial media
'testimonial-video-client-abc'
'testimonial-photo-client-xyz'

// Logo and branding
'logo-primary-full-color'
'logo-secondary-white'
```

## Retrieving Your Media

### Get All Active Media for a Page

```javascript
const { data } = await supabase
  .from('site_media')
  .select('*')
  .eq('page_slug', 'home')
  .eq('is_active', true)
  .order('display_order');

// Returns array of media objects
```

### Get Specific Media by Key

```javascript
const { data } = await supabase
  .from('site_media')
  .select('*')
  .eq('media_key', 'hero-home-background')
  .single();

// Returns single media object
```

### Get Media by Section

```javascript
const { data } = await supabase
  .from('site_media')
  .select('*')
  .eq('page_slug', 'home')
  .eq('section_name', 'hero')
  .eq('is_active', true);
```

### Search by Tags

```javascript
const { data } = await supabase
  .from('site_media')
  .select('*')
  .contains('tags', ['service-icon']);
```

## Using Media in React Components

```jsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

function HeroSection({ pageSlug }) {
  const [heroMedia, setHeroMedia] = useState(null);

  useEffect(() => {
    async function fetchHeroMedia() {
      const { data } = await supabase
        .from('site_media')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('section_name', 'hero')
        .eq('is_active', true)
        .single();

      setHeroMedia(data);
    }

    fetchHeroMedia();
  }, [pageSlug]);

  if (!heroMedia) return null;

  return (
    <section className="hero">
      <img
        src={heroMedia.media_url}
        alt={heroMedia.alt_text}
        width={heroMedia.width}
        height={heroMedia.height}
        loading={heroMedia.lazy_load ? 'lazy' : 'eager'}
      />
      {heroMedia.caption && <p>{heroMedia.caption}</p>}
    </section>
  );
}
```

## Bulk Import Example

If you have multiple media to add:

```javascript
const mediaToAdd = [
  {
    media_key: 'hero-home-background',
    media_type: 'image',
    media_url: 'https://...',
    page_slug: 'home',
    section_name: 'hero',
    alt_text: '...',
    is_active: true
  },
  {
    media_key: 'service-icon-ai',
    media_type: 'image',
    media_url: 'https://...',
    page_slug: 'solutions-ai-automation',
    section_name: 'hero',
    alt_text: '...',
    is_active: true
  }
  // ... more media
];

const { data, error } = await supabase
  .from('site_media')
  .insert(mediaToAdd)
  .select();

console.log(`Added ${data.length} media records`);
```

## Quick Tips

1. **Unique Keys**: Make sure each `media_key` is unique
2. **Active Flag**: Set `is_active: true` for live content
3. **Alt Text**: Always provide for images (accessibility)
4. **Tags**: Use for flexible organization
5. **Cloudinary**: Populate Cloudinary fields for CDN assets
6. **Display Order**: Use for galleries and ordered lists
7. **Metadata**: Store extra data in JSONB for flexibility

## Next Steps

1. Add your first media record using one of the methods above
2. Verify it appears: `node scripts/site-media-helper.js list`
3. Integrate into a React component
4. Migrate existing media from your components
5. Build admin interface for easy management

## Getting Help

- View table structure: `node scripts/verify-site-media-table.js`
- Check stats: `node scripts/site-media-helper.js stats`
- Read full docs: `docs/SITE_MEDIA_TABLE.md`
- View in Supabase: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/editor/site_media
