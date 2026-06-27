import { Link } from 'react-router-dom'
import type { ExploreCard } from '@/types/content'

const accentGradients: Record<ExploreCard['accent'], string> = {
  mint: 'bg-gradient-to-br from-accent-mint/50 via-accent-mint/25 to-background-primary',
  lavender: 'bg-gradient-to-br from-accent-lavender/40 via-accent-lavender/20 to-background-primary',
  purple: 'bg-gradient-to-br from-accent-softPurple/45 via-accent-lavender/20 to-background-primary',
}

interface ExploreCardLinkProps {
  card: ExploreCard
}

export function ExploreCardLink({ card }: ExploreCardLinkProps) {
  return (
    <Link
      to={card.href}
      aria-label={card.ariaLabel}
      className="group flex h-full flex-col overflow-hidden rounded-card border-2 border-accent-primary bg-background-secondary shadow-hard-accent transition-transform hover:-translate-y-1 hover:shadow-[6px_8px_0_#43329D] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {card.imageSrc ? (
        <img
          src={card.imageSrc}
          alt={card.imageAlt}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover"
        />
      ) : (
        <div
          className={`aspect-[16/10] w-full ${accentGradients[card.accent]}`}
          role="img"
          aria-label={card.imageAlt}
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-display text-xl font-semibold text-text-secondary group-hover:text-stroke-primary">
          {card.title}
        </h3>
        <p className="m-0 flex-1 text-sm leading-relaxed text-text-primary">{card.subtitle}</p>
        <span className="mt-4 inline-flex items-center gap-1 font-body text-sm font-semibold text-accent-primary">
          Explore
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
