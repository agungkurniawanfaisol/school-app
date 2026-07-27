import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminEventsList, useDeleteEvent } from '@/hooks/useEvents'
import type { Event } from '@/hooks/useEvents'
import { useTranslation } from 'react-i18next'

export function EventsListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const { data, isLoading, isFetching } = useAdminEventsList({ page, per_page: 15, search })
  const deleteItem = useDeleteEvent()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.events.listTitle')}
        description={t('pages.events.listDesc')}
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
        createHref="/admin/events/create"
        columns={[
          { key: 'title', header: t('table.title'), cell: (item) => item.title },
          { key: 'event_date', header: t('table.date'), cell: (item) => new Date(item.event_date).toLocaleDateString('id-ID') },
          { key: 'location', header: t('table.location'), cell: (item) => item.location ?? '—' },
          { key: 'category', header: t('table.category'), cell: (item) => item.category.charAt(0).toUpperCase() + item.category.slice(1) },
          { key: 'status', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/events/${item.id}/edit`}
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
