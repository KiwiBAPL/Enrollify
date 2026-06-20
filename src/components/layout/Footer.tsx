import { footerContent } from '@/content/site'

export function Footer() {
  return (
    <footer className="border-t-2 border-accent-primary/20 bg-background-secondary py-10">
      <div className="container mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-bold text-text-secondary">EnRollifyEdu</p>
          <p className="mt-1 text-sm text-text-muted">
            International student recruitment for education providers.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <a href={`mailto:${footerContent.contactEmail}`} className="text-text-secondary hover:underline">
            {footerContent.contactEmail}
          </a>
          <a href={footerContent.privacyHref} className="text-text-muted hover:text-text-secondary">
            Privacy policy (placeholder)
          </a>
        </div>

        <p className="text-sm text-text-muted">{footerContent.copyright}</p>
      </div>
    </footer>
  )
}
