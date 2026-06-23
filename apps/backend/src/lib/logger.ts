import pino from 'pino'
import type { Env } from '../config/env.js'

export function createLogger(env: Env) {
  return pino({
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    redact: {
      paths: [
        'req.headers.authorization',
        'email',
        'phone',
        'name',
        'content',
      ],
      remove: true,
    },
  })
}

export type Logger = ReturnType<typeof createLogger>
