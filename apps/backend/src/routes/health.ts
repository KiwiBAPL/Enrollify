import { Router } from 'express'
import type { Container } from '../container.js'

export function createHealthRouter(container: Container): Router {
  const router = Router()

  router.get('/health', async (_req, res) => {
    const { error } = await container.db
      .from('students')
      .select('id', { count: 'exact', head: true })

    if (error) {
      container.logger.error({ err: error }, 'Health check database probe failed')
      res.status(503).json({ status: 'degraded', database: 'unavailable' })
      return
    }

    res.status(200).json({ status: 'ok', database: 'connected' })
  })

  return router
}
