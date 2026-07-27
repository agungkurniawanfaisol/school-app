import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createPmbRegisterSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    student_name: z.string().min(1, t('validation.studentNameRequired')).max(200),
    birth_place: z.string().max(100).optional().nullable(),
    birth_date: z.string().optional().nullable(),
    gender: z.enum(['L', 'P']).optional().nullable(),
    parent_name: z.string().min(1, t('validation.parentNameRequired')).max(200),
    parent_phone: z.string().min(1, t('validation.phoneRequired')).max(30),
    parent_email: z.string().email(t('validation.emailInvalid')).optional().nullable().or(z.literal('')),
    address: z.string().optional().nullable(),
    previous_school: z.string().max(250).optional().nullable(),
    grade_applied: z.string().min(1, t('validation.gradeRequired')).max(50),
  })
}

export function createPmbTrackSchema(t: AdminTFunction) {
  return z.object({
    token: z.string().min(10, t('validation.tokenRequired')),
  })
}

export function createPmbAdminUpdateSchema(_t: AdminTFunction) {
  return z.object({
    status: z.enum(['pending', 'review', 'accepted', 'rejected']),
    notes: z.string().optional().nullable(),
    grade_applied: z.string().max(50).optional().nullable(),
  })
}

export const pmbRegisterSchema = createPmbRegisterSchema(defaultAdminT)
export const pmbTrackSchema = createPmbTrackSchema(defaultAdminT)
export const pmbAdminUpdateSchema = createPmbAdminUpdateSchema(defaultAdminT)

export type PmbRegisterFormValues = z.infer<ReturnType<typeof createPmbRegisterSchema>>
export type PmbTrackFormValues = z.infer<ReturnType<typeof createPmbTrackSchema>>
export type PmbAdminUpdateFormValues = z.infer<ReturnType<typeof createPmbAdminUpdateSchema>>
