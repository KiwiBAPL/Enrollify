import { useEffect } from 'react'
import type { BlogPostFormValues } from '@/components/admin/blog/BlogPostForm'
import {
  getArticleTemplate,
  getArticleTemplateLabel,
} from '@/components/blog/templates/registry'
import { Button } from '@/components/ui/Button'
import { formValuesToPreviewPost } from '@/lib/blog-preview'
import { estimateReadTime, formatReadTime } from '@/lib/read-time'

interface ArticleTemplatePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  values: BlogPostFormValues
  authorName?: string
}

export function ArticleTemplatePreviewDialog({
  open,
  onOpenChange,
  values,
  authorName,
}: ArticleTemplatePreviewDialogProps) {
  const post = formValuesToPreviewPost(values, authorName)
  const Template = getArticleTemplate(values.article_template)
  const readTime = formatReadTime(estimateReadTime(values.body))
  const templateLabel = getArticleTemplateLabel(values.article_template)

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => onOpenChange(false)}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-preview-title"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-lg border-2 border-stroke-primary bg-white shadow-hard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 id="article-preview-title" className="font-display text-lg font-bold">
              Article preview
            </h3>
            <p className="mt-1 font-body text-sm text-text-muted">
              Preview — {templateLabel}. This reflects your current form content.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--bg-primary)]">
          <Template post={post} related={[]} readTime={readTime} preview />
        </div>

        <div className="flex shrink-0 justify-end border-t border-gray-200 px-6 py-4">
          <Button type="button" variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
