import { heroContent } from '@/content/hero'
import { handleNavClick } from '@/lib/scroll'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { HeroVisual } from '@/components/ui/HeroVisual'

const heroPills = ['NZ providers', 'Global reach', 'Qualified pipeline']

export function Hero() {
  return (
    <section id="hero" className="scroll-mt-24 py-8 pb-20">
      <div className="container mx-auto grid items-start gap-16 lg:grid-cols-[42%_58%] lg:gap-12">
        <div className="flex flex-col gap-8">
          <p className="m-0 text-[15px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            {heroContent.eyebrow}
          </p>
          <h1 className="m-0 max-w-[12ch] font-display text-[clamp(2.5rem,6vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-text-secondary">
            {heroContent.headline}
          </h1>
          <p className="m-0 max-w-[34ch] text-text-primary">{heroContent.body}</p>

          <div className="flex flex-wrap gap-3" aria-label="Service highlights">
            {heroPills.map((label, index) => (
              <Pill key={label} label={label} active={index === 0} />
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={heroContent.primaryCta.href}
              onClick={(e) => handleNavClick(e, heroContent.primaryCta.href)}
            >
              <Button>{heroContent.primaryCta.label}</Button>
            </a>
            {heroContent.secondaryCta ? (
              <a
                href={heroContent.secondaryCta.href}
                onClick={(e) => handleNavClick(e, heroContent.secondaryCta!.href)}
              >
                <Button variant="secondary">{heroContent.secondaryCta.label}</Button>
              </a>
            ) : null}
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}
