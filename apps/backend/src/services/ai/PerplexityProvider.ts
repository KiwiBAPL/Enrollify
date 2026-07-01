import { ENROLLIFY_JSON_SYSTEM_PROMPT } from '../../prompts/system.js'
import type { AIProviderRow } from '../../types/aiProvider.js'
import type { LeadScoreFactors } from '../../types/domain.js'
import type { AIProvider, AIGenerateInput, AIGenerateOutput } from './types.js'
import { formatChatReply } from './formatChatReply.js'
import {
  STRUCTURED_RESPONSE_SCHEMA,
  buildChatMessages,
  buildKnowledgeContext,
  buildStudentContext,
  sanitizeConsultationInvite,
  sanitizeFieldUpdates,
  sanitizeScoreFactors,
} from './types.js'

const PERPLEXITY_URL = 'https://api.perplexity.ai/chat/completions'

interface PerplexityResponse {
  choices?: Array<{
    message?: { content?: string }
  }>
  error?: { message?: string }
}

export class PerplexityProvider implements AIProvider {
  readonly type = 'perplexity' as const

  async generate(
    config: AIProviderRow,
    apiKey: string,
    input: AIGenerateInput,
  ): Promise<AIGenerateOutput> {
    const system =
      ENROLLIFY_JSON_SYSTEM_PROMPT +
      buildStudentContext(input.student) +
      buildKnowledgeContext(input.knowledgeArticles)

    const body = {
      model: config.model,
      max_tokens: 1024,
      messages: [{ role: 'system', content: system }, ...buildChatMessages(input.history, input.userMessage)],
      response_format: {
        type: 'json_schema',
        json_schema: STRUCTURED_RESPONSE_SCHEMA,
      },
    }

    const content = await this.callApi(apiKey, body, input.timeoutMs)
    return this.parseStructuredResponse(content)
  }

  async testConnection(config: AIProviderRow, apiKey: string, timeoutMs: number): Promise<void> {
    await this.callApi(
      apiKey,
      {
        model: config.model,
        max_tokens: 16,
        messages: [{ role: 'user', content: 'Reply with OK only.' }],
      },
      timeoutMs,
    )
  }

  private async callApi(
    apiKey: string,
    body: Record<string, unknown>,
    timeoutMs: number,
  ): Promise<string> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(PERPLEXITY_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      const data = (await response.json()) as PerplexityResponse

      if (!response.ok) {
        throw new Error(data.error?.message ?? `Perplexity API error (${response.status})`)
      }

      const content = data.choices?.[0]?.message?.content
      if (!content) {
        throw new Error('Perplexity API returned empty response')
      }

      return content
    } finally {
      clearTimeout(timeout)
    }
  }

  private parseStructuredResponse(content: string): AIGenerateOutput {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(content) as Record<string, unknown>
    } catch {
      throw new Error('Failed to parse Perplexity structured response as JSON')
    }

    const reply =
      typeof parsed.reply === 'string' && parsed.reply.trim()
        ? parsed.reply.trim()
        : "Thanks for reaching out! I'm here to help you explore study options in New Zealand. What would you like to know?"

    const fieldUpdates =
      parsed.field_updates && typeof parsed.field_updates === 'object'
        ? sanitizeFieldUpdates(parsed.field_updates as Record<string, unknown>)
        : {}

    let scoreFactors: LeadScoreFactors | null = null
    if (parsed.score_factors && typeof parsed.score_factors === 'object') {
      scoreFactors = sanitizeScoreFactors(parsed.score_factors as Record<string, unknown>)
    }

    const consultationInvite = sanitizeConsultationInvite(parsed.consultation_invite)

    return { reply: formatChatReply(reply), consultationInvite, fieldUpdates, scoreFactors }
  }
}
