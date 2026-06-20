import { StudentInterestForm } from '@/components/forms/StudentInterestForm'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function StudentInterest() {
  return (
    <Section id="student-interest" className="border-t-2 border-accent-primary/15">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="For students"
          title="Register your interest"
          intro="Planning to study in New Zealand? Share a few details and we'll connect you with relevant education providers when opportunities arise."
          className="mb-8 [&_h2]:text-[clamp(1.5rem,2.5vw,2rem)]"
        />

        <div className="rounded-card border-2 border-accent-lavender bg-background-primary p-6 sm:p-8">
          <StudentInterestForm />
        </div>
      </div>
    </Section>
  )
}
