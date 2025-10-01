# Admin Nexus - Admin Modules Reference

## Table of Contents

1. [Module Overview](#module-overview)
2. [DashboardOverview](#dashboardoverview)
3. [ContentManagement](#contentmanagement)
4. [TeamManagement](#teammanagement)
5. [MediaLibrary](#medialibrary)
6. [BusinessBrainBuilder](#businessbrainbuilder)
7. [BrandDNABuilder](#branddnabuilder)
8. [AgentBuilder](#agentbuilder)
9. [AgentChat](#agentchat)
10. [WorkflowManager](#workflowmanager)
11. [IntegrationsHub](#integrationshub)
12. [TelemetryDashboard](#telemetrydashboard)
13. [User Workflows](#user-workflows)

---

## Module Overview

Admin Nexus provides **10 core modules** for managing all aspects of the marketing platform. Each module is a React component with dedicated routing, state management, and API integration.

### Module Architecture

```
/admin/secret/
├── overview          → DashboardOverview.jsx
├── content           → ContentManagement.jsx
├── team              → TeamManagement.jsx
├── media             → MediaLibrary.jsx
├── business-brain    → BusinessBrainBuilder.jsx
├── brand-dna         → BrandDNABuilder.jsx
├── agents            → AgentBuilder.jsx
├── agents/:id/chat   → AgentChat.jsx
├── workflows         → WorkflowManager.jsx
├── integrations      → IntegrationsHub.jsx
└── telemetry         → TelemetryDashboard.jsx
```

### Common Module Patterns

All modules share these characteristics:

**State Management**:
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Data Loading**:
```typescript
useEffect(() => {
  loadData();
}, [dependencies]);

const loadData = async () => {
  setLoading(true);
  try {
    const result = await EntityAPI.list();
    setData(result);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

**Loading States**:
```jsx
if (loading) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-green-500 animate-pulse">LOADING...</div>
    </div>
  );
}
```

---

## DashboardOverview

**File**: `src/admin/modules/DashboardOverview.jsx`

**Route**: `/admin/secret/overview`

**Purpose**: Provides high-level system metrics, quick actions, and recent activity.

### Features

1. **System Metrics Dashboard**
   - Total content count (posts, drafts, published)
   - Team member count
   - Media asset count
   - AI agent count
   - Business brain health (total facts, verified percentage)

2. **Quick Actions**
   - Manage Business Brain
   - Configure Agents
   - Generate Content

3. **Recent Activity Feed**
   - Last 10 telemetry events
   - AI invocations
   - Ingestion jobs
   - User actions

### Component Structure

```jsx
export default function DashboardOverview() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    // Load overview stats from multiple tables
    const [postsResult, membersResult, mediaResult, agentsResult, brainResult] =
      await Promise.all([
        supabase.from('posts').select('id, status', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('site_media').select('id', { count: 'exact', head: true }),
        supabase.from('agents').select('id', { count: 'exact', head: true }),
        BusinessBrains.list()
      ]);

    // Get brain health
    const brainHealth = await BusinessBrains.getHealth(brainResult[0].id);

    setStats({
      total_posts: postsResult.count,
      published_posts: publishedPosts.count,
      team_members: membersResult.count,
      media_assets: mediaResult.count,
      ai_agents: agentsResult.count,
      brain_facts: brainHealth.total_facts,
      brain_verified: brainHealth.verified_percentage
    });

    // Load recent activity
    const { data: activity } = await supabase
      .from('telemetry_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    setRecentActivity(activity);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Metric cards */}
      </div>

      {/* Brain Health */}
      <div className="bg-gray-900 border border-green-500/30 p-4">
        {/* Health metrics */}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {/* Action buttons */}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-green-500/30 p-4">
        {/* Activity feed */}
      </div>
    </div>
  );
}
```

### Data Sources

- `posts` table (status, counts)
- `team_members` table (counts)
- `site_media` table (counts)
- `agents` table (counts)
- `business_brains` + `get_brain_health()` RPC
- `telemetry_events` table (recent activity)

### Props

None (top-level module)

### State

```typescript
interface DashboardState {
  stats: {
    total_posts: number;
    published_posts: number;
    draft_posts: number;
    team_members: number;
    media_assets: number;
    ai_agents: number;
    brain_facts: number;
    brain_verified: number;
  };
  recentActivity: TelemetryEvent[];
  loading: boolean;
}
```

---

## ContentManagement

**File**: `src/admin/modules/ContentManagement.jsx`

**Route**: `/admin/secret/content`

**Purpose**: Manage blog posts, workflow states, and AI-generated content.

### Features

1. **Content List View**
   - All posts from `posts_with_authors` view
   - Filter by status (draft, review, published, archived, scheduled)
   - Author attribution (team member or AI agent)
   - Word count and reading time
   - Status change dropdown

2. **AI Content Generation**
   - Generate new posts with AI agents
   - Topic/keyword input
   - Agent selection
   - Brain fact integration
   - Brand DNA enforcement

3. **Post Management**
   - Edit post (link to editor)
   - Change status (draft → review → published)
   - Schedule publication
   - Delete post
   - View on public site

### Component Structure

```jsx
export default function ContentManagement() {
  const [posts, setPosts] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showGenerator, setShowGenerator] = useState(false);

  const loadData = async () => {
    // Load posts with author details using view
    let query = supabase
      .from('posts_with_authors')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedStatus !== 'all') {
      query = query.eq('status', selectedStatus);
    }

    const { data: postsData } = await query;
    setPosts(postsData);

    // Load agents for generation
    const agentsData = await Agents.list();
    setAgents(agentsData);
  };

  const handleStatusChange = async (postId, newStatus) => {
    const updates = { status: newStatus };

    if (newStatus === 'published') {
      updates.published_at = new Date().toISOString();
    }

    await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId);

    await loadData();
  };

  const handleDelete = async (postId) => {
    if (!confirm('Delete this post?')) return;

    await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    await loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header with Generate button */}

      {/* Status filters */}
      <div className="flex gap-2">
        {statuses.map(status => (
          <button onClick={() => setSelectedStatus(status.value)}>
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Posts table */}
      <table className="w-full">
        <thead>
          <tr>
            <th>TITLE</th>
            <th>AUTHOR</th>
            <th>STATUS</th>
            <th>DATE</th>
            <th>TYPE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>
                {post.title}
                <div>{post.word_count} words · {post.reading_time_minutes} min</div>
              </td>
              <td>
                {post.agent_name ? (
                  <><Bot /> {post.agent_name}</>
                ) : (
                  <><User /> {post.author_name}</>
                )}
              </td>
              <td>
                <select
                  value={post.status}
                  onChange={(e) => handleStatusChange(post.id, e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </td>
              <td>{post.published_at || post.created_at}</td>
              <td>{post.agent_id ? 'AI Generated' : 'Manual'}</td>
              <td>
                <button onClick={() => window.open(`/blog/${post.slug}`)}>
                  <Eye />
                </button>
                <button onClick={() => handleEdit(post.id)}>
                  <Edit />
                </button>
                <button onClick={() => handleDelete(post.id)}>
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AI Generator Modal */}
      {showGenerator && (
        <AIGeneratorModal
          agents={agents}
          onGenerate={handleGenerateContent}
          onClose={() => setShowGenerator(false)}
        />
      )}
    </div>
  );
}
```

### Data Sources

- `posts_with_authors` view (posts + author + agent)
- `agents` table (for generation)
- `team_members` table (authors)

### User Workflows

#### View and Filter Posts
1. Navigate to Content Management
2. See all posts by default
3. Click status filter (Draft, Review, Published, etc.)
4. View filtered posts

#### Change Post Status
1. Find post in list
2. Click status dropdown
3. Select new status
4. Status updates immediately
5. If changed to "Published", `published_at` is set

#### Generate Content with AI
1. Click "GENERATE_WITH_AI" button
2. Modal appears
3. Enter topic or keywords
4. Select AI agent
5. Click "Generate"
6. Wait for generation (30-60 seconds)
7. New post appears in drafts with:
   - AI-generated title
   - Full content
   - SEO metadata
   - `agent_id` set
   - `brain_snapshot` cached
   - `word_count` calculated

#### Delete Post
1. Find post in list
2. Click delete icon
3. Confirm deletion
4. Post removed from database

---

## TeamManagement

**File**: `src/admin/modules/TeamManagement.jsx`

**Route**: `/admin/secret/team`

**Purpose**: Manage team members, content permissions, and usage statistics.

### Features

1. **Team Member Directory**
   - All team members from `team_members` table
   - Profile photos, names, roles
   - Email addresses
   - Content creation permissions

2. **Content Permissions**
   - Toggle `can_write_content` flag
   - Assign default AI agent
   - Set fine-grained permissions (can_publish, can_delete, categories)
   - Usage quotas (posts per month)

3. **Content Statistics**
   - Posts created per member (via `get_team_member_stats()` RPC)
   - Published vs draft counts
   - Total word count
   - Average reading time

4. **Agent Assignments**
   - Link team members to authorized agents
   - Track agent usage per member
   - Enforce usage quotas

### Component Structure

```jsx
export default function TeamManagement() {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({});

  const loadMembers = async () => {
    // Load team members
    const { data: membersData } = await supabase
      .from('team_members')
      .select('*')
      .order('name');

    // Load content stats for each member
    const membersWithStats = await Promise.all(
      membersData.map(async (member) => {
        const statsData = await supabase
          .rpc('get_team_member_stats', { member_id: member.id });

        return {
          ...member,
          stats: statsData || {
            total_posts: 0,
            published_posts: 0,
            draft_posts: 0,
            total_words: 0,
            avg_reading_time: 0
          }
        };
      })
    );

    setMembers(membersWithStats);

    // Calculate overall stats
    const totalStats = membersWithStats.reduce((acc, member) => ({
      total_members: acc.total_members + 1,
      content_creators: acc.content_creators + (member.can_write_content ? 1 : 0),
      total_posts: acc.total_posts + member.stats.total_posts,
      total_words: acc.total_words + member.stats.total_words
    }), { total_members: 0, content_creators: 0, total_posts: 0, total_words: 0 });

    setStats(totalStats);
  };

  const toggleContentPermission = async (memberId, currentValue) => {
    await supabase
      .from('team_members')
      .update({ can_write_content: !currentValue })
      .eq('id', memberId);

    await loadMembers();
  };

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <div>TOTAL_MEMBERS: {stats.total_members}</div>
        <div>CONTENT_CREATORS: {stats.content_creators}</div>
        <div>TOTAL_POSTS: {stats.total_posts}</div>
        <div>TOTAL_WORDS: {stats.total_words}</div>
      </div>

      {/* Team Members Table */}
      <table className="w-full">
        <thead>
          <tr>
            <th>MEMBER</th>
            <th>ROLE</th>
            <th>CONTENT_RIGHTS</th>
            <th>POSTS</th>
            <th>WORDS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id}>
              <td>
                <img src={member.image} />
                <div>
                  {member.name}
                  <div>{member.email}</div>
                </div>
              </td>
              <td>{member.role}</td>
              <td>
                <button onClick={() => toggleContentPermission(member.id, member.can_write_content)}>
                  {member.can_write_content ? (
                    <><CheckCircle /> Enabled</>
                  ) : (
                    <><XCircle /> Disabled</>
                  )}
                </button>
              </td>
              <td>
                {member.stats.published_posts}/{member.stats.total_posts} published
              </td>
              <td>{member.stats.total_words.toLocaleString()}</td>
              <td>
                <button><Edit /> Edit</button>
                <button><Shield /> Assign Agents</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Data Sources

- `team_members` table (profiles, permissions)
- `get_team_member_stats()` RPC (content statistics)
- `posts` table (via RPC, filtered by author)

### User Workflows

#### Grant Content Creation Permission
1. Navigate to Team Management
2. Find team member
3. Click "CONTENT_RIGHTS" toggle
4. Permission updates from Disabled → Enabled
5. Member can now access content tools

#### View Team Member Statistics
1. Navigate to Team Management
2. View stats dashboard (total members, creators, posts, words)
3. View per-member stats in table
4. See published vs draft post counts
5. See total word count per member

---

## MediaLibrary

**File**: `src/admin/modules/MediaLibrary.jsx`

**Route**: `/admin/secret/media`

**Purpose**: Manage media assets with AI generation capabilities.

### Features

1. **Media Asset Grid**
   - Thumbnail view of all media
   - Image, video, file type indicators
   - AI-generated badge
   - Tags and metadata

2. **Filtering & Search**
   - Filter by type (images, videos, all)
   - Filter by source (AI-generated, manual upload)
   - Search by alt text, caption, tags
   - Full-text search

3. **AI Media Generation**
   - Generate images with AI (OpenAI, Gemini, Replicate)
   - Prompt-based generation
   - Brand-consistent outputs
   - Metadata tracking (model, cost, parameters)

4. **Media Management**
   - View full-size media
   - Edit alt text and captions
   - Add/remove tags
   - Track usage in posts
   - Delete media

### Component Structure

```jsx
export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, image, video
  const [filterAI, setFilterAI] = useState('all'); // all, ai, manual

  const loadMedia = async () => {
    let query = supabase
      .from('media_with_generation') // View with agent/workflow details
      .select('*')
      .order('created_at', { ascending: false });

    if (filterType !== 'all') {
      query = query.eq('type', filterType);
    }

    if (filterAI === 'ai') {
      query = query.eq('ai_generated', true);
    } else if (filterAI === 'manual') {
      query = query.eq('ai_generated', false);
    }

    const { data } = await query;
    setMedia(data);
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadMedia();
      return;
    }

    const { data } = await supabase
      .from('media_with_generation')
      .select('*')
      .or(`alt_text.ilike.%${searchQuery}%,caption.ilike.%${searchQuery}%`)
      .order('created_at', { ascending: false });

    setMedia(data);
  };

  const stats = {
    total: media.length,
    ai_generated: media.filter(m => m.ai_generated).length,
    images: media.filter(m => m.type?.includes('image')).length,
    videos: media.filter(m => m.type?.includes('video')).length
  };

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <div>TOTAL_ASSETS: {stats.total}</div>
        <div>AI_GENERATED: {stats.ai_generated}</div>
        <div>IMAGES: {stats.images}</div>
        <div>VIDEOS: {stats.videos}</div>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4">
        <div className="flex gap-2">
          <button onClick={() => setFilterType('all')}>All Types</button>
          <button onClick={() => setFilterType('image')}>Images</button>
          <button onClick={() => setFilterType('video')}>Videos</button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setFilterAI('all')}>All Sources</button>
          <button onClick={() => setFilterAI('ai')}>AI Generated</button>
          <button onClick={() => setFilterAI('manual')}>Manual Upload</button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by alt text, caption, tags..."
        />
        <button onClick={handleSearch}><Search /></button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-4 gap-4">
        {media.map(item => (
          <div key={item.id} className="group">
            {/* Thumbnail */}
            <div className="aspect-square">
              {item.type?.includes('image') ? (
                <img src={item.url} alt={item.alt_text} />
              ) : (
                <div><File /></div>
              )}

              {/* AI Badge */}
              {item.ai_generated && (
                <div className="badge"><Bot /> AI</div>
              )}

              {/* Hover overlay */}
              <div className="hover-overlay">
                <button onClick={() => window.open(item.url)}>VIEW</button>
              </div>
            </div>

            {/* Info */}
            <div>
              <div>{item.alt_text || item.caption || 'Untitled'}</div>

              {/* Tags */}
              {item.tags?.map(tag => (
                <span key={tag}>{tag}</span>
              ))}

              {/* Generation info */}
              {item.agent_name && (
                <div>Generated by: {item.agent_name}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Data Sources

- `media_with_generation` view (site_media + agents + workflows)
- `site_media` table (raw media data)

### User Workflows

#### Browse Media Assets
1. Navigate to Media Library
2. View grid of all media
3. See thumbnails, AI badges, tags
4. Hover to see "VIEW" button

#### Filter Media
1. Click type filter (Images, Videos, All)
2. Click source filter (AI, Manual, All)
3. View filtered results
4. Filters can be combined

#### Search Media
1. Enter search query in input
2. Press Enter or click Search button
3. Searches alt text, caption, tags
4. View matching results

#### Generate Media with AI
1. Click "GENERATE_WITH_AI" button
2. Modal appears
3. Enter prompt (e.g., "modern plumbing website hero image")
4. Select provider (OpenAI, Gemini, Replicate)
5. Select model
6. Adjust parameters (size, quality, etc.)
7. Click "Generate"
8. Wait for generation (10-30 seconds)
9. New media appears with:
   - `ai_generated = true`
   - `generation_prompt` set
   - `generation_metadata` with model, cost, etc.
   - Agent/workflow attribution

---

## BusinessBrainBuilder

**File**: `src/admin/modules/BusinessBrainBuilder.jsx`

**Route**: `/admin/secret/business-brain`

**Purpose**: Manage business knowledge base (facts, sources, ingestion).

### Features

1. **Brain Health Dashboard**
   - Total facts count
   - Verified percentage
   - Average confidence score
   - Stale facts count (>30 days unverified)
   - Last ingestion timestamp

2. **Fact Explorer**
   - List all facts
   - Full-text search
   - View fact details (key, value, source, confidence)
   - Edit facts
   - Delete facts
   - Add manual facts

3. **Knowledge Sources**
   - Add URL sources
   - Add sitemap sources (with include/exclude patterns)
   - Add RSS feed sources
   - Trigger manual ingestion
   - View ingestion status
   - Schedule automatic ingestion (future)

4. **Ingestion Jobs**
   - View active and completed jobs
   - Real-time progress tracking
   - Job logs
   - Facts added/updated counts
   - Error messages and retry options

### Component Structure

```jsx
export default function BusinessBrainBuilder() {
  const [brain, setBrain] = useState(null);
  const [facts, setFacts] = useState([]);
  const [sources, setSources] = useState([]);
  const [health, setHealth] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadBrain = async () => {
    const brains = await BusinessBrains.list();
    const defaultBrain = brains.find(b => b.slug === 'default') || brains[0];

    if (defaultBrain) {
      setBrain(defaultBrain);
      await Promise.all([
        loadFacts(defaultBrain.id),
        loadSources(defaultBrain.id),
        loadHealth(defaultBrain.id)
      ]);
    }
  };

  const loadFacts = async (brainId) => {
    const data = await BrainFacts.list(brainId);
    setFacts(data);
  };

  const loadSources = async (brainId) => {
    const data = await KnowledgeSources.list(brainId);
    setSources(data);
  };

  const loadHealth = async (brainId) => {
    const data = await BusinessBrains.getHealth(brainId);
    setHealth(data);
  };

  const handleSearch = async () => {
    if (!brain || !searchQuery) return;

    const results = await BrainFacts.search(brain.id, searchQuery);
    setFacts(results.results || []);
  };

  const handleIngest = async (sourceId) => {
    if (!brain) return;

    await Ingest.dispatch({ brainId: brain.id, sourceId });
    alert('Ingestion started! Check back in a few minutes.');
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}

      {/* Health Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <div>TOTAL_FACTS: {health.total_facts}</div>
        <div>VERIFIED: {health.verified_percentage}%</div>
        <div>AVG_CONFIDENCE: {health.avg_confidence}</div>
        <div>STALE_FACTS: {health.stale_facts}</div>
      </div>

      {/* Knowledge Sources */}
      <div>
        <h2>KNOWLEDGE_SOURCES</h2>
        <button>ADD_SOURCE</button>

        {sources.map(source => (
          <div key={source.id}>
            <div>{source.config?.url || 'Manual'}</div>
            <div>
              {source.type.toUpperCase()} •
              Last: {source.last_ingested_at ? new Date(source.last_ingested_at).toLocaleDateString() : 'Never'}
            </div>
            <button onClick={() => handleIngest(source.id)}>INGEST</button>
          </div>
        ))}
      </div>

      {/* Fact Explorer */}
      <div>
        <h2>FACT_EXPLORER</h2>

        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search facts..."
          />
          <button onClick={handleSearch}><Search /></button>
        </div>

        {/* Facts List */}
        {facts.map(fact => (
          <div key={fact.id}>
            <div>{fact.key}</div>
            <div>{typeof fact.value === 'object' ? JSON.stringify(fact.value) : String(fact.value)}</div>
            {fact.source && <div>Source: {fact.source}</div>}
            {fact.last_verified_at && <Check />}
            <div>{fact.confidence ? (fact.confidence * 100).toFixed(0) + '%' : 'N/A'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Data Sources

- `business_brains` table
- `brain_facts` table
- `knowledge_sources` table
- `get_brain_health()` RPC
- `search_brain_facts()` RPC

### User Workflows

#### View Brain Health
1. Navigate to Business Brain Builder
2. View health dashboard
3. See total facts, verified %, confidence, stale facts
4. Click "REFRESH" to reload latest data

#### Search Facts
1. Enter search query
2. Press Enter or click Search
3. View matching facts (FTS results)
4. Facts ranked by relevance

#### Add Manual Fact
1. Click "Add Fact" button
2. Enter key (snake_case, e.g., "service_pricing")
3. Enter value (string or JSON object)
4. Select source ("manual")
5. Set confidence (0.0-1.0)
6. Click "Save Fact"
7. Fact appears in list
8. Brain health updates

#### Add Knowledge Source
1. Click "ADD_SOURCE" button
2. Select type (URL, Sitemap, Feed)
3. Enter configuration:
   - **URL**: Single URL
   - **Sitemap**: URL, include patterns, exclude patterns, max pages
   - **Feed**: RSS/Atom URL, poll interval
4. Click "Add"
5. Source appears in list with status "idle"

#### Trigger Ingestion
1. Find knowledge source in list
2. Click "INGEST" button
3. Ingestion job created
4. Background function processes:
   - Fetches URL(s)
   - Extracts content
   - Calls LLM for fact extraction
   - Deduplicates facts
   - Saves to database
5. Progress updates in real-time
6. Facts added count increments
7. Source `last_ingested_at` updated

---

## BrandDNABuilder

**File**: `src/admin/modules/BrandDNABuilder.jsx`

**Route**: `/admin/secret/brand-dna`

**Purpose**: Define and manage brand voice, tone, style, lexicon for AI consistency.

### Features

1. **Brand Rule Management**
   - Voice rules (characteristics, examples, avoid)
   - Tone rules (professional, friendly, authoritative, casual)
   - Style rules (formatting, structure, patterns)
   - Lexicon rules (preferred terms, forbidden words)
   - Example rules (good vs bad examples)
   - Taboo rules (topics/phrases to avoid)

2. **Rule Editor**
   - JSON editor for rule content
   - Syntax validation
   - Preview rendering
   - Version history (future)

3. **Brand Enforcement**
   - Apply rules to all AI outputs
   - Automatic injection into agent prompts
   - Training integration

### User Workflows

#### Add Voice Rules
1. Navigate to Brand DNA Builder
2. Click "Add Rule"
3. Select type: "voice"
4. Enter content (JSON):
   ```json
   {
     "characteristics": ["bold", "contrarian", "no-fluff", "direct"],
     "examples": [
       "We don't do corporate BS. Just results.",
       "Your competitors are sleeping. We're not."
     ],
     "avoid": ["corporate jargon", "buzzwords", "excessive politeness"]
   }
   ```
5. Click "Save"
6. Rule automatically applied to all agents

#### Add Lexicon Rules
1. Click "Add Rule"
2. Select type: "lexicon"
3. Enter content:
   ```json
   {
     "preferred_terms": {
       "skilled trades": ["plumbers", "electricians", "contractors"],
       "client": ["never 'customer'"]
     },
     "forbidden_words": ["cheap", "discount", "affordable", "budget"]
   }
   ```
4. Save
5. AI agents avoid forbidden words, use preferred terms

---

## AgentBuilder

**File**: `src/admin/modules/AgentBuilder.jsx`

**Route**: `/admin/secret/agents`

**Purpose**: Create, configure, and train AI agents.

### Features

1. **Agent List**
   - All configured agents
   - Status (active, inactive, archived)
   - Last used timestamp
   - Performance metrics

2. **Agent Configuration**
   - Name and description
   - System prompt editor (full-text)
   - LLM provider selection (Anthropic, OpenAI)
   - Model selection
   - Temperature (0.0-1.0)
   - Max tokens
   - Context settings (max facts to retrieve)
   - Brand DNA toggle

3. **Agent Training**
   - Add training examples (input/expected output)
   - Collect feedback (thumbs up/down)
   - Trigger training runs
   - View training history
   - Compare prompt versions

4. **Testing Interface**
   - Quick test chat
   - Preview responses
   - Measure latency
   - Token usage

### User Workflows

#### Create New Agent
1. Navigate to Agents
2. Click "Create Agent"
3. Enter name (e.g., "Customer Support Agent")
4. Write system prompt:
   ```
   You are a helpful customer support agent for Disruptors & Co.
   Use the provided brain facts to answer questions accurately.
   Maintain a professional yet friendly tone.
   ```
5. Select provider: Anthropic
6. Select model: claude-sonnet-4.5
7. Set temperature: 0.7
8. Set max tokens: 2000
9. Click "Save Agent"
10. Agent status: active

#### Train Agent
1. Find agent in list
2. Click "Train" button
3. View training tab
4. Add training examples:
   - Input: "What services do you offer?"
   - Expected: "We offer web design, SEO, social media marketing..."
5. Add 5-10 examples
6. Click "Train Agent"
7. Background function runs:
   - Collects examples
   - Aggregates feedback
   - Calls LLM to improve prompt
   - Applies brand rules
   - Updates system_prompt
8. Training complete notification
9. Test agent to verify improvement

---

## AgentChat

**File**: `src/admin/modules/AgentChat.jsx`

**Route**: `/admin/secret/agents/:agentId/chat`

**Purpose**: Interactive chat interface with AI agents using business brain context.

### Features

1. **Chat Interface**
   - Message history (user + assistant)
   - Real-time streaming (future)
   - Loading indicators
   - Error handling

2. **Context Display**
   - Brain facts used in response
   - Confidence scores
   - Source attribution

3. **Feedback**
   - Thumbs up/down on responses
   - Comment field
   - Training data collection

4. **Message Actions**
   - Copy message
   - Regenerate response
   - View raw data

### Component Structure

```jsx
export default function AgentChat() {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);
  const [brain, setBrain] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadAgent();
    loadBrain();
  }, [agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadAgent = async () => {
    const data = await Agents.get(agentId);
    setAgent(data);
  };

  const loadBrain = async () => {
    const brains = await BusinessBrains.list();
    const defaultBrain = brains.find(b => b.slug === 'default') || brains[0];
    setBrain(defaultBrain);
  };

  const handleSend = async () => {
    if (!input.trim() || !agent || !brain) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await Agents.invoke({
        agentId: agent.id,
        brainId: brain.id,
        messages: [...messages, userMessage]
      });

      setMessages(prev => [...prev, response.message]);
      setConversationId(response.conversationId);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `ERROR: ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (messageId, rating) => {
    if (!agent || !conversationId) return;

    await Agents.feedback({
      agentId: agent.id,
      conversationId,
      messageId,
      rating
    });
    alert('Feedback submitted!');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div>
        <h1>{agent?.name || 'Loading...'}</h1>
        {brain && <p>Brain: {brain.name}</p>}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div>Start a conversation...</div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'user-message' : 'assistant-message'}>
            <div>{msg.role === 'user' ? 'YOU' : agent?.name?.toUpperCase()}</div>
            <div>{msg.content}</div>

            {msg.role === 'assistant' && (
              <div>
                <button onClick={() => handleFeedback(msg.id, 5)}>
                  <ThumbsUp />
                </button>
                <button onClick={() => handleFeedback(msg.id, 1)}>
                  <ThumbsDown />
                </button>
              </div>
            )}
          </div>
        ))}

        {loading && <div>Thinking...</div>}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          <Send /> SEND
        </button>
      </div>
    </div>
  );
}
```

### User Workflows

#### Start Conversation
1. Navigate to Agents
2. Click agent row or "Chat" button
3. Agent chat interface loads
4. See agent name and brain in header
5. Type message
6. Press Enter or click "SEND"
7. Loading indicator appears
8. Wait 2-5 seconds
9. Assistant response appears
10. Conversation saved

#### Provide Feedback
1. After receiving assistant response
2. Click thumbs up (good) or thumbs down (bad)
3. Optional: Add comment explaining feedback
4. Feedback saved to `agent_feedback` table
5. Used for future training

---

## WorkflowManager

**File**: `src/admin/modules/WorkflowManager.jsx`

**Route**: `/admin/secret/workflows`

**Purpose**: Automate recurring tasks and background jobs.

### Features

1. **Workflow List**
   - All workflows
   - Enabled/disabled status
   - Last run timestamp
   - Success rate

2. **Workflow Builder**
   - Define workflow steps (JSON spec)
   - Configure triggers (schedule, event, manual)
   - Set retry logic
   - Error handling

3. **Workflow Runs**
   - Execution history
   - Logs and progress
   - Metrics (duration, resources used)

**Note**: This module is partially implemented. Full workflow automation is planned for Phase 4.

---

## IntegrationsHub

**File**: `src/admin/modules/IntegrationsHub.jsx`

**Route**: `/admin/secret/integrations`

**Purpose**: Manage OAuth connections to external services.

### Features

1. **Integration Cards**
   - Google Analytics 4
   - Google Search Console
   - Meta Business Suite
   - HubSpot
   - Mailchimp
   - Zapier

2. **Connection Management**
   - OAuth flow initiation
   - Token refresh
   - Disconnect
   - View permissions

**Note**: This module is a stub. OAuth integrations are planned for Phase 4.

---

## TelemetryDashboard

**File**: `src/admin/modules/TelemetryDashboard.jsx`

**Route**: `/admin/secret/telemetry`

**Purpose**: Monitor system health, usage, and errors.

### Features

1. **Event Stream**
   - Real-time event feed
   - Filter by area (agents, ingest, ui, errors)
   - Search events

2. **Metrics Dashboard**
   - AI invocations count
   - Token usage
   - Average response time
   - Error rate

3. **Usage Analytics**
   - Most active agents
   - Content generation stats
   - User activity

**Data Sources**: `telemetry_events` table

---

## User Workflows

### Complete Content Creation Workflow

**Goal**: Generate a blog post using AI with brand consistency

1. **Prepare Business Brain**
   - Add facts about services, pricing, target audience
   - Trigger sitemap ingestion for latest company info
   - Verify brain health (100+ facts, 80%+ verified)

2. **Configure Brand DNA**
   - Set voice rules (bold, contrarian, no-fluff)
   - Set lexicon (preferred: "skilled trades", forbidden: "cheap")
   - Add good/bad examples

3. **Configure Agent**
   - Create "Content Writer" agent
   - Link to business brain
   - Set temperature: 0.7 (creative but controlled)
   - Enable brand DNA enforcement

4. **Generate Content**
   - Go to Content Management
   - Click "GENERATE_WITH_AI"
   - Enter topic: "Why Plumbers Need Local SEO"
   - Select agent: "Content Writer"
   - Click "Generate"
   - Wait 30-60 seconds

5. **Review Generated Post**
   - Post appears in drafts
   - Review title, content, SEO metadata
   - Check brand voice consistency
   - Verify fact accuracy (brain_snapshot shows facts used)

6. **Edit and Publish**
   - Make manual edits if needed
   - Change status: draft → review
   - Get team approval
   - Change status: review → published
   - `published_at` timestamp set
   - Post goes live on public site

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-01
**Author**: Claude Code (Anthropic)
**Project**: Disruptors AI Marketing Hub - Admin Nexus Module Reference
