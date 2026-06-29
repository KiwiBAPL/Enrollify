import type { FaqItem } from '@/types/content'

interface CareerGuidesFaqProps {
  title: string
  items: FaqItem[]
}

export function CareerGuidesFaq({ title, items }: CareerGuidesFaqProps) {
  return (
    <section id="popular-questions" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-text-secondary">{title}</h2>
      <dl className="mt-6 space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="font-display text-lg font-semibold text-text-secondary">{item.question}</dt>
            <dd className="mt-2 text-text-primary">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
