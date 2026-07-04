import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminContactMessageDetail, useDeleteContactMessage } from '@/hooks/useContactMessages'

export function ContactMessageDetailPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: message, isLoading } = useAdminContactMessageDetail(numericId)
  const deleteItem = useDeleteContactMessage()

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!message) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Pesan tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/admin/contact-messages')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant={message.is_read ? 'secondary' : 'destructive'}>
            {message.is_read ? 'Sudah Dibaca' : 'Belum Dibaca'}
          </Badge>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              deleteItem.mutate(message.id, {
                onSuccess: () => navigate('/admin/contact-messages'),
              })
            }}
            disabled={deleteItem.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{message.subject}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nama</p>
              <p className="text-sm">{message.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{message.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telepon</p>
              <p className="text-sm">{message.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tanggal</p>
              <p className="text-sm">
                {new Date(message.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Isi Pesan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{message.message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
