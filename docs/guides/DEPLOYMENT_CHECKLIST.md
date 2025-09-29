
# Netlify Deployment Checklist

## Pre-Deployment
- [ ] All environment variables configured in .env
- [ ] Supabase database setup completed
- [ ] AI service API keys verified
- [ ] Build command works locally: npm run build
- [ ] All tests passing

## Netlify Configuration
- [ ] Connect GitHub repository to Netlify
- [ ] Set build command: npm run build
- [ ] Set publish directory: dist
- [ ] Set Node version: 18+

## Environment Variables (Netlify Dashboard)
Add these variables in your Netlify site settings:

### Required
- [ ] VITE_SUPABASE_URL
- [ ] VITE_SUPABASE_ANON_KEY
- [ ] VITE_SUPABASE_SERVICE_ROLE_KEY

### AI Services
- [ ] VITE_OPENAI_API_KEY
- [ ] VITE_GEMINI_API_KEY
- [ ] VITE_REPLICATE_API_TOKEN
- [ ] VITE_ELEVENLABS_API_KEY

### Media Storage
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET

## Post-Deployment Testing
- [ ] Site loads correctly
- [ ] Admin access works (5 clicks + DMadmin)
- [ ] AI generation works in admin panel
- [ ] Media storage in Supabase works
- [ ] All forms submit correctly

## Admin Access Instructions
1. Click the Disruptors logo 5 times within 3 seconds
2. Enter any username when prompted
3. Enter password: DMadmin
4. Access the Neural Media Generator

## Monitoring
- [ ] Check Netlify deployment logs
- [ ] Monitor Supabase usage
- [ ] Track AI service API usage
- [ ] Verify Cloudinary storage

For detailed setup instructions, see:
- docs/DEPLOYMENT_SETUP.md
- docs/AI_GENERATION_SETUP_GUIDE.md
