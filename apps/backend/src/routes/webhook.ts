import { Router } from 'express'
import type { Container } from '../container.js'
import { verifyMetaSignature } from '../lib/metaSignature.js'
import { parseMessengerTextEvents } from '../lib/parseMessengerWebhook.js'
import { WebhookDedupCache } from '../lib/webhookDedup.js'
import { webhookRateLimit } from '../middleware/webhookRateLimit.js'

const dedupCache = new WebhookDedupCache()

export function createWebhookRouter(container: Container): Router {
  const router = Router()

  router.get('/', (req, res) => {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    if (
      mode === 'subscribe' &&
      typeof token === 'string' &&
      token === container.env.FB_VERIFY_TOKEN &&
      typeof challenge === 'string'
    ) {
      res.status(200).send(challenge)
      return
    }

    container.logger.warn({ mode }, 'Webhook verification failed')
    res.sendStatus(403)
  })

  router.post('/', webhookRateLimit, (req, res) => {
    const rawBody = req.body as Buffer
    const signature = req.headers['x-hub-signature-256'] as string | undefined
    const clientIp =
      (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0]?.trim()
        : undefined) ?? req.ip

    if (!Buffer.isBuffer(rawBody) || !verifyMetaSignature(rawBody, signature, container.env.FB_APP_SECRET)) {
      container.logger.warn({ clientIp, at: new Date().toISOString() }, 'Webhook signature rejected')
      res.sendStatus(403)
      return
    }

    let payload: unknown
    try {
      payload = JSON.parse(rawBody.toString('utf8'))
    } catch {
      res.sendStatus(400)
      return
    }

    const events = parseMessengerTextEvents(payload)

    res.status(200).json({ status: 'ok' })

    for (const event of events) {
      if (dedupCache.isDuplicate(event.messageId)) {
        container.logger.info({ messageId: event.messageId }, 'Skipping duplicate webhook message')
        continue
      }

      void container.services.conversation
        .handleIncomingMessage({
          channelUserId: event.senderPsid,
          text: event.text,
          timestamp: event.timestamp,
          channel: 'facebook',
          adapter: container.channels.messenger,
        })
        .catch((err) => {
          container.logger.error(
            { err, senderPsid: event.senderPsid, messageId: event.messageId },
            'Webhook message processing failed',
          )
        })
    }
  })

  return router
}
