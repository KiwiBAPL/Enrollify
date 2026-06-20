import type { ReactNode } from 'react'

type SectionProps = {
  id: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}

const variantClasses = {
  primary: 'bg-background-primary',
  secondary: 'bg-background-secondary',
}

export function Section({ id, children, variant = 'primary', className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-16 ${variantClasses[variant]} ${className}`}
    >
      <div className="container mx-auto">{children}</div>
    </section>
  )
}
