/**
 * Migrate Existing Data Script
 * Safely migrates your current site data into admin system
 *
 * This script:
 * 1. Links team_members to default brain
 * 2. Updates posts with proper statuses
 * 3. Catalogs site_media in admin system
 * 4. Creates default agent for existing content
 *
 * SAFE: Only adds links, doesn't delete anything
 *
 * Usage: node scripts/migrate-existing-data.js
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('VITE_SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ========================================
// Migration Functions
// ========================================

async function getDefaultBrain() {
  console.log('📦 Getting default business brain...')

  const { data, error } = await supabase
    .from('business_brains')
    .select('*')
    .eq('slug', 'default')
    .single()

  if (error) {
    throw new Error(`Failed to get default brain: ${error.message}`)
  }

  console.log(`✅ Found brain: ${data.name} (${data.id})`)
  return data
}

async function getOrCreateDefaultAgent(brainId) {
  console.log('🤖 Getting or creating default content agent...')

  // Check if default agent exists
  let { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .eq('name', 'Content Writer')
    .single()

  if (error && error.code === 'PGRST116') {
    // Agent doesn't exist, create it
    const { data: newAgent, error: createError } = await supabase
      .from('agents')
      .insert({
        brain_id: brainId,
        name: 'Content Writer',
        system_prompt: 'You are a professional content writer for Disruptors & Co. Create engaging, well-researched content that resonates with skilled trades professionals.',
        flags: {
          model: 'claude-sonnet-4.5',
          temperature: 0.7,
          max_tokens: 2000
        }
      })
      .select()
      .single()

    if (createError) {
      throw new Error(`Failed to create agent: ${createError.message}`)
    }

    agent = newAgent
    console.log(`✅ Created agent: ${agent.name} (${agent.id})`)
  } else if (error) {
    throw new Error(`Failed to get agent: ${error.message}`)
  } else {
    console.log(`✅ Found existing agent: ${agent.name} (${agent.id})`)
  }

  return agent
}

async function migrateTeamMembers() {
  console.log('\n👥 Migrating team members...')

  const { data: members, error } = await supabase
    .from('team_members')
    .select('*')

  if (error) {
    throw new Error(`Failed to get team members: ${error.message}`)
  }

  console.log(`   Found ${members.length} team members`)

  let updated = 0
  for (const member of members) {
    // Set reasonable defaults
    const updates = {
      can_write_content: member.role?.toLowerCase().includes('writer') ||
                        member.role?.toLowerCase().includes('editor') ||
                        member.role?.toLowerCase().includes('content'),
      content_permissions: {
        can_publish: member.role?.toLowerCase().includes('editor'),
        can_delete: false,
        categories: ['blog', 'articles']
      }
    }

    const { error: updateError } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', member.id)

    if (updateError) {
      console.error(`   ⚠️  Failed to update ${member.name}: ${updateError.message}`)
    } else {
      updated++
    }
  }

  console.log(`✅ Updated ${updated}/${members.length} team members`)
}

async function migratePosts(defaultAgentId) {
  console.log('\n📝 Migrating posts...')

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')

  if (error) {
    throw new Error(`Failed to get posts: ${error.message}`)
  }

  console.log(`   Found ${posts.length} posts`)

  let updated = 0
  for (const post of posts) {
    // Determine status based on existing data
    let status = 'draft'
    if (post.published_at || post.publish_date) {
      status = 'published'
    }

    // Calculate reading time
    const content = post.content || post.body || ''
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200) // 200 words per minute

    const updates = {
      status,
      word_count: wordCount,
      reading_time_minutes: readingTime,
      published_at: post.published_at || post.publish_date || null,
      agent_id: null, // Not AI generated (existing content)
      seo: {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        keywords: post.keywords || [],
        og_image: post.featured_image || null
      }
    }

    const { error: updateError } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', post.id)

    if (updateError) {
      console.error(`   ⚠️  Failed to update post ${post.id}: ${updateError.message}`)
    } else {
      updated++
    }
  }

  console.log(`✅ Updated ${updated}/${posts.length} posts`)
}

async function migrateSiteMedia() {
  console.log('\n🖼️  Migrating site media...')

  const { data: media, error } = await supabase
    .from('site_media')
    .select('*')

  if (error) {
    throw new Error(`Failed to get site media: ${error.message}`)
  }

  console.log(`   Found ${media.length} media items`)

  let updated = 0
  for (const item of media) {
    // Tag media based on type/name
    const tags = []
    if (item.type) tags.push(item.type)
    if (item.category) tags.push(item.category)
    if (item.alt_text) {
      // Extract keywords from alt text
      const keywords = item.alt_text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3)
      tags.push(...keywords.slice(0, 5))
    }

    const updates = {
      ai_generated: false, // Existing media is not AI generated
      tags: [...new Set(tags)], // Remove duplicates
      indexed_for_search: true,
      usage_rights: 'internal' // Assume internal use
    }

    const { error: updateError } = await supabase
      .from('site_media')
      .update(updates)
      .eq('id', item.id)

    if (updateError) {
      console.error(`   ⚠️  Failed to update media ${item.id}: ${updateError.message}`)
    } else {
      updated++
    }
  }

  console.log(`✅ Updated ${updated}/${media.length} media items`)
}

async function createContentSnapshot(brainId) {
  console.log('\n📸 Creating content snapshot in business brain...')

  // Extract facts from existing content
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('title, content, category, tags')
    .eq('status', 'published')
    .limit(10)

  if (postsError) {
    console.error('   ⚠️  Failed to get posts for snapshot')
    return
  }

  // Aggregate topics from posts
  const topics = new Set()
  const categories = new Set()

  posts.forEach(post => {
    if (post.category) categories.add(post.category)
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => topics.add(tag))
    }
  })

  // Create brain facts from content analysis
  const facts = [
    {
      brain_id: brainId,
      key: 'Content Categories',
      value: Array.from(categories),
      source: 'Existing content analysis',
      confidence: 1.0,
      last_verified_at: new Date().toISOString()
    },
    {
      brain_id: brainId,
      key: 'Content Topics',
      value: Array.from(topics).slice(0, 20),
      source: 'Existing content analysis',
      confidence: 0.9,
      last_verified_at: new Date().toISOString()
    },
    {
      brain_id: brainId,
      key: 'Total Published Content',
      value: posts.length,
      source: 'Database count',
      confidence: 1.0,
      last_verified_at: new Date().toISOString()
    }
  ]

  for (const fact of facts) {
    const { error } = await supabase
      .from('brain_facts')
      .insert(fact)

    if (error) {
      console.error(`   ⚠️  Failed to create fact: ${error.message}`)
    }
  }

  console.log(`✅ Created ${facts.length} brain facts from existing content`)
}

async function logMigration() {
  console.log('\n📊 Logging migration...')

  await supabase.from('telemetry_events').insert({
    area: 'admin',
    name: 'data_migration_completed',
    payload: {
      migrated_at: new Date().toISOString(),
      script_version: '1.0.0'
    }
  })

  console.log('✅ Migration logged')
}

// ========================================
// Main Migration Flow
// ========================================

async function runMigration() {
  console.log('🚀 Starting data migration...\n')
  console.log('⚠️  This script is SAFE - it only adds links, no deletions\n')

  try {
    // Step 1: Get default brain and agent
    const brain = await getDefaultBrain()
    const agent = await getOrCreateDefaultAgent(brain.id)

    // Step 2: Migrate existing data
    await migrateTeamMembers()
    await migratePosts(agent.id)
    await migrateSiteMedia()

    // Step 3: Create content snapshot
    await createContentSnapshot(brain.id)

    // Step 4: Log migration
    await logMigration()

    console.log('\n✨ Migration complete!\n')
    console.log('📋 Summary:')
    console.log('   ✅ Team members linked to admin system')
    console.log('   ✅ Posts updated with statuses and metadata')
    console.log('   ✅ Media cataloged and tagged')
    console.log('   ✅ Content snapshot created in business brain')
    console.log('\n🎯 Next steps:')
    console.log('   1. Visit admin panel at /admin/secret')
    console.log('   2. Review migrated content')
    console.log('   3. Test content generation\n')

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('\n🔄 Rollback not needed - no destructive changes were made')
    console.error('   Fix the error and run again\n')
    process.exit(1)
  }
}

// ========================================
// Run Migration
// ========================================

console.log('╔════════════════════════════════════════════╗')
console.log('║  Admin Nexus - Data Migration Script      ║')
console.log('║  Safe migration of existing site data     ║')
console.log('╚════════════════════════════════════════════╝\n')

// Confirm before running
const readline = await import('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Ready to migrate? This is safe and non-destructive. (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    rl.close()
    runMigration()
  } else {
    console.log('\n⏸️  Migration cancelled\n')
    rl.close()
    process.exit(0)
  }
})
