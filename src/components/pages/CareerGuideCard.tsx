import { Link } from 'react-router-dom'
import type { CareerGuideItem } from '@/types/content'
import { routes } from '@/lib/routes'

interface CareerGuideCardProps {
  guide: CareerGuideItem
}

export function CareerGuideCard({ guide }: CareerGuideCardProps) {
  return (
    <article className="flex h-full flex-col rounded-card border-2 border-accent-primary bg-background-secondary p-6 shadow-hard-accent">
      <h3 className="mb-3 font-display text-xl font-semibold text-text-secondary">
        {guide.number}. {guide.title}
      </h3>
      <p className="m-0 text-sm leading-relaxed text-text-primary">{guide.summary}</p>
      <div className="mt-4 space-y-1">
        <p className="m-0 text-sm text-text-primary">
          <strong>Best for:</strong> {guide.bestFor}
        </p>
        <p className="m-0 text-sm text-text-primary">
          <strong>You will learn:</strong> {guide.youWillLearn}
        </p>
      </div>
      <Link
        to={routes.careerGuide(guide.slug)}
        className="mt-auto inline-flex items-center gap-1 pt-5 font-body text-sm font-semibold text-accent-primary underline-offset-2 hover:text-text-secondary hover:underline"
      >
        Read the guide
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
