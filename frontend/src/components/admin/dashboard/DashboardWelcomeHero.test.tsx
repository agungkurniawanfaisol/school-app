import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardWelcomeHero } from '@/components/admin/dashboard/DashboardWelcomeHero'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('DashboardWelcomeHero', () => {
  it('renders greeting and user name with green hero background', () => {
    const { container } = renderWithProviders(
      <DashboardWelcomeHero userName="Admin Nurul" pendingPmbCount={2} />,
    )

    expect(screen.getByText('Admin Nurul')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Tambah Berita/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Review PMB/i })).toBeInTheDocument()

    const hero = container.querySelector('section[aria-label="Selamat datang"]')
    expect(hero).toBeTruthy()
    expect(hero).toHaveStyle({ backgroundColor: '#1a5f2a' })
  })
})
