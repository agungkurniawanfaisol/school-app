import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminEventsList, useDeleteEvent } from '@/hooks/useEvents'
import type { Event } from '@/hooks/useEvents'

export function EventsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const { data, isLoading, isFetching } = useAdminEventsList({ page, per_page: 15, search })
  const deleteItem = useDeleteEvent()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Agenda"
        description="Jadwal kegiatan dan acara sekolah"
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
          { key: 'title', header: 'Judul', cell: (item) => item.title },
          { key: 'event_date', header: 'Tanggal', cell: (item) => new Date(item.event_date).toLocaleDateString('id-ID') },
          { key: 'location', header: 'Lokasi', cell: (item) => item.location ?? '—' },
          { key: 'category', header: 'Kategori', cell: (item) => item.category.charAt(0).toUpperCase() + item.category.slice(1) },
          { key: 'status', header: 'Status', cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
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
