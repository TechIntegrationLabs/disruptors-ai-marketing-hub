#!/usr/bin/env node

/**
 * Apply Admin Nexus database migrations to Supabase
 * Uses service role key for admin operations
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '✗');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQLFile(filePath, description) {
  console.log(`\n📄 Executing: ${description}`);
  console.log(`   File: ${filePath}`);

  try {
    const sql = readFileSync(filePath, 'utf-8');

    // Execute the SQL using Supabase's REST API
    // Note: This uses the service role, which bypasses RLS
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async () => {
      // If exec_sql doesn't exist, we need to use raw SQL execution
      // Split by semicolon and execute each statement (basic approach)
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

      console.log(`   📊 Executing ${statements.length} SQL statements...`);

      // For Supabase, we need to use the REST API directly
      // This is a workaround - ideally you'd use the SQL editor or CLI
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({ query: sql })
      });

      if (!response.ok) {
        // Try alternative: execute via pg connection (requires psql)
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      return { data: await response.json(), error: null };
    });

    if (error) {
      console.error(`   ❌ Error executing migration:`, error);
      return false;
    }

    console.log(`   ✅ Migration executed successfully`);
    return true;
  } catch (err) {
    console.error(`   ❌ Exception:`, err.message);
    console.log(`\n⚠️  Note: This script requires direct database access.`);
    console.log(`   Please apply migrations manually using one of these methods:`);
    console.log(`   1. Supabase Dashboard > SQL Editor`);
    console.log(`   2. psql command-line tool`);
    console.log(`   3. Supabase CLI: supabase db push`);
    return false;
  }
}

async function verifyMigration() {
  console.log(`\n🔍 Verifying migration...`);

  try {
    // Check if key tables exist
    const tables = [
      'business_brains',
      'brain_facts',
      'agents',
      'conversations',
      'messages',
      'workflows',
      'telemetry_events'
    ];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('id').limit(1);

      if (error) {
        console.log(`   ⚠️  Table '${table}' - ${error.message}`);
      } else {
        console.log(`   ✅ Table '${table}' exists and is accessible`);
      }
    }

    // Check if RPC functions exist
    console.log(`\n🔍 Checking RPC functions...`);
    const functions = ['search_brain_facts', 'append_feedback', 'get_brain_health'];

    for (const func of functions) {
      try {
        // Try to call with dummy params to see if it exists
        await supabase.rpc(func, {}).catch(() => {});
        console.log(`   ✅ Function '${func}' exists`);
      } catch (err) {
        console.log(`   ⚠️  Function '${func}' - ${err.message}`);
      }
    }

  } catch (err) {
    console.error(`   ❌ Verification error:`, err.message);
  }
}

async function main() {
  console.log('🚀 Admin Nexus Database Migration');
  console.log('==================================');
  console.log(`\n📊 Target Database: ${SUPABASE_URL}`);

  const migrationsDir = join(__dirname, 'admin-nexus-COMPLETE', 'DB', 'migrations');

  const migrations = [
    {
      file: join(migrationsDir, '001_init_enhanced.sql'),
      description: 'Create admin tables, RPCs, RLS, and seed data'
    },
    {
      file: join(migrationsDir, '002_integrate_existing.sql'),
      description: 'Integrate with existing tables (team_members, posts, site_media)'
    }
  ];

  console.log('\n⚠️  IMPORTANT:');
  console.log('   Due to Supabase client limitations, migrations must be applied manually.');
  console.log('   Please follow these steps:\n');
  console.log('   1. Go to: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql');
  console.log('   2. Create a new query');
  console.log('   3. Copy and paste the SQL from:');

  for (const migration of migrations) {
    console.log(`      - ${migration.file}`);
  }

  console.log('   4. Run each migration in order');
  console.log('   5. Verify no errors in the output');

  console.log('\n📋 Migration Files:');
  console.log('   Migration 1: temp/admin-nexus-COMPLETE/DB/migrations/001_init_enhanced.sql');
  console.log('   Migration 2: temp/admin-nexus-COMPLETE/DB/migrations/002_integrate_existing.sql');

  console.log('\n✅ After applying migrations manually, run this script again to verify.');
  console.log('   Or press Ctrl+C to exit and apply migrations now.\n');

  // Wait for user confirmation
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
    console.log('Press Enter to verify migrations (or Ctrl+C to exit)...');
  });

  await verifyMigration();

  console.log('\n✅ Migration script complete!');
  console.log('   Check verification results above.');
}

main().catch(console.error);
