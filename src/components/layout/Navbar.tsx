import { navLinks } from '@/content/site'
import { handleNavClick } from '@/lib/scroll'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { MobileNav } from '@/components/layout/MobileNav'

export function Navbar() {
  return (
    <header className="relative py-7">
      <div className="container mx-auto grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-4 min-[900px]:grid-cols-[1fr_auto_1fr] min-[900px]:gap-5">
        <a
          href="#hero"
          className="justify-self-start"
          onClick={(e) => handleNavClick(e, '#hero')}
          aria-label="EnRollifyEdu home"
        >
          <Logo />
        </a>

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

        <div className="flex items-center justify-end gap-3">
          <a href="#student-interest" onClick={(e) => handleNavClick(e, '#student-interest')}>
            <Button variant="secondary" size="sm" className="hidden min-[600px]:inline-flex">
              Student interest
            </Button>
          </a>
          <a href="#provider-contact" onClick={(e) => handleNavClick(e, '#provider-contact')}>
            <Button size="sm" className="hidden min-[480px]:inline-flex">
              Contact us
            </Button>
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
