import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NewsFormPage } from '@/pages/admin/NewsFormPage'

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => ({ data: { id: 1, name: 'Sekolah' } }),
}))

vi.mock('@/components/editor/RichPageEditor', () => ({
  RichPageEditor: () => <div data-testid="rich-editor">Editor</div>,
}))

describe('NewsFormPage', () => {
  it('renders create form heading', () => {
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <NewsFormPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Tambah Berita')).toBeInTheDocument()
    expect(screen.getAllByTestId('rich-editor').length).toBeGreaterThan(0)
  })
})
