import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createAchievementSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(200),
    description: z.string().optional().nullable(),
    category: z.enum(['akademik', 'olahraga', 'seni', 'keagamaan', 'lainnya']).default('akademik'),
    level: z.enum(['sekolah', 'kecamatan', 'kota', 'provinsi', 'nasional', 'internasional']).default('sekolah'),
    student_name: z.string().max(200).optional().nullable(),
    year: z.number().int().min(2000).max(2100),
    image: z.string().max(500).optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
  })
}

export const achievementSchema = createAchievementSchema(defaultAdminT)

export type AchievementFormValues = z.infer<ReturnType<typeof createAchievementSchema>>
