import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PmbTestimonialPage } from '@/pages/pmb/PmbTestimonialPage'

vi.mock('@/hooks/useAuth', () => ({
  useAuthMe: () => ({ data: { name: 'Ibu Siti', email: 'siti@test.id', role: 'pendaftar' } }),
}))

vi.mock('@/hooks/usePmb', () => ({
  usePmbPortalUpload: () => ({ mutate: vi.fn(), isPending: false, progress: 0, phase: 'idle' }),
}))

vi.mock('@/hooks/usePmbTestimonial', () => ({
  usePmbPortalTestimonial: () => ({ data: null, isLoading: false }),
  useUpsertPmbPortalTestimonial: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>()
  return {
    ...actual,
    hasPortalAuth: () => true,
  }
})

describe('PmbTestimonialPage', () => {
  it('renders testimonial form for authenticated pendaftar', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PmbTestimonialPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Tulis Testimoni' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ceritakan pengalaman Anda dengan sekolah…')).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Rating testimoni' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kirim Testimoni' })).toBeInTheDocument()
  })
})
