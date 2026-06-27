import logo from '@/assets/logo.png'

type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt=""
        width={500}
        height={500}
        aria-hidden="true"
        className="h-[140px] w-auto shrink-0"
      />
      <span className="sr-only">Enrollify</span>
    </span>
  )
}
