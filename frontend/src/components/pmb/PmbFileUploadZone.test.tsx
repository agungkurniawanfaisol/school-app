import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbFileUploadZone } from '@/components/pmb/PmbFileUploadZone'

describe('PmbFileUploadZone', () => {
  it('calls onFileSelect when a file is chosen', async () => {
    const onFileSelect = vi.fn()
    render(
      <PmbFileUploadZone
        label="Unggah bukti"
        onFileSelect={onFileSelect}
      />,
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['proof'], 'bukti.jpg', { type: 'image/jpeg' })

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onFileSelect).toHaveBeenCalledWith(file)
    })
  })

  it('shows upload label', () => {
    render(<PmbFileUploadZone label="Unggah bukti transfer" onFileSelect={vi.fn()} />)
    expect(screen.getByText('Unggah bukti transfer')).toBeInTheDocument()
  })

  it('shows mobile-friendly tap hint', () => {
    render(<PmbFileUploadZone label="Unggah bukti" onFileSelect={vi.fn()} />)
    expect(screen.getByText('Ketuk untuk memilih file')).toBeInTheDocument()
  })

  it('shows upload progress while uploading', () => {
    render(
      <PmbFileUploadZone
        label="Unggah bukti"
        isUploading
        uploadPhase="uploading"
        uploadProgress={42}
        onFileSelect={vi.fn()}
      />,
    )
    expect(screen.getByText('Mengunggah… 42%')).toBeInTheDocument()
  })
})
