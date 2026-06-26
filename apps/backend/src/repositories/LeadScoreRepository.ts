import type { ServiceSupabaseClient } from '../db/supabase.js'
import type { LeadScore, LeadScoreFactors } from '../types/domain.js'
import { RepositoryError } from './errors.js'

export class LeadScoreRepository {
  constructor(private readonly db: ServiceSupabaseClient) {}

  async findByStudentId(studentId: string): Promise<LeadScore | null> {
    const { data, error } = await this.db
      .from('lead_scores')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle()

    if (error) {
      throw new RepositoryError('Failed to find lead score', error)
    }

    return data as LeadScore | null
  }

  async upsert(studentId: string, factors: LeadScoreFactors): Promise<LeadScore> {
    const overallScore = this.computeOverallScore(factors)

    const { data, error } = await this.db
      .from('lead_scores')
      .upsert(
        {
          student_id: studentId,
          ...factors,
          overall_score: overallScore,
        },
        { onConflict: 'student_id' },
      )
      .select('*')
      .single()

    if (error) {
      throw new RepositoryError('Failed to upsert lead score', error)
    }

    return data as LeadScore
  }

  async listByScoreBand(minScore: number, maxScore?: number): Promise<LeadScore[]> {
    let query = this.db
      .from('lead_scores')
      .select('*')
      .gte('overall_score', minScore)
      .order('overall_score', { ascending: false })

    if (maxScore !== undefined) {
      query = query.lte('overall_score', maxScore)
    }

    const { data, error } = await query

    if (error) {
      throw new RepositoryError('Failed to list lead scores by band', error)
    }

    return (data ?? []) as LeadScore[]
  }

  /**
   * Provisional scoring (OQ-1): sum of seven factor scores (0–10 each).
   * Scaled to 0–100 for pipeline bands (Hot ≥70, Warm 40–69, Cold <40).
   */
  computeOverallScore(factors: LeadScoreFactors): number {
    const raw =
      factors.ready_to_apply +
      factors.english_ability +
      factors.budget_fit +
      factors.intake_timeframe +
      factors.visa_readiness +
      factors.education_match +
      factors.interest_level

    return Math.min(100, Math.round((raw / 70) * 100))
  }

  scoreBand(overallScore: number): 'hot' | 'warm' | 'cold' {
    if (overallScore >= 70) return 'hot'
    if (overallScore >= 40) return 'warm'
    return 'cold'
  }
}
