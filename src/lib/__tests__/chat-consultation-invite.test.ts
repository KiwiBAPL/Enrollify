import { describe, expect, it } from 'vitest'
import { resolveChatConsultationInvite } from '@/lib/chat/consultationInvite'

describe('resolveChatConsultationInvite', () => {
  it('returns null when lead bot is completed', () => {
    expect(resolveChatConsultationInvite('Some invite', 'visa question', true)).toBeNull()
  })

  it('uses API invite when present', () => {
    expect(resolveChatConsultationInvite('Custom invite', 'hello', false)).toBe('Custom invite')
  })

  it('falls back when API omits invite (e.g. older backend)', () => {
    const invite = resolveChatConsultationInvite(null, 'How do visas work?', false)
    expect(invite).toMatch(/visa/i)
  })
})
