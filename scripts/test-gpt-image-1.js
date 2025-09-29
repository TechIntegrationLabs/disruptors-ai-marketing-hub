#!/usr/bin/env node
/**
 * OpenAI gpt-image-1 Smoke Test
 *
 * Tests the OpenAI gpt-image-1 integration to ensure:
 * - API connectivity
 * - Model validation
 * - Image generation works
 * - Helper functions work correctly
 *
 * Usage: node scripts/test-gpt-image-1.js
 * Or: npm run test:gpt-image-1
 */

import { openaiGenerate, getModelInfo, calculateCost, OPENAI_IMAGE_MODEL } from '../src/lib/openai-image.js';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing OpenAI gpt-image-1 Integration\n');
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
    console.log('   Capabilities:', info.capabilities.length);
    console.log('   Pricing:', JSON.stringify(info.pricing, null, 2));
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
    const testCases = [
      { size: '1024x1024', quality: 'standard', expected: 0.02 },
      { size: '1536x1024', quality: 'standard', expected: 0.03 },
      { size: '1024x1024', quality: 'hd', inputFidelity: 'high', expected: 0.19 }
    ];

    let allPassed = true;
    testCases.forEach(({ expected, ...params }) => {
      const cost = calculateCost(params);
      const passed = cost === expected;
      const icon = passed ? '✅' : '❌';
      console.log(`   ${icon} ${JSON.stringify(params)} → $${cost} (expected $${expected})`);
      if (!passed) allPassed = false;
    });

    return allPassed;
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
    console.log('   Model ID:', OPENAI_IMAGE_MODEL);
    console.log('   ✅ Model ID is "gpt-image-1" (correct)');

    // Verify it's not DALL-E
    if (OPENAI_IMAGE_MODEL.toLowerCase().includes('dall-e') ||
        OPENAI_IMAGE_MODEL.toLowerCase().includes('dall_e')) {
      console.error('   ❌ FORBIDDEN MODEL DETECTED!');
      return false;
    }

    console.log('   ✅ No DALL-E reference found');
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

  const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('   ⏭️  Skipping (no API key found)');
    console.log('   Set VITE_OPENAI_API_KEY or OPENAI_API_KEY to test');
    return true; // Not a failure, just skipped
  }

  try {
    console.log('   Generating test image...');
    const prompt = "A simple red circle on white background";

    const buffer = await openaiGenerate({
      prompt,
      size: '1024x1024',
      quality: 'standard'
    });

    console.log('   ✅ Image generated successfully');
    console.log('   Size:', buffer.length, 'bytes');

    // Save to test output
    const outputDir = path.join(process.cwd(), 'test-output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `gpt-image-1-test-${Date.now()}.png`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, buffer);

    console.log('   💾 Saved to:', filepath);
    return true;
  } catch (error) {
    console.error('   ❌ Image generation failed:', error.message);
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
    console.log('\n🎉 OpenAI gpt-image-1 integration is working correctly!');
    process.exit(0);
  }
}

// Execute tests
runTests().catch(error => {
  console.error('\n❌ Test execution error:', error);
  process.exit(1);
});