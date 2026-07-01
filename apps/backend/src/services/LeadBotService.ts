import type { Logger } from '../lib/logger.js'
import {
  LEAD_BOT_THANK_YOU,
  answersFromStudent,
  buildStepPrompt,
  firstNameFromName,
  getCurrentStepId,
  getStepDefinition,
  isFlowComplete,
  pickMcqAcknowledgement,
  nextStepId,
  validateStepValue,
  type LeadBotStepId,
} from '../lead-bot/flow.js'
import type { ConversationRepository } from '../repositories/ConversationRepository.js'
import type { LeadScoreRepository } from '../repositories/LeadScoreRepository.js'
import type { MessageRepository } from '../repositories/MessageRepository.js'
import type { StudentRepository } from '../repositories/StudentRepository.js'
import type { Student } from '../types/domain.js'
import {
  computeLeadBotScore,
  getLeadBotBand,
  mapLeadBotAnswersToFactors,
  type LeadBotBand,
} from './LeadBotScoringService.js'

export interface LeadBotSessionState {
  sessionId: string
  studentId: string
  conversationId: string
  currentStep: LeadBotStepId | null
  completed: boolean
  firstName: string | null
  prompt: string | null
  inputType: 'text' | 'mcq' | null
  options: string[] | null
}

export interface LeadBotStepResult {
  currentStep: LeadBotStepId | null
  completed: boolean
  assistantMessages: string[]
  nextPrompt: string | null
  inputType: 'text' | 'mcq' | null
  options: string[] | null
  band?: LeadBotBand
  overallScore?: number
}

export class LeadBotService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly leadScoreRepository: LeadScoreRepository,
    private readonly logger: Logger,
  ) {}

  async createOrResumeSession(sessionId: string): Promise<LeadBotSessionState> {
    let student = await this.studentRepository.findByChannelUserId('lead_bot', sessionId)

    if (!student) {
      student = await this.studentRepository.create({
        channel: 'lead_bot',
        channel_user_id: sessionId,
      })
      this.logger.info({ studentId: student.id }, 'Created lead bot student')
    }

    let conversation = await this.conversationRepository.findActiveByStudentId(student.id)
    if (!conversation) {
      conversation = await this.conversationRepository.createForChannel(student.id, 'lead_bot')
      const firstStep = getCurrentStepId(answersFromStudent(student)) ?? 'name'
      const prompt = buildStepPrompt(firstStep)
      await this.messageRepository.createAssistantMessage(conversation.id, prompt)
      this.logger.info({ conversationId: conversation.id }, 'Started lead bot conversation')
    }

    return this.buildSessionState(sessionId, student, conversation.id)
  }

  async submitStep(
    sessionId: string,
    stepId: LeadBotStepId,
    value: string,
  ): Promise<LeadBotStepResult> {
    const student = await this.studentRepository.findByChannelUserId('lead_bot', sessionId)
    if (!student) {
      throw new LeadBotError('Session not found', 404)
    }

    const conversation = await this.conversationRepository.findActiveByStudentId(student.id)
    if (!conversation) {
      throw new LeadBotError('Conversation not found', 404)
    }

    const answers = answersFromStudent(student)
    const expectedStep = getCurrentStepId(answers)
    if (!expectedStep) {
      throw new LeadBotError('Consultation form already completed', 400)
    }
    if (expectedStep !== stepId) {
      throw new LeadBotError(`Expected step "${expectedStep}"`, 400)
    }

    const validationError = validateStepValue(stepId, value)
    if (validationError) {
      throw new LeadBotError(validationError, 400)
    }

    const trimmed = value.trim()
    const updateField = { [stepId]: trimmed } as Partial<Student>
    const updatedStudent = await this.studentRepository.update(student.id, updateField)
    const now = new Date()

    await this.messageRepository.createUserMessage(conversation.id, trimmed, now)
    await this.studentRepository.touchLastActivity(student.id, now)
    await this.conversationRepository.updateLastMessageAt(conversation.id, now)

    const stepDef = getStepDefinition(stepId)
    const assistantMessages: string[] = []

    if (stepDef.inputType === 'mcq') {
      assistantMessages.push(pickMcqAcknowledgement(trimmed))
    }

    const updatedAnswers = answersFromStudent(updatedStudent)
    if (isFlowComplete(updatedAnswers)) {
      return this.completeFlow(sessionId, updatedStudent, conversation.id, assistantMessages)
    }

    const nextStep = nextStepId(stepId)
    if (!nextStep) {
      throw new LeadBotError('Unexpected end of flow', 500)
    }

    const firstName = firstNameFromName(updatedAnswers.name ?? '')
    const nextPrompt = buildStepPrompt(nextStep, firstName)
    assistantMessages.push(nextPrompt)

    for (const message of assistantMessages) {
      await this.messageRepository.createAssistantMessage(conversation.id, message)
    }

    const nextDef = getStepDefinition(nextStep)
    return {
      currentStep: nextStep,
      completed: false,
      assistantMessages,
      nextPrompt,
      inputType: nextDef.inputType,
      options: nextDef.options ? [...nextDef.options] : null,
    }
  }

  async completeSession(sessionId: string): Promise<LeadBotStepResult> {
    const student = await this.studentRepository.findByChannelUserId('lead_bot', sessionId)
    if (!student) {
      throw new LeadBotError('Session not found', 404)
    }

    const conversation = await this.conversationRepository.findActiveByStudentId(student.id)
    if (!conversation) {
      throw new LeadBotError('Conversation not found', 404)
    }

    const answers = answersFromStudent(student)
    if (!isFlowComplete(answers)) {
      throw new LeadBotError('All questions must be answered before completing', 400)
    }

    return this.completeFlow(sessionId, student, conversation.id, [])
  }

  private async completeFlow(
    sessionId: string,
    student: Student,
    conversationId: string,
    prefixMessages: string[],
  ): Promise<LeadBotStepResult> {
    const answers = answersFromStudent(student)
    const overallScore = computeLeadBotScore(answers)
    const band = getLeadBotBand(overallScore)
    const factors = mapLeadBotAnswersToFactors(answers)

    await this.leadScoreRepository.upsertWithOverallScore(student.id, overallScore, factors)
    await this.studentRepository.updateEnrolmentStatus(student.id, 'qualified_lead')

    const thankYou = LEAD_BOT_THANK_YOU
    const assistantMessages = [...prefixMessages, thankYou]

    for (const message of assistantMessages) {
      await this.messageRepository.createAssistantMessage(conversationId, message)
    }

    const now = new Date()
    await this.studentRepository.touchLastActivity(student.id, now)
    await this.conversationRepository.updateLastMessageAt(conversationId, now)

    this.logger.info({ studentId: student.id, sessionId, overallScore, band }, 'Lead bot completed')

    return {
      currentStep: null,
      completed: true,
      assistantMessages,
      nextPrompt: null,
      inputType: null,
      options: null,
      band,
      overallScore,
    }
  }

  private async buildSessionState(
    sessionId: string,
    student: Student,
    conversationId: string,
  ): Promise<LeadBotSessionState> {
    const answers = answersFromStudent(student)
    const currentStep = getCurrentStepId(answers)
    const completed = currentStep === null
    const firstName = answers.name ? firstNameFromName(answers.name) : null

    if (completed) {
      return {
        sessionId,
        studentId: student.id,
        conversationId,
        currentStep: null,
        completed: true,
        firstName,
        prompt: null,
        inputType: null,
        options: null,
      }
    }

    const stepDef = getStepDefinition(currentStep)
    const prompt = buildStepPrompt(currentStep, firstName ?? undefined)

    return {
      sessionId,
      studentId: student.id,
      conversationId,
      currentStep,
      completed: false,
      firstName,
      prompt,
      inputType: stepDef.inputType,
      options: stepDef.options ? [...stepDef.options] : null,
    }
  }
}

export class LeadBotError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'LeadBotError'
  }
}
