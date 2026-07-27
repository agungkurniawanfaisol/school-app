import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createEventSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    title: z.string().min(1, t('validation.titleRequired')).max(200),
    description: z.string().optional().nullable(),
    location: z.string().max(200).optional().nullable(),
    event_date: z.string().min(1, t('validation.eventDateRequired')),
    event_end_date: z.string().optional().nullable(),
    event_time: z.string().max(20).optional().nullable(),
    category: z.enum(['akademik', 'keagamaan', 'olahraga', 'umum']).default('umum'),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
  })
}

export const eventSchema = createEventSchema(defaultAdminT)

export type EventFormValues = z.infer<ReturnType<typeof createEventSchema>>
