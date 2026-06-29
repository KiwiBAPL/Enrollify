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

async function verifyResourceLeads(
  ok: (msg: string) => void,
  fail: (msg: string, detail?: unknown) => void,
) {
  console.log('\n=== resource_leads RLS verification ===\n')

  console.log('1. Anonymous SELECT blocked')
  const { data: anonLeads, error: anonSelectErr } = await anonClient
    .from('resource_leads')
    .select('id')

  if (anonSelectErr) {
    if (anonSelectErr.message.includes('does not exist')) {
      fail('resource_leads table not found — apply resource_leads migration first', anonSelectErr.message)
      return
    }
    ok(`Anonymous SELECT rejected (${anonSelectErr.code ?? 'error'})`)
  } else if ((anonLeads ?? []).length > 0) {
    fail('Anonymous SELECT returned resource_leads rows')
  } else {
    ok('Anonymous SELECT returned 0 rows')
  }

  console.log('\n2. Anonymous direct INSERT blocked')
  const { error: anonInsertErr } = await anonClient.from('resource_leads').insert({
    resource_type: 'visa_checklist',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    token_expires_at: new Date().toISOString(),
  })

  if (anonInsertErr) {
    ok(`Anonymous INSERT rejected (${anonInsertErr.code ?? 'error'})`)
  } else {
    fail('Anonymous INSERT should have been rejected by RLS')
  }

  console.log('\n3. submit_visa_checklist_lead RPC')
  const testEmail = `rls-verify-${Date.now()}@example.com`
  const { data: accessToken, error: submitErr } = await anonClient.rpc(
    'submit_visa_checklist_lead',
    {
      p_first_name: 'RLS',
      p_last_name: 'Verify',
      p_email: testEmail,
      p_linkedin_url: null,
    },
  )

  if (submitErr || !accessToken) {
    if (submitErr?.message.includes('does not exist')) {
      fail('submit_visa_checklist_lead RPC not found — apply resource_leads migration first', submitErr.message)
    } else {
      fail('submit_visa_checklist_lead failed', submitErr?.message)
    }
    return
  }

  ok(`submit_visa_checklist_lead returned token ${String(accessToken).slice(0, 8)}…`)

  console.log('\n4. validate_visa_checklist_access with valid token')
  const { data: validResult, error: validErr } = await anonClient.rpc(
    'validate_visa_checklist_access',
    { p_token: accessToken },
  )

  if (validErr) {
    fail('validate_visa_checklist_access failed for valid token', validErr.message)
  } else if (validResult !== true) {
    fail('validate_visa_checklist_access should return true for valid token')
  } else {
    ok('validate_visa_checklist_access returned true')
  }

  console.log('\n5. validate_visa_checklist_access with random token')
  const { data: invalidResult, error: invalidErr } = await anonClient.rpc(
    'validate_visa_checklist_access',
    { p_token: '00000000-0000-4000-8000-000000000000' },
  )

  if (invalidErr) {
    fail('validate_visa_checklist_access failed for random token', invalidErr.message)
  } else if (invalidResult !== false) {
    fail('validate_visa_checklist_access should return false for unknown token')
  } else {
    ok('validate_visa_checklist_access returned false for unknown token')
  }

  console.log('\n6. Anonymous cannot SELECT lead by access token')
  const { data: leakedRows, error: leakErr } = await anonClient
    .from('resource_leads')
    .select('email')
    .eq('access_token', accessToken)

  if (leakErr) {
    ok(`Anonymous SELECT by token rejected (${leakErr.code ?? 'error'})`)
  } else if ((leakedRows ?? []).length > 0) {
    fail('Anonymous client could read lead email by access token')
  } else {
    ok('Anonymous SELECT by token returned 0 rows')
  }

  console.log('\n7. submit_cost_planner_lead RPC')
  const costEmail = `rls-cost-${Date.now()}@example.com`
  const { data: costToken, error: costSubmitErr } = await anonClient.rpc(
    'submit_cost_planner_lead',
    {
      p_first_name: 'RLS',
      p_last_name: 'Cost',
      p_email: costEmail,
      p_linkedin_url: null,
    },
  )

  if (costSubmitErr || !costToken) {
    if (costSubmitErr?.message.includes('does not exist')) {
      fail('submit_cost_planner_lead RPC not found — apply cost_planner migration first', costSubmitErr.message)
    } else {
      fail('submit_cost_planner_lead failed', costSubmitErr?.message)
    }
    return
  }

  ok(`submit_cost_planner_lead returned token ${String(costToken).slice(0, 8)}…`)

  console.log('\n8. validate_cost_planner_access with valid token')
  const { data: costValid, error: costValidErr } = await anonClient.rpc(
    'validate_cost_planner_access',
    { p_token: costToken },
  )

  if (costValidErr) {
    fail('validate_cost_planner_access failed for valid token', costValidErr.message)
  } else if (costValid !== true) {
    fail('validate_cost_planner_access should return true for valid token')
  } else {
    ok('validate_cost_planner_access returned true')
  }

  console.log('\n9. visa token does not validate cost planner access')
  const { data: crossValid, error: crossErr } = await anonClient.rpc(
    'validate_cost_planner_access',
    { p_token: accessToken },
  )

  if (crossErr) {
    fail('validate_cost_planner_access failed for visa token', crossErr.message)
  } else if (crossValid !== false) {
    fail('visa checklist token should not grant cost planner access')
  } else {
    ok('visa token rejected for cost planner validation')
  }

  console.log('\n10. Anonymous cannot SELECT cost planner lead by token')
  const { data: costLeaked, error: costLeakErr } = await anonClient
    .from('resource_leads')
    .select('email')
    .eq('access_token', costToken)

  if (costLeakErr) {
    ok(`Anonymous SELECT by cost token rejected (${costLeakErr.code ?? 'error'})`)
  } else if ((costLeaked ?? []).length > 0) {
    fail('Anonymous client could read cost planner lead email by access token')
  } else {
    ok('Anonymous SELECT by cost token returned 0 rows')
  }

  console.log('\n11. submit_accommodation_tips_lead RPC')
  const accommodationEmail = `rls-accommodation-${Date.now()}@example.com`
  const { data: accommodationToken, error: accommodationSubmitErr } = await anonClient.rpc(
    'submit_accommodation_tips_lead',
    {
      p_first_name: 'RLS',
      p_last_name: 'Stay',
      p_email: accommodationEmail,
      p_linkedin_url: null,
    },
  )

  if (accommodationSubmitErr || !accommodationToken) {
    if (accommodationSubmitErr?.message.includes('does not exist')) {
      fail(
        'submit_accommodation_tips_lead RPC not found — apply accommodation_tips migration first',
        accommodationSubmitErr.message,
      )
    } else {
      fail('submit_accommodation_tips_lead failed', accommodationSubmitErr?.message)
    }
    return
  }

  ok(`submit_accommodation_tips_lead returned token ${String(accommodationToken).slice(0, 8)}…`)

  console.log('\n12. validate_accommodation_tips_access with valid token')
  const { data: accommodationValid, error: accommodationValidErr } = await anonClient.rpc(
    'validate_accommodation_tips_access',
    { p_token: accommodationToken },
  )

  if (accommodationValidErr) {
    fail('validate_accommodation_tips_access failed for valid token', accommodationValidErr.message)
  } else if (accommodationValid !== true) {
    fail('validate_accommodation_tips_access should return true for valid token')
  } else {
    ok('validate_accommodation_tips_access returned true')
  }

  console.log('\n13. cost planner token does not validate accommodation access')
  const { data: crossAccommodation, error: crossAccommodationErr } = await anonClient.rpc(
    'validate_accommodation_tips_access',
    { p_token: costToken },
  )

  if (crossAccommodationErr) {
    fail('validate_accommodation_tips_access failed for cost token', crossAccommodationErr.message)
  } else if (crossAccommodation !== false) {
    fail('cost planner token should not grant accommodation tips access')
  } else {
    ok('cost planner token rejected for accommodation validation')
  }

  console.log('\n14. Anonymous cannot SELECT accommodation lead by token')
  const { data: accommodationLeaked, error: accommodationLeakErr } = await anonClient
    .from('resource_leads')
    .select('email')
    .eq('access_token', accommodationToken)

  if (accommodationLeakErr) {
    ok(`Anonymous SELECT by accommodation token rejected (${accommodationLeakErr.code ?? 'error'})`)
  } else if ((accommodationLeaked ?? []).length > 0) {
    fail('Anonymous client could read accommodation lead email by access token')
  } else {
    ok('Anonymous SELECT by accommodation token returned 0 rows')
  }
}

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
  const { data: publishedRows } = await anonClient
    .from('blog_posts')
    .select('id, title')
    .limit(1)

  if ((publishedRows ?? []).length === 0) {
    console.log(
      '  SKIP: No published posts to test UPDATE/DELETE — create one or run with admin credentials',
    )
  } else {
    const target = publishedRows![0]
    const originalTitle = target.title

    const { error: anonUpdateErr, count: anonUpdateCount } = await anonClient
      .from('blog_posts')
      .update({ title: 'Hacked' })
      .eq('id', target.id)
      .select('id', { count: 'exact', head: true })

    const { data: afterUpdate } = await anonClient
      .from('blog_posts')
      .select('title')
      .eq('id', target.id)
      .single()

    if (anonUpdateErr) {
      ok(`Anonymous UPDATE rejected (${anonUpdateErr.code ?? 'error'})`)
    } else if ((anonUpdateCount ?? 0) > 0 || afterUpdate?.title !== originalTitle) {
      fail('Anonymous UPDATE modified a published post')
    } else {
      ok('Anonymous UPDATE blocked (0 rows affected, title unchanged)')
    }

    const { error: anonDeleteErr, count: anonDeleteCount } = await anonClient
      .from('blog_posts')
      .delete({ count: 'exact' })
      .eq('id', target.id)

    const { data: afterDelete } = await anonClient
      .from('blog_posts')
      .select('id')
      .eq('id', target.id)
      .maybeSingle()

    if (anonDeleteErr) {
      ok(`Anonymous DELETE rejected (${anonDeleteErr.code ?? 'error'})`)
    } else if ((anonDeleteCount ?? 0) > 0 || !afterDelete) {
      fail('Anonymous DELETE removed a published post')
    } else {
      ok('Anonymous DELETE blocked (0 rows affected, post still visible)')
    }
  }

  await verifyResourceLeads(ok, fail)

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  process.exit(failed > 0 ? 1 : 0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
