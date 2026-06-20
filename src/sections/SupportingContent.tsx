import { supportingContent } from '@/content/site'
import { Icon } from '@/components/ui/Icon'

export function SupportingContent() {
  return (
    <section id="supporting" className="scroll-mt-24 bg-background-secondary py-16">
      <div className="container mx-auto grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <h2 className="mb-4 max-w-[16ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-text-secondary">
            {supportingContent.heading}
          </h2>
          <p className="m-0 max-w-[45ch] text-text-primary">{supportingContent.body}</p>
        </div>

        <ul className="grid gap-4">
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
    </section>
  )
}
