import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Supabase Edge Function: Set Admin Role
 *
 * This function sets the 'admin' role in JWT claims for authorized users.
 * Triggered after successful authentication.
 *
 * Deploy to Supabase: supabase functions deploy set-admin-role
 */

interface RequestBody {
  userId: string
  email: string
  secretKey?: string
}

Deno.serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Parse request
    const body: RequestBody = await req.json()
    const { userId, email, secretKey } = body

    // Verify authorization
    // Option 1: Use secret key (simple, for demo)
    // Option 2: Check if user email is in admin list
    // Option 3: Check if user has admin flag in database

    const ADMIN_SECRET = Deno.env.get('ADMIN_SECRET_KEY') || 'change-me-in-production'
    const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') || '').split(',').map(e => e.trim()).filter(Boolean)

    const isAuthorized =
      secretKey === ADMIN_SECRET ||
      ADMIN_EMAILS.includes(email)

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Set admin role in app_metadata
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: {
        role: 'admin',
        granted_at: new Date().toISOString()
      }
    })

    if (error) throw error

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin role granted',
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.app_metadata.role
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
