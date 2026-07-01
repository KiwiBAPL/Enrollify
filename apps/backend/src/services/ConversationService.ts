import type { ChannelAdapter } from '../channels/ChannelAdapter.js'
import type { Logger } from '../lib/logger.js'
import type { ConversationRepository } from '../repositories/ConversationRepository.js'
import type { MessageRepository } from '../repositories/MessageRepository.js'
import type { StudentRepository } from '../repositories/StudentRepository.js'
import type { ChannelType } from '../types/domain.js'
import type { AIService } from './AIService.js'
import type { KnowledgeService } from './KnowledgeService.js'
import type { LeadScoringService } from './LeadScoringService.js'

export interface IncomingMessageParams {
  channelUserId: string
  text: string
  timestamp: Date
  channel: ChannelType
  adapter: ChannelAdapter
}

interface ProcessMessageResult {
  reply: string
}

export class ConversationService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly knowledgeService: KnowledgeService,
    private readonly aiService: AIService,
    private readonly leadScoringService: LeadScoringService,
    private readonly logger: Logger,
  ) {}

  async handleIncomingMessage(params: IncomingMessageParams): Promise<void> {
    const { channelUserId, adapter } = params

    await adapter.markSeen(channelUserId)
    await adapter.sendTypingOn(channelUserId)

    try {
      const { reply } = await this.processIncomingMessage(params)
      await adapter.sendMessage(channelUserId, reply)
    } finally {
      await adapter.sendTypingOff(channelUserId)
    }
  }

  private async processIncomingMessage(
    params: IncomingMessageParams,
  ): Promise<ProcessMessageResult> {
    const { channelUserId, text, timestamp, channel } = params

    let student = await this.studentRepository.findByChannelUserId(channel, channelUserId)
    if (!student) {
      student = await this.studentRepository.create({ channel, channel_user_id: channelUserId })
      this.logger.info({ studentId: student.id, channel }, 'Created new student')
    }

    let conversation = await this.conversationRepository.findActiveByStudentId(student.id)
    if (!conversation) {
      conversation = await this.conversationRepository.createForChannel(student.id, channel)
      this.logger.info({ conversationId: conversation.id, studentId: student.id }, 'Created conversation')
    }

    await this.messageRepository.createUserMessage(conversation.id, text, timestamp)

    const knowledgeArticles = await this.knowledgeService.searchForMessage(text)
    const history = await this.messageRepository.listByConversationId(conversation.id, {
      limit: 100,
    })

    const { reply, fieldUpdates, scoreFactors } = await this.aiService.generate(
      student,
      history,
      text,
      knowledgeArticles,
    )

    if (Object.keys(fieldUpdates).length > 0) {
      student = await this.studentRepository.update(student.id, fieldUpdates)
      this.logger.info({ studentId: student.id }, 'Updated student qualification fields')
    }

    if (scoreFactors) {
      await this.leadScoringService.scoreStudent(student.id, scoreFactors)
      this.logger.info({ studentId: student.id }, 'Updated lead score')
    } else if (Object.keys(fieldUpdates).length > 0) {
      await this.leadScoringService.scoreStudent(student.id, {
        ready_to_apply: 2,
        english_ability: 2,
        budget_fit: 2,
        intake_timeframe: 2,
        visa_readiness: 2,
        education_match: 2,
        interest_level: 4,
      })
    }

    await this.messageRepository.createAssistantMessage(conversation.id, reply)

    const activityAt = new Date()
    await this.studentRepository.touchLastActivity(student.id, activityAt)
    await this.conversationRepository.updateLastMessageAt(conversation.id, activityAt)

    return { reply }
  }
}
