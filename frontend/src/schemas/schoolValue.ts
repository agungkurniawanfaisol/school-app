import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createSchoolValueSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    icon: z.string().max(100).optional().nullable(),
    title: z.string().min(1, t('validation.titleRequired')).max(100),
    description: z.string().min(1, t('validation.descriptionRequired')).max(500),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
  })
}

export const schoolValueSchema = createSchoolValueSchema(defaultAdminT)

export type SchoolValueFormValues = z.infer<ReturnType<typeof createSchoolValueSchema>>
