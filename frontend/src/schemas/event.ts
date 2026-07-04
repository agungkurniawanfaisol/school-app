import { z } from 'zod'

export const eventSchema = z.object({
    school_id: z.number().int().positive('Sekolah wajib dipilih'),
    title: z.string().min(1, 'Judul wajib diisi').max(200),
    description: z.string().optional().nullable(),
    location: z.string().max(200).optional().nullable(),
    event_date: z.string().min(1, 'Tanggal acara wajib diisi'),
    event_end_date: z.string().optional().nullable(),
    event_time: z.string().max(20).optional().nullable(),
    category: z.enum(['akademik', 'keagamaan', 'olahraga', 'umum']).default('umum'),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
})

export type EventFormValues = z.infer<typeof eventSchema>
