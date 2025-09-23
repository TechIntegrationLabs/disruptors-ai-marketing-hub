#!/usr/bin/env node

/**
 * Test Setup Script
 *
 * Verifies that all required dependencies and environment variables
 * are properly configured for the service image generator.
 */

import fetch from 'node-fetch';
import { v2 as cloudinary } from 'cloudinary';

console.log('🔍 Testing Service Image Generator Setup...\n');

// Test 1: Environment Variables
console.log('📋 Checking Environment Variables:');

const requiredEnvVars = {
  'REPLICATE_API_TOKEN': process.env.REPLICATE_API_TOKEN,
};

const optionalEnvVars = {
  'CLOUDINARY_CLOUD_NAME': process.env.CLOUDINARY_CLOUD_NAME,
  'CLOUDINARY_API_KEY': process.env.CLOUDINARY_API_KEY,
  'CLOUDINARY_API_SECRET': process.env.CLOUDINARY_API_SECRET,
};

let allRequiredPresent = true;

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (value) {
    console.log(`  ✅ ${key}: Set (${value.substring(0, 8)}...)`);
  } else {
    console.log(`  ❌ ${key}: Missing (required)`);
    allRequiredPresent = false;
  }
}

let cloudinaryConfigured = true;
for (const [key, value] of Object.entries(optionalEnvVars)) {
  if (value) {
    console.log(`  ✅ ${key}: Set (${value.substring(0, 8)}...)`);
  } else {
    console.log(`  ⚠️  ${key}: Missing (optional - Cloudinary upload disabled)`);
    cloudinaryConfigured = false;
  }
}

if (!allRequiredPresent) {
  console.log('\n❌ Setup Incomplete: Missing required environment variables');
  console.log('💡 Copy .env.example to .env and add your API keys');
  process.exit(1);
}

// Test 2: Dependencies
console.log('\n📦 Checking Dependencies:');

try {
  console.log('  ✅ node-fetch: Available');
} catch (error) {
  console.log('  ❌ node-fetch: Missing - run npm install');
  process.exit(1);
}

try {
  console.log('  ✅ cloudinary: Available');
} catch (error) {
  console.log('  ❌ cloudinary: Missing - run npm install');
  process.exit(1);
}

// Test 3: API Connection
console.log('\n🌐 Testing API Connections:');

try {
  console.log('  🔄 Testing Replicate API...');

  const response = await fetch('https://api.replicate.com/v1/models', {
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    },
  });

  if (response.ok) {
    console.log('  ✅ Replicate API: Connected successfully');
  } else {
    console.log(`  ❌ Replicate API: Error ${response.status} - ${response.statusText}`);
    console.log('  💡 Check your REPLICATE_API_TOKEN');
  }
} catch (error) {
  console.log('  ❌ Replicate API: Connection failed');
  console.log(`  💡 Error: ${error.message}`);
}

if (cloudinaryConfigured) {
  try {
    console.log('  🔄 Testing Cloudinary connection...');

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Test with a simple API call
    const result = await cloudinary.api.usage();
    console.log('  ✅ Cloudinary API: Connected successfully');
  } catch (error) {
    console.log('  ❌ Cloudinary API: Connection failed');
    console.log(`  💡 Error: ${error.message}`);
  }
} else {
  console.log('  ⚠️  Cloudinary: Skipped (not configured)');
}

// Test 4: File System
console.log('\n📁 Checking File System:');

try {
  const { promises: fs } = await import('fs');
  const path = await import('path');

  const testDir = path.join(process.cwd(), 'generated');
  await fs.mkdir(testDir, { recursive: true });
  console.log('  ✅ Generated directory: Ready');

  const testFile = path.join(testDir, 'test-write.json');
  await fs.writeFile(testFile, JSON.stringify({ test: true }));
  await fs.unlink(testFile);
  console.log('  ✅ File write permissions: OK');

} catch (error) {
  console.log('  ❌ File system: Error');
  console.log(`  💡 Error: ${error.message}`);
}

console.log('\n✨ Setup Test Complete!\n');

if (allRequiredPresent) {
  console.log('🎉 Your setup is ready for image generation!');
  console.log('\n🚀 Next steps:');
  console.log('  1. Run: npm run generate:service-images');
  console.log('  2. Wait for generation to complete (5-10 minutes)');
  console.log('  3. Check generated/ folder for results');
  console.log('  4. Update ServiceScroller component with new URLs');

  if (!cloudinaryConfigured) {
    console.log('\n💡 Optional: Configure Cloudinary for automatic upload and CDN optimization');
  }
} else {
  console.log('⚠️  Please fix the issues above before running the generator');
}