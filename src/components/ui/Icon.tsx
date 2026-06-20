type IconName = 'calendar' | 'shield' | 'spark' | 'play' | 'users' | 'globe' | 'check'

type IconProps = {
  name: IconName
  className?: string
}

const paths: Record<IconName, React.ReactNode> = {
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
  shield: <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />,
  spark: (
    <>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M18.24 18.24l2.83 2.83" />
      <path d="M2 12h4M18 12h4M4.93 19.07l2.83-2.83M18.24 5.76l2.83-2.83" />
    </>
  ),
  play: <path d="M10 8l8 6-8 6V8z" fill="currentColor" stroke="none" />,
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
}

export function Icon({ name, className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
