import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminSchoolsList, useDeleteSchool } from '@/hooks/useSchool'
import type { School } from '@/types'

export function SchoolsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<School | null>(null)
  const { data, isLoading, isFetching } = useAdminSchoolsList({ page, per_page: 15, search })
  const deleteItem = useDeleteSchool()

  return (
    <>
      <AdminPaginatedTable
        title="Data Sekolah"
        description="Kelola profil dan informasi sekolah"
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
        createHref="/admin/schools/create"
        columns={[
          { key: 'name', header: 'Nama', cell: (item) => item.name },
          { key: 'city', header: 'Kota', cell: (item) => item.city ?? '—' },
          { key: 'active', header: 'Status', cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/schools/${item.id}/edit`}
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
