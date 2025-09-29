# Netlify Environment Variables - Quick Setup Guide

**CRITICAL:** These environment variables MUST be configured in Netlify to fix the Supabase connection issue.

## Step-by-Step Instructions

### 1. Access Netlify Dashboard
1. Go to https://app.netlify.com
2. Click on your site: **disruptors-ai-marketing-hub**
3. Navigate to **Site settings** > **Environment variables**

### 2. Add Environment Variables

Click "Add a variable" for each of the following:

#### Variable 1: Supabase URL
```
Name: VITE_SUPABASE_URL
Value: https://ubqxflzuvxowigbjmqfb.supabase.co
Scopes: Production (or All)
```

#### Variable 2: Supabase Anon Key
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicXhmbHp1dnhvd2lnYmptcWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTI0MzgsImV4cCI6MjA3NDA4ODQzOH0.2M0ThAiGxG7eEIiS6P8ItrUzigBlFYiHhvxONRa99XE
Scopes: Production (or All)
```

#### Variable 3: Supabase Service Role Key
```
Name: VITE_SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicXhmbHp1dnhvd2lnYmptcWZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODUxMjQzOCwiZXhwIjoyMDc0MDg4NDM4fQ.FnhnaAxWjMo41M7Gmm_bXFXZuegzW5HfitvB1APNDDk
Scopes: Production (or All)
```

### 3. Trigger Deployment
1. Go to **Deploys** tab
2. Click **Trigger deploy** > **Clear cache and deploy site**
3. Wait for deployment to complete (usually 2-3 minutes)

### 4. Verify Fix
1. Visit: https://disruptors-ai-marketing-hub.netlify.app
2. Open browser DevTools (F12)
3. Check Console tab
4. Look for: `Supabase: Connected to production instance: https://ubqxflzuvxowigbjmqfb.supabase.co`
5. Verify NO localhost (127.0.0.1:54321) connection errors

## Expected Results

### Before Configuration
- 58 console errors
- Attempts to connect to 127.0.0.1:54321
- Database operations fail

### After Configuration
- Zero connection errors
- Successful connection to production Supabase
- Database operations work correctly
- Clear success message in console

## Troubleshooting

### If Deployment Fails
- Check that all three variables are added correctly
- Verify no extra spaces in variable names or values
- Try clearing cache and redeploying

### If Still Seeing Localhost Errors
- Ensure deployment completed successfully
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check that you're viewing the latest deployment

### If Variables Not Showing in Console
- Verify variables are scoped to "Production" or "All"
- Check deployment logs for build errors
- Ensure variable names start with `VITE_` prefix

## Alternative: Using Netlify CLI

If you prefer command-line setup:

```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Set environment variables
netlify env:set VITE_SUPABASE_URL "https://ubqxflzuvxowigbjmqfb.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicXhmbHp1dnhvd2lnYmptcWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTI0MzgsImV4cCI6MjA3NDA4ODQzOH0.2M0ThAiGxG7eEIiS6P8ItrUzigBlFYiHhvxONRa99XE"
netlify env:set VITE_SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicXhmbHp1dnhvd2lnYmptcWZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODUxMjQzOCwiZXhwIjoyMDc0MDg4NDM4fQ.FnhnaAxWjMo41M7Gmm_bXFXZuegzW5HfitvB1APNDDk"

# Trigger deployment
netlify deploy --prod
```

## Security Notes

- Anon key is safe to expose (public key with Row Level Security)
- Service role key must remain secret (admin access)
- Netlify environment variables are secure and encrypted
- Never commit these keys to version control

## Need Help?

1. Check full report: `SUPABASE_CONNECTION_FIX_REPORT.md`
2. Review Netlify docs: https://docs.netlify.com/environment-variables/overview/
3. Review Supabase docs: https://supabase.com/docs/guides/getting-started

---

**Estimated Setup Time:** 5 minutes
**Priority:** CRITICAL - Required for production operation