import type { NextFunction, Request, Response } from 'express'
import type { ServiceSupabaseClient } from '../db/supabase.js'
import type { StaffProfileRepository } from '../repositories/StaffProfileRepository.js'

export interface AuthPayload {
  userId: string
  email: string
  role: 'admin'
  firstName: string
  lastName: string
  /** @deprecated Use email instead */
  sub: string
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload
    }
  }
}

export function createAuthMiddleware(
  db: ServiceSupabaseClient,
  staffProfiles: StaffProfileRepository,
) {
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

    const profile = await staffProfiles.findById(data.user.id)
    if (!profile) {
      res.status(401).json({ error: 'Staff profile not found' })
      return
    }

    const email = data.user.email ?? profile.email

    req.auth = {
      userId: data.user.id,
      email,
      role: 'admin',
      firstName: profile.first_name,
      lastName: profile.last_name,
      sub: email,
    }
    next()
  }
}
