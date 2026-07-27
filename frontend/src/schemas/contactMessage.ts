import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createContactMessageSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    name: z.string().min(1, t('validation.nameRequired')).max(200),
    email: z.string().email(t('validation.emailInvalid')).max(200),
    phone: z.string().max(30).optional().nullable(),
    subject: z.string().min(1, t('validation.subjectRequired')).max(300),
    message: z.string().min(1, t('validation.messageRequired')).max(5000),
  })
}

export const contactMessageSchema = createContactMessageSchema(defaultAdminT)

export type ContactMessageFormValues = z.infer<ReturnType<typeof createContactMessageSchema>>
