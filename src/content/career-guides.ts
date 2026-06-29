import type { CareerGuideItem, CareerGuidesPageContent } from '@/types/content'

export const careerGuidesContent: CareerGuidesPageContent = {
  meta: {
    title: 'Career Guides — Study Pathways in New Zealand | Enrollify',
    description:
      'Explore Enrollify career guides for international students — connect courses, skills, industries and long-term career planning in New Zealand before you apply.',
  },
  hero: {
    title: 'Career Guides',
    subtitle: 'Find the right study pathway for your future in New Zealand',
    intro: [
      [
        'Choosing a course is not just about what you study. It is about where that study can take you.',
      ],
      [
        "Enrollify's Career Guides are designed to help international students understand the connection between courses, skills, industries, employment opportunities and long-term career planning in New Zealand.",
      ],
      [
        'Whether you are exploring undergraduate study, postgraduate options, pathway programmes or English language courses, these guides will help you make a more confident decision before you apply.',
      ],
    ],
    imageAlt: 'Career pathways and study options in New Zealand',
  },
  whyPlanning: {
    title: 'Why career planning matters before choosing a course',
    question: 'Which course matches my goals, background and future career direction?',
    intro: 'Many students start by searching for the best course in New Zealand, but the better question is:',
    considerations: [
      'Your current education level',
      'Your English level',
      'Your preferred career field',
      'Your budget and timeline',
      'The skills employers are looking for',
      'Whether the course supports practical learning, internships or industry exposure',
      'Your visa and post-study work options',
      'The city or region that best fits your goals',
    ],
    closing:
      'At Enrollify, we help students think beyond admission. We help you understand how your study choice can support your future.',
  },
  guidesSectionTitle: 'Explore Career Guides',
  guides: [
    {
      slug: 'choose-right-course',
      number: 1,
      title: 'How to Choose the Right Course in New Zealand',
      summary:
        'Choosing a course can feel overwhelming, especially when there are so many universities, institutes and private providers to compare. This guide helps you understand how to compare courses properly, including entry requirements, study level, course outcomes, tuition fees, location, work opportunities and future pathways.',
      bestFor: 'Students who are still deciding what to study.',
      youWillLearn: 'How to shortlist courses based on your goals, not just popularity.',
    },
    {
      slug: 'it-software-technology',
      number: 2,
      title: 'IT, Software and Technology Careers in New Zealand',
      summary:
        'Technology continues to be one of the most popular study areas for international students. New Zealand employers need people who can work across software development, cybersecurity, data, cloud, business systems and digital transformation. This guide explains common technology study pathways, including diplomas, bachelor\'s degrees, graduate diplomas and postgraduate programmes. It also covers the types of skills students should build while studying, such as coding, problem solving, project work, communication and practical portfolio development.',
      bestFor:
        'Students interested in software, data, cybersecurity, business analysis or IT support.',
      youWillLearn: 'What technology pathways can look like and how to prepare for employability.',
    },
    {
      slug: 'engineering-construction',
      number: 3,
      title: 'Engineering and Construction Career Pathways',
      summary:
        'Engineering and construction are important sectors in New Zealand, with opportunities across infrastructure, civil projects, construction management, quantity surveying, project coordination and related technical fields. This guide helps students understand the difference between engineering, construction management and trade-focused pathways. It also explains why practical experience, technical knowledge and communication skills are important in these industries.',
      bestFor:
        'Students interested in civil engineering, construction, infrastructure or project-based work.',
      youWillLearn: 'How engineering and construction courses can connect to real industry roles.',
    },
    {
      slug: 'healthcare-nursing',
      number: 4,
      title: 'Healthcare, Nursing and Community Support Careers',
      summary:
        'Healthcare is a meaningful career area for students who want to help people and build practical, people-focused skills. This guide covers study options connected to healthcare, nursing, aged care, community support, public health and health administration. It also explains the importance of registration, practical placements and understanding New Zealand workplace standards.',
      bestFor:
        'Students interested in nursing, healthcare support, aged care, public health or community services.',
      youWillLearn: 'What to consider before choosing a healthcare pathway in New Zealand.',
    },
    {
      slug: 'business-accounting-management',
      number: 5,
      title: 'Business, Accounting and Management Careers',
      summary:
        'Business remains one of the most flexible study choices because it can lead into many different industries. This guide explains common business pathways, including accounting, management, marketing, operations, human resources, finance and entrepreneurship. It also helps students understand how to choose a business course that builds practical, employable skills rather than just a broad qualification.',
      bestFor: 'Students interested in business, finance, accounting, marketing or management.',
      youWillLearn: 'How to choose a business pathway with stronger career direction.',
    },
    {
      slug: 'teaching-early-childhood',
      number: 6,
      title: 'Teaching and Early Childhood Education Careers',
      summary:
        'Teaching can be a strong pathway for students who enjoy working with people, supporting learning and contributing to communities. This guide explains the different education pathways available in New Zealand, including early childhood education, primary teaching, secondary teaching and education support roles. It also highlights the importance of registration requirements, placements and choosing an approved programme.',
      bestFor: 'Students interested in early childhood, teaching or education support.',
      youWillLearn: 'What to check before choosing an education or teaching programme.',
    },
    {
      slug: 'agriculture-horticulture',
      number: 7,
      title: 'Agriculture, Horticulture and Food Production Careers',
      summary:
        'New Zealand has a strong reputation in agriculture, horticulture, food production, dairy, wine, sustainability and agribusiness. This guide helps students understand how study in agriculture or related fields can lead to practical and regional career opportunities. It also explains why sustainability, technology and business skills are becoming more important across the primary industries.',
      bestFor:
        'Students interested in farming, horticulture, agribusiness, food production or sustainability.',
      youWillLearn:
        "How agriculture-related study can connect to New Zealand's primary industries.",
    },
    {
      slug: 'hospitality-tourism',
      number: 8,
      title: 'Hospitality, Tourism and Customer Experience Careers',
      summary:
        'Hospitality and tourism can suit students who enjoy people, service, travel, events and fast-paced work environments. This guide explains study options across hospitality management, tourism, hotel operations, culinary arts, events and customer experience. It also covers the importance of communication, reliability, presentation and real workplace experience.',
      bestFor:
        'Students interested in hotels, tourism, restaurants, events or customer-facing roles.',
      youWillLearn: 'How hospitality and tourism study can build transferable career skills.',
    },
    {
      slug: 'english-pathway',
      number: 9,
      title: 'English Language and Pathway Programmes',
      summary:
        "Not every student is ready to enter a diploma, bachelor's degree or postgraduate course straight away. This guide explains how English language courses, foundation programmes and pathway study can help students prepare for higher education in New Zealand. It also covers academic English, confidence, study skills and how pathways can support future admission.",
      bestFor: 'Students who need to improve English or prepare for higher-level study.',
      youWillLearn: 'How pathway study works and when it may be the right option.',
    },
    {
      slug: 'postgraduate-study',
      number: 10,
      title: 'Postgraduate Study and Career Development',
      summary:
        'Postgraduate study can help students specialise, change career direction or build stronger professional knowledge. This guide explains the difference between graduate diplomas, postgraduate diplomas, master\'s degrees and research programmes. It also helps students think about whether postgraduate study is the right step based on their background, work experience and future goals.',
      bestFor: 'Students who already have a degree or professional experience.',
      youWillLearn: 'How to choose postgraduate study with a clear career purpose.',
    },
  ],
  advisoryCta: {
    title: 'Not sure which pathway is right for you?',
    body: [
      'That is exactly where Enrollify can help.',
      'We work with students to understand their goals, background and preferred study direction before recommending suitable options. Our role is to make the process clearer, more honest and easier to follow.',
    ],
    helpItems: [
      'Course and pathway guidance',
      'Study level recommendations',
      'Provider comparisons',
      'Entry requirement checks',
      'Application support',
      'Student visa guidance',
      'Career-focused planning',
      'Understanding work rights and post-study options',
      'Preparing questions before choosing a provider',
    ],
    closing:
      'We do not believe in pushing students into random courses. We help you make a decision that fits your future.',
    buttonLabel: 'Speak with Enrollify',
  },
  howToUse: {
    title: 'How to use these guides',
    steps: [
      {
        title: 'Choose your career area',
        body: 'Start with the area that interests you most. This could be technology, business, healthcare, engineering, teaching, agriculture or another field.',
      },
      {
        title: 'Check the study level',
        body: 'Make sure the course level matches your current education, English ability and future goal.',
      },
      {
        title: 'Think about employability',
        body: 'Look for courses that help you build practical skills, projects, placements, industry knowledge or workplace confidence.',
      },
      {
        title: 'Understand visa conditions',
        body: 'Student work rights and post-study options depend on your visa conditions, course type and qualification level. Always check the latest rules before applying.',
      },
      {
        title: 'Get advice before you commit',
        body: 'A course is a big investment. Getting guidance early can help you avoid the wrong pathway and choose a better-fit option.',
      },
    ],
  },
  faq: {
    title: 'Popular questions',
    items: [
      {
        question: 'What are the best courses to study in New Zealand?',
        answer:
          'The best course depends on your goals, background and career interests. Popular areas for international students include information technology, engineering, healthcare, business, construction, teaching, agriculture and hospitality. Rather than choosing only what is popular, you should choose a course that matches your strengths, entry requirements and future plans.',
      },
      {
        question: 'Can international students work while studying in New Zealand?',
        answer:
          'Many international students can work part-time while studying, but this depends on the conditions of their student visa. You should always check your visa conditions before starting any paid work.',
      },
      {
        question: 'Can studying in New Zealand lead to work opportunities?',
        answer:
          'Studying in New Zealand can help you build qualifications, local experience and career-ready skills. Some students may also be eligible for post-study work options depending on what they study and whether they meet immigration requirements.',
      },
      {
        question: 'Does Enrollify choose the course for me?',
        answer:
          'No. We guide you through your options and help you understand what may suit your goals. The final decision is always yours.',
      },
      {
        question: 'Do I need to know my exact career before applying?',
        answer:
          'No, but it helps to have a general direction. If you are unsure, we can help you compare pathways and narrow down your options.',
      },
      {
        question: 'Why should I speak with Enrollify before applying?',
        answer:
          'Because choosing the wrong course can cost time, money and future opportunity. We help you understand your options before you commit, so your study decision is more informed.',
      },
    ],
  },
  closingCta: {
    title: 'Start planning your future in New Zealand',
    body: 'Your course should do more than get you accepted. It should help you move toward the future you want. Explore our career guides, compare your options and speak with Enrollify when you are ready to take the next step.',
    primaryLabel: 'Book a free study consultation',
    secondaryLabel: 'Explore courses',
    tertiaryLabel: 'Ask a question',
  },
}

export const CAREER_GUIDE_SLUGS = careerGuidesContent.guides.map((guide) => guide.slug)

export function getCareerGuideBySlug(slug: string): CareerGuideItem | undefined {
  return careerGuidesContent.guides.find((guide) => guide.slug === slug)
}
