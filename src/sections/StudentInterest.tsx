import { StudentInterestForm } from '@/components/forms/StudentInterestForm'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function StudentInterest() {
  return (
    <Section id="student-interest" className="border-t-2 border-accent-primary/15">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="Free consultation"
          title="Book a free consultation"
          intro="Planning to study in New Zealand? Share a few details and our local experts will help you explore courses, careers, visas and costs — at no obligation."
          className="mb-8 [&_h2]:text-[clamp(1.5rem,2.5vw,2rem)]"
        />

        <div className="rounded-card border-2 border-accent-lavender bg-background-primary p-6 sm:p-8">
          <StudentInterestForm />
        </div>
      </div>
    </Section>
  )
}
