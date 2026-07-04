import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminExtracurricularsList, useDeleteExtracurricular } from '@/hooks/useExtracurriculars'
import type { Extracurricular } from '@/hooks/useExtracurriculars'

export function ExtracurricularsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Extracurricular | null>(null)
  const { data, isLoading, isFetching } = useAdminExtracurricularsList({ page, per_page: 15, search })
  const deleteItem = useDeleteExtracurricular()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Ekstrakurikuler"
        description="Kegiatan ekstrakurikuler sekolah"
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
        createHref="/admin/extracurriculars/create"
        columns={[
          { key: 'name', header: 'Nama', cell: (item) => item.name },
          { key: 'category', header: 'Kategori', cell: (item) => item.category },
          { key: 'schedule', header: 'Jadwal', cell: (item) => item.schedule ?? '—' },
          { key: 'instructor', header: 'Pembina', cell: (item) => item.instructor ?? '—' },
          { key: 'status', header: 'Status', cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/extracurriculars/${item.id}/edit`}
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
