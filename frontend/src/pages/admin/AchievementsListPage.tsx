import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminAchievementsList, useDeleteAchievement } from '@/hooks/useAchievements'
import type { Achievement } from '@/hooks/useAchievements'

export function AchievementsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null)
  const { data, isLoading, isFetching } = useAdminAchievementsList({ page, per_page: 15, search })
  const deleteItem = useDeleteAchievement()

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Prestasi"
        description="Pencapaian siswa dan sekolah"
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
        createHref="/admin/achievements/create"
        columns={[
          { key: 'title', header: 'Judul', cell: (item) => item.title },
          { key: 'category', header: 'Kategori', cell: (item) => capitalize(item.category) },
          { key: 'level', header: 'Tingkat', cell: (item) => capitalize(item.level) },
          { key: 'student_name', header: 'Nama Siswa', cell: (item) => item.student_name ?? '—' },
          { key: 'year', header: 'Tahun', cell: (item) => item.year },
          { key: 'active', header: 'Status', cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/achievements/${item.id}/edit`}
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
