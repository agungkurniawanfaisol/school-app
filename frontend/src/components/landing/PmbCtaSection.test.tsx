import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbCtaSection } from '@/components/landing/PmbCtaSection'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('PmbCtaSection', () => {
  it('links to PMB registration page', () => {
    renderWithProviders(<PmbCtaSection />)

    const link = screen.getByRole('link', { name: 'Daftar Sekarang' })
    expect(link).toHaveAttribute('href', '/pmb/daftar')
  })
})
