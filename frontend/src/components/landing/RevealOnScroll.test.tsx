import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'

vi.mock('motion/react-m', () => ({
  div: ({ children, className, initial, whileInView }: Record<string, unknown>) => (
    <div
      data-testid="motion-div"
      className={className as string}
      data-initial={initial ? JSON.stringify(initial) : undefined}
      data-while-in-view={whileInView ? JSON.stringify(whileInView) : undefined}
    >
      {children as React.ReactNode}
    </div>
  ),
  section: ({ children }: Record<string, unknown>) => <section>{children as React.ReactNode}</section>,
  article: ({ children }: Record<string, unknown>) => <article>{children as React.ReactNode}</article>,
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('RevealOnScroll', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders children', () => {
    render(
      <RevealOnScroll>
        <p>Konten section</p>
      </RevealOnScroll>,
    )
    expect(screen.getByText('Konten section')).toBeInTheDocument()
  })

  it('delegates to FadeInView motion wrapper', () => {
    render(
      <RevealOnScroll>
        <p>Animasi</p>
      </RevealOnScroll>,
    )
    expect(screen.getByTestId('motion-div')).toBeInTheDocument()
  })
})
