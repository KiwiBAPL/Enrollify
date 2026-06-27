import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  BlogPostForm,
  postToFormValues,
  type BlogPostFormValues,
} from '@/components/admin/blog/BlogPostForm'
import { ErrorBanner } from '@/components/admin/ErrorBanner'
import { ADMIN_BASE } from '@/lib/admin/constants'
import { formatStaffAuthorName, isPlaceholderAuthorName, resolveAuthorNameForCreate } from '@/lib/admin/profile'
import { isSlugAvailable } from '@/lib/blog'
import { sanitizeBlogHtml } from '@/lib/sanitize'
import {
  validateDraftSave,
  validatePublish,
  type ValidationIssue,
} from '@/lib/blog-validation'
import { useAdminPost, useBlogMutations } from '@/hooks/useBlog'
import { useStaffProfile } from '@/hooks/useStaffProfile'

export function AdminPostEditorPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id
  const navigate = useNavigate()
  const { data: post, isLoading } = useAdminPost(id)
  const { data: staffProfile } = useStaffProfile()
  const { create, update, publish } = useBlogMutations()
  const [issues, setIssues] = useState<ValidationIssue[]>([])
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const formValuesToPayload = (values: BlogPostFormValues) => ({
    title: values.title.trim(),
    slug: values.slug.trim(),
    summary: values.summary.trim() || null,
    body: sanitizeBlogHtml(values.body),
    category: values.category.trim(),
    series_collection: values.series_collection.trim() || null,
    article_template: values.article_template,
    meta_title: values.meta_title.trim(),
    meta_description: values.meta_description.trim(),
    featured_image_url: values.featured_image_url.trim() || null,
    featured_image_alt: values.featured_image_alt.trim() || null,
    related_post_slugs: values.related_post_slugs,
    faq_text: values.faq_text.trim() || null,
  })

  const buildUpdateInput = async (values: BlogPostFormValues) => {
    const payload = formValuesToPayload(values)
    if (post && isPlaceholderAuthorName(post.author_name)) {
      return {
        ...payload,
        author_name: await resolveAuthorNameForCreate(staffProfile),
      }
    }
    return payload
  }

  const handleSave = async (values: BlogPostFormValues) => {
    const draftIssues = validateDraftSave({
      title: values.title,
      slug: values.slug,
      article_template: values.article_template,
    })
    if (draftIssues.length > 0) {
      setIssues(draftIssues)
      return
    }

    const { data: available } = await isSlugAvailable(values.slug, id)
    if (available === false) {
      setIssues([{ field: 'slug', message: 'This slug is already in use.' }])
      return
    }

    setSaving(true)
    setIssues([])
    setError('')
    setMessage('')
    try {
      const payload = formValuesToPayload(values)
      if (isNew) {
        const created = await create.mutateAsync({
          ...payload,
          author_name: await resolveAuthorNameForCreate(staffProfile),
        })
        setMessage('Draft saved')
        navigate(`${ADMIN_BASE}/posts/${created.id}`, { replace: true })
      } else {
        await update.mutateAsync({ id: id!, input: await buildUpdateInput(values) })
        setMessage('Changes saved')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async (values: BlogPostFormValues) => {
    const publishIssues = validatePublish({
      ...formValuesToPayload(values),
      summary: values.summary,
    })
    if (publishIssues.length > 0) {
      setIssues(publishIssues)
      setError('Fix validation errors before publishing')
      return
    }

    const { data: available } = await isSlugAvailable(values.slug, id)
    if (available === false) {
      setIssues([{ field: 'slug', message: 'This slug is already in use.' }])
      return
    }

    setPublishing(true)
    setIssues([])
    setError('')
    setMessage('')
    try {
      const payload = formValuesToPayload(values)
      let postId = id

      if (isNew) {
        const created = await create.mutateAsync({
          ...payload,
          author_name: await resolveAuthorNameForCreate(staffProfile),
        })
        postId = created.id
      } else {
        await update.mutateAsync({ id: id!, input: await buildUpdateInput(values) })
      }

      await publish.mutateAsync(postId!)
      setMessage('Post published')
      navigate(`${ADMIN_BASE}/posts`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  if (!isNew && isLoading) {
    return <p className="font-body text-text-muted">Loading…</p>
  }

  if (!isNew && !post) {
    return (
      <p className="font-body text-red-600" role="alert">
        Post not found.
      </p>
    )
  }

  const authorName = isNew
    ? staffProfile
      ? formatStaffAuthorName(staffProfile) || undefined
      : undefined
    : post && isPlaceholderAuthorName(post.author_name) && staffProfile
      ? formatStaffAuthorName(staffProfile) || post.author_name
      : post?.author_name

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-accent-primary">
        {isNew ? 'New post' : 'Edit post'}
      </h1>

      {error && <ErrorBanner message={error} />}
      {message && (
        <div
          role="status"
          className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {message}
        </div>
      )}

      <BlogPostForm
        key={id ?? 'new'}
        postId={id}
        authorName={authorName}
        initialValues={post ? postToFormValues(post) : undefined}
        status={post?.status ?? 'draft'}
        validationIssues={issues}
        isSaving={saving}
        isPublishing={publishing}
        onSave={handleSave}
        onPublish={handlePublish}
        onCancel={() => navigate(`${ADMIN_BASE}/posts`)}
      />
    </div>
  )
}
