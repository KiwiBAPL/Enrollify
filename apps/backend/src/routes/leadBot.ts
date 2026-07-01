import { Router, type Request } from 'express'
import { z } from 'zod'
import type { Container } from '../container.js'
import { chatIpRateLimit, checkChatSessionRateLimit } from '../middleware/chatRateLimit.js'
import { LEAD_BOT_STEP_IDS } from '../lead-bot/flow.js'
import { LeadBotError } from '../services/LeadBotService.js'

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const sessionSchema = z.object({
  sessionId: z.string().regex(UUID_V4, 'sessionId must be a UUID v4'),
})

const stepSchema = z.object({
  stepId: z.enum(LEAD_BOT_STEP_IDS),
  value: z.string().trim().min(1).max(500),
})

function sessionIdParam(req: Request): string | null {
  const raw = req.params.sessionId
  const id = Array.isArray(raw) ? raw[0] : raw
  if (!id || !UUID_V4.test(id)) return null
  return id
}

export function createLeadBotRouter(container: Container): Router {
  const router = Router()

  router.post('/sessions', chatIpRateLimit, async (req, res, next) => {
    try {
      const parsed = sessionSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' })
        return
      }

      const { sessionId } = parsed.data
      if (!checkChatSessionRateLimit(sessionId)) {
        res.status(429).json({ error: 'Too many requests' })
        return
      }

      const state = await container.services.leadBot.createOrResumeSession(sessionId)
      res.json(state)
    } catch (err) {
      next(err)
    }
  })

  router.post('/sessions/:sessionId/steps', chatIpRateLimit, async (req, res, next) => {
    try {
      const sessionId = sessionIdParam(req)
      if (!sessionId) {
        res.status(400).json({ error: 'sessionId must be a UUID v4' })
        return
      }

      if (!checkChatSessionRateLimit(sessionId)) {
        res.status(429).json({ error: 'Too many requests' })
        return
      }

      const parsed = stepSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' })
        return
      }

      const result = await container.services.leadBot.submitStep(
        sessionId,
        parsed.data.stepId,
        parsed.data.value,
      )
      res.json(result)
    } catch (err) {
      if (err instanceof LeadBotError) {
        res.status(err.status).json({ error: err.message })
        return
      }
      next(err)
    }
  })

  router.post('/sessions/:sessionId/complete', chatIpRateLimit, async (req, res, next) => {
    try {
      const sessionId = sessionIdParam(req)
      if (!sessionId) {
        res.status(400).json({ error: 'sessionId must be a UUID v4' })
        return
      }

      if (!checkChatSessionRateLimit(sessionId)) {
        res.status(429).json({ error: 'Too many requests' })
        return
      }

      const result = await container.services.leadBot.completeSession(sessionId)
      res.json(result)
    } catch (err) {
      if (err instanceof LeadBotError) {
        res.status(err.status).json({ error: err.message })
        return
      }
      next(err)
    }
  })

  return router
}
