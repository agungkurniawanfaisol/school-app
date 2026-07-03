import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge, AdminFeaturedBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminTestimonialsList, useDeleteTestimonial } from '@/hooks/useTestimonials'
import type { Testimonial } from '@/types'

export function TestimonialsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const { data, isLoading, isFetching } = useAdminTestimonialsList({ page, per_page: 15, search })
  const deleteItem = useDeleteTestimonial()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Testimoni"
        description="Ulasan dari orang tua dan alumni"
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
        createHref="/admin/testimonials/create"
        columns={[
          { key: 'name', header: 'Nama', cell: (item) => item.name },
          { key: 'role', header: 'Peran', cell: (item) => item.role ?? '—' },
          { key: 'rating', header: 'Rating', cell: (item) => item.rating ?? '—' },
          { key: 'featured', header: 'Unggulan', cell: (item) => <AdminFeaturedBadge isFeatured={item.is_featured} /> },
          { key: 'active', header: 'Status', cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/testimonials/${item.id}/edit`}
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
