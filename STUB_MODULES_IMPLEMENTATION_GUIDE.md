# Stub Modules Implementation Guide

**Status:** Database ✅ Ready | Code 🟡 Stub Placeholders
**Goal:** Implement the 5 remaining admin modules

---

## Current Status Overview

### ✅ Fully Functional (6 Modules)
1. **Dashboard Overview** - System stats, activity feed, health metrics
2. **Content Management** - Post editor with AI generation
3. **Team Management** - Member administration
4. **Media Library** - Asset catalog with AI tracking
5. **Business Brain Builder** - Knowledge base management
6. **Agent Chat** - Interactive AI conversations

### 🟡 Stub Placeholders (5 Modules)
7. **Agent Builder** - Create/manage AI agents
8. **Brand DNA Builder** - Brand voice configuration
9. **Workflow Manager** - Automation pipelines
10. **Integrations Hub** - Third-party services
11. **Telemetry Dashboard** - System monitoring

---

## What's Already Done for Stub Modules

### ✅ Database Schema (100% Complete)
All database tables, indexes, and relationships are already created:

**Agent Builder Tables:**
- ✅ `agents` - Agent definitions with prompts
- ✅ `agent_training_examples` - Positive/negative examples
- ✅ `agent_runs` - Training/evaluation history
- ✅ `agent_feedback` - User feedback (thumbs up/down)

**Brand DNA Builder Tables:**
- ✅ `brand_rules` - Voice, tone, style guidelines
- ✅ `business_brains` - Can store brand DNA

**Workflow Manager Tables:**
- ✅ `workflows` - Pipeline definitions
- ✅ `workflow_runs` - Execution history
- ✅ `knowledge_sources` - Input sources
- ✅ `ingest_jobs` - Processing jobs

**Integrations Hub Tables:**
- ✅ `integrations` - OAuth connections

**Telemetry Dashboard Tables:**
- ✅ `telemetry_events` - System event logging
- ✅ `agent_runs` - Performance metrics
- ✅ `workflow_runs` - Execution stats

### ✅ API Layer (100% Complete)
TypeScript entity wrappers already created in `src/api/entities.ts`:

```typescript
// Already implemented APIs:
BusinessBrainAPI.getAll()
BusinessBrainAPI.getById(id)
BusinessBrainAPI.create(data)
BusinessBrainAPI.update(id, data)

AgentAPI.getAll()
AgentAPI.getById(id)
AgentAPI.create(data)
AgentAPI.train(id, examples)

BrandRuleAPI.getAll()
BrandRuleAPI.create(data)

WorkflowAPI.getAll()
WorkflowAPI.execute(id)

IntegrationAPI.getAll()
IntegrationAPI.connect(service)

TelemetryAPI.getEvents()
TelemetryAPI.getMetrics()
```

### ✅ Netlify Functions (Ready)
Backend functions already deployed:
- `ai_invoke.ts` - AI generation
- `agent_train-background.ts` - Agent training
- `ingest_dispatch-background.ts` - Data ingestion

### 🟡 Frontend UI (Stub Placeholders)
Only the placeholder UI needs implementation:
- Location: `src/admin/modules/*.jsx`
- Current: Displays "Coming Soon" message
- Needed: Replace with actual UI

---

## Implementation Priority & Effort

### Priority 1: Quick Wins (2-4 hours each)

#### 1. **Agent Builder** (4 hours)
**Why First:** Most requested feature, database ready, APIs done
**Effort:** Medium
**Value:** High

**What to Build:**
- Agent list view (table with name, model, status)
- Create agent form (name, system prompt, model selection)
- Edit agent (update prompt, add training examples)
- Test interface (chat with agent)
- Training examples manager (add positive/negative examples)

**Implementation Steps:**
1. Copy structure from `ContentManagement.jsx`
2. Replace API calls with `AgentAPI.*` methods
3. Add form for agent creation (name, system_prompt, flags)
4. Add training examples section (CRUD for examples)
5. Add test chat interface (use existing chat component)

**Estimated Lines:** ~300-400 lines

---

#### 2. **Brand DNA Builder** (3 hours)
**Why Second:** Simple CRUD, immediate value for content consistency
**Effort:** Low-Medium
**Value:** High

**What to Build:**
- Brand rules list (voice, tone, style, lexicon, taboos)
- Add/edit brand rule form
- Category organizer (group rules by type)
- Preview section (show how rules affect AI output)

**Implementation Steps:**
1. Simple list/detail view like `TeamManagement.jsx`
2. Form with fields: category, rule_type, rule_text, examples
3. API calls to `BrandRuleAPI.*`
4. Group rules by category in UI

**Estimated Lines:** ~200-300 lines

---

#### 3. **Telemetry Dashboard** (3 hours)
**Why Third:** Data already being logged, just needs visualization
**Effort:** Medium
**Value:** Medium-High

**What to Build:**
- Real-time event stream (table of recent events)
- Metrics cards (agent usage, content generation, errors)
- Charts (event volume over time)
- Filters (by event type, severity, date range)

**Implementation Steps:**
1. Use `DashboardOverview.jsx` as template
2. Fetch data from `TelemetryAPI.getEvents()`
3. Add recharts for visualizations (already installed)
4. Add filters and search
5. Auto-refresh every 30 seconds

**Estimated Lines:** ~250-350 lines

---

### Priority 2: Advanced Features (6-8 hours each)

#### 4. **Workflow Manager** (8 hours)
**Why Fourth:** Complex UI, workflow engine needed
**Effort:** High
**Value:** High

**What to Build:**
- Workflow list view (active, paused, completed)
- Visual workflow designer (drag-drop nodes)
- Trigger configuration (schedule, event, manual)
- Action builder (generate content, publish, notify)
- Execution history with logs

**Implementation Steps:**
1. Install `reactflow` for visual designer (optional)
2. Create workflow form (name, triggers, actions)
3. API integration with `WorkflowAPI.*`
4. Execution UI with real-time status
5. Logs viewer for debugging

**Estimated Lines:** ~500-700 lines

**Alternative Simple Version (3 hours):**
- Skip visual designer
- Use simple form with JSON config
- Focus on list, create, execute, view logs

---

#### 5. **Integrations Hub** (6 hours)
**Why Last:** Requires OAuth setup, external service configs
**Effort:** Medium-High
**Value:** Medium

**What to Build:**
- Integration catalog (available services)
- Connection manager (OAuth flow)
- Status indicators (connected, disconnected)
- Settings per integration (API keys, webhooks)
- Test connection button

**Implementation Steps:**
1. Create service catalog (Google, Meta, HubSpot, etc.)
2. OAuth flow implementation
3. Credential storage (encrypted in integrations table)
4. Connection status checks
5. Settings forms per service

**Estimated Lines:** ~400-500 lines

---

## Implementation Shortcuts

### Option 1: Minimal Viable Implementation (MVP)
**Time:** 1-2 days total (8-16 hours)

**What to Build:**
1. **Agent Builder** - Simple CRUD with form
2. **Brand DNA Builder** - Simple list/edit
3. **Telemetry Dashboard** - Event table + basic charts

**Skip:**
- Workflow Manager (use simple JSON config instead)
- Integrations Hub (manually add API keys)

**Result:** 8 fully functional modules out of 11

---

### Option 2: Full Implementation
**Time:** 4-5 days (32-40 hours)

**What to Build:**
- All 5 stub modules fully implemented
- Visual workflow designer
- OAuth integration flows
- Advanced telemetry analytics

**Result:** All 11 modules fully functional

---

### Option 3: Gradual Rollout
**Time:** 1 module per week

**Schedule:**
- Week 1: Agent Builder
- Week 2: Brand DNA Builder
- Week 3: Telemetry Dashboard
- Week 4: Workflow Manager (simple version)
- Week 5: Integrations Hub

**Result:** One module complete per week, full system in 5 weeks

---

## Quick Start Guide for Each Module

### Agent Builder Implementation

**File:** `src/admin/modules/AgentBuilder.jsx`

**Replace stub with:**
```jsx
import React, { useState, useEffect } from 'react'
import { AgentAPI } from '@/api/entities'

export default function AgentBuilder() {
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadAgents()
  }, [])

  async function loadAgents() {
    const data = await AgentAPI.getAll()
    setAgents(data)
  }

  async function handleCreate(formData) {
    await AgentAPI.create(formData)
    loadAgents()
    setIsCreating(false)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Agent Builder</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          + New Agent
        </button>
      </div>

      {/* Agent List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onClick={() => setSelectedAgent(agent)}
          />
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(isCreating || selectedAgent) && (
        <AgentForm
          agent={selectedAgent}
          onSave={handleCreate}
          onClose={() => {
            setIsCreating(false)
            setSelectedAgent(null)
          }}
        />
      )}
    </div>
  )
}

function AgentCard({ agent, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-green-500"
    >
      <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
        {agent.system_prompt}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Model: {agent.flags?.model || 'default'}</span>
        <span className="text-green-500">●</span>
      </div>
    </div>
  )
}

function AgentForm({ agent, onSave, onClose }) {
  const [formData, setFormData] = useState(agent || {
    name: '',
    system_prompt: '',
    flags: { model: 'claude-sonnet-4.5', temperature: 0.7 }
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-white mb-4">
          {agent ? 'Edit Agent' : 'Create Agent'}
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Agent Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">System Prompt</label>
            <textarea
              value={formData.system_prompt}
              onChange={e => setFormData({...formData, system_prompt: e.target.value})}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white h-32"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Model</label>
            <select
              value={formData.flags?.model}
              onChange={e => setFormData({
                ...formData,
                flags: {...formData.flags, model: e.target.value}
              })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white"
            >
              <option value="claude-sonnet-4.5">Claude Sonnet 4.5</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Save Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**Lines:** ~180 lines
**Time:** 1-2 hours to implement
**Result:** Fully functional agent CRUD

---

### Brand DNA Builder Implementation

**File:** `src/admin/modules/BrandDNABuilder.jsx`

**Pattern:** Very similar to Agent Builder
- Replace `AgentAPI` with `BrandRuleAPI`
- Form fields: category, rule_type, rule_text, examples
- Group rules by category in UI
- Add preview section

**Time:** 1-2 hours

---

### Telemetry Dashboard Implementation

**File:** `src/admin/modules/TelemetryDashboard.jsx`

**Pattern:** Similar to `DashboardOverview.jsx`
- Use `TelemetryAPI.getEvents()`
- Add recharts for line/bar charts
- Event table with filters
- Auto-refresh every 30s

**Time:** 2-3 hours

---

## What You Need From Me

### If You Want Me to Implement

**I can build any/all stub modules if you tell me:**

1. **Which modules to prioritize?**
   - All 5? Or just specific ones?

2. **Implementation depth?**
   - MVP (simple forms, basic features)
   - Full (advanced UI, all features)

3. **Timeline preference?**
   - All at once (8-16 hours)
   - One per week (gradual rollout)

**I will:**
- ✅ Write complete module code
- ✅ Test functionality
- ✅ Document usage
- ✅ Commit and deploy

---

## What You Can Do Yourself

### If You Want to Implement

**You have everything you need:**

1. **Database:** ✅ All tables created
2. **APIs:** ✅ All entity wrappers done
3. **Templates:** ✅ Working modules to copy from
4. **Patterns:** ✅ Consistent architecture

**Process:**
1. Pick a stub module
2. Copy structure from working module
3. Replace API calls with appropriate entity APIs
4. Customize UI for specific features
5. Test and iterate

**Best starting point:** Agent Builder (most straightforward)

---

## Summary Table

| Module | Database | APIs | Frontend | Priority | Effort | Lines | Time |
|--------|----------|------|----------|----------|--------|-------|------|
| Agent Builder | ✅ | ✅ | 🟡 Stub | 🔴 High | Medium | ~300 | 4h |
| Brand DNA Builder | ✅ | ✅ | 🟡 Stub | 🔴 High | Low | ~250 | 3h |
| Telemetry Dashboard | ✅ | ✅ | 🟡 Stub | 🟡 Med | Medium | ~300 | 3h |
| Workflow Manager | ✅ | ✅ | 🟡 Stub | 🟡 Med | High | ~600 | 8h |
| Integrations Hub | ✅ | ✅ | 🟡 Stub | 🟢 Low | Med-High | ~450 | 6h |

**Total Implementation Time:**
- MVP (3 modules): 10 hours
- Full (5 modules): 24 hours

---

## Decision Point

**What would you like to do?**

**Option A:** "Implement all 5 modules now"
- I'll build them all in 8-24 hours
- You get complete admin system

**Option B:** "Implement priority modules only"
- I'll build Agent Builder, Brand DNA Builder, Telemetry Dashboard
- Core features done, advanced later

**Option C:** "I'll implement them myself"
- Use this guide as reference
- I'm available for questions

**Option D:** "Implement gradually (1 per week)"
- I'll build one module per week
- Gives you time to test each

Let me know which option you prefer! 🚀
