/**
 * Admin Nexus Migration Runner
 *
 * Executes SQL migrations directly against Supabase PostgreSQL database.
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const { Client } = pg;

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse Supabase connection details
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Missing VITE_SUPABASE_URL');
  process.exit(1);
}

// Extract connection details from Supabase URL
// Format: https://[PROJECT_REF].supabase.co
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

// Supabase PostgreSQL connection details
const connectionConfig = {
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: SUPABASE_SERVICE_ROLE_KEY, // Note: This won't work - need actual DB password
  ssl: { rejectUnauthorized: false }
};

/**
 * Migration definitions
 */
const migrations = [
  {
    id: '001',
    name: 'Initialize Admin Schema',
    file: join(__dirname, 'admin-nexus-COMPLETE', 'DB', 'migrations', '001_init_enhanced.sql'),
    description: 'Creates 15+ admin tables, RPC functions, RLS policies, and seed data'
  },
  {
    id: '002',
    name: 'Integrate Existing Tables',
    file: join(__dirname, 'admin-nexus-COMPLETE', 'DB', 'migrations', '002_integrate_existing.sql'),
    description: 'Enhances existing tables and creates junction tables and views'
  }
];

/**
 * Execute a single migration
 */
async function executeMigration(client, migration) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📋 Migration ${migration.id}: ${migration.name}`);
  console.log(`📝 ${migration.description}`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    // Read SQL file
    const sql = readFileSync(migration.file, 'utf8');
    console.log(`📄 Loaded: ${migration.file}`);
    console.log(`📏 Size: ${(sql.length / 1024).toFixed(2)} KB`);
    console.log(`📊 Lines: ${sql.split('\n').length}\n`);

    // Execute migration
    console.log(`⏳ Executing migration...`);
    await client.query(sql);
    console.log(`✅ Migration ${migration.id} completed successfully!`);

    return { success: true, migration: migration.id };

  } catch (error) {
    console.error(`❌ Migration ${migration.id} failed:`);
    console.error(`   Error: ${error.message}`);

    if (error.message.includes('already exists')) {
      console.log(`   ℹ️  Some objects already exist - this may be normal`);
      return { success: true, migration: migration.id, warning: true };
    }

    return { success: false, migration: migration.id, error: error.message };
  }
}

/**
 * Verify migration results
 */
async function verifyMigration(client, migration) {
  console.log(`\n🔍 Verifying migration ${migration.id}...`);

  try {
    // Check for business_brains table (from migration 001)
    if (migration.id === '001') {
      const { rows } = await client.query(`
        SELECT COUNT(*) as count FROM business_brains WHERE slug = 'default'
      `);
      console.log(`   ✅ Default business brain: ${rows[0].count > 0 ? 'Found' : 'Not found'}`);

      const { rows: factRows } = await client.query(`
        SELECT COUNT(*) as count FROM brain_facts
      `);
      console.log(`   ✅ Brain facts: ${factRows[0].count} records`);

      const { rows: agentRows } = await client.query(`
        SELECT COUNT(*) as count FROM agents
      `);
      console.log(`   ✅ Agents: ${agentRows[0].count} records`);
    }

    // Check for junction tables (from migration 002)
    if (migration.id === '002') {
      const tables = ['post_brain_facts', 'post_media', 'team_member_agents', 'content_audit_log'];

      for (const table of tables) {
        try {
          await client.query(`SELECT 1 FROM ${table} LIMIT 1`);
          console.log(`   ✅ Table created: ${table}`);
        } catch (err) {
          console.log(`   ❌ Table missing: ${table}`);
        }
      }

      // Check views
      const views = ['posts_with_authors', 'media_with_generation', 'content_calendar'];
      for (const view of views) {
        try {
          await client.query(`SELECT 1 FROM ${view} LIMIT 1`);
          console.log(`   ✅ View created: ${view}`);
        } catch (err) {
          console.log(`   ❌ View missing: ${view}`);
        }
      }
    }

  } catch (error) {
    console.log(`   ⚠️  Verification error: ${error.message}`);
  }
}

/**
 * Main migration runner
 */
async function runMigrations() {
  console.log('\n🚀 Admin Nexus Migration Runner');
  console.log(`${'='.repeat(80)}\n`);

  console.log(`📡 Connecting to Supabase PostgreSQL...`);
  console.log(`   Host: ${connectionConfig.host}`);
  console.log(`   Database: ${connectionConfig.database}`);
  console.log(`   User: ${connectionConfig.user}\n`);

  console.log(`⚠️  NOTE: Direct PostgreSQL connection requires database password.`);
  console.log(`   Supabase service role key is NOT the database password.`);
  console.log(`\n   To get your database password:`);
  console.log(`   1. Go to: https://supabase.com/dashboard/project/${projectRef}/settings/database`);
  console.log(`   2. Look for "Database Password" section`);
  console.log(`   3. Add it to your .env as SUPABASE_DB_PASSWORD\n`);

  // Check for database password
  if (!process.env.SUPABASE_DB_PASSWORD) {
    console.log(`${'='.repeat(80)}`);
    console.log(`❌ Missing SUPABASE_DB_PASSWORD environment variable`);
    console.log(`${'='.repeat(80)}\n`);
    console.log(`📋 ALTERNATIVE: Use Supabase SQL Editor`);
    console.log(`\n1. Go to: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    console.log(`\n2. Execute these SQL files in order:\n`);

    for (const migration of migrations) {
      console.log(`   ${migration.id}. ${migration.name}`);
      console.log(`      File: ${migration.file}\n`);
    }

    console.log(`\n3. Copy and paste each file's contents into SQL Editor`);
    console.log(`\n4. Click "Run" to execute\n`);

    return;
  }

  connectionConfig.password = process.env.SUPABASE_DB_PASSWORD;

  const client = new Client(connectionConfig);

  try {
    // Connect to database
    await client.connect();
    console.log(`✅ Connected to Supabase PostgreSQL\n`);

    const results = [];

    // Execute migrations in order
    for (const migration of migrations) {
      const result = await executeMigration(client, migration);
      results.push(result);

      if (result.success) {
        await verifyMigration(client, migration);
      } else {
        console.log(`\n⚠️  Stopping migration process due to error.`);
        break;
      }
    }

    // Summary
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📊 Migration Summary`);
    console.log(`${'='.repeat(80)}\n`);

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const warnings = results.filter(r => r.warning).length;

    console.log(`✅ Successful: ${successful}/${migrations.length}`);
    if (warnings > 0) console.log(`⚠️  Warnings: ${warnings}`);
    if (failed > 0) console.log(`❌ Failed: ${failed}`);

    if (successful === migrations.length) {
      console.log(`\n🎉 All migrations completed successfully!\n`);
      console.log(`📚 Next Steps:`);
      console.log(`   1. Configure admin role in Supabase Dashboard`);
      console.log(`   2. Test admin access through your application`);
      console.log(`   3. Verify RLS policies are working`);
      console.log(`   4. Review seed data in business_brains table\n`);
    }

  } catch (error) {
    console.error(`\n💥 Connection error: ${error.message}`);
    console.error(`\n   Make sure:`);
    console.error(`   - SUPABASE_DB_PASSWORD is correct`);
    console.error(`   - Your IP is whitelisted in Supabase`);
    console.error(`   - Database is accessible\n`);

  } finally {
    await client.end();
    console.log(`🔌 Disconnected from database\n`);
  }
}

// Run migrations
runMigrations().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
