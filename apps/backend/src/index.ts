import express from 'express'
import { pinoHttp } from 'pino-http'
import { loadEnv } from './config/env.js'
import { createServiceClient } from './db/supabase.js'
import { createLogger } from './lib/logger.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import {
  ConversationRepository,
  KnowledgeRepository,
  LeadScoreRepository,
  MessageRepository,
  StudentRepository,
} from './repositories/index.js'

const env = loadEnv()
const logger = createLogger(env)
const db = createServiceClient(env)

export const repositories = {
  students: new StudentRepository(db),
  conversations: new ConversationRepository(db),
  messages: new MessageRepository(db),
  leadScores: new LeadScoreRepository(db),
  knowledge: new KnowledgeRepository(db),
}

const app = express()

app.use(
  pinoHttp({
    logger,
    genReqId: (req: express.Request) =>
      req.headers['x-request-id']?.toString() ?? crypto.randomUUID(),
  }),
)

app.get('/health', async (_req, res) => {
  const { error } = await db.from('students').select('id', { count: 'exact', head: true })

  if (error) {
    logger.error({ err: error }, 'Health check database probe failed')
    res.status(503).json({ status: 'degraded', database: 'unavailable' })
    return
  }

  res.status(200).json({ status: 'ok', database: 'connected' })
})

app.use(notFoundHandler)
app.use(errorHandler(logger))

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'Enrollify AI backend listening')
})
