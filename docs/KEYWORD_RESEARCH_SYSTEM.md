# Keyword Research & AI Blog Generation System

Comprehensive documentation for the integrated keyword research and AI-powered blog generation system.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Setup & Configuration](#setup--configuration)
- [User Workflow](#user-workflow)
- [Components](#components)
- [API Integration](#api-integration)
- [Database Schema](#database-schema)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

## Overview

This system combines DataForSEO keyword research API with Claude AI (Anthropic) to create a streamlined workflow for generating SEO-optimized blog content:

1. **Research Keywords** - Use DataForSEO to find high-value keywords
2. **Select Keywords** - Multi-select interface with stats and scores
3. **Generate Content** - Claude AI creates SEO-optimized articles
4. **Edit & Manage** - Full CRUD operations on blog posts
5. **Publish** - Save to Supabase database

### Key Features

✅ **DataForSEO Integration** - Real keyword data (volume, difficulty, CPC)
✅ **Smart Keyword Scoring** - Opportunity score based on volume vs. competition
✅ **Multi-Select Interface** - Choose primary + secondary keywords
✅ **Claude AI Generation** - 1,200+ word SEO-optimized articles
✅ **Individual Post Management** - Generate, edit, regenerate, delete
✅ **Keyword Metadata Storage** - All keyword data saved with posts
✅ **Real-time Preview** - See content before saving
✅ **Batch Operations** - Generate multiple posts (planned)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Blog Management Dashboard                 │
│  ┌─────────────┬───────────────┬────────────┬────────────┐  │
│  │  Keyword    │   Generate    │   Manage   │    Edit    │  │
│  │  Research   │     Post      │   Posts    │    Post    │  │
│  └─────────────┴───────────────┴────────────┴────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                │                │            │
         ▼                ▼                ▼            ▼
┌────────────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐
│  DataForSEO    │  │   Claude AI  │  │ Supabase │  │ Custom   │
│  API Client    │  │  Blog Writer │  │   SDK    │  │   SDK    │
└────────────────┘  └──────────────┘  └──────────┘  └──────────┘
         │                │                │            │
         └────────────────┴────────────────┴────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Posts Table    │
                    │  (Supabase)     │
                    └─────────────────┘
```

## Setup & Configuration

### 1. Install Dependencies

Already included in package.json:
- `@anthropic-ai/sdk` - Claude AI integration
- `@supabase/supabase-js` - Database
- React + Radix UI components

### 2. Configure Environment Variables

Your `.env` file should have:

```bash
# DataForSEO API
DATAFORSEO_USERNAME=your_dataforseo_username
DATAFORSEO_PASSWORD=your_dataforseo_password

# Anthropic Claude API
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key

# Supabase Database
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Database Migration

Apply the keyword fields migration:

```bash
# Using Supabase CLI
npx supabase db push

# Or manually
psql $DATABASE_URL -f supabase/migrations/20250131_add_keyword_fields_to_posts.sql
```

### 4. Verify Setup

Check that the following files exist:
- `src/lib/dataforseo-client.js`
- `src/lib/anthropic-blog-writer.js`
- `src/components/admin/KeywordResearch.jsx`
- `src/components/admin/BlogPostGenerator.jsx`
- `src/components/admin/BlogPostEditor.jsx`
- `src/components/admin/BlogManagementDashboard.jsx`

## User Workflow

### Complete Workflow: Research → Generate → Publish

#### Step 1: Research Keywords

1. Navigate to Blog Management Dashboard
2. Click "Keyword Research" tab
3. Enter a seed keyword (e.g., "hvac marketing")
4. Click "Research" button
5. System fetches 50+ keyword suggestions with:
   - Search volume
   - Competition level
   - CPC (cost per click)
   - Trend indicators
   - Opportunity score

#### Step 2: Select Keywords

1. Review keyword results sorted by opportunity score
2. Click keywords to select (multi-select)
3. First selected keyword = primary keyword
4. Additional selections = secondary keywords
5. Click "Use X Selected Keywords" button

#### Step 3: Generate Blog Post

1. System auto-navigates to "Generate Post" tab
2. Pre-fills primary and secondary keywords
3. Add custom title (required)
4. Add meta description (optional)
5. Add additional instructions (optional)
6. Click "Generate Article" button
7. Claude AI generates 1,200+ word article
8. Preview generated content
9. Click "Save Post" to save to database

#### Step 4: Edit & Manage

1. View all posts in "Manage Posts" tab
2. Click "Edit" on any post
3. Modify content, keywords, metadata
4. Regenerate content with AI if needed
5. Save changes or delete post

## Components

### KeywordResearch.jsx

Comprehensive keyword research interface.

**Props:**
- `onKeywordsSelected: (keywords) => void` - Callback when keywords are selected

**Features:**
- Search keyword suggestions
- Display stats (volume, difficulty, CPC, trend)
- Multi-select interface
- Sort by score, volume, difficulty, CPC
- Select all / Clear selection
- Visual indicators for trends and competition

**State:**
```javascript
{
  seedKeyword: string,
  keywords: Array<KeywordData>,
  selectedKeywords: Array<KeywordData>,
  loading: boolean,
  error: string | null,
  sortBy: 'score' | 'volume' | 'difficulty' | 'cpc'
}
```

### BlogPostGenerator.jsx

Generate individual blog posts with Claude AI.

**Props:**
- `initialKeywords: { primary: string, secondary: string[] }` - Pre-filled keywords
- `postId: string | null` - For updating existing posts
- `onSaved: (postData) => void` - Callback after saving

**Features:**
- Pre-filled keywords from research
- Custom title and slug generation
- Meta description
- Additional AI instructions
- Real-time content generation
- Preview before saving
- Regenerate with different prompts

**State:**
```javascript
{
  formData: {
    title: string,
    slug: string,
    metaDescription: string,
    primaryKeyword: string,
    secondaryKeywords: string,
    additionalInstructions: string
  },
  generatedContent: string,
  generating: boolean,
  saving: boolean
}
```

### BlogPostEditor.jsx

Edit existing blog posts with AI regeneration.

**Props:**
- `postId: string` - Post to edit
- `onSaved: (postData) => void` - Callback after saving
- `onDeleted: (postId) => void` - Callback after deletion
- `onCancel: () => void` - Callback to cancel editing

**Features:**
- Load existing post data
- Edit all fields
- Regenerate content with Claude
- Preview changes
- Delete post
- Unsaved changes indicator
- Word count display

### BlogManagementDashboard.jsx

Main dashboard orchestrating all components.

**Features:**
- Tabbed interface (Research, Generate, Manage, Edit)
- State management for selected keywords
- Navigate between workflow steps
- Posts list with edit/delete actions

## API Integration

### DataForSEO Client

Located in `src/lib/dataforseo-client.js`

**Key Methods:**

```javascript
// Get keyword ideas with search volume
await dataForSEOClient.getKeywordIdeas(keyword, location, language)

// Get keyword suggestions (main method)
await dataForSEOClient.getKeywordSuggestions(keyword, location, language, limit)

// Get related keywords
await dataForSEOClient.getRelatedKeywords(keyword, location, language)

// Get keyword difficulty
await dataForSEOClient.getKeywordDifficulty(keywords, location, language)

// Comprehensive research (recommended)
await dataForSEOClient.comprehensiveKeywordResearch(seedKeyword, limit)
```

**Response Format:**

```javascript
{
  seedKeyword: "hvac marketing",
  totalResults: 50,
  keywords: [
    {
      keyword: "hvac marketing strategies",
      searchVolume: 1200,
      competition: 0.45,
      competitionLevel: "Medium",
      cpc: 3.25,
      trend: "rising",
      score: 42.5
    },
    // ...more keywords
  ],
  timestamp: "2025-01-31T12:00:00Z"
}
```

### Claude AI Blog Writer

Located in `src/lib/anthropic-blog-writer.js`

**Key Method:**

```javascript
await generateBlogArticle(
  title,              // Article title
  primaryKeyword,     // Main SEO keyword
  secondaryKeywords,  // Array of secondary keywords
  additionalContext   // Optional instructions
)
```

**Returns:**

```javascript
{
  content: string,     // Full article content (1,200+ words)
  wordCount: number,   // Word count
  model: string,       // Claude model used
  usage: {
    input_tokens: number,
    output_tokens: number
  }
}
```

## Database Schema

### Posts Table - New Keyword Fields

```sql
-- Primary keyword field
primary_keyword text

-- Secondary keywords array
secondary_keywords text[]

-- Keyword research metadata
keyword_data jsonb DEFAULT '{}'

-- Search volume for primary keyword
search_volume integer

-- Keyword difficulty score (0-100)
keyword_difficulty integer

-- Meta description for SEO
meta_description text

-- Featured image URL
featured_image text
```

### Example Post Record

```json
{
  "id": "uuid-here",
  "title": "Ultimate Guide to HVAC Marketing in 2025",
  "slug": "ultimate-guide-hvac-marketing-2025",
  "content": "Full article content...",
  "excerpt": "Brief excerpt...",
  "primary_keyword": "hvac marketing",
  "secondary_keywords": [
    "hvac advertising",
    "hvac lead generation",
    "hvac seo"
  ],
  "keyword_data": {
    "primary": {
      "searchVolume": 1200,
      "difficulty": 45,
      "cpc": 3.25
    },
    "secondary": [...]
  },
  "search_volume": 1200,
  "keyword_difficulty": 45,
  "meta_description": "Learn proven HVAC marketing strategies...",
  "status": "draft",
  "created_at": "2025-01-31T12:00:00Z",
  "updated_at": "2025-01-31T12:00:00Z"
}
```

## Usage Examples

### Example 1: Generate Post from Keyword Research

```javascript
import BlogManagementDashboard from '@/components/admin/BlogManagementDashboard';

function AdminPage() {
  return <BlogManagementDashboard />;
}
```

### Example 2: Programmatic Keyword Research

```javascript
import { dataForSEOClient } from '@/lib/dataforseo-client';

// Research keywords
const results = await dataForSEOClient.comprehensiveKeywordResearch(
  'hvac marketing',
  50
);

// Get top 10 opportunities
const topKeywords = results.keywords
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);

console.log(topKeywords);
```

### Example 3: Generate Article Programmatically

```javascript
import { generateBlogArticle } from '@/lib/anthropic-blog-writer';

const result = await generateBlogArticle(
  'How to Generate HVAC Leads in 2025',
  'hvac lead generation',
  ['hvac marketing', 'hvac advertising', 'local seo'],
  'Focus on digital marketing strategies for small businesses'
);

console.log(`Generated ${result.wordCount} words`);
console.log(result.content);
```

### Example 4: Standalone Components

```javascript
// Just keyword research
import KeywordResearch from '@/components/admin/KeywordResearch';

function MyComponent() {
  const handleKeywords = (keywords) => {
    console.log('Selected:', keywords);
  };

  return <KeywordResearch onKeywordsSelected={handleKeywords} />;
}
```

## Troubleshooting

### DataForSEO API Issues

**Problem:** "DataForSEO credentials not configured"

**Solution:**
- Check `.env` file has `DATAFORSEO_USERNAME` and `DATAFORSEO_PASSWORD`
- Verify credentials at https://app.dataforseo.com/
- Ensure credentials are not prefixed with `VITE_` (server-side only)

**Problem:** "API Error: Unauthorized"

**Solution:**
- Verify username and password are correct
- Check DataForSEO account has active subscription
- Ensure API credits are available

### Claude AI Generation Issues

**Problem:** "Failed to generate article"

**Solution:**
- Check `VITE_ANTHROPIC_API_KEY` is set correctly
- Verify API key at https://console.anthropic.com/settings/keys
- Check Claude API rate limits (50 requests/min)
- Ensure sufficient API credits

**Problem:** "Content is too short"

**Solution:**
- Check system prompt in `anthropic-blog-writer.js`
- Verify `max_tokens` is set to 4096 or higher
- Add more detailed `additionalInstructions`

### Database Issues

**Problem:** "Column 'primary_keyword' does not exist"

**Solution:**
- Run database migration: `npx supabase db push`
- Or manually run: `psql $DATABASE_URL -f supabase/migrations/20250131_add_keyword_fields_to_posts.sql`

**Problem:** "Cannot save post"

**Solution:**
- Check Supabase credentials in `.env`
- Verify Row Level Security (RLS) policies allow inserts
- Check browser console for detailed error messages

### UI Issues

**Problem:** "Keywords not displaying"

**Solution:**
- Open browser console for errors
- Check DataForSEO API response in Network tab
- Verify `formatKeywordForUI` method is working

**Problem:** "Generate button disabled"

**Solution:**
- Ensure title field is filled
- Ensure primary keyword is filled
- Check that you're not already generating

## Best Practices

### Keyword Research

1. **Start Broad** - Use general seed keywords to discover niches
2. **Filter by Score** - Focus on high opportunity score keywords (>30)
3. **Balance Difficulty** - Mix low and medium difficulty keywords
4. **Check Trends** - Prioritize rising trend keywords
5. **Consider Intent** - Select keywords matching user search intent

### Content Generation

1. **Specific Titles** - Use clear, specific article titles
2. **Multiple Keywords** - Select 3-5 secondary keywords
3. **Add Context** - Provide additional instructions for better output
4. **Review Content** - Always preview before saving
5. **Edit as Needed** - Use regenerate for different angles

### Post Management

1. **Save as Draft** - Generate content as draft first
2. **Review Keywords** - Verify keyword usage in content
3. **Edit Meta** - Customize meta description for better CTR
4. **Test Locally** - Preview posts before publishing
5. **Track Performance** - Monitor which keywords perform best

## API Costs

### DataForSEO

- **Comprehensive Research**: ~$0.01 - $0.03 per search
- **Monthly Plan**: Starting at $30/month for 1000 credits
- **Recommendation**: Budget $50-100/month for active research

### Claude AI (Anthropic)

- **Per Article**: ~$0.50 - $1.00 per 1,200-word article
- **Claude Sonnet 4.5**: $3 per million input tokens, $15 per million output tokens
- **Recommendation**: Budget $50-200/month depending on volume

### Total Monthly Budget

- **Light Use**: $80/month (DataForSEO + Claude)
- **Moderate Use**: $150/month (more keyword research + 100 articles)
- **Heavy Use**: $300+/month (extensive research + 500+ articles)

## Future Enhancements

### Planned Features

- [ ] Batch article generation (generate 10+ at once)
- [ ] Keyword grouping and clustering
- [ ] Content calendar integration
- [ ] Automatic publishing schedule
- [ ] SEO score calculator
- [ ] Competitor analysis integration
- [ ] Image generation for featured images
- [ ] Social media caption generation
- [ ] Email newsletter generation from posts

### Integration Opportunities

- Google Search Console for performance tracking
- Ahrefs/SEMrush for additional keyword data
- WordPress for direct publishing
- Webflow CMS integration
- HubSpot blog integration

## Support & Resources

- **DataForSEO Docs**: https://docs.dataforseo.com/v3/
- **Anthropic Docs**: https://docs.anthropic.com/
- **Supabase Docs**: https://supabase.com/docs
- **Project Issues**: GitHub Issues (if applicable)

---

**Last Updated**: January 31, 2025
**Version**: 1.0.0
**Author**: Disruptors AI Development Team
