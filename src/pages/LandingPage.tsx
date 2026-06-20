import { Hero } from '@/sections/Hero'
import { WhoWereFor } from '@/sections/WhoWereFor'
import { HowItWorks } from '@/sections/HowItWorks'
import { Benefits } from '@/sections/Benefits'
import { SupportingContent } from '@/sections/SupportingContent'
import { StudentInterest } from '@/sections/StudentInterest'

export function LandingPage() {
  return (
    <>
      <Hero />
      <WhoWereFor />
      <HowItWorks />
      <Benefits />
      <SupportingContent />
      <StudentInterest />
    </>
  )
}
