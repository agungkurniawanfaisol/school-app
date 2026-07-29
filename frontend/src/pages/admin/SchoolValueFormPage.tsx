import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useAdminSchoolValueDetail,
  useCreateSchoolValue,
  useUpdateSchoolValue,
} from '@/hooks/useSchoolValues'
import { useSchool } from '@/hooks/useSchool'
import { VALUE_ICON_OPTIONS } from '@/lib/lucide-icon-map'
import { schoolValueSchema } from '@/schemas/schoolValue'

export function SchoolValueFormPage() {
  const { t } = useTranslation('admin')
  const { uuid } = useParams<{ uuid: string }>()
  const isEdit = !!uuid
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminSchoolValueDetail(uuid ?? '')
  const createItem = useCreateSchoolValue()
  const updateItem = useUpdateSchoolValue(uuid ?? '')

  const [icon, setIcon] = useState('heart')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setIcon(existing.icon ?? 'heart')
    setTitle(existing.title)
    setDescription(existing.description)
    setOrder(existing.order)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const handleSave = () => {
    const payload = {
      school_id: school?.id ?? existing?.school_id ?? 0,
      icon: icon || null,
      title,
      description,
      order,
      is_active: isActive,
    }

    const result = schoolValueSchema.safeParse(payload)
    if (!result.success) {
      const first = result.error.issues[0]?.message
      toast.error(first ?? t('validation.checkForm'))
      return
    }

    if (isEdit) {
      updateItem.mutate(result.data, { onSuccess: () => navigate('/admin/nilai-kami') })
    } else {
      createItem.mutate(result.data, { onSuccess: () => navigate('/admin/nilai-kami') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.schoolValues.editTitle') : t('pages.schoolValues.createTitle')}
      backHref="/admin/nilai-kami"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/nilai-kami')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !description || !(school?.id ?? existing?.school_id)}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="icon">{t('form.icon')}</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger id="icon" className="h-11">
                <SelectValue placeholder={t('form.selectIcon')} />
              </SelectTrigger>
              <SelectContent>
                {VALUE_ICON_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" aria-hidden />
                        {option.label}
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.title')}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('form.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">{t('form.order')}</Label>
            <Input
              id="order"
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="h-11"
            />
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
