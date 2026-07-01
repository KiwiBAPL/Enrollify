import { useEffect } from 'react'
import { PlaceholderPage } from '@/components/pages/PlaceholderPage'
import { useLeadBot } from '@/components/lead-bot/LeadBotProvider'

export function BookConsultationPage() {
  const { openLeadBot } = useLeadBot()

  useEffect(() => {
    openLeadBot()
  }, [openLeadBot])

  return (
    <PlaceholderPage
      title="Book a Free Consultation"
      description="Planning to study in New Zealand? Our consultation chat should open automatically. If it didn't, use the Book a Free Consultation button in the menu to start."
      showConsultationLink={false}
    />
  )
}
