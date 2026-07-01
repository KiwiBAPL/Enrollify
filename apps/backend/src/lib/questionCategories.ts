export const CHAT_QUESTION_CATEGORIES = [
  { slug: 'visas_immigration', label: 'Visas & immigration' },
  { slug: 'courses_study', label: 'Courses & study options' },
  { slug: 'costs_funding', label: 'Costs & funding' },
  { slug: 'english_requirements', label: 'English requirements' },
  { slug: 'work_rights', label: 'Working while studying' },
  { slug: 'accommodation', label: 'Accommodation' },
  { slug: 'general', label: 'General / other' },
] as const

export type ChatQuestionCategory = (typeof CHAT_QUESTION_CATEGORIES)[number]['slug']

const CATEGORY_SLUGS = new Set<string>(CHAT_QUESTION_CATEGORIES.map((c) => c.slug))

export function isChatQuestionCategory(value: string): value is ChatQuestionCategory {
  return CATEGORY_SLUGS.has(value)
}

export function categoryLabel(slug: ChatQuestionCategory): string {
  return CHAT_QUESTION_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}

const KEYWORD_RULES: Array<{ pattern: RegExp; category: ChatQuestionCategory }> = [
  { pattern: /\bvisa\b/i, category: 'visas_immigration' },
  { pattern: /\b(cost|fee|tuition|budget|afford|living cost|expense|scholarship)/i, category: 'costs_funding' },
  { pattern: /\b(english|ielts|pte|toefl|language test)/i, category: 'english_requirements' },
  {
    pattern: /\b(course|programme|program|degree|diploma|university|college|nzqa|study option)/i,
    category: 'courses_study',
  },
  { pattern: /\b(work|job|part.?time|employment|work rights)/i, category: 'work_rights' },
  { pattern: /\b(accommodation|housing|rent|flat|homestay)/i, category: 'accommodation' },
]

export function categorizeQuestionByKeywords(text: string): ChatQuestionCategory {
  for (const { pattern, category } of KEYWORD_RULES) {
    if (pattern.test(text)) return category
  }
  return 'general'
}
