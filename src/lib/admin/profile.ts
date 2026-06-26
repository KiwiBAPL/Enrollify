import { apiFetch } from './api'

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

export async function getStaffProfile(): Promise<StaffProfile> {
  const data = await apiFetch<{ profile: StaffProfile }>('/api/admin/me')
  return data.profile
}

export async function updateStaffProfile(fields: {
  first_name?: string
  last_name?: string
  email?: string
}): Promise<StaffProfile> {
  const data = await apiFetch<{ profile: StaffProfile }>('/api/admin/me', {
    method: 'PATCH',
    body: JSON.stringify(fields),
  })
  return data.profile
}
