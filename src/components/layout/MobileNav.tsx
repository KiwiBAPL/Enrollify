import { useCallback, useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { navLinks } from '@/content/site'
import { routes } from '@/lib/routes'
import { handleNavClick } from '@/lib/scroll'

const mobileExtraLinks = [
  { label: 'Blog', href: routes.blog, isRoute: true },
  { label: 'Student interest', href: routes.studentInterest, isRoute: false },
  { label: 'Contact', href: routes.contact, isRoute: true },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [close, open])

  return (
    <div className="min-[900px]:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-pill border-2 border-accent-primary bg-background-secondary text-text-secondary"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="sr-only">{open ? 'Close navigation menu' : 'Open navigation menu'}</span>
        <span aria-hidden="true" className="flex flex-col gap-1.5">
          <span className={`block h-0.5 w-5 bg-stroke-primary transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-stroke-primary transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-stroke-primary transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </span>
      </button>

      {open ? (
        <nav
          id={panelId}
          aria-label="Mobile"
          className="absolute left-0 right-0 top-full z-50 border-b-2 border-accent-primary bg-background-secondary px-4 py-5 shadow-hard-accent"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-card px-3 py-3 font-body text-base font-semibold text-nav-link hover:bg-accent-mint/30 hover:text-stroke-primary"
                  onClick={(e) => {
                    handleNavClick(e, link.href)
                    close()
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            {mobileExtraLinks.map((link) => (
              <li key={link.href}>
                {link.isRoute ? (
                  <Link
                    to={link.href}
                    className="block rounded-card px-3 py-3 font-body text-base font-semibold text-nav-link hover:bg-accent-mint/30 hover:text-stroke-primary"
                    onClick={close}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="block rounded-card px-3 py-3 font-body text-base font-semibold text-nav-link hover:bg-accent-mint/30 hover:text-stroke-primary"
                    onClick={(e) => {
                      handleNavClick(e, link.href)
                      close()
                    }}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
