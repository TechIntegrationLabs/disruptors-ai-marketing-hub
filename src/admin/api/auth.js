/**
 * Admin Nexus Supabase Client
 * Separate client instance with unique storage key to avoid conflicts
 */

import { createClient } from '@supabase/supabase-js'

const getEnvVar = (key, defaultValue) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue
  }
  if (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env) {
    return globalThis.process.env[key] || defaultValue
  }
  return defaultValue
}

const isDevelopment = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.MODE === 'development' || import.meta.env.DEV
  : false

const LOCALHOST_URL = 'http://127.0.0.1:54321'
const LOCALHOST_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', isDevelopment ? LOCALHOST_URL : '')
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', isDevelopment ? LOCALHOST_ANON_KEY : '')

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'CRITICAL: Missing Supabase configuration for Admin Nexus.'
  console.error(errorMessage)
  if (!isDevelopment) {
    throw new Error(errorMessage)
  }
}

// Create separate Supabase client for Admin Nexus with unique storage key
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'admin-nexus-auth', // UNIQUE storage key to avoid conflicts
    autoRefreshToken: true,
    persistSession: true,
  }
})

// Session management utilities
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const checkAuth = async () => {
  const session = await getSession()
  return {
    authenticated: !!session,
    user: session?.user || null,
    isAdmin: session?.user?.user_metadata?.role === 'admin'
  }
}

export const isAdmin = async () => {
  // Check session storage first
  if (typeof window !== 'undefined') {
    const nexusAuth = sessionStorage.getItem('admin-nexus-authenticated')
    if (nexusAuth === 'true') return true
  }

  // Fallback to Supabase check
  const session = await getSession()
  return session?.user?.user_metadata?.role === 'admin'
}

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

export const logoutAdmin = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error

  // Clear all admin session storage
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin-session')
    sessionStorage.removeItem('admin-nexus-authenticated')
  }
}
