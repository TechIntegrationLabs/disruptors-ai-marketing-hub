/**
 * Integration Example
 *
 * This file shows how to automatically update the ServiceScroller component
 * with newly generated service images.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Service configurations mapping
const SERVICE_CONFIGS = {
  'ai-automation': {
    title: "AI Automation",
    hook: "Automate repetitive tasks and workflows",
    link: "solutions-ai-automation"
  },
  'social-media-marketing': {
    title: "Social Media Marketing",
    hook: "Build and engage your community",
    link: "solutions-social-media"
  },
  'seo-geo': {
    title: "SEO & GEO",
    hook: "Get found by your ideal customers",
    link: "solutions-seo-geo"
  },
  'lead-generation': {
    title: "Lead Generation",
    hook: "Fill your pipeline with qualified prospects",
    link: "solutions-lead-generation"
  },
  'paid-advertising': {
    title: "Paid Advertising",
    hook: "Maximize ROI across all channels",
    link: "solutions-paid-advertising"
  },
  'podcasting': {
    title: "Podcasting",
    hook: "Build authority through audio content",
    link: "solutions-podcasting"
  },
  'custom-apps': {
    title: "Custom Apps",
    hook: "Tailored solutions for your needs",
    link: "solutions-custom-apps"
  },
  'crm-management': {
    title: "CRM Management",
    hook: "Organize and nurture your relationships",
    link: "solutions-crm-management"
  },
  'fractional-cmo': {
    title: "Fractional CMO",
    hook: "Strategic marketing leadership",
    link: "solutions-fractional-cmo"
  }
};

/**
 * Update ServiceScroller component with new image URLs
 */
async function updateServiceScroller(resultsFile) {
  try {
    console.log('🔄 Updating ServiceScroller component...');

    // Read the generation results
    const resultsPath = path.join(__dirname, '..', 'generated', resultsFile);
    const results = JSON.parse(await fs.readFile(resultsPath, 'utf8'));

    // Filter successful generations
    const successfulResults = results.results.filter(r => !r.error);

    if (successfulResults.length === 0) {
      throw new Error('No successful image generations found');
    }

    // Build the services array
    const services = successfulResults.map(result => ({
      title: SERVICE_CONFIGS[result.serviceId].title,
      hook: SERVICE_CONFIGS[result.serviceId].hook,
      link: SERVICE_CONFIGS[result.serviceId].link,
      image: result.cloudinaryUrl
    }));

    // Generate the component code
    const componentCode = `const services = [
${services.map(service => `  {
    title: "${service.title}",
    hook: "${service.hook}",
    link: "${service.link}",
    image: "${service.image}"
  }`).join(',\n')}
];`;

    // Read the current ServiceScroller component
    const componentPath = path.join(__dirname, '..', 'src', 'components', 'shared', 'ServiceScroller.jsx');
    const currentContent = await fs.readFile(componentPath, 'utf8');

    // Replace the services array
    const updatedContent = currentContent.replace(
      /const services = \[[\s\S]*?\];/,
      componentCode
    );

    // Write the updated component
    await fs.writeFile(componentPath, updatedContent, 'utf8');

    console.log('✅ ServiceScroller component updated successfully!');
    console.log(`📊 Updated ${services.length} service image URLs`);

    // Log the updated services
    console.log('\n🔗 Updated Services:');
    services.forEach(service => {
      console.log(`  ${service.title}: ${service.image}`);
    });

    return {
      success: true,
      updatedServices: services.length,
      componentPath
    };

  } catch (error) {
    console.error('❌ Error updating ServiceScroller:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Find the latest results file
 */
async function findLatestResults() {
  try {
    const generatedDir = path.join(__dirname, '..', 'generated');
    const files = await fs.readdir(generatedDir);

    const resultFiles = files
      .filter(file => file.startsWith('service-images-') && file.endsWith('.json'))
      .sort()
      .reverse();

    return resultFiles[0] || null;
  } catch (error) {
    return null;
  }
}

// CLI usage
async function main() {
  const resultsFile = process.argv[2] || await findLatestResults();

  if (!resultsFile) {
    console.error('❌ No results file found. Run the image generator first.');
    console.error('Usage: node scripts/integration-example.js [results-file.json]');
    process.exit(1);
  }

  console.log(`📄 Using results file: ${resultsFile}`);
  const result = await updateServiceScroller(resultsFile);

  if (result.success) {
    console.log('\n🎉 Integration complete!');
    console.log('\n📝 Next steps:');
    console.log('  1. Test the updated component in development');
    console.log('  2. Verify all images load correctly');
    console.log('  3. Commit the changes to your repository');
  } else {
    console.error('\n💥 Integration failed!');
    process.exit(1);
  }
}

// Export for use as module
export { updateServiceScroller, findLatestResults, SERVICE_CONFIGS };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}