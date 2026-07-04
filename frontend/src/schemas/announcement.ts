import { z } from 'zod'

export const announcementSchema = z.object({
    school_id: z.number().int().positive('Sekolah wajib dipilih'),
    title: z.string().min(1, 'Judul wajib diisi').max(200),
    slug: z.string().max(250).optional().nullable(),
    content: z.string().min(1, 'Konten wajib diisi'),
    priority: z.enum(['normal', 'important', 'urgent']).default('normal'),
    is_pinned: z.boolean().default(false),
    published_at: z.string().optional().nullable(),
    expires_at: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    cta_text: z.string().max(100).optional().nullable(),
    cta_url: z.string().max(500).url('URL tidak valid').optional().nullable().or(z.literal('')),
})

export type AnnouncementFormValues = z.infer<typeof announcementSchema>
