import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { renderWithProviders } from '@/test/renderWithProviders'

type NewsRow = { id: number; title: string }

describe('AdminPaginatedTable', () => {
  const columns = [
    { key: 'title', header: 'Judul', cell: (item: NewsRow) => item.title },
  ]

  it('renders table rows when data is loaded', () => {
    renderWithProviders(
      <AdminPaginatedTable
        title="Daftar Berita"
        columns={columns}
        data={[{ id: 1, title: 'Berita Pertama' }]}
        meta={{ current_page: 1, from: 1, last_page: 1, path: '/admin/news', per_page: 15, to: 1, total: 1 }}
        isLoading={false}
        isFetching={false}
        page={1}
        onPageChange={vi.fn()}
        search=""
        onSearchChange={vi.fn()}
      />,
    )

    expect(screen.getAllByText('Berita Pertama').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'Daftar Berita' })).toBeInTheDocument()
    expect(screen.getAllByTestId('admin-card-list').length).toBeGreaterThanOrEqual(1)
  })

  it('shows skeleton rows while loading on desktop table', () => {
    const { container } = renderWithProviders(
      <AdminPaginatedTable
        title="Daftar Berita"
        columns={columns}
        data={undefined}
        meta={undefined}
        isLoading
        isFetching={false}
        page={1}
        onPageChange={vi.fn()}
        search=""
        onSearchChange={vi.fn()}
      />,
    )

    expect(container.querySelectorAll('tbody tr').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('admin-card-list').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Tidak ada data.')).not.toBeInTheDocument()
  })
})
