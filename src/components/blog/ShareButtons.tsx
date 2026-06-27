import { SITE_URL } from '@/lib/site'

interface ShareButtonsProps {
  slug: string
  title: string
}

const linkClass =
  'inline-flex items-center justify-center rounded-pill border-2 border-accent-primary bg-transparent px-5 py-2.5 font-body text-[15px] font-semibold text-accent-primary transition-transform hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary'

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const url = encodeURIComponent(`${SITE_URL}/blog/${slug}`)

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`

  return (
    <div className="flex flex-wrap items-center gap-3" aria-label="Share this article">
      <span className="font-body text-sm text-text-muted">Share:</span>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label={`Share ${title} on LinkedIn`}
      >
        LinkedIn
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label={`Share ${title} on Facebook`}
      >
        Facebook
      </a>
    </div>
  )
}
