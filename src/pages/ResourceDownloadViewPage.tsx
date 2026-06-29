import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { isValidAccessToken } from '@/lib/validation/resourceLead'
import type { ResourceDownloadViewContent } from '@/types/resource-download'

type ViewState = 'loading' | 'valid' | 'invalid'

type ResourceDownloadViewPageProps = {
  sectionId: string
  content: ResourceDownloadViewContent
  pdfPath: string
  formRoute: string
  validateAccess: (token: string) => Promise<boolean>
}

export function ResourceDownloadViewPage({
  sectionId,
  content,
  pdfPath,
  formRoute,
  validateAccess,
}: ResourceDownloadViewPageProps) {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [viewState, setViewState] = useState<ViewState>('loading')

  useEffect(() => {
    let cancelled = false

    async function checkAccess() {
      if (!isValidAccessToken(token)) {
        if (!cancelled) setViewState('invalid')
        return
      }

      const valid = await validateAccess(token)
      if (!cancelled) {
        setViewState(valid ? 'valid' : 'invalid')
      }
    }

    void checkAccess()

    return () => {
      cancelled = true
    }
  }, [token, validateAccess])

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Section id={sectionId}>
        <div className="mx-auto max-w-5xl">
          {viewState === 'loading' ? (
            <p className="font-body text-lg text-text-primary" role="status">
              {content.loadingLabel}
            </p>
          ) : null}

          {viewState === 'invalid' ? (
            <div className="max-w-2xl">
              <h1 className="mb-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-text-secondary">
                {content.invalidTokenTitle}
              </h1>
              <p className="mb-8 font-body text-lg text-text-primary">
                {content.invalidTokenMessage}
              </p>
              <Link to={formRoute}>
                <Button>{content.backToFormLabel}</Button>
              </Link>
            </div>
          ) : null}

          {viewState === 'valid' ? (
            <>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="mb-2 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-text-secondary">
                    {content.viewTitle}
                  </h1>
                  <p className="font-body text-base text-text-primary">{content.viewIntro}</p>
                </div>
                <a
                  href={pdfPath}
                  download={content.downloadFilename}
                  className="inline-flex shrink-0 items-center justify-center rounded-pill border-2 border-accent-primary bg-accent-primary px-6 py-3 font-body text-base font-semibold text-background-primary transition-colors hover:bg-accent-primary/90"
                >
                  Download PDF
                </a>
              </div>

              <div className="overflow-hidden rounded-card border-2 border-accent-primary/30 bg-background-secondary">
                <iframe
                  title={content.iframeTitle}
                  src={pdfPath}
                  className="h-[min(80dvh,900px)] w-full"
                />
              </div>
            </>
          ) : null}
        </div>
      </Section>
    </>
  )
}
