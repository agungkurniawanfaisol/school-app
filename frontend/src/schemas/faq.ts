import { z } from 'zod'

export const faqSchema = z.object({
    school_id: z.number().int().positive('Sekolah wajib dipilih'),
    question: z.string().min(1, 'Pertanyaan wajib diisi').max(500),
    answer: z.string().min(1, 'Jawaban wajib diisi'),
    category: z.enum(['pmb', 'akademik', 'biaya', 'umum']).default('umum'),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
})

export type FaqFormValues = z.infer<typeof faqSchema>
