# Keyword Research System - Quick Start Guide

Get started with the integrated keyword research and blog generation system in 5 minutes.

## 🚀 Setup (One Time)

### 1. Apply Database Migration

```bash
npx supabase db push
```

This adds keyword fields to your `posts` table:
- `primary_keyword`
- `secondary_keywords`
- `keyword_data`
- `search_volume`
- `keyword_difficulty`
- `meta_description`

### 2. Verify Environment Variables

Check your `.env` file has:

```bash
# Already configured ✓
DATAFORSEO_USERNAME=will@disruptorsmedia.com
DATAFORSEO_PASSWORD=e1ea5e75ba659fe8
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. Import Dashboard Component

Add to your admin interface or blog management page:

```javascript
import BlogManagementDashboard from '@/components/admin/BlogManagementDashboard';

function AdminPage() {
  return (
    <div className="container mx-auto p-6">
      <BlogManagementDashboard />
    </div>
  );
}
```

## 📝 Generate Your First Blog Post (2 Minutes)

### Step 1: Research Keywords (30 seconds)

1. Click **"Keyword Research"** tab
2. Enter seed keyword: `"hvac marketing"`
3. Click **"Research"** button
4. Wait for results (usually 3-5 seconds)

You'll see 50+ keywords with:
- 📊 Search volume per month
- 🎯 Competition level (Low/Medium/High)
- 💰 CPC (cost per click)
- 📈 Trend indicator (rising/falling/stable)
- ⭐ Opportunity score

### Step 2: Select Keywords (20 seconds)

1. **Sort** by "Opportunity Score" (default)
2. **Click** on 3-5 keywords you like
   - First selection = Primary keyword
   - Others = Secondary keywords
3. Click **"Use X Selected Keywords"** button

### Step 3: Generate Article (1 minute)

1. System navigates to **"Generate Post"** tab
2. Keywords are pre-filled
3. **Add title**: "The Ultimate Guide to HVAC Marketing in 2025"
4. **Add meta description** (optional but recommended)
5. Click **"Generate Article"** button
6. Wait 30-60 seconds for Claude to write
7. **Preview** the generated content
8. Click **"Save Post"** to save

✅ Done! You now have a 1,200+ word SEO-optimized blog post.

## 🎯 What You Get

Each generated article includes:

✅ **1,200-1,500 words** of SEO-optimized content
✅ **Primary keyword** strategically placed
✅ **Secondary keywords** naturally integrated
✅ **Answer Boxes** for featured snippets
✅ **FAQ section** for additional keywords
✅ **Schema markup hints** for rich results
✅ **Brand voice** matching your style

## 📊 Dashboard Tabs Explained

### 1. Keyword Research
- Search for keyword opportunities
- See volume, difficulty, CPC, trends
- Multi-select interface
- Smart opportunity scoring

### 2. Generate Post
- Create new blog posts
- Pre-filled with selected keywords
- AI-powered content generation
- Real-time preview

### 3. Manage Posts
- View all blog posts
- Click "Edit" on any post
- See status, keywords, dates
- Quick access to editing

### 4. Edit Post
- Modify existing content
- Regenerate with AI
- Update keywords and metadata
- Delete posts

## 🎨 Workflow Patterns

### Pattern 1: Research-First (Recommended)

```
Research → Select → Generate → Save → Edit
```

Best for: SEO-focused content, targeting specific keywords

### Pattern 2: Direct Generation

```
Generate (manual keywords) → Save → Edit
```

Best for: Quick content when you already know keywords

### Pattern 3: Edit Existing

```
Manage → Edit → Regenerate → Save
```

Best for: Updating old content, refreshing articles

## 💡 Pro Tips

### Keyword Selection

✅ **Mix difficulty levels**: Select 1-2 low, 1-2 medium competition keywords
✅ **Check trends**: Prioritize "rising" trend keywords
✅ **Consider intent**: Match keywords to your content goal
✅ **Balance volume**: Don't always pick highest volume (high competition)

### Content Generation

✅ **Specific titles**: "How to Generate HVAC Leads" > "HVAC Marketing"
✅ **Add instructions**: Guide Claude with specific requirements
✅ **Use preview**: Always review before saving
✅ **Regenerate freely**: Try different angles until perfect

### Post Management

✅ **Save as draft**: Review before publishing
✅ **Edit metadata**: Optimize meta descriptions for CTR
✅ **Update regularly**: Refresh content with regenerate feature
✅ **Track performance**: Note which keywords work best

## 🔧 Common Tasks

### Add New Keywords to Existing Post

1. **Manage Posts** tab → Click **"Edit"**
2. Update **"Primary Keyword"** field
3. Add to **"Secondary Keywords"** (comma-separated)
4. Click **"Regenerate"** to rewrite with new keywords
5. **Save Changes**

### Regenerate Article with Different Angle

1. **Edit Post** → Scroll to **"Content"** section
2. Click **"Regenerate"** button
3. Wait for new version
4. Compare in **Preview** mode
5. **Save** if satisfied

### Batch Research for Content Calendar

1. **Research** 5-10 different seed keywords
2. **Select** top 3-5 from each search
3. **Screenshot** or note selections
4. **Generate posts** one by one
5. Schedule publishing dates

## 📈 Expected Results

### Keyword Research
- **Speed**: 3-5 seconds per search
- **Results**: 50+ keyword suggestions
- **Data**: Real-time search volume and competition

### Article Generation
- **Speed**: 30-60 seconds per article
- **Length**: 1,200-1,500 words
- **Quality**: SEO-optimized, brand voice
- **Cost**: ~$0.50-1.00 per article (Claude API)

### Database Storage
- **Instant**: Real-time saves to Supabase
- **Metadata**: All keyword data preserved
- **Searchable**: Query by keywords later

## 🚨 Troubleshooting

### "DataForSEO credentials not configured"
→ Check `.env` has `DATAFORSEO_USERNAME` and `DATAFORSEO_PASSWORD`

### "Failed to generate article"
→ Verify `VITE_ANTHROPIC_API_KEY` in `.env`

### "Cannot save post"
→ Run database migration: `npx supabase db push`

### Keywords not showing
→ Check browser console, verify DataForSEO API is responding

## 📚 Full Documentation

See **`docs/KEYWORD_RESEARCH_SYSTEM.md`** for:
- Complete system architecture
- API integration details
- Database schema
- Troubleshooting guide
- Best practices
- Cost breakdown

## 🎓 Next Steps

1. ✅ Generate your first post (follow guide above)
2. 📊 Research 3-5 more keyword topics
3. 📝 Generate 5-10 draft articles
4. ✏️ Edit and customize content
5. 🚀 Publish to your blog
6. 📈 Track keyword performance
7. 🔄 Regenerate underperforming content

## 💰 Cost Estimates

**Per Article:**
- DataForSEO: $0.01-0.03 (keyword research)
- Claude AI: $0.50-1.00 (content generation)
- **Total**: ~$0.51-1.03 per SEO-optimized article

**Monthly (100 articles):**
- DataForSEO: $30-50/month
- Claude AI: $50-100/month
- **Total**: ~$80-150/month

Much cheaper than hiring writers! 🎉

---

**Questions?** See full documentation in `docs/KEYWORD_RESEARCH_SYSTEM.md`

**Last Updated**: January 31, 2025
