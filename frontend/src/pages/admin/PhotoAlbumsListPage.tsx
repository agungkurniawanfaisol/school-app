import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminPhotoAlbumsList, useDeletePhotoAlbum } from '@/hooks/usePhotoAlbums'
import type { PhotoAlbum } from '@/types'
import { useTranslation } from 'react-i18next'

export function PhotoAlbumsListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PhotoAlbum | null>(null)
  const { data, isLoading, isFetching } = useAdminPhotoAlbumsList({ page, per_page: 15, search })
  const deleteItem = useDeletePhotoAlbum()

  const formatDate = (date: string | null) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.photoAlbums.listTitle')}
        description={t('pages.photoAlbums.listDesc')}
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
        createHref="/admin/photo-albums/create"
        columns={[
          { key: 'title', header: t('table.title'), cell: (item) => item.title },
          { key: 'event_date', header: t('table.date'), cell: (item) => formatDate(item.event_date) },
          { key: 'photos_count', header: t('table.photoCount'), cell: (item) => item.photos_count ?? 0 },
          { key: 'status', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/photo-albums/${item.id}/edit`}
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
