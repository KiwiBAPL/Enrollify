import { audienceContent } from '@/content/site'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function WhoWereFor() {
  return (
    <Section id="who-were-for">
      <SectionHeader
        title="Who we're for"
        intro="EnRollifyEdu serves colleges in New Zealand first, with a lightweight path for international students researching study in New Zealand."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {audienceContent.map((card) => (
          <article
            key={card.id}
            className={`rounded-card border-2 p-6 shadow-hard-accent ${
              card.emphasis === 'primary'
                ? 'border-accent-primary bg-background-secondary ring-2 ring-accent-mint/40'
                : 'border-accent-lavender bg-background-primary'
            }`}
          >
            <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-accent-primary bg-background-secondary">
              <Icon name={card.emphasis === 'primary' ? 'users' : 'globe'} className="h-[22px] w-[22px]" />
            </div>
            <h3 className="mb-2 font-display text-xl font-semibold text-text-secondary">{card.title}</h3>
            <p className="m-0 text-base text-text-primary">{card.description}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
