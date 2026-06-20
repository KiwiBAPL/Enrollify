import { heroContent } from '@/content/hero'
import { HeroVisual } from '@/components/ui/HeroVisual'
import { Section } from '@/components/ui/Section'

export function Hero() {
  return (
    <Section id="hero" className="py-8 pb-20">
      <div className="grid items-start gap-12 sm:gap-16 lg:grid-cols-[42%_58%] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
          <h1 className="m-0 max-w-[14ch] font-display text-[clamp(2.25rem,6vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-text-secondary sm:max-w-[12ch]">
            {heroContent.headline}
          </h1>
          <p className="m-0 max-w-[34ch] text-text-primary">{heroContent.body}</p>
        </div>

        <HeroVisual />
      </div>
    </Section>
  )
}
