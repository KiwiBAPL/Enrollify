import { Link } from 'react-router-dom'
import { heroContent } from '@/content/hero'
import { HeroVisual } from '@/components/ui/HeroVisual'
import { Button } from '@/components/ui/Button'
import { handleNavClick } from '@/lib/scroll'

function HeroCta({ href, label, variant = 'primary' }: { href: string; label: string; variant?: 'primary' | 'secondary' }) {
  const button = <Button variant={variant}>{label}</Button>

  if (href.startsWith('#')) {
    return (
      <a href={href} onClick={(e) => handleNavClick(e, href)}>
        {button}
      </a>
    )
  }

  return <Link to={href}>{button}</Link>
}

export function Hero() {
  const headlineLines = heroContent.headline.split('\n')

  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden py-8 pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-mint/25 via-background-primary to-accent-lavender/15"
      />
      <div className="container relative mx-auto">
        <div className="grid items-start gap-12 sm:gap-16 lg:grid-cols-[42%_58%] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
            <h1 className="m-0 flex max-w-[18ch] flex-col font-display text-[clamp(1.8rem,4.8vw,5.2rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-text-secondary">
              {headlineLines.map((line, index) => (
                <span key={`${line}-${index}`} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="m-0 max-w-[42ch] text-text-primary">{heroContent.body}</p>
            <div className="flex flex-wrap gap-3">
              <HeroCta href={heroContent.primaryCta.href} label={heroContent.primaryCta.label} />
              {heroContent.secondaryCta ? (
                <HeroCta
                  href={heroContent.secondaryCta.href}
                  label={heroContent.secondaryCta.label}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  )
}
