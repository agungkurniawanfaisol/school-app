import { z } from 'zod'

export const achievementSchema = z.object({
    school_id: z.number().int().positive('Sekolah wajib dipilih'),
    title: z.string().min(1, 'Judul wajib diisi').max(200),
    description: z.string().optional().nullable(),
    category: z.enum(['akademik', 'olahraga', 'seni', 'keagamaan', 'lainnya']).default('akademik'),
    level: z.enum(['sekolah', 'kecamatan', 'kota', 'provinsi', 'nasional', 'internasional']).default('sekolah'),
    student_name: z.string().max(200).optional().nullable(),
    year: z.number().int().min(2000).max(2100),
    image: z.string().max(500).optional().nullable(),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
})

export type AchievementFormValues = z.infer<typeof achievementSchema>
