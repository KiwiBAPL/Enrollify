import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { trackPageview } from '@/lib/analytics'
import { scrollToSection } from '@/lib/scroll'

export function SiteLayout() {
  const location = useLocation()

  useEffect(() => {
    trackPageview()

    if (location.hash) {
      scrollToSection(location.hash)
      return
    }

    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <div className="min-h-screen overflow-x-clip bg-background-primary">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
