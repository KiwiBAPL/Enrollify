import { describe, expect, it } from 'vitest'
import {
  categorizeQuestionByKeywords,
  isChatQuestionCategory,
} from '../../../apps/backend/src/lib/questionCategories'
import { QuestionCategorizationService } from '../../../apps/backend/src/services/QuestionCategorizationService'

describe('categorizeQuestionByKeywords', () => {
  it('maps visa questions to visas_immigration', () => {
    expect(categorizeQuestionByKeywords('What visa do I need to study in NZ?')).toBe(
      'visas_immigration',
    )
  })

  it('maps cost questions to costs_funding', () => {
    expect(categorizeQuestionByKeywords('How much are tuition fees per year?')).toBe('costs_funding')
  })

  it('maps course questions to courses_study', () => {
    expect(categorizeQuestionByKeywords('Which diploma programmes are available?')).toBe(
      'courses_study',
    )
  })

  it('maps english questions to english_requirements', () => {
    expect(categorizeQuestionByKeywords('Do I need IELTS for a level 7 course?')).toBe(
      'english_requirements',
    )
  })

  it('maps work questions to work_rights', () => {
    expect(categorizeQuestionByKeywords('Can I work part-time while studying?')).toBe('work_rights')
  })

  it('maps accommodation questions to accommodation', () => {
    expect(categorizeQuestionByKeywords('Where can I find student housing?')).toBe('accommodation')
  })

  it('falls back to general for unmatched topics', () => {
    expect(categorizeQuestionByKeywords('Hello there')).toBe('general')
  })
})

describe('isChatQuestionCategory', () => {
  it('accepts known slugs', () => {
    expect(isChatQuestionCategory('general')).toBe(true)
  })

  it('rejects unknown slugs', () => {
    expect(isChatQuestionCategory('unknown_slug')).toBe(false)
  })
})

describe('QuestionCategorizationService', () => {
  it('delegates to keyword categorization', () => {
    const service = new QuestionCategorizationService()
    expect(service.categorize('Tell me about visa requirements')).toBe('visas_immigration')
  })
})
