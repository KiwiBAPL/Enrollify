import type { FormStatus } from '@/types/forms'

type ProviderContactFormProps = {
  status?: FormStatus
}

export function ProviderContactForm({ status = 'idle' }: ProviderContactFormProps) {
  return (
    <form
      name="provider-contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="grid gap-4"
      aria-label="Provider contact form"
    >
      <input type="hidden" name="form-name" value="provider-contact" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Organisation name" name="organisationName" required />
        <FormField label="Your name" name="contactName" required />
        <FormField label="Role / title" name="role" required />
        <FormField label="Work email" name="workEmail" type="email" required />
        <FormField label="Phone (optional)" name="phone" type="tel" />
        <FormField label="Country / region" name="countryRegion" required />
      </div>

      <FormField
        label="Brief description of needs"
        name="needsDescription"
        as="textarea"
        required
      />

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>
          I agree to EnRollifyEdu contacting me about my enquiry and understand my details will be
          handled in line with the privacy policy.
        </span>
      </label>

      <div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center rounded-pill border-2 border-stroke-primary bg-accent-mint px-7 py-3.5 font-body text-base font-semibold text-stroke-primary shadow-hard transition-transform hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Submit enquiry'}
        </button>
      </div>

      {status === 'success' ? (
        <p className="text-sm font-semibold text-text-secondary" role="status">
          Thank you — we&apos;ll be in touch shortly.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="text-sm font-semibold text-red-700" role="alert">
          Something went wrong. Please try again or email us directly.
        </p>
      ) : null}

      <p className="text-xs text-text-muted">Form submission wiring — Phase 2.</p>
    </form>
  )
}

type FormFieldProps = {
  label: string
  name: string
  type?: string
  required?: boolean
  as?: 'input' | 'textarea'
}

function FormField({
  label,
  name,
  type = 'text',
  required = false,
  as = 'input',
}: FormFieldProps) {
  const className =
    'w-full rounded-card border-2 border-accent-primary bg-background-secondary px-4 py-3 font-body text-base text-text-primary outline-none focus:ring-2 focus:ring-accent-lavender'

  return (
    <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
      {label}
      {as === 'textarea' ? (
        <textarea name={name} required={required} rows={4} className={className} />
      ) : (
        <input name={name} type={type} required={required} className={className} />
      )}
    </label>
  )
}
