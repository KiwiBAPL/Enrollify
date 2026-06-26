import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && publishableKey)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }
  if (!client) {
    client = createClient(url!, publishableKey!)
  }
  return client
}

export function isAdminUser(user: { app_metadata?: Record<string, unknown> }): boolean {
  return user.app_metadata?.role === 'admin'
}
