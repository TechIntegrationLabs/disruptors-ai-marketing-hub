# Authentication Setup Guide

Complete guide to setting up admin authentication for Admin Nexus.

## Overview

Admin Nexus uses Supabase Auth with custom JWT claims for role-based access control. Only users with `role: 'admin'` in their JWT claims can access admin routes.

## Method 1: Supabase Edge Function (Recommended)

### Step 1: Deploy Edge Function

```bash
# In your Supabase project directory
supabase functions deploy set-admin-role
```

Or manually create the function in Supabase Dashboard:
1. Go to Database → Functions
2. Click "New Function"
3. Copy contents from `netlify/edge-functions/set-admin-role.ts`

### Step 2: Set Environment Variables

In Supabase Dashboard → Settings → Edge Functions:

```
ADMIN_SECRET_KEY=your-super-secret-key-change-this
ADMIN_EMAILS=admin@disruptors.co,will@disruptors.co
```

### Step 3: Create Admin User

1. Sign up through your app's normal signup flow
2. Call the Edge Function to grant admin role:

```javascript
const response = await fetch(
  `https://[your-project].supabase.co/functions/v1/set-admin-role`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      userId: user.id,
      email: user.email,
      secretKey: 'your-super-secret-key-change-this'
    })
  }
)
```

3. Refresh session to get updated JWT with admin role

---

## Method 2: Manual JWT Claim (Quick Test)

### Step 1: Create User

Sign up through Supabase Auth UI or your app.

### Step 2: Set Admin Role Manually

In Supabase Dashboard:
1. Go to Authentication → Users
2. Find your user
3. Click to edit
4. Under "Raw User Meta Data" → "app_metadata", add:

```json
{
  "role": "admin",
  "granted_at": "2025-10-01T00:00:00Z"
}
```

5. Save

### Step 3: Force Token Refresh

```javascript
const { data, error } = await supabase.auth.refreshSession()
```

---

## Method 3: Database Trigger (Automated)

### Step 1: Create Trigger Function

```sql
create or replace function public.handle_new_admin()
returns trigger as $$
begin
  -- Check if email is in approved admin list
  if new.email in ('admin@disruptors.co', 'will@disruptors.co') then
    -- Set admin role in app_metadata
    new.raw_app_meta_data = jsonb_set(
      coalesce(new.raw_app_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;
```

### Step 2: Create Trigger

```sql
create trigger on_auth_user_created_set_admin
  before insert on auth.users
  for each row
  execute function public.handle_new_admin();
```

Now any new user with approved email gets admin role automatically.

---

## Verification

### Check JWT Claims

```javascript
import { getJWTClaims } from './api/auth'

const claims = await getJWTClaims()
console.log(claims)

// Should see:
// {
//   role: 'admin',
//   email: 'admin@disruptors.co',
//   ...
// }
```

### Test Admin Access

1. Navigate to `/admin/secret`
2. Should see admin login screen
3. Log in with admin credentials
4. Should bypass login and see admin dashboard

---

## Secret Access Patterns

### Pattern 1: Logo Clicks

5 clicks on logo within 3 seconds grants temporary admin access.

```javascript
import { useSecretAdminAccess } from './integration/admin-router-integration'

function Logo() {
  const { handleClick } = useSecretAdminAccess()

  return <img src="..." onClick={handleClick} />
}
```

### Pattern 2: Keyboard Shortcut

`Ctrl+Shift+D` grants immediate admin access.

### Pattern 3: Emergency Exit

`Ctrl+Shift+Escape` exits admin and returns to home.

---

## Security Best Practices

### 1. Environment Variables

**NEVER commit these to git:**
```
ADMIN_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 2. RLS Policies

All admin tables have RLS enabled with admin-only policies:

```sql
create policy admin_all_access on table_name
  for all using (
    (current_setting('request.jwt.claims', true)::jsonb->>'role') = 'admin'
  )
```

### 3. Token Expiration

JWT tokens expire after 1 hour. Session expires after 24 hours.

Refresh token automatically:
```javascript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed')
  }
})
```

### 4. Audit Trail

All admin actions logged to `telemetry_events`:
```javascript
await supabase.from('telemetry_events').insert({
  area: 'admin',
  name: 'action_performed',
  payload: { action, user_id }
})
```

---

## Troubleshooting

### Issue: "User is not authorized as admin"

**Cause:** JWT doesn't have `role: 'admin'` claim.

**Fix:**
1. Check `app_metadata` in Supabase dashboard
2. Refresh session: `await supabase.auth.refreshSession()`
3. Clear localStorage and re-login

### Issue: "RLS policy violation"

**Cause:** Trying to access tables without admin role.

**Fix:**
1. Verify JWT claims have `role: 'admin'`
2. Check RLS policies are created
3. Verify service role key in Netlify functions

### Issue: Edge Function not working

**Cause:** Environment variables not set or function not deployed.

**Fix:**
1. Re-deploy function
2. Check environment variables in Supabase dashboard
3. Test with curl:

```bash
curl -X POST https://[project].supabase.co/functions/v1/set-admin-role \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{"userId":"...","email":"...","secretKey":"..."}'
```

---

## Production Checklist

- [ ] Admin secret key set to strong random value
- [ ] Admin emails list configured
- [ ] Edge Function deployed
- [ ] RLS policies enabled on all tables
- [ ] Service role key secured in Netlify
- [ ] Audit logging enabled
- [ ] Token refresh working
- [ ] Emergency exit pattern works
- [ ] Admin access tested end-to-end

---

## Support

If authentication setup fails:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify network requests in DevTools
4. Test JWT claims with verification script

Need help? Contact: dev@disruptors.co
