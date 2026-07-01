import type { LeadScoreFactors } from '../types/domain.js'
import type { LeadScoreRepository } from '../repositories/LeadScoreRepository.js'

export class LeadScoringService {
  constructor(private readonly leadScoreRepository: LeadScoreRepository) {}

  async scoreStudent(studentId: string, factors: LeadScoreFactors) {
    return this.leadScoreRepository.upsert(studentId, factors)
  }

  getBand(overallScore: number): 'hot' | 'warm' | 'nurture' | 'cold' {
    return this.leadScoreRepository.scoreBand(overallScore)
  }
}
