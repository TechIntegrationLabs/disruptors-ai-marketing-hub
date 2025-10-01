# Admin Nexus - Troubleshooting Guide

## Table of Contents

1. [Common Integration Issues](#common-integration-issues)
2. [Database Migration Errors](#database-migration-errors)
3. [Authentication Problems](#authentication-problems)
4. [RLS Policy Issues](#rls-policy-issues)
5. [Frontend Routing Issues](#frontend-routing-issues)
6. [Netlify Function Errors](#netlify-function-errors)
7. [API Integration Problems](#api-integration-problems)
8. [Performance Issues](#performance-issues)
9. [Security Concerns](#security-concerns)
10. [Debugging Checklist](#debugging-checklist)
11. [Error Messages Dictionary](#error-messages-dictionary)
12. [Rollback Procedures](#rollback-procedures)

---

## Common Integration Issues

### Issue: Public site broken after integration

**Symptoms**:
- Homepage won't load
- Console errors
- Blank screen
- Infinite loading

**Causes**:
- Admin routing guard breaking main routes
- Import errors
- Conflicting dependencies

**Solutions**:

1. **Check routing guard syntax**:
   ```javascript
   // In src/pages/index.jsx or src/App.jsx
   if (window.location.pathname.startsWith('/admin/secret')) {
     return <AdminPortal />;
   }
   // ⚠️ Make sure this is BEFORE other routing logic
   ```

2. **Verify import path**:
   ```javascript
   import AdminPortal from '../admin-portal'; // ✅ Correct
   import AdminPortal from './admin-portal';  // ❌ Wrong if in wrong directory
   ```

3. **Check browser console**:
   - Open DevTools (F12)
   - Look for error messages
   - Common: "Cannot find module", "undefined is not a function"

4. **Test without admin integration**:
   ```bash
   # Temporarily comment out admin routing guard
   # if (window.location.pathname.startsWith('/admin/secret')) {
   #   return <AdminPortal />;
   # }
   npm run dev
   ```

5. **Clear build artifacts**:
   ```bash
   rm -rf node_modules dist .vite
   npm install
   npm run build
   ```

**Prevention**:
- Always test public site after changes
- Use Method B (wrapper) if Method A causes issues
- Keep admin code isolated in separate directory

---

### Issue: Admin portal shows 404

**Symptoms**:
- Visiting `/admin/secret` shows "Page Not Found"
- No admin login screen

**Causes**:
- Routing guard not implemented
- Wrong route path
- Build not including admin files

**Solutions**:

1. **Verify routing guard exists**:
   ```javascript
   // Should be in src/pages/index.jsx or src/App.jsx
   if (window.location.pathname.startsWith('/admin/secret')) {
     return <AdminPortal />;
   }
   ```

2. **Check AdminPortal component**:
   ```bash
   # Verify file exists
   ls src/admin-portal.jsx
   ```

3. **Test import**:
   ```javascript
   import AdminPortal from '../admin-portal';
   console.log(AdminPortal); // Should not be undefined
   ```

4. **Check _redirects file** (for production):
   ```
   # In public/_redirects or netlify.toml
   /admin/secret/* /index.html 200
   ```

5. **Rebuild**:
   ```bash
   npm run build
   npm run preview
   # Visit http://localhost:4173/admin/secret
   ```

---

## Database Migration Errors

### Issue: Migration 001 fails with syntax error

**Symptoms**:
```
ERROR: syntax error at or near "create"
ERROR: relation "business_brains" does not exist
```

**Causes**:
- Copy-paste error (missing semicolons, quotes)
- Running migration twice
- Database version incompatibility

**Solutions**:

1. **Check PostgreSQL version**:
   ```sql
   SELECT version();
   -- Should be 15.0 or higher
   ```

2. **Run migration in parts**:
   - Copy only table creation (lines 1-100)
   - Execute
   - Copy RPC functions (lines 200-400)
   - Execute
   - Copy seed data (lines 400-end)
   - Execute

3. **Check for existing tables**:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   -- If business_brains exists, migration already ran
   ```

4. **Drop and recreate** (DESTRUCTIVE - only in development):
   ```sql
   DROP TABLE IF EXISTS business_brains CASCADE;
   DROP TABLE IF EXISTS brain_facts CASCADE;
   -- Then re-run migration
   ```

5. **Use Supabase SQL Editor**:
   - Dashboard → SQL Editor
   - Paste entire migration
   - Click "Run"
   - Wait for success message
   - Don't close tab until complete

---

### Issue: Migration 002 fails on existing tables

**Symptoms**:
```
ERROR: column "user_id" already exists
ERROR: relation "team_members" does not exist
```

**Causes**:
- Running migration multiple times
- Table structure changed
- Migration 001 not completed

**Solutions**:

1. **Check if columns exist**:
   ```sql
   SELECT column_name
   FROM information_schema.columns
   WHERE table_name = 'team_members';
   -- Look for: user_id, can_write_content, default_agent_id
   ```

2. **Skip already-added columns**:
   - Comment out ALTER TABLE statements for existing columns
   - Run remaining statements

3. **Verify prerequisite tables**:
   ```sql
   -- Check that team_members exists
   SELECT * FROM team_members LIMIT 1;

   -- Check that posts exists
   SELECT * FROM posts LIMIT 1;

   -- Check that site_media exists
   SELECT * FROM site_media LIMIT 1;
   ```

4. **If table doesn't exist**:
   - Migration 002 expects existing tables
   - You may need to create basic tables first
   - Or skip enhancements for now

---

### Issue: RPC functions not working

**Symptoms**:
```
ERROR: function search_brain_facts(uuid, text, integer) does not exist
ERROR: permission denied for function get_brain_health
```

**Causes**:
- Function not created
- Wrong parameter types
- RLS blocking access

**Solutions**:

1. **Verify function exists**:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'search_brain_facts';
   -- Should return 1 row
   ```

2. **Check function signature**:
   ```sql
   \df search_brain_facts
   -- Shows parameters and return type
   ```

3. **Test function directly**:
   ```sql
   SELECT * FROM search_brain_facts(
     (SELECT id FROM business_brains LIMIT 1),
     'test',
     5
   );
   ```

4. **Check RLS on function**:
   ```sql
   -- RLS doesn't apply to functions by default
   -- But check if function uses SECURITY DEFINER
   ```

5. **Recreate function**:
   - Copy function definition from migration
   - Use `CREATE OR REPLACE FUNCTION`
   - Execute

---

## Authentication Problems

### Issue: Cannot log in to admin panel

**Symptoms**:
- Login button doesn't work
- "Invalid credentials" error
- Redirects to home page

**Causes**:
- Wrong email/password
- User not created
- Admin role not assigned
- Session not persisting

**Solutions**:

1. **Verify user exists**:
   - Supabase Dashboard → Authentication → Users
   - Search for email
   - Check if user is confirmed

2. **Reset password**:
   - In Users list, click user
   - Click "Reset Password"
   - Check email for reset link
   - Set new password

3. **Check admin role**:
   ```sql
   SELECT
     email,
     raw_app_meta_data->>'role' as role
   FROM auth.users
   WHERE email = 'admin@disruptors.co';
   -- Should return: role = 'admin'
   ```

4. **Grant admin role manually**:
   - Supabase Dashboard → Authentication → Users
   - Click user
   - Edit `app_metadata`
   - Add: `{"role": "admin"}`
   - Save

5. **Test authentication**:
   ```javascript
   // In browser console on /admin/secret
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'admin@disruptors.co',
     password: 'YourPassword123!'
   });
   console.log(data, error);
   ```

---

### Issue: "User is not authorized as admin" error

**Symptoms**:
- Can log in
- Redirects to error page
- "Not authorized" message

**Causes**:
- Admin role not in JWT
- Role check failing
- Case sensitivity issue

**Solutions**:

1. **Check JWT claims**:
   ```javascript
   // In browser console after login
   const { data: { session } } = await supabase.auth.getSession();
   console.log(session.user.app_metadata);
   // Should have: { role: 'admin' }
   ```

2. **Verify role check logic**:
   ```javascript
   // In ProtectedRoute.jsx
   const isAdmin = session.user.app_metadata?.role === 'admin';
   console.log('Is admin?', isAdmin);
   ```

3. **Check for typos**:
   - Role must be exactly 'admin' (lowercase)
   - Not 'Admin', 'ADMIN', 'administrator'

4. **Refresh session**:
   ```javascript
   await supabase.auth.refreshSession();
   // Then check JWT again
   ```

5. **Use setup script**:
   ```bash
   node scripts/setup-admin-user.js admin@disruptors.co NewPassword123!
   # This ensures correct role assignment
   ```

---

### Issue: Session expires immediately

**Symptoms**:
- Login works
- Immediately logged out
- Must login on every page

**Causes**:
- Browser blocking cookies
- Supabase session settings
- localStorage issues

**Solutions**:

1. **Check localStorage**:
   ```javascript
   // In browser console
   console.log(localStorage.getItem('supabase.auth.token'));
   // Should see JWT token
   ```

2. **Enable cookies**:
   - Browser settings → Cookies
   - Allow for supabase.co and your domain
   - Disable "Block third-party cookies" for development

3. **Check Supabase session settings**:
   - Dashboard → Settings → Authentication
   - Session Expiry: Should be > 0 (default: 604800 seconds = 7 days)

4. **Clear storage and retry**:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   // Reload page and login again
   ```

---

## RLS Policy Issues

### Issue: Cannot read admin tables

**Symptoms**:
```
ERROR: permission denied for table business_brains
ERROR: new row violates row-level security policy
```

**Causes**:
- RLS enabled but no policies
- User not recognized as admin
- Service role key not used

**Solutions**:

1. **Check RLS status**:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public' AND tablename = 'business_brains';
   -- rowsecurity should be 't' (true)
   ```

2. **Check policy exists**:
   ```sql
   SELECT policyname, cmd, qual
   FROM pg_policies
   WHERE tablename = 'business_brains';
   -- Should see: admin_all_access policy
   ```

3. **Test policy manually**:
   ```sql
   -- As authenticated user
   SET request.jwt.claims = '{"role": "admin"}';
   SELECT * FROM business_brains;
   -- Should work
   ```

4. **Verify service role key**:
   - Used in Netlify Functions
   - Check environment variable: `SUPABASE_SERVICE_ROLE_KEY`
   - Should bypass RLS

5. **Recreate policies**:
   ```sql
   DROP POLICY IF EXISTS admin_all_access ON business_brains;
   CREATE POLICY admin_all_access ON business_brains
     FOR ALL USING (
       coalesce(
         current_setting('request.jwt.claims', true)::jsonb->>'role',
         ''
       ) = 'admin'
     );
   ```

---

### Issue: Service role key not working

**Symptoms**:
- Netlify Functions can't access database
- "Permission denied" in function logs

**Causes**:
- Wrong key
- Key not set in Netlify
- Using anon key instead

**Solutions**:

1. **Get correct service role key**:
   - Supabase Dashboard → Settings → API
   - Copy `service_role` key (NOT `anon` key)
   - Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

2. **Set in Netlify**:
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (paste service role key)
   - Scopes: All scopes
   - Save

3. **Verify in function**:
   ```javascript
   // In Netlify Function
   console.log('Service role key:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20));
   // Should NOT be undefined
   ```

4. **Redeploy**:
   ```bash
   git commit --allow-empty -m "Redeploy after env var change"
   git push
   ```

---

## Frontend Routing Issues

### Issue: React Router conflicts with admin routing

**Symptoms**:
- Clicking links navigates away from admin
- Admin routes show 404
- Nested routes broken

**Causes**:
- Admin routing not properly isolated
- React Router catching admin routes
- Link components using wrong router

**Solutions**:

1. **Use BrowserRouter in AdminPortal**:
   ```javascript
   // In admin-portal.jsx
   import { BrowserRouter as Router } from 'react-router-dom';

   export default function AdminPortal() {
     return (
       <Router basename="/admin/secret">
         <Routes>
           {/* Admin routes */}
         </Routes>
       </Router>
     );
   }
   ```

2. **Check route guard placement**:
   ```javascript
   // Should be BEFORE main Router
   if (window.location.pathname.startsWith('/admin/secret')) {
     return <AdminPortal />;
   }

   return (
     <Router>
       {/* Main site routes */}
     </Router>
   );
   ```

3. **Use absolute paths**:
   ```jsx
   // In admin navigation
   <Link to="/admin/secret/overview">Overview</Link>
   // NOT: <Link to="overview">Overview</Link>
   ```

---

## Netlify Function Errors

### Issue: Function timeout

**Symptoms**:
```
Task timed out after 10.00 seconds
Function execution took longer than configured timeout
```

**Causes**:
- LLM API slow
- Web scraping taking too long
- No timeout configured
- Function not marked as background

**Solutions**:

1. **Use background functions**:
   ```javascript
   // Rename file
   mv ingest_dispatch.ts ingest_dispatch-background.ts
   // Netlify automatically extends timeout to 15 minutes
   ```

2. **Add timeout to LLM calls**:
   ```javascript
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

   const response = await anthropic.messages.create({
     model: 'claude-sonnet-4.5',
     messages: messages,
     signal: controller.signal
   });

   clearTimeout(timeoutId);
   ```

3. **Break into smaller jobs**:
   - Instead of scraping 100 URLs at once
   - Process 10 URLs per invocation
   - Create multiple background jobs

4. **Check Netlify logs**:
   - Dashboard → Functions → [function name] → Logs
   - See execution time
   - Identify bottleneck

---

### Issue: Function not found

**Symptoms**:
```
404 Not Found
/.netlify/functions/ai_invoke
```

**Causes**:
- Function not deployed
- Wrong path
- Build error

**Solutions**:

1. **Check deployment logs**:
   - Netlify Dashboard → Deploys → [latest deploy]
   - Expand "Function bundling"
   - Should see: "ai_invoke: x KB"

2. **Verify file location**:
   ```
   netlify/functions/ai_invoke.ts  ✅ Correct
   src/functions/ai_invoke.ts      ❌ Wrong location
   ```

3. **Check function syntax**:
   ```typescript
   import { Handler } from '@netlify/functions';

   export const handler: Handler = async (event, context) => {
     // Function code
     return {
       statusCode: 200,
       body: JSON.stringify({ success: true })
     };
   };
   ```

4. **Test locally**:
   ```bash
   netlify dev
   # Visit http://localhost:8888/.netlify/functions/ai_invoke
   ```

---

### Issue: Environment variables not accessible in function

**Symptoms**:
```
console.log(process.env.VITE_ANTHROPIC_API_KEY); // undefined
ERROR: Missing API key
```

**Causes**:
- Variable not set in Netlify
- Wrong variable name
- `VITE_` prefix issue

**Solutions**:

1. **Check Netlify environment**:
   - Dashboard → Site Settings → Environment Variables
   - Verify all keys are set
   - Check scopes (should include "Functions")

2. **Remove `VITE_` prefix for server-side**:
   ```javascript
   // ❌ Wrong (VITE_ is for client-side only)
   const apiKey = process.env.VITE_ANTHROPIC_API_KEY;

   // ✅ Correct (no VITE_ prefix for functions)
   const apiKey = process.env.ANTHROPIC_API_KEY;
   ```

3. **Set both versions**:
   - `VITE_ANTHROPIC_API_KEY` for frontend
   - `ANTHROPIC_API_KEY` for functions

4. **Test in function**:
   ```javascript
   export const handler = async () => {
     console.log('Env vars:', Object.keys(process.env));
     return { statusCode: 200, body: 'Check logs' };
   };
   ```

---

## API Integration Problems

### Issue: Anthropic API errors

**Symptoms**:
```
ERROR: Invalid API key
ERROR: Rate limit exceeded
ERROR: Model not found
```

**Solutions**:

1. **Verify API key**:
   - Visit https://console.anthropic.com/
   - Settings → API Keys
   - Copy key (starts with `sk-ant-`)
   - Update environment variable

2. **Check rate limits**:
   - Free tier: 5 requests/minute
   - Paid tier: 50 requests/minute
   - Add delay between requests

3. **Verify model name**:
   ```javascript
   // ✅ Correct
   model: 'claude-sonnet-4.5'
   model: 'claude-3-5-sonnet-20241022'

   // ❌ Wrong
   model: 'claude-4'
   model: 'claude-sonnet-4'
   ```

4. **Handle errors gracefully**:
   ```javascript
   try {
     const response = await anthropic.messages.create({...});
   } catch (error) {
     if (error.status === 429) {
       // Rate limit - retry after delay
       await sleep(60000);
       return retry();
     } else if (error.status === 401) {
       // Invalid API key
       throw new Error('Anthropic API key invalid');
     }
   }
   ```

---

### Issue: Supabase connection errors

**Symptoms**:
```
ERROR: connection refused
ERROR: Invalid API key
ERROR: Failed to fetch
```

**Solutions**:

1. **Check Supabase status**:
   - Visit https://status.supabase.com/
   - Check for outages

2. **Verify project URL**:
   ```javascript
   // Should match your project
   const supabaseUrl = 'https://[project-ref].supabase.co';
   ```

3. **Check network**:
   ```bash
   curl https://[project-ref].supabase.co
   # Should return: "ok"
   ```

4. **Test connection**:
   ```javascript
   const { data, error } = await supabase
     .from('business_brains')
     .select('id')
     .limit(1);

   console.log('Connection test:', data, error);
   ```

---

## Performance Issues

### Issue: Admin panel slow to load

**Symptoms**:
- Long initial load time (>5 seconds)
- Laggy interactions
- High memory usage

**Causes**:
- Loading too much data at once
- No pagination
- Inefficient queries
- Large bundle size

**Solutions**:

1. **Add pagination**:
   ```javascript
   const { data, error } = await supabase
     .from('posts')
     .select('*')
     .range(0, 24)  // First 25 posts
     .order('created_at', { ascending: false });
   ```

2. **Lazy load modules**:
   ```javascript
   // In AdminPortal routing
   const DashboardOverview = lazy(() => import('./modules/DashboardOverview'));
   const ContentManagement = lazy(() => import('./modules/ContentManagement'));
   ```

3. **Use views**:
   ```javascript
   // Instead of multiple joins
   const { data } = await supabase
     .from('posts_with_authors') // Pre-joined view
     .select('*');
   ```

4. **Optimize queries**:
   ```javascript
   // ❌ Slow - fetches all columns
   const { data } = await supabase.from('posts').select('*');

   // ✅ Fast - only needed columns
   const { data } = await supabase
     .from('posts')
     .select('id, title, status, published_at');
   ```

5. **Add indexes**:
   ```sql
   CREATE INDEX IF NOT EXISTS posts_status_published_idx
     ON posts (status, published_at DESC NULLS LAST);
   ```

---

### Issue: Full-text search slow

**Symptoms**:
- Search takes >3 seconds
- Database CPU spikes
- Timeouts on large searches

**Solutions**:

1. **Verify FTS index exists**:
   ```sql
   SELECT indexname FROM pg_indexes
   WHERE tablename = 'brain_facts' AND indexname = 'brain_facts_fts_idx';
   ```

2. **Recreate index**:
   ```sql
   DROP INDEX IF EXISTS brain_facts_fts_idx;
   CREATE INDEX brain_facts_fts_idx ON brain_facts USING gin (fts);
   ```

3. **Limit results**:
   ```javascript
   const results = await supabase
     .rpc('search_brain_facts', {
       brain_id: brainId,
       q: searchQuery,
       limit_count: 20  // Don't return 1000s of results
     });
   ```

4. **Use materialized views** (for common queries):
   ```sql
   CREATE MATERIALIZED VIEW brain_facts_search AS
   SELECT id, key, value, fts
   FROM brain_facts
   WHERE brain_id = 'common-brain-id';

   REFRESH MATERIALIZED VIEW brain_facts_search;
   ```

---

## Security Concerns

### Issue: Service role key exposed in frontend

**Symptoms**:
- Service role key visible in browser Network tab
- Security audit fails

**Causes**:
- Using service role key in frontend code
- Environment variable named with `VITE_` prefix

**Solutions**:

1. **Never use service role in frontend**:
   ```javascript
   // ❌ WRONG - Exposes service role key
   const supabase = createClient(
     process.env.VITE_SUPABASE_URL,
     process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
   );

   // ✅ CORRECT - Uses anon key (safe)
   const supabase = createClient(
     process.env.VITE_SUPABASE_URL,
     process.env.VITE_SUPABASE_ANON_KEY
   );
   ```

2. **Check for leaks**:
   ```bash
   # Search codebase for service role usage
   grep -r "SERVICE_ROLE_KEY" src/
   # Should only appear in netlify/functions/
   ```

3. **Rotate key if exposed**:
   - Supabase Dashboard → Settings → API
   - Generate new service role key
   - Update in Netlify environment
   - Redeploy

---

### Issue: RLS bypassed

**Symptoms**:
- Non-admin users can access admin data
- Data leaks

**Causes**:
- RLS not enabled
- Policy has logic error
- Service role used in frontend

**Solutions**:

1. **Enable RLS on all admin tables**:
   ```sql
   ALTER TABLE business_brains ENABLE ROW LEVEL SECURITY;
   ALTER TABLE brain_facts ENABLE ROW LEVEL SECURITY;
   -- etc. for all admin tables
   ```

2. **Test policies**:
   ```sql
   -- As non-admin user
   SET request.jwt.claims = '{"role": "user"}';
   SELECT * FROM business_brains;
   -- Should return 0 rows
   ```

3. **Audit policies**:
   ```sql
   SELECT tablename, policyname, cmd, qual
   FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename;
   ```

---

## Debugging Checklist

### Frontend Issues

- [ ] Check browser console for errors
- [ ] Verify React DevTools shows component tree
- [ ] Check Network tab for failed requests
- [ ] Test with cache disabled (DevTools → Network → Disable cache)
- [ ] Try incognito mode (no extensions)
- [ ] Check localStorage/sessionStorage
- [ ] Verify environment variables in `window` (dev mode only)

### Backend Issues

- [ ] Check Netlify function logs
- [ ] Verify environment variables in Netlify dashboard
- [ ] Test function locally with `netlify dev`
- [ ] Check Supabase logs (Dashboard → Logs)
- [ ] Verify RLS policies
- [ ] Test database queries in SQL Editor
- [ ] Check API rate limits

### Database Issues

- [ ] Run `EXPLAIN ANALYZE` on slow queries
- [ ] Check table sizes: `SELECT pg_size_pretty(pg_total_relation_size('table_name'));`
- [ ] Verify indexes exist
- [ ] Check for locks: `SELECT * FROM pg_locks WHERE NOT granted;`
- [ ] Review RLS policies
- [ ] Test RPC functions manually

---

## Error Messages Dictionary

### "Cannot find module '@/components/...'"

**Cause**: Path alias not resolved

**Solution**: Check `vite.config.js`:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

---

### "Module not found: Can't resolve 'lucide-react'"

**Cause**: Dependency not installed

**Solution**:
```bash
npm install lucide-react
```

---

### "ReferenceError: supabase is not defined"

**Cause**: Supabase client not imported

**Solution**:
```javascript
import { supabase } from '@/api/auth';
// or
import { createClient } from '@supabase/supabase-js';
```

---

### "TypeError: Cannot read property 'map' of undefined"

**Cause**: Data not loaded yet

**Solution**: Add null check:
```javascript
{data?.map(item => <div key={item.id}>{item.name}</div>)}
// or
{data && data.map(...)}
```

---

### "CORS error: No 'Access-Control-Allow-Origin' header"

**Cause**: API endpoint not allowing requests

**Solution**: Check Netlify function response:
```javascript
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  body: JSON.stringify(data)
};
```

---

### "Error: Hydration failed"

**Cause**: Server-rendered HTML doesn't match client (usually not an issue in SPA)

**Solution**: Ensure conditional rendering is consistent

---

## Rollback Procedures

### Quick Rollback (Frontend Only)

**Time**: 5 minutes

**When to use**: Admin panel broken, public site unaffected

**Steps**:

1. **Revert Git commit**:
   ```bash
   git log --oneline  # Find commit hash before integration
   git revert <commit-hash>
   git push origin master
   ```

2. **Wait for Netlify deploy** (2-3 minutes)

3. **Verify public site works**

---

### Full Rollback (Frontend + Database)

**Time**: 15 minutes

**When to use**: Critical issues, data corruption

**Steps**:

1. **Revert frontend code**:
   ```bash
   git checkout <pre-integration-commit>
   git push origin master --force
   ```

2. **Restore database from backup**:
   - Supabase Dashboard → Database → Backups
   - Select backup from before integration
   - Click "Restore"
   - Confirm (THIS WILL OVERWRITE CURRENT DATA)

3. **Verify restoration**:
   ```sql
   -- Check that new tables are gone
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   -- Should NOT see: business_brains, brain_facts, etc.
   ```

4. **Clear Netlify environment variables**:
   - Remove `ADMIN_SECRET_KEY`
   - Remove any admin-specific variables

5. **Test public site**

---

### Partial Rollback (Keep Data, Revert Code)

**Time**: 10 minutes

**When to use**: Admin features broken, want to keep data for future retry

**Steps**:

1. **Revert frontend code**:
   ```bash
   git revert <integration-commit>
   git push
   ```

2. **Keep database tables** (don't drop anything)

3. **Document issue** for future debugging

4. **Public site continues working**

5. **Can re-attempt integration later without data loss**

---

## Support Resources

### Official Documentation

- **Supabase Docs**: https://supabase.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Anthropic API Docs**: https://docs.anthropic.com
- **React Router Docs**: https://reactrouter.com

### Community Support

- **Supabase Discord**: https://discord.supabase.com
- **Stack Overflow**: Tag questions with `supabase`, `netlify`, `react`

### Internal Contacts

- **Project Lead**: [Your Name]
- **Database Admin**: [DBA Name]
- **DevOps**: [DevOps Team]

---

## Emergency Contacts

### Critical Issues (Production Down)

1. **Immediately**: Revert to last working commit
2. **Notify**: Project lead + team
3. **Document**: Issue details, steps taken, resolution

### Non-Critical Issues

1. **Document**: Screenshot, error messages, steps to reproduce
2. **Search**: This troubleshooting guide + Stack Overflow
3. **Ask**: Team Slack channel
4. **Create**: GitHub issue if bug found

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-01
**Author**: Claude Code (Anthropic)
**Project**: Disruptors AI Marketing Hub - Admin Nexus Troubleshooting Guide
