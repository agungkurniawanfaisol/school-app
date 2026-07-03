import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge, AdminFeaturedBadge } from '@/components/admin/AdminStatusBadge'
import { Button } from '@/components/ui/button'
import { useAdminCurriculumsList, useDeleteCurriculum } from '@/hooks/useCurriculums'
import { resolveProgramIcon } from '@/lib/lucide-icon-map'
import type { Curriculum } from '@/types'

function ProgramThumbnail({ item }: { item: Curriculum }) {
  const Icon = resolveProgramIcon(item.icon)

  if (item.thumbnail) {
    return (
      <img
        src={item.thumbnail}
        alt=""
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
        loading="lazy"
      />
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-4 w-4" aria-hidden />
    </div>
  )
}

export function FeaturedProgramsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Curriculum | null>(null)
  const { data, isLoading, isFetching } = useAdminCurriculumsList({ page, per_page: 15, search })
  const deleteItem = useDeleteCurriculum()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Program Unggulan"
        description="Program pembelajaran yang ditampilkan di beranda sekolah"
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
        createHref="/admin/program-unggulan/create"
        columns={[
          {
            key: 'title',
            header: 'Program',
            cell: (item) => (
              <div className="flex items-center gap-3">
                <ProgramThumbnail item={item} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.title}</p>
                  {item.category && (
                    <p className="truncate text-xs capitalize text-muted-foreground">{item.category}</p>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: 'order',
            header: 'Urutan',
            cell: (item) => <span className="tabular-nums text-muted-foreground">{item.order}</span>,
          },
          {
            key: 'featured',
            header: 'Beranda',
            cell: (item) => <AdminFeaturedBadge isFeatured={item.is_featured} />,
          },
          {
            key: 'active',
            header: 'Status',
            cell: (item) => <AdminActiveBadge isActive={item.is_active} />,
          },
        ]}
        rowActions={(item) => (
          <div className="flex flex-wrap justify-end gap-1">
            <Button asChild size="sm" variant="ghost" className="min-h-11 min-w-11">
              <Link
                to={`/admin/program-unggulan/${item.id}/edit`}
                aria-label={`Edit ${item.title}`}
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="min-h-11 min-w-11 text-destructive hover:text-destructive"
              aria-label={`Hapus ${item.title}`}
              onClick={() => setDeleteTarget(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
        title="Hapus program unggulan?"
        description={
          deleteTarget
            ? `Program "${deleteTarget.title}" akan dihapus permanen.`
            : undefined
        }
      />
    </>
  )
}
