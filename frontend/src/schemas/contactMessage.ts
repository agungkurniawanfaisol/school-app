import { z } from 'zod'

export const contactMessageSchema = z.object({
    school_id: z.number().int().positive('Sekolah wajib dipilih'),
    name: z.string().min(1, 'Nama wajib diisi').max(200),
    email: z.string().email('Email tidak valid').max(200),
    phone: z.string().max(30).optional().nullable(),
    subject: z.string().min(1, 'Subjek wajib diisi').max(300),
    message: z.string().min(1, 'Pesan wajib diisi').max(5000),
})

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>
