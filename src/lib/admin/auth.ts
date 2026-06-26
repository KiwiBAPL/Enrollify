import type { AuthError as SupabaseAuthError } from '@supabase/supabase-js'
import { ADMIN_BASE } from '@/lib/admin/constants'
import { ensureStaffProfile } from '@/lib/admin/profile'
import { getSupabase, isAdminUser, isSupabaseConfigured } from '@/lib/supabase'

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

function mapSignInError(error: SupabaseAuthError | null): string {
  if (!error) return 'Sign in failed'
  if (error.message === 'Invalid login credentials') return 'Invalid email or password'
  if (error.message.toLowerCase().includes('email not confirmed')) {
    return 'Confirm your email before signing in'
  }
  return error.message
}

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
    data: { user },
  } = await getSupabase().auth.getUser()
  if (!user) return false
  return isAdminUser(user)
}

export async function signInAsAdmin(email: string, password: string): Promise<void> {
  const trimmedEmail = email.trim().toLowerCase()
  const trimmedPassword = password.trim()

  const { data, error: signInError } = await getSupabase().auth.signInWithPassword({
    email: trimmedEmail,
    password: trimmedPassword,
  })

  if (signInError || !data.user) {
    throw new AuthError(mapSignInError(signInError))
  }

  if (!isAdminUser(data.user)) {
    await getSupabase().auth.signOut()
    throw new AuthError('This account is not authorised for admin access')
  }

  await ensureStaffProfile(data.user)
}

export async function requestPasswordReset(email: string): Promise<void> {
  const trimmedEmail = email.trim().toLowerCase()
  if (!trimmedEmail) {
    throw new AuthError('Enter your email address first')
  }

  const redirectTo = `${window.location.origin}${ADMIN_BASE}/login`
  const { error } = await getSupabase().auth.resetPasswordForEmail(trimmedEmail, { redirectTo })
  if (error) {
    throw new AuthError(error.message)
  }
}
