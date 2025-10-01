/**
 * Setup Admin User Script
 * Creates admin user and grants admin role
 *
 * Usage: node scripts/setup-admin-user.js <email> <password>
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupAdminUser(email, password) {
  console.log(`\n🔐 Setting up admin user: ${email}\n`)

  // Step 1: Create user
  console.log('1️⃣  Creating user account...')
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (createError) {
    console.error('❌ Failed to create user:', createError.message)
    process.exit(1)
  }

  console.log('✅ User created:', user.user.id)

  // Step 2: Set admin role
  console.log('\n2️⃣  Granting admin role...')
  const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
    user.user.id,
    {
      app_metadata: {
        role: 'admin',
        granted_at: new Date().toISOString()
      }
    }
  )

  if (updateError) {
    console.error('❌ Failed to grant admin role:', updateError.message)
    process.exit(1)
  }

  console.log('✅ Admin role granted')

  // Step 3: Verify
  console.log('\n3️⃣  Verifying setup...')
  const { data: verifyUser, error: verifyError } = await supabase.auth.admin.getUserById(user.user.id)

  if (verifyError) {
    console.error('❌ Verification failed:', verifyError.message)
    process.exit(1)
  }

  console.log('✅ Verification successful')
  console.log('\n📋 User Details:')
  console.log('   Email:', verifyUser.user.email)
  console.log('   ID:', verifyUser.user.id)
  console.log('   Role:', verifyUser.user.app_metadata.role)
  console.log('   Created:', new Date(verifyUser.user.created_at).toLocaleString())

  console.log('\n✨ Setup complete! You can now log in at /admin/secret\n')
}

// Parse command line arguments
const args = process.argv.slice(2)

if (args.length < 2) {
  console.log(`
Usage: node scripts/setup-admin-user.js <email> <password>

Example:
  node scripts/setup-admin-user.js admin@disruptors.co SecurePassword123!

Environment variables required:
  VITE_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  `)
  process.exit(1)
}

const [email, password] = args

// Run setup
setupAdminUser(email, password).catch(error => {
  console.error('\n❌ Setup failed:', error.message)
  process.exit(1)
})
