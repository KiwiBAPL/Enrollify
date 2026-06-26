import type { NextFunction, Request, Response } from 'express'
import type { ServiceSupabaseClient } from '../db/supabase.js'

export interface AuthPayload {
  sub: string
  role: 'admin'
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload
    }
  }
}

export function createAuthMiddleware(db: ServiceSupabaseClient) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const token = header.slice(7)
    const { data, error } = await db.auth.getUser(token)

    if (error || !data.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    if (data.user.app_metadata?.role !== 'admin') {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    req.auth = {
      sub: data.user.email ?? data.user.id,
      role: 'admin',
    }
    next()
  }
}
