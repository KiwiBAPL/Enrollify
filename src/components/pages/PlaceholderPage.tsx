import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { ConsultationCta } from '@/components/lead-bot/ConsultationCta'
import { SITE_NAME } from '@/lib/site'

interface PlaceholderPageProps {
  title: string
  description: string
  showConsultationLink?: boolean
  children?: ReactNode
}

export function PlaceholderPage({
  title,
  description,
  showConsultationLink = true,
  children,
}: PlaceholderPageProps) {
  return (
    <>
      <Helmet>
        <title>{`${title} | ${SITE_NAME}`}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="container py-16">
        <h1 className="mb-4 font-display text-[clamp(2rem,4vw,3rem)] font-bold text-text-secondary">
          {title}
        </h1>
        <p className="mb-8 max-w-2xl font-body text-lg text-text-primary">{description}</p>
        {children}
        {showConsultationLink && !children ? (
          <ConsultationCta>Book a Free Consultation</ConsultationCta>
        ) : null}
      </div>
    </>
  )
}
