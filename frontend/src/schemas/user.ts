import { z } from 'zod'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

export const userRoleSchema = z.enum(['admin', 'guru', 'admin_pmb', 'pendaftar'])

function createUserBaseSchema(t: AdminTFunction) {
  return z.object({
    name: z.string().min(1, t('validation.nameRequired')).max(200),
    email: z.string().email(t('validation.emailInvalid')).max(150),
    password: z.string().optional().or(z.literal('')),
    password_confirmation: z.string().optional().or(z.literal('')),
    role: userRoleSchema,
    is_active: z.boolean(),
    teacher_id: z.number().nullable().optional(),
  })
}

function passwordMatchRefine(
  data: { password?: string; password_confirmation?: string },
  ctx: z.RefinementCtx,
  t: AdminTFunction,
  passwordRequired = false,
) {
  if (passwordRequired && !data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: t('validation.passwordRequired'),
      path: ['password'],
    })
  }
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
}

export function createUserFormSchema(t: AdminTFunction) {
  return createUserBaseSchema(t).superRefine((data, ctx) => {
    passwordMatchRefine(data, ctx, t, false)
  })
}

export function createCreateUserSchema(t: AdminTFunction) {
  return createUserBaseSchema(t)
    .extend({
      password: z.string().min(8, t('validation.minLength', { min: 8 })),
      password_confirmation: z.string().min(1, t('validation.passwordConfirmRequired')),
    })
    .superRefine((data, ctx) => {
      passwordMatchRefine(data, ctx, t, true)
    })
}

export const userFormSchema = createUserFormSchema(defaultAdminT)
export const createUserSchema = createCreateUserSchema(defaultAdminT)

export type UserFormValues = z.infer<ReturnType<typeof createUserBaseSchema>>
export type CreateUserFormValues = z.infer<ReturnType<typeof createCreateUserSchema>>
