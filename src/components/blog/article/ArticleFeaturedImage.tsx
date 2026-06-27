interface ArticleFeaturedImageProps {
  url: string
  alt: string
}

export function ArticleFeaturedImage({ url, alt }: ArticleFeaturedImageProps) {
  return (
    <figure className="border-b border-gray-200 py-10">
      <img src={url} alt={alt} className="h-auto w-full rounded-card" loading="eager" />
    </figure>
  )
}
