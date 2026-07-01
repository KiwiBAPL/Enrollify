import type {
  KnowledgeArticle,
  LeadScoreFactors,
  Message,
  Student,
  StudentUpdate,
} from '../../types/domain.js'
import type { AIProviderRow } from '../../types/aiProvider.js'

export interface AIGenerateInput {
  student: Student
  history: Message[]
  userMessage: string
  knowledgeArticles: KnowledgeArticle[]
  timeoutMs: number
}

export interface AIGenerateOutput {
  reply: string
  fieldUpdates: StudentUpdate
  scoreFactors: LeadScoreFactors | null
}

export interface AIProvider {
  readonly type: AIProviderRow['provider_type']
  generate(config: AIProviderRow, apiKey: string, input: AIGenerateInput): Promise<AIGenerateOutput>
  testConnection(config: AIProviderRow, apiKey: string, timeoutMs: number): Promise<void>
}

export const LEAD_FIELD_KEYS = [
  'name',
  'email',
  'phone',
  'country',
  'citizenship',
  'current_education_level',
  'desired_qualification',
  'field_of_study',
  'english_level',
  'preferred_intake',
  'budget',
  'visa_status',
] as const

export function sanitizeFieldUpdates(fields: Record<string, unknown>): StudentUpdate {
  const updates: StudentUpdate = {}
  for (const key of LEAD_FIELD_KEYS) {
    const val = fields[key]
    if (typeof val === 'string' && val.trim()) {
      ;(updates as Record<string, string>)[key] = val.trim()
    }
  }
  return updates
}

export function sanitizeScoreFactors(raw: Record<string, unknown>): LeadScoreFactors {
  const clamp = (v: unknown) => Math.min(10, Math.max(0, Math.round(Number(v) || 0)))
  return {
    ready_to_apply: clamp(raw.ready_to_apply),
    english_ability: clamp(raw.english_ability),
    budget_fit: clamp(raw.budget_fit),
    intake_timeframe: clamp(raw.intake_timeframe),
    visa_readiness: clamp(raw.visa_readiness),
    education_match: clamp(raw.education_match),
    interest_level: clamp(raw.interest_level),
  }
}

export function buildStudentContext(student: Student): string {
  return `\n\nCurrent student record:\n${JSON.stringify({
    name: student.name,
    email: student.email,
    phone: student.phone,
    country: student.country,
    citizenship: student.citizenship,
    current_education_level: student.current_education_level,
    desired_qualification: student.desired_qualification,
    field_of_study: student.field_of_study,
    english_level: student.english_level,
    preferred_intake: student.preferred_intake,
    budget: student.budget,
    visa_status: student.visa_status,
  })}`
}

export function buildKnowledgeContext(knowledgeArticles: KnowledgeArticle[]): string {
  if (knowledgeArticles.length === 0) return ''
  return `\n\nKnowledge base:\n${knowledgeArticles.map((a) => `### ${a.title}\n${a.content}`).join('\n\n')}`
}

export function buildChatMessages(
  history: Message[],
  userMessage: string,
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return [
    ...history.map((m) => ({
      role: m.message_type === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    })),
    { role: 'user' as const, content: userMessage },
  ]
}

export const STRUCTURED_RESPONSE_SCHEMA = {
  name: 'enrollify_response',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      reply: {
        type: 'string',
        description:
          'Plain-text conversational reply — no markdown, citations, footnotes, or URLs',
      },
      field_updates: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          country: { type: 'string' },
          citizenship: { type: 'string' },
          current_education_level: { type: 'string' },
          desired_qualification: { type: 'string' },
          field_of_study: { type: 'string' },
          english_level: { type: 'string' },
          preferred_intake: { type: 'string' },
          budget: { type: 'string' },
          visa_status: { type: 'string' },
        },
        additionalProperties: false,
      },
      score_factors: {
        type: 'object',
        properties: {
          ready_to_apply: { type: 'number' },
          english_ability: { type: 'number' },
          budget_fit: { type: 'number' },
          intake_timeframe: { type: 'number' },
          visa_readiness: { type: 'number' },
          education_match: { type: 'number' },
          interest_level: { type: 'number' },
        },
        additionalProperties: false,
      },
    },
    required: ['reply', 'field_updates'],
    additionalProperties: false,
  },
}
