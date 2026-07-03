import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminHeroSlidersList, useDeleteHeroSlider } from '@/hooks/useHeroSliders'
import type { HeroSlider } from '@/types'

export function HeroSlidersListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<HeroSlider | null>(null)
  const { data, isLoading, isFetching } = useAdminHeroSlidersList({ page, per_page: 15, search })
  const deleteItem = useDeleteHeroSlider()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Hero Slider"
        description="Atur slide utama halaman beranda"
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
        createHref="/admin/hero-sliders/create"
        columns={[
          {
            key: 'image',
            header: 'Gambar',
            cell: (item) =>
              item.image ? (
                <img src={item.image} alt="" className="h-10 w-16 rounded object-cover" />
              ) : (
                '—'
              ),
          },
          { key: 'title', header: 'Judul', cell: (item) => item.title },
          { key: 'order', header: 'Urutan', cell: (item) => item.order },
          { key: 'active', header: 'Status', cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/hero-sliders/${item.id}/edit`}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />
      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus hero slider?"
        description={`"${deleteTarget?.title}" akan dihapus permanen.`}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteItem.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteItem.isPending}
      />
    </>
  )
}
