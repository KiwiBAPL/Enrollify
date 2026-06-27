/**
 * Supabase client for Node.js build/verify scripts.
 * Node lacks native WebSocket; @supabase/realtime-js requires a transport.
 */
import ws from 'ws'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function createNodeSupabaseClient(url: string, key: string): SupabaseClient {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: ws as unknown as typeof WebSocket },
  })
}
