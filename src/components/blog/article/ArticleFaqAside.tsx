import { parseFaqText, splitFaqAnswerParagraphs } from '@/lib/parse-faq'

interface ArticleFaqAsideProps {
  faq: string | null
}

export function ArticleFaqAside({ faq }: ArticleFaqAsideProps) {
  const items = parseFaqText(faq)
  if (items.length === 0) return null

  return (
    <section className="mt-10" aria-labelledby="article-faq-heading">
      <h2 id="article-faq-heading" className="mb-4 font-display font-semibold text-text-primary">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <details
            key={index}
            className="group rounded-lg border-2 border-stroke-primary bg-white"
          >
            <summary className="cursor-pointer list-none hyphens-none break-normal px-4 py-3 font-display text-sm font-medium text-text-primary marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                <span className="min-w-0 hyphens-none break-normal">{item.question}</span>
                <span
                  className="text-accent-primary transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-gray-200 px-4 py-3">
              {splitFaqAnswerParagraphs(item.answer).map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="mb-2 hyphens-none break-normal font-body text-sm leading-relaxed text-text-muted last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
