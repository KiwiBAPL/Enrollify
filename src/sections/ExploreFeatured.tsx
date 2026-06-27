import { exploreCards, exploreSectionContent } from '@/content/site'
import { ExploreCardLink } from '@/components/ui/ExploreCardLink'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function ExploreFeatured() {
  return (
    <Section id="explore">
      <SectionHeader
        title={exploreSectionContent.heading}
        intro={exploreSectionContent.intro}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exploreCards.map((card) => (
          <ExploreCardLink key={card.id} card={card} />
        ))}
      </div>
    </Section>
  )
}
