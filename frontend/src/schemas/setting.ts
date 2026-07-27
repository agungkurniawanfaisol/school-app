import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createSettingSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive().optional().nullable(),
    group: z.string().min(1, t('validation.groupRequired')).max(50),
    key: z.string().min(1, t('validation.keyRequired')).max(100),
    value: z.string().optional().nullable(),
    type: z.enum(['string', 'integer', 'boolean', 'json']).default('string'),
  })
}

export const settingSchema = createSettingSchema(defaultAdminT)

export type SettingFormValues = z.infer<ReturnType<typeof createSettingSchema>>
