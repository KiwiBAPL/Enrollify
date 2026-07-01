import type { Request, Response, NextFunction } from 'express'

const WINDOW_MS = 60_000
const MAX_IP_REQUESTS = 30
const MAX_SESSION_REQUESTS = 20

interface WindowState {
  count: number
  windowStart: number
}

const ipWindows = new Map<string, WindowState>()
const sessionWindows = new Map<string, WindowState>()

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() ?? req.ip ?? 'unknown'
  }
  return req.ip ?? 'unknown'
}

function checkLimit(
  store: Map<string, WindowState>,
  key: string,
  max: number,
  now: number,
): boolean {
  let state = store.get(key)
  if (!state || now - state.windowStart >= WINDOW_MS) {
    state = { count: 0, windowStart: now }
    store.set(key, state)
  }
  state.count += 1
  return state.count <= max
}

export function chatIpRateLimit(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now()
  if (!checkLimit(ipWindows, getClientIp(req), MAX_IP_REQUESTS, now)) {
    res.status(429).json({ error: 'Too many requests' })
    return
  }
  next()
}

export function checkChatSessionRateLimit(sessionId: string): boolean {
  return checkLimit(sessionWindows, sessionId, MAX_SESSION_REQUESTS, Date.now())
}
