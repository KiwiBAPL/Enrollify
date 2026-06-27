import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  uploadBodyImage,
} from '@/lib/blog'
import {
  clampPadding,
  clampWidth,
  DEFAULT_BLOG_IMAGE_ALIGN,
  DEFAULT_BLOG_IMAGE_PADDING,
  DEFAULT_BLOG_IMAGE_WIDTH,
  MAX_BLOG_IMAGE_PADDING,
  MAX_BLOG_IMAGE_WIDTH,
  MIN_BLOG_IMAGE_PADDING,
  MIN_BLOG_IMAGE_WIDTH,
  normalizeImageLinkUrl,
  type BlogImageAlign,
  type BlogInlineImageOptions,
} from '@/lib/blog-image-html'

export interface ImageInsertDialogState {
  mode: 'insert' | 'edit'
  editIndex?: number
  initial?: Partial<BlogInlineImageOptions>
}

interface ImageInsertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId?: string
  state: ImageInsertDialogState | null
  onConfirm: (options: BlogInlineImageOptions, editIndex?: number) => void
  onDelete?: (editIndex: number, imageUrl: string) => void | Promise<void>
}

const emptyForm: BlogInlineImageOptions = {
  url: '',
  alt: '',
  align: DEFAULT_BLOG_IMAGE_ALIGN,
  width: DEFAULT_BLOG_IMAGE_WIDTH,
  padding: DEFAULT_BLOG_IMAGE_PADDING,
  linkUrl: '',
}

const inputClass =
  'w-full rounded-lg border-2 border-stroke-primary px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary'

export function ImageInsertDialog({
  open,
  onOpenChange,
  postId,
  state,
  onConfirm,
  onDelete,
}: ImageInsertDialogProps) {
  const [form, setForm] = useState<BlogInlineImageOptions>(emptyForm)
  const [sourceTab, setSourceTab] = useState<'upload' | 'url'>('upload')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = state?.mode === 'edit'
  const canUpload = Boolean(postId)

  useEffect(() => {
    if (!open) return
    setError(null)
    setUploading(false)
    setSourceTab('upload')
    setForm({
      ...emptyForm,
      ...state?.initial,
      width: clampWidth(state?.initial?.width ?? DEFAULT_BLOG_IMAGE_WIDTH),
      padding: clampPadding(state?.initial?.padding ?? DEFAULT_BLOG_IMAGE_PADDING),
      align: state?.initial?.align ?? DEFAULT_BLOG_IMAGE_ALIGN,
      linkUrl: state?.initial?.linkUrl ?? '',
    })
  }, [open, state])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  const updateField = <K extends keyof BlogInlineImageOptions>(
    field: K,
    value: BlogInlineImageOptions[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const processFile = useCallback(
    async (file: File) => {
      if (!postId) {
        setError('Save draft first to upload images.')
        return
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
        setError('Image must be JPEG, PNG, or WebP.')
        return
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setError('Image must be 2 MB or smaller.')
        return
      }

      setUploading(true)
      setError(null)
      const { data, error: uploadError } = await uploadBodyImage(postId, file)
      setUploading(false)

      if (uploadError) {
        setError(uploadError.message)
        return
      }
      if (data) {
        updateField('url', data)
      }
    },
    [postId],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void processFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void processFile(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.alt.trim()) {
      setError('Alt text is required.')
      return
    }
    if (!form.url.trim()) {
      setError('Add an image by uploading a file or entering a URL.')
      return
    }

    const linkResult = normalizeImageLinkUrl(form.linkUrl ?? '')
    if (!linkResult.ok) {
      setError(linkResult.error)
      return
    }

    onConfirm(
      {
        url: form.url.trim(),
        alt: form.alt.trim(),
        align: form.align,
        width: clampWidth(form.width),
        padding: clampPadding(form.padding),
        linkUrl: linkResult.url,
      },
      state?.editIndex,
    )
  }

  const handleDelete = () => {
    if (state?.editIndex === undefined || !onDelete) return
    void onDelete(state.editIndex, form.url.trim())
  }

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
        aria-labelledby="image-insert-title"
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg border-2 border-stroke-primary bg-white shadow-hard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <h3 id="image-insert-title" className="font-display text-lg font-bold">
              {isEdit ? 'Edit image' : 'Insert image'}
            </h3>
            <p className="mt-1 font-body text-sm text-text-muted">
              {isEdit
                ? 'Update alignment and size, or remove the image from this post.'
                : 'Upload an image or paste a URL, then set alignment and size.'}
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

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setSourceTab('upload')}
                className={`rounded-lg px-3 py-1.5 font-body text-sm ${
                  sourceTab === 'upload'
                    ? 'bg-accent-mint font-semibold text-stroke-primary'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setSourceTab('url')}
                className={`rounded-lg px-3 py-1.5 font-body text-sm ${
                  sourceTab === 'url'
                    ? 'bg-accent-mint font-semibold text-stroke-primary'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                URL
              </button>
            </div>

            {sourceTab === 'upload' ? (
              <div className="mb-4 space-y-3">
                {!canUpload ? (
                  <p className="font-body text-sm text-text-muted">
                    Save draft first to upload images.
                  </p>
                ) : (
                  <>
                    <div
                      role="button"
                      tabIndex={0}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        dragOver
                          ? 'border-accent-primary bg-accent-mint/30'
                          : 'border-gray-300 hover:border-accent-primary'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(true)
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          fileInputRef.current?.click()
                        }
                      }}
                    >
                      <p className="font-body text-sm font-semibold">
                        {uploading ? 'Uploading…' : 'Drop an image here or click to browse'}
                      </p>
                      <p className="font-body text-xs text-text-muted">
                        JPEG, PNG, or WebP — max 2 MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="mb-4 space-y-2">
                <label htmlFor="image-url" className="block text-sm font-semibold font-body">
                  Image URL
                </label>
                <input
                  id="image-url"
                  type="url"
                  placeholder="https://…"
                  value={form.url}
                  onChange={(e) => updateField('url', e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {form.url && (
              <div className="mb-4 rounded-lg border border-gray-200 bg-[var(--bg-primary)] p-2">
                <img
                  src={form.url}
                  alt={form.alt || 'Preview'}
                  className="mx-auto max-h-40 rounded object-contain"
                />
              </div>
            )}

            <div className="mb-4 space-y-2">
              <label htmlFor="image-alt" className="block text-sm font-semibold font-body">
                Alt text
              </label>
              <input
                id="image-alt"
                value={form.alt}
                onChange={(e) => updateField('alt', e.target.value)}
                placeholder="Describe the image for accessibility"
                required
                className={inputClass}
              />
            </div>

            <div className="mb-4 space-y-2">
              <label htmlFor="image-link-url" className="block text-sm font-semibold font-body">
                Link URL (optional)
              </label>
              <input
                id="image-link-url"
                type="url"
                value={form.linkUrl ?? ''}
                onChange={(e) => updateField('linkUrl', e.target.value)}
                placeholder="https://…"
                className={inputClass}
              />
              <p className="font-body text-xs text-text-muted">
                When set, readers can click the image to open this page in a new tab.
              </p>
            </div>

            <fieldset className="mb-4 space-y-2">
              <legend className="mb-2 text-sm font-semibold font-body">Alignment</legend>
              {(
                [
                  ['below', 'Below paragraph (full width block)'],
                  ['left', 'Left — text wraps on the right'],
                  ['right', 'Right — text wraps on the left'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex cursor-pointer items-center gap-2 font-body text-sm">
                  <input
                    type="radio"
                    name="image-align"
                    value={value}
                    checked={form.align === value}
                    onChange={() => updateField('align', value as BlogImageAlign)}
                    className="accent-[var(--accent-primary)]"
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="image-width" className="text-sm font-semibold font-body">
                  Width (%)
                </label>
                <input
                  id="image-width"
                  type="number"
                  min={MIN_BLOG_IMAGE_WIDTH}
                  max={MAX_BLOG_IMAGE_WIDTH}
                  value={form.width}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10)
                    if (!Number.isNaN(parsed)) updateField('width', clampWidth(parsed))
                  }}
                  className="w-20 rounded border-2 border-stroke-primary px-2 py-1 font-body text-sm"
                />
              </div>
              <input
                type="range"
                min={MIN_BLOG_IMAGE_WIDTH}
                max={MAX_BLOG_IMAGE_WIDTH}
                value={form.width}
                onChange={(e) => updateField('width', clampWidth(parseInt(e.target.value, 10)))}
                className="w-full accent-[var(--accent-primary)]"
              />
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="image-padding" className="text-sm font-semibold font-body">
                  Padding (px)
                </label>
                <input
                  id="image-padding"
                  type="number"
                  min={MIN_BLOG_IMAGE_PADDING}
                  max={MAX_BLOG_IMAGE_PADDING}
                  value={form.padding}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10)
                    if (!Number.isNaN(parsed)) updateField('padding', clampPadding(parsed))
                  }}
                  className="w-20 rounded border-2 border-stroke-primary px-2 py-1 font-body text-sm"
                />
              </div>
              <input
                type="range"
                min={MIN_BLOG_IMAGE_PADDING}
                max={MAX_BLOG_IMAGE_PADDING}
                value={form.padding}
                onChange={(e) =>
                  updateField('padding', clampPadding(parseInt(e.target.value, 10)))
                }
                className="w-full accent-[var(--accent-primary)]"
              />
            </div>

            {error && (
              <p className="font-body text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>

          <div
            className={`flex shrink-0 gap-2 border-t border-gray-200 px-4 py-3 ${
              isEdit && onDelete ? 'justify-between' : 'justify-end'
            }`}
          >
            {isEdit && onDelete && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDelete}
                disabled={uploading}
                className="!border-red-600 !text-red-600"
              >
                Remove image
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={uploading}>
                {isEdit ? 'Update image' : 'Insert image'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
