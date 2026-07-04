import { z } from 'zod'
import { editorDocumentSchema } from '@/schemas/editor'

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

export const TEACHER_TYPES = ['kepala_sekolah', 'guru', 'staff'] as const
export type TeacherTypeValue = (typeof TEACHER_TYPES)[number]

export const TEACHER_TYPE_LABELS: Record<TeacherTypeValue, string> = {
  kepala_sekolah: 'Kepala Sekolah',
  guru: 'Guru',
  staff: 'Staff',
}

const teacherBaseSchema = z.object({
  school_id: z.number().int().positive('Sekolah wajib dipilih'),
  type: z.enum(TEACHER_TYPES).default('guru'),
  name: z.string().min(1, 'Nama wajib diisi').max(200),
  slug: z.string().min(1).max(270),
  title: z.string().max(150).optional().nullable(),
  subject: z.string().max(150).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  photo: z.string().max(500).optional().nullable(),
  email: z.string().email('Email tidak valid').optional().nullable().or(z.literal('')),
  social_media: socialMediaSchema.optional().nullable(),
  order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  ...contentFields,
})

export const teacherSchema = teacherBaseSchema

export const teacherUpdateSchema = teacherBaseSchema.partial().omit({ school_id: true })

export type TeacherFormValues = z.infer<typeof teacherBaseSchema>
