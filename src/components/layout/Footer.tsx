import { Link } from 'react-router-dom'
import {
  footerQuickLinks,
  footerSocialLinks,
  footerStudentResourceLinks,
} from '@/content/footer-links'
import { footerContent } from '@/content/site'
import { routes } from '@/lib/routes'
import { FooterLatestArticles } from '@/components/layout/FooterLatestArticles'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import type { FooterSocialLink } from '@/types/content'

function SocialIcon({ platform }: { platform: FooterSocialLink['platform'] }) {
  if (platform === 'facebook') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }

  if (platform === 'linkedin') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.063 2.063 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function FooterLinkList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-text-secondary">{title}</p>
      <ul className="flex flex-col gap-2 p-0">
        {links.map((link) => (
          <li key={link.href} className="list-none">
            {link.href.startsWith('/#') ? (
              <a
                href={link.href}
                className="text-sm text-text-muted hover:text-text-secondary hover:underline"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.href}
                className="text-sm text-text-muted hover:text-text-secondary hover:underline"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t-2 border-accent-primary/20 bg-background-secondary py-10">
      <div className="container mx-auto flex flex-col gap-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Logo />
            <p className="mt-2 max-w-xs text-sm text-text-muted">{footerContent.tagline}</p>
            <a
              href={`mailto:${footerContent.contactEmail}`}
              className="mt-3 inline-block text-sm text-text-secondary hover:underline"
            >
              {footerContent.contactEmail}
            </a>
            {footerSocialLinks.length > 0 ? (
              <div className="mt-4 flex gap-3">
                {footerSocialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-text-muted transition-colors hover:text-text-secondary"
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <FooterLinkList title="Quick Links" links={footerQuickLinks} />
          <FooterLinkList title="Student Resources" links={footerStudentResourceLinks} />
          <FooterLatestArticles />

          <div>
            <p className="mb-2 text-sm font-semibold text-text-secondary">Book a Consultation</p>
            <p className="mb-4 text-sm text-text-muted">Ready to get started?</p>
            <Link to={routes.bookConsultation}>
              <Button size="sm">Book a Free Consultation</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-accent-primary/10 pt-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">{footerContent.copyright}</p>
          <p className="m-0">
            <a href={footerContent.privacyHref} className="hover:text-text-secondary hover:underline">
              Privacy Policy
            </a>
            {' | '}
            <a href={footerContent.termsHref} className="hover:text-text-secondary hover:underline">
              Terms of Use
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
