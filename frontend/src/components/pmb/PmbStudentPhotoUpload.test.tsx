import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbStudentPhotoUpload } from './PmbStudentPhotoUpload'

const uploadMock = {
  mutate: vi.fn(),
  isPending: false,
  progress: 0,
  phase: 'idle' as const,
}

describe('PmbStudentPhotoUpload', () => {
  it('shows prominent upload CTA when no photo', () => {
    render(
      <PmbStudentPhotoUpload
        studentName="Ahmad"
        upload={uploadMock as never}
        onUploaded={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /Unggah Foto/i })).toBeInTheDocument()
    expect(screen.getByText(/Ketuk untuk unggah/i)).toBeInTheDocument()
  })

  it('shows clear change photo CTA when preview exists', () => {
    render(
      <PmbStudentPhotoUpload
        studentName="Ahmad"
        mediaId={1}
        previewUrl="/api/v1/pmb/portal/media/abc"
        upload={uploadMock as never}
        onUploaded={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /Ganti Foto/i })).toBeInTheDocument()
    expect(screen.getByText('Tersimpan')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Foto Ahmad' })).toBeInTheDocument()
    expect(screen.getByText(/Ketuk foto atau tombol di atas untuk mengganti/i)).toBeInTheDocument()
  })

  it('opens file picker from change button', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')

    render(
      <PmbStudentPhotoUpload
        studentName="Ahmad"
        mediaId={1}
        previewUrl="/api/v1/pmb/portal/media/abc"
        upload={uploadMock as never}
        onUploaded={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Ganti Foto/i }))
    expect(clickSpy).toHaveBeenCalled()

    clickSpy.mockRestore()
  })
})
