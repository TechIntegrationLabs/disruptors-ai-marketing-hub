#!/usr/bin/env node

/**
 * Service Images Batch Generator
 *
 * This script generates all 9 service images for the ServiceScroller component
 * using Replicate API with FLUX model for consistent, professional results.
 *
 * Usage:
 *   node scripts/generate-service-images.js
 *
 * Requirements:
 *   - REPLICATE_API_TOKEN environment variable
 *   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET for upload
 */

import fetch from 'node-fetch';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  replicate: {
    apiUrl: 'https://api.replicate.com/v1/predictions',
    model: 'black-forest-labs/flux-schnell',
    version: 'latest'
  },
  image: {
    width: 640,
    height: 360,
    format: 'jpg',
    quality: 90
  },
  cloudinary: {
    folder: 'disruptors-ai/services',
    transformation: {
      quality: 'auto:good',
      format: 'jpg'
    }
  }
};

// Service definitions with detailed prompts
const SERVICES = [
  {
    id: 'ai-automation',
    title: 'AI Automation',
    filename: 'ai-automation-service.jpg',
    prompt: `Professional AI automation dashboard interface, modern tech workspace, robotic process automation visualization, workflow diagrams with connected nodes, sleek blue and purple gradient background, futuristic digital interface elements, clean minimalist design, soft lighting, high-tech aesthetic, 640x360 aspect ratio, professional photography style`
  },
  {
    id: 'social-media-marketing',
    title: 'Social Media Marketing',
    filename: 'social-media-marketing-service.jpg',
    prompt: `Modern social media management dashboard, multiple platform analytics, engagement metrics charts, content calendar interface, social media icons and notifications, vibrant blue and purple color scheme, clean UI design, professional workspace setup, modern laptop screen, soft ambient lighting, 640x360 aspect ratio`
  },
  {
    id: 'seo-geo',
    title: 'SEO & GEO',
    filename: 'seo-geo-service.jpg',
    prompt: `SEO analytics dashboard with ranking charts, local search results visualization, geographic targeting maps, search engine optimization metrics, keyword ranking graphs, location pins on map interface, blue and purple tech aesthetic, modern dashboard design, professional analytics workspace, 640x360 aspect ratio`
  },
  {
    id: 'lead-generation',
    title: 'Lead Generation',
    filename: 'lead-generation-service.jpg',
    prompt: `Lead generation funnel visualization, conversion metrics dashboard, customer journey mapping, sales pipeline interface, lead scoring charts, CRM data visualization, professional blue and purple gradient, modern business analytics, clean dashboard design, soft lighting, 640x360 aspect ratio`
  },
  {
    id: 'paid-advertising',
    title: 'Paid Advertising',
    filename: 'paid-advertising-service.jpg',
    prompt: `PPC campaign dashboard, advertising platform interface, ROI charts and metrics, ad performance analytics, cost-per-click visualization, multiple advertising channels, professional blue and purple design, modern advertising workspace, clean analytics interface, 640x360 aspect ratio`
  },
  {
    id: 'podcasting',
    title: 'Podcasting',
    filename: 'podcasting-service.jpg',
    prompt: `Professional podcast studio setup, audio waveforms visualization, recording equipment and microphone, podcast analytics dashboard, sound wave graphics, broadcasting interface, modern studio lighting, blue and purple tech aesthetic, professional audio workspace, 640x360 aspect ratio`
  },
  {
    id: 'custom-apps',
    title: 'Custom Apps',
    filename: 'custom-apps-service.jpg',
    prompt: `Mobile app development workspace, code editor interface, app prototypes and wireframes, development tools dashboard, programming environment, multiple device mockups, blue and purple gradient background, modern development setup, clean tech aesthetic, 640x360 aspect ratio`
  },
  {
    id: 'crm-management',
    title: 'CRM Management',
    filename: 'crm-management-service.jpg',
    prompt: `CRM dashboard interface, customer relationship management system, contact database visualization, sales pipeline management, customer data analytics, relationship mapping interface, professional blue and purple design, modern business software, clean dashboard layout, 640x360 aspect ratio`
  },
  {
    id: 'fractional-cmo',
    title: 'Fractional CMO',
    filename: 'fractional-cmo-service.jpg',
    prompt: `Strategic marketing planning dashboard, executive analytics interface, growth metrics visualization, marketing strategy charts, business consulting workspace, performance KPIs, professional leadership aesthetic, blue and purple gradient, modern executive dashboard, 640x360 aspect ratio`
  }
];

class ServiceImageGenerator {
  constructor() {
    this.replicateToken = process.env.REPLICATE_API_TOKEN;
    this.cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    };

    if (!this.replicateToken) {
      throw new Error('REPLICATE_API_TOKEN environment variable is required');
    }

    if (!this.cloudinaryConfig.cloud_name || !this.cloudinaryConfig.api_key || !this.cloudinaryConfig.api_secret) {
      console.warn('Cloudinary configuration missing. Images will only be generated via Replicate.');
    } else {
      cloudinary.config(this.cloudinaryConfig);
    }
  }

  /**
   * Generate image using Replicate FLUX model
   */
  async generateImage(service) {
    console.log(`🎨 Generating image for ${service.title}...`);

    try {
      const response = await fetch(CONFIG.replicate.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.replicateToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: CONFIG.replicate.version,
          input: {
            prompt: service.prompt,
            width: CONFIG.image.width,
            height: CONFIG.image.height,
            num_outputs: 1,
            guidance_scale: 7.5,
            num_inference_steps: 50,
            seed: Math.floor(Math.random() * 1000000)
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Replicate API error: ${response.status} - ${errorText}`);
      }

      const prediction = await response.json();
      console.log(`⏳ Prediction created: ${prediction.id}`);

      // Wait for completion
      const result = await this.waitForCompletion(prediction.id);
      console.log(`✅ Image generated for ${service.title}`);

      return {
        serviceId: service.id,
        title: service.title,
        filename: service.filename,
        replicateUrl: result.output[0],
        predictionId: prediction.id
      };

    } catch (error) {
      console.error(`❌ Error generating image for ${service.title}:`, error.message);
      throw error;
    }
  }

  /**
   * Wait for Replicate prediction to complete
   */
  async waitForCompletion(predictionId) {
    const maxAttempts = 60; // 5 minutes max
    const pollInterval = 5000; // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`${CONFIG.replicate.apiUrl}/${predictionId}`, {
          headers: {
            'Authorization': `Token ${this.replicateToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to poll prediction: ${response.statusText}`);
        }

        const prediction = await response.json();

        if (prediction.status === 'succeeded') {
          return prediction;
        } else if (prediction.status === 'failed') {
          throw new Error(`Prediction failed: ${prediction.error || 'Unknown error'}`);
        }

        // Still processing
        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, pollInterval));

      } catch (error) {
        console.error(`\n❌ Error polling prediction:`, error.message);
        throw error;
      }
    }

    throw new Error('Prediction timed out');
  }

  /**
   * Upload image to Cloudinary
   */
  async uploadToCloudinary(result) {
    if (!this.cloudinaryConfig.cloud_name) {
      console.log(`⚠️  Skipping Cloudinary upload for ${result.title} - configuration missing`);
      return {
        ...result,
        cloudinaryUrl: result.replicateUrl,
        publicId: null
      };
    }

    try {
      console.log(`☁️  Uploading ${result.title} to Cloudinary...`);

      const uploadResult = await cloudinary.uploader.upload(result.replicateUrl, {
        folder: CONFIG.cloudinary.folder,
        public_id: result.serviceId,
        overwrite: true,
        transformation: [
          {
            width: CONFIG.image.width,
            height: CONFIG.image.height,
            crop: 'fill',
            quality: CONFIG.image.quality,
            format: CONFIG.image.format
          }
        ]
      });

      console.log(`✅ Uploaded to Cloudinary: ${uploadResult.secure_url}`);

      return {
        ...result,
        cloudinaryUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };

    } catch (error) {
      console.error(`❌ Error uploading to Cloudinary:`, error.message);
      return {
        ...result,
        cloudinaryUrl: result.replicateUrl,
        publicId: null,
        uploadError: error.message
      };
    }
  }

  /**
   * Generate all service images
   */
  async generateAll() {
    console.log('🚀 Starting batch generation of service images...\n');

    const results = [];

    for (const service of SERVICES) {
      try {
        // Generate image
        const imageResult = await this.generateImage(service);

        // Upload to Cloudinary
        const uploadResult = await this.uploadToCloudinary(imageResult);

        results.push(uploadResult);

        console.log(`✅ Completed: ${service.title}\n`);

        // Small delay to be respectful to APIs
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Failed to process ${service.title}:`, error.message);
        results.push({
          serviceId: service.id,
          title: service.title,
          filename: service.filename,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Generate updated ServiceScroller component code
   */
  generateComponentCode(results) {
    const services = results
      .filter(result => !result.error)
      .map(result => ({
        title: result.title,
        hook: SERVICES.find(s => s.id === result.serviceId)?.title === 'AI Automation' ? 'Automate repetitive tasks and workflows' :
              SERVICES.find(s => s.id === result.serviceId)?.title === 'Social Media Marketing' ? 'Build and engage your community' :
              SERVICES.find(s => s.id === result.serviceId)?.title === 'SEO & GEO' ? 'Get found by your ideal customers' :
              SERVICES.find(s => s.id === result.serviceId)?.title === 'Lead Generation' ? 'Fill your pipeline with qualified prospects' :
              SERVICES.find(s => s.id === result.serviceId)?.title === 'Paid Advertising' ? 'Maximize ROI across all channels' :
              SERVICES.find(s => s.id === result.serviceId)?.title === 'Podcasting' ? 'Build authority through audio content' :
              SERVICES.find(s => s.id === result.serviceId)?.title === 'Custom Apps' ? 'Tailored solutions for your needs' :
              SERVICES.find(s => s.id === result.serviceId)?.title === 'CRM Management' ? 'Organize and nurture your relationships' :
              'Strategic marketing leadership',
        link: `solutions-${result.serviceId}`,
        image: result.cloudinaryUrl
      }));

    return `const services = [
${services.map(service => `  {
    title: "${service.title}",
    hook: "${service.hook}",
    link: "${service.link}",
    image: "${service.image}"
  }`).join(',\n')}
];`;
  }

  /**
   * Save results to file
   */
  async saveResults(results) {
    const outputDir = path.join(__dirname, '..', 'generated');
    await fs.mkdir(outputDir, { recursive: true });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `service-images-${timestamp}.json`;
    const filepath = path.join(outputDir, filename);

    const output = {
      timestamp: new Date().toISOString(),
      config: CONFIG,
      results,
      componentCode: this.generateComponentCode(results),
      summary: {
        total: SERVICES.length,
        successful: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length
      }
    };

    await fs.writeFile(filepath, JSON.stringify(output, null, 2));
    console.log(`📄 Results saved to: ${filepath}`);

    return output;
  }
}

// Main execution
async function main() {
  try {
    const generator = new ServiceImageGenerator();

    console.log('🔧 Configuration:');
    console.log(`  - Model: ${CONFIG.replicate.model}`);
    console.log(`  - Dimensions: ${CONFIG.image.width}x${CONFIG.image.height}`);
    console.log(`  - Services to generate: ${SERVICES.length}`);
    console.log(`  - Cloudinary configured: ${!!generator.cloudinaryConfig.cloud_name}\n`);

    const results = await generator.generateAll();
    const output = await generator.saveResults(results);

    console.log('\n🎉 Batch generation complete!');
    console.log('\n📊 Summary:');
    console.log(`  ✅ Successful: ${output.summary.successful}`);
    console.log(`  ❌ Failed: ${output.summary.failed}`);
    console.log(`  📈 Success rate: ${Math.round((output.summary.successful / output.summary.total) * 100)}%`);

    if (output.summary.successful > 0) {
      console.log('\n🔗 Generated URLs:');
      results.filter(r => !r.error).forEach(result => {
        console.log(`  ${result.title}: ${result.cloudinaryUrl}`);
      });

      console.log('\n📝 Component Code:');
      console.log(output.componentCode);

      console.log('\n🔄 To update ServiceScroller component:');
      console.log('1. Replace the services array in src/components/shared/ServiceScroller.jsx');
      console.log('2. Test the component to ensure images load correctly');
      console.log('3. Commit the changes to your repository');
    }

    if (output.summary.failed > 0) {
      console.log('\n❌ Failed generations:');
      results.filter(r => r.error).forEach(result => {
        console.log(`  ${result.title}: ${result.error}`);
      });
    }

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default ServiceImageGenerator;