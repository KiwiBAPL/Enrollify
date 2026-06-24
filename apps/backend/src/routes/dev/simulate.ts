import { Router } from 'express'
import type { Container } from '../../container.js'

export function createDevRouter(container: Container): Router {
  const router = Router()

  router.post('/simulate-message', async (req, res, next) => {
    try {
      const { text, channelUserId } = req.body as {
        text?: string
        channelUserId?: string
      }

      if (!text || !channelUserId) {
        res.status(400).json({ error: 'text and channelUserId required' })
        return
      }

      await container.services.conversation.handleIncomingMessage({
        channelUserId,
        text,
        timestamp: new Date(),
        channel: 'facebook',
        adapter: container.channels.mock,
      })

      res.json({ ok: true })
    } catch (err) {
      next(err)
    }
  })

  return router
}
