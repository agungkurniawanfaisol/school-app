import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminImageField } from '@/components/admin/AdminImageField'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  useAdminExtracurricularDetail,
  useCreateExtracurricular,
  useUpdateExtracurricular,
} from '@/hooks/useExtracurriculars'
import { useSchool } from '@/hooks/useSchool'

const CATEGORY_VALUES = ['olahraga', 'seni', 'akademik', 'keagamaan', 'lainnya'] as const

type ExtracurricularCategory = (typeof CATEGORY_VALUES)[number]

export function ExtracurricularFormPage() {
  const { t } = useTranslation('admin')
  const categoryOptions = useMemo(
    () => CATEGORY_VALUES.map((value) => ({ value, label: t(`category.${value}`) })),
    [t],
  )
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminExtracurricularDetail(numericId)
  const createItem = useCreateExtracurricular()
  const updateItem = useUpdateExtracurricular(numericId)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ExtracurricularCategory>('lainnya')
  const [schedule, setSchedule] = useState('')
  const [instructor, setInstructor] = useState('')
  const [image, setImage] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setDescription(existing.description ?? '')
    setCategory(existing.category as ExtracurricularCategory)
    setSchedule(existing.schedule ?? '')
    setInstructor(existing.instructor ?? '')
    setImage(existing.image ?? '')
    setOrder(existing.order)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    name,
    description: description || null,
    category,
    schedule: schedule || null,
    instructor: instructor || null,
    image: image || null,
    order,
    is_active: isActive,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/extracurriculars') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/extracurriculars') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.extracurriculars.editTitle') : t('pages.extracurriculars.createTitle')}
      backHref="/admin/extracurriculars"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/extracurriculars')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!name || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('form.name')}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('form.description')}</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">{t('form.category')}</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ExtracurricularCategory)}>
                <SelectTrigger id="category" className="h-11">
                  <SelectValue placeholder={t('form.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">{t('form.schedule')}</Label>
              <Input
                id="schedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder={t('form.schedulePlaceholder')}
                className="h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructor">{t('form.instructor')}</Label>
            <Input id="instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} className="h-11" />
          </div>
          <AdminImageField label={t('form.image')} value={image} onChange={setImage} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order">{t('form.order')}</Label>
              <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-11" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_active">{t('form.active')}</Label>
            <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
