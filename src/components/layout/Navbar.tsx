import { Link } from 'react-router-dom'
import { navLinks } from '@/content/site'
import { handleNavClick } from '@/lib/scroll'
import { routes } from '@/lib/routes'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { MobileNav } from '@/components/layout/MobileNav'

export function Navbar() {
  const hasNavLinks = navLinks.length > 0

  return (
    <header className="relative py-7">
      <div
        className={`container mx-auto grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-4 ${hasNavLinks ? 'min-[900px]:grid-cols-[1fr_auto_1fr] min-[900px]:gap-5' : ''}`}
      >
        <Link to={routes.home} className="justify-self-start" aria-label="EnRollifyEdu home">
          <Logo />
        </Link>

        {hasNavLinks ? (
          <nav className="hidden items-center justify-center gap-9 min-[900px]:flex" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-[17px] text-nav-link transition-colors hover:text-stroke-primary"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="flex items-center justify-end gap-3">
          <Link to={routes.studentInterest}>
            <Button variant="secondary" size="sm" className="hidden min-[600px]:inline-flex">
              Student interest
            </Button>
          </Link>
          <Link to={routes.contact}>
            <Button size="sm" className="hidden min-[480px]:inline-flex">
              Contact us
            </Button>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
