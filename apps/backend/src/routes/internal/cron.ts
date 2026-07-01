import { Router, type Request, type Response, type NextFunction } from 'express'
import type { Container } from '../../container.js'

function cronAuth(container: Container) {
  return (req: Request, res: Response, next: NextFunction) => {
    const secret = container.env.CRON_SECRET
    if (!secret) {
      res.status(503).json({ error: 'Cron not configured' })
      return
    }

    const auth = req.headers.authorization
    if (auth !== `Bearer ${secret}`) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    next()
  }
}

export function createInternalCronRouter(container: Container): Router {
  const router = Router()

  router.post('/purge-archived-students', cronAuth(container), async (_req, res, next) => {
    try {
      const purged = await container.repositories.students.purgeExpiredArchives(
        container.env.ARCHIVE_RETENTION_DAYS,
      )
      container.logger.info({ purged }, 'Purged expired archived students')
      res.json({ purged })
    } catch (err) {
      next(err)
    }
  })

  return router
}
