#!/usr/bin/env node
/**
 * Model Usage Validation Script
 *
 * Scans the codebase for forbidden model usage (DALL-E)
 * and ensures only approved models are referenced.
 *
 * Usage: node scripts/validate-model-usage.js
 * Or: npm run validate:models
 *
 * Exit codes:
 * - 0: No issues found
 * - 1: Forbidden models detected
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
  'dall-e-3',
  'dall-e-2',
  'dalle-3',
  'dalle-2',
  'DALL-E',
  'dall_e'
];

const APPROVED_MODELS = [
  'gpt-image-1',
  'gemini-2.5-flash-image-preview',
  'black-forest-labs/flux-1.1-pro'
];

const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.md'];

const IGNORE_PATHS = [
  'node_modules/',
  '.git/',
  'dist/',
  'build/',
  'coverage/',
  '.next/',
  'archive/',
  'legacy/'
];

console.log('🔍 Validating image generation model usage...\n');

/**
 * Scan for forbidden patterns using git grep
 */
function scanForForbiddenModels() {
  const results = [];
  const extensionsPattern = FILE_EXTENSIONS.map(ext => `*${ext}`).join(' ');

  for (const pattern of FORBIDDEN_PATTERNS) {
    try {
      // Use git grep to search for patterns
      const command = `git grep -n -i "${pattern}" -- "${extensionsPattern}"`;
      const output = execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });

      if (output) {
        const matches = output.trim().split('\n').filter(line => {
          // Filter out ignore paths
          return !IGNORE_PATHS.some(ignorePath => line.startsWith(ignorePath));
        });

        if (matches.length > 0) {
          results.push({
            pattern,
            matches
          });
        }
      }
    } catch (error) {
      // No matches found (exit code 1 from git grep) is good
      if (error.status !== 1) {
        console.error(`Error searching for "${pattern}":`, error.message);
      }
    }
  }

  return results;
}

/**
 * Check if forbidden patterns are in comments or documentation
 */
function analyzeMatch(match) {
  const [file, ...rest] = match.split(':');
  const content = rest.join(':');

  // Check if it's in a comment or documentation
  const isComment = /^\s*(\/\/|\/\*|\*|#)/.test(content) ||
                    content.includes('FORBIDDEN') ||
                    content.includes('DO NOT USE') ||
                    content.includes('blocked') ||
                    content.includes('throw') ||
                    content.includes('error');

  return {
    file,
    content,
    isComment,
    severity: isComment ? 'info' : 'error'
  };
}

/**
 * Display results and exit with appropriate code
 */
function displayResults(results) {
  if (results.length === 0) {
    console.log('✅ Model validation passed!');
    console.log('   No forbidden DALL-E models detected in codebase.\n');
    console.log('📋 Approved models:');
    APPROVED_MODELS.forEach(model => {
      console.log(`   ✓ ${model}`);
    });
    return 0;
  }

  console.error('❌ FORBIDDEN MODEL USAGE DETECTED!\n');

  let hasErrors = false;

  results.forEach(({ pattern, matches }) => {
    console.error(`\n🚫 Pattern found: "${pattern}"`);
    console.error(`   Found in ${matches.length} location(s):\n`);

    matches.forEach(match => {
      const analysis = analyzeMatch(match);

      if (analysis.severity === 'error') {
        hasErrors = true;
        console.error(`   ❌ ${match}`);
      } else {
        console.error(`   ℹ️  ${match} (in comment/docs - OK)`);
      }
    });
  });

  if (hasErrors) {
    console.error('\n❌ VALIDATION FAILED!\n');
    console.error('Only these models are approved:');
    APPROVED_MODELS.forEach(model => {
      console.error(`  ✅ ${model}`);
    });
    console.error('\n🚫 DALL-E models are absolutely forbidden!');
    console.error('   Remove all DALL-E references from active code.\n');
    return 1;
  } else {
    console.log('\n✅ Validation passed!');
    console.log('   DALL-E references found only in comments/documentation (OK)\n');
    return 0;
  }
}

/**
 * Main execution
 */
try {
  const results = scanForForbiddenModels();
  const exitCode = displayResults(results);
  process.exit(exitCode);
} catch (error) {
  console.error('❌ Validation script error:', error.message);
  process.exit(1);
}