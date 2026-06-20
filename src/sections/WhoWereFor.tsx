import { audienceContent } from '@/content/site'
import { Icon } from '@/components/ui/Icon'

export function WhoWereFor() {
  return (
    <section id="who-were-for" className="scroll-mt-24 py-16">
      <div className="container mx-auto">
        <h2 className="mb-8 max-w-[16ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-text-secondary">
          Who we&apos;re for
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {audienceContent.map((card) => (
            <article
              key={card.id}
              className={`rounded-card border-2 p-6 shadow-hard-accent ${
                card.emphasis === 'primary'
                  ? 'border-accent-primary bg-background-secondary'
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
      </div>
    </section>
  )
}
