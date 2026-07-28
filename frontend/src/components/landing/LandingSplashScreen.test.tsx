import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LandingSplashScreen } from '@/components/landing/LandingSplashScreen'

describe('LandingSplashScreen', () => {
  it('renders title and optional subtitle', () => {
    render(
      <LandingSplashScreen
        preview
        closing={false}
        image="/logo.png"
        title="Selamat Datang"
        subtitle="Sekolah Islam Terpadu"
      />,
    )

    expect(screen.getByText('Selamat Datang')).toBeInTheDocument()
    expect(screen.getByText('Sekolah Islam Terpadu')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Selamat Datang')
  })
})
