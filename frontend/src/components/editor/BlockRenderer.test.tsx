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

  it('renders centered image alignment from json', () => {
    render(
      <BlockRenderer
        contentJson={{
          type: 'doc',
          content: [
            {
              type: 'image',
              attrs: {
                src: '/storage/uploads/news/sample.png',
                align: 'center',
              },
            },
          ],
        }}
      />,
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('data-align', 'center')
  })

  it('strips script tags from stored html', () => {
    render(<BlockRenderer contentHtml='<p>Safe</p><script>alert(1)</script>' />)
    expect(screen.getByText('Safe')).toBeInTheDocument()
    expect(document.querySelector('script')).not.toBeInTheDocument()
  })

  it('blocks javascript links', () => {
    render(<BlockRenderer contentHtml='<a href="javascript:alert(1)">Click</a>' />)
    expect(screen.getByText('Click')).toBeInTheDocument()
    expect(document.querySelector('a')).not.toBeInTheDocument()
  })
})
