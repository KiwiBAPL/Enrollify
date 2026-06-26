import type { AIProviderType } from '../../types/aiProvider.js'
import { ClaudeProvider } from './ClaudeProvider.js'
import { PerplexityProvider } from './PerplexityProvider.js'
import type { AIProvider } from './types.js'

const perplexity = new PerplexityProvider()
const claude = new ClaudeProvider()

const providers: Record<AIProviderType, AIProvider> = {
  perplexity,
  claude,
}

export function getProviderImplementation(type: AIProviderType): AIProvider {
  return providers[type]
}
