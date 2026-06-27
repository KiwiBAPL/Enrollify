import { DEFAULT_AUTHOR_NAME } from '@/lib/site'
import { getSupabase } from '@/lib/supabase'

export type StaffRole = 'admin' | 'consultant'

export interface StaffProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: StaffRole
  created_at: string
  updated_at: string
}

export class ProfileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProfileError'
  }
}

async function requireUser() {
  const {
    data: { user },
    error,
  } = await getSupabase().auth.getUser()
  if (error || !user?.id) {
    throw new ProfileError('Not signed in')
  }
  return user
}

async function findStaffProfile(userId: string): Promise<StaffProfile | null> {
  const { data, error } = await getSupabase()
    .from('staff_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new ProfileError(error.message)
  }

  return data as StaffProfile | null
}

export async function ensureStaffProfile(user: {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}): Promise<StaffProfile> {
  const existing = await findStaffProfile(user.id)
  if (existing) {
    return existing
  }

  const email = user.email?.trim()
  if (!email) {
    throw new ProfileError('No email on account')
  }

  const firstName =
    typeof user.user_metadata?.first_name === 'string' && user.user_metadata.first_name.trim()
      ? user.user_metadata.first_name.trim()
      : 'Admin'
  const lastName =
    typeof user.user_metadata?.last_name === 'string' && user.user_metadata.last_name.trim()
      ? user.user_metadata.last_name.trim()
      : 'User'

  const { data, error } = await getSupabase()
    .from('staff_profiles')
    .insert({
      id: user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role: 'admin',
    })
    .select('*')
    .single()

  if (error) {
    throw new ProfileError(error.message)
  }

  return data as StaffProfile
}

export async function getStaffProfile(): Promise<StaffProfile> {
  const user = await requireUser()
  const profile = await findStaffProfile(user.id)
  if (!profile) {
    return ensureStaffProfile(user)
  }
  return profile
}

export async function updateStaffProfile(fields: {
  first_name?: string
  last_name?: string
  email?: string
}): Promise<StaffProfile> {
  const user = await requireUser()
  const updates: { first_name?: string; last_name?: string; email?: string } = {}

  if (fields.first_name !== undefined) {
    const firstName = fields.first_name.trim()
    if (!firstName) {
      throw new ProfileError('First name is required')
    }
    updates.first_name = firstName
  }

  if (fields.last_name !== undefined) {
    const lastName = fields.last_name.trim()
    if (!lastName) {
      throw new ProfileError('Last name is required')
    }
    updates.last_name = lastName
  }

  if (fields.email !== undefined) {
    const email = fields.email.trim().toLowerCase()
    if (!email) {
      throw new ProfileError('Invalid email')
    }
    const sessionEmail = user.email?.toLowerCase()
    if (email !== sessionEmail) {
      throw new ProfileError('Email must match your authenticated account')
    }
    updates.email = email
  }

  if (Object.keys(updates).length === 0) {
    throw new ProfileError('No valid fields to update')
  }

  const { data, error } = await getSupabase()
    .from('staff_profiles')
    .update(updates)
    .eq('id', user.id)
    .select('*')
    .single()

  if (error) {
    throw new ProfileError(error.message)
  }

  return data as StaffProfile
}

export function formatStaffAuthorName(
  profile: Pick<StaffProfile, 'first_name' | 'last_name'>,
): string {
  return `${profile.first_name.trim()} ${profile.last_name.trim()}`.trim()
}

const PLACEHOLDER_AUTHOR_NAMES = new Set([DEFAULT_AUTHOR_NAME, 'Admin User'])

export function isPlaceholderAuthorName(name: string): boolean {
  return PLACEHOLDER_AUTHOR_NAMES.has(name.trim())
}

export async function resolveAuthorNameForCreate(
  profile?: StaffProfile | null,
): Promise<string> {
  const resolved = profile ?? (await getStaffProfile())
  return formatStaffAuthorName(resolved) || DEFAULT_AUTHOR_NAME
}
