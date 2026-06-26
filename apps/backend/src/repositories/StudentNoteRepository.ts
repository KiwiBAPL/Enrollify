import type { ServiceSupabaseClient } from '../db/supabase.js'
import type { LatestStudentNote, StudentNote, StudentNoteInsert } from '../types/domain.js'
import { RepositoryError } from './errors.js'

export class StudentNoteRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async listByStudentId(studentId: string): Promise<StudentNote[]> {
    const { data, error } = await this.db
      .from('student_notes')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new RepositoryError('Failed to list student notes', error)
    }

    return (data ?? []) as StudentNote[]
  }

  async findLatestByStudentIds(studentIds: string[]): Promise<Map<string, LatestStudentNote>> {
    if (studentIds.length === 0) {
      return new Map()
    }

    const { data, error } = await this.db
      .from('student_notes')
      .select('id, student_id, content, created_at')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false })

    if (error) {
      throw new RepositoryError('Failed to find latest student notes', error)
    }

    const map = new Map<string, LatestStudentNote>()
    for (const row of data ?? []) {
      if (!map.has(row.student_id)) {
        map.set(row.student_id, {
          id: row.id,
          content: row.content,
          created_at: row.created_at,
        })
      }
    }

    return map
  }

  async findById(id: string): Promise<StudentNote | null> {
    const { data, error } = await this.db
      .from('student_notes')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find student note', error)
    }

    return data as StudentNote | null
  }

  async create(input: StudentNoteInsert): Promise<StudentNote> {
    const { data, error } = await this.db
      .from('student_notes')
      .insert(input)
      .select('*')
      .single()

    if (error) {
      throw new RepositoryError('Failed to create student note', error)
    }

    return data as StudentNote
  }

  async update(id: string, content: string): Promise<StudentNote> {
    const { data, error } = await this.db
      .from('student_notes')
      .update({ content })
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new RepositoryError('Failed to update student note', error)
    }

    return data as StudentNote
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('student_notes').delete().eq('id', id)

    if (error) {
      throw new RepositoryError('Failed to delete student note', error)
    }
  }
}
