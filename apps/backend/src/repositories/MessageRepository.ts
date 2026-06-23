import type { ServiceSupabaseClient } from '../db/supabase.js'
import type { Message, MessageInsert, MessageType } from '../types/domain.js'
import { RepositoryError } from './errors.js'

export class MessageRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async create(input: MessageInsert): Promise<Message> {
    const { data, error } = await this.db.from('messages').insert(input).select('*').single()

    if (error) {
      throw new RepositoryError('Failed to create message', error)
    }

    return data as Message
  }

  async createUserMessage(
    conversationId: string,
    content: string,
    createdAt: Date,
  ): Promise<Message> {
    return this.create({
      conversation_id: conversationId,
      message_type: 'user',
      content,
      created_at: createdAt.toISOString(),
    })
  }

  async createAssistantMessage(conversationId: string, content: string): Promise<Message> {
    return this.create({
      conversation_id: conversationId,
      message_type: 'assistant',
      content,
    })
  }

  async listByConversationId(
    conversationId: string,
    options: { limit?: number; offset?: number } = {},
  ): Promise<Message[]> {
    const limit = options.limit ?? 50
    const offset = options.offset ?? 0

    const { data, error } = await this.db
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new RepositoryError('Failed to list messages', error)
    }

    return (data ?? []) as Message[]
  }

  async listByStudentId(
    studentId: string,
    options: { limit?: number; offset?: number } = {},
  ): Promise<Message[]> {
    const conversations = await this.db
      .from('conversations')
      .select('id')
      .eq('student_id', studentId)

    if (conversations.error) {
      throw new RepositoryError('Failed to resolve conversations for student messages', conversations.error)
    }

    const conversationIds = (conversations.data ?? []).map((row) => row.id)
    if (conversationIds.length === 0) {
      return []
    }

    const limit = options.limit ?? 50
    const offset = options.offset ?? 0

    const { data, error } = await this.db
      .from('messages')
      .select('*')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new RepositoryError('Failed to list messages for student', error)
    }

    return (data ?? []) as Message[]
  }

  async countByConversationId(conversationId: string): Promise<number> {
    const { count, error } = await this.db
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)

    if (error) {
      throw new RepositoryError('Failed to count messages', error)
    }

    return count ?? 0
  }

  messageTypeLabel(type: MessageType): 'student' | 'assistant' {
    return type === 'user' ? 'student' : 'assistant'
  }
}
