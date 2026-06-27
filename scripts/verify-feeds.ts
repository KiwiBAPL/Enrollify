/**
 * RSS and sitemap security verification for blog_posts.
 *
 * Usage:
 *   npm run verify:feeds
 *
 * Requires in .env.local (or env):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY
 *
 * Optional (draft leak test via live query):
 *   SUPABASE_TEST_ADMIN_EMAIL
 *   SUPABASE_TEST_ADMIN_PASSWORD
 *
 * Optionally checks dist/blog/rss.xml and dist/sitemap.xml if present (post-build).
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { buildRssFeed, buildSitemap } from '../src/lib/feeds.ts'
import { DEFAULT_AUTHOR_NAME } from '../src/lib/site.ts'

const ADMIN_BASE = '/enrollify-manage'

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

const anonClient = createClient(url, publishableKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

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

  console.log('\n=== Feed security verification ===\n')

  console.log('1. RSS query returns published posts only')
  const { data: rssPosts, error: rssErr } = await anonClient
    .from('blog_posts')
    .select(
      'title, slug, summary, meta_title, meta_description, featured_image_url, author_name, published_at, updated_at, status',
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })

  const publishedForFeeds = (rssPosts ?? []).map(({ status: _s, ...rest }) => rest)

  if (rssErr) {
    fail('Published posts query failed', rssErr.message)
  } else {
    const hasDraft = (rssPosts ?? []).some((p) => p.status === 'draft')
    if (hasDraft) {
      fail('RSS query result contains draft status rows')
    } else {
      ok(`RSS query returned ${rssPosts?.length ?? 0} published row(s)`)
    }

    const rssXml = buildRssFeed(publishedForFeeds)
    if (rssXml.includes(ADMIN_BASE)) {
      fail('Generated RSS contains admin URLs')
    } else {
      ok('Generated RSS XML has no admin URLs')
    }
  }

  console.log('\n2. Sitemap excludes admin routes')
  const sitemapXml = buildSitemap(publishedForFeeds)
  if (sitemapXml.includes(ADMIN_BASE)) {
    fail('Generated sitemap contains admin URLs')
  } else {
    ok('Generated sitemap has no admin URLs')
  }

  if (adminEmail && adminPassword) {
    console.log('\n3. Draft post excluded from RSS query')
    const adminClient = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const draftSlug = `feed-verify-draft-${Date.now()}`
    const { error: signInErr } = await adminClient.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    })

    if (signInErr) {
      fail('Admin sign-in failed for draft RSS test', signInErr.message)
    } else {
      const { data: created, error: createErr } = await adminClient
        .from('blog_posts')
        .insert({
          title: 'Feed Verify Draft',
          slug: draftSlug,
          status: 'draft',
        })
        .select('slug')
        .single()

      if (createErr || !created) {
        fail('Admin INSERT draft for feed test failed', createErr?.message)
      } else {
        const { data: afterDraft } = await anonClient
          .from('blog_posts')
          .select('slug')
          .eq('status', 'published')

        const slugs = (afterDraft ?? []).map((p) => p.slug)
        if (slugs.includes(draftSlug)) {
          fail('Draft slug appeared in published RSS query')
        } else {
          ok('Draft slug not in published RSS query results')
        }

        const draftRss = buildRssFeed(
          (afterDraft ?? []).map((p) => ({
            title: p.slug,
            slug: p.slug,
            summary: null,
            meta_title: '',
            meta_description: '',
            featured_image_url: null,
            author_name: DEFAULT_AUTHOR_NAME,
            published_at: null,
            updated_at: new Date().toISOString(),
          })),
        )
        if (draftRss.includes(draftSlug)) {
          fail('Draft slug found in built RSS XML')
        } else {
          ok('Draft slug not in built RSS XML')
        }

        await adminClient.from('blog_posts').delete().eq('slug', draftSlug)
      }
    }
  } else {
    console.log(
      '\n3. Draft RSS exclusion skipped — set SUPABASE_TEST_ADMIN_EMAIL and SUPABASE_TEST_ADMIN_PASSWORD',
    )
  }

  console.log('\n4. Built dist/ feed files (if present)')
  const rssPath = resolve(process.cwd(), 'dist/blog/rss.xml')
  const sitemapPath = resolve(process.cwd(), 'dist/sitemap.xml')

  if (existsSync(rssPath)) {
    const rssContent = readFileSync(rssPath, 'utf8')
    if (rssContent.includes(ADMIN_BASE)) {
      fail('dist/blog/rss.xml contains admin URLs')
    } else if (!rssContent.includes('<rss')) {
      fail('dist/blog/rss.xml is not valid RSS')
    } else {
      ok('dist/blog/rss.xml looks valid and has no admin URLs')
    }
  } else {
    console.log('  SKIP: dist/blog/rss.xml not found — run npm run build first')
  }

  if (existsSync(sitemapPath)) {
    const sitemapContent = readFileSync(sitemapPath, 'utf8')
    if (sitemapContent.includes(ADMIN_BASE)) {
      fail('dist/sitemap.xml contains admin URLs')
    } else {
      ok('dist/sitemap.xml has no admin URLs')
    }
  } else {
    console.log('  SKIP: dist/sitemap.xml not found — run npm run build first')
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  process.exit(failed > 0 ? 1 : 0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
