import cors from 'cors'
import express, { type Express } from 'express'
import { pinoHttp } from 'pino-http'
import { parseCorsOrigins } from './config/env.js'
import type { Container } from './container.js'
import { createAdminRouter } from './routes/admin/index.js'
import { createChatRouter } from './routes/chat.js'
import { createLeadBotRouter } from './routes/leadBot.js'
import { createDevRouter } from './routes/dev/simulate.js'
import { createHealthRouter } from './routes/health.js'
import { createInternalCronRouter } from './routes/internal/cron.js'
import { createWebhookRouter } from './routes/webhook.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export function createApp(container: Container): Express {
  const app = express()
  const allowedOrigins = parseCorsOrigins(container.env.CORS_ORIGIN)

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
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true)
          return
        }
        // Local dev: Vite port may differ from CORS_ORIGIN in .env (e.g. 5180 vs 5173)
        if (
          container.env.NODE_ENV !== 'production' &&
          /^http:\/\/localhost(:\d+)?$/.test(origin)
        ) {
          callback(null, true)
          return
        }
        callback(null, false)
      },
      credentials: true,
    }),
  )

  app.use(express.json())

  app.use(createHealthRouter(container))
  app.use('/api/internal/cron', createInternalCronRouter(container))
  app.use('/api/chat', createChatRouter(container))
  app.use('/api/lead-bot', createLeadBotRouter(container))
  app.use('/api/admin', createAdminRouter(container))

  if (container.env.NODE_ENV !== 'production') {
    app.use('/dev', createDevRouter(container))
  }

  app.use(notFoundHandler)
  app.use(errorHandler(container.logger))

  return app
}
