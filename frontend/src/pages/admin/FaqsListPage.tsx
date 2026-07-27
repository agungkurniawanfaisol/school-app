import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminFaqsList, useDeleteFaq } from '@/hooks/useFaqs'
import type { Faq } from '@/hooks/useFaqs'
import { useTranslation } from 'react-i18next'

const faqCategories = ['pmb', 'akademik', 'biaya', 'umum'] as const

export function FaqsListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null)
  const { data, isLoading, isFetching } = useAdminFaqsList({ page, per_page: 15, search })
  const deleteItem = useDeleteFaq()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.faqs.listTitle')}
        description={t('pages.faqs.listDesc')}
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
          { key: 'question', header: t('table.question'), cell: (item) => item.question },
          { key: 'category', header: t('table.category'), cell: (item) => t(`faqCategory.${item.category}`) },
          { key: 'active', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
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
