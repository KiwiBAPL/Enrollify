import { footerContent, navLinks } from '@/content/site'
import { handleNavClick } from '@/lib/scroll'
import { Logo } from '@/components/ui/Logo'

const footerExtraLinks = [
  { label: 'Student interest', href: '#student-interest' },
  { label: 'Contact', href: '#provider-contact' },
]

export function Footer() {
  return (
    <footer className="border-t-2 border-accent-primary/20 bg-background-secondary py-10">
      <div className="container mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <p className="mt-2 max-w-xs text-sm text-text-muted">
              International student recruitment for education providers.
            </p>
          </div>

          <nav aria-label="Footer" className="grid gap-6 sm:grid-cols-2 md:gap-10">
            {navLinks.length > 0 ? (
              <div>
                <p className="mb-2 text-sm font-semibold text-text-secondary">Sections</p>
                <ul className="flex flex-col gap-2 p-0">
                  {navLinks.map((link) => (
                    <li key={link.href} className="list-none">
                      <a
                        href={link.href}
                        className="text-sm text-text-muted hover:text-text-secondary hover:underline"
                        onClick={(e) => handleNavClick(e, link.href)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div>
              <p className="mb-2 text-sm font-semibold text-text-secondary">Get in touch</p>
              <ul className="flex flex-col gap-2 p-0">
                {footerExtraLinks.map((link) => (
                  <li key={link.href} className="list-none">
                    <a
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text-secondary hover:underline"
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="list-none">
                  <a
                    href={`mailto:${footerContent.contactEmail}`}
                    className="text-sm text-text-secondary hover:underline"
                  >
                    {footerContent.contactEmail}
                  </a>
                </li>
                <li className="list-none">
                  <a
                    href={footerContent.privacyHref}
                    className="text-sm text-text-muted hover:text-text-secondary hover:underline"
                  >
                    Privacy policy (placeholder)
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <p className="m-0 text-sm text-text-muted">{footerContent.copyright}</p>
      </div>
    </footer>
  )
}
