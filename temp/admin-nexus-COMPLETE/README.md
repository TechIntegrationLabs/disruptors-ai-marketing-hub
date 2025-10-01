# Admin Nexus - Complete Implementation Package

**Production-ready admin panel for Disruptors AI Marketing Hub**

This package contains everything needed to integrate the Admin Nexus system into your existing React application, including:
- ✅ Complete database schema with RPCs and seed data
- ✅ Production-ready Netlify Functions (AI, scraping, training)
- ✅ Full authentication system with JWT claims
- ✅ React admin components with Matrix-style UI
- ✅ Real LLM integration (Anthropic Claude + OpenAI)
- ✅ Web scraping and fact extraction pipeline
- ✅ Comprehensive documentation and roadmap

---

## 📦 What's Included

```
admin-nexus-COMPLETE/
├── DB/
│   └── migrations/
│       └── 001_init_enhanced.sql        # Complete schema + RPCs + seed
├── netlify/
│   ├── functions/                       # Production Netlify Functions
│   │   ├── ai_invoke.ts                 # Real LLM with context
│   │   ├── agent_train-background.ts    # Prompt improvement
│   │   ├── ingest_dispatch-background.ts# Web scraping + facts
│   │   └── [8 more functions...]
│   ├── edge-functions/
│   │   └── set-admin-role.ts            # JWT claim setter
│   └── lib/
│       ├── llm.ts                       # Unified LLM interface
│       ├── scraper.ts                   # Web scraping
│       ├── fact-extractor.ts            # AI fact extraction
│       └── supabase.ts                  # DB client
├── src/
│   ├── admin/
│   │   ├── AdminShell.jsx               # Main admin container
│   │   ├── routes.jsx                   # Internal routing
│   │   ├── auth/
│   │   │   ├── AdminLogin.jsx           # Matrix-style login
│   │   │   └── ProtectedRoute.jsx       # Auth guard
│   │   └── modules/
│   │       ├── BusinessBrainBuilder.jsx # Brain management
│   │       ├── AgentChat.jsx            # Chat interface
│   │       └── [6 more modules...]
│   ├── api/
│   │   ├── auth.ts                      # Auth utilities
│   │   ├── client.ts                    # API client
│   │   └── entities.ts                  # Entity wrappers
│   └── integration/
│       └── admin-router-integration.jsx # Routing integration
├── docs/
│   ├── IMPLEMENTATION_ROADMAP.md        # 4-phase roadmap
│   ├── AUTH_SETUP_GUIDE.md              # Complete auth guide
│   └── [More docs...]
├── scripts/
│   └── setup-admin-user.js              # Admin user setup
├── .env.example                         # Environment template
├── package.json                         # Dependencies
└── README.md                            # This file
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @anthropic-ai/sdk openai react-router-dom lucide-react jsdom @mozilla/readability
```

### 2. Apply Database Schema

In Supabase SQL Editor, run:
```bash
DB/migrations/001_init_enhanced.sql
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your keys
```

Required variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
VITE_ANTHROPIC_API_KEY=...
ADMIN_SECRET_KEY=...
```

### 4. Deploy Functions

Copy `netlify/functions/*` to your project's `netlify/functions/` directory.

### 5. Create Admin User

```bash
node scripts/setup-admin-user.js admin@disruptors.co YourPassword123!
```

### 6. Integrate Routing

In your `src/pages/index.jsx`:

```javascript
import { AdminPanelRoute } from '../integration/admin-router-integration'

// Add to your routing logic:
if (pathname.startsWith('/admin/secret')) {
  return <AdminPanelRoute />
}
```

### 7. Test

Visit: `http://localhost:5173/admin/secret`

Should see Matrix-style login screen!

---

## 📚 Documentation

- **[Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)** - 4-phase implementation plan
- **[Auth Setup Guide](docs/AUTH_SETUP_GUIDE.md)** - Complete authentication setup
- **[Environment Variables](#environment-variables)** - Configuration reference

---

## 🏗️ Architecture

### Backend (Netlify Functions + Supabase)

```
[React Admin UI]
       ↓
[Netlify Functions] → [Supabase PostgreSQL]
       ↓                     ↓
[LLM APIs]              [RLS Policies]
 └─ Claude Sonnet        └─ Admin-only
 └─ OpenAI
```

### Frontend (React + React Router)

```
/admin/secret → AdminShell
              ├─ /overview → DashboardOverview
              ├─ /business-brain → BusinessBrainBuilder
              ├─ /brand-dna → BrandDNABuilder
              ├─ /agents → AgentBuilder
              ├─ /agents/:id/chat → AgentChat
              ├─ /workflows → WorkflowManager
              ├─ /integrations → IntegrationsHub
              └─ /telemetry → TelemetryDashboard
```

### Data Flow

```
1. User chats with agent
2. Frontend calls ai_invoke function
3. Function retrieves brain facts (FTS)
4. Composes prompt with context + brand DNA
5. Calls LLM (Claude/OpenAI)
6. Saves message to conversations table
7. Returns response to UI
```

---

## 🔐 Security

### RLS Policies

All tables protected with Row Level Security:

```sql
create policy admin_all_access on table_name
  for all using (
    (current_setting('request.jwt.claims', true)::jsonb->>'role') = 'admin'
  )
```

### JWT Claims

Admin role stored in JWT `app_metadata`:

```javascript
{
  role: 'admin',
  email: 'admin@disruptors.co',
  ...
}
```

### Secret Access Patterns

- **5 logo clicks in 3 seconds** → Grant temp access
- **Ctrl+Shift+D** → Immediate access
- **Ctrl+Shift+Escape** → Emergency exit

---

## 🎯 Key Features

### Business Brain
- Manual fact entry
- Automated web scraping
- Full-text search (FTS)
- Optional semantic search (pgvector)
- Health metrics dashboard

### AI Agents
- Chat with context from brain
- Prompt improvement training
- Feedback loop (thumbs up/down)
- Multiple LLM providers

### Ingestion Pipeline
- URL/sitemap scraping
- Content extraction (Readability)
- AI fact extraction
- Deduplication
- Real-time progress updates

### Brand DNA
- Style/voice/tone rules
- Lexicon management
- Integration with agent training

---

## 📋 Implementation Phases

| Phase | Duration | Milestone |
|-------|----------|-----------|
| **Phase 0** | 2-3 days | Admin login working |
| **Phase 1** | 3-5 days | Chat with context working |
| **Phase 2** | 5-7 days | Auto-ingestion working |
| **Phase 3** | 7-10 days | All modules complete |
| **Phase 4** | Ongoing | Enhancements |

**Total:** 3-4 weeks for core functionality

See [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md) for details.

---

## 🔧 Configuration

### Environment Variables

#### Required
```env
VITE_SUPABASE_URL              # Your Supabase project URL
VITE_SUPABASE_ANON_KEY         # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY      # Supabase service role key (server-side only)
VITE_ANTHROPIC_API_KEY         # Claude API key
ADMIN_SECRET_KEY               # Secret for admin role assignment
```

#### Optional
```env
VITE_OPENAI_API_KEY            # OpenAI API key (if using GPT models)
ADMIN_EMAILS                   # Comma-separated admin emails
```

### Netlify Configuration

In Netlify Dashboard → Site Settings → Environment Variables, add:
- All variables from `.env`
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is server-side only

---

## 🐛 Troubleshooting

### "User is not authorized as admin"
**Solution:** Run `setup-admin-user.js` script or manually set `app_metadata.role = 'admin'` in Supabase dashboard.

### "Missing Supabase environment variables"
**Solution:** Verify all `VITE_SUPABASE_*` and `SUPABASE_SERVICE_ROLE_KEY` are set.

### Functions timing out
**Solution:** Netlify background functions have 15-minute limit. For larger jobs, use Supabase Queues (Phase 4).

### RLS policy violations
**Solution:** Check JWT has `role: 'admin'` claim. Refresh session: `supabase.auth.refreshSession()`

---

## 🚢 Deployment

### Netlify
1. Push to git
2. Functions auto-deploy from `netlify/functions/`
3. Set environment variables in dashboard
4. Deploy triggers on push to `main`

### Supabase
1. Schema already deployed (Phase 0)
2. Edge Functions deployed manually via CLI
3. Auth configured in dashboard

---

## 📊 Monitoring

### Telemetry Dashboard
All admin actions logged to `telemetry_events`:
- AI invocations
- Ingestion jobs
- Training runs
- User actions

### Health Checks
```javascript
const health = await BusinessBrains.getHealth(brainId)
// Returns: total_facts, verified_percentage, avg_confidence, stale_facts
```

---

## 🎨 Customization

### Theme
Matrix-style green-on-black theme. Customize in components:
- `text-green-500` → your color
- `bg-black` → your background
- `border-green-500/30` → your border

### Branding
Update in `AdminShell.jsx`:
```jsx
<h1>ADMIN_NEXUS</h1> // Change to YOUR_ADMIN
```

---

## 📞 Support

**Issues?**
1. Check [Troubleshooting](#troubleshooting)
2. Review [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)
3. Contact: dev@disruptors.co

---

## 📝 License

Proprietary - Disruptors & Co © 2025

---

## ✅ Pre-Flight Checklist

Before starting implementation:

- [ ] Supabase project created
- [ ] Netlify site configured
- [ ] All API keys obtained
- [ ] Dependencies installed
- [ ] `.env` configured
- [ ] Database schema reviewed
- [ ] Implementation roadmap read
- [ ] Auth setup guide reviewed

**Ready?** Start with Phase 0 → Database Setup!

---

**Built with ❤️ by Disruptors & Co**
