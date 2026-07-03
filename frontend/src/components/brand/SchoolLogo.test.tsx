import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SchoolLogo } from './SchoolLogo'

describe('SchoolLogo', () => {
  it('renders default logo when school logo is not set', () => {
    render(<SchoolLogo alt="Nurul Hikmah" />)
    const image = screen.getByRole('img', { name: 'Nurul Hikmah' })
    expect(image).toHaveAttribute('src', '/logo.png')
  })

  it('renders custom school logo when provided', () => {
    render(<SchoolLogo alt="Sekolah" logo="/media/custom.png" />)
    expect(screen.getByRole('img', { name: 'Sekolah' })).toHaveAttribute('src', '/media/custom.png')
  })
})
