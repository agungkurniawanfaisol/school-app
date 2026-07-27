import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createExtracurricularSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    name: z.string().min(1, t('validation.nameRequired')).max(200),
    description: z.string().optional().nullable(),
    category: z.enum(['olahraga', 'seni', 'akademik', 'keagamaan', 'lainnya']).default('lainnya'),
    schedule: z.string().max(200).optional().nullable(),
    instructor: z.string().max(200).optional().nullable(),
    image: z.string().max(500).optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
  })
}

export const extracurricularSchema = createExtracurricularSchema(defaultAdminT)

export type ExtracurricularFormValues = z.infer<ReturnType<typeof createExtracurricularSchema>>
