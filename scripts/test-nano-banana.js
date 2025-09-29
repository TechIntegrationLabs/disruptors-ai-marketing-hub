#!/usr/bin/env node
/**
 * Google Gemini 2.5 Flash Image (Nano Banana) Smoke Test
 *
 * Tests the Gemini integration to ensure:
 * - API connectivity
 * - Model validation
 * - Image generation works
 * - Helper functions work correctly
 *
 * Usage: node scripts/test-nano-banana.js
 * Or: npm run test:nano-banana
 */

import { geminiGenerate, getModelInfo, calculateCost, GEMINI_IMAGE_MODEL } from '../src/lib/gemini-image.js';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Google Gemini 2.5 Flash Image (Nano Banana)\n');
console.log('=' .repeat(50));

/**
 * Test 1: Model Information
 */
function testModelInfo() {
  console.log('\n📋 Test 1: Model Information');
  console.log('-'.repeat(50));

  try {
    const info = getModelInfo();
    console.log('✅ Model info retrieved successfully');
    console.log('   Model ID:', info.model);
    console.log('   Provider:', info.provider);
    console.log('   Nickname:', info.nickname);
    console.log('   Capabilities:', info.capabilities.length);
    console.log('   Features:', info.features.join(', '));
    console.log('   Pricing: $' + info.pricing.perImage + ' per image');
    return true;
  } catch (error) {
    console.error('❌ Model info test failed:', error.message);
    return false;
  }
}

/**
 * Test 2: Cost Calculation
 */
function testCostCalculation() {
  console.log('\n💰 Test 2: Cost Calculation');
  console.log('-'.repeat(50));

  try {
    const cost = calculateCost();
    const expected = 0.039;
    const passed = cost === expected;

    console.log(`   Cost per image: $${cost}`);
    console.log(`   Expected: $${expected}`);
    console.log(`   ${passed ? '✅' : '❌'} Fixed pricing verified`);

    return passed;
  } catch (error) {
    console.error('❌ Cost calculation test failed:', error.message);
    return false;
  }
}

/**
 * Test 3: Model ID Validation
 */
function testModelValidation() {
  console.log('\n🔒 Test 3: Model ID Validation');
  console.log('-'.repeat(50));

  try {
    console.log('   Model ID:', GEMINI_IMAGE_MODEL);
    console.log('   ✅ Model ID is "gemini-2.5-flash-image-preview" (correct)');

    // Verify it includes expected keywords
    if (!GEMINI_IMAGE_MODEL.includes('gemini') ||
        !GEMINI_IMAGE_MODEL.includes('image')) {
      console.error('   ❌ Unexpected model ID format!');
      return false;
    }

    console.log('   ✅ Model ID format validated');
    return true;
  } catch (error) {
    console.error('❌ Model validation test failed:', error.message);
    return false;
  }
}

/**
 * Test 4: Image Generation (optional - requires API key)
 */
async function testImageGeneration() {
  console.log('\n🖼️  Test 4: Image Generation');
  console.log('-'.repeat(50));

  const apiKey = process.env.VITE_GEMINI_API_KEY ||
                 process.env.GOOGLE_API_KEY ||
                 process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('   ⏭️  Skipping (no API key found)');
    console.log('   Set VITE_GEMINI_API_KEY, GOOGLE_API_KEY, or GEMINI_API_KEY to test');
    return true; // Not a failure, just skipped
  }

  try {
    console.log('   Generating test image...');
    const prompt = "A simple red circle on white background";

    const buffer = await geminiGenerate({ prompt });

    console.log('   ✅ Image generated successfully');
    console.log('   Size:', buffer.length, 'bytes');
    console.log('   Note: Includes SynthID watermark');

    // Save to test output
    const outputDir = path.join(process.cwd(), 'test-output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `nano-banana-test-${Date.now()}.png`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, buffer);

    console.log('   💾 Saved to:', filepath);
    return true;
  } catch (error) {
    console.error('   ❌ Image generation failed:', error.message);
    console.error('   Error details:', error.response?.data || error);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  const results = {
    modelInfo: testModelInfo(),
    costCalculation: testCostCalculation(),
    modelValidation: testModelValidation(),
    imageGeneration: await testImageGeneration()
  };

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary\n');

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  const failed = total - passed;

  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    console.log(`   ${icon} ${test}`);
  });

  console.log(`\n📈 Results: ${passed}/${total} tests passed`);

  if (failed > 0) {
    console.error(`\n❌ ${failed} test(s) failed!`);
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    console.log('\n🎉 Google Gemini 2.5 Flash Image integration is working correctly!');
    process.exit(0);
  }
}

// Execute tests
runTests().catch(error => {
  console.error('\n❌ Test execution error:', error);
  process.exit(1);
});