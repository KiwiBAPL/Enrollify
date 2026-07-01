import type { Logger } from '../lib/logger.js'
import type { WebchatMessageRepository } from '../repositories/WebchatMessageRepository.js'
import type { WebchatSessionRepository } from '../repositories/WebchatSessionRepository.js'
import type { Message, Student, WebchatMessage } from '../types/domain.js'
import type { AIService } from './AIService.js'
import type { KnowledgeService } from './KnowledgeService.js'
import type { QuestionCategorizationService } from './QuestionCategorizationService.js'

export interface WebChatMessageParams {
  sessionId: string
  text: string
  timestamp: Date
  leadBotCompleted?: boolean
}

export interface WebChatResult {
  reply: string
  consultationInvite: string | null
  sessionId: string
}

function createWebchatStudentStub(sessionId: string): Student {
  const now = new Date(0).toISOString()
  return {
    id: '00000000-0000-4000-8000-000000000000',
    channel: 'webchat',
    channel_user_id: sessionId,
    name: null,
    email: null,
    phone: null,
    country: null,
    citizenship: null,
    current_education_level: null,
    desired_qualification: null,
    field_of_study: null,
    english_level: null,
    preferred_intake: null,
    budget: null,
    visa_status: null,
    funding_source: null,
    funds_available: null,
    english_test_completed: null,
    visa_refusal_history: null,
    enrolment_status: 'enquiry',
    last_activity_at: null,
    archived_at: null,
    created_at: now,
    updated_at: now,
  }
}

function toAiHistory(messages: WebchatMessage[]): Message[] {
  return messages.map((m) => ({
    id: m.id,
    conversation_id: m.session_id,
    message_type: m.message_type,
    content: m.content,
    created_at: m.created_at,
  }))
}

export class WebChatService {
  constructor(
    private readonly sessionRepository: WebchatSessionRepository,
    private readonly messageRepository: WebchatMessageRepository,
    private readonly knowledgeService: KnowledgeService,
    private readonly aiService: AIService,
    private readonly categorizationService: QuestionCategorizationService,
    private readonly logger: Logger,
  ) {}

  async handleMessage(params: WebChatMessageParams): Promise<WebChatResult> {
    const { sessionId, text, timestamp } = params
    const leadBotCompleted = params.leadBotCompleted ?? false
    const activityAt = new Date()

    await this.sessionRepository.upsert(sessionId, activityAt)

    const history = await this.messageRepository.listBySessionId(sessionId, { limit: 100 })
    const knowledgeArticles = await this.knowledgeService.searchForMessage(text)
    const studentStub = createWebchatStudentStub(sessionId)

    const { reply, consultationInvite } = await this.aiService.generate(
      studentStub,
      toAiHistory(history),
      text,
      knowledgeArticles,
      { suppressConsultationInvite: leadBotCompleted },
    )

    const userMessage = await this.messageRepository.createUserMessage(sessionId, text, timestamp)
    await this.messageRepository.createAssistantMessage(sessionId, reply)

    void this.categorizeInBackground(userMessage.id, text)

    return {
      reply,
      consultationInvite,
      sessionId,
    }
  }

  private categorizeInBackground(messageId: string, questionText: string): void {
    void (async () => {
      try {
        const category = this.categorizationService.categorize(questionText)
        await this.messageRepository.updateCategory(messageId, category)
      } catch (err) {
        this.logger.error({ err, messageId }, 'Failed to categorize webchat question')
      }
    })()
  }
}
