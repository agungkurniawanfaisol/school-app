import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Trash2 } from 'lucide-react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAdminContactMessagesList, useDeleteContactMessage } from '@/hooks/useContactMessages'
import type { ContactMessage } from '@/hooks/useContactMessages'
import { useTranslation } from 'react-i18next'

export function ContactMessagesListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null)

  const { data, isLoading, isFetching } = useAdminContactMessagesList({ page, per_page: 15, search })
  const deleteItem = useDeleteContactMessage()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.contact.listTitle')}
        description={t('pages.contact.listDesc')}
        data={data?.data}
        meta={data?.meta}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        columns={[
          {
            key: 'name',
            header: t('table.sender'),
            cell: (item) => item.name,
          },
          {
            key: 'email',
            header: t('table.email'),
            cell: (item) => item.email,
          },
          {
            key: 'subject',
            header: t('table.subject'),
            cell: (item) => item.subject,
          },
          {
            key: 'is_read',
            header: t('table.status'),
            cell: (item) => (
              <Badge variant={item.is_read ? 'secondary' : 'destructive'}>
                {item.is_read ? t('status.read') : t('status.unread')}
              </Badge>
            ),
          },
          {
            key: 'created_at',
            header: t('table.date'),
            cell: (item) => new Date(item.created_at).toLocaleDateString('id-ID'),
          },
        ]}
        rowActions={(item) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/admin/contact-messages/${item.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteTarget(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        onConfirm={() => {
          if (deleteTarget) {
            deleteItem.mutate(deleteTarget.id, {
              onSuccess: () => setDeleteTarget(null),
            })
          }
        }}
        isLoading={deleteItem.isPending}
        title={t('dialog.deleteMessageTitle')}
        description={t('dialog.deleteMessageDesc')}
      />
    </>
  )
}
