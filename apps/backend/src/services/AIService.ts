import type { Env } from '../config/env.js'
import { isMockAiKey } from '../config/env.js'
import { decryptApiKey, encryptApiKey } from '../lib/providerKeyCrypto.js'
import type { Logger } from '../lib/logger.js'
import type { AIProviderRepository } from '../repositories/AIProviderRepository.js'
import type {
  KnowledgeArticle,
  LeadScoreFactors,
  Message,
  Student,
  StudentUpdate,
} from '../types/domain.js'
import type { AIProviderRow } from '../types/aiProvider.js'
import { getProviderImplementation } from './ai/factory.js'
import { generateMockFromMessage } from './ai/MockProvider.js'
import type { AIGenerateInput } from './ai/types.js'

export interface AIGenerateResult {
  reply: string
  fieldUpdates: StudentUpdate
  scoreFactors: LeadScoreFactors | null
}

const CACHE_TTL_MS = 60_000

export class AIService {
  private bootstrapPromise: Promise<void> | null = null
  private cachedProviders: AIProviderRow[] | null = null
  private cacheExpiresAt = 0

  constructor(
    private readonly env: Env,
    private readonly logger: Logger,
    private readonly providerRepo: AIProviderRepository,
  ) {}

  async generate(
    student: Student,
    history: Message[],
    userMessage: string,
    knowledgeArticles: KnowledgeArticle[],
  ): Promise<AIGenerateResult> {
    await this.ensureBootstrapped()

    const providers = await this.getEnabledProviders()
    const input: AIGenerateInput = {
      student,
      history,
      userMessage,
      knowledgeArticles,
      timeoutMs: this.env.AI_REQUEST_TIMEOUT_MS,
    }

    if (providers.length === 0) {
      if (this.env.NODE_ENV !== 'production') {
        return generateMockFromMessage(student, userMessage)
      }
      return this.fallbackError()
    }

    for (const provider of providers) {
      try {
        const apiKey = decryptApiKey(
          provider.api_key_ciphertext,
          this.env.AI_PROVIDER_ENCRYPTION_KEY,
        )
        const impl = getProviderImplementation(provider.provider_type)
        const result = await impl.generate(provider, apiKey, input)
        return result
      } catch (err) {
        this.logger.error(
          { err, providerId: provider.id, providerType: provider.provider_type },
          'AI provider failed',
        )
      }
    }

    if (this.env.NODE_ENV !== 'production') {
      return generateMockFromMessage(student, userMessage)
    }

    return this.fallbackError()
  }

  async testProvider(provider: AIProviderRow): Promise<void> {
    const apiKey = decryptApiKey(provider.api_key_ciphertext, this.env.AI_PROVIDER_ENCRYPTION_KEY)
    const impl = getProviderImplementation(provider.provider_type)
    await impl.testConnection(provider, apiKey, this.env.AI_REQUEST_TIMEOUT_MS)
  }

  invalidateCache(): void {
    this.cachedProviders = null
    this.cacheExpiresAt = 0
  }

  private async getEnabledProviders(): Promise<AIProviderRow[]> {
    const now = Date.now()
    if (this.cachedProviders && now < this.cacheExpiresAt) {
      return this.cachedProviders
    }

    const providers = await this.providerRepo.listEnabled()
    this.cachedProviders = providers
    this.cacheExpiresAt = now + CACHE_TTL_MS
    return providers
  }

  private async ensureBootstrapped(): Promise<void> {
    if (!this.bootstrapPromise) {
      this.bootstrapPromise = this.bootstrapFromEnv()
    }
    await this.bootstrapPromise
  }

  private async bootstrapFromEnv(): Promise<void> {
    const count = await this.providerRepo.count()
    if (count > 0) return

    const apiKey = this.env.PERPLEXITY_API_KEY
    if (isMockAiKey(apiKey)) return

    const ciphertext = encryptApiKey(apiKey!, this.env.AI_PROVIDER_ENCRYPTION_KEY)
    await this.providerRepo.create({
      name: 'Perplexity (env bootstrap)',
      provider_type: 'perplexity',
      model: this.env.PERPLEXITY_MODEL,
      api_key: apiKey!,
      api_key_ciphertext: ciphertext,
      enabled: true,
      priority: 10,
    })

    this.logger.info('Bootstrapped Perplexity AI provider from PERPLEXITY_API_KEY')
    this.invalidateCache()
  }

  private fallbackError(): AIGenerateResult {
    return {
      reply: "I'm having trouble right now, please try again in a moment.",
      fieldUpdates: {},
      scoreFactors: null,
    }
  }
}
