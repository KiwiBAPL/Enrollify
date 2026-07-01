import { forwardRef } from 'react'

interface LeadBotInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
}

export const LeadBotInput = forwardRef<HTMLInputElement, LeadBotInputProps>(
  function LeadBotInput(
    { value, onChange, onSubmit, disabled, placeholder = 'Type your answer…' },
    ref,
  ) {
    return (
      <form
        className="flex gap-2 border-t border-gray-200 p-3"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={500}
          disabled={disabled}
          aria-label="Your answer"
          className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-full bg-[var(--accent-primary,#43329D)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-40"
        >
          Send
        </button>
      </form>
    )
  },
)
