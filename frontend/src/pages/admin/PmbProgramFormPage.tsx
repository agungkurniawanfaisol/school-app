import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  useAdminPmbProgramDetail,
  useCreatePmbProgram,
  useUpdatePmbProgram,
} from '@/hooks/usePmbPrograms'
import { useSchool } from '@/hooks/useSchool'
import { pmbProgramFormSchema } from '@/schemas/pmb-program'

export function PmbProgramFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminPmbProgramDetail(numericId)
  const createItem = useCreatePmbProgram()
  const updateItem = useUpdatePmbProgram(numericId)

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState('10')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setCode(existing.code)
    setName(existing.name)
    setSortOrder(String(existing.sort_order))
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) {
    return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>
  }

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    code: code.trim().toLowerCase(),
    name: name.trim(),
    sort_order: Number(sortOrder) || 0,
    is_active: isActive,
  }

  const parsed = isEdit
    ? pmbProgramFormSchema.omit({ code: true }).safeParse({ ...payload, code: undefined })
    : pmbProgramFormSchema.safeParse(payload)

  const handleSave = () => {
    if (!parsed.success) return
    if (isEdit) {
      updateItem.mutate(
        {
          school_id: payload.school_id,
          name: payload.name,
          sort_order: payload.sort_order,
          is_active: payload.is_active,
        },
        { onSuccess: () => navigate('/admin/pmb-programs') },
      )
      return
    }
    createItem.mutate(payload, { onSuccess: () => navigate('/admin/pmb-programs') })
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.pmbPrograms.editTitle') : t('pages.pmbPrograms.createTitle')}
      backHref="/admin/pmb-programs"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/pmb-programs')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!parsed.success}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="program_code">{t('form.programCode', { defaultValue: 'Kode program' })}</Label>
            <Input
              id="program_code"
              value={code}
              onChange={(e) => setCode(e.target.value.toLowerCase())}
              disabled={isEdit}
              placeholder="reguler"
              className="h-11 font-mono"
            />
            <p className="text-xs text-muted-foreground">
              {isEdit
                ? t('form.programCodeImmutable', { defaultValue: 'Kode tidak dapat diubah setelah dibuat.' })
                : t('form.programCodeHint', {
                    defaultValue: 'Huruf kecil, angka, dan tanda hubung. Contoh: reguler, icp, tahfidz.',
                  })}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="program_name">{t('form.programName', { defaultValue: 'Nama program' })}</Label>
            <Input
              id="program_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Reguler"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">{t('form.sortOrder', { defaultValue: 'Urutan' })}</Label>
            <Input
              id="sort_order"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="font-medium">{t('form.active', { defaultValue: 'Aktif' })}</p>
              <p className="text-sm text-muted-foreground">
                {t('form.programActiveHint', {
                  defaultValue: 'Program nonaktif tidak muncul di pilihan biaya PMB baru.',
                })}
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Aktif" />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
