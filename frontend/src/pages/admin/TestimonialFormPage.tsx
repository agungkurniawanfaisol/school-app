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
  useAdminTestimonialDetail,
  useCreateTestimonial,
  useUpdateTestimonial,
} from '@/hooks/useTestimonials'
import { useSchool } from '@/hooks/useSchool'

export function TestimonialFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminTestimonialDetail(numericId)
  const createItem = useCreateTestimonial()
  const updateItem = useUpdateTestimonial(numericId)

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [content, setContent] = useState('')
  const [photo, setPhoto] = useState('')
  const [rating, setRating] = useState<number | ''>('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setRole(existing.role ?? '')
    setContent(existing.content)
    setPhoto(existing.photo ?? '')
    setRating(existing.rating ?? '')
    setOrder(existing.order)
    setIsActive(existing.is_active)
    setIsFeatured(existing.is_featured)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">Memuat data...</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    name,
    role: role || null,
    content,
    photo: photo || null,
    rating: rating === '' ? null : Number(rating),
    order,
    is_active: isActive,
    is_featured: isFeatured,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/testimonials') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/testimonials') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? 'Edit Testimoni' : 'Tambah Testimoni'}
      backHref="/admin/testimonials"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/testimonials')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!name || !content || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Peran</Label>
              <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Isi Testimoni</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
          </div>
          <AdminImageField label="Foto" value={photo} onChange={setPhoto} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Urutan</Label>
              <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-11" />
            </div>
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
