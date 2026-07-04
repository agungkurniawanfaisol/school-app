import { describe, expect, it } from 'vitest'
import { faqSchema } from './faq'

describe('faqSchema', () => {
  it('accepts valid FAQ input', () => {
    const result = faqSchema.safeParse({
      school_id: 1,
      question: 'Bagaimana cara mendaftar?',
      answer: 'Pendaftaran dapat dilakukan secara online melalui website.',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty question', () => {
    const result = faqSchema.safeParse({
      school_id: 1,
      question: '',
      answer: 'Jawaban contoh.',
    })

    expect(result.success).toBe(false)
  })
})
