import type { FormStatus } from '@/types/forms'

const studyLevels = [
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'postgraduate', label: 'Postgraduate' },
  { value: 'pathway', label: 'Pathway / foundation' },
  { value: 'other', label: 'Other' },
]

type StudentInterestFormProps = {
  status?: FormStatus
}

export function StudentInterestForm({ status = 'idle' }: StudentInterestFormProps) {
  return (
    <form
      name="student-interest"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="grid gap-4"
      aria-label="Student register interest form"
    >
      <input type="hidden" name="form-name" value="student-interest" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Full name" name="fullName" required />
        <FormField label="Email" name="email" type="email" required />
        <FormField label="Country of residence" name="countryOfResidence" required />
        <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
          Level of study interest
          <select
            name="studyLevel"
            required
            className="w-full rounded-card border-2 border-accent-primary bg-background-secondary px-4 py-3 font-body text-base text-text-primary outline-none focus:ring-2 focus:ring-accent-lavender"
          >
            {studyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </label>
        <FormField label="Area of study (optional)" name="areaOfStudy" className="md:col-span-2" />
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>
          I agree to EnRollifyEdu storing my details to connect me with relevant education
          providers, in line with the privacy policy.
        </span>
      </label>

      <div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center rounded-pill border-2 border-accent-primary bg-transparent px-6 py-3 font-body text-base font-semibold text-accent-primary transition-colors hover:bg-accent-mint/35 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Register interest'}
        </button>
      </div>

      {status === 'success' ? (
        <p className="text-sm font-semibold text-text-secondary" role="status">
          Thanks — we&apos;ve received your interest.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="text-sm font-semibold text-red-700" role="alert">
          Something went wrong. Please try again later.
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
  className?: string
}

function FormField({
  label,
  name,
  type = 'text',
  required = false,
  className = '',
}: FormFieldProps) {
  return (
    <label className={`grid gap-1.5 text-sm font-semibold text-text-secondary ${className}`}>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-card border-2 border-accent-primary bg-background-secondary px-4 py-3 font-body text-base text-text-primary outline-none focus:ring-2 focus:ring-accent-lavender"
      />
    </label>
  )
}
