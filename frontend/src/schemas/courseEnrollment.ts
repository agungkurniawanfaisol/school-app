import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createCourseEnrollmentSchema(t: AdminTFunction) {
  return z.object({
    course_id: z.number().int().positive(t('validation.courseRequired')),
    student_name: z.string().min(1, t('validation.studentNameRequired')).max(200),
    student_email: z.string().email(t('validation.emailInvalid')).max(150),
    status: z.enum(['active', 'completed', 'cancelled']).default('active'),
    enrolled_at: z.string().optional().nullable(),
    completed_at: z.string().optional().nullable(),
  })
}

export const courseEnrollmentSchema = createCourseEnrollmentSchema(defaultAdminT)

export type CourseEnrollmentFormValues = z.infer<ReturnType<typeof createCourseEnrollmentSchema>>
