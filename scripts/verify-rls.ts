/**
 * RLS verification script for blog_posts.
 *
 * Usage:
 *   npm run test:security
 *   npx tsx scripts/verify-rls.ts
 *
 * Requires in .env.local (or env):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY
 *
 * Optional for admin CRUD checks:
 *   SUPABASE_TEST_ADMIN_EMAIL
 *   SUPABASE_TEST_ADMIN_PASSWORD
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createNodeSupabaseClient } from './supabase-node-client.ts'

function loadEnvLocal(): Record<string, string> {
  const envPath = resolve(process.cwd(), '.env.local')
  const vars: Record<string, string> = {}

  if (!existsSync(envPath)) return vars

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    vars[key] = value
  }
  return vars
}

const envLocal = loadEnvLocal()

const url = process.env.VITE_SUPABASE_URL ?? envLocal.VITE_SUPABASE_URL ?? ''
const publishableKey =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  envLocal.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  envLocal.VITE_SUPABASE_ANON_KEY ??
  ''

const adminEmail =
  process.env.SUPABASE_TEST_ADMIN_EMAIL ?? envLocal.SUPABASE_TEST_ADMIN_EMAIL ?? ''
const adminPassword =
  process.env.SUPABASE_TEST_ADMIN_PASSWORD ?? envLocal.SUPABASE_TEST_ADMIN_PASSWORD ?? ''

if (!url || !publishableKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env.local')
  process.exit(1)
}

const anonClient = createNodeSupabaseClient(url, publishableKey)

const TEST_SLUG = `rls-verify-${Date.now()}`

async function run() {
  let passed = 0
  let failed = 0

  const ok = (msg: string) => {
    console.log(`  PASS: ${msg}`)
    passed++
  }
  const fail = (msg: string, detail?: unknown) => {
    console.error(`  FAIL: ${msg}`)
    if (detail) console.error('       ', detail)
    failed++
  }

  console.log('\n=== blog_posts RLS verification ===\n')

  console.log('1. Anonymous read (published filter via RLS)')
  const { data: anonPosts, error: anonErr } = await anonClient
    .from('blog_posts')
    .select('id, status')

  if (anonErr) {
    if (anonErr.message.includes('does not exist')) {
      fail('blog_posts table not found — apply blog_posts migration first', anonErr.message)
    } else {
      fail('Anonymous SELECT failed', anonErr.message)
    }
  } else {
    const hasDraft = (anonPosts ?? []).some((p) => p.status === 'draft')
    if (hasDraft) {
      fail('Anonymous query returned draft posts')
    } else {
      ok(`Anonymous SELECT returned ${anonPosts?.length ?? 0} published row(s) only`)
    }
  }

  if (adminEmail && adminPassword) {
    console.log('\n2–4. Admin CRUD (authenticated)')
    const adminClient = createNodeSupabaseClient(url, publishableKey)

    const { error: signInErr } = await adminClient.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    })

    if (signInErr) {
      fail('Admin sign-in failed', signInErr.message)
    } else {
      ok('Admin sign-in succeeded')

      const { data: created, error: createErr } = await adminClient
        .from('blog_posts')
        .insert({
          title: 'RLS Verify Draft',
          slug: TEST_SLUG,
          status: 'draft',
        })
        .select()
        .single()

      if (createErr || !created) {
        fail('Admin INSERT draft failed', createErr?.message)
      } else {
        ok('Admin INSERT draft succeeded')

        const { data: draftByAnon } = await anonClient
          .from('blog_posts')
          .select('id')
          .eq('slug', TEST_SLUG)

        if ((draftByAnon ?? []).length > 0) {
          fail('Draft visible to anonymous client')
        } else {
          ok('Draft hidden from anonymous client')
        }

        const { error: updateErr } = await adminClient
          .from('blog_posts')
          .update({ title: 'RLS Verify Updated' })
          .eq('id', created.id)

        if (updateErr) {
          fail('Admin UPDATE failed', updateErr.message)
        } else {
          ok('Admin UPDATE succeeded')
        }

        const { error: deleteErr } = await adminClient
          .from('blog_posts')
          .delete()
          .eq('id', created.id)

        if (deleteErr) {
          fail('Admin DELETE failed', deleteErr.message)
        } else {
          ok('Admin DELETE succeeded')
        }
      }
    }
  } else {
    console.log(
      '\n2–4. Admin CRUD skipped — set SUPABASE_TEST_ADMIN_EMAIL and SUPABASE_TEST_ADMIN_PASSWORD in .env.local',
    )
  }

  console.log('\n5. Anonymous write blocked')
  const { error: anonInsertErr } = await anonClient.from('blog_posts').insert({
    title: 'Should Fail',
    slug: `anon-block-${Date.now()}`,
    status: 'draft',
  })

  if (anonInsertErr) {
    ok(`Anonymous INSERT rejected (${anonInsertErr.code ?? 'error'})`)
  } else {
    fail('Anonymous INSERT should have been rejected by RLS')
  }

  console.log('\n6. Anonymous explicit draft filter')
  const { data: draftRows, error: draftErr } = await anonClient
    .from('blog_posts')
    .select('id, slug')
    .eq('status', 'draft')

  if (draftErr) {
    fail('Anonymous SELECT with draft filter failed', draftErr.message)
  } else if ((draftRows ?? []).length > 0) {
    fail('Anonymous client returned rows when filtering for drafts')
  } else {
    ok('Explicit draft filter returned 0 rows')
  }

  console.log('\n7–8. Anonymous UPDATE/DELETE blocked')
  const { data: publishedRows } = await anonClient.from('blog_posts').select('id').limit(1)

  if ((publishedRows ?? []).length === 0) {
    console.log(
      '  SKIP: No published posts to test UPDATE/DELETE — create one or run with admin credentials',
    )
  } else {
    const targetId = publishedRows![0].id

    const { error: anonUpdateErr } = await anonClient
      .from('blog_posts')
      .update({ title: 'Hacked' })
      .eq('id', targetId)

    if (anonUpdateErr) {
      ok(`Anonymous UPDATE rejected (${anonUpdateErr.code ?? 'error'})`)
    } else {
      fail('Anonymous UPDATE should have been rejected by RLS')
    }

    const { error: anonDeleteErr } = await anonClient
      .from('blog_posts')
      .delete()
      .eq('id', targetId)

    if (anonDeleteErr) {
      ok(`Anonymous DELETE rejected (${anonDeleteErr.code ?? 'error'})`)
    } else {
      fail('Anonymous DELETE should have been rejected by RLS')
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  process.exit(failed > 0 ? 1 : 0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
