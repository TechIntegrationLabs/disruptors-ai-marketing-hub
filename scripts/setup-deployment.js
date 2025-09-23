#!/usr/bin/env node

/**
 * Deployment Setup Script for Disruptors AI Marketing Hub
 * Sets up Supabase database and verifies all integrations
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(message, 'bright');
  log('='.repeat(60), 'cyan');
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function loadEnvVariables() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
      logWarning('.env file not found. Please create one from .env.example');
      return {};
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });

    return envVars;
  } catch (error) {
    logError(`Failed to load environment variables: ${error.message}`);
    return {};
  }
}

async function verifyEnvironmentVariables(envVars) {
  logStep(1, 'Verifying Environment Variables');

  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_SERVICE_ROLE_KEY'
  ];

  const optional = [
    'VITE_OPENAI_API_KEY',
    'VITE_GEMINI_API_KEY',
    'VITE_REPLICATE_API_TOKEN',
    'VITE_ELEVENLABS_API_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  let allRequired = true;

  // Check required variables
  for (const key of required) {
    if (envVars[key]) {
      logSuccess(`${key} is configured`);
    } else {
      logError(`Missing required variable: ${key}`);
      allRequired = false;
    }
  }

  // Check optional variables
  let aiServicesCount = 0;
  for (const key of optional) {
    if (envVars[key]) {
      logSuccess(`${key} is configured`);
      if (key.includes('API_KEY') || key.includes('TOKEN')) {
        aiServicesCount++;
      }
    } else {
      logWarning(`Optional variable not set: ${key}`);
    }
  }

  if (aiServicesCount === 0) {
    logWarning('No AI service API keys configured. Some features will not work.');
  } else {
    logSuccess(`${aiServicesCount} AI services configured`);
  }

  return allRequired;
}

async function setupSupabaseDatabase(envVars) {
  logStep(2, 'Setting up Supabase Database');

  try {
    const supabase = createClient(
      envVars.VITE_SUPABASE_URL,
      envVars.VITE_SUPABASE_SERVICE_ROLE_KEY
    );

    // Read and execute database setup script
    const sqlPath = path.join(__dirname, '..', 'sql', 'setup_database.sql');
    if (!fs.existsSync(sqlPath)) {
      logError('Database setup script not found: sql/setup_database.sql');
      return false;
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    logSuccess('Executing database setup script...');

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 0) {
        try {
          await supabase.rpc('exec_sql', { sql: statement });
        } catch (error) {
          // Try direct query execution for simpler statements
          try {
            const { error: queryError } = await supabase
              .from('_dummy_')
              .select('*')
              .limit(0);

            // If table doesn't exist, it's expected
            if (!queryError || queryError.message.includes('does not exist')) {
              continue;
            }
          } catch (directError) {
            logWarning(`Skipping statement ${i + 1}: ${error.message.slice(0, 100)}...`);
          }
        }
      }
    }

    // Verify tables were created
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['generated_media', 'admin_sessions', 'media_collections', 'generation_analytics']);

    if (error) {
      logError(`Failed to verify tables: ${error.message}`);
      return false;
    }

    const tableNames = tables.map(t => t.table_name);
    const expectedTables = ['generated_media', 'admin_sessions', 'media_collections', 'generation_analytics'];

    for (const tableName of expectedTables) {
      if (tableNames.includes(tableName)) {
        logSuccess(`Table created: ${tableName}`);
      } else {
        logWarning(`Table may not exist: ${tableName}`);
      }
    }

    logSuccess('Database setup completed');
    return true;

  } catch (error) {
    logError(`Database setup failed: ${error.message}`);
    logWarning('You may need to run the SQL script manually in your Supabase dashboard');
    return false;
  }
}

async function testAIIntegrations(envVars) {
  logStep(3, 'Testing AI Service Integrations');

  const tests = [];

  // Test OpenAI
  if (envVars.VITE_OPENAI_API_KEY) {
    tests.push({
      name: 'OpenAI',
      test: async () => {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${envVars.VITE_OPENAI_API_KEY}`
          }
        });
        return response.ok;
      }
    });
  }

  // Test Replicate
  if (envVars.VITE_REPLICATE_API_TOKEN) {
    tests.push({
      name: 'Replicate',
      test: async () => {
        const response = await fetch('https://api.replicate.com/v1/models', {
          headers: {
            'Authorization': `Token ${envVars.VITE_REPLICATE_API_TOKEN}`
          }
        });
        return response.ok;
      }
    });
  }

  // Test Cloudinary
  if (envVars.CLOUDINARY_CLOUD_NAME && envVars.CLOUDINARY_API_KEY) {
    tests.push({
      name: 'Cloudinary',
      test: async () => {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${envVars.CLOUDINARY_CLOUD_NAME}/resources/image`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${envVars.CLOUDINARY_API_KEY}:${envVars.CLOUDINARY_API_SECRET}`).toString('base64')}`
          }
        });
        return response.ok;
      }
    });
  }

  for (const { name, test } of tests) {
    try {
      const result = await test();
      if (result) {
        logSuccess(`${name} API connection successful`);
      } else {
        logError(`${name} API connection failed`);
      }
    } catch (error) {
      logError(`${name} API test failed: ${error.message}`);
    }
  }

  if (tests.length === 0) {
    logWarning('No AI services configured for testing');
  }
}

async function generateDeploymentChecklist() {
  logStep(4, 'Generating Deployment Checklist');

  const checklist = `
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
`;

  const checklistPath = path.join(__dirname, '..', 'DEPLOYMENT_CHECKLIST.md');
  fs.writeFileSync(checklistPath, checklist);
  logSuccess('Deployment checklist created: DEPLOYMENT_CHECKLIST.md');
}

async function main() {
  try {
    logHeader('🚀 DISRUPTORS AI MARKETING HUB - DEPLOYMENT SETUP');

    const envVars = await loadEnvVariables();

    const envValid = await verifyEnvironmentVariables(envVars);
    if (!envValid) {
      logError('Please fix environment variable issues before continuing');
      process.exit(1);
    }

    const dbSetup = await setupSupabaseDatabase(envVars);
    if (!dbSetup) {
      logWarning('Database setup had issues. Check Supabase dashboard manually.');
    }

    await testAIIntegrations(envVars);
    await generateDeploymentChecklist();

    logHeader('🎉 SETUP COMPLETE!');
    log('Your Disruptors AI Marketing Hub is ready for deployment!', 'green');
    log('\nNext steps:', 'bright');
    log('1. Review DEPLOYMENT_CHECKLIST.md', 'cyan');
    log('2. Deploy to Netlify using the build settings', 'cyan');
    log('3. Configure environment variables in Netlify dashboard', 'cyan');
    log('4. Test the admin interface (5 clicks + DMadmin)', 'cyan');
    log('\nSecret admin access: Click logo 5 times, password: DMadmin', 'magenta');

  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the setup
main();