import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ImageLightbox } from '@/components/ui/ImageLightbox'
import type { GuideBlock, GuideSection, GuideTextSegment } from '@/types/content'

const linkClassName =
  'text-accent-primary underline underline-offset-2 hover:text-text-secondary'

function renderSegment(segment: GuideTextSegment, key: number) {
  if (typeof segment === 'string') {
    return <Fragment key={key}>{segment}</Fragment>
  }

  switch (segment.type) {
    case 'strong':
      return <strong key={key}>{segment.text}</strong>
    case 'em':
      return <em key={key}>{segment.text}</em>
    case 'link':
      if (segment.external) {
        return (
          <a
            key={key}
            href={segment.href}
            className={linkClassName}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.label}
          </a>
        )
      }
      return (
        <Link key={key} to={segment.href} className={linkClassName}>
          {segment.label}
        </Link>
      )
  }
}

function renderSegments(segments: GuideTextSegment[]) {
  return segments.map((segment, index) => renderSegment(segment, index))
}

export function GuideParagraph({ segments }: { segments: GuideTextSegment[] }) {
  return <p className="m-0">{renderSegments(segments)}</p>
}

function isImageBlock(block: GuideBlock): block is Extract<GuideBlock, { type: 'image' }> {
  return block.type === 'image'
}

function renderBlock(block: GuideBlock, index: number) {
  switch (block.type) {
    case 'paragraph':
      return <p key={index}>{renderSegments(block.content)}</p>
    case 'list':
      return (
        <ul key={index}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderSegments(item)}</li>
          ))}
        </ul>
      )
    case 'subsection':
      return (
        <div key={index}>
          <h3 id={block.id}>{block.title}</h3>
          {block.blocks.map((childBlock, childIndex) => renderBlock(childBlock, childIndex))}
        </div>
      )
    case 'image':
      return null
  }
}

function splitBlocksAtImage(blocks: GuideBlock[]) {
  const imageIndex = blocks.findIndex(isImageBlock)
  if (imageIndex === -1) {
    return { beforeImage: blocks, imageBlock: null, afterImage: [] as GuideBlock[] }
  }

  const imageBlock = blocks[imageIndex]
  if (!isImageBlock(imageBlock)) {
    return { beforeImage: blocks, imageBlock: null, afterImage: [] as GuideBlock[] }
  }

  return {
    beforeImage: blocks.slice(0, imageIndex),
    imageBlock,
    afterImage: blocks.slice(imageIndex + 1),
  }
}

function GuideSectionBlock({ section }: { section: GuideSection }) {
  const { beforeImage, imageBlock, afterImage } = splitBlocksAtImage(section.blocks)

  return (
    <section id={section.id} className="scroll-mt-24">
      <h2>{section.title}</h2>
      {beforeImage.map((block, index) => renderBlock(block, index))}
      {imageBlock ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,340px)] lg:items-start">
          <div className="order-2 min-w-0 space-y-4 lg:order-1">
            {afterImage.map((block, index) => renderBlock(block, index))}
          </div>
          <aside className="order-1 lg:sticky lg:top-28 lg:order-2">
            <ImageLightbox
              src={imageBlock.src}
              alt={imageBlock.alt}
              hint="Tap to view larger map"
            />
          </aside>
        </div>
      ) : (
        beforeImage.map((block, index) => renderBlock(block, index))
      )}
    </section>
  )
}

interface GuideContentProps {
  sections: GuideSection[]
}

export function GuideContent({ sections }: GuideContentProps) {
  return (
    <div className="blog-body space-y-12">
      {sections.map((section) => (
        <GuideSectionBlock key={section.id} section={section} />
      ))}
    </div>
  )
}

interface GuideTableOfContentsProps {
  items: { id: string; label: string }[]
}

export function GuideTableOfContents({ items }: GuideTableOfContentsProps) {
  return (
    <nav aria-label="On this page" className="rounded-card border-2 border-accent-primary bg-background-secondary p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-text-secondary">On this page</h2>
      <ol className="m-0 list-decimal space-y-2 pl-5">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={linkClassName}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
