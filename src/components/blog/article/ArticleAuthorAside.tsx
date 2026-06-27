const DEFAULT_AUTHOR_BIO =
  'Enrollify helps international students explore courses, career pathways, visas and costs in New Zealand — with free guidance from local experts.'

interface ArticleAuthorAsideProps {
  authorName: string
  bio?: string
}

export function ArticleAuthorAside({
  authorName,
  bio = DEFAULT_AUTHOR_BIO,
}: ArticleAuthorAsideProps) {
  return (
    <aside aria-labelledby="article-author-heading">
      <p
        id="article-author-heading"
        className="mb-2 font-display text-xs font-medium uppercase tracking-wide text-text-muted"
      >
        Author
      </p>
      <p className="mb-2 font-display font-semibold text-text-primary">{authorName}</p>
      <p className="font-body text-sm leading-relaxed text-text-muted">{bio}</p>
    </aside>
  )
}
