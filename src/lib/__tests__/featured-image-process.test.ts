import { describe, expect, it } from 'vitest'
import {
  computeFeaturedImageDimensions,
  FEATURED_IMAGE_MAX_WIDTH,
} from '@/lib/featured-image-process'

describe('computeFeaturedImageDimensions', () => {
  it('returns original dimensions when width is within max', () => {
    expect(computeFeaturedImageDimensions(1024, 401)).toEqual({
      width: 1024,
      height: 401,
    })
  })

  it('returns original dimensions when width equals max', () => {
    expect(computeFeaturedImageDimensions(FEATURED_IMAGE_MAX_WIDTH, 800)).toEqual({
      width: FEATURED_IMAGE_MAX_WIDTH,
      height: 800,
    })
  })

  it('scales down proportionally when width exceeds max', () => {
    expect(computeFeaturedImageDimensions(2800, 800)).toEqual({
      width: 1400,
      height: 400,
    })
  })

  it('rounds height when scaling', () => {
    expect(computeFeaturedImageDimensions(2100, 401)).toEqual({
      width: 1400,
      height: 267,
    })
  })
})
