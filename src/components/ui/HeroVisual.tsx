import heroVisual from '@/assets/hero-visual.png'

export function HeroVisual() {
  return (
    <div className="relative flex min-h-[420px] items-center justify-center max-[599px]:min-h-[360px]">
      <img
        src={heroVisual}
        alt="Two international students smiling while looking at a smartphone together"
        width={1024}
        height={682}
        className="relative w-[min(100%,480px)] max-w-full object-contain drop-shadow-[6px_8px_0_rgba(67,50,157,0.25)]"
      />
    </div>
  )
}
