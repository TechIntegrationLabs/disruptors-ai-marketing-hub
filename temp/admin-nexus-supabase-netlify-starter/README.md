# Admin Nexus + dmagent Integration (Supabase + Netlify)

This package bootstraps the admin modules on your existing site (branch `feature/admin-nexus`):
- SQL migrations (Supabase tables, indices, starter RLS)
- Netlify Functions (sync + background + scheduled) — TypeScript stubs
- Front-end API shim (`src/api`) to call `/api/*` endpoints
- PRD for the team

## Quick Start
1) Apply SQL in `DB/migrations/001_init.sql` (Supabase SQL Editor).
2) Add env vars in Netlify or `.env` for local dev (see `.env.example`).
3) Install deps and run local functions:
   ```bash
   npm i
   netlify dev
   ```

## Functions
- ai_invoke.ts
- agent_train.ts / agent_train-background.ts
- agent_run_status.ts
- brain_search.ts
- brain_add_fact.ts
- ingest_dispatch-background.ts
- ingest_status.ts
- feedback_submit.ts
- workflows_run-background.ts
- workflow_status.ts
- cron_nightly.ts
