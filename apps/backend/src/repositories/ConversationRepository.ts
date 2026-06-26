import type { ServiceSupabaseClient } from '../db/supabase.js'
import type { ChannelType, Conversation, ConversationInsert } from '../types/domain.js'
import { RepositoryError } from './errors.js'

export class ConversationRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async findById(id: string): Promise<Conversation | null> {
    const { data, error } = await this.db
      .from('conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find conversation by id', error)
    }

    return data as Conversation | null
  }

  async findActiveByStudentId(studentId: string): Promise<Conversation | null> {
    const { data, error } = await this.db
      .from('conversations')
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find active conversation', error)
    }

    return data as Conversation | null
  }

  async create(input: ConversationInsert): Promise<Conversation> {
    const { data, error } = await this.db.from('conversations').insert(input).select('*').single()

    if (error) {
      throw new RepositoryError('Failed to create conversation', error)
    }

    return data as Conversation
  }

  async updateLastMessageAt(id: string, at: Date): Promise<void> {
    const { error } = await this.db
      .from('conversations')
      .update({ last_message_at: at.toISOString() })
      .eq('id', id)

    if (error) {
      throw new RepositoryError('Failed to update conversation last message time', error)
    }
  }

  async listByStudentId(studentId: string): Promise<Conversation[]> {
    const { data, error } = await this.db
      .from('conversations')
      .select('*')
      .eq('student_id', studentId)
      .order('started_at', { ascending: true })

    if (error) {
      throw new RepositoryError('Failed to list conversations for student', error)
    }

    return (data ?? []) as Conversation[]
  }

  async createForChannel(studentId: string, channel: ChannelType): Promise<Conversation> {
    return this.create({ student_id: studentId, channel })
  }
}
