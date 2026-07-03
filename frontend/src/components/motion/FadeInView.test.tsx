import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FadeInView } from '@/components/motion/FadeInView'

const usePrefersReducedMotionMock = vi.fn(() => false)

vi.mock('motion/react-m', () => ({
  div: ({ children, className, initial, whileInView, viewport, ...props }: Record<string, unknown>) => (
    <div
      data-testid="motion-div"
      className={className as string}
      data-initial={initial ? JSON.stringify(initial) : undefined}
      data-while-in-view={whileInView ? JSON.stringify(whileInView) : undefined}
      data-viewport={viewport ? JSON.stringify(viewport) : undefined}
      {...props}
    >
      {children as React.ReactNode}
    </div>
  ),
  section: ({ children, className }: Record<string, unknown>) => (
    <section className={className as string}>{children as React.ReactNode}</section>
  ),
  article: ({ children, className }: Record<string, unknown>) => (
    <article className={className as string}>{children as React.ReactNode}</article>
  ),
  li: ({ children, className }: Record<string, unknown>) => (
    <li className={className as string}>{children as React.ReactNode}</li>
  ),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => usePrefersReducedMotionMock(),
}))

describe('FadeInView', () => {
  afterEach(() => {
    cleanup()
    usePrefersReducedMotionMock.mockReturnValue(false)
  })

  it('renders children with motion when animation is enabled', () => {
    render(
      <FadeInView className="test-class">
        <p>Hello motion</p>
      </FadeInView>,
    )

    expect(screen.getByText('Hello motion')).toBeInTheDocument()
    expect(screen.getByTestId('motion-div')).toHaveClass('test-class')
    expect(screen.getByTestId('motion-div')).toHaveAttribute('data-initial')
  })

  it('uses repeatable viewport so animations replay on scroll', () => {
    render(
      <FadeInView>
        <p>Replay</p>
      </FadeInView>,
    )

    const viewport = JSON.parse(screen.getByTestId('motion-div').getAttribute('data-viewport') ?? '{}')
    expect(viewport.once).toBe(false)
  })

  it('renders static element when tier is none', () => {
    render(
      <FadeInView tier="none">
        <p>Static content</p>
      </FadeInView>,
    )

    expect(screen.getByText('Static content')).toBeInTheDocument()
    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument()
  })

  it('renders static element when reduced motion is preferred', () => {
    usePrefersReducedMotionMock.mockReturnValue(true)

    render(
      <FadeInView>
        <p>Reduced motion</p>
      </FadeInView>,
    )

    expect(screen.getByText('Reduced motion')).toBeInTheDocument()
    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument()
  })
})
