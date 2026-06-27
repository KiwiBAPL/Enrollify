type FormatDateStyle = 'long' | 'short' | 'uppercase'

export function formatDate(iso: string | Date, style: FormatDateStyle = 'long'): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  const options: Intl.DateTimeFormatOptions =
    style === 'short'
      ? { day: 'numeric', month: 'short', year: 'numeric' }
      : { day: 'numeric', month: 'long', year: 'numeric' }
  const formatted = date.toLocaleDateString('en-NZ', options)
  return style === 'uppercase' ? formatted.toUpperCase() : formatted
}
