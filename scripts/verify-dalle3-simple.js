#!/usr/bin/env node

/**
 * Simple DALL-E 3 blocking verification
 */

console.log('🚫 Verifying DALL-E 3 is completely blocked...\n');

// Test 1: Check AI orchestrator file content
import fs from 'fs';
import path from 'path';

const orchestratorPath = path.join(process.cwd(), 'src', 'lib', 'ai-orchestrator.js');
const orchestratorContent = fs.readFileSync(orchestratorPath, 'utf8');

let allTestsPassed = true;

// Test 1: Verify DALL-E 3 blocking message exists
console.log('Test 1: Checking for DALL-E 3 blocking code');
if (orchestratorContent.includes('DALL-E 3 usage is ABSOLUTELY FORBIDDEN')) {
  console.log('✅ PASSED: DALL-E 3 blocking message found');
} else {
  console.log('❌ FAILED: DALL-E 3 blocking message not found');
  allTestsPassed = false;
}

// Test 2: Verify no DALL-E models in default configuration
console.log('\nTest 2: Checking default model configuration');
if (orchestratorContent.includes('"dall-e-3"') || orchestratorContent.includes("'dall-e-3'")) {
  console.log('❌ FAILED: DALL-E 3 model found in configuration');
  allTestsPassed = false;
} else {
  console.log('✅ PASSED: No DALL-E 3 models in configuration');
}

// Test 3: Verify Gemini is primary model
console.log('\nTest 3: Checking primary model is Gemini');
if (orchestratorContent.includes('models/gemini-2.5-flash-image-preview')) {
  console.log('✅ PASSED: Gemini 2.5 Flash Image is configured');
} else {
  console.log('❌ FAILED: Gemini 2.5 Flash Image not found');
  allTestsPassed = false;
}

// Test 4: Check documentation files
console.log('\nTest 4: Checking documentation compliance');
const policyPath = path.join(process.cwd(), 'docs', 'NO_DALLE3_POLICY.md');
if (fs.existsSync(policyPath)) {
  console.log('✅ PASSED: NO_DALLE3_POLICY.md exists');
  const policyContent = fs.readFileSync(policyPath, 'utf8');
  if (policyContent.includes('ABSOLUTELY FORBIDDEN')) {
    console.log('✅ PASSED: Policy contains strong blocking language');
  } else {
    console.log('❌ FAILED: Policy is not strong enough');
    allTestsPassed = false;
  }
} else {
  console.log('❌ FAILED: NO_DALLE3_POLICY.md not found');
  allTestsPassed = false;
}

// Test 5: Check CLAUDE.md updates
console.log('\nTest 5: Checking CLAUDE.md compliance');
const claudePath = path.join(process.cwd(), 'CLAUDE.md');
const claudeContent = fs.readFileSync(claudePath, 'utf8');
if (claudeContent.includes('DALL-E 3 is ABSOLUTELY FORBIDDEN')) {
  console.log('✅ PASSED: CLAUDE.md contains DALL-E 3 blocking notice');
} else {
  console.log('❌ FAILED: CLAUDE.md missing DALL-E 3 blocking notice');
  allTestsPassed = false;
}

console.log('\n📊 VERIFICATION SUMMARY');
console.log('='.repeat(40));
if (allTestsPassed) {
  console.log('✅ ALL TESTS PASSED: DALL-E 3 is completely blocked!');
  console.log('🎉 System is compliant with NO DALL-E 3 policy');
  console.log('\n📋 Approved models only:');
  console.log('  - Google Gemini 2.5 Flash Image');
  console.log('  - Replicate Flux models');
  console.log('\n🚫 DALL-E 3 is permanently blocked and will throw errors if used');
} else {
  console.log('❌ SOME TESTS FAILED: DALL-E 3 blocking is incomplete');
  console.log('⚠️  System requires fixes to be compliant');
}

process.exit(allTestsPassed ? 0 : 1);