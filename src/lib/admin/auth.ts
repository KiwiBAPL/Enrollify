import { isAdminUser, supabase } from '@/lib/supabase'

export async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) return false
  return isAdminUser(session.user)
}
