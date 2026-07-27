import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminVirtualToursList, useDeleteVirtualTour } from '@/hooks/useVirtualTours'
import type { VirtualTour } from '@/types/virtualTour'
import { useTranslation } from 'react-i18next'

export function VirtualTourListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<VirtualTour | null>(null)
  const { data, isLoading, isFetching } = useAdminVirtualToursList({ page, per_page: 15, search })
  const deleteItem = useDeleteVirtualTour()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.virtualTour.listTitle')}
        description={t('pages.virtualTour.listDesc')}
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
          { key: 'title', header: t('table.title'), cell: (item) => item.title },
          { key: 'slug', header: t('table.slug'), cell: (item) => item.slug },
          {
            key: 'scenes',
            header: t('table.panorama'),
            cell: (item) => item.scenes?.length ?? '—',
          },
          { key: 'order', header: t('table.order'), cell: (item) => item.order },
          { key: 'active', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
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
        title={t('pages.virtualTour.deleteTitle')}
        description={t('pages.virtualTour.deleteDesc', { title: deleteTarget?.title ?? '' })}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteItem.mutate(deleteTarget.uuid, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteItem.isPending}
      />
    </>
  )
}
