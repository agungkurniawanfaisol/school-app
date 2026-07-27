import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createDocumentSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(200),
    description: z.string().optional().nullable(),
    category: z.enum(['brosur', 'formulir', 'peraturan', 'kalender', 'lainnya']).default('lainnya'),
    file_url: z.string().min(1, t('validation.fileRequired')).max(500),
    file_size: z.number().int().min(0).optional().nullable(),
    file_type: z.string().max(50).optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
  })
}

export const documentSchema = createDocumentSchema(defaultAdminT)

export type DocumentFormValues = z.infer<ReturnType<typeof createDocumentSchema>>
