import type { ServiceSupabaseClient } from '../db/supabase.js'
import type {
  ChatQuestionCategory,
  PaginatedResult,
  WebchatMessage,
  WebchatMessageInsert,
} from '../types/domain.js'
import { RepositoryError } from './errors.js'

export interface CategoryCountRow {
  category: ChatQuestionCategory
  count: number
}

export class WebchatMessageRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async create(input: WebchatMessageInsert): Promise<WebchatMessage> {
    const { data, error } = await this.db.from('webchat_messages').insert(input).select('*').single()

    if (error) {
      throw new RepositoryError('Failed to create webchat message', error)
    }

    return data as WebchatMessage
  }

  async createUserMessage(
    sessionId: string,
    content: string,
    createdAt: Date,
  ): Promise<WebchatMessage> {
    return this.create({
      session_id: sessionId,
      message_type: 'user',
      content,
      created_at: createdAt.toISOString(),
    })
  }

  async createAssistantMessage(sessionId: string, content: string): Promise<WebchatMessage> {
    return this.create({
      session_id: sessionId,
      message_type: 'assistant',
      content,
    })
  }

  async updateCategory(messageId: string, category: ChatQuestionCategory): Promise<void> {
    const { error } = await this.db
      .from('webchat_messages')
      .update({ category })
      .eq('id', messageId)
      .eq('message_type', 'user')

    if (error) {
      throw new RepositoryError('Failed to update webchat message category', error)
    }
  }

  async listBySessionId(
    sessionId: string,
    options: { limit?: number; offset?: number } = {},
  ): Promise<WebchatMessage[]> {
    const limit = options.limit ?? 100
    const offset = options.offset ?? 0

    const { data, error } = await this.db
      .from('webchat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new RepositoryError('Failed to list webchat messages', error)
    }

    return (data ?? []) as WebchatMessage[]
  }

  async countByCategory(options: {
    from?: string
    to?: string
  } = {}): Promise<CategoryCountRow[]> {
    let query = this.db
      .from('webchat_messages')
      .select('category')
      .eq('message_type', 'user')
      .not('category', 'is', null)

    if (options.from) {
      query = query.gte('created_at', options.from)
    }
    if (options.to) {
      query = query.lte('created_at', options.to)
    }

    const { data, error } = await query

    if (error) {
      throw new RepositoryError('Failed to count webchat messages by category', error)
    }

    const counts = new Map<ChatQuestionCategory, number>()
    for (const row of data ?? []) {
      const category = row.category as ChatQuestionCategory
      counts.set(category, (counts.get(category) ?? 0) + 1)
    }

    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }))
  }

  async listByCategory(
    category: ChatQuestionCategory,
    options: { page?: number; pageSize?: number; from?: string; to?: string } = {},
  ): Promise<PaginatedResult<WebchatMessage>> {
    const page = options.page ?? 1
    const pageSize = options.pageSize ?? 25
    const offset = (page - 1) * pageSize

    let query = this.db
      .from('webchat_messages')
      .select('*', { count: 'exact' })
      .eq('message_type', 'user')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (options.from) {
      query = query.gte('created_at', options.from)
    }
    if (options.to) {
      query = query.lte('created_at', options.to)
    }

    const { data, error, count } = await query.range(offset, offset + pageSize - 1)

    if (error) {
      throw new RepositoryError('Failed to list webchat questions by category', error)
    }

    return {
      data: (data ?? []) as WebchatMessage[],
      total: count ?? 0,
      page,
      pageSize,
    }
  }

  async countUserQuestions(options: { from?: string; to?: string } = {}): Promise<number> {
    let query = this.db
      .from('webchat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('message_type', 'user')

    if (options.from) {
      query = query.gte('created_at', options.from)
    }
    if (options.to) {
      query = query.lte('created_at', options.to)
    }

    const { count, error } = await query

    if (error) {
      throw new RepositoryError('Failed to count webchat user questions', error)
    }

    return count ?? 0
  }
}
