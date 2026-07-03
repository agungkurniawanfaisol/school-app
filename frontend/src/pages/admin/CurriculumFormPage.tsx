import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminImageField } from '@/components/admin/AdminImageField'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminCurriculumDetail,
  useCreateCurriculum,
  useUpdateCurriculum,
} from '@/hooks/useCurriculums'
import { useSchool } from '@/hooks/useSchool'
import { slugify } from '@/lib/utils'

export function CurriculumFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminCurriculumDetail(numericId)
  const createItem = useCreateCurriculum()
  const updateItem = useUpdateCurriculum(numericId)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [category, setCategory] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setSlug(existing.slug)
    setExcerpt(existing.excerpt ?? '')
    setContent(existing.content ?? '')
    setThumbnail(existing.thumbnail ?? '')
    setCategory(existing.category ?? '')
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
    content: content || null,
    thumbnail: thumbnail || null,
    category: category || null,
    order,
    is_active: isActive,
    is_featured: isFeatured,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/curriculums') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/curriculums') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? 'Edit Kurikulum' : 'Tambah Kurikulum'}
      backHref="/admin/curriculums"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/curriculums')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!isEdit) setSlug(slugify(e.target.value))
              }}
              className="h-11"
            />
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
            <Label htmlFor="content">Konten</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
          </div>
          <AdminImageField label="Thumbnail" value={thumbnail} onChange={setThumbnail} />
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11" />
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
