import { HomeMetaTags } from '@/components/seo/HomeMetaTags'
import { Hero } from '@/sections/Hero'
import { TrustBar } from '@/sections/TrustBar'
import { ExploreFeatured } from '@/sections/ExploreFeatured'
import { HowItWorks } from '@/sections/HowItWorks'
import { Benefits } from '@/sections/Benefits'
import { SupportingContent } from '@/sections/SupportingContent'
import { StudentJourney } from '@/sections/StudentJourney'
import { CourseCategories } from '@/sections/CourseCategories'
import { AboutEnrollifyNz } from '@/sections/AboutEnrollifyNz'
import { FinalCta } from '@/sections/FinalCta'

export function LandingPage() {
  return (
    <>
      <HomeMetaTags />
      <Hero />
      <TrustBar />
      <ExploreFeatured />
      <HowItWorks />
      <Benefits />
      <SupportingContent />
      <StudentJourney />
      <CourseCategories />
      <AboutEnrollifyNz />
      <FinalCta />
    </>
  )
}
