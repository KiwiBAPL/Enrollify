type PillProps = {
  label: string
  active?: boolean
}

export function Pill({ label, active = false }: PillProps) {
  return (
    <span
      className={`inline-flex rounded-pill border-2 border-accent-primary px-[22px] py-2.5 font-body text-[15px] font-semibold ${
        active
          ? 'bg-accent-mint text-accent-primary'
          : 'bg-background-secondary text-accent-primary'
      }`}
    >
      {label}
    </span>
  )
}
