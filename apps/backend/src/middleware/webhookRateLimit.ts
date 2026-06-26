import type { Request, Response, NextFunction } from 'express'

const WINDOW_MS = 60_000
const MAX_REQUESTS = 500

interface WindowState {
  count: number
  windowStart: number
}

const ipWindows = new Map<string, WindowState>()

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() ?? req.ip ?? 'unknown'
  }
  return req.ip ?? 'unknown'
}

export function webhookRateLimit(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIp(req)
  const now = Date.now()

  let state = ipWindows.get(ip)
  if (!state || now - state.windowStart >= WINDOW_MS) {
    state = { count: 0, windowStart: now }
    ipWindows.set(ip, state)
  }

  state.count += 1

  if (state.count > MAX_REQUESTS) {
    res.status(429).json({ error: 'Too many requests' })
    return
  }

  next()
}
