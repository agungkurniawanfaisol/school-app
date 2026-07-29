import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  useAdminAcademicYearDetail,
  useCreateAcademicYear,
  useUpdateAcademicYear,
} from '@/hooks/useAcademicYears'
import { useSchool } from '@/hooks/useSchool'
import { getAcademicYear } from '@/lib/academic-year'

export function AcademicYearFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminAcademicYearDetail(numericId)
  const createItem = useCreateAcademicYear()
  const updateItem = useUpdateAcademicYear(numericId)

  const [label, setLabel] = useState(() => getAcademicYear())
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!existing) return
    setLabel(existing.label)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    label,
    is_active: isActive,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/academic-years') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/academic-years') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.academicYears.editTitle') : t('pages.academicYears.createTitle')}
      backHref="/admin/academic-years"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/academic-years')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!label || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="label">{t('form.academicYearLabel')}</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="2026/2027"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">{t('form.academicYearHint')}</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="font-medium">{t('form.setActiveAcademicYear')}</p>
              <p className="text-sm text-muted-foreground">{t('form.setActiveAcademicYearHint')}</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} aria-label={t('form.setActiveAcademicYear')} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
