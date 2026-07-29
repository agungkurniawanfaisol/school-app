import { AdminDataTable, type AdminTableColumn } from '@/components/admin/AdminDataTable'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import type { PaginationMeta } from '@/types'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type { AdminTableColumn }

interface AdminPaginatedTableProps<T extends { id: number }> {
  title: string
  description?: string
  columns: AdminTableColumn<T>[]
  data: T[] | undefined
  meta: PaginationMeta | undefined
  isLoading: boolean
  isFetching: boolean
  page: number
  onPageChange: (page: number) => void
  search: string
  onSearchChange: (value: string) => void
  createHref?: string
  createLabel?: string
  rowActions?: (item: T) => React.ReactNode
  toolbarFilters?: React.ReactNode
  headerActions?: ReactNode
  beforeTable?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  getRowClassName?: (item: T) => string | undefined
}

export function AdminPaginatedTable<T extends { id: number }>(props: AdminPaginatedTableProps<T>) {
  const { t } = useTranslation('admin')
  const {
    title,
    description,
    createHref,
    createLabel,
    columns,
    data,
    meta,
    isLoading,
    isFetching,
    page,
    onPageChange,
    search,
    onSearchChange,
    rowActions,
    toolbarFilters,
    headerActions,
    beforeTable,
    emptyTitle,
    emptyDescription,
    getRowClassName,
  } = props

  return (
    <div className="admin-fade-in space-y-4 sm:space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        createHref={createHref}
        createLabel={createLabel}
        totalCount={meta?.total}
        totalLabel={t('common.item')}
        actions={headerActions}
      />
      {beforeTable}
      <AdminDataTable
        columns={columns}
        data={data}
        meta={meta}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        onPageChange={onPageChange}
        search={search}
        onSearchChange={onSearchChange}
        rowActions={rowActions}
        toolbarFilters={toolbarFilters}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        getRowClassName={getRowClassName}
      />
    </div>
  )
}
