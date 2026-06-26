import { getSupabase, isAdminUser, isSupabaseConfigured } from '@/lib/supabase'

export async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured) return null
  const {
    data: { session },
  } = await getSupabase().auth.getSession()
  return session?.access_token ?? null
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured) return
  await getSupabase().auth.signOut()
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const {
    data: { session },
  } = await getSupabase().auth.getSession()
  if (!session?.user) return false
  return isAdminUser(session.user)
}
