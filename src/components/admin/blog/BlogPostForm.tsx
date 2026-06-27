import { lazy, Suspense, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CategoryCombobox } from '@/components/admin/blog/CategoryCombobox'
import type { QuillEditorHandle } from '@/components/admin/blog/QuillEditor'

const QuillEditor = lazy(() =>
  import('@/components/admin/blog/QuillEditor').then((m) => ({ default: m.QuillEditor })),
)
import { ArticleTemplatePreviewDialog } from '@/components/admin/blog/ArticleTemplatePreviewDialog'
import {
  ImageInsertDialog,
  type ImageInsertDialogState,
} from '@/components/admin/blog/ImageInsertDialog'
import { RelatedPostsPicker } from '@/components/admin/blog/RelatedPostsPicker'
import { slugify } from '@/lib/slug'
import { uploadFeaturedImage, deleteBodyImageIfOrphaned } from '@/lib/blog'
import { useBlogCategories } from '@/hooks/useBlog'
import { type BlogInlineImageOptions } from '@/lib/blog-image-html'
import {
  ARTICLE_TEMPLATE_OPTIONS,
  DEFAULT_ARTICLE_TEMPLATE,
} from '@/components/blog/templates/registry'
import type { BlogArticleTemplateId } from '@/components/blog/templates/types'
import type { BlogPost } from '@/types/database'

export interface BlogPostFormValues {
  title: string
  slug: string
  summary: string
  body: string
  category: string
  series_collection: string
  article_template: BlogArticleTemplateId
  meta_title: string
  meta_description: string
  featured_image_url: string
  featured_image_alt: string
  related_post_slugs: string[]
  faq_text: string
}

interface BlogPostFormProps {
  postId?: string
  authorName?: string
  initialValues?: Partial<BlogPostFormValues>
  status?: BlogPost['status']
  slugLocked?: boolean
  validationIssues?: { field: string; message: string }[]
  isSaving?: boolean
  isPublishing?: boolean
  onSave: (values: BlogPostFormValues) => void
  onPublish?: (values: BlogPostFormValues) => void
  onCancel?: () => void
}

const emptyValues: BlogPostFormValues = {
  title: '',
  slug: '',
  summary: '',
  body: '',
  category: '',
  series_collection: '',
  article_template: DEFAULT_ARTICLE_TEMPLATE,
  meta_title: '',
  meta_description: '',
  featured_image_url: '',
  featured_image_alt: '',
  related_post_slugs: [],
  faq_text: '',
}

const inputClass =
  'w-full rounded-lg border-2 border-stroke-primary px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary'

const labelClass = 'mb-1 block text-sm font-semibold font-body'

export function BlogPostForm({
  postId,
  authorName,
  initialValues,
  status = 'draft',
  slugLocked = false,
  validationIssues = [],
  isSaving,
  isPublishing,
  onSave,
  onPublish,
  onCancel,
}: BlogPostFormProps) {
  const [values, setValues] = useState<BlogPostFormValues>({
    ...emptyValues,
    ...initialValues,
  })
  const [slugManual, setSlugManual] = useState(Boolean(initialValues?.slug))
  const [embedError, setEmbedError] = useState<string | null>(null)
  const [featuredImageError, setFeaturedImageError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const { data: existingCategories = [] } = useBlogCategories()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageDialogState, setImageDialogState] = useState<ImageInsertDialogState | null>(null)
  const quillRef = useRef<QuillEditorHandle>(null)

  const update = (field: keyof BlogPostFormValues, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !slugManual) {
        next.slug = slugify(value)
      }
      if (field === 'slug') {
        setSlugManual(true)
      }
      return next
    })
  }

  const fieldError = (field: string) =>
    validationIssues.find((i) => i.field === field)?.message

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !postId) return
    setUploading(true)
    setFeaturedImageError(null)
    const { data, error } = await uploadFeaturedImage(postId, file)
    setUploading(false)
    if (error) {
      setFeaturedImageError(error.message)
      e.target.value = ''
      return
    }
    if (data) update('featured_image_url', data)
    e.target.value = ''
  }

  const handleInsertEmbed = () => {
    const url = window.prompt(
      'Paste embed URL (YouTube, Vimeo, Spotify, Apple Podcasts, or SoundCloud):',
    )
    if (!url) return
    const err = quillRef.current?.insertEmbed(url)
    if (err) setEmbedError(err)
    else setEmbedError(null)
  }

  const handleInsertImage = () => {
    setEmbedError(null)
    setImageDialogState({ mode: 'insert' })
    setImageDialogOpen(true)
  }

  const handleBlogImageClick = (index: number, options: BlogInlineImageOptions) => {
    setEmbedError(null)
    setImageDialogState({ mode: 'edit', editIndex: index, initial: options })
    setImageDialogOpen(true)
  }

  const handleImageConfirm = (options: BlogInlineImageOptions, editIndex?: number) => {
    setImageDialogOpen(false)
    setImageDialogState(null)

    if (editIndex !== undefined) {
      const ok = quillRef.current?.updateBlogImage(editIndex, options)
      if (ok === false || ok === undefined) {
        setEmbedError('Could not update image.')
        return
      }
      setEmbedError(null)
      return
    }

    const ok = quillRef.current?.insertBlogImage(options)

    if (ok === false || ok === undefined) {
      setEmbedError('Could not insert image.')
      return
    }

    setEmbedError(null)
  }

  const handleImageDelete = async (editIndex: number, imageUrl: string) => {
    const ok = quillRef.current?.deleteBlogImage(editIndex)
    if (ok === false || ok === undefined) {
      setEmbedError('Could not remove image.')
      return
    }

    setImageDialogOpen(false)
    setImageDialogState(null)
    setEmbedError(null)

    if (postId && imageUrl) {
      const bodyHtml = quillRef.current?.getHtml() ?? values.body
      const { error } = await deleteBodyImageIfOrphaned(postId, imageUrl, bodyHtml)
      if (error) {
        setEmbedError(
          'Image removed from the post, but the file could not be deleted from storage.',
        )
      }
    }
  }

  return (
    <>
      <form
        className="max-w-4xl space-y-8"
        onSubmit={(e) => {
          e.preventDefault()
          onSave(values)
        }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide ${
              status === 'published'
                ? 'bg-accent-mint text-stroke-primary'
                : 'border-2 border-stroke-primary bg-white text-text-muted'
            }`}
          >
            {status}
          </span>
          {authorName && (
            <span className="font-body text-sm text-text-muted">
              Author: <span className="font-medium text-text-primary">{authorName}</span>
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              value={values.title}
              onChange={(e) => update('title', e.target.value)}
              required
              className={inputClass}
            />
            {fieldError('title') && (
              <p className="font-body text-sm text-red-600" role="alert">
                {fieldError('title')}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="slug" className={labelClass}>
              Slug
            </label>
            <input
              id="slug"
              value={values.slug}
              onChange={(e) => update('slug', slugify(e.target.value))}
              disabled={slugLocked}
              required
              className={inputClass}
            />
            {fieldError('slug') && (
              <p className="font-body text-sm text-red-600" role="alert">
                {fieldError('slug')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <CategoryCombobox
              id="category"
              value={values.category}
              options={existingCategories}
              onChange={(category) => update('category', category)}
            />
            {fieldError('category') && (
              <p className="font-body text-sm text-red-600" role="alert">
                {fieldError('category')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="series" className={labelClass}>
              Series / Collection (optional)
            </label>
            <input
              id="series"
              value={values.series_collection}
              onChange={(e) => update('series_collection', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="article_template" className={labelClass}>
              Article layout
            </label>
            <select
              id="article_template"
              value={values.article_template}
              onChange={(e) => update('article_template', e.target.value as BlogArticleTemplateId)}
              className={inputClass}
              aria-label="Article layout"
            >
              {ARTICLE_TEMPLATE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="font-body text-sm text-text-muted">
              Controls how the post renders on /blog/:slug.
            </p>
            {fieldError('article_template') && (
              <p className="font-body text-sm text-red-600" role="alert">
                {fieldError('article_template')}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="summary" className={labelClass}>
              Summary
            </label>
            <textarea
              id="summary"
              value={values.summary}
              onChange={(e) => update('summary', e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className={labelClass}>Body</span>
          <div className="mb-2 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={handleInsertEmbed}>
              Insert embed
            </Button>
          </div>
          <p className="-mt-1 mb-2 font-body text-sm text-text-muted">
            Place the cursor where you want an image, then click the image icon in the editor
            toolbar. Click an image to edit or remove it. Drag the ⋮⋮ handle to reposition it.
          </p>
          <Suspense
            fallback={
              <div className="rounded-md border border-stroke-primary bg-white px-4 py-8 font-body text-sm text-text-muted">
                Loading editor…
              </div>
            }
          >
            <QuillEditor
              ref={quillRef}
              value={values.body}
              onChange={(body) => update('body', body)}
              onBlogImageClick={handleBlogImageClick}
              onRequestInsertImage={handleInsertImage}
            />
          </Suspense>
          {fieldError('body') && (
            <p className="font-body text-sm text-red-600" role="alert">
              {fieldError('body')}
            </p>
          )}
          {embedError && (
            <p className="font-body text-sm text-red-600" role="alert">
              {embedError}
            </p>
          )}
        </div>

        <div className="space-y-2 border-t border-gray-200 pt-6">
          <label htmlFor="faq_text" className={labelClass}>
            FAQ (optional)
          </label>
          <p className="font-body text-sm text-text-muted">
            Put each question on its own line (ending with ?), then the answer on the following
            line(s). Start the next pair with a blank line or another question line. Shown in the
            article sidebar as separate expandable FAQs.
          </p>
          <textarea
            id="faq_text"
            value={values.faq_text}
            onChange={(e) => update('faq_text', e.target.value)}
            rows={8}
            placeholder={`What is EnRollifyEdu?\nEnRollifyEdu is a technology-enabled international student recruitment service.\n\nHow do providers get started?\nContact us to discuss your recruitment goals.`}
            className={`${inputClass} font-mono`}
          />
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-6">
          <div>
            <h2 className="font-display text-lg font-semibold">Related blogs</h2>
            <p className="mt-1 font-body text-sm text-text-muted">
              Choose posts to show as links at the bottom of this article. Filter by category or
              series, then select individual posts or select all.
            </p>
          </div>
          <RelatedPostsPicker
            currentSlug={values.slug}
            selectedSlugs={values.related_post_slugs}
            onChange={(related_post_slugs) =>
              setValues((prev) => ({ ...prev, related_post_slugs }))
            }
          />
        </div>

        <div className="grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2">
          <h2 className="font-display text-lg font-semibold sm:col-span-2">SEO &amp; Media</h2>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="meta_title" className={labelClass}>
              Meta title
            </label>
            <input
              id="meta_title"
              value={values.meta_title}
              onChange={(e) => update('meta_title', e.target.value)}
              className={inputClass}
            />
            {fieldError('meta_title') && (
              <p className="font-body text-sm text-red-600" role="alert">
                {fieldError('meta_title')}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="meta_description" className={labelClass}>
              Meta description
            </label>
            <textarea
              id="meta_description"
              value={values.meta_description}
              onChange={(e) => update('meta_description', e.target.value)}
              rows={3}
              className={inputClass}
            />
            {fieldError('meta_description') && (
              <p className="font-body text-sm text-red-600" role="alert">
                {fieldError('meta_description')}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="featured_image" className={labelClass}>
              Featured image
            </label>
            {postId ? (
              <>
                <input
                  id="featured_image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFeaturedUpload}
                  disabled={uploading}
                  className="font-body text-sm"
                />
                <p className="font-body text-sm text-text-muted">
                  JPEG, PNG, or WebP. Large images are auto-resized (max width 1400px) and
                  compressed on upload.
                </p>
                {uploading && (
                  <p className="font-body text-sm text-text-muted">Processing image…</p>
                )}
                {featuredImageError && (
                  <p className="font-body text-sm text-red-600" role="alert">
                    {featuredImageError}
                  </p>
                )}
              </>
            ) : (
              <p className="font-body text-sm text-text-muted">
                Save draft first to upload a featured image.
              </p>
            )}
            {values.featured_image_url && (
              <img
                src={values.featured_image_url}
                alt={values.featured_image_alt || 'Featured image preview'}
                className="mt-2 max-h-48 rounded-lg object-cover"
              />
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="featured_image_alt" className={labelClass}>
              Featured image alt text
            </label>
            <input
              id="featured_image_alt"
              value={values.featured_image_alt}
              onChange={(e) => update('featured_image_alt', e.target.value)}
              className={inputClass}
            />
            {fieldError('featured_image_alt') && (
              <p className="font-body text-sm text-red-600" role="alert">
                {fieldError('featured_image_alt')}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!values.title.trim()}
            aria-haspopup="dialog"
            onClick={() => setPreviewOpen(true)}
          >
            Preview
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSaving || isPublishing}>
            {isSaving ? 'Saving…' : 'Save draft'}
          </Button>
          {onPublish && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isSaving || isPublishing}
              onClick={() => onPublish(values)}
            >
              {isPublishing ? 'Publishing…' : 'Publish'}
            </Button>
          )}
          {onCancel && (
            <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <ArticleTemplatePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        values={values}
        authorName={authorName}
      />

      <ImageInsertDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        postId={postId}
        state={imageDialogState}
        onConfirm={handleImageConfirm}
        onDelete={handleImageDelete}
      />
    </>
  )
}

export function postToFormValues(post: BlogPost): BlogPostFormValues {
  return {
    title: post.title,
    slug: post.slug,
    summary: post.summary ?? '',
    body: post.body,
    category: post.category,
    series_collection: post.series_collection ?? '',
    article_template: post.article_template ?? DEFAULT_ARTICLE_TEMPLATE,
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    featured_image_url: post.featured_image_url ?? '',
    featured_image_alt: post.featured_image_alt ?? '',
    related_post_slugs: post.related_post_slugs ?? [],
    faq_text: post.faq_text ?? '',
  }
}
