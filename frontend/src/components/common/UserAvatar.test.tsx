import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UserAvatar } from './UserAvatar'

describe('UserAvatar', () => {
  it('renders initials when photo url is unsafe', () => {
    render(<UserAvatar name="Ahmad Fauzi" photoUrl="javascript:alert(1)" />)
    expect(screen.getByText('AF')).toBeInTheDocument()
  })

  it('renders safe relative photo url', () => {
    render(<UserAvatar name="Ahmad Fauzi" photoUrl="/storage/uploads/pmb/student.jpg" />)
    const image = screen.getByRole('img', { name: 'Ahmad Fauzi' })
    expect(image).toHaveAttribute('src', '/storage/uploads/pmb/student.jpg')
  })

  it('renders blob preview urls after upload', () => {
    render(<UserAvatar name="Ahmad Fauzi" photoUrl="blob:http://localhost:5173/preview-1" />)
    const image = screen.getByRole('img', { name: 'Ahmad Fauzi' })
    expect(image).toHaveAttribute('src', 'blob:http://localhost:5173/preview-1')
  })

  it('switches from initials to photo when photoUrl arrives', () => {
    const { rerender } = render(<UserAvatar name="Ahmad Fauzi" photoUrl={null} />)
    expect(screen.getByText('AF')).toBeInTheDocument()

    rerender(<UserAvatar name="Ahmad Fauzi" photoUrl="/api/v1/pmb/portal/media/abc" />)
    expect(screen.getByRole('img', { name: 'Ahmad Fauzi' })).toHaveAttribute(
      'src',
      '/api/v1/pmb/portal/media/abc',
    )
  })
})
