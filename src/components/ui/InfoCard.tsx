type InfoCardProps = {
  eyebrow?: string
  title: string
  body: string
  className?: string
}

export function InfoCard({ eyebrow, title, body, className = '' }: InfoCardProps) {
  return (
    <div
      className={`rounded-card border-2 border-accent-primary bg-background-secondary px-5 py-[18px] shadow-hard-accent ${className}`}
    >
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">{eyebrow}</p>
      ) : null}
      <p className="mb-2 font-display text-lg font-semibold leading-snug text-text-secondary">{title}</p>
      <p className="m-0 text-sm leading-normal text-text-primary">{body}</p>
    </div>
  )
}
