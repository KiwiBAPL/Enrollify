type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <span
      className={`font-display text-[1.35rem] font-extrabold tracking-tight text-text-secondary ${className}`}
    >
      EnRollifyEdu
    </span>
  )
}
