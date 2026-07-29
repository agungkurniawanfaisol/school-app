import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbRegistrationFormDocument } from '@/components/pmb/PmbRegistrationFormDocument'
import type { PmbRegistration } from '@/types'

vi.mock('@/lib/pmb-print', () => ({
  printPmbDocument: vi.fn(),
}))

const registration = {
  id: 1,
  uuid: 'b3c740e7-0629-48fc-ab1d-8cc48157c9c4',
  registration_number: 'PMB-001',
  student_name: 'Ryuga Alfarez',
  birth_place: 'Sidoarjo',
  birth_date: '2023-07-23',
  gender: 'L',
  parent_name: 'Yusril Anwar',
  parent_phone: '081391317178',
  parent_email: 'vivieka0897@gmail.com',
  address: 'Babatan Jati',
  previous_school: null,
  grade_applied: 'KB IT NURUL HIKMAH',
  academic_year: '2026-2027',
  status: 'accepted',
  draft_payload: {
    nickname: 'Aga',
    mother_name: 'Vivi Eka Putri',
    father_name: 'Yusril Anwar',
    mother_phone: '089616870893',
    father_phone: '081391317178',
    relationship_to_child: 'Kandung',
    child_order: '1',
    sibling_count: '0',
    address_rt: '11',
    address_rw: '03',
    kabupaten: 'Sidoarjo',
    provinsi: 'Jawa Timur',
  },
  created_at: '2026-01-08T15:28:12Z',
  updated_at: '2026-01-08T15:28:12Z',
} as PmbRegistration

describe('PmbRegistrationFormDocument', () => {
  it('renders formulir fields, barcode, and print actions', async () => {
    const { printPmbDocument } = await import('@/lib/pmb-print')

    render(<PmbRegistrationFormDocument registration={registration} />)

    expect(screen.getByTestId('pmb-registration-form-document')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Formulir Pendaftaran/i })).toBeInTheDocument()
    expect(screen.getByText(/Ryuga Alfarez/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Vivi Eka Putri/i).length).toBeGreaterThan(0)
    expect(screen.getByTestId('pmb-document-barcode')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cetak Formulir' }))
    expect(printPmbDocument).toHaveBeenCalledWith('form')
  })
})
