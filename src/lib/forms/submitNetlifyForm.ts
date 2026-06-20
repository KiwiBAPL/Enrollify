import type { FormName } from '@/types/forms'

export class NetlifyFormSubmitError extends Error {
  constructor(message = 'Form submission failed.') {
    super(message)
    this.name = 'NetlifyFormSubmitError'
  }
}

export async function submitNetlifyForm(
  formName: FormName,
  formData: FormData,
): Promise<void> {
  const payload = new URLSearchParams()

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue
    payload.append(key, value)
  }

  payload.set('form-name', formName)

  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString(),
  })

  if (!response.ok) {
    throw new NetlifyFormSubmitError()
  }
}
