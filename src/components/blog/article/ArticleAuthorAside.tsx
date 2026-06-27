const DEFAULT_AUTHOR_BIO =
  'EnRollifyEdu helps education providers recruit better-qualified international students with technology-enabled workflows and lower recruitment costs.'

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
