import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">Memuat data...</p>

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
      title={isEdit ? 'Edit Kursus' : 'Tambah Kursus'}
      backHref="/admin/courses"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/courses')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!isEdit) setSlug(slugify(e.target.value)) }} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
          </div>
          <AdminImageField label="Thumbnail" value={thumbnail} onChange={setThumbnail} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input id="level" value={level} onChange={(e) => setLevel(e.target.value)} className="h-11" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="duration">Durasi (menit)</Label>
              <Input id="duration" type="number" min={0} value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value === '' ? '' : Number(e.target.value))} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Harga</Label>
              <Input id="price" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as 'draft' | 'published')}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draf</SelectItem>
                  <SelectItem value="published">Dipublikasikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Urutan</Label>
            <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-11" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_active">Aktif</Label>
            <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_featured">Unggulan</Label>
            <Switch id="is_featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
