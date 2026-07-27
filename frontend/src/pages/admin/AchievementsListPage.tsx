import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminAchievementsList, useDeleteAchievement } from '@/hooks/useAchievements'
import type { Achievement } from '@/hooks/useAchievements'
import { useTranslation } from 'react-i18next'

export function AchievementsListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null)
  const { data, isLoading, isFetching } = useAdminAchievementsList({ page, per_page: 15, search })
  const deleteItem = useDeleteAchievement()

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.achievements.listTitle')}
        description={t('pages.achievements.listDesc')}
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
          { key: 'title', header: t('table.title'), cell: (item) => item.title },
          { key: 'category', header: t('table.category'), cell: (item) => capitalize(item.category) },
          { key: 'level', header: t('table.level'), cell: (item) => capitalize(item.level) },
          { key: 'student_name', header: t('table.studentName'), cell: (item) => item.student_name ?? '—' },
          { key: 'year', header: t('table.year'), cell: (item) => item.year },
          { key: 'active', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
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
