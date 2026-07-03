import { describe, expect, it } from 'vitest'
import { buildQueryParams } from './queryConfig'

describe('buildQueryParams', () => {
  it('includes defined values', () => {
    expect(buildQueryParams({ page: 1, per_page: 15, featured: true })).toEqual({
      page: 1,
      per_page: 15,
      featured: true,
    })
  })

  it('strips undefined, null, and empty string values', () => {
    expect(
      buildQueryParams({
        page: 1,
        search: '',
        school_id: undefined,
        category: null,
      }),
    ).toEqual({ page: 1 })
  })
})
