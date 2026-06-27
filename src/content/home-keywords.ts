/** Required SEO terms — visible homepage copy must include each phrase at least once. */
export const HOME_VISIBLE_KEYWORDS = [
  // Primary (H1 or H2)
  'study in New Zealand',
  'study pathway',
  'international students New Zealand',
  'free consultation',
  // Secondary
  'courses in New Zealand',
  'student visa New Zealand',
  'career pathways New Zealand',
  'cost of studying in New Zealand',
  'student life New Zealand',
  'qualifications New Zealand',
  'New Zealand education system',
  // Long-tail
  'best courses in New Zealand for international students',
  'nursing courses New Zealand',
  'IT diploma New Zealand',
  'business courses New Zealand',
  'construction courses New Zealand',
  'working while studying New Zealand',
  'post study work visa New Zealand',
  'student accommodation New Zealand',
] as const

export type HomeVisibleKeyword = (typeof HOME_VISIBLE_KEYWORDS)[number]

/** Keywords that must appear in an H1 or H2 heading. */
export const HOME_HEADING_KEYWORDS = [
  'study in New Zealand',
  'study pathway',
  'international students New Zealand',
  'free consultation',
] as const
