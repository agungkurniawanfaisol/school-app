import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PublicCatalogPaginationProps {
  page: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function PublicCatalogPagination({ page, lastPage, onPageChange }: PublicCatalogPaginationProps) {
  if (lastPage <= 1) return null

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-muted-foreground md:hidden">
        Halaman {page} dari {lastPage}
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
            {Array.from({ length: lastPage }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
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
              onClick={() => onPageChange(Math.min(lastPage, page + 1))}
              disabled={page >= lastPage}
              className="min-h-11"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
