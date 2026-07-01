import type { ServiceSupabaseClient } from '../db/supabase.js'
import { archivePurgeCutoff } from '../lib/archiveRetention.js'
import type {
  ChannelType,
  EnrolmentStatus,
  PaginatedResult,
  Student,
  StudentInsert,
  StudentListFilters,
  StudentUpdate,
} from '../types/domain.js'
import { RepositoryError } from './errors.js'

export class StudentRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async findByChannelUserId(
    channel: ChannelType,
    channelUserId: string,
  ): Promise<Student | null> {
    const { data, error } = await this.db
      .from('students')
      .select('*')
      .eq('channel', channel)
      .eq('channel_user_id', channelUserId)
      .is('archived_at', null)
      .maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find student by channel user id', error)
    }

    return data as Student | null
  }

  async findById(id: string, options?: { includeArchived?: boolean }): Promise<Student | null> {
    let query = this.db.from('students').select('*').eq('id', id)
    if (!options?.includeArchived) {
      query = query.is('archived_at', null)
    }

    const { data, error } = await query.maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find student by id', error)
    }

    return data as Student | null
  }

  async create(input: StudentInsert): Promise<Student> {
    const { data, error } = await this.db.from('students').insert(input).select('*').single()

    if (error) {
      throw new RepositoryError('Failed to create student', error)
    }

    return data as Student
  }

  async update(id: string, fields: StudentUpdate): Promise<Student> {
    const { data, error } = await this.db
      .from('students')
      .update(fields)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new RepositoryError('Failed to update student', error)
    }

    return data as Student
  }

  async updateEnrolmentStatus(id: string, status: EnrolmentStatus): Promise<Student> {
    return this.update(id, { enrolment_status: status })
  }

  async touchLastActivity(id: string, at: Date): Promise<void> {
    const { error } = await this.db
      .from('students')
      .update({ last_activity_at: at.toISOString() })
      .eq('id', id)

    if (error) {
      throw new RepositoryError('Failed to update student last activity', error)
    }
  }

  async archiveMany(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0

    const now = new Date().toISOString()
    const { data, error } = await this.db
      .from('students')
      .update({ archived_at: now })
      .in('id', ids)
      .is('archived_at', null)
      .select('id')

    if (error) {
      throw new RepositoryError('Failed to archive students', error)
    }

    return data?.length ?? 0
  }

  async purgeExpiredArchives(retentionDays: number): Promise<number> {
    const cutoff = archivePurgeCutoff(retentionDays).toISOString()

    const { data, error } = await this.db
      .from('students')
      .delete()
      .not('archived_at', 'is', null)
      .lt('archived_at', cutoff)
      .select('id')

    if (error) {
      throw new RepositoryError('Failed to purge archived students', error)
    }

    return data?.length ?? 0
  }

  async list(filters: StudentListFilters = {}): Promise<PaginatedResult<Student>> {
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 25
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = this.db
      .from('students')
      .select('*', { count: 'exact' })
      .order('last_activity_at', { ascending: false, nullsFirst: false })

    if (!filters.includeArchived) {
      query = query.is('archived_at', null)
    }

    if (filters.search) {
      const term = `%${filters.search}%`
      query = query.or(`name.ilike.${term},email.ilike.${term},phone.ilike.${term}`)
    }

    if (filters.country) {
      query = query.ilike('country', `%${filters.country}%`)
    }

    if (filters.channel) {
      query = query.eq('channel', filters.channel)
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      throw new RepositoryError('Failed to list students', error)
    }

    let students = (data ?? []) as Student[]

    if (filters.minScore !== undefined || filters.maxScore !== undefined) {
      const studentIds = students.map((s) => s.id)
      if (studentIds.length > 0) {
        let scoreQuery = this.db.from('lead_scores').select('student_id, overall_score').in('student_id', studentIds)
        const { data: scores, error: scoreError } = await scoreQuery

        if (scoreError) {
          throw new RepositoryError('Failed to filter students by lead score', scoreError)
        }

        const scoreMap = new Map((scores ?? []).map((s) => [s.student_id, s.overall_score]))
        students = students.filter((student) => {
          const score = scoreMap.get(student.id) ?? 0
          if (filters.minScore !== undefined && score < filters.minScore) return false
          if (filters.maxScore !== undefined && score > filters.maxScore) return false
          return true
        })
      }
    }

    return {
      data: students,
      total: count ?? students.length,
      page,
      pageSize,
    }
  }
}
