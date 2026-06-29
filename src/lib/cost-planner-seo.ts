import { FEED_SITE_URL } from '@/lib/feeds'
import { SITE_NAME } from '@/lib/site'
import { routes } from '@/lib/routes'

export const COST_PLANNER_CANONICAL_URL = `${FEED_SITE_URL}${routes.costPlanner}`

export const COST_PLANNER_PAGE_TITLE = `New Zealand Student Cost Planner | ${SITE_NAME}`

export const COST_PLANNER_META_DESCRIPTION =
  'Download the free Enrollify New Zealand student cost planner — estimate course fees, visa and travel costs, arrival setup, monthly living expenses, and common budget risks to avoid.'

export const COST_PLANNER_OG_TITLE = 'New Zealand Student Cost Planner'

export const COST_PLANNER_OG_DESCRIPTION = COST_PLANNER_META_DESCRIPTION
