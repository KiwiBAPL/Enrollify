import { useCallback, useState, type FormEvent } from 'react'
import type { FieldErrors, FormName, FormStatus } from '@/types/forms'
import { submitNetlifyForm } from '@/lib/forms/submitNetlifyForm'
import { classifySubmitError, reportFormSubmitError } from '@/lib/monitoring/formErrors'

type UseFormSubmitOptions<T extends Record<string, unknown>> = {
  formName: FormName
  parse: (formData: FormData) => T
  validate: (fields: T) => FieldErrors<T>
  onSuccess?: () => void
}

export function useFormSubmit<T extends Record<string, unknown>>({
  formName,
  parse,
  validate,
  onSuccess,
}: UseFormSubmitOptions<T>) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<T>>({})
  const [globalError, setGlobalError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setGlobalError(null)

      const form = event.currentTarget
      const formData = new FormData(form)
      const fields = parse(formData)
      const errors = validate(fields)

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
        await submitNetlifyForm(formName, formData)
        setStatus('success')
        form.reset()
        onSuccess?.()
      } catch (error) {
        reportFormSubmitError(formName, classifySubmitError(error))
        setStatus('error')
        setGlobalError('Something went wrong. Please try again or email us directly.')
      }
    },
    [formName, onSuccess, parse, validate],
  )

  const clearFieldError = useCallback((field: keyof T) => {
    setFieldErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }, [])

  return {
    status,
    fieldErrors,
    globalError,
    handleSubmit,
    clearFieldError,
    isDisabled: status === 'submitting' || status === 'success',
  }
}
