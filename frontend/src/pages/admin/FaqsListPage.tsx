import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminFaqsList, useDeleteFaq } from '@/hooks/useFaqs'
import type { Faq } from '@/hooks/useFaqs'

const categoryLabels: Record<string, string> = {
  pmb: 'PMB',
  akademik: 'Akademik',
  biaya: 'Biaya',
  umum: 'Umum',
}

export function FaqsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null)
  const { data, isLoading, isFetching } = useAdminFaqsList({ page, per_page: 15, search })
  const deleteItem = useDeleteFaq()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola FAQ"
        description="Pertanyaan yang sering diajukan"
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
        createHref="/admin/faqs/create"
        columns={[
          { key: 'question', header: 'Pertanyaan', cell: (item) => item.question },
          { key: 'category', header: 'Kategori', cell: (item) => categoryLabels[item.category] ?? item.category },
          { key: 'active', header: 'Status', cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/faqs/${item.id}/edit`}
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
