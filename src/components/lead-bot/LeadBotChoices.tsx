interface LeadBotChoicesProps {
  options: string[]
  disabled?: boolean
  onSelect: (value: string) => void
}

export function LeadBotChoices({ options, disabled, onSelect }: LeadBotChoicesProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option)}
          className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-left text-sm text-gray-900 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-mint)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-50"
        >
          {option}
        </button>
      ))}
    </div>
  )
}
