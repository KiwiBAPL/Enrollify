export type AIProviderType = 'perplexity' | 'claude'

export interface AIProviderRow {
  id: string
  name: string
  provider_type: AIProviderType
  model: string
  api_key_ciphertext: string
  enabled: boolean
  priority: number
  created_at: string
  updated_at: string
}

export interface AIProviderPublic {
  id: string
  name: string
  provider_type: AIProviderType
  model: string
  masked_api_key: string
  enabled: boolean
  priority: number
  created_at: string
  updated_at: string
}

export interface AIProviderCreate {
  name: string
  provider_type: AIProviderType
  model: string
  api_key: string
  enabled?: boolean
  priority?: number
}

export interface AIProviderUpdate {
  name?: string
  model?: string
  api_key?: string
  enabled?: boolean
  priority?: number
}
