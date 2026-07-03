import { Inbox } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import type { PaginationMeta } from '@/types'
import { cn } from '@/lib/utils'

export interface AdminTableColumn<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
  className?: string
}

interface AdminDataTableProps<T extends { id: number }> {
  columns: AdminTableColumn<T>[]
  data: T[] | undefined
  meta: PaginationMeta | undefined
  isLoading: boolean
  isFetching: boolean
  page: number
  onPageChange: (page: number) => void
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  rowActions?: (item: T) => React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  toolbarFilters?: React.ReactNode
}

function AdminPagination({
  meta,
  page,
  onPageChange,
}: {
  meta: PaginationMeta
  page: number
  onPageChange: (page: number) => void
}) {
  if (meta.last_page <= 1) return null

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-muted-foreground md:hidden">
        Halaman {page} dari {meta.last_page}
      </p>
      <Pagination>
        <PaginationContent className="flex-wrap justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="min-h-11"
            />
          </PaginationItem>
          <div className="hidden md:contents">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === meta.last_page || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1]
                const items: React.ReactNode[] = []
                if (prev && p - prev > 1) {
                  items.push(
                    <PaginationItem key={`ellipsis-${p}`}>
                      <span className="px-2">...</span>
                    </PaginationItem>,
                  )
                }
                items.push(
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => onPageChange(p)}
                      className="min-h-11 min-w-11"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>,
                )
                return items
              })}
          </div>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(meta.last_page, page + 1))}
              disabled={page >= meta.last_page}
              className="min-h-11"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export function AdminDataTable<T extends { id: number }>({
  columns,
  data,
  meta,
  isLoading,
  isFetching,
  page,
  onPageChange,
  search,
  onSearchChange,
  searchPlaceholder,
  rowActions,
  emptyTitle = 'Belum ada data',
  emptyDescription = 'Data akan muncul di sini setelah ditambahkan.',
  toolbarFilters,
}: AdminDataTableProps<T>) {
  const showEmpty = !isLoading && !data?.length

  return (
    <div className={cn('space-y-4', isFetching && 'opacity-70 transition-opacity')}>
      <AdminToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={toolbarFilters}
      />

      <div className="md:hidden" data-testid="admin-card-list">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="admin-card">
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.length ? (
          <div className="space-y-3">
            {data.map((item) => (
              <Card key={item.id} className="admin-card overflow-hidden">
                <CardContent className="space-y-3 p-4">
                  {columns.map((col) => (
                    <div key={col.key} className="flex items-start justify-between gap-3 text-sm">
                      <span className="shrink-0 text-muted-foreground">{col.header}</span>
                      <span className="min-w-0 text-right font-medium">{col.cell(item)}</span>
                    </div>
                  ))}
                  {rowActions && <div className="flex justify-end border-t border-primary/10 pt-3">{rowActions(item)}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <AdminEmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
        )}
      </div>

      <div className="hidden md:block">
        <div className="admin-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {columns.map((col) => (
                  <TableHead key={col.key} className={col.className}>
                    {col.header}
                  </TableHead>
                ))}
                {rowActions && <TableHead className="text-right">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell>
                        <Skeleton className="ml-auto h-6 w-20" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : data?.length ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.cell(item)}
                      </TableCell>
                    ))}
                    {rowActions && <TableCell className="text-right">{rowActions(item)}</TableCell>}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + (rowActions ? 1 : 0)} className="p-0">
                    {showEmpty && (
                      <AdminEmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} className="border-0" />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {meta && <AdminPagination meta={meta} page={page} onPageChange={onPageChange} />}
    </div>
  )
}
