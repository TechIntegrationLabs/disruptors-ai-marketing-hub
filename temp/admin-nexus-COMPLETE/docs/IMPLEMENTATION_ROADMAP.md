# Admin Nexus Implementation Roadmap

## Overview

This roadmap outlines a 4-phase approach to implementing the Admin Nexus system into your Disruptors AI Marketing Hub.

## Phase 0: Foundation (2-3 days)

**Goal:** Get core infrastructure working without breaking existing site.

### Tasks:
1. **Database Setup**
   - [ ] Apply `DB/migrations/001_init_enhanced.sql` in Supabase SQL Editor
   - [ ] Verify all tables created successfully
   - [ ] Test RPC functions (`search_brain_facts`, `get_brain_health`)
   - [ ] Confirm seed data loaded (default brain, sample agent)

2. **Environment Configuration**
   - [ ] Add Netlify environment variables
   - [ ] Configure Supabase Edge Function deployment
   - [ ] Test service role key access
   - [ ] Verify LLM API keys work

3. **Authentication Setup**
   - [ ] Deploy `set-admin-role` Edge Function to Supabase
   - [ ] Create admin user account
   - [ ] Grant admin role using Edge Function or manual JWT claim
   - [ ] Test login flow

4. **React Router Integration**
   - [ ] Add React Router DOM dependency
   - [ ] Integrate `admin-router-integration.jsx` into `src/pages/index.jsx`
   - [ ] Test `/admin/secret` route (should show login)
   - [ ] Test secret access patterns (logo clicks, Ctrl+Shift+D)

### Success Criteria:
- ✅ Database schema fully deployed
- ✅ Admin user can log in
- ✅ `/admin/secret` route accessible
- ✅ No breaking changes to existing public site

---

## Phase 1: Core MVP (3-5 days)

**Goal:** Get business brain + basic chat working.

### Tasks:
1. **Deploy Netlify Functions**
   - [ ] Deploy all functions from `netlify/functions/`
   - [ ] Test `ai_invoke` with mock data
   - [ ] Test `brain_search` endpoint
   - [ ] Verify service role access works

2. **Admin UI Components**
   - [ ] Copy `AdminShell.jsx` and dependencies
   - [ ] Implement `BusinessBrainBuilder` module
   - [ ] Add manual fact entry form
   - [ ] Build basic `AgentChat` interface

3. **Test Core Flow**
   - [ ] Manually add 5-10 business facts
   - [ ] Create/configure test agent
   - [ ] Chat with agent and verify context retrieval
   - [ ] Test thumbs up/down feedback

### Success Criteria:
- ✅ Can manually add facts to business brain
- ✅ Can chat with agent using brain context
- ✅ Feedback loop working (ratings saved)
- ✅ No errors in console

---

## Phase 2: Automation (5-7 days)

**Goal:** Add web scraping and automated ingestion.

### Tasks:
1. **Install Dependencies**
   ```bash
   npm install jsdom @mozilla/readability @anthropic-ai/sdk openai
   ```

2. **Deploy Scraping Functions**
   - [ ] Deploy `ingest_dispatch-background` function
   - [ ] Test with single URL
   - [ ] Add sitemap support
   - [ ] Implement rate limiting

3. **Knowledge Sources UI**
   - [ ] Add source creation form
   - [ ] Show ingest job progress with Realtime
   - [ ] Display job logs and results
   - [ ] Handle errors gracefully

4. **Agent Training**
   - [ ] Deploy `agent_train-background` function
   - [ ] Add training examples UI
   - [ ] Test prompt improvement flow
   - [ ] Review updated system prompts

### Success Criteria:
- ✅ Can add URL/sitemap knowledge source
- ✅ Ingestion extracts facts automatically
- ✅ Agent training improves prompts
- ✅ Realtime progress updates work

---

## Phase 3: Full Features (7-10 days)

**Goal:** Complete all admin modules.

### Tasks:
1. **Brand DNA Module**
   - [ ] Create `BrandDNABuilder` component
   - [ ] Form for style/voice/tone rules
   - [ ] Integration with agent training
   - [ ] Preview/test interface

2. **Workflows Module**
   - [ ] Basic workflow runner
   - [ ] Manual trigger UI
   - [ ] Run history and logs
   - [ ] Status monitoring

3. **Integrations Module**
   - [ ] OAuth stub for GA4/GSC
   - [ ] Connection status indicators
   - [ ] Test/disconnect actions

4. **Telemetry Dashboard**
   - [ ] Event stream viewer
   - [ ] Simple charts (daily activity)
   - [ ] Error monitoring
   - [ ] Performance metrics

5. **Additional Modules**
   - [ ] DashboardOverview with metrics
   - [ ] AgentBuilder for creating new agents
   - [ ] WorkflowManager for automation

### Success Criteria:
- ✅ All 8 admin modules functional
- ✅ Complete navigation working
- ✅ No critical bugs
- ✅ Performance acceptable (<2s load)

---

## Phase 4: Enhancements (Ongoing)

**Goal:** Polish, optimize, and extend.

### Tasks:
1. **Vector Search** (Optional)
   - [ ] Enable pgvector extension
   - [ ] Add embeddings column to `brain_facts`
   - [ ] Implement automatic embedding generation
   - [ ] Update search to use semantic + keyword

2. **Performance Optimization**
   - [ ] Add caching layer
   - [ ] Optimize Supabase queries
   - [ ] Lazy load heavy components
   - [ ] Bundle size optimization

3. **Content Publishing**
   - [ ] "Generate with Agent" button in posts UI
   - [ ] Draft → Review → Published workflow
   - [ ] SEO field population
   - [ ] Preview integration

4. **Advanced Workflows**
   - [ ] Scheduled ingestion
   - [ ] Batch content generation
   - [ ] Automatic fact verification
   - [ ] Multi-brain support

### Success Criteria:
- ✅ Semantic search working
- ✅ Sub-second query responses
- ✅ Agent can publish posts to site
- ✅ Automated workflows running

---

## Timeline Summary

| Phase | Duration | Key Milestone |
|-------|----------|---------------|
| Phase 0 | 2-3 days | Admin login working |
| Phase 1 | 3-5 days | Chat with context working |
| Phase 2 | 5-7 days | Auto-ingestion working |
| Phase 3 | 7-10 days | All modules complete |
| Phase 4 | Ongoing | Enhancements & polish |

**Total Estimated Time:** 3-4 weeks for core functionality

---

## Risk Mitigation

### High-Risk Areas:
1. **JWT Claims Configuration**
   - Risk: Admin role not set correctly
   - Mitigation: Test with manual Supabase dashboard first

2. **Rate Limiting**
   - Risk: Hitting LLM API limits during ingestion
   - Mitigation: Implement delays, batch processing

3. **Large Ingestion Jobs**
   - Risk: Netlify function timeout (15 min max)
   - Mitigation: Process in batches, use queues for Phase 4

4. **Existing Site Breakage**
   - Risk: Router changes affect public pages
   - Mitigation: Test thoroughly, use feature flags

### Rollback Plan:
- Keep Phase 0-3 on separate git branch until tested
- Can disable admin routes via feature flag
- Supabase tables won't affect existing functionality
- Netlify functions isolated from public site

---

## Testing Checklist

### Phase 0:
- [ ] Can log in as admin
- [ ] Public site still works
- [ ] Secret access patterns work

### Phase 1:
- [ ] Facts searchable
- [ ] Chat uses correct facts
- [ ] No database errors

### Phase 2:
- [ ] Ingestion completes
- [ ] Facts extracted accurately
- [ ] Progress updates real-time

### Phase 3:
- [ ] All navigation links work
- [ ] No console errors
- [ ] Mobile responsive

### Phase 4:
- [ ] Performance under load
- [ ] Automated jobs reliable
- [ ] Content publishes correctly

---

## Next Steps

1. Review this roadmap with team
2. Set up project board (Trello/Linear/GitHub Projects)
3. Begin Phase 0 implementation
4. Schedule daily standups during active phases
5. Plan demo at end of each phase

**Ready to start? Begin with Phase 0 → Database Setup!**
