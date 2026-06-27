const WORDS_PER_MINUTE = 200;

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function estimateReadTime(html: string, wpm = WORDS_PER_MINUTE): number {
  const words = countWords(stripHtml(html));
  return Math.max(1, Math.ceil(words / wpm));
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}
