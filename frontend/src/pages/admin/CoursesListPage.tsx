import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers } from 'lucide-react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge, AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { Button } from '@/components/ui/button'
import { useAdminCoursesList, useDeleteCourse } from '@/hooks/useCourses'
import type { Course } from '@/types'

export function CoursesListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const { data, isLoading, isFetching } = useAdminCoursesList({ page, per_page: 15, search })
  const deleteItem = useDeleteCourse()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Kursus"
        description="Daftar kursus dan program pembelajaran"
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
        createHref="/admin/courses/create"
        columns={[
          { key: 'title', header: 'Judul', cell: (item) => item.title },
          { key: 'category', header: 'Kategori', cell: (item) => item.category ?? '—' },
          { key: 'status', header: 'Status', cell: (item) => <AdminStatusBadge status={item.status ?? 'draft'} /> },
          { key: 'active', header: 'Aktif', cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <div className="flex justify-end gap-1">
            <Button asChild size="icon" variant="ghost" className="h-9 w-9" title="Modul">
              <Link to={`/admin/courses/${item.id}/modules`} aria-label="Kelola modul">
                <Layers className="h-4 w-4" />
              </Link>
            </Button>
            <AdminSimpleRowActions
              editHref={`/admin/courses/${item.id}/edit`}
              onDelete={() => setDeleteTarget(item)}
            />
          </div>
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
