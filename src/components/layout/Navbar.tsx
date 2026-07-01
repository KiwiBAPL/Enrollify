import { Link, useLocation } from 'react-router-dom'
import { navLinks } from '@/content/site'
import { isNavLinkActive, navLinkClassName } from '@/lib/nav'
import { routes } from '@/lib/routes'
import { ConsultationCta } from '@/components/lead-bot/ConsultationCta'
import { Logo } from '@/components/ui/Logo'
import { MobileNav } from '@/components/layout/MobileNav'

export function Navbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b-2 border-accent-primary/15 bg-background-primary/95 backdrop-blur-sm">
      <div className="container mx-auto grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-4 py-4 min-[900px]:grid-cols-[1fr_auto_1fr] min-[900px]:gap-5 min-[900px]:py-5">
        <Link to={routes.home} className="justify-self-start" aria-label="Enrollify home">
          <Logo variant="nav" />
        </Link>

        <nav
          className="hidden items-center justify-center gap-5 min-[900px]:flex min-[1100px]:gap-6"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isActive = isNavLinkActive(location.pathname, link.href)
            return (
              <Link key={link.href} to={link.href} className={navLinkClassName(isActive)}>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <ConsultationCta size="sm" className="hidden min-[900px]:inline-flex">
            Book a Free Consultation
          </ConsultationCta>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
