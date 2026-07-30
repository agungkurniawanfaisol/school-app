import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  pmbEmailBroadcastSchema,
  pmbEmailSendSchema,
  type PmbEmailBroadcastFormValues,
  type PmbEmailSendFormValues,
} from '@/schemas/pmb-email'

type PmbEmailDialogMode = 'send' | 'broadcast'

interface PmbEmailDialogProps {
  mode: PmbEmailDialogMode
  open: boolean
  onOpenChange: (open: boolean) => void
  registrationUuids?: string[]
  recipientCount?: number
  isSubmitting?: boolean
  onSend: (values: PmbEmailSendFormValues) => void
  onBroadcast: (values: PmbEmailBroadcastFormValues) => void
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua status' },
  { value: 'draft', label: 'Draf' },
  { value: 'awaiting_verification', label: 'Menunggu verifikasi' },
  { value: 'needs_revision', label: 'Perlu perbaikan' },
  { value: 'accepted', label: 'Diterima' },
  { value: 'rejected', label: 'Ditolak' },
] as const

export function PmbEmailDialog({
  mode,
  open,
  onOpenChange,
  registrationUuids = [],
  recipientCount = 0,
  isSubmitting = false,
  onSend,
  onBroadcast,
}: PmbEmailDialogProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<PmbEmailBroadcastFormValues['status']>('all')
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setSubject('')
    setBody('')
    setStatus('all')
    setError(null)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm()
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = () => {
    if (mode === 'broadcast') {
      const parsed = pmbEmailBroadcastSchema.safeParse({ status, subject, body })
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? 'Data tidak valid.')
        return
      }
      setError(null)
      onBroadcast(parsed.data)
      return
    }

    const parsed = pmbEmailSendSchema.safeParse({
      registration_uuids: registrationUuids,
      subject,
      body,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Data tidak valid.')
      return
    }
    setError(null)
    onSend(parsed.data)
  }

  const canSubmit = subject.trim().length > 0 && body.trim().length > 0
    && (mode === 'broadcast' || registrationUuids.length > 0)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" aria-hidden />
            {mode === 'broadcast' ? 'Broadcast email PMB' : 'Kirim email'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'broadcast'
              ? 'Email dikirim ke semua pendaftar dengan Email Aktif 1 yang terisi.'
              : `Email akan dikirim ke Email Aktif 1 (${recipientCount || registrationUuids.length} penerima).`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'broadcast' ? (
            <div className="space-y-2">
              <Label htmlFor="pmb-email-status">Filter status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as PmbEmailBroadcastFormValues['status'])}>
                <SelectTrigger id="pmb-email-status" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="pmb-email-subject">Subjek</Label>
            <Input
              id="pmb-email-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Contoh: Pengumuman verifikasi PMB"
              className="min-h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pmb-email-body">Isi pesan</Label>
            <Textarea
              id="pmb-email-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={8}
              className="min-h-40 resize-y"
              placeholder={'Gunakan {student_name} atau {registration_number} untuk personalisasi.'}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" className="min-h-11" onClick={() => handleOpenChange(false)}>
            Batal
          </Button>
          <Button
            type="button"
            className="min-h-11 gap-2"
            disabled={!canSubmit || isSubmitting}
            onClick={handleSubmit}
          >
            <Mail className="h-4 w-4" aria-hidden />
            {isSubmitting ? 'Mengirim…' : 'Kirim email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
