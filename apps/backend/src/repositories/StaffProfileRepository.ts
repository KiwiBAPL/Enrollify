import type { ServiceSupabaseClient } from '../db/supabase.js'
import type {
  StaffProfile,
  StaffProfileInsert,
  StaffProfileUpdate,
} from '../types/domain.js'
import { RepositoryError } from './errors.js'

export class StaffProfileRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async findById(id: string): Promise<StaffProfile | null> {
    const { data, error } = await this.db
      .from('staff_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find staff profile', error)
    }

    return data as StaffProfile | null
  }

  async findByEmail(email: string): Promise<StaffProfile | null> {
    const { data, error } = await this.db
      .from('staff_profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find staff profile by email', error)
    }

    return data as StaffProfile | null
  }

  async create(input: StaffProfileInsert): Promise<StaffProfile> {
    const { data, error } = await this.db
      .from('staff_profiles')
      .insert(input)
      .select('*')
      .single()

    if (error) {
      throw new RepositoryError('Failed to create staff profile', error)
    }

    return data as StaffProfile
  }

  async update(id: string, fields: StaffProfileUpdate): Promise<StaffProfile> {
    const { data, error } = await this.db
      .from('staff_profiles')
      .update(fields)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new RepositoryError('Failed to update staff profile', error)
    }

    return data as StaffProfile
  }

  async ensureProfile(input: StaffProfileInsert): Promise<StaffProfile> {
    const existing = await this.findById(input.id)
    if (existing) {
      return existing
    }
    return this.create(input)
  }
}
