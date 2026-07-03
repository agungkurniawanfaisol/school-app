import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlockRenderer } from '@/components/editor/BlockRenderer'

describe('BlockRenderer', () => {
  it('renders html content', () => {
    render(<BlockRenderer contentHtml="<p>Halo berita</p>" />)
    expect(screen.getByText('Halo berita')).toBeInTheDocument()
  })

  it('shows placeholder when empty', () => {
    render(<BlockRenderer />)
    expect(screen.getByText('Konten belum tersedia.')).toBeInTheDocument()
  })
})
