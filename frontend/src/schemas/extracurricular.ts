import { z } from 'zod'

export const extracurricularSchema = z.object({
    school_id: z.number().int().positive('Sekolah wajib dipilih'),
    name: z.string().min(1, 'Nama wajib diisi').max(200),
    description: z.string().optional().nullable(),
    category: z.enum(['olahraga', 'seni', 'akademik', 'keagamaan', 'lainnya']).default('lainnya'),
    schedule: z.string().max(200).optional().nullable(),
    instructor: z.string().max(200).optional().nullable(),
    image: z.string().max(500).optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
})

export type ExtracurricularFormValues = z.infer<typeof extracurricularSchema>
