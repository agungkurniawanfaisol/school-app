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
  useAdminAchievementDetail,
  useCreateAchievement,
  useUpdateAchievement,
} from '@/hooks/useAchievements'
import { useSchool } from '@/hooks/useSchool'

const CATEGORY_VALUES = ['akademik', 'olahraga', 'seni', 'keagamaan', 'lainnya'] as const
const LEVEL_VALUES = ['sekolah', 'kecamatan', 'kota', 'provinsi', 'nasional', 'internasional'] as const

export function AchievementFormPage() {
  const { t } = useTranslation('admin')
  const categoryOptions = useMemo(
    () => CATEGORY_VALUES.map((value) => ({ value, label: t(`category.${value}`) })),
    [t],
  )
  const levelOptions = useMemo(
    () => LEVEL_VALUES.map((value) => ({ value, label: t(`level.${value}`) })),
    [t],
  )
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminAchievementDetail(numericId)
  const createItem = useCreateAchievement()
  const updateItem = useUpdateAchievement(numericId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('akademik')
  const [level, setLevel] = useState('sekolah')
  const [studentName, setStudentName] = useState('')
  const [year, setYear] = useState<number | ''>(new Date().getFullYear())
  const [image, setImage] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setDescription(existing.description ?? '')
    setCategory(existing.category)
    setLevel(existing.level)
    setStudentName(existing.student_name ?? '')
    setYear(existing.year)
    setImage(existing.image ?? '')
    setOrder(existing.order)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    description: description || null,
    category: category as 'akademik' | 'olahraga' | 'seni' | 'keagamaan' | 'lainnya',
    level: level as 'sekolah' | 'kecamatan' | 'kota' | 'provinsi' | 'nasional' | 'internasional',
    student_name: studentName || null,
    year: year === '' ? new Date().getFullYear() : Number(year),
    image: image || null,
    order,
    is_active: isActive,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/achievements') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/achievements') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.achievements.editTitle') : t('pages.achievements.createTitle')}
      backHref="/admin/achievements"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/achievements')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !year || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.title')}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('form.description')}</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">{t('form.category')}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">{t('form.level')}</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger id="level" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="student_name">{t('form.studentName')}</Label>
              <Input id="student_name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">{t('form.year')}</Label>
              <Input
                id="year"
                type="number"
                min={2000}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))}
                className="h-11"
              />
            </div>
          </div>
          <AdminImageField label={t('form.image')} value={image} onChange={setImage} />
          <div className="space-y-2">
            <Label htmlFor="order">{t('form.order')}</Label>
            <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-11" />
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
