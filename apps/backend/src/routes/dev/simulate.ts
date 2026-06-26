import { Router } from 'express'
import type { Container } from '../../container.js'
import { signMetaPayload } from '../../lib/metaSignature.js'
import { buildMessengerWebhookPayload } from '../../lib/parseMessengerWebhook.js'

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

  router.post('/simulate-webhook', async (req, res, next) => {
    try {
      const { text, channelUserId } = req.body as {
        text?: string
        channelUserId?: string
      }

      if (!text || !channelUserId) {
        res.status(400).json({ error: 'text and channelUserId required' })
        return
      }

      const payload = buildMessengerWebhookPayload(channelUserId, text)
      const rawBody = Buffer.from(JSON.stringify(payload), 'utf8')
      const signature = signMetaPayload(rawBody, container.env.FB_APP_SECRET)

      const port = container.env.PORT
      const webhookUrl = `http://127.0.0.1:${port}/webhook`

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hub-Signature-256': signature,
        },
        body: rawBody,
      })

      const body = await response.text()
      res.status(response.status).send(body || undefined)
    } catch (err) {
      next(err)
    }
  })

  return router
}
