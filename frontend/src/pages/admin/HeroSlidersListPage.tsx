import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminHeroSlidersList, useDeleteHeroSlider } from '@/hooks/useHeroSliders'
import type { HeroSlider } from '@/types'
import { useTranslation } from 'react-i18next'

export function HeroSlidersListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<HeroSlider | null>(null)
  const { data, isLoading, isFetching } = useAdminHeroSlidersList({ page, per_page: 15, search })
  const deleteItem = useDeleteHeroSlider()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.heroSliders.listTitle')}
        description={t('pages.heroSliders.listDesc')}
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
            header: t('table.image'),
            cell: (item) =>
              item.image ? (
                <img src={item.image} alt="" className="h-10 w-16 rounded object-cover" />
              ) : (
                '—'
              ),
          },
          { key: 'title', header: t('table.title'), cell: (item) => item.title },
          { key: 'order', header: t('table.order'), cell: (item) => item.order },
          { key: 'active', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
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
        title={t('pages.heroSliders.deleteTitle')}
        description={t('pages.heroSliders.deleteDesc', { title: deleteTarget?.title ?? '' })}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteItem.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteItem.isPending}
      />
    </>
  )
}
