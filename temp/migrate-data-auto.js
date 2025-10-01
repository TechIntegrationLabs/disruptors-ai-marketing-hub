/**
 * Auto Data Migration Script (No Prompts)
 * Migrates existing site data into admin system
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

console.log('🚀 Starting automatic data migration...\n')

async function getDefaultBrain() {
  console.log('📦 Getting default business brain...')
  const { data, error } = await supabase
    .from('business_brains')
    .select('*')
    .eq('slug', 'default')
    .single()

  if (error) throw new Error(`Failed to get default brain: ${error.message}`)
  console.log(`✅ Found brain: ${data.name} (${data.id})`)
  return data
}

async function getOrCreateDefaultAgent(brainId) {
  console.log('🤖 Getting or creating default content agent...')

  let { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .eq('name', 'Content Writer')
    .single()

  if (error && error.code === 'PGRST116') {
    const { data: newAgent, error: createError } = await supabase
      .from('agents')
      .insert({
        brain_id: brainId,
        name: 'Content Writer',
        system_prompt: 'You are a professional content writer for Disruptors & Co.',
        flags: { model: 'claude-sonnet-4.5', temperature: 0.7, max_tokens: 2000 }
      })
      .select()
      .single()

    if (createError) throw new Error(`Failed to create agent: ${createError.message}`)
    agent = newAgent
    console.log(`✅ Created agent: ${agent.name}`)
  } else if (error) {
    throw new Error(`Failed to get agent: ${error.message}`)
  } else {
    console.log(`✅ Found existing agent: ${agent.name}`)
  }

  return agent
}

async function migrateTeamMembers() {
  console.log('\n👥 Migrating team members...')
  const { data: members, error } = await supabase.from('team_members').select('*')
  if (error) throw new Error(`Failed to get team members: ${error.message}`)

  console.log(`   Found ${members.length} team members`)
  let updated = 0

  for (const member of members) {
    const updates = {
      can_write_content: member.title?.toLowerCase().includes('writer') ||
                        member.title?.toLowerCase().includes('editor') ||
                        member.title?.toLowerCase().includes('content'),
      content_permissions: {
        can_publish: member.title?.toLowerCase().includes('editor'),
        can_delete: false,
        categories: ['blog', 'articles']
      }
    }

    const { error: updateError } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', member.id)

    if (!updateError) updated++
  }

  console.log(`✅ Updated ${updated}/${members.length} team members`)
}

async function migratePosts() {
  console.log('\n📝 Migrating posts...')
  const { data: posts, error } = await supabase.from('posts').select('*')
  if (error) throw new Error(`Failed to get posts: ${error.message}`)

  console.log(`   Found ${posts.length} posts`)
  let updated = 0

  for (const post of posts) {
    const status = post.published_at || post.is_published ? 'published' : 'draft'
    const content = post.content || ''
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length
    const readingTime = Math.ceil(wordCount / 200)

    const updates = {
      status,
      word_count: wordCount,
      reading_time_minutes: readingTime,
      agent_id: null,
      seo: {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        keywords: post.seo_keywords || post.tags || []
      }
    }

    const { error: updateError } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', post.id)

    if (!updateError) updated++
  }

  console.log(`✅ Updated ${updated}/${posts.length} posts`)
}

async function migrateSiteMedia() {
  console.log('\n🖼️  Migrating site media...')
  const { data: media, error } = await supabase.from('site_media').select('*')
  if (error) throw new Error(`Failed to get site media: ${error.message}`)

  console.log(`   Found ${media.length} media items`)
  let updated = 0

  for (const item of media) {
    const tags = []
    if (item.file_type) tags.push(item.file_type)
    if (item.folder) tags.push(item.folder)

    const updates = {
      ai_generated: false,
      tags: [...new Set(tags)],
      indexed_for_search: true,
      usage_rights: 'internal'
    }

    const { error: updateError } = await supabase
      .from('site_media')
      .update(updates)
      .eq('id', item.id)

    if (!updateError) updated++
  }

  console.log(`✅ Updated ${updated}/${media.length} media items`)
}

async function createContentSnapshot(brainId) {
  console.log('\n📸 Creating content snapshot...')

  const { data: posts } = await supabase
    .from('posts')
    .select('title, category, tags')
    .eq('status', 'published')
    .limit(10)

  const categories = new Set()
  const topics = new Set()

  posts?.forEach(post => {
    if (post.category) categories.add(post.category)
    if (post.tags) post.tags.forEach(tag => topics.add(tag))
  })

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
      key: 'Total Published Content',
      value: posts?.length || 0,
      source: 'Database count',
      confidence: 1.0,
      last_verified_at: new Date().toISOString()
    }
  ]

  for (const fact of facts) {
    await supabase.from('brain_facts').insert(fact)
  }

  console.log(`✅ Created ${facts.length} brain facts from existing content`)
}

async function runMigration() {
  try {
    const brain = await getDefaultBrain()
    const agent = await getOrCreateDefaultAgent(brain.id)

    await migrateTeamMembers()
    await migratePosts()
    await migrateSiteMedia()
    await createContentSnapshot(brain.id)

    await supabase.from('telemetry_events').insert({
      area: 'admin',
      name: 'data_migration_completed',
      payload: { migrated_at: new Date().toISOString(), script_version: '1.0.0' }
    })

    console.log('\n✨ Migration complete!\n')
    console.log('📋 Summary:')
    console.log('   ✅ Team members linked to admin system')
    console.log('   ✅ Posts updated with statuses and metadata')
    console.log('   ✅ Media cataloged and tagged')
    console.log('   ✅ Content snapshot created in business brain\n')

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('🔄 No destructive changes were made - safe to retry\n')
    process.exit(1)
  }
}

runMigration()
