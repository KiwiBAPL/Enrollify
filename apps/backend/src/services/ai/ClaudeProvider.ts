import { ENROLLIFY_CLAUDE_SYSTEM_PROMPT } from '../../prompts/system.js'
import type { AIProviderRow } from '../../types/aiProvider.js'
import type { LeadScoreFactors } from '../../types/domain.js'
import type { StudentUpdate } from '../../types/domain.js'
import type { AIProvider, AIGenerateInput, AIGenerateOutput } from './types.js'
import {
  buildChatMessages,
  buildKnowledgeContext,
  buildStudentContext,
  sanitizeFieldUpdates,
  sanitizeScoreFactors,
} from './types.js'

const LEAD_FIELDS_TOOL = {
  name: 'update_lead_fields',
  description: 'Update collected student qualification fields and optional lead score factors.',
  input_schema: {
    type: 'object' as const,
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
      },
    },
  },
}

export class ClaudeProvider implements AIProvider {
  readonly type = 'claude' as const

  async generate(
    config: AIProviderRow,
    apiKey: string,
    input: AIGenerateInput,
  ): Promise<AIGenerateOutput> {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })

    const system =
      ENROLLIFY_CLAUDE_SYSTEM_PROMPT +
      buildStudentContext(input.student) +
      buildKnowledgeContext(input.knowledgeArticles)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), input.timeoutMs)

    try {
      const response = await client.messages.create(
        {
          model: config.model,
          max_tokens: 1024,
          system,
          tools: [LEAD_FIELDS_TOOL],
          messages: buildChatMessages(input.history, input.userMessage),
        },
        { signal: controller.signal },
      )

      let reply = ''
      let fieldUpdates: StudentUpdate = {}
      let scoreFactors: LeadScoreFactors | null = null

      for (const block of response.content) {
        if (block.type === 'text') {
          reply += block.text
        }
        if (block.type === 'tool_use' && block.name === 'update_lead_fields') {
          const toolInput = block.input as Record<string, unknown>
          const { score_factors: sf, ...fields } = toolInput
          fieldUpdates = sanitizeFieldUpdates(fields)
          if (sf && typeof sf === 'object') {
            scoreFactors = sanitizeScoreFactors(sf as Record<string, unknown>)
          }
        }
      }

      if (!reply.trim()) {
        reply =
          "Thanks for reaching out! I'm here to help you explore study options in New Zealand. What would you like to know?"
      }

      return { reply: reply.trim(), fieldUpdates, scoreFactors }
    } finally {
      clearTimeout(timeout)
    }
  }

  async testConnection(config: AIProviderRow, apiKey: string, timeoutMs: number): Promise<void> {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      await client.messages.create(
        {
          model: config.model,
          max_tokens: 16,
          messages: [{ role: 'user', content: 'Reply with OK only.' }],
        },
        { signal: controller.signal },
      )
    } finally {
      clearTimeout(timeout)
    }
  }
}
