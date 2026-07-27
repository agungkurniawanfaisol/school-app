import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createFaqSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    question: z.string().min(1, t('validation.questionRequired')).max(500),
    answer: z.string().min(1, t('validation.answerRequired')),
    category: z.enum(['pmb', 'akademik', 'biaya', 'umum']).default('umum'),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
  })
}

export const faqSchema = createFaqSchema(defaultAdminT)

export type FaqFormValues = z.infer<ReturnType<typeof createFaqSchema>>
