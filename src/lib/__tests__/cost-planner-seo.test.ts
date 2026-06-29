import { describe, expect, it } from 'vitest'
import {
  COST_PLANNER_CANONICAL_URL,
  COST_PLANNER_META_DESCRIPTION,
  COST_PLANNER_PAGE_TITLE,
} from '@/lib/cost-planner-seo'
import { FEED_SITE_URL, SITEMAP_STATIC_ROUTES } from '@/lib/feeds'
import { routes } from '@/lib/routes'

describe('cost-planner-seo', () => {
  it('exports expected page title and description', () => {
    expect(COST_PLANNER_PAGE_TITLE).toContain('Student Cost Planner')
    expect(COST_PLANNER_META_DESCRIPTION).toContain('cost planner')
    expect(COST_PLANNER_META_DESCRIPTION).toContain('New Zealand')
  })

  it('uses production feed URL and canonical for cost planner page', () => {
    expect(FEED_SITE_URL).toBe('https://www.enrollifyedu.com')
    expect(COST_PLANNER_CANONICAL_URL).toBe(`${FEED_SITE_URL}${routes.costPlanner}`)
  })

  it('includes cost planner route in sitemap but not the token view route', () => {
    expect(SITEMAP_STATIC_ROUTES).toContain(routes.costPlanner)
    expect(SITEMAP_STATIC_ROUTES).not.toContain(routes.costPlannerView)
  })
})
