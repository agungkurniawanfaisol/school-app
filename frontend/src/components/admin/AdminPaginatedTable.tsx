import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import type { PaginationMeta } from '@/types'

interface Column<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
}

interface AdminPaginatedTableProps<T> {
  title: string
  description?: string
  columns: Column<T>[]
  data: T[] | undefined
  meta: PaginationMeta | undefined
  isLoading: boolean
  isFetching: boolean
  page: number
  onPageChange: (page: number) => void
  search: string
  onSearchChange: (value: string) => void
  createHref?: string
}

export function AdminPaginatedTable<T extends { id: number }>({
  title,
  description,
  columns,
  data,
  meta,
  isLoading,
  isFetching,
  page,
  onPageChange,
  search,
  onSearchChange,
  createHref,
}: AdminPaginatedTableProps<T>) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {createHref && (
          <Button asChild>
            <Link to={createHref}>Tambah Baru</Link>
          </Button>
        )}
      </div>

      <Input
        placeholder="Cari..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />

      <div className={`overflow-x-auto rounded-lg border ${isFetching ? 'opacity-70' : ''}`}>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium">
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Skeleton className="h-8 w-16" />
                  </td>
                </tr>
              ))
            ) : data?.length ? (
              data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/30">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.cell(item)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" disabled>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.last_page > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
              />
            </PaginationItem>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === meta.last_page || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1]
                const items = []
                if (prev && p - prev > 1) {
                  items.push(
                    <PaginationItem key={`ellipsis-${p}`}>
                      <span className="px-2">...</span>
                    </PaginationItem>,
                  )
                }
                items.push(
                  <PaginationItem key={p}>
                    <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>,
                )
                return items
              })}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(meta.last_page, page + 1))}
                disabled={page >= meta.last_page}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
