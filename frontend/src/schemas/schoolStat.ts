import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createSchoolStatSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    icon: z.string().max(100).optional().nullable(),
    label: z.string().min(1, t('validation.labelRequired')).max(100),
    value: z.string().min(1, t('validation.valueRequired')).max(50),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
  })
}

export const schoolStatSchema = createSchoolStatSchema(defaultAdminT)

export type SchoolStatFormValues = z.infer<ReturnType<typeof createSchoolStatSchema>>
