import { z } from 'zod'

export const pmbRegisterSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  student_name: z.string().min(1, 'Nama siswa wajib diisi').max(200),
  birth_place: z.string().max(100).optional().nullable(),
  birth_date: z.string().optional().nullable(),
  gender: z.enum(['L', 'P']).optional().nullable(),
  parent_name: z.string().min(1, 'Nama orang tua wajib diisi').max(200),
  parent_phone: z.string().min(1, 'Nomor telepon wajib diisi').max(30),
  parent_email: z.string().email('Email tidak valid').optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  previous_school: z.string().max(250).optional().nullable(),
  grade_applied: z.string().min(1, 'Jenjang pendaftaran wajib diisi').max(50),
})

export type PmbRegisterFormValues = z.infer<typeof pmbRegisterSchema>

export const pmbTrackSchema = z.object({
  token: z.string().min(10, 'Token pelacakan wajib diisi'),
})

export type PmbTrackFormValues = z.infer<typeof pmbTrackSchema>
