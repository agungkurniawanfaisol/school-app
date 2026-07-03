import { AdminDataTable, type AdminTableColumn } from '@/components/admin/AdminDataTable'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import type { PaginationMeta } from '@/types'

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
  emptyTitle?: string
  emptyDescription?: string
}

export function AdminPaginatedTable<T extends { id: number }>(props: AdminPaginatedTableProps<T>) {
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
    emptyTitle,
    emptyDescription,
  } = props

  return (
    <div className="admin-fade-in space-y-4 sm:space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        createHref={createHref}
        createLabel={createLabel}
        totalCount={meta?.total}
        totalLabel="item"
      />
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
      />
    </div>
  )
}
