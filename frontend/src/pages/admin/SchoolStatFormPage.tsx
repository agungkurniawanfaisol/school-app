import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useAdminSchoolStatDetail,
  useCreateSchoolStat,
  useUpdateSchoolStat,
} from '@/hooks/useSchoolStats'
import { useSchool } from '@/hooks/useSchool'
import { VALUE_ICON_OPTIONS } from '@/lib/lucide-icon-map'
import { schoolStatSchema } from '@/schemas/schoolStat'

export function SchoolStatFormPage() {
  const { t } = useTranslation('admin')
  const { uuid } = useParams<{ uuid: string }>()
  const isEdit = !!uuid
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminSchoolStatDetail(uuid ?? '')
  const createItem = useCreateSchoolStat()
  const updateItem = useUpdateSchoolStat(uuid ?? '')

  const [icon, setIcon] = useState('graduation-cap')
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setIcon(existing.icon ?? 'graduation-cap')
    setLabel(existing.label)
    setValue(existing.value)
    setOrder(existing.order)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const handleSave = () => {
    const payload = {
      school_id: school?.id ?? existing?.school_id ?? 0,
      icon: icon || null,
      label,
      value,
      order,
      is_active: isActive,
    }

    const result = schoolStatSchema.safeParse(payload)
    if (!result.success) {
      const first = result.error.issues[0]?.message
      toast.error(first ?? t('validation.checkForm'))
      return
    }

    if (isEdit) {
      updateItem.mutate(result.data, { onSuccess: () => navigate('/admin/statistik-sekolah') })
    } else {
      createItem.mutate(result.data, { onSuccess: () => navigate('/admin/statistik-sekolah') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.schoolStats.editTitle') : t('pages.schoolStats.createTitle')}
      backHref="/admin/statistik-sekolah"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/statistik-sekolah')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!label || !value || !(school?.id ?? existing?.school_id)}
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
            <Label htmlFor="label">{t('form.label')}</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-11"
              maxLength={100}
              placeholder="Berdiri"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">{t('form.statValue')}</Label>
            <Input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-11"
              maxLength={50}
              placeholder="1998"
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
