import { useCallback, useEffect, useId, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks } from '@/content/site'
import { isNavLinkActive, mobileNavLinkClassName } from '@/lib/nav'
import { routes } from '@/lib/routes'
import { Button } from '@/components/ui/Button'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const location = useLocation()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    close()
  }, [close, location.pathname])

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
        <div className="fixed inset-0 z-50 flex flex-col">
          <button
            type="button"
            className="absolute inset-0 bg-stroke-primary/40"
            aria-label="Close menu"
            onClick={close}
          />
          <nav
            id={panelId}
            aria-label="Main navigation"
            className="relative ml-auto flex h-full w-full max-w-sm flex-col border-l-2 border-accent-primary bg-background-secondary shadow-hard-accent"
          >
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <ul className="flex flex-col gap-1 p-0">
                {navLinks.map((link) => {
                  const isActive = isNavLinkActive(location.pathname, link.href)
                  return (
                    <li key={link.href} className="list-none">
                      <Link
                        to={link.href}
                        className={mobileNavLinkClassName(isActive)}
                        onClick={close}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="border-t-2 border-accent-primary/20 p-4">
              <Link to={routes.bookConsultation} className="block w-full" onClick={close}>
                <Button className="w-full">Book a Free Consultation</Button>
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
