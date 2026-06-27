import { useEffect, useRef } from 'react'
import { applyBlogInlineImageStyles } from '@/lib/blog-image-html'
import { sanitizeBlogHtml } from '@/lib/sanitize'

interface BlogBodyProps {
  html: string
}

export function BlogBody({ html }: BlogBodyProps) {
  const ref = useRef<HTMLDivElement>(null)
  const safeHtml = sanitizeBlogHtml(html)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    container.querySelectorAll('img').forEach((img) => {
      img.setAttribute('loading', 'lazy')
    })
    applyBlogInlineImageStyles(container)
  }, [safeHtml])

  return (
    <div
      ref={ref}
      className="blog-body font-body"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  )
}
