import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  ArrowLeft,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { TEACHER_TYPES, createTeacherSchema, type TeacherFormValues } from '@/schemas/teacher'
import { useTeacherTypeLabels } from '@/hooks/useTeacherTypeLabels'
import type { SocialMedia, TeacherType } from '@/types'

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
  const { t } = useTranslation('admin')
  const teacherTypeLabels = useTeacherTypeLabels()
  const teacherSchema = useMemo(() => createTeacherSchema(t), [t])
  const { uuid } = useParams<{ uuid: string }>()
  const isEdit = !!uuid
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminTeacherDetail(uuid ?? '')
  const createTeacher = useCreateTeacher()
  const updateTeacher = useUpdateTeacher(uuid ?? '')
  const photoUpload = useMediaUpload('teachers')
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [type, setType] = useState<TeacherType>('guru')
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
    type,
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
      toast.error(first?.message ?? t('validation.invalidData'))
      return null
    }
    return result.data
  }

  useEffect(() => {
    if (!existing) return
    setType(existing.type ?? 'guru')
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
        social_media: {
          facebook: payload.social_media?.facebook || undefined,
          instagram: payload.social_media?.instagram || undefined,
          youtube: payload.social_media?.youtube || undefined,
        },
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
      name: name || t('pages.teachers.form.defaultName'),
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
    name: name || t('pages.teachers.form.defaultName'),
    photo: photo || null,
    title: title || null,
    subject: subject || null,
    bio: bio || null,
  }

  const identityFields = (
    <SectionCard
      icon={<UserRound className="h-5 w-5" />}
      title={t('pages.teachers.form.identityTitle')}
      description={t('pages.teachers.form.identityDesc')}
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          {t('pages.teachers.form.fullName')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            markDirty()
            if (!isEdit && !slug) setSlug(slugify(e.target.value))
          }}
          placeholder={t('pages.teachers.form.namePlaceholder')}
          className="h-11"
          autoComplete="name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">{t('form.slugUrl')}</Label>
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
        <p className="text-xs text-muted-foreground">{t('pages.teachers.form.slugHint')}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">{t('form.type')}</Label>
        <Select
          value={type}
          onValueChange={(v) => {
            setType(v as TeacherType)
            markDirty()
          }}
        >
          <SelectTrigger id="type" className="h-11">
            <SelectValue placeholder={t('form.selectType')} />
          </SelectTrigger>
          <SelectContent>
            {TEACHER_TYPES.map((teacherType) => (
              <SelectItem key={teacherType} value={teacherType}>
                {teacherTypeLabels[teacherType]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('pages.teachers.form.typeHint')}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">{t('pages.teachers.form.position')}</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              markDirty()
            }}
            placeholder={t('pages.teachers.form.positionPlaceholder')}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">{t('form.subject')}</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              markDirty()
            }}
            placeholder={t('pages.teachers.form.subjectPlaceholder')}
            className="h-11"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t('pages.teachers.form.contactEmail')}</Label>
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
      title={t('pages.teachers.form.photoTitle')}
      description={t('pages.teachers.form.photoDesc')}
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
              {t('common.replacePhoto')}
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
              {t('pages.teachers.form.uploadPhoto')}
            </Button>
          )}
          {photo && (
            <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setPhoto('')}>
              {t('pages.teachers.form.removePhoto')}
            </Button>
          )}
          <Input
            placeholder={t('pages.teachers.form.photoUrlPlaceholder')}
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
        aria-label={t('form.uploadTeacherPhoto')}
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
      title={t('form.socialMedia')}
      description={t('pages.teachers.form.socialDesc')}
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
      title={t('pages.teachers.form.displaySettingsTitle')}
      description={t('pages.teachers.form.displaySettingsDesc')}
    >
      <div className="space-y-2">
        <Label htmlFor="order">{t('pages.teachers.form.displayOrder')}</Label>
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
        <p className="text-xs text-muted-foreground">{t('pages.teachers.form.displayOrderHint')}</p>
      </div>
      <Separator />
      <SwitchRow
        id="is_active"
        label={t('pages.teachers.form.activeStatus')}
        description={t('pages.teachers.form.activeStatusDesc')}
        checked={isActive}
        onCheckedChange={(v) => {
          setIsActive(v)
          markDirty()
        }}
      />
      <SwitchRow
        id="is_featured"
        label={t('pages.teachers.form.featuredHome')}
        description={t('pages.teachers.form.featuredHomeDesc')}
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
      <Label htmlFor="bio">{t('pages.teachers.form.bioSummary')}</Label>
      <Textarea
        id="bio"
        value={bio}
        onChange={(e) => {
          setBio(e.target.value)
          markDirty()
        }}
        rows={3}
        placeholder={t('pages.teachers.form.bioPlaceholder')}
        className="min-h-[88px] resize-y"
      />
      <p className="text-xs text-muted-foreground">
        {t('pages.teachers.form.bioHint')}
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
          <CardTitle className="text-base">{t('pages.teachers.form.fullProfileTitle')}</CardTitle>
          <CardDescription>
            {t('pages.teachers.form.fullProfileDesc')}
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
      <Button asChild variant="ghost" size="sm" className="min-h-11 -ml-2 gap-2 px-0 hover:bg-transparent">
        <Link to="/admin/teachers">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('pages.teachers.listTitle')}
        </Link>
      </Button>
      <Card className="border-primary/10 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {isEdit ? t('pages.teachers.form.editProfile') : t('pages.teachers.form.newProfile')}
            </p>
            <h1 className="text-xl font-bold sm:text-2xl">{isEdit ? t('pages.teachers.editTitle') : t('pages.teachers.createTitle')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('pages.teachers.form.formDesc')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="min-h-11" asChild>
              <Link to={isEdit ? `/admin/teachers/${uuid}` : '/admin/teachers'}>{t('common.cancel')}</Link>
            </Button>
            <Button type="button" variant="outline" className="min-h-11" onClick={openPreview}>
              <ExternalLink className="h-4 w-4" aria-hidden />
              {t('common.preview')}
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
              {t('common.save')} & {t('common.preview')}
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
              {t('common.save')}
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
                  {t('status.featured')}
                </Badge>
              )}
              <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? t('status.active') : t('status.inactive')}</Badge>
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
            {t('pages.teachers.form.settingsTab')}
          </TabsTrigger>
          <TabsTrigger value="content" className="min-h-10">
            {t('pages.teachers.form.contentTab')}
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
          {t('pages.teachers.form.saveTeacher')}
        </Button>
      </div>
    </div>
  )
}
