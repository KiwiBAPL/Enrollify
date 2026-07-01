import { LeadBotProvider } from '@/components/lead-bot/LeadBotProvider'
import { LeadBotModal } from '@/components/lead-bot/LeadBotModal'

export function LeadBotShell() {
  return (
    <LeadBotProvider>
      <LeadBotModal />
    </LeadBotProvider>
  )
}

export { useLeadBot } from '@/components/lead-bot/LeadBotProvider'
export { ConsultationCta } from '@/components/lead-bot/ConsultationCta'
