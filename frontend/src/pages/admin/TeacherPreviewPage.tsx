import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  Youtube,
} from 'lucide-react'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PreviewFrame } from '@/components/editor/PreviewFrame'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { readTeacherPreviewDraft } from '@/lib/teacherPreviewDraft'
import { useAdminTeacherDetail } from '@/hooks/useTeachers'
import type { SocialMedia } from '@/types'
import type { EditorDocument } from '@/schemas/editor'

interface PreviewData {
  name: string
  title?: string | null
  subject?: string | null
  bio?: string | null
  photo?: string | null
  email?: string | null
  social_media?: SocialMedia | null
  content?: string | null
  content_json?: EditorDocument | Record<string, unknown> | null
  is_active: boolean
  is_featured: boolean
  returnTo: string
  editHref?: string
}

function SocialLinks({ social }: { social: SocialMedia | null | undefined }) {
  if (!social) return null

  const links = [
    social.facebook && { href: social.facebook, label: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
    social.instagram && { href: social.instagram, label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
    social.youtube && { href: social.youtube, label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[]

  if (!links.length) return null

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Media Sosial</h2>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/10 px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:bg-muted/50"
          >
            {link.icon}
            {link.label}
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          </a>
        ))}
      </div>
    </div>
  )
}

function TeacherPreviewContent({ data }: { data: PreviewData }) {
  const hasContent = data.content_json || data.content

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {data.is_featured && <Badge>Unggulan</Badge>}
        {!data.is_active && <Badge variant="outline">Nonaktif</Badge>}
        {!data.is_active && (
          <span className="text-sm text-muted-foreground">Tidak tampil di halaman publik</span>
        )}
      </div>

      <div className="mb-8 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <TeacherAvatar
          teacher={{ name: data.name, photo: data.photo ?? null }}
          size="xl"
          className="h-36 w-36 rounded-2xl shadow-md"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="text-2xl font-bold sm:text-3xl">{data.name}</h2>
          {(data.title || data.subject) && (
            <p className="text-lg text-muted-foreground">
              {[data.title, data.subject].filter(Boolean).join(' · ')}
            </p>
          )}
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {data.email}
            </a>
          )}
        </div>
      </div>

      {data.bio && (
        <p className="mb-8 rounded-xl border border-primary/10 bg-muted/30 p-4 text-lg text-muted-foreground">
          {data.bio}
        </p>
      )}

      {hasContent && (
        <div className="mb-8">
          <BlockRenderer contentJson={data.content_json} contentHtml={data.content} />
        </div>
      )}

      <SocialLinks social={data.social_media} />
    </>
  )
}

export function TeacherPreviewPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const draft = readTeacherPreviewDraft()
  const preferDraft = !!draft && (!uuid || draft.uuid === uuid)
  const { data: teacher, isLoading } = useAdminTeacherDetail(preferDraft ? '' : (uuid ?? ''))

  if (!uuid) {
    if (!draft) {
      return (
        <PreviewFrame title="Pratinjau Guru">
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">Tidak ada data pratinjau. Buka pratinjau dari form tambah/edit guru.</p>
            <Button asChild variant="outline">
              <Link to="/admin/teachers">Kembali ke daftar guru</Link>
            </Button>
          </div>
        </PreviewFrame>
      )
    }

    return (
      <PreviewFrame
        title={draft.name}
        isDraft={!draft.is_active}
        toolbar={
          <Button asChild variant="outline" size="sm">
            <Link to={draft.returnTo}>Kembali ke form</Link>
          </Button>
        }
      >
        <TeacherPreviewContent data={draft} />
      </PreviewFrame>
    )
  }

  if (preferDraft && draft) {
    return (
      <PreviewFrame
        title={draft.name}
        isDraft={!draft.is_active}
        toolbar={
          <Button asChild variant="outline" size="sm">
            <Link to={draft.returnTo}>Kembali ke form</Link>
          </Button>
        }
      >
        <TeacherPreviewContent data={draft} />
      </PreviewFrame>
    )
  }

  if (isLoading || !teacher) {
    return (
      <PreviewFrame title="Memuat pratinjau…">
        <p className="text-muted-foreground">Memuat data guru…</p>
      </PreviewFrame>
    )
  }

  const previewData: PreviewData = {
    name: teacher.name,
    title: teacher.title,
    subject: teacher.subject,
    bio: teacher.bio,
    photo: teacher.photo,
    email: teacher.email,
    social_media: teacher.social_media,
    content: teacher.content,
    content_json: teacher.content_json,
    is_active: teacher.is_active,
    is_featured: teacher.is_featured,
    returnTo: `/admin/teachers/${teacher.uuid}/edit`,
    editHref: `/admin/teachers/${teacher.uuid}/edit`,
  }

  return (
    <PreviewFrame
      title={teacher.name}
      isDraft={!teacher.is_active}
      toolbar={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to={`/admin/teachers/${teacher.uuid}/edit`}>Edit</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/teachers">Daftar guru</Link>
          </Button>
        </>
      }
    >
      <TeacherPreviewContent data={previewData} />
    </PreviewFrame>
  )
}
