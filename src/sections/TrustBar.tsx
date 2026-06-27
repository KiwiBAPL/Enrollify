import { trustBarItems } from '@/content/site'
import { Icon } from '@/components/ui/Icon'

export function TrustBar() {
  return (
    <section aria-label="Trust signals" className="bg-accent-mint/15 py-5">
      <div className="container mx-auto">
        <ul className="grid list-none grid-cols-2 gap-x-6 gap-y-4 p-0 lg:grid-cols-4 lg:gap-y-0">
          {trustBarItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background-secondary text-accent-primary">
                <Icon name={item.icon} className="h-[18px] w-[18px]" />
              </span>
              <span className="font-body text-sm font-semibold leading-snug text-text-primary">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
