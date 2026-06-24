import type { ServiceSupabaseClient } from '../db/supabase.js'
import type {
  AIProviderCreate,
  AIProviderRow,
  AIProviderUpdate,
} from '../types/aiProvider.js'
import { RepositoryError } from './errors.js'

export class AIProviderRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async count(): Promise<number> {
    const { count, error } = await this.db
      .from('ai_providers')
      .select('*', { count: 'exact', head: true })

    if (error) {
      throw new RepositoryError('Failed to count AI providers', error)
    }

    return count ?? 0
  }

  async listEnabled(): Promise<AIProviderRow[]> {
    const { data, error } = await this.db
      .from('ai_providers')
      .select('*')
      .eq('enabled', true)
      .order('priority', { ascending: true })

    if (error) {
      throw new RepositoryError('Failed to list enabled AI providers', error)
    }

    return (data ?? []) as AIProviderRow[]
  }

  async listAll(): Promise<AIProviderRow[]> {
    const { data, error } = await this.db
      .from('ai_providers')
      .select('*')
      .order('priority', { ascending: true })

    if (error) {
      throw new RepositoryError('Failed to list AI providers', error)
    }

    return (data ?? []) as AIProviderRow[]
  }

  async findById(id: string): Promise<AIProviderRow | null> {
    const { data, error } = await this.db
      .from('ai_providers')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find AI provider', error)
    }

    return data as AIProviderRow | null
  }

  async create(
    input: AIProviderCreate & { api_key_ciphertext: string },
  ): Promise<AIProviderRow> {
    const { data, error } = await this.db
      .from('ai_providers')
      .insert({
        name: input.name,
        provider_type: input.provider_type,
        model: input.model,
        api_key_ciphertext: input.api_key_ciphertext,
        enabled: input.enabled ?? true,
        priority: input.priority ?? 100,
      })
      .select('*')
      .single()

    if (error) {
      throw new RepositoryError('Failed to create AI provider', error)
    }

    return data as AIProviderRow
  }

  async update(id: string, input: AIProviderUpdate & { api_key_ciphertext?: string }): Promise<AIProviderRow> {
    const patch: Record<string, unknown> = {}
    if (input.name !== undefined) patch.name = input.name
    if (input.model !== undefined) patch.model = input.model
    if (input.enabled !== undefined) patch.enabled = input.enabled
    if (input.priority !== undefined) patch.priority = input.priority
    if (input.api_key_ciphertext !== undefined) patch.api_key_ciphertext = input.api_key_ciphertext

    const { data, error } = await this.db
      .from('ai_providers')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw new RepositoryError('Failed to update AI provider', error)
    }

    return data as AIProviderRow
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('ai_providers').delete().eq('id', id)

    if (error) {
      throw new RepositoryError('Failed to delete AI provider', error)
    }
  }
}
