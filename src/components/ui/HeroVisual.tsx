import { InfoCard } from '@/components/ui/InfoCard'

export function HeroVisual() {
  return (
    <div className="relative flex min-h-[420px] items-center justify-center max-[599px]:min-h-[360px]">
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="absolute z-[1] aspect-square w-[min(88%,420px)] -translate-x-[8%] translate-y-[6%] -rotate-[8deg] rounded-blob bg-accent-mint" />
        <span className="absolute z-[2] aspect-square w-[min(88%,420px)] translate-x-[10%] -translate-y-[4%] rotate-[12deg] rounded-blob bg-accent-lavender" />
        <span className="absolute z-0 aspect-square w-[min(55%,260px)] translate-x-[28%] translate-y-[22%] -rotate-[15deg] rounded-blob bg-accent-softPurple opacity-85" />
      </div>

      <div className="relative z-[3] w-[min(100%,320px)] drop-shadow-[6px_8px_0_rgba(67,50,157,0.25)]">
        <svg viewBox="0 0 320 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <ellipse cx="160" cy="380" rx="110" ry="18" fill="#43329D" opacity="0.12" />
          <path
            d="M160 55c-38 0-68 32-68 72v18c0 22 18 40 40 40h8v52c-28 8-48 32-48 62v25h136v-25c0-30-20-54-48-62v-52h8c22 0 40-18 40-40v-18c0-40-30-72-68-72z"
            fill="#43329D"
          />
          <circle cx="160" cy="95" r="52" fill="#AEE3C8" stroke="#43329D" strokeWidth="3" />
          <circle cx="145" cy="92" r="5" fill="#111" />
          <circle cx="175" cy="92" r="5" fill="#111" />
          <path d="M148 108c8 8 16 8 24 0" stroke="#111" strokeWidth="3" strokeLinecap="round" />
          <rect x="118" y="155" width="84" height="110" rx="28" fill="#FFFFFF" stroke="#43329D" strokeWidth="3" />
          <path d="M118 185h84" stroke="#43329D" strokeWidth="2" />
        </svg>
      </div>

      <InfoCard
        eyebrow="End-to-end"
        title="From attraction to enrolment handoff"
        body="A structured recruitment process built for education providers."
        className="absolute bottom-[12%] right-0 z-[4] max-w-[240px] max-[1023px]:bottom-[-8px] max-[1023px]:left-1/2 max-[1023px]:max-w-[280px] max-[1023px]:-translate-x-1/2 max-[599px]:relative max-[599px]:bottom-auto max-[599px]:left-auto max-[599px]:mt-5 max-[599px]:max-w-full max-[599px]:translate-x-0"
      />
    </div>
  )
}
