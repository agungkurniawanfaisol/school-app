import { Link, useParams } from 'react-router-dom'
import { ExternalLink, Facebook, Instagram, Mail, Share2, Youtube } from 'lucide-react'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { PageMeta } from '@/components/seo/PageMeta'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeacherDetail, useTeacherDetailByUuid } from '@/hooks/useTeachers'
import {
  buildTeacherSharePath,
  resolveMailto,
  resolveSocialHref,
  type SocialNetwork,
} from '@/lib/safe-url'
import { openWhatsAppShare } from '@/lib/share'
import type { SocialMedia, Teacher } from '@/types'

function SocialLinks({ social }: { social: SocialMedia | null }) {
  if (!social) return null

  const entries: { network: SocialNetwork; raw: string; label: string; icon: typeof Facebook }[] = []
  if (social.facebook) entries.push({ network: 'facebook', raw: social.facebook, label: 'Facebook', icon: Facebook })
  if (social.instagram) entries.push({ network: 'instagram', raw: social.instagram, label: 'Instagram', icon: Instagram })
  if (social.youtube) entries.push({ network: 'youtube', raw: social.youtube, label: 'YouTube', icon: Youtube })

  const links = entries
    .map((entry) => ({ ...entry, href: resolveSocialHref(entry.raw, entry.network) }))
    .filter((entry): entry is typeof entry & { href: string } => Boolean(entry.href))

  if (!links.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/10 px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:bg-muted/50"
        >
          <Icon className="h-4 w-4" aria-hidden />
          {label}
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        </a>
      ))}
    </div>
  )
}

function TeacherProfile({ teacher }: { teacher: Teacher }) {
  const sharePath = buildTeacherSharePath(teacher.uuid)
  const pageUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${sharePath}` : sharePath
  const mailto = teacher.email ? resolveMailto(teacher.email) : null
  const metaDescription = teacher.bio ?? `${teacher.name} — ${teacher.title ?? teacher.subject ?? 'Guru Nurul Hikmah'}`

  return (
    <PublicPageShell>
      <PageMeta title={teacher.name} description={metaDescription} />
      <SubpageHero
        title={teacher.name}
        subtitle={[teacher.title, teacher.subject].filter(Boolean).join(' · ') || undefined}
        backHref="/guru"
        backLabel="Semua guru"
      />
      <article className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-11 gap-2"
              onClick={() => openWhatsAppShare(`Kenali ${teacher.name}, guru di Nurul Hikmah`, pageUrl)}
            >
              <Share2 className="h-4 w-4" aria-hidden />
              Bagikan
            </Button>
          </div>

          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <TeacherAvatar teacher={teacher} size="xl" className="h-36 w-36 rounded-2xl shadow-md" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{teacher.name}</h2>
                {teacher.is_featured && <Badge>Unggulan</Badge>}
              </div>
              {(teacher.title || teacher.subject) && (
                <p className="text-lg text-muted-foreground">
                  {[teacher.title, teacher.subject].filter(Boolean).join(' · ')}
                </p>
              )}
              {mailto && (
                <a
                  href={mailto}
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  {teacher.email}
                </a>
              )}
              <SocialLinks social={teacher.social_media} />
            </div>
          </div>

          {teacher.bio && (
            <p className="rounded-xl border border-primary/10 bg-muted/30 p-5 text-lg leading-relaxed text-muted-foreground">
              {teacher.bio}
            </p>
          )}

          {(teacher.content_json || teacher.content) && (
            <BlockRenderer contentJson={teacher.content_json} contentHtml={teacher.content} />
          )}
        </div>
      </article>
    </PublicPageShell>
  )
}

export function TeacherPublicDetailPage() {
  const { slug, uuid } = useParams<{ slug?: string; uuid?: string }>()
  const bySlug = useTeacherDetail(slug ?? '')
  const byUuid = useTeacherDetailByUuid(uuid ?? '')

  const query = uuid ? byUuid : bySlug
  const { data: teacher, isLoading, isError } = query

  if (isLoading) {
    return (
      <PublicPageShell>
        <div className="container-page section-padding">
          <Skeleton className="mb-6 h-11 w-40" />
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Skeleton className="h-36 w-36 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        </div>
      </PublicPageShell>
    )
  }

  if (isError || !teacher) {
    return (
      <PublicPageShell>
        <div className="container-page section-padding text-center">
          <p className="text-muted-foreground">Profil guru tidak ditemukan.</p>
          <Button asChild className="mt-4 min-h-11">
            <Link to="/guru">Lihat semua guru</Link>
          </Button>
        </div>
      </PublicPageShell>
    )
  }

  return <TeacherProfile teacher={teacher} />
}
