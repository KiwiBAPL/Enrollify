import { describe, expect, it } from 'vitest'
import {
  buildConsultationInviteFallback,
  resolveConsultationInvite,
} from '../../../apps/backend/src/services/ai/consultationInvite'

describe('consultationInvite', () => {
  it('returns visa-specific invite for visa questions', () => {
    const invite = buildConsultationInviteFallback('How do I apply for a student visa?')
    expect(invite).toMatch(/visa/i)
  })

  it('returns generic invite when topic is unknown', () => {
    const invite = buildConsultationInviteFallback('Hello there')
    expect(invite).toMatch(/book a free consultation/i)
  })

  it('suppresses invite when lead bot is completed', () => {
    expect(resolveConsultationInvite('Some invite', 'visa question', true)).toBeNull()
  })

  it('falls back when AI invite is empty', () => {
    const invite = resolveConsultationInvite('', 'What are tuition costs?', false)
    expect(invite).toMatch(/cost/i)
  })
})
