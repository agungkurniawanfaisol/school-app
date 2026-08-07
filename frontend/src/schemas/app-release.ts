import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createAppReleaseSchema(t: AdminTFunction) {
  return z.object({
    version: z
      .string()
      .min(1, t('validation.versionRequired'))
      .max(20)
      .regex(/^\d+\.\d+\.\d+$/, t('validation.versionSemver')),
    title: z.string().min(1, t('validation.titleRequired')).max(150),
    body: z.string().min(1, t('validation.bodyRequired')),
    published_at: z.string().nullable().optional(),
    is_published: z.boolean().default(false),
  })
}

export const appReleaseSchema = createAppReleaseSchema(defaultAdminT)

export type AppReleaseFormValues = z.infer<ReturnType<typeof createAppReleaseSchema>>
