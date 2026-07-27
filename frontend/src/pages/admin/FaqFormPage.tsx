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
  useAdminFaqDetail,
  useCreateFaq,
  useUpdateFaq,
} from '@/hooks/useFaqs'
import { useSchool } from '@/hooks/useSchool'

const faqCategories = ['pmb', 'akademik', 'biaya', 'umum'] as const

export function FaqFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminFaqDetail(numericId)
  const createItem = useCreateFaq()
  const updateItem = useUpdateFaq(numericId)

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState<string>('umum')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setQuestion(existing.question)
    setAnswer(existing.answer)
    setCategory(existing.category)
    setOrder(existing.order)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    question,
    answer,
    category: category as 'pmb' | 'akademik' | 'biaya' | 'umum',
    order,
    is_active: isActive,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/faqs') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/faqs') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.faqs.editTitle') : t('pages.faqs.createTitle')}
      backHref="/admin/faqs"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/faqs')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!question || !answer || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="question">{t('form.question')}</Label>
            <Input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">{t('form.answer')}</Label>
            <Textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">{t('form.category')}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t('form.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {faqCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`faqCategory.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
