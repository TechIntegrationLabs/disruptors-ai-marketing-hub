/**
 * Create Admin User Script (Automatic)
 * Creates an admin user with proper JWT role claim
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

// Default admin credentials
const ADMIN_EMAIL = 'admin@disruptors.co'
const ADMIN_PASSWORD = 'Admin123!Nexus' // Change this after first login!

console.log('🔐 Creating Admin User...\n')

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingAdmin = existingUsers?.users?.find(u => u.email === ADMIN_EMAIL)

    let userId

    if (existingAdmin) {
      console.log(`ℹ️  Admin user already exists: ${ADMIN_EMAIL}`)
      userId = existingAdmin.id
    } else {
      // Create admin user
      console.log(`📧 Creating admin user: ${ADMIN_EMAIL}`)
      const { data, error } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          name: 'Admin User'
        }
      })

      if (error) throw new Error(`Failed to create user: ${error.message}`)

      userId = data.user.id
      console.log(`✅ Created admin user with ID: ${userId}`)
    }

    // Update user metadata to ensure role is set
    console.log('🔧 Setting admin role in user metadata...')
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    })

    if (updateError) {
      console.warn(`⚠️  Warning: Could not update metadata: ${updateError.message}`)
    } else {
      console.log('✅ Admin role set in user metadata')
    }

    // Verify the user
    const { data: verifiedUser } = await supabase.auth.admin.getUserById(userId)
    console.log('\n📋 Admin User Details:')
    console.log(`   Email: ${verifiedUser?.user?.email}`)
    console.log(`   ID: ${verifiedUser?.user?.id}`)
    console.log(`   Role: ${verifiedUser?.user?.user_metadata?.role || 'NOT SET'}`)
    console.log(`   Email Confirmed: ${verifiedUser?.user?.email_confirmed_at ? 'Yes' : 'No'}`)

    console.log('\n✨ Admin user setup complete!')
    console.log('\n🔑 Login Credentials:')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log('\n⚠️  IMPORTANT: Change this password after first login!')
    console.log(`\n🌐 Admin Panel: http://localhost:5173/admin/secret\n`)

  } catch (error) {
    console.error('\n❌ Failed to create admin user:', error.message)
    process.exit(1)
  }
}

createAdminUser()
