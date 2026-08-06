import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createAnnouncementSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(200),
    slug: z.string().max(250).optional(),
    content: z.string().min(1, t('validation.contentRequired')),
    priority: z.enum(['normal', 'important', 'urgent']).default('normal'),
    is_pinned: z.boolean().default(false),
    published_at: z.string().optional().nullable(),
    expires_at: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    cta_text: z.string().max(100).optional().nullable(),
    cta_url: z.string().max(500).url(t('validation.urlInvalid')).optional().nullable().or(z.literal('')),
  })
}

export const announcementSchema = createAnnouncementSchema(defaultAdminT)

export type AnnouncementFormValues = z.infer<ReturnType<typeof createAnnouncementSchema>>
