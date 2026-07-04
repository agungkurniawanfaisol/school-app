import { describe, expect, it } from 'vitest'
import { eventSchema } from './event'

describe('eventSchema', () => {
  it('accepts valid event input', () => {
    const result = eventSchema.safeParse({
      school_id: 1,
      title: 'Peringatan Isra Miraj',
      event_date: '2026-07-15',
      category: 'keagamaan',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty event_date', () => {
    const result = eventSchema.safeParse({
      school_id: 1,
      title: 'Peringatan Isra Miraj',
      event_date: '',
    })

    expect(result.success).toBe(false)
  })
})
