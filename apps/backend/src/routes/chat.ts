import { Router } from 'express'
import { z } from 'zod'
import type { Container } from '../container.js'
import { chatIpRateLimit, checkChatSessionRateLimit } from '../middleware/chatRateLimit.js'

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const chatMessageSchema = z.object({
  sessionId: z.string().regex(UUID_V4, 'sessionId must be a UUID v4'),
  text: z
    .string()
    .trim()
    .min(1, 'text is required')
    .max(2000, 'text must be at most 2000 characters'),
  leadBotCompleted: z.boolean().optional(),
})

export function createChatRouter(container: Container): Router {
  const router = Router()

  router.post('/messages', chatIpRateLimit, async (req, res, next) => {
    try {
      if (!container.env.CHAT_ENABLED) {
        res.status(503).json({ error: 'Chat is temporarily unavailable' })
        return
      }

      const parsed = chatMessageSchema.safeParse(req.body)
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' })
        return
      }

      const { sessionId, text, leadBotCompleted } = parsed.data

      if (!checkChatSessionRateLimit(sessionId)) {
        res.status(429).json({ error: 'Too many requests' })
        return
      }

      const result = await container.services.webChat.handleMessage({
        sessionId,
        text,
        timestamp: new Date(),
        leadBotCompleted: leadBotCompleted ?? false,
      })

      res.json(result)
    } catch (err) {
      next(err)
    }
  })

  return router
}
