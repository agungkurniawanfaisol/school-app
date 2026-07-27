import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  useAdminDocumentDetail,
  useCreateDocument,
  useUpdateDocument,
} from '@/hooks/useDocuments'
import { useSchool } from '@/hooks/useSchool'

type DocumentCategory = 'brosur' | 'formulir' | 'peraturan' | 'kalender' | 'lainnya'

export function DocumentFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminDocumentDetail(numericId)
  const createItem = useCreateDocument()
  const updateItem = useUpdateDocument(numericId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<DocumentCategory>('lainnya')
  const [fileUrl, setFileUrl] = useState('')
  const [fileType, setFileType] = useState('')
  const [fileSize, setFileSize] = useState<number | ''>('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setDescription(existing.description ?? '')
    setCategory(existing.category)
    setFileUrl(existing.file_url)
    setFileType(existing.file_type ?? '')
    setFileSize(existing.file_size ?? '')
    setOrder(existing.order)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    description: description || null,
    category,
    file_url: fileUrl,
    file_size: fileSize === '' ? null : Number(fileSize),
    file_type: fileType || null,
    order,
    is_active: isActive,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/documents') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/documents') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.documents.editTitle') : t('pages.documents.createTitle')}
      backHref="/admin/documents"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/documents')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !fileUrl || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.title')}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('form.description')}</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">{t('form.category')}</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory)}>
                <SelectTrigger id="category" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brosur">{t('documentCategory.brosur')}</SelectItem>
                  <SelectItem value="formulir">{t('documentCategory.formulir')}</SelectItem>
                  <SelectItem value="peraturan">{t('documentCategory.peraturan')}</SelectItem>
                  <SelectItem value="kalender">{t('documentCategory.kalender')}</SelectItem>
                  <SelectItem value="lainnya">{t('category.lainnya')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">{t('form.order')}</Label>
              <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file_url">{t('form.fileUrl')}</Label>
            <Input id="file_url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} className="h-11" />
            <p className="text-xs text-muted-foreground">{t('form.fileUrlHint')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="file_type">{t('form.fileType')}</Label>
              <Input id="file_type" value={fileType} onChange={(e) => setFileType(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file_size">{t('form.fileSize')}</Label>
              <Input id="file_size" type="number" min={0} value={fileSize} onChange={(e) => setFileSize(e.target.value === '' ? '' : Number(e.target.value))} className="h-11" />
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
