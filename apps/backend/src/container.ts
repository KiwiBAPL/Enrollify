import bcrypt from 'bcrypt'
import type { Env } from './config/env.js'
import { MockChannelAdapter } from './channels/MockChannelAdapter.js'
import { MessengerChannelAdapter } from './channels/MessengerChannelAdapter.js'
import { createServiceClient } from './db/supabase.js'
import { createLogger } from './lib/logger.js'
import {
  AIProviderRepository,
  ConversationRepository,
  KnowledgeRepository,
  LeadScoreRepository,
  MessageRepository,
  StudentRepository,
} from './repositories/index.js'
import { AIService } from './services/AIService.js'
import { ConversationService } from './services/ConversationService.js'
import { KnowledgeService } from './services/KnowledgeService.js'
import { LeadScoringService } from './services/LeadScoringService.js'

export function createContainer(env: Env) {
  const logger = createLogger(env)
  const db = createServiceClient(env)

  const repositories = {
    students: new StudentRepository(db),
    conversations: new ConversationRepository(db),
    messages: new MessageRepository(db),
    leadScores: new LeadScoreRepository(db),
    knowledge: new KnowledgeRepository(db),
    aiProviders: new AIProviderRepository(db),
  }

  const knowledgeService = new KnowledgeService(repositories.knowledge)
  const aiService = new AIService(env, logger, repositories.aiProviders)
  const leadScoringService = new LeadScoringService(repositories.leadScores)
  const conversationService = new ConversationService(
    repositories.students,
    repositories.conversations,
    repositories.messages,
    knowledgeService,
    aiService,
    leadScoringService,
    logger,
  )

  const mockChannelAdapter = new MockChannelAdapter(logger)
  const messengerChannelAdapter = new MessengerChannelAdapter(env, logger)

  return {
    env,
    logger,
    db,
    repositories,
    services: {
      knowledge: knowledgeService,
      ai: aiService,
      leadScoring: leadScoringService,
      conversation: conversationService,
    },
    channels: {
      mock: mockChannelAdapter,
      messenger: messengerChannelAdapter,
    },
  }
}

export type Container = ReturnType<typeof createContainer>

export async function verifyAdminPassword(env: Env, password: string): Promise<boolean> {
  if (env.ADMIN_PASSWORD.startsWith('$2')) {
    return bcrypt.compare(password, env.ADMIN_PASSWORD)
  }
  return password === env.ADMIN_PASSWORD
}
