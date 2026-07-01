import { Link } from 'react-router-dom'
import studyInNzHeroImage from '@/assets/card 1.jpeg'
import { GuideContent, GuideParagraph, GuideTableOfContents } from '@/components/pages/GuideContent'
import { StudyInNewZealandMetaTags } from '@/components/seo/StudyInNewZealandMetaTags'
import { ConsultationCta } from '@/components/lead-bot/ConsultationCta'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { studyInNewZealandContent } from '@/content/study-in-new-zealand'
import { routes } from '@/lib/routes'

export function StudyInNewZealandPage() {
  const { hero, tableOfContents, sections, cta } = studyInNewZealandContent

  return (
    <>
      <StudyInNewZealandMetaTags />

      <Section id="study-in-nz-hero" variant="secondary" className="py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <header className="space-y-4">
            <h1 className="m-0 font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-text-secondary">
              {hero.title}
            </h1>
            <p className="m-0 font-display text-lg italic text-text-muted">{hero.subtitle}</p>
            <div className="blog-body space-y-4">
              {hero.intro.map((paragraph, index) => (
                <GuideParagraph key={index} segments={paragraph} />
              ))}
            </div>
          </header>

          <figure className="m-0">
            <img
              src={studyInNzHeroImage}
              alt={hero.imageAlt}
              loading="eager"
              className="aspect-[4/3] w-full rounded-card border-2 border-accent-primary object-cover shadow-hard-accent"
            />
          </figure>
        </div>
      </Section>

      <Section id="study-in-nz-guide" variant="primary" className="py-12">
        <div className="mx-auto max-w-5xl space-y-10">
          <GuideTableOfContents items={tableOfContents} />
          <GuideContent sections={sections} />

          <div className="space-y-4 rounded-card border-2 border-stroke-primary bg-accent-mint/30 p-8 text-center">
            <h2 className="m-0 font-display text-2xl font-semibold text-text-secondary">{cta.heading}</h2>
            <p className="m-0 text-text-primary">{cta.body}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <ConsultationCta>{cta.primaryLabel}</ConsultationCta>
              <Link to={routes.findCourse}>
                <Button variant="secondary">{cta.secondaryLabel}</Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
