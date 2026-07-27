import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createTestimonialSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    name: z.string().min(1, t('validation.nameRequired')).max(150),
    role: z.string().max(150).optional().nullable(),
    content: z.string().min(1, t('validation.testimonialContentRequired')),
    photo: z.string().max(500).optional().nullable(),
    rating: z.number().int().min(1).max(5).optional().nullable(),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
  })
}

export const testimonialSchema = createTestimonialSchema(defaultAdminT)

export type TestimonialFormValues = z.infer<ReturnType<typeof createTestimonialSchema>>
