import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  Pencil,
  Power,
  Star,
  Trash2,
  Youtube,
} from 'lucide-react'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminTeacherDetail, useDeleteTeacher, useUpdateTeacher } from '@/hooks/useTeachers'
import type { SocialMedia } from '@/types'

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/10 px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:bg-muted/50"
    >
      {icon}
      <span>{label}</span>
      <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground" aria-hidden />
    </a>
  )
}

function SocialLinks({ social }: { social: SocialMedia | null }) {
  if (!social) return null

  const links = [
    social.facebook && { href: social.facebook, label: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
    social.instagram && { href: social.instagram, label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
    social.youtube && { href: social.youtube, label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[]

  if (!links.length) return null

  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Media Sosial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map((link) => (
          <SocialLink key={link.label} {...link} />
        ))}
      </CardContent>
    </Card>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-32" />
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
          <Skeleton className="h-32 w-32 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  )
}

export function AdminTeacherDetailPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const { data: teacher, isLoading, isError } = useAdminTeacherDetail(uuid ?? '')
  const updateTeacher = useUpdateTeacher(uuid ?? '')
  const deleteTeacher = useDeleteTeacher()

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (isError || !teacher) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">Guru tidak ditemukan.</p>
        <Button asChild variant="outline">
          <Link to="/admin/teachers">Kembali ke daftar</Link>
        </Button>
      </div>
    )
  }

  const hasContent = teacher.content_json || teacher.content

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" size="sm" className="min-h-11 -ml-2 gap-2 self-start">
          <Link to="/admin/teachers">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Kembali ke daftar guru
          </Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="min-h-11">
            <Link
              to={`/admin/teachers/${teacher.uuid}/preview`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
              Pratinjau
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-h-11">
            <Link to={`/admin/teachers/${teacher.uuid}/edit`}>
              <Pencil className="mr-2 h-4 w-4" aria-hidden />
              Edit
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11"
            disabled={updateTeacher.isPending}
            onClick={() => setToggleOpen(true)}
          >
            <Power className="mr-2 h-4 w-4" aria-hidden />
            {teacher.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="min-h-11"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" aria-hidden />
            Hapus
          </Button>
        </div>
      </div>

      {teacher.has_linked_user && (
        <Card className="border-amber-500/30 bg-amber-500/5 dark:border-amber-400/30 dark:bg-amber-400/10">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Guru ini terhubung dengan akun login. Menghapus profil akan melepas kaitan akun guru.
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/5 via-card to-card shadow-sm">
        <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
          <div className="relative shrink-0">
            <div className="overflow-hidden rounded-2xl border-2 border-primary/20 shadow-md">
              <TeacherAvatar teacher={teacher} size="xl" className="rounded-none" />
            </div>
            {teacher.is_featured && (
              <span className="absolute -right-2 -top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
                Unggulan
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge variant={teacher.is_active ? 'default' : 'secondary'}>
                {teacher.is_active ? 'Aktif' : 'Nonaktif'}
              </Badge>
              {teacher.subject && (
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                  {teacher.subject}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{teacher.name}</h1>
            {teacher.title && (
              <p className="mt-1 text-base text-muted-foreground">{teacher.title}</p>
            )}

            {teacher.email && (
              <a
                href={`mailto:${teacher.email}`}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {teacher.email}
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {teacher.bio && (
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-base">Ringkasan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{teacher.bio}</p>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-base">Profil Lengkap</CardTitle>
            </CardHeader>
            <CardContent>
              {hasContent ? (
                <BlockRenderer contentJson={teacher.content_json} contentHtml={teacher.content} />
              ) : (
                <p className="text-sm italic text-muted-foreground">Belum ada konten detail.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Slug</span>
                <span className="font-medium">{teacher.slug}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Urutan tampil</span>
                <span className="font-medium tabular-nums">{teacher.order}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Status unggulan</span>
                <span className="font-medium">{teacher.is_featured ? 'Ya' : 'Tidak'}</span>
              </div>
            </CardContent>
          </Card>

          <SocialLinks social={teacher.social_media} />

          {teacher.is_active && (
            <Button asChild variant="outline" className="w-full min-h-11">
              <a href="/#guru" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                Lihat di beranda
              </a>
            </Button>
          )}
        </div>
      </div>

      <Dialog open={toggleOpen} onOpenChange={setToggleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{teacher.is_active ? 'Nonaktifkan guru?' : 'Aktifkan guru?'}</DialogTitle>
            <DialogDescription>
              {teacher.is_active
                ? 'Guru tidak akan tampil di halaman publik. Data tetap tersimpan.'
                : 'Guru akan tampil kembali di situs publik.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleOpen(false)}>
              Batal
            </Button>
            <Button
              disabled={updateTeacher.isPending}
              onClick={async () => {
                await updateTeacher.mutateAsync({ is_active: !teacher.is_active })
                setToggleOpen(false)
              }}
            >
              {teacher.is_active ? 'Nonaktifkan' : 'Aktifkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus guru?</DialogTitle>
            <DialogDescription>
              Guru &quot;{teacher.name}&quot; akan dihapus permanen.
              {teacher.has_linked_user && ' Akun guru terkait akan dilepas dari profil ini.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleteTeacher.isPending}
              onClick={async () => {
                await deleteTeacher.mutateAsync(teacher.uuid)
                navigate('/admin/teachers')
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
