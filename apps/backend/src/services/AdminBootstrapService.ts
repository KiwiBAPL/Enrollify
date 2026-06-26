import type { ServiceSupabaseClient } from '../db/supabase.js'
import type { Env } from '../config/env.js'
import type { Logger } from '../lib/logger.js'
import type { StaffProfileRepository } from '../repositories/StaffProfileRepository.js'

async function listAllAuthUsers(db: ServiceSupabaseClient) {
  const users = []
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage })
    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`)
    }

    users.push(...data.users)

    if (data.users.length < perPage) {
      break
    }

    page += 1
  }

  return users
}

async function findUserByEmail(
  db: ServiceSupabaseClient,
  email: string,
): Promise<{ id: string; email: string } | null> {
  const users = await listAllAuthUsers(db)
  const match = users.find((user) => user.email?.toLowerCase() === email.toLowerCase())
  if (!match?.email) return null
  return { id: match.id, email: match.email }
}

async function ensureStaffProfileForAdmins(
  db: ServiceSupabaseClient,
  staffProfiles: StaffProfileRepository,
  env: Env,
  logger: Logger,
): Promise<void> {
  const users = await listAllAuthUsers(db)
  const adminUsers = users.filter((user) => user.app_metadata?.role === 'admin')

  for (const user of adminUsers) {
    if (!user.email) continue

    await staffProfiles.ensureProfile({
      id: user.id,
      email: user.email,
      first_name: env.ADMIN_FIRST_NAME,
      last_name: env.ADMIN_LAST_NAME,
      role: 'admin',
    })

    logger.debug({ userId: user.id, email: user.email }, 'Staff profile ensured for admin')
  }
}

export async function ensureAdminUser(
  env: Env,
  db: ServiceSupabaseClient,
  staffProfiles: StaffProfileRepository,
  logger: Logger,
): Promise<void> {
  const bootstrapEmail = env.ADMIN_EMAIL
  const bootstrapPassword = env.ADMIN_PASSWORD

  if (bootstrapEmail) {
    const existing = await findUserByEmail(db, bootstrapEmail)

    if (existing) {
      logger.debug({ email: bootstrapEmail }, 'Admin auth user already exists')
      await ensureStaffProfileForAdmins(db, staffProfiles, env, logger)
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

    const { data, error } = await db.auth.admin.createUser({
      email: bootstrapEmail,
      password: bootstrapPassword,
      email_confirm: true,
      app_metadata: { role: 'admin' },
    })

    if (error) {
      throw new Error(`Failed to bootstrap admin user: ${error.message}`)
    }

    if (data.user?.id && data.user.email) {
      await staffProfiles.create({
        id: data.user.id,
        email: data.user.email,
        first_name: env.ADMIN_FIRST_NAME,
        last_name: env.ADMIN_LAST_NAME,
        role: 'admin',
      })
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
    return
  }

  await ensureStaffProfileForAdmins(db, staffProfiles, env, logger)
}

async function hasAdminUser(db: ServiceSupabaseClient): Promise<boolean> {
  const users = await listAllAuthUsers(db)
  return users.some((user) => user.app_metadata?.role === 'admin')
}
