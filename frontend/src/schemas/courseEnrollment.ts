import { z } from 'zod'

export const courseEnrollmentSchema = z.object({
  course_id: z.number().int().positive('Kursus wajib dipilih'),
  student_name: z.string().min(1, 'Nama siswa wajib diisi').max(200),
  student_email: z.string().email('Email tidak valid').max(150),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
  enrolled_at: z.string().optional().nullable(),
  completed_at: z.string().optional().nullable(),
})

export type CourseEnrollmentFormValues = z.infer<typeof courseEnrollmentSchema>
