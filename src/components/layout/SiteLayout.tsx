import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { siteMeta } from '@/content/site'
import { trackPageview } from '@/lib/analytics'
import { scrollToSection } from '@/lib/scroll'

const pageTitles: Record<string, string> = {
  '/contact': `Contact EnRollifyEdu — ${siteMeta.title.split(' — ')[1] ?? 'EnRollifyEdu'}`,
  '/blog': `Blog — EnRollifyEdu`,
}

export function SiteLayout() {
  const location = useLocation()

  useEffect(() => {
    trackPageview()
    document.title = pageTitles[location.pathname] ?? siteMeta.title

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
