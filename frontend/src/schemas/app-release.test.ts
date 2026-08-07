import { describe, expect, it } from 'vitest'
import { appReleaseSchema } from './app-release'

describe('appReleaseSchema', () => {
  it('accepts valid payload', () => {
    const result = appReleaseSchema.safeParse({
      version: '1.0.0',
      title: 'Rilis awal',
      body: 'Perbaikan dan fitur baru.',
      is_published: true,
      published_at: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid semver', () => {
    const result = appReleaseSchema.safeParse({
      version: 'v1',
      title: 'X',
      body: 'Y',
      is_published: false,
    })
    expect(result.success).toBe(false)
  })
})
