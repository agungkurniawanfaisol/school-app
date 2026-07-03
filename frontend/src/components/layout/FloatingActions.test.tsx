import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FloatingActions } from './FloatingActions'

const useLocationMock = vi.fn(() => ({ pathname: '/' }))
const usePrefersReducedMotionMock = vi.fn(() => false)

vi.mock('react-router-dom', () => ({
  useLocation: () => useLocationMock(),
}))

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => ({
    data: { whatsapp: '6281234567890' },
  }),
}))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => usePrefersReducedMotionMock(),
}))

describe('FloatingActions', () => {
  const scrollToMock = vi.fn()

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    window.scrollTo = scrollToMock
    useLocationMock.mockReturnValue({ pathname: '/' })
    usePrefersReducedMotionMock.mockReturnValue(false)
  })

  afterEach(() => {
    cleanup()
    scrollToMock.mockClear()
  })

  it('renders WhatsApp link on public routes', () => {
    render(<FloatingActions />)

    const whatsappLink = screen.getByRole('link', { name: 'Chat WhatsApp' })
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/6281234567890')
    expect(whatsappLink).toHaveAttribute('target', '_blank')
  })

  it('does not render scroll-to-top before threshold', () => {
    render(<FloatingActions />)
    expect(screen.queryByRole('button', { name: 'Kembali ke atas' })).not.toBeInTheDocument()
  })

  it('renders scroll-to-top after scroll threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true, configurable: true })
    render(<FloatingActions />)

    expect(screen.getByRole('button', { name: 'Kembali ke atas' })).toBeInTheDocument()
  })

  it('scrolls to top with smooth behavior when clicked', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true, configurable: true })
    render(<FloatingActions />)

    fireEvent.click(screen.getByRole('button', { name: 'Kembali ke atas' }))

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('scrolls to top instantly when reduced motion is preferred', () => {
    usePrefersReducedMotionMock.mockReturnValue(true)
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true, configurable: true })
    render(<FloatingActions />)

    fireEvent.click(screen.getByRole('button', { name: 'Kembali ke atas' }))

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('does not render on admin routes', () => {
    useLocationMock.mockReturnValue({ pathname: '/admin' })
    const { container } = render(<FloatingActions />)

    expect(container).toBeEmptyDOMElement()
  })
})
