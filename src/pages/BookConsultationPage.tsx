import { PlaceholderPage } from '@/components/pages/PlaceholderPage'
import { StudentInterestForm } from '@/components/forms/StudentInterestForm'

export function BookConsultationPage() {
  return (
    <PlaceholderPage
      title="Book a Free Consultation"
      description="Planning to study in New Zealand? Share a few details and our local experts will help you explore courses, careers, visas and costs — at no obligation."
      showConsultationLink={false}
    >
      <div className="mx-auto max-w-3xl rounded-card border-2 border-accent-lavender bg-background-primary p-6 sm:p-8">
        <StudentInterestForm />
      </div>
    </PlaceholderPage>
  )
}
