import { Router } from 'express'
import type { Container } from '../../container.js'
import { decryptApiKey, encryptApiKey, maskApiKey } from '../../lib/providerKeyCrypto.js'
import type { AIProviderCreate, AIProviderPublic, AIProviderType } from '../../types/aiProvider.js'

const PROVIDER_TYPES: AIProviderType[] = ['perplexity', 'claude']

function toPublic(row: { id: string; name: string; provider_type: AIProviderType; model: string; api_key_ciphertext: string; enabled: boolean; priority: number; created_at: string; updated_at: string }, encryptionKey: string): AIProviderPublic {
  let masked = '••••••••'
  try {
    const plain = decryptApiKey(row.api_key_ciphertext, encryptionKey)
    masked = maskApiKey(plain)
  } catch {
    masked = '••••••••'
  }

  return {
    id: row.id,
    name: row.name,
    provider_type: row.provider_type,
    model: row.model,
    masked_api_key: masked,
    enabled: row.enabled,
    priority: row.priority,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export function createAIProvidersRouter(container: Container): Router {
  const router = Router()
  const { env, repositories, services } = container

  router.get('/', async (_req, res, next) => {
    try {
      const rows = await repositories.aiProviders.listAll()
      res.json({
        providers: rows.map((row) => toPublic(row, env.AI_PROVIDER_ENCRYPTION_KEY)),
      })
    } catch (err) {
      next(err)
    }
  })

  router.post('/', async (req, res, next) => {
    try {
      const body = req.body as Partial<AIProviderCreate>
      if (!body.name?.trim() || !body.provider_type || !body.model?.trim() || !body.api_key?.trim()) {
        res.status(400).json({ error: 'name, provider_type, model, and api_key are required' })
        return
      }
      if (!PROVIDER_TYPES.includes(body.provider_type)) {
        res.status(400).json({ error: 'Invalid provider_type' })
        return
      }

      const ciphertext = encryptApiKey(body.api_key.trim(), env.AI_PROVIDER_ENCRYPTION_KEY)
      const row = await repositories.aiProviders.create({
        name: body.name.trim(),
        provider_type: body.provider_type,
        model: body.model.trim(),
        api_key: body.api_key.trim(),
        api_key_ciphertext: ciphertext,
        enabled: body.enabled ?? true,
        priority: body.priority ?? 100,
      })

      services.ai.invalidateCache()
      res.status(201).json({ provider: toPublic(row, env.AI_PROVIDER_ENCRYPTION_KEY) })
    } catch (err) {
      next(err)
    }
  })

  router.patch('/:id', async (req, res, next) => {
    try {
      const existing = await repositories.aiProviders.findById(req.params.id)
      if (!existing) {
        res.status(404).json({ error: 'Provider not found' })
        return
      }

      const body = req.body as {
        name?: string
        model?: string
        api_key?: string
        enabled?: boolean
        priority?: number
      }

      const patch: {
        name?: string
        model?: string
        enabled?: boolean
        priority?: number
        api_key_ciphertext?: string
      } = {}

      if (body.name !== undefined) patch.name = body.name.trim()
      if (body.model !== undefined) patch.model = body.model.trim()
      if (body.enabled !== undefined) patch.enabled = body.enabled
      if (body.priority !== undefined) patch.priority = body.priority
      if (body.api_key?.trim()) {
        patch.api_key_ciphertext = encryptApiKey(body.api_key.trim(), env.AI_PROVIDER_ENCRYPTION_KEY)
      }

      const row = await repositories.aiProviders.update(req.params.id, patch)
      services.ai.invalidateCache()
      res.json({ provider: toPublic(row, env.AI_PROVIDER_ENCRYPTION_KEY) })
    } catch (err) {
      next(err)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const existing = await repositories.aiProviders.findById(req.params.id)
      if (!existing) {
        res.status(404).json({ error: 'Provider not found' })
        return
      }

      await repositories.aiProviders.delete(req.params.id)
      services.ai.invalidateCache()
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  })

  router.post('/:id/test', async (req, res) => {
    try {
      const provider = await repositories.aiProviders.findById(req.params.id)
      if (!provider) {
        res.status(404).json({ error: 'Provider not found' })
        return
      }

      await services.ai.testProvider(provider)
      res.json({ ok: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Test failed'
      res.status(502).json({ ok: false, error: message })
    }
  })

  return router
}
