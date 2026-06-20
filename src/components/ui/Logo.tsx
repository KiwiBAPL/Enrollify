import logo from '@/assets/logo.png'

type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <img
      src={logo}
      alt="EnRollifyEdu"
      width={500}
      height={500}
      className={`h-10 w-auto shrink-0 ${className}`}
    />
  )
}
