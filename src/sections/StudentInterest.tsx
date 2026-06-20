import { StudentInterestForm } from '@/components/forms/StudentInterestForm'

export function StudentInterest() {
  return (
    <section id="student-interest" className="scroll-mt-24 border-t-2 border-accent-primary/15 py-16">
      <div className="container mx-auto max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">For students</p>
        <h2 className="mb-3 font-display text-[clamp(1.5rem,2.5vw,2rem)] font-bold leading-tight text-text-secondary">
          Register your interest
        </h2>
        <p className="mb-8 max-w-[50ch] text-text-primary">
          Planning to study in New Zealand? Share a few details and we&apos;ll connect you with relevant
          education providers when opportunities arise.
        </p>

        <div className="rounded-card border-2 border-accent-lavender bg-background-primary p-6 md:p-8">
          <StudentInterestForm />
        </div>
      </div>
    </section>
  )
}
