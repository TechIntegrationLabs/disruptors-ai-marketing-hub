# Service Images Generator

This directory contains scripts for generating AI-powered service images for the Disruptors AI marketing website.

## 🎨 Service Image Generator

The `generate-service-images.js` script creates professional service images for all 9 services in the ServiceScroller component using Replicate's FLUX model.

### Services Generated

1. **AI Automation** - Automation dashboards and workflow visualization
2. **Social Media Marketing** - Social media management interfaces
3. **SEO & GEO** - Analytics dashboards with location targeting
4. **Lead Generation** - Conversion funnels and pipeline visualization
5. **Paid Advertising** - PPC campaign dashboards and ROI metrics
6. **Podcasting** - Professional studio setups and audio waveforms
7. **Custom Apps** - Development environments and app prototypes
8. **CRM Management** - Customer relationship management interfaces
9. **Fractional CMO** - Strategic planning and executive dashboards

### Prerequisites

1. **API Keys Required:**
   - `REPLICATE_API_TOKEN` - Get from [Replicate](https://replicate.com/account/api-tokens)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Get from [Cloudinary](https://cloudinary.com/console/settings/api-keys) (optional)

2. **Dependencies:**
   ```bash
   npm install node-fetch cloudinary
   ```

3. **Environment Setup:**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your API keys
   REPLICATE_API_TOKEN=your_token_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Usage

#### Generate All Service Images

```bash
# Run the batch generator
npm run generate:service-images

# Or run directly with Node
node scripts/generate-service-images.js
```

#### What It Does

1. **Generates Images**: Creates 9 professional service images using Replicate's FLUX model
2. **Uploads to Cloudinary**: Automatically uploads and optimizes images (if configured)
3. **Provides Integration Code**: Generates ready-to-use component code
4. **Saves Results**: Creates detailed JSON report with all URLs and metadata

### Output

The script generates:

- **Generated Images**: High-quality 640x360 images optimized for web
- **Cloudinary URLs**: Production-ready CDN URLs for immediate use
- **Component Code**: Updated `services` array for ServiceScroller component
- **Results File**: `generated/service-images-YYYY-MM-DD.json` with full details

### Example Output

```javascript
const services = [
  {
    title: "AI Automation",
    hook: "Automate repetitive tasks and workflows",
    link: "solutions-ai-automation",
    image: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/disruptors-ai/services/ai-automation-service.jpg"
  },
  // ... 8 more services
];
```

### Integration

After generation, update the ServiceScroller component:

1. **Replace Services Array**: Copy the generated code to `src/components/shared/ServiceScroller.jsx`
2. **Test Images**: Verify all images load correctly in development
3. **Commit Changes**: Add the updated component to your repository

### Configuration

#### Image Specifications
- **Dimensions**: 640x360 (16:9 aspect ratio)
- **Format**: JPG for optimal web performance
- **Quality**: 90% for crisp details
- **Model**: FLUX Schnell for fast, high-quality generation

#### Cloudinary Settings
- **Folder**: `disruptors-ai/services/`
- **Optimization**: Auto quality and format selection
- **CDN**: Global delivery for fast loading

### Troubleshooting

#### Common Issues

1. **Missing API Token**
   ```
   Error: REPLICATE_API_TOKEN environment variable is required
   ```
   Solution: Add your Replicate API token to `.env`

2. **Generation Timeout**
   ```
   Error: Prediction timed out
   ```
   Solution: The script waits 5 minutes max. Retry if needed.

3. **Cloudinary Upload Failed**
   ```
   Warning: Skipping Cloudinary upload - configuration missing
   ```
   Solution: Add Cloudinary credentials to `.env` or use Replicate URLs directly

#### Retry Failed Generations

The script handles partial failures gracefully. Check the results file for any failed generations and re-run if needed.

### Advanced Usage

#### Custom Prompts

Edit the `SERVICES` array in the script to customize image prompts:

```javascript
{
  id: 'ai-automation',
  title: 'AI Automation',
  filename: 'ai-automation-service.jpg',
  prompt: 'Your custom prompt here...'
}
```

#### Different Models

Change the Replicate model in the CONFIG:

```javascript
const CONFIG = {
  replicate: {
    model: 'stability-ai/stable-diffusion-xl-base-1.0', // Alternative model
    // ...
  }
}
```

### Support

For issues with:
- **Replicate API**: Check [Replicate Documentation](https://replicate.com/docs)
- **Cloudinary**: Check [Cloudinary Documentation](https://cloudinary.com/documentation)
- **Script Issues**: Review the generated results file for detailed error information

---

*Generated images are optimized for the Disruptors AI brand aesthetic with consistent blue and purple tech styling.*