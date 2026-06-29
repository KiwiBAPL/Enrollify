import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { getCareerGuideBySlug } from '@/content/career-guides'
import { careerGuideDetailCanonicalUrl } from '@/lib/career-guides-seo'
import { routes } from '@/lib/routes'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/site'

export function CareerGuideDetailPage() {
  const { slug = '' } = useParams()
  const guide = getCareerGuideBySlug(slug)

  if (!guide) {
    return (
      <>
        <Helmet>
          <title>{`Guide not found | Career Guides | ${SITE_NAME}`}</title>
        </Helmet>
        <Section id="career-guide-not-found" variant="primary" className="py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 font-display text-2xl font-bold text-text-secondary">
              Career guide not found
            </h1>
            <p className="mb-8 text-text-primary">
              We could not find that career guide. Browse all guides on the hub page.
            </p>
            <Link to={routes.careerGuides}>
              <Button>Back to Career Guides</Button>
            </Link>
          </div>
        </Section>
      </>
    )
  }

  const pageTitle = `${guide.title} | Career Guides | ${SITE_NAME}`
  const canonicalUrl = careerGuideDetailCanonicalUrl(guide.slug)

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={guide.summary} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.summary} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={guide.title} />
        <meta name="twitter:description" content={guide.summary} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      </Helmet>

      <Section id="career-guide-detail" variant="secondary" className="py-12">
        <div className="mx-auto max-w-3xl blog-body space-y-6">
          <p className="m-0">
            <Link
              to={routes.careerGuides}
              className="text-accent-primary underline underline-offset-2 hover:text-text-secondary"
            >
              ← Career Guides
            </Link>
          </p>
          <header className="space-y-4">
            <p className="m-0 font-body text-sm font-semibold uppercase tracking-wide text-text-muted">
              Guide {guide.number}
            </p>
            <h1 className="m-0 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight text-text-secondary">
              {guide.title}
            </h1>
          </header>
          <p>{guide.summary}</p>
          <p>
            <strong>Best for:</strong> {guide.bestFor}
          </p>
          <p>
            <strong>You will learn:</strong> {guide.youWillLearn}
          </p>

          <div className="rounded-card border-2 border-accent-primary bg-accent-mint/20 p-6">
            <p className="m-0 font-semibold text-text-secondary">Full guide coming soon</p>
            <p className="mt-2 text-sm text-text-primary">
              We are preparing a detailed version of this career guide. In the meantime, speak with
              Enrollify for personalised pathway advice.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to={routes.bookConsultation} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Book a Free Consultation</Button>
            </Link>
            <Link to={routes.careerGuides} className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
                Back to Career Guides
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
