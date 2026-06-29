export const routes = {
  home: '/',
  studyInNz: '/study-in-new-zealand',
  findCourse: '/find-a-course',
  findCourseCategory: (slug: string) => `/find-a-course/${slug}`,
  careerGuides: '/career-guides',
  careerGuide: (slug: string) => `/career-guides/${slug}`,
  studentResources: '/student-resources',
  studentResourceTopic: (topic: string) => `/student-resources/${topic}`,
  visaChecklist: '/student-resources/visas/checklist',
  visaChecklistView: '/student-resources/visas/checklist/view',
  costPlanner: '/student-resources/costs/planner',
  costPlannerView: '/student-resources/costs/planner/view',
  accommodationTips: '/student-resources/accommodation/tips',
  accommodationTipsView: '/student-resources/accommodation/tips/view',
  cityGuides: '/city-guides',
  blog: '/blog',
  bookConsultation: '/book-consultation',
  contact: '/contact',
  aboutEnrollify: '/#about-enrollify-nz',
} as const

export const studentResourceTopics = {
  visas: 'visas',
  costs: 'costs',
  accommodation: 'accommodation',
  working: 'working',
  scholarships: 'scholarships',
} as const
