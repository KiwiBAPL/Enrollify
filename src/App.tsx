import { useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/sections/Hero'
import { WhoWereFor } from '@/sections/WhoWereFor'
import { HowItWorks } from '@/sections/HowItWorks'
import { Benefits } from '@/sections/Benefits'
import { SupportingContent } from '@/sections/SupportingContent'
import { ProviderContact } from '@/sections/ProviderContact'
import { StudentInterest } from '@/sections/StudentInterest'
import { trackPageview } from '@/lib/analytics'

export default function App() {
  useEffect(() => {
    trackPageview()
  }, [])

  return (
    <div className="min-h-screen overflow-x-clip bg-background-primary">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <WhoWereFor />
        <HowItWorks />
        <Benefits />
        <SupportingContent />
        <ProviderContact />
        <StudentInterest />
      </main>
      <Footer />
    </div>
  )
}
