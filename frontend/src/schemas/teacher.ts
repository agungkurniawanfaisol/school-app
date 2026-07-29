import { z } from 'zod'
import { editorDocumentSchema } from '@/schemas/editor'
import type { AdminTFunction } from '@/lib/zod-i18n'
import { defaultAdminT } from '@/lib/zod-i18n'

const socialMediaSchema = z.object({
  facebook: z.string().max(500).optional().nullable(),
  instagram: z.string().max(500).optional().nullable(),
  youtube: z.string().max(500).optional().nullable(),
  tiktok: z.string().max(500).optional().nullable(),
  twitter: z.string().max(500).optional().nullable(),
})

const contentFields = {
  content: z.string().optional().nullable(),
  content_json: editorDocumentSchema.optional().nullable(),
}

export const TEACHER_TYPES = ['pimpinan_yayasan', 'kepala_sekolah', 'guru', 'staff'] as const
export type TeacherTypeValue = (typeof TEACHER_TYPES)[number]

// UI labels via i18n hooks; static ID labels for non-hook contexts
export const TEACHER_TYPE_LABELS: Record<TeacherTypeValue, string> = {
  pimpinan_yayasan: 'Pimpinan Yayasan',
  kepala_sekolah: 'Kepala Sekolah',
  guru: 'Guru',
  staff: 'Staff',
}

function createTeacherBaseSchema(t: AdminTFunction) {
  return z.object({
    school_id: z.number().int().positive(t('validation.schoolRequired')),
    type: z.enum(TEACHER_TYPES).default('guru'),
    name: z.string().min(1, t('validation.nameRequired')).max(200),
    slug: z.string().min(1).max(270),
    title: z.string().max(150).optional().nullable(),
    subject: z.string().max(150).optional().nullable(),
    bio: z.string().max(2000).optional().nullable(),
    photo: z.string().max(500).optional().nullable(),
    email: z.string().email(t('validation.emailInvalid')).optional().nullable().or(z.literal('')),
    social_media: socialMediaSchema.optional().nullable(),
    order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    ...contentFields,
  })
}

export function createTeacherSchema(t: AdminTFunction) {
  return createTeacherBaseSchema(t)
}

export function createTeacherUpdateSchema(t: AdminTFunction) {
  return createTeacherBaseSchema(t).partial().omit({ school_id: true })
}

export const teacherSchema = createTeacherSchema(defaultAdminT)
export const teacherUpdateSchema = createTeacherUpdateSchema(defaultAdminT)

export type TeacherFormValues = z.infer<ReturnType<typeof createTeacherSchema>>
