import { z } from 'zod'

export const documentSchema = z.object({
    school_id: z.number().int().positive('Sekolah wajib dipilih'),
    title: z.string().min(1, 'Judul wajib diisi').max(200),
    description: z.string().optional().nullable(),
    category: z.enum(['brosur', 'formulir', 'peraturan', 'kalender', 'lainnya']).default('lainnya'),
    file_url: z.string().min(1, 'File wajib diunggah').max(500),
    file_size: z.number().int().min(0).optional().nullable(),
    file_type: z.string().max(50).optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
})

export type DocumentFormValues = z.infer<typeof documentSchema>
