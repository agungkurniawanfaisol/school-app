import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LanguageSwitcher } from './LanguageSwitcher'
import { LanguageProvider } from './LanguageProvider'

vi.mock('@/lib/api', () => ({
  api: { defaults: { headers: { common: {} } } },
}))

function renderSwitcher() {
  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  )
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('dir')
    document.documentElement.setAttribute('lang', 'id')
  })

  it('renders the globe button with aria-label', () => {
    renderSwitcher()
    const button = screen.getByRole('button', { name: /bahasa/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('has correct initial state', () => {
    renderSwitcher()
    const button = screen.getByRole('button', { name: /bahasa/i })
    expect(button).toHaveAttribute('data-state', 'closed')
  })

  it('globe icon is rendered inside the button', () => {
    const { container } = renderSwitcher()
    const svg = container.querySelector('svg.lucide-globe')
    expect(svg).toBeInTheDocument()
  })
})
