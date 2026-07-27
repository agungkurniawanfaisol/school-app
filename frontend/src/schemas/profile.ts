import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export function createProfileAccountSchema(t: AdminTFunction) {
  return z
    .object({
      name: z.string().min(1, t('validation.nameRequired')).max(200),
      email: z.string().email(t('validation.emailInvalid')).max(150),
      password: z.string().optional().or(z.literal('')),
      password_confirmation: z.string().optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
      if (data.password && data.password.length > 0 && data.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.minLength', { min: 8 }),
          path: ['password'],
        })
      }
      if (data.password && data.password !== data.password_confirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.passwordMismatch'),
          path: ['password_confirmation'],
        })
      }
    })
}

export function createProfileSocialMediaSchema(t: AdminTFunction) {
  return z.object({
    facebook: z.string().max(500, t('validation.maxLength', { max: 500 })).optional().or(z.literal('')),
    instagram: z.string().max(500, t('validation.maxLength', { max: 500 })).optional().or(z.literal('')),
    youtube: z.string().max(500, t('validation.maxLength', { max: 500 })).optional().or(z.literal('')),
    tiktok: z.string().max(500, t('validation.maxLength', { max: 500 })).optional().or(z.literal('')),
    twitter: z.string().max(500, t('validation.maxLength', { max: 500 })).optional().or(z.literal('')),
  })
}

export function createProfileTeacherSchema(t: AdminTFunction) {
  return z.object({
    name: z.string().min(1, t('validation.nameRequired')).max(200),
    title: z.string().max(150).optional().or(z.literal('')),
    subject: z.string().max(150).optional().or(z.literal('')),
    bio: z.string().optional().or(z.literal('')),
    photo: z.string().max(500).optional().or(z.literal('')),
    email: z.string().max(150).optional().or(z.literal('')).refine(
      (val) => !val || z.string().email().safeParse(val).success,
      t('validation.emailInvalid'),
    ),
    social_media: createProfileSocialMediaSchema(t).optional(),
  })
}

export const profileAccountSchema = createProfileAccountSchema(defaultAdminT)
export const profileSocialMediaSchema = createProfileSocialMediaSchema(defaultAdminT)
export const profileTeacherSchema = createProfileTeacherSchema(defaultAdminT)

export type ProfileAccountValues = z.infer<ReturnType<typeof createProfileAccountSchema>>
export type ProfileTeacherValues = z.infer<ReturnType<typeof createProfileTeacherSchema>>
