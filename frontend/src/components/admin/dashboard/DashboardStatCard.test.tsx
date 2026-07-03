import { screen } from '@testing-library/react'
import { Newspaper } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { DashboardStatCard } from '@/components/admin/dashboard/DashboardStatCard'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('DashboardStatCard', () => {
  it('renders count and links to module', () => {
    renderWithProviders(
      <DashboardStatCard label="Berita" href="/admin/news" icon={Newspaper} count={12} hint="Artikel publik" />,
    )

    const link = screen.getByRole('link', { name: /Berita: 12/i })
    expect(link).toHaveAttribute('href', '/admin/news')
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Artikel publik')).toBeInTheDocument()
  })
})
