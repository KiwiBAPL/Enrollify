export const routes = {
  home: '/',
  studyInNz: '/study-in-new-zealand',
  findCourse: '/find-a-course',
  findCourseCategory: (slug: string) => `/find-a-course/${slug}`,
  careerGuides: '/career-guides',
  studentResources: '/student-resources',
  studentResourceTopic: (topic: string) => `/student-resources/${topic}`,
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
