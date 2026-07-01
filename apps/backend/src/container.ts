import type { Env } from './config/env.js'
import { MockChannelAdapter } from './channels/MockChannelAdapter.js'
import { MessengerChannelAdapter } from './channels/MessengerChannelAdapter.js'
import { WebChatChannelAdapter } from './channels/WebChatChannelAdapter.js'
import { createServiceClient } from './db/supabase.js'
import { createLogger } from './lib/logger.js'
import {
  AIProviderRepository,
  ConversationRepository,
  KnowledgeRepository,
  LeadScoreRepository,
  MessageRepository,
  StaffProfileRepository,
  StudentNoteRepository,
  StudentRepository,
  WebchatMessageRepository,
  WebchatSessionRepository,
} from './repositories/index.js'
import { AIService } from './services/AIService.js'
import { ConversationService } from './services/ConversationService.js'
import { KnowledgeService } from './services/KnowledgeService.js'
import { LeadScoringService } from './services/LeadScoringService.js'
import { LeadBotService } from './services/LeadBotService.js'
import { QuestionCategorizationService } from './services/QuestionCategorizationService.js'
import { WebChatService } from './services/WebChatService.js'

export function createContainer(env: Env) {
  const logger = createLogger(env)
  const db = createServiceClient(env)

  const repositories = {
    students: new StudentRepository(db),
    conversations: new ConversationRepository(db),
    messages: new MessageRepository(db),
    leadScores: new LeadScoreRepository(db),
    studentNotes: new StudentNoteRepository(db),
    staffProfiles: new StaffProfileRepository(db),
    knowledge: new KnowledgeRepository(db),
    aiProviders: new AIProviderRepository(db),
    webchatSessions: new WebchatSessionRepository(db),
    webchatMessages: new WebchatMessageRepository(db),
  }

  const knowledgeService = new KnowledgeService(repositories.knowledge)
  const aiService = new AIService(env, logger, repositories.aiProviders)
  const leadScoringService = new LeadScoringService(repositories.leadScores)
  const questionCategorizationService = new QuestionCategorizationService()
  const webChatService = new WebChatService(
    repositories.webchatSessions,
    repositories.webchatMessages,
    knowledgeService,
    aiService,
    questionCategorizationService,
    logger,
  )
  const leadBotService = new LeadBotService(
    repositories.students,
    repositories.conversations,
    repositories.messages,
    repositories.leadScores,
    logger,
  )
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
  const webChatChannelAdapter = new WebChatChannelAdapter()

  return {
    env,
    logger,
    db,
    repositories,
    services: {
      knowledge: knowledgeService,
      ai: aiService,
      leadScoring: leadScoringService,
      leadBot: leadBotService,
      conversation: conversationService,
      webChat: webChatService,
    },
    channels: {
      mock: mockChannelAdapter,
      messenger: messengerChannelAdapter,
      webchat: webChatChannelAdapter,
    },
  }
}

export type Container = ReturnType<typeof createContainer>
