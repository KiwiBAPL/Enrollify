import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { useLeadBot } from '@/components/lead-bot/LeadBotProvider'

interface ConsultationCtaProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  onOpen?: () => void
}

export function ConsultationCta({
  children,
  className,
  variant = 'primary',
  size = 'md',
  onOpen,
}: ConsultationCtaProps) {
  const { openLeadBot } = useLeadBot()

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        onOpen?.()
        openLeadBot()
      }}
    >
      {children}
    </Button>
  )
}
