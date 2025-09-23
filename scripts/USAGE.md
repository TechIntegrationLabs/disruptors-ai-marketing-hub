# 🎨 Service Images Generator - Complete Usage Guide

This guide walks you through generating all 9 service images for your ServiceScroller component using AI and automatically integrating them into your website.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

**Required:**
- `REPLICATE_API_TOKEN` - Get from [Replicate](https://replicate.com/account/api-tokens)

**Optional (for automatic upload):**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 3. Test Your Setup

```bash
npm run test:image-setup
```

### 4. Generate Images

```bash
npm run generate:service-images
```

This will:
- Generate 9 professional service images (5-10 minutes)
- Upload to Cloudinary (if configured)
- Create integration code
- Save results to `generated/` folder

### 5. Integrate Images

```bash
npm run integrate:service-images
```

This automatically updates your ServiceScroller component with the new image URLs.

## 📋 Step-by-Step Guide

### Step 1: Environment Setup

1. **Get API Keys:**

   **Replicate (Required):**
   - Go to [Replicate API Tokens](https://replicate.com/account/api-tokens)
   - Create a new token
   - Copy the token

   **Cloudinary (Optional but Recommended):**
   - Go to [Cloudinary Console](https://cloudinary.com/console/settings/api-keys)
   - Note your Cloud Name, API Key, and API Secret

2. **Configure Environment:**
   ```bash
   # Copy the template
   cp .env.example .env

   # Edit with your favorite editor
   code .env  # or nano .env
   ```

   Add your keys:
   ```env
   REPLICATE_API_TOKEN=r8_your_token_here...
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Step 2: Verify Setup

```bash
npm run test:image-setup
```

Expected output:
```
🔍 Testing Service Image Generator Setup...

📋 Checking Environment Variables:
  ✅ REPLICATE_API_TOKEN: Set (r8_12345...)
  ✅ CLOUDINARY_CLOUD_NAME: Set (your-clo...)
  ✅ CLOUDINARY_API_KEY: Set (12345678...)
  ✅ CLOUDINARY_API_SECRET: Set (abcdefgh...)

📦 Checking Dependencies:
  ✅ node-fetch: Available
  ✅ cloudinary: Available

🌐 Testing API Connections:
  🔄 Testing Replicate API...
  ✅ Replicate API: Connected successfully
  🔄 Testing Cloudinary connection...
  ✅ Cloudinary API: Connected successfully

📁 Checking File System:
  ✅ Generated directory: Ready
  ✅ File write permissions: OK

✨ Setup Test Complete!

🎉 Your setup is ready for image generation!
```

### Step 3: Generate Images

```bash
npm run generate:service-images
```

This script will:

1. **Connect to Replicate** using FLUX model
2. **Generate 9 images** with professional prompts:
   - AI Automation dashboard
   - Social Media management interface
   - SEO & GEO analytics
   - Lead Generation funnel
   - Paid Advertising dashboard
   - Podcasting studio setup
   - Custom Apps development
   - CRM Management interface
   - Fractional CMO strategy dashboard

3. **Upload to Cloudinary** (if configured)
4. **Optimize images** (640x360, JPG format)
5. **Generate integration code**

Expected output:
```
🚀 Starting batch generation of service images...

🎨 Generating image for AI Automation...
⏳ Prediction created: p_abc123...
.....
✅ Image generated for AI Automation
☁️  Uploading AI Automation to Cloudinary...
✅ Uploaded to Cloudinary: https://res.cloudinary.com/...
✅ Completed: AI Automation

🎨 Generating image for Social Media Marketing...
...

🎉 Batch generation complete!

📊 Summary:
  ✅ Successful: 9
  ❌ Failed: 0
  📈 Success rate: 100%
```

### Step 4: Review Results

Check the generated files:

```bash
# View results
ls generated/
# service-images-2025-01-22.json

# Check the detailed results
cat generated/service-images-2025-01-22.json
```

The results file contains:
- All generated image URLs
- Integration code
- Generation metadata
- Error details (if any)

### Step 5: Integrate Images

**Option A: Automatic Integration**
```bash
npm run integrate:service-images
```

**Option B: Manual Integration**

1. Copy the generated services array from the results file
2. Open `src/components/shared/ServiceScroller.jsx`
3. Replace the existing `services` array
4. Save the file

### Step 6: Test Integration

```bash
# Start development server
npm run dev

# Visit your site and check the services section
# All images should load correctly
```

## 🎯 Generated Service Images

The script creates these 9 images:

| Service | Dimensions | Style | URL Pattern |
|---------|------------|-------|-------------|
| AI Automation | 640x360 | Tech dashboard, blue/purple | `/ai-automation-service.jpg` |
| Social Media Marketing | 640x360 | Social management UI | `/social-media-marketing-service.jpg` |
| SEO & GEO | 640x360 | Analytics with maps | `/seo-geo-service.jpg` |
| Lead Generation | 640x360 | Conversion funnels | `/lead-generation-service.jpg` |
| Paid Advertising | 640x360 | PPC dashboards | `/paid-advertising-service.jpg` |
| Podcasting | 640x360 | Studio setup | `/podcasting-service.jpg` |
| Custom Apps | 640x360 | Development environment | `/custom-apps-service.jpg` |
| CRM Management | 640x360 | Customer management | `/crm-management-service.jpg` |
| Fractional CMO | 640x360 | Executive strategy | `/fractional-cmo-service.jpg` |

## 🔧 Advanced Configuration

### Custom Prompts

Edit `scripts/generate-service-images.js` to customize image prompts:

```javascript
const SERVICES = [
  {
    id: 'ai-automation',
    title: 'AI Automation',
    filename: 'ai-automation-service.jpg',
    prompt: 'Your custom prompt here with specific styling requirements...'
  },
  // ...
];
```

### Different AI Models

Change the Replicate model:

```javascript
const CONFIG = {
  replicate: {
    model: 'stability-ai/stable-diffusion-xl-base-1.0',  // Alternative model
    // ...
  }
};
```

### Image Specifications

Adjust image settings:

```javascript
const CONFIG = {
  image: {
    width: 1280,      // Custom width
    height: 720,      // Custom height
    format: 'png',    // PNG for transparency
    quality: 95       // Higher quality
  }
};
```

## 🐛 Troubleshooting

### Common Issues

**"REPLICATE_API_TOKEN environment variable is required"**
- Add your Replicate API token to `.env`
- Make sure `.env` is in your project root

**"Prediction timed out"**
- Replicate is busy, try again in a few minutes
- Check Replicate dashboard for service status

**"Cloudinary upload failed"**
- Verify your Cloudinary credentials in `.env`
- Check Cloudinary quota limits
- Images will still work with Replicate URLs

**"No results file found"**
- Make sure the generation script completed successfully
- Check the `generated/` directory for JSON files

### Retrying Failed Generations

If some images fail to generate:

1. Check the results file for error details
2. Fix any API issues
3. Re-run the generator (it will retry all services)

### Partial Updates

To update only specific services:

1. Edit the `SERVICES` array in the generator script
2. Remove services you don't want to regenerate
3. Run the generator
4. Manually merge results into your component

## 📈 Performance Tips

1. **Parallel Generation**: The script generates images sequentially to respect API limits
2. **Caching**: Cloudinary provides global CDN for fast image loading
3. **Optimization**: Images are automatically optimized for web delivery
4. **Fallbacks**: The ServiceScroller component has image loading fallbacks

## 🔒 Security

- Never commit `.env` files to git
- Use environment variables for all API keys
- Rotate API tokens regularly
- Monitor API usage in your dashboards

## 📚 Resources

- [Replicate Documentation](https://replicate.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [FLUX Model Details](https://replicate.com/black-forest-labs/flux-schnell)
- [ServiceScroller Component](../src/components/shared/ServiceScroller.jsx)

---

*Generated with ❤️ for the Disruptors AI marketing hub*