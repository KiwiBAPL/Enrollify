export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/'
  }
  if (href === '/blog') {
    return pathname === '/blog' || pathname.startsWith('/blog/')
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function navLinkClassName(isActive: boolean): string {
  return `font-body text-[15px] transition-colors hover:text-stroke-primary min-[1100px]:text-[17px] ${
    isActive ? 'font-semibold text-stroke-primary' : 'text-nav-link'
  }`
}

export function mobileNavLinkClassName(isActive: boolean): string {
  return `block rounded-card px-4 py-3.5 font-body text-base font-semibold transition-colors hover:bg-accent-mint/30 hover:text-stroke-primary ${
    isActive ? 'bg-accent-mint/20 text-stroke-primary' : 'text-nav-link'
  }`
}
