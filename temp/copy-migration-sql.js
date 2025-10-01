/**
 * Copy Migration SQL to Clipboard
 *
 * This script reads migration files and provides instructions for manual execution.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

console.log('\n🚀 Admin Nexus Migration SQL Generator');
console.log(`${'='.repeat(80)}\n`);

console.log(`📋 INSTRUCTIONS FOR SUPABASE SQL EDITOR`);
console.log(`\n1. Open: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb/sql/new\n`);
console.log(`2. For each migration below, copy the ENTIRE SQL content`);
console.log(`3. Paste into SQL Editor`);
console.log(`4. Click "Run" to execute`);
console.log(`5. Verify success before moving to next migration\n`);

const migrationNumber = process.argv[2] || '1';

if (migrationNumber === '1' || migrationNumber === '001') {
  const migration = migrations[0];
  console.log(`${'='.repeat(80)}`);
  console.log(`MIGRATION ${migration.id}: ${migration.name}`);
  console.log(`${'='.repeat(80)}\n`);
  console.log(migration.description);
  console.log(`\n${'─'.repeat(80)}\n`);

  const sql = readFileSync(migration.file, 'utf8');
  console.log(sql);

  console.log(`\n${'─'.repeat(80)}`);
  console.log(`✅ Copy the SQL above and execute in Supabase SQL Editor`);
  console.log(`\n📊 Stats:`);
  console.log(`   - Size: ${(sql.length / 1024).toFixed(2)} KB`);
  console.log(`   - Lines: ${sql.split('\n').length}`);
  console.log(`\n📚 After executing, run: node temp/copy-migration-sql.js 2`);
  console.log(`${'─'.repeat(80)}\n`);

} else if (migrationNumber === '2' || migrationNumber === '002') {
  const migration = migrations[1];
  console.log(`${'='.repeat(80)}`);
  console.log(`MIGRATION ${migration.id}: ${migration.name}`);
  console.log(`${'='.repeat(80)}\n`);
  console.log(migration.description);
  console.log(`\n${'─'.repeat(80)}\n`);

  const sql = readFileSync(migration.file, 'utf8');
  console.log(sql);

  console.log(`\n${'─'.repeat(80)}`);
  console.log(`✅ Copy the SQL above and execute in Supabase SQL Editor`);
  console.log(`\n📊 Stats:`);
  console.log(`   - Size: ${(sql.length / 1024).toFixed(2)} KB`);
  console.log(`   - Lines: ${sql.split('\n').length}`);
  console.log(`\n🎉 This is the final migration!`);
  console.log(`${'─'.repeat(80)}\n`);

} else {
  console.log(`❌ Invalid migration number. Use: 1 or 2`);
  process.exit(1);
}
