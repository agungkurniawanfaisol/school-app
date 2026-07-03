import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ScrollToTop } from '@/components/layout/ScrollToTop'

const scrollToMock = vi.fn()
const scrollIntoViewMock = vi.fn()

function NavigateButton({ to }: { to: string }) {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate(to)}>
      Navigate
    </button>
  )
}

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollTo = scrollToMock
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock
  })

  it('scrolls to top on initial route and after navigation', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<NavigateButton to="/berita/detail/abc" />} />
          <Route path="/berita/detail/:uuid" element={<div>Detail</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })
    scrollToMock.mockClear()

    fireEvent.click(screen.getByRole('button', { name: 'Navigate' }))

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })
  })

  it('scrolls to hash target when element exists', () => {
    const section = document.createElement('section')
    section.id = 'berita'
    document.body.appendChild(section)

    render(
      <MemoryRouter initialEntries={['/#berita']}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
    section.remove()
  })
})
