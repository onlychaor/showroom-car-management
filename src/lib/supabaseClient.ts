import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for privileged operations (use in API routes only)
export function createServerSupabase() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', serviceRole)
}

