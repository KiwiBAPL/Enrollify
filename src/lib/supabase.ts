import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && publishableKey)

// #region agent log
fetch('http://127.0.0.1:7747/ingest/fb690dd6-5343-48c3-a507-8ca62d2ce79a', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '907a9f' },
  body: JSON.stringify({
    sessionId: '907a9f',
    hypothesisId: 'H1-H3',
    location: 'src/lib/supabase.ts:init',
    message: 'Supabase env presence at module load',
    data: {
      hasUrl: Boolean(url),
      hasPublishableKey: Boolean(publishableKey),
      isConfigured: isSupabaseConfigured,
      mode: import.meta.env.MODE,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {})
// #endregion

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
