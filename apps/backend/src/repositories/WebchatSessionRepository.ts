import type { ServiceSupabaseClient } from '../db/supabase.js'
import type { WebchatSession } from '../types/domain.js'
import { RepositoryError } from './errors.js'

export class WebchatSessionRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async upsert(sessionId: string, activityAt: Date): Promise<WebchatSession> {
    const { data, error } = await this.db
      .from('webchat_sessions')
      .upsert(
        {
          id: sessionId,
          last_activity_at: activityAt.toISOString(),
        },
        { onConflict: 'id' },
      )
      .select('*')
      .single()

    if (error) {
      throw new RepositoryError('Failed to upsert webchat session', error)
    }

    return data as WebchatSession
  }
}
