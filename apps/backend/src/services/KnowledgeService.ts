import type { KnowledgeRepository } from '../repositories/KnowledgeRepository.js'

export class KnowledgeService {
  constructor(private readonly knowledgeRepository: KnowledgeRepository) {}

  async searchForMessage(messageText: string, limit = 3) {
    return this.knowledgeRepository.searchRelevant(messageText, limit)
  }
}
