type SectionHeaderProps = {
  title: string
  intro?: string
  eyebrow?: string
  className?: string
}

export function SectionHeader({ title, intro, eyebrow, className = '' }: SectionHeaderProps) {
  return (
    <header className={`mb-10 max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">{eyebrow}</p>
      ) : null}
      <h2 className="mb-4 max-w-[20ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-text-secondary">
        {title}
      </h2>
      {intro ? <p className="m-0 max-w-[50ch] text-text-muted">{intro}</p> : null}
    </header>
  )
}
