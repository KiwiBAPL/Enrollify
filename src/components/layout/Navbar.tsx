import { navLinks } from '@/content/site'
import { handleNavClick } from '@/lib/scroll'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  return (
    <header className="py-7">
      <div className="container mx-auto grid min-h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-5">
        <a
          href="#hero"
          className="font-display text-[1.35rem] font-extrabold tracking-tight text-text-secondary"
          onClick={(e) => handleNavClick(e, '#hero')}
        >
          EnRollifyEdu
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
            <Button size="sm">Contact us</Button>
          </a>
        </div>
      </div>
    </header>
  )
}
