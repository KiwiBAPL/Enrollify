/** Strip markdown, citations, and URLs so replies render cleanly in the plain-text chat widget. */
export function formatChatReply(text: string): string {
  let result = text

  // Markdown links: [label](url) → label
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  // Bare URLs
  result = result.replace(/https?:\/\/\S+/g, '')

  // Citation markers: [1], [1][4], etc.
  result = result.replace(/(\[\d+\])+/g, '')

  // Bold / italic
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1')
  result = result.replace(/\*([^*]+)\*/g, '$1')
  result = result.replace(/__([^_]+)__/g, '$1')
  result = result.replace(/_([^_]+)_/g, '$1')

  // Headings: # Heading → Heading
  result = result.replace(/^#{1,6}\s+/gm, '')

  // List prefixes → plain lines
  result = result.replace(/^[\s]*[-*+]\s+/gm, '')
  result = result.replace(/^[\s]*\d+\.\s+/gm, '')

  // Collapse excessive blank lines and trim
  result = result.replace(/\n{3,}/g, '\n\n').trim()

  return result
}
