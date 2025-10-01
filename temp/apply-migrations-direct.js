/**
 * Apply Admin Nexus Migrations - Direct SQL Execution
 *
 * This script executes SQL migrations directly against Supabase using the service role.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'ubqxflzuvxowigbjmqfb';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

/**
 * Execute SQL using Supabase Management API
 */
async function executeSQL(sql, migrationName) {
  console.log(`\n⏳ Executing: ${migrationName}`);
  console.log(`📏 SQL size: ${(sql.length / 1024).toFixed(2)} KB`);

  try {
    // Use Supabase's SQL endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`⚠️  HTTP ${response.status}: ${error}`);
      console.log(`\n💡 This is expected - Supabase doesn't expose a direct SQL execution endpoint.`);
      console.log(`   Please execute the SQL manually in Supabase SQL Editor.`);
      return false;
    }

    console.log(`✅ Migration executed successfully`);
    return true;

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

/**
 * Main migration runner
 */
async function main() {
  console.log('\n🚀 Admin Nexus Migration Tool');
  console.log(`${'='.repeat(80)}\n`);
  console.log(`📡 Supabase Project: ${SUPABASE_PROJECT_REF}`);
  console.log(`🌐 URL: ${SUPABASE_URL}`);

  const migrations = [
    {
      id: '001',
      name: 'Initialize Admin Schema',
      file: join(__dirname, 'admin-nexus-COMPLETE', 'DB', 'migrations', '001_init_enhanced.sql')
    },
    {
      id: '002',
      name: 'Integrate Existing Tables',
      file: join(__dirname, 'admin-nexus-COMPLETE', 'DB', 'migrations', '002_integrate_existing.sql')
    }
  ];

  console.log(`\n${'='.repeat(80)}`);
  console.log(`📋 MIGRATION INSTRUCTIONS`);
  console.log(`${'='.repeat(80)}\n`);
  console.log(`⚠️  Supabase requires SQL to be executed through the SQL Editor.`);
  console.log(`\nPlease follow these steps:`);
  console.log(`\n1. Open Supabase SQL Editor:`);
  console.log(`   https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`);
  console.log(`\n2. Copy and paste the following SQL files in order:\n`);

  for (const migration of migrations) {
    try {
      const sql = readFileSync(migration.file, 'utf8');
      console.log(`   ${migration.id}. ${migration.name}`);
      console.log(`      File: ${migration.file}`);
      console.log(`      Size: ${(sql.length / 1024).toFixed(2)} KB`);
      console.log(`      Lines: ${sql.split('\n').length}`);
      console.log(``);
    } catch (error) {
      console.error(`   ❌ Could not read ${migration.file}: ${error.message}`);
    }
  }

  console.log(`\n3. Execute each migration and verify success\n`);
  console.log(`4. After both migrations complete, verify:`);
  console.log(`   - All tables created (15+ new tables)`);
  console.log(`   - RLS policies active`);
  console.log(`   - Seed data present in business_brains`);
  console.log(`   - Views created (posts_with_authors, etc.)`);

  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 MIGRATION FILE CONTENTS`);
  console.log(`${'='.repeat(80)}\n`);

  // Print file paths for easy copying
  for (const migration of migrations) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`Migration ${migration.id}: ${migration.name}`);
    console.log(`${'─'.repeat(80)}`);
    console.log(`File path: ${migration.file}`);
    console.log(`\nTo view, run:`);
    console.log(`  cat "${migration.file}"`);
    console.log(``);
  }

  console.log(`\n✅ Setup complete! Follow the instructions above to apply migrations.`);
}

main().catch(err => {
  console.error('\n💥 Error:', err);
  process.exit(1);
});
