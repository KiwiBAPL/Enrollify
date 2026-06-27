import { describe, expect, it } from 'vitest'
import { formatStaffAuthorName, isPlaceholderAuthorName } from '@/lib/admin/profile'
import { DEFAULT_AUTHOR_NAME } from '@/lib/site'

describe('formatStaffAuthorName', () => {
  it('joins first and last name', () => {
    expect(formatStaffAuthorName({ first_name: 'Jack', last_name: 'Smith' })).toBe('Jack Smith')
  })

  it('trims extra whitespace', () => {
    expect(formatStaffAuthorName({ first_name: ' Paul ', last_name: ' Benn ' })).toBe('Paul Benn')
  })

  it('returns empty string when both names are blank', () => {
    expect(formatStaffAuthorName({ first_name: '  ', last_name: '' })).toBe('')
  })

  it('handles first name only when last is empty', () => {
    expect(formatStaffAuthorName({ first_name: 'Jack', last_name: '' })).toBe('Jack')
  })
})

describe('isPlaceholderAuthorName', () => {
  it('recognises default site author name', () => {
    expect(isPlaceholderAuthorName(DEFAULT_AUTHOR_NAME)).toBe(true)
  })

  it('recognises bootstrap Admin User name', () => {
    expect(isPlaceholderAuthorName('Admin User')).toBe(true)
  })

  it('rejects real author names', () => {
    expect(isPlaceholderAuthorName('Paul Benn')).toBe(false)
  })

  it('trims whitespace before checking', () => {
    expect(isPlaceholderAuthorName(` ${DEFAULT_AUTHOR_NAME} `)).toBe(true)
  })
})
