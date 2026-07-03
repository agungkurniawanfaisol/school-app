import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CountUp } from '@/components/landing/CountUp'

describe('CountUp', () => {
  it('renders initial value with suffix', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    render(<CountUp end={100} suffix="+" />)

    expect(screen.getByText('100+')).toBeInTheDocument()
  })
})
