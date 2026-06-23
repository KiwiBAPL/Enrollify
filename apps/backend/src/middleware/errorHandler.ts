import type { NextFunction, Request, Response } from 'express'
import type { Logger } from '../lib/logger.js'
import { RepositoryError } from '../repositories/errors.js'

export function errorHandler(logger: Logger) {
  return (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
    const requestId = req.id

    if (err instanceof RepositoryError) {
      logger.error({ requestId, err: err.repositoryCause ?? err.message }, err.message)
      res.status(500).json({ error: 'Database operation failed' })
      return
    }

    logger.error({ requestId, err }, 'Unhandled error')
    res.status(500).json({ error: 'Internal server error' })
  }
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found' })
}
