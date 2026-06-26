import type { ServiceSupabaseClient } from '../db/supabase.js'
import type { KnowledgeArticle } from '../types/domain.js'
import { RepositoryError } from './errors.js'

export class KnowledgeRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async findById(id: string): Promise<KnowledgeArticle | null> {
    const { data, error } = await this.db
      .from('knowledge_articles')
      .select('id, title, content, category, source_document_url, created_at, updated_at')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find knowledge article', error)
    }

    return data as KnowledgeArticle | null
  }

  /**
   * Full-text search for RAG context (Phase 3). Returns up to `limit` articles.
   */
  async searchRelevant(messageText: string, limit = 3): Promise<KnowledgeArticle[]> {
    const query = messageText.trim()
    if (!query) {
      return []
    }

    const { data, error } = await this.db
      .from('knowledge_articles')
      .select('id, title, content, category, source_document_url, created_at, updated_at')
      .textSearch('search_vector', query, { type: 'plain', config: 'english' })
      .limit(limit)

    if (error) {
      throw new RepositoryError('Failed to search knowledge articles', error)
    }

    return (data ?? []) as KnowledgeArticle[]
  }

  async create(article: Omit<KnowledgeArticle, 'id' | 'created_at' | 'updated_at'>): Promise<KnowledgeArticle> {
    const { data, error } = await this.db.from('knowledge_articles').insert(article).select('*').single()

    if (error) {
      throw new RepositoryError('Failed to create knowledge article', error)
    }

    return data as KnowledgeArticle
  }
}
