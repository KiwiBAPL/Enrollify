import { useCallback, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConsentField, FormField } from '@/components/forms/FormField'
import type { FieldErrors, FormStatus } from '@/types/forms'
import type { ResourceLeadFields } from '@/lib/validation/resourceLead'
import {
  parseResourceLeadForm,
  validateResourceLead,
} from '@/lib/validation/resourceLead'

type ResourceLeadFormProps = {
  ariaLabel: string
  consentText: ReactNode
  submitLabel: string
  submittingLabel: string
  viewRoute: string
  onSubmitLead: (fields: {
    firstName: string
    lastName: string
    email: string
    linkedinUrl?: string
  }) => Promise<string>
}

export function ResourceLeadForm({
  ariaLabel,
  consentText,
  submitLabel,
  submittingLabel,
  viewRoute,
  onSubmitLead,
}: ResourceLeadFormProps) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<FormStatus>('idle')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ResourceLeadFields>>({})
  const [globalError, setGlobalError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setGlobalError(null)

      const form = event.currentTarget
      const formData = new FormData(form)

      if (String(formData.get('bot-field') ?? '').trim()) {
        return
      }

      const fields = parseResourceLeadForm(formData)
      const errors = validateResourceLead(fields)

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        setStatus('idle')

        const firstErrorField = Object.keys(errors)[0]
        if (firstErrorField) {
          const element = form.querySelector<HTMLElement>(
            `[name="${firstErrorField}"], #${firstErrorField}`,
          )
          element?.focus()
        }

        return
      }

      setFieldErrors({})
      setStatus('submitting')

      try {
        const accessToken = await onSubmitLead({
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          linkedinUrl: fields.linkedinUrl,
        })

        const params = new URLSearchParams({ token: accessToken })
        navigate(`${viewRoute}?${params.toString()}`)
      } catch {
        setStatus('error')
        setGlobalError('Something went wrong. Please try again or email us directly.')
      }
    },
    [navigate, onSubmitLead, viewRoute],
  )

  const isDisabled = status === 'submitting'

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4" aria-label={ariaLabel}>
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="First name"
          name="firstName"
          autoComplete="given-name"
          required
          error={fieldErrors.firstName}
        />
        <FormField
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          required
          error={fieldErrors.lastName}
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
          label="LinkedIn profile (optional)"
          name="linkedinUrl"
          type="url"
          autoComplete="url"
          placeholder="https://www.linkedin.com/in/your-profile"
          error={fieldErrors.linkedinUrl}
        />
      </div>

      <ConsentField error={fieldErrors.consent}>{consentText}</ConsentField>

      <div>
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-pill border-2 border-accent-primary bg-transparent px-6 py-3 font-body text-base font-semibold text-accent-primary transition-colors hover:bg-accent-mint/35 disabled:opacity-60"
        >
          {status === 'submitting' ? submittingLabel : submitLabel}
        </button>
      </div>

      {globalError ? (
        <p className="text-sm font-semibold text-red-700" role="alert">
          {globalError}
        </p>
      ) : null}
    </form>
  )
}
