export function scrollToSection(href: string): void {
  const id = href.startsWith('#') ? href.slice(1) : href
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

import type { MouseEvent } from 'react'

export function handleNavClick(event: MouseEvent<HTMLAnchorElement>, href: string): void {
  if (!href.startsWith('#')) return
  event.preventDefault()
  scrollToSection(href)
}
