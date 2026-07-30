import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbLoaDocument } from '@/components/pmb/PmbLoaDocument'
import type { PmbRegistration } from '@/types'

vi.mock('@/lib/pmb-print', () => ({
  printPmbDocument: vi.fn(),
}))

const registration = {
  id: 1,
  uuid: 'b3c740e7-0629-48fc-ab1d-8cc48157c9c4',
  registration_number: 'PMB-001',
  student_name: 'Samuel',
  birth_place: 'Sidoarjo',
  birth_date: '2018-05-01',
  gender: 'L',
  parent_name: 'Budi',
  parent_phone: '081234567890',
  parent_email: 'budi@example.com',
  address: 'Jl. Melati',
  previous_school: null,
  grade_applied: 'KB IT',
  academic_year: '2026-2027',
  status: 'accepted',
  draft_payload: { nickname: 'Sam' },
  student_photo: {
    id: 12,
    uuid: 'photo-uuid',
    url: '/storage/uploads/pmb/student.jpg',
    mime_type: 'image/jpeg',
    original_name: 'student.jpg',
  },
  loa_issued_at: '2026-07-29T10:00:00Z',
  created_at: '2026-07-01T00:00:00Z',
  updated_at: '2026-07-29T10:00:00Z',
} as PmbRegistration

describe('PmbLoaDocument', () => {
  it('renders acceptance letter fields, barcode, and print actions', async () => {
    const { printPmbDocument } = await import('@/lib/pmb-print')

    render(<PmbLoaDocument registration={registration} schoolName="Sekolah Nurul Hikmah" />)

    expect(screen.getByTestId('pmb-loa-document')).toBeInTheDocument()
    expect(screen.getByText(/Surat Penerimaan Siswa Baru/i)).toBeInTheDocument()
    expect(screen.getByText(/Samuel/)).toBeInTheDocument()
    expect(screen.getByTestId('pmb-document-barcode')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cetak LoA' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Simpan LoA (PDF)' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Simpan LoA (PDF)' }))
    expect(printPmbDocument).toHaveBeenCalledWith('loa')
  })

  it('shows uploaded student photo on the LoA', () => {
    render(<PmbLoaDocument registration={registration} schoolName="Sekolah Nurul Hikmah" />)

    const photo = screen.getByTestId('pmb-loa-student-photo').querySelector('img')
    expect(photo).toHaveAttribute('src', expect.stringContaining('/storage/uploads/pmb/student.jpg'))
    expect(photo).toHaveAttribute('alt', 'Foto Samuel')
  })

  it('hides photo frame when student photo is missing', () => {
    render(
      <PmbLoaDocument
        registration={{ ...registration, student_photo: null }}
        schoolName="Sekolah Nurul Hikmah"
      />,
    )

    expect(screen.queryByTestId('pmb-loa-student-photo')).not.toBeInTheDocument()
  })
})
