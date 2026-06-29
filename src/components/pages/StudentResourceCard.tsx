import { Link } from 'react-router-dom'
import type { StudentResourceItem } from '@/content/student-resources'

interface StudentResourceCardProps {
  resource: StudentResourceItem
}

export function StudentResourceCard({ resource }: StudentResourceCardProps) {
  return (
    <article className="flex h-full flex-col rounded-card border-2 border-accent-primary bg-background-secondary p-6 shadow-hard-accent">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {resource.eyebrow}
      </p>
      <h3 className="mb-3 font-display text-xl font-semibold text-text-secondary">
        {resource.title}
      </h3>
      <p className="m-0 flex-1 text-sm leading-relaxed text-text-primary">{resource.summary}</p>
      <Link
        to={resource.href}
        className="mt-auto inline-flex items-center gap-1 pt-5 font-body text-sm font-semibold text-accent-primary underline-offset-2 hover:text-text-secondary hover:underline"
      >
        {resource.ctaLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
