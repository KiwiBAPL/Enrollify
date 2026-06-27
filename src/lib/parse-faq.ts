export interface FaqItem {
  question: string
  answer: string
}

function isQuestionLine(text: string): boolean {
  const line = text.trim()
  return line.length > 0 && !line.includes('\n') && line.endsWith('?')
}

function nextNonBlankLineIndex(lines: string[], start: number): number {
  let j = start
  while (j < lines.length && !lines[j].trim()) j++
  return j
}

/**
 * Parse FAQ text from admin paste.
 *
 * Each line ending with ? starts a new question. Following non-question lines
 * form the answer until the next question line or end of text. Blank lines
 * between answer paragraphs are preserved; blank lines before the next question
 * end the current answer.
 */
export function parseFaqText(raw: string | null | undefined): FaqItem[] {
  if (!raw?.trim()) return []

  const lines = raw.split('\n')
  const items: FaqItem[] = []
  let i = 0

  while (i < lines.length) {
    i = nextNonBlankLineIndex(lines, i)
    if (i >= lines.length) break

    const question = lines[i].trim()
    if (!isQuestionLine(question)) {
      i++
      continue
    }
    i++

    const answerLines: string[] = []
    while (i < lines.length) {
      const trimmed = lines[i].trim()
      if (!trimmed) {
        const next = nextNonBlankLineIndex(lines, i + 1)
        if (next < lines.length && isQuestionLine(lines[next].trim())) {
          i = next
          break
        }
        if (answerLines.length > 0) answerLines.push('')
        i++
        continue
      }
      if (isQuestionLine(trimmed)) break
      answerLines.push(trimmed)
      i++
    }

    if (answerLines.length > 0) {
      items.push({ question, answer: answerLines.join('\n') })
    }
  }

  return items
}

/** Split answer text into paragraphs (double newlines within a block). */
export function splitFaqAnswerParagraphs(answer: string): string[] {
  return answer
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
