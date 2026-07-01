export const LEAD_BOT_STEP_IDS = [
  'name',
  'country',
  'field_of_study',
  'preferred_intake',
  'funding_source',
  'funds_available',
  'english_test_completed',
  'visa_refusal_history',
  'email',
  'phone',
] as const

export type LeadBotStepId = (typeof LEAD_BOT_STEP_IDS)[number]

export type LeadBotInputType = 'text' | 'mcq'

export interface LeadBotStepDefinition {
  id: LeadBotStepId
  inputType: LeadBotInputType
  question: string
  options?: readonly string[]
}

export const LEAD_BOT_STEPS: readonly LeadBotStepDefinition[] = [
  { id: 'name', inputType: 'text', question: "Hi! 👋 What's your name?" },
  {
    id: 'country',
    inputType: 'text',
    question: 'Which country are you currently living in?',
  },
  {
    id: 'field_of_study',
    inputType: 'mcq',
    question: 'What would you like to study in New Zealand?',
    options: [
      'English',
      'Business',
      'Construction',
      'Healthcare',
      'IT',
      'Hospitality',
      'Not sure yet',
    ],
  },
  {
    id: 'preferred_intake',
    inputType: 'mcq',
    question: 'When are you hoping to start studying?',
    options: ['ASAP', 'Within 3 months', '3–6 months', '6–12 months', 'Just researching'],
  },
  {
    id: 'funding_source',
    inputType: 'mcq',
    question: 'How do you plan to fund your studies?',
    options: ['Self-funded', 'Parents/Family', 'Education loan'],
  },
  {
    id: 'funds_available',
    inputType: 'mcq',
    question:
      'Do you currently have, or expect to have, enough funds to cover tuition fees and living costs required for a New Zealand student visa?',
    options: ['Yes', 'Partially', 'Not yet'],
  },
  {
    id: 'english_test_completed',
    inputType: 'mcq',
    question: 'Have you completed an English language test (IELTS, PTE, TOEFL, etc.)?',
    options: ['Yes', 'No'],
  },
  {
    id: 'visa_refusal_history',
    inputType: 'mcq',
    question: 'Have you ever been refused a visa by New Zealand or another country?',
    options: ['Yes', 'No'],
  },
  {
    id: 'email',
    inputType: 'text',
    question: "What's the best email address to contact you?",
  },
  {
    id: 'phone',
    inputType: 'text',
    question: 'What is the best phone number to reach you on?',
  },
]

export const LEAD_BOT_TRANSITIONS: Record<LeadBotStepId, readonly string[]> = {
  name: [],
  country: [
    'Thanks, {firstName}!',
    'Lovely to meet you, {firstName}.',
    'Great to meet you, {firstName}!',
  ],
  field_of_study: ['Thanks, {firstName}.', 'Appreciate that, {firstName}.'],
  preferred_intake: ['Thanks, {firstName}.', 'Good to know, {firstName}.', 'Thanks for sharing, {firstName}.'],
  funding_source: ['Understood, {firstName}.', 'That helps, {firstName}.'],
  funds_available: ['Thanks, {firstName}.', 'Good to know, {firstName}.'],
  english_test_completed: ['Thanks, {firstName}.', 'Noted, {firstName}.'],
  visa_refusal_history: ['Thanks, {firstName}.', 'Appreciate the honesty, {firstName}.'],
  email: ['Almost done, {firstName}.', 'Nearly there, {firstName}.'],
  phone: ['Last one, {firstName}.', 'Just one more, {firstName}.'],
}

export interface LeadBotAnswers {
  name?: string
  country?: string
  field_of_study?: string
  preferred_intake?: string
  funding_source?: string
  funds_available?: string
  english_test_completed?: string
  visa_refusal_history?: string
  email?: string
  phone?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+\d{1,4}\s?\d{6,15}$/

export function firstNameFromName(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return 'there'
  return trimmed.split(/\s+/)[0] ?? 'there'
}

export function pickTransition(stepId: LeadBotStepId, firstName: string): string {
  const templates = LEAD_BOT_TRANSITIONS[stepId]
  if (templates.length === 0) return ''
  const template = templates[Math.floor(Math.random() * templates.length)] ?? templates[0] ?? ''
  return template.replace(/\{firstName\}/g, firstName)
}

export function buildStepPrompt(stepId: LeadBotStepId, firstName?: string): string {
  const step = LEAD_BOT_STEPS.find((s) => s.id === stepId)
  if (!step) return ''

  const transition =
    firstName && stepId !== 'name' ? pickTransition(stepId, firstName) : ''
  if (transition) {
    return `${transition}\n\n${step.question}`
  }
  return step.question
}

export function getStepDefinition(stepId: LeadBotStepId): LeadBotStepDefinition {
  const step = LEAD_BOT_STEPS.find((s) => s.id === stepId)
  if (!step) throw new Error(`Unknown step: ${stepId}`)
  return step
}

export function validateStepValue(stepId: LeadBotStepId, value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Please provide an answer.'

  const step = getStepDefinition(stepId)

  if (step.inputType === 'mcq') {
    if (!step.options?.includes(trimmed)) {
      return 'Please choose one of the options.'
    }
    return null
  }

  switch (stepId) {
    case 'name':
      if (trimmed.length < 2) return 'Please enter your full name.'
      return null
    case 'country':
      if (trimmed.length < 2) return 'Please enter your country.'
      return null
    case 'email':
      if (!EMAIL_RE.test(trimmed)) return 'Please enter a valid email address.'
      return null
    case 'phone':
      if (!PHONE_RE.test(trimmed)) return 'Please enter a valid phone number.'
      return null
    default:
      return null
  }
}

export function answersFromStudent(
  student: Partial<Record<LeadBotStepId, string | null | undefined>>,
): LeadBotAnswers {
  return {
    name: student.name ?? undefined,
    country: student.country ?? undefined,
    field_of_study: student.field_of_study ?? undefined,
    preferred_intake: student.preferred_intake ?? undefined,
    funding_source: student.funding_source ?? undefined,
    funds_available: student.funds_available ?? undefined,
    english_test_completed: student.english_test_completed ?? undefined,
    visa_refusal_history: student.visa_refusal_history ?? undefined,
    email: student.email ?? undefined,
    phone: student.phone ?? undefined,
  }
}

export function getCurrentStepId(answers: LeadBotAnswers): LeadBotStepId | null {
  for (const stepId of LEAD_BOT_STEP_IDS) {
    const value = answers[stepId]
    if (!value?.trim()) return stepId
  }
  return null
}

export function isFlowComplete(answers: LeadBotAnswers): boolean {
  return getCurrentStepId(answers) === null
}

export function stepIndex(stepId: LeadBotStepId): number {
  return LEAD_BOT_STEP_IDS.indexOf(stepId)
}

export function nextStepId(stepId: LeadBotStepId): LeadBotStepId | null {
  const index = stepIndex(stepId)
  if (index < 0 || index >= LEAD_BOT_STEP_IDS.length - 1) return null
  return LEAD_BOT_STEP_IDS[index + 1] ?? null
}

export function formatPhoneSubmission(dialCode: string, localNumber: string): string {
  const code = dialCode.startsWith('+') ? dialCode : `+${dialCode}`
  const digits = localNumber.replace(/\D/g, '')
  return `${code} ${digits}`
}

export const MCQ_ACKNOWLEDGEMENT_TEMPLATES = [
  'Thanks — {value}.',
  'Noted — {value}.',
  '{value} — appreciate that.',
  'Perfect, {value}.',
  'Understood — {value}.',
  'Got it — {value}.',
] as const

export function pickMcqAcknowledgement(value: string): string {
  const template =
    MCQ_ACKNOWLEDGEMENT_TEMPLATES[
      Math.floor(Math.random() * MCQ_ACKNOWLEDGEMENT_TEMPLATES.length)
    ] ?? MCQ_ACKNOWLEDGEMENT_TEMPLATES[0]
  return template.replace(/\{value\}/g, value)
}

/** @deprecated Use pickMcqAcknowledgement */
export function mcqAcknowledgement(value: string): string {
  return pickMcqAcknowledgement(value)
}

export const LEAD_BOT_THANK_YOU =
  "Thank you! We'll get back to you with course information. One of our team will be in touch in the next few days to talk further."
