import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('index.html mobile viewport', () => {
  it('declares width=device-width so phones do not render as zoomed desktop', () => {
    const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8')
    expect(html).toMatch(/<meta\s+name="viewport"\s+content="width=device-width[^"]*"/)
  })
})
