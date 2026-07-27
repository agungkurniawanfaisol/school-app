import { useState } from 'react'
import { Pin } from 'lucide-react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { Badge } from '@/components/ui/badge'
import { useAdminAnnouncementsList, useDeleteAnnouncement } from '@/hooks/useAnnouncements'
import type { Announcement } from '@/types'
import { useTranslation } from 'react-i18next'

const priorityKeys: Record<Announcement['priority'], string> = {
  normal: 'status.normal',
  important: 'status.important',
  urgent: 'status.urgent',
}

const priorityVariant: Record<Announcement['priority'], 'secondary' | 'default' | 'destructive'> = {
  normal: 'secondary',
  important: 'default',
  urgent: 'destructive',
}

export function AnnouncementsListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null)
  const { data, isLoading, isFetching } = useAdminAnnouncementsList({ page, per_page: 15, search })
  const deleteItem = useDeleteAnnouncement()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.announcements.listTitle')}
        description={t('pages.announcements.listDesc')}
        data={data?.data}
        meta={data?.meta}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        createHref="/admin/announcements/create"
        columns={[
          { key: 'title', header: t('table.title'), cell: (item) => item.title },
          {
            key: 'priority',
            header: t('table.priority'),
            cell: (item) => (
              <Badge variant={priorityVariant[item.priority]}>
                {t(priorityKeys[item.priority])}
              </Badge>
            ),
          },
          {
            key: 'is_pinned',
            header: t('table.pinned'),
            cell: (item) =>
              item.is_pinned ? <Pin className="h-4 w-4 text-primary" /> : '—',
          },
          { key: 'active', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/announcements/${item.id}/edit`}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />
      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteItem.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteItem.isPending}
      />
    </>
  )
}
