import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { VirtualTourCatalogPage } from '@/pages/virtual-tour/VirtualTourCatalogPage'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/hooks/useVirtualTours', () => ({
  usePublicVirtualTours: () => ({
    data: {
      data: [
        {
          uuid: '11111111-1111-4111-8111-111111111111',
          title: 'Tur Sekolah',
          slug: 'tur-sekolah',
          description: 'Jelajahi sekolah',
          is_active: true,
          order: 0,
        },
      ],
    },
    isLoading: false,
  }),
}))

vi.mock('@/components/layout/PublicPageShell', () => ({
  PublicPageShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('VirtualTourCatalogPage', () => {
  it('renders tour list and start link', () => {
    renderWithProviders(<VirtualTourCatalogPage />)
    expect(screen.getByRole('heading', { name: /tur virtual sekolah/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /mulai tur/i })).toHaveAttribute('href', '/tur-virtual/tur-sekolah')
  })
})
