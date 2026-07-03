import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SectionHeader } from '@/components/landing/SectionHeader'

vi.mock('motion/react-m', () => ({
  div: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('SectionHeader', () => {
  it('renders badge, title, and description', () => {
    render(
      <SectionHeader
        badge="Tentang Kami"
        title="Judul Section"
        description="Deskripsi section"
      />,
    )

    expect(screen.getByText('Tentang Kami')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Judul Section' })).toBeInTheDocument()
    expect(screen.getByText('Deskripsi section')).toBeInTheDocument()
  })
})
