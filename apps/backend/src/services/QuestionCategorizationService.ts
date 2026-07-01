import {
  categorizeQuestionByKeywords,
  type ChatQuestionCategory,
} from '../lib/questionCategories.js'

export class QuestionCategorizationService {
  categorize(questionText: string): ChatQuestionCategory {
    return categorizeQuestionByKeywords(questionText)
  }
}
