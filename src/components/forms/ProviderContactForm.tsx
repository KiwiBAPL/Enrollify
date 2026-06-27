import { trackProviderContactSubmit } from '@/lib/analytics'
import { useFormSubmit } from '@/lib/forms/useFormSubmit'
import {
  parseProviderContactForm,
  validateProviderContact,
} from '@/lib/validation/providerContact'
import { ConsentField, FormField } from '@/components/forms/FormField'
import { footerContent } from '@/content/site'

export function ProviderContactForm() {
  const { status, fieldErrors, globalError, handleSubmit, isDisabled } = useFormSubmit({
    formName: 'provider-contact',
    parse: parseProviderContactForm,
    validate: validateProviderContact,
    onSuccess: trackProviderContactSubmit,
  })

  return (
    <form
      name="provider-contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-4"
      aria-label="Provider contact form"
    >
      <input type="hidden" name="form-name" value="provider-contact" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Organisation name"
          name="organisationName"
          required
          error={fieldErrors.organisationName}
        />
        <FormField
          label="Your name"
          name="contactName"
          required
          error={fieldErrors.contactName}
        />
        <FormField label="Role / title" name="role" required error={fieldErrors.role} />
        <FormField
          label="Work email"
          name="workEmail"
          type="email"
          autoComplete="email"
          required
          error={fieldErrors.workEmail}
        />
        <FormField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
        <FormField
          label="Country / region"
          name="countryRegion"
          required
          error={fieldErrors.countryRegion}
        />
      </div>

      <FormField
        label="Brief description of needs"
        name="needsDescription"
        as="textarea"
        required
        rows={4}
        error={fieldErrors.needsDescription}
      />

      <ConsentField error={fieldErrors.consent}>
        I agree to Enrollify contacting me about my enquiry and understand my details will be
        handled in line with the{' '}
        <a href={footerContent.privacyHref} className="text-text-secondary underline">
          privacy policy
        </a>
        .
      </ConsentField>

      <div>
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-pill border-2 border-stroke-primary bg-accent-mint px-7 py-3.5 font-body text-base font-semibold text-stroke-primary shadow-hard transition-transform hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : status === 'success' ? 'Submitted' : 'Submit enquiry'}
        </button>
      </div>

      {status === 'success' ? (
        <p className="text-sm font-semibold text-text-secondary" role="status">
          Thank you — we&apos;ll be in touch shortly.
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
