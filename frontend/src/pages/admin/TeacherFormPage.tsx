import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Camera,
  ExternalLink,
  Facebook,
  ImagePlus,
  Instagram,
  Loader2,
  Save,
  Settings2,
  Star,
  UserRound,
  Youtube,
} from 'lucide-react'
import { RichPageEditor } from '@/components/editor/RichPageEditor'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminTeacherDetail,
  useCreateTeacher,
  useUpdateTeacher,
} from '@/hooks/useTeachers'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { useSchool } from '@/hooks/useSchool'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { saveTeacherPreviewDraft } from '@/lib/teacherPreviewDraft'
import { slugify } from '@/lib/utils'
import { EMPTY_EDITOR_DOC, type EditorDocument } from '@/schemas/editor'
import { teacherSchema, type TeacherFormValues } from '@/schemas/teacher'
import type { SocialMedia } from '@/types'

type SocialFields = Pick<SocialMedia, 'facebook' | 'instagram' | 'youtube'>

const EMPTY_SOCIAL: SocialFields = { facebook: '', instagram: '', youtube: '' }

function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="admin-stat-icon shrink-0">{icon}</div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 space-y-4 overflow-hidden">{children}</CardContent>
    </Card>
  )
}

function SwitchRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-primary/10 bg-muted/30 px-4 py-3">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export function TeacherFormPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const isEdit = !!uuid
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminTeacherDetail(uuid ?? '')
  const createTeacher = useCreateTeacher()
  const updateTeacher = useUpdateTeacher(uuid ?? '')
  const photoUpload = useMediaUpload('teachers')
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [bio, setBio] = useState('')
  const [photo, setPhoto] = useState('')
  const [email, setEmail] = useState('')
  const [socialMedia, setSocialMedia] = useState<SocialFields>(EMPTY_SOCIAL)
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [contentJson, setContentJson] = useState<EditorDocument>(EMPTY_EDITOR_DOC)
  const [contentHtml, setContentHtml] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  const markDirty = () => setIsDirty(true)
  useUnsavedChanges(isDirty)

  const buildPayload = (): TeacherFormValues => ({
    school_id: school?.id ?? existing?.school_id ?? 0,
    name,
    slug: slug || slugify(name),
    title: title || null,
    subject: subject || null,
    bio: bio || null,
    photo: photo || null,
    email: email || null,
    social_media: {
      facebook: socialMedia.facebook || null,
      instagram: socialMedia.instagram || null,
      youtube: socialMedia.youtube || null,
    },
    content: contentHtml || null,
    content_json: contentJson,
    is_active: isActive,
    is_featured: isFeatured,
    order,
  })

  const validatePayload = () => {
    const payload = buildPayload()
    const result = teacherSchema.safeParse(payload)
    if (!result.success) {
      const first = result.error.issues[0]
      toast.error(first?.message ?? 'Data tidak valid.')
      return null
    }
    return result.data
  }

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setSlug(existing.slug)
    setTitle(existing.title ?? '')
    setSubject(existing.subject ?? '')
    setBio(existing.bio ?? '')
    setPhoto(existing.photo ?? '')
    setEmail(existing.email ?? '')
    setSocialMedia({
      facebook: existing.social_media?.facebook ?? '',
      instagram: existing.social_media?.instagram ?? '',
      youtube: existing.social_media?.youtube ?? '',
    })
    setOrder(existing.order)
    setIsActive(existing.is_active)
    setIsFeatured(existing.is_featured)
    setContentJson((existing.content_json as EditorDocument) ?? EMPTY_EDITOR_DOC)
    setContentHtml(existing.content ?? '')
    setIsDirty(false)
  }, [existing])

  const handleSave = async (andPreview = false) => {
    const payload = validatePayload()
    if (!payload) return

    if (isEdit) {
      await updateTeacher.mutateAsync(payload)
      setIsDirty(false)
      if (andPreview) {
        openPreview()
        return
      }
      navigate(`/admin/teachers/${uuid}`)
      return
    }

    const created = await createTeacher.mutateAsync(payload)
    setIsDirty(false)
    if (andPreview) {
      saveTeacherPreviewDraft({
        uuid: created.uuid,
        name: created.name,
        title: created.title,
        subject: created.subject,
        bio: (created.bio ?? bio) || null,
        photo: created.photo,
        email: created.email,
        social_media: payload.social_media,
        content: payload.content,
        content_json: payload.content_json,
        is_active: created.is_active,
        is_featured: created.is_featured,
        returnTo: `/admin/teachers/${created.uuid}/edit`,
      })
      window.open('/admin/teachers/preview', '_blank', 'noopener,noreferrer')
      navigate(`/admin/teachers/${created.uuid}/edit`, { replace: true })
      return
    }
    navigate(`/admin/teachers/${created.uuid}/edit`, { replace: true })
  }

  const handlePhotoUpload = async (file: File) => {
    const media = await photoUpload.mutateAsync(file)
    setPhoto(media.url)
    markDirty()
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const updateSocial = (key: keyof SocialFields, value: string) => {
    setSocialMedia((prev) => ({ ...prev, [key]: value }))
    markDirty()
  }

  const openPreview = () => {
    saveTeacherPreviewDraft({
      uuid,
      name: name || 'Nama Guru',
      title: title || null,
      subject: subject || null,
      bio: bio || null,
      photo: photo || null,
      email: email || null,
      social_media: {
        facebook: socialMedia.facebook || undefined,
        instagram: socialMedia.instagram || undefined,
        youtube: socialMedia.youtube || undefined,
      },
      content: contentHtml || null,
      content_json: contentJson,
      is_active: isActive,
      is_featured: isFeatured,
      returnTo: isEdit ? `/admin/teachers/${uuid}/edit` : '/admin/teachers/create',
    })
    window.open('/admin/teachers/preview', '_blank', 'noopener,noreferrer')
  }

  const isSaving = createTeacher.isPending || updateTeacher.isPending
  const canSave = !!name.trim() && !!(school?.id ?? existing?.school_id)

  const previewTeacher = {
    name: name || 'Nama Guru',
    photo: photo || null,
    title: title || null,
    subject: subject || null,
    bio: bio || null,
  }

  const identityFields = (
    <SectionCard
      icon={<UserRound className="h-5 w-5" />}
      title="Identitas Guru"
      description="Nama dan informasi dasar yang tampil di profil."
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          Nama Lengkap <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            markDirty()
            if (!isEdit && !slug) setSlug(slugify(e.target.value))
          }}
          placeholder="Contoh: Ustadz Ahmad Fauzi"
          className="h-11"
          autoComplete="name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug URL</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            markDirty()
          }}
          placeholder="ustadz-ahmad-fauzi"
          className="h-11 font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">Digunakan di alamat halaman publik guru.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Gelar / Jabatan</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              markDirty()
            }}
            placeholder="Guru Mata Pelajaran"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Mata Pelajaran</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              markDirty()
            }}
            placeholder="Pendidikan Agama Islam"
            className="h-11"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Kontak</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            markDirty()
          }}
          placeholder="guru@nurulhikmah.sch.id"
          className="h-11"
        />
      </div>
    </SectionCard>
  )

  const photoField = (
    <SectionCard
      icon={<Camera className="h-5 w-5" />}
      title="Foto Profil"
      description="Foto persegi atau portrait, minimal 400×400 px."
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start lg:flex-col lg:items-stretch">
        <div className="relative mx-auto shrink-0 lg:mx-0">
          <TeacherAvatar teacher={previewTeacher} size="xl" className="h-36 w-36 rounded-2xl shadow-md" />
          {photoUpload.isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/70">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
            </div>
          )}
        </div>
        <div className="flex w-full min-w-0 flex-col gap-2">
          {photo ? (
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              disabled={photoUpload.isPending}
              onClick={() => photoInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" aria-hidden />
              Ganti Foto
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="min-h-11 w-full border-dashed"
              disabled={photoUpload.isPending}
              onClick={() => photoInputRef.current?.click()}
            >
              {photoUpload.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <ImagePlus className="h-4 w-4" aria-hidden />
              )}
              Unggah Foto Profil
            </Button>
          )}
          {photo && (
            <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setPhoto('')}>
              Hapus foto
            </Button>
          )}
          <Input
            placeholder="atau tempel URL foto"
            value={photo}
            onChange={(e) => {
              setPhoto(e.target.value)
              markDirty()
            }}
            className="h-11"
          />
        </div>
      </div>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Unggah foto profil guru"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handlePhotoUpload(file)
        }}
      />
    </SectionCard>
  )

  const socialFields = (
    <SectionCard
      icon={<Facebook className="h-5 w-5" />}
      title="Media Sosial"
      description="Tautan profil resmi guru (opsional)."
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4 text-muted-foreground" aria-hidden />
            Facebook
          </Label>
          <Input
            id="facebook"
            type="url"
            inputMode="url"
            value={socialMedia.facebook}
            onChange={(e) => updateSocial('facebook', e.target.value)}
            placeholder="https://facebook.com/..."
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-muted-foreground" aria-hidden />
            Instagram
          </Label>
          <Input
            id="instagram"
            type="url"
            inputMode="url"
            value={socialMedia.instagram}
            onChange={(e) => updateSocial('instagram', e.target.value)}
            placeholder="https://instagram.com/..."
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtube" className="flex items-center gap-2">
            <Youtube className="h-4 w-4 text-muted-foreground" aria-hidden />
            YouTube
          </Label>
          <Input
            id="youtube"
            type="url"
            inputMode="url"
            value={socialMedia.youtube}
            onChange={(e) => updateSocial('youtube', e.target.value)}
            placeholder="https://youtube.com/@..."
            className="h-11"
          />
        </div>
      </div>
    </SectionCard>
  )

  const settingsFields = (
    <SectionCard
      icon={<Settings2 className="h-5 w-5" />}
      title="Pengaturan Tampilan"
      description="Urutan dan visibilitas di situs."
    >
      <div className="space-y-2">
        <Label htmlFor="order">Urutan Tampil</Label>
        <Input
          id="order"
          type="number"
          min={0}
          inputMode="numeric"
          value={order}
          onChange={(e) => {
            setOrder(Number(e.target.value))
            markDirty()
          }}
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">Angka lebih kecil tampil lebih dulu di daftar guru.</p>
      </div>
      <Separator />
      <SwitchRow
        id="is_active"
        label="Status Aktif"
        description="Guru nonaktif tidak tampil di halaman publik."
        checked={isActive}
        onCheckedChange={(v) => {
          setIsActive(v)
          markDirty()
        }}
      />
      <SwitchRow
        id="is_featured"
        label="Tampilkan di Beranda"
        description="Guru unggulan ditampilkan di section guru beranda."
        checked={isFeatured}
        onCheckedChange={(v) => {
          setIsFeatured(v)
          markDirty()
        }}
      />
    </SectionCard>
  )

  const bioField = (
    <div className="space-y-2">
      <Label htmlFor="bio">Ringkasan Singkat</Label>
      <Textarea
        id="bio"
        value={bio}
        onChange={(e) => {
          setBio(e.target.value)
          markDirty()
        }}
        rows={3}
        placeholder="Deskripsi singkat untuk kartu guru di beranda (1–2 kalimat)"
        className="min-h-[88px] resize-y"
      />
      <p className="text-xs text-muted-foreground">
        Konten lengkap ditulis di editor di bawah. Ringkasan ini untuk kartu beranda.
      </p>
    </div>
  )

  const sidebarContent = (
    <div className="space-y-4">
      {identityFields}
      {photoField}
      {socialFields}
      {settingsFields}
    </div>
  )

  const editorContent = (
    <div className="space-y-4">
      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Konten Profil Lengkap</CardTitle>
          <CardDescription>
            Biografi, prestasi, dan informasi detail guru menggunakan editor visual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bioField}
          <RichPageEditor
            collection="teachers"
            value={contentJson}
            onChange={(json, html) => {
              setContentJson(json)
              setContentHtml(html)
              markDirty()
            }}
          />
        </CardContent>
      </Card>
    </div>
  )

  if (isEdit && isLoading) {
    return (
      <div className="admin-page admin-fade-in">
        <FormSkeleton />
      </div>
    )
  }

  return (
    <div className="admin-page admin-fade-in space-y-4 pb-24 lg:pb-8">
      <Card className="border-primary/10 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {isEdit ? 'Edit Profil' : 'Profil Baru'}
            </p>
            <h1 className="text-xl font-bold sm:text-2xl">{isEdit ? 'Edit Data Guru' : 'Tambah Guru'}</h1>
            <p className="text-sm text-muted-foreground">
              Lengkapi profil, foto, dan konten detail guru.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="min-h-11" asChild>
              <Link to={isEdit ? `/admin/teachers/${uuid}` : '/admin/teachers'}>Batal</Link>
            </Button>
            <Button type="button" variant="outline" className="min-h-11" onClick={openPreview}>
              <ExternalLink className="h-4 w-4" aria-hidden />
              Pratinjau
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="min-h-11"
              disabled={isSaving || !canSave}
              onClick={() => void handleSave(true)}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <ExternalLink className="h-4 w-4" aria-hidden />
              )}
              Simpan & Pratinjau
            </Button>
            <Button
              type="button"
              className="min-h-11"
              disabled={isSaving || !canSave}
              onClick={() => void handleSave(false)}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Save className="h-4 w-4" aria-hidden />
              )}
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-primary/10">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <TeacherAvatar teacher={previewTeacher} size="lg" className="h-20 w-20 rounded-2xl shadow-sm" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold">{previewTeacher.name}</h2>
              {isFeatured && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-gold text-gold" aria-hidden />
                  Unggulan
                </Badge>
              )}
              <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? 'Aktif' : 'Nonaktif'}</Badge>
            </div>
            {(title || subject) && (
              <p className="text-sm text-muted-foreground">
                {[title, subject].filter(Boolean).join(' · ')}
              </p>
            )}
            {bio && <p className="line-clamp-2 text-sm text-muted-foreground">{bio}</p>}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="lg:hidden">
        <TabsList className="grid h-11 w-full grid-cols-2">
          <TabsTrigger value="settings" className="min-h-10">
            Pengaturan
          </TabsTrigger>
          <TabsTrigger value="content" className="min-h-10">
            Konten
          </TabsTrigger>
        </TabsList>
        <TabsContent value="settings" className="mt-4 space-y-4">
          {sidebarContent}
        </TabsContent>
        <TabsContent value="content" className="mt-4">
          {editorContent}
        </TabsContent>
      </Tabs>

      <div className="hidden gap-6 lg:grid lg:grid-cols-[340px_1fr]">
        <div className="min-w-0">{sidebarContent}</div>
        <div className="min-w-0">{editorContent}</div>
      </div>

      <div className="admin-form-footer lg:hidden">
        <Button
          type="button"
          className="min-h-11 flex-1"
          disabled={isSaving || !canSave}
          onClick={() => void handleSave()}
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Simpan Data Guru
        </Button>
      </div>
    </div>
  )
}
