import { describe, expect, it } from 'vitest'
import { isNavLinkActive } from '@/lib/nav'

describe('isNavLinkActive', () => {
  it('activates home only on exact root path', () => {
    expect(isNavLinkActive('/', '/')).toBe(true)
    expect(isNavLinkActive('/blog', '/')).toBe(false)
    expect(isNavLinkActive('/study-in-new-zealand', '/')).toBe(false)
  })

  it('activates blog on listing and post detail', () => {
    expect(isNavLinkActive('/blog', '/blog')).toBe(true)
    expect(isNavLinkActive('/blog/my-post', '/blog')).toBe(true)
    expect(isNavLinkActive('/blog-archive', '/blog')).toBe(false)
  })

  it('does not cross-activate sibling routes', () => {
    expect(isNavLinkActive('/career-guides', '/find-a-course')).toBe(false)
    expect(isNavLinkActive('/find-a-course', '/find-a-course')).toBe(true)
  })
})
