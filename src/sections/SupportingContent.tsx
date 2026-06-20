import { supportingContent } from '@/content/site'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function SupportingContent() {
  return (
    <Section id="supporting" variant="secondary">
      <SectionHeader title={supportingContent.heading} intro={supportingContent.body} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_1.2fr] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {supportingContent.stats.map((stat) => (
            <div
              key={stat.id}
              className="rounded-card border-2 border-accent-primary bg-background-primary px-5 py-4 shadow-hard-accent"
            >
              <p className="m-0 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold leading-none text-text-secondary">
                {stat.value}
              </p>
              <p className="mt-2 m-0 text-sm text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <ul className="grid list-none gap-4 p-0">
          {supportingContent.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-center gap-4 rounded-card border-2 border-accent-primary bg-background-primary px-5 py-4"
            >
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 border-accent-primary bg-background-secondary">
                <Icon name="check" className="h-[22px] w-[22px] text-stroke-primary" />
              </span>
              <span className="font-semibold text-text-primary">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
