import 'dotenv/config'
import { createServiceClient } from '../db/supabase.js'
import { DEFAULT_ARCHIVE_RETENTION_DAYS } from '../lib/archiveRetention.js'
import { StudentRepository } from '../repositories/StudentRepository.js'
import type { Env } from '../config/env.js'

function requireEnv(name: keyof Pick<Env, 'SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY'>): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing ${name}`)
    process.exit(1)
  }
  return value
}

async function main(): Promise<void> {
  const env = {
    SUPABASE_URL: requireEnv('SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  } as Env

  const retentionDays = Number(process.env.ARCHIVE_RETENTION_DAYS ?? DEFAULT_ARCHIVE_RETENTION_DAYS)
  if (!Number.isFinite(retentionDays) || retentionDays < 1) {
    console.error('ARCHIVE_RETENTION_DAYS must be a positive number')
    process.exit(1)
  }

  const students = new StudentRepository(createServiceClient(env))
  const purged = await students.purgeExpiredArchives(retentionDays)

  console.log(JSON.stringify({ purged, retentionDays, status: 'ok' }))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
