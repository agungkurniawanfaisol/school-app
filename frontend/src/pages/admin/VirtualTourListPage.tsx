import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminVirtualToursList, useDeleteVirtualTour } from '@/hooks/useVirtualTours'
import type { VirtualTour } from '@/types/virtualTour'

export function VirtualTourListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<VirtualTour | null>(null)
  const { data, isLoading, isFetching } = useAdminVirtualToursList({ page, per_page: 15, search })
  const deleteItem = useDeleteVirtualTour()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Tur Virtual"
        description="Unggah panorama 360° dan hubungkan lokasi dengan pin navigasi"
        data={data?.data}
        meta={data?.meta}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        createHref="/admin/virtual-tours/create"
        columns={[
          { key: 'title', header: 'Judul', cell: (item) => item.title },
          { key: 'slug', header: 'Slug', cell: (item) => item.slug },
          {
            key: 'scenes',
            header: 'Panorama',
            cell: (item) => item.scenes?.length ?? '—',
          },
          { key: 'order', header: 'Urutan', cell: (item) => item.order },
          { key: 'active', header: 'Status', cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/virtual-tours/${item.uuid}/edit`}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />
      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus tur virtual?"
        description={`"${deleteTarget?.title}" dan semua panoramanya akan dihapus permanen.`}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteItem.mutate(deleteTarget.uuid, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteItem.isPending}
      />
    </>
  )
}
