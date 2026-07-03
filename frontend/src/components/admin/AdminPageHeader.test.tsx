import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('AdminPageHeader', () => {
  it('renders title, description, and create action', () => {
    renderWithProviders(
      <AdminPageHeader
        title="Hero Slider"
        description="Kelola banner beranda"
        createHref="/admin/hero-sliders/create"
        createLabel="Tambah Slider"
      />,
    )

    expect(screen.getByRole('heading', { name: 'Hero Slider' })).toBeInTheDocument()
    expect(screen.getByText('Kelola banner beranda')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tambah Slider' })).toHaveAttribute(
      'href',
      '/admin/hero-sliders/create',
    )
  })
})
