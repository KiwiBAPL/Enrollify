import cors from 'cors'
import express, { type Express } from 'express'
import { pinoHttp } from 'pino-http'
import type { Container } from './container.js'
import { createAdminRouter } from './routes/admin/index.js'
import { createDevRouter } from './routes/dev/simulate.js'
import { createHealthRouter } from './routes/health.js'
import { createWebhookRouter } from './routes/webhook.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export function createApp(container: Container): Express {
  const app = express()

  app.use(
    pinoHttp({
      logger: container.logger,
      genReqId: (req) => req.headers['x-request-id']?.toString() ?? crypto.randomUUID(),
    }),
  )

  // Webhook: raw body for HMAC validation — no CORS (Meta server-to-server)
  app.use('/webhook', express.raw({ type: 'application/json' }), createWebhookRouter(container))

  app.use(
    cors({
      origin: container.env.CORS_ORIGIN,
      credentials: true,
    }),
  )

  app.use(express.json())

  app.use(createHealthRouter(container))
  app.use('/api/admin', createAdminRouter(container))

  if (container.env.NODE_ENV !== 'production') {
    app.use('/dev', createDevRouter(container))
  }

  app.use(notFoundHandler)
  app.use(errorHandler(container.logger))

  return app
}
