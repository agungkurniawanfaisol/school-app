import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { ActivityPhotoGalleryEditor } from './ActivityPhotoGalleryEditor'

vi.mock('@/hooks/useMediaUpload', () => ({
  useMediaUpload: () => ({
    mutateAsync: vi.fn(async () => ({
      uuid: 'media-1',
      url: '/storage/activities/one.jpg',
      path: 'activities/one.jpg',
      mime_type: 'image/jpeg',
      size: 1000,
    })),
    isPending: false,
    progress: 0,
    phase: 'idle',
  }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

function wrap(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

describe('ActivityPhotoGalleryEditor', () => {
  it('uploads multiple files and appends to gallery', async () => {
    const onChange = vi.fn()
    wrap(<ActivityPhotoGalleryEditor photos={[]} onChange={onChange} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const fileA = new File(['a'], 'a.jpg', { type: 'image/jpeg' })
    const fileB = new File(['b'], 'b.jpg', { type: 'image/jpeg' })
    fireEvent.change(input, { target: { files: [fileA, fileB] } })

    await waitFor(() => expect(onChange).toHaveBeenCalled())
    const next = onChange.mock.calls.at(-1)?.[0] as Array<{ path: string }>
    expect(next).toHaveLength(2)
    expect(next[0]?.path).toBe('/storage/activities/one.jpg')
  })

  it('shows empty upload affordance', () => {
    wrap(<ActivityPhotoGalleryEditor photos={[]} onChange={vi.fn()} />)
    expect(screen.getByText('components.activityGallery.clickToUpload')).toBeInTheDocument()
  })
})
