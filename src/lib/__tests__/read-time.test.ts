import { describe, expect, it } from 'vitest'
import { countWords, estimateReadTime, formatReadTime, stripHtml } from '@/lib/read-time'

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world')
  })
})

describe('countWords', () => {
  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
  })

  it('counts words in plain text', () => {
    expect(countWords('one two three')).toBe(3)
  })
})

describe('estimateReadTime', () => {
  it('returns minimum 1 minute for empty body', () => {
    expect(estimateReadTime('')).toBe(1)
  })

  it('estimates from HTML body at 200 WPM', () => {
    const words = Array(400).fill('word').join(' ')
    expect(estimateReadTime(`<p>${words}</p>`)).toBe(2)
  })
})

describe('formatReadTime', () => {
  it('formats minutes label', () => {
    expect(formatReadTime(5)).toBe('5 min read')
  })
})
