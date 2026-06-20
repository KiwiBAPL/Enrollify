import { trackStudentInterestSubmit } from '@/lib/analytics'
import { useFormSubmit } from '@/lib/forms/useFormSubmit'
import {
  parseStudentInterestForm,
  validateStudentInterest,
} from '@/lib/validation/studentInterest'
import { ConsentField, FormField } from '@/components/forms/FormField'
import { footerContent } from '@/content/site'

const studyLevels = [
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'postgraduate', label: 'Postgraduate' },
  { value: 'pathway', label: 'Pathway / foundation' },
  { value: 'other', label: 'Other' },
]

export function StudentInterestForm() {
  const { status, fieldErrors, globalError, handleSubmit, isDisabled } = useFormSubmit({
    formName: 'student-interest',
    parse: parseStudentInterestForm,
    validate: validateStudentInterest,
    onSuccess: trackStudentInterestSubmit,
  })

  return (
    <form
      name="student-interest"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-4"
      aria-label="Student register interest form"
    >
      <input type="hidden" name="form-name" value="student-interest" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Full name"
          name="fullName"
          autoComplete="name"
          required
          error={fieldErrors.fullName}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={fieldErrors.email}
        />
        <FormField
          label="Country of residence"
          name="countryOfResidence"
          autoComplete="country-name"
          required
          error={fieldErrors.countryOfResidence}
        />
        <label className="grid gap-1.5 text-sm font-semibold text-text-secondary">
          Level of study interest
          <select
            name="studyLevel"
            id="studyLevel"
            required
            defaultValue="undergraduate"
            className="w-full rounded-card border-2 border-accent-primary bg-background-secondary px-4 py-3 font-body text-base text-text-primary outline-none focus:ring-2 focus:ring-accent-lavender"
          >
            {studyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </label>
        <FormField
          label="Area of study (optional)"
          name="areaOfStudy"
          className="md:col-span-2"
        />
      </div>

      <ConsentField error={fieldErrors.consent}>
        I agree to EnRollifyEdu storing my details to connect me with relevant education providers,
        in line with the{' '}
        <a href={footerContent.privacyHref} className="text-text-secondary underline">
          privacy policy
        </a>
        .
      </ConsentField>

      <div>
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-pill border-2 border-accent-primary bg-transparent px-6 py-3 font-body text-base font-semibold text-accent-primary transition-colors hover:bg-accent-mint/35 disabled:opacity-60"
        >
          {status === 'submitting'
            ? 'Sending…'
            : status === 'success'
              ? 'Submitted'
              : 'Register interest'}
        </button>
      </div>

      {status === 'success' ? (
        <p className="text-sm font-semibold text-text-secondary" role="status">
          Thanks — we&apos;ve received your interest.
        </p>
      ) : null}
      {globalError ? (
        <p className="text-sm font-semibold text-red-700" role="alert">
          {globalError}
        </p>
      ) : null}
    </form>
  )
}
