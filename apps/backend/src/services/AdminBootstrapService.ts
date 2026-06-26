import type { ServiceSupabaseClient } from '../db/supabase.js'
import type { Env } from '../config/env.js'
import type { Logger } from '../lib/logger.js'

async function findUserByEmail(
  db: ServiceSupabaseClient,
  email: string,
): Promise<boolean> {
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage })
    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`)
    }

    if (data.users.some((user) => user.email?.toLowerCase() === email.toLowerCase())) {
      return true
    }

    if (data.users.length < perPage) {
      return false
    }

    page += 1
  }
}

export async function ensureAdminUser(
  env: Env,
  db: ServiceSupabaseClient,
  logger: Logger,
): Promise<void> {
  const bootstrapEmail = env.ADMIN_EMAIL
  const bootstrapPassword = env.ADMIN_PASSWORD

  if (bootstrapEmail) {
    const exists = await findUserByEmail(db, bootstrapEmail)

    if (exists) {
      logger.debug({ email: bootstrapEmail }, 'Admin auth user already exists')
      return
    }

    if (!bootstrapPassword) {
      throw new Error(
        `ADMIN_EMAIL is set but ADMIN_PASSWORD is missing. Provide ADMIN_PASSWORD to bootstrap the admin user, or remove ADMIN_EMAIL after bootstrap.`,
      )
    }

    if (bootstrapPassword.startsWith('$2')) {
      throw new Error(
        'ADMIN_PASSWORD must be a plain password for bootstrap (not a bcrypt hash). Set a plain password, restart to bootstrap, then remove ADMIN_* from env.',
      )
    }

    const { error } = await db.auth.admin.createUser({
      email: bootstrapEmail,
      password: bootstrapPassword,
      email_confirm: true,
      app_metadata: { role: 'admin' },
    })

    if (error) {
      throw new Error(`Failed to bootstrap admin user: ${error.message}`)
    }

    logger.info(
      { email: bootstrapEmail },
      'Admin user bootstrapped in Supabase Auth — remove ADMIN_EMAIL and ADMIN_PASSWORD from env',
    )
    return
  }

  const hasAnyAdmin = await hasAdminUser(db)
  if (!hasAnyAdmin && env.NODE_ENV === 'production') {
    throw new Error(
      'No admin user found in Supabase Auth. Set ADMIN_EMAIL and ADMIN_PASSWORD for one-time bootstrap, then remove them from env.',
    )
  }

  if (!hasAnyAdmin) {
    logger.warn(
      'No admin user in Supabase Auth. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env to bootstrap.',
    )
  }
}

async function hasAdminUser(db: ServiceSupabaseClient): Promise<boolean> {
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage })
    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`)
    }

    if (data.users.some((user) => user.app_metadata?.role === 'admin')) {
      return true
    }

    if (data.users.length < perPage) {
      return false
    }

    page += 1
  }
}
