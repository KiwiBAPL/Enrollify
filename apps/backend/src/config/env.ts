import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  FB_PAGE_ACCESS_TOKEN: z.string().optional().default(''),
  FB_VERIFY_TOKEN: z.string().optional().default(''),
  FB_APP_SECRET: z.string().optional().default(''),
  CHAT_ENABLED: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),
  PERPLEXITY_API_KEY: z.string().optional(),
  PERPLEXITY_MODEL: z.string().default('sonar-pro'),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),
  AI_PROVIDER_ENCRYPTION_KEY: z.string().min(32),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_FIRST_NAME: z.string().min(1).default('Paul'),
  ADMIN_LAST_NAME: z.string().min(1).default('Benn'),
  CORS_ORIGIN: z.string().default('http://localhost:5180'),
})

export type Env = z.infer<typeof envSchema>

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const missing = result.error.issues
      .map((issue) => issue.path.join('.') || issue.message)
      .join(', ')
    console.error(`Environment validation failed: ${missing}`)
    process.exit(1)
  }

  return result.data
}

export function parseCorsOrigins(corsOrigin: string): string[] {
  return corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

const PLACEHOLDER_KEYS = new Set(['dev-placeholder', 'placeholder', ''])

export function isMockAiKey(apiKey: string | undefined): boolean {
  if (!apiKey || PLACEHOLDER_KEYS.has(apiKey)) return true
  return !apiKey.startsWith('pplx-') && !apiKey.startsWith('sk-ant-') && !apiKey.startsWith('sk-')
}
