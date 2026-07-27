import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminImageField } from '@/components/admin/AdminImageField'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useAdminCourseDetail, useCreateCourse, useUpdateCourse } from '@/hooks/useCourses'
import { useSchool } from '@/hooks/useSchool'
import { slugify } from '@/lib/utils'

export function CourseFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminCourseDetail(numericId)
  const createItem = useCreateCourse()
  const updateItem = useUpdateCourse(numericId)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState('')
  const [durationMinutes, setDurationMinutes] = useState<number | ''>('')
  const [price, setPrice] = useState<number | ''>('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setSlug(existing.slug)
    setExcerpt(existing.excerpt ?? '')
    setDescription(existing.description ?? '')
    setThumbnail(existing.thumbnail ?? '')
    setCategory(existing.category ?? '')
    setLevel(existing.level ?? '')
    setDurationMinutes(existing.duration_minutes ?? '')
    setPrice(existing.price ?? '')
    setStatus((existing.status as 'draft' | 'published') ?? 'draft')
    setOrder(existing.order)
    setIsActive(existing.is_active)
    setIsFeatured(existing.is_featured)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    slug: slug || slugify(title),
    excerpt: excerpt || null,
    description: description || null,
    thumbnail: thumbnail || null,
    category: category || null,
    level: level || null,
    duration_minutes: durationMinutes === '' ? null : Number(durationMinutes),
    price: price === '' ? null : Number(price),
    status,
    order,
    is_active: isActive,
    is_featured: isFeatured,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/courses') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/courses') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.courses.editTitle') : t('pages.courses.createTitle')}
      backHref="/admin/courses"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/courses')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.title')}</Label>
            <Input id="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!isEdit) setSlug(slugify(e.target.value)) }} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">{t('form.slug')}</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">{t('form.excerpt')}</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('form.description')}</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
          </div>
          <AdminImageField label={t('form.thumbnail')} value={thumbnail} onChange={setThumbnail} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">{t('form.category')}</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">{t('form.courseLevel')}</Label>
              <Input id="level" value={level} onChange={(e) => setLevel(e.target.value)} className="h-11" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="duration">{t('form.duration')}</Label>
              <Input id="duration" type="number" min={0} value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value === '' ? '' : Number(e.target.value))} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">{t('form.price')}</Label>
              <Input id="price" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>{t('form.status')}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as 'draft' | 'published')}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t('form.draft')}</SelectItem>
                  <SelectItem value="published">{t('form.published')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">{t('form.order')}</Label>
            <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-11" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_active">{t('form.active')}</Label>
            <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_featured">{t('form.featured')}</Label>
            <Switch id="is_featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
