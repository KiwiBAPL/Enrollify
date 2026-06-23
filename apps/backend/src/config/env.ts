import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  FB_PAGE_ACCESS_TOKEN: z.string().min(1),
  FB_VERIFY_TOKEN: z.string().min(1),
  FB_APP_SECRET: z.string().min(1),
  CLAUDE_API_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
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
