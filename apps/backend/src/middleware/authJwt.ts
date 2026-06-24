import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { Env } from '../config/env.js'

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

export function createAuthMiddleware(env: Env) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const token = header.slice(7)
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload
      if (payload.role !== 'admin') {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }
      req.auth = payload
      next()
    } catch {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
}

export function signAdminToken(env: Env, email: string): string {
  return jwt.sign({ sub: email, role: 'admin' } satisfies AuthPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}
