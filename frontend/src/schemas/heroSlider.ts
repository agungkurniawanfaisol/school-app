import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createHeroSliderSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(250),
    subtitle: z.string().max(500).optional().nullable(),
    image: z.string().min(1, t('validation.imageRequired')).max(500),
    cta_text: z.string().max(100).optional().nullable(),
    cta_url: z.string().max(500).optional().nullable(),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
  })
}

export const heroSliderSchema = createHeroSliderSchema(defaultAdminT)

export type HeroSliderFormValues = z.infer<ReturnType<typeof createHeroSliderSchema>>
