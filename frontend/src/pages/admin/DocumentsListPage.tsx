import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminDocumentsList, useDeleteDocument } from '@/hooks/useDocuments'
import type { Document } from '@/types'

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const categoryLabel: Record<Document['category'], string> = {
  brosur: 'Brosur',
  formulir: 'Formulir',
  peraturan: 'Peraturan',
  kalender: 'Kalender',
  lainnya: 'Lainnya',
}

export function DocumentsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null)
  const { data, isLoading, isFetching } = useAdminDocumentsList({ page, per_page: 15, search })
  const deleteItem = useDeleteDocument()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Dokumen"
        description="Dokumen yang dapat diunduh pengunjung"
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
        createHref="/admin/documents/create"
        columns={[
          { key: 'title', header: 'Judul', cell: (item) => item.title },
          {
            key: 'category',
            header: 'Kategori',
            cell: (item) => categoryLabel[item.category],
          },
          {
            key: 'file_type',
            header: 'Tipe File',
            cell: (item) => item.file_type ?? '—',
          },
          {
            key: 'file_size',
            header: 'Ukuran',
            cell: (item) => formatFileSize(item.file_size),
          },
          {
            key: 'download_count',
            header: 'Unduhan',
            cell: (item) => item.download_count,
          },
          {
            key: 'active',
            header: 'Status',
            cell: (item) => <AdminActiveBadge isActive={item.is_active} />,
          },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/documents/${item.id}/edit`}
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
