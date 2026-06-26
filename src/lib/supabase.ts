import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY — admin auth will not work',
  )
}

export const supabase = createClient(url ?? '', publishableKey ?? '')

export function isAdminUser(user: { app_metadata?: Record<string, unknown> }): boolean {
  return user.app_metadata?.role === 'admin'
}
