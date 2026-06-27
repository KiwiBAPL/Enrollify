import logo from '@/assets/logo.png'

type LogoVariant = 'nav' | 'footer'

type LogoProps = {
  className?: string
  variant?: LogoVariant
}

const variantClasses: Record<LogoVariant, string> = {
  nav: 'h-10 w-auto sm:h-12',
  footer: 'h-16 w-auto',
}

export function Logo({ className = '', variant = 'nav' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt=""
        width={500}
        height={500}
        aria-hidden="true"
        className={`shrink-0 ${variantClasses[variant]}`}
      />
      <span className="sr-only">Enrollify</span>
    </span>
  )
}
