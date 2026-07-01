import { trackChatConsultationCtaClick } from '@/lib/analytics'

const CTA_BUTTON_LABEL = 'Book a free consultation'

type ChatConsultationCtaProps = {
  invite: string
  onBookConsultation: () => void
}

export function ChatConsultationCta({ invite, onBookConsultation }: ChatConsultationCtaProps) {
  function handleClick() {
    trackChatConsultationCtaClick()
    onBookConsultation()
  }

  return (
    <div className="mt-2 max-w-[85%] space-y-2">
      <p className="text-sm text-gray-700">{invite}</p>
      <button
        type="button"
        onClick={handleClick}
        className="text-left text-sm font-semibold text-[var(--accent-primary,#43329D)] underline decoration-[var(--accent-primary,#43329D)] underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-1"
      >
        {CTA_BUTTON_LABEL}
      </button>
    </div>
  )
}
