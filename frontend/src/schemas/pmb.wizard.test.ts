import { describe, expect, it } from 'vitest'
import { getAcademicYear } from '@/lib/academic-year'
import { formatIndonesiaPhone, INDONESIA_PHONE_REGEX } from '@/lib/phone-id'
import {
  formatRelationshipToChild,
  pmbDataDiriStepSchema,
  pmbOrangTuaStepSchema,
  pmbPaymentStepSchema,
  pmbRegisterSchema,
} from './pmb'

describe('getAcademicYear', () => {
  it('returns next year pair when month is July or later', () => {
    expect(getAcademicYear(new Date('2026-07-01'))).toBe('2026/2027')
    expect(getAcademicYear(new Date('2026-12-15'))).toBe('2026/2027')
  })

  it('returns previous year pair when month is before July', () => {
    expect(getAcademicYear(new Date('2026-06-30'))).toBe('2025/2026')
    expect(getAcademicYear(new Date('2026-01-01'))).toBe('2025/2026')
  })
})

describe('indonesia phone', () => {
  it('normalizes local digits to +62 format', () => {
    expect(formatIndonesiaPhone('081234567890')).toBe('+6281234567890')
    expect(INDONESIA_PHONE_REGEX.test('+6281234567890')).toBe(true)
  })
})

describe('pmbRegisterSchema', () => {
  it('accepts valid register input', () => {
    const result = pmbRegisterSchema.safeParse({
      school_id: 1,
      student_name: 'Ahmad Fauzi',
      parent_name: 'Budi Santoso',
      parent_phone: '081234567890',
      grade_applied: 'Kelas 1 SD',
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = pmbRegisterSchema.safeParse({
      school_id: 1,
      student_name: '',
      parent_name: '',
      parent_phone: '',
      grade_applied: '',
    })

    expect(result.success).toBe(false)
  })
})

describe('PMB wizard step schemas', () => {
  const validDataDiri = {
    student_name: 'Ahmad Fauzi',
    address: 'Jl. Merdeka No. 1',
    address_rt: '001',
    address_rw: '002',
    kabupaten: 'Jakarta Selatan',
    provinsi: 'DKI Jakarta',
    contact_phone: '81234567890',
    birth_place: 'Jakarta',
    birth_date: '2018-05-10',
    relationship_to_child: 'Anak kandung' as const,
    child_order: '1',
    sibling_count: '2',
    academic_year: '2026/2027',
    student_photo_media_id: 1,
  }

  it('validates data diri step', () => {
    expect(pmbDataDiriStepSchema.safeParse(validDataDiri).success).toBe(true)
    expect(pmbDataDiriStepSchema.safeParse({ ...validDataDiri, student_name: '' }).success).toBe(false)
    expect(pmbDataDiriStepSchema.safeParse({ ...validDataDiri, contact_phone: '123' }).success).toBe(false)
    expect(pmbDataDiriStepSchema.safeParse({ ...validDataDiri, address_rt: 'abc' }).success).toBe(false)
    expect(pmbDataDiriStepSchema.safeParse({ ...validDataDiri, address_rt: '', address_rw: '' }).success).toBe(true)
    expect(pmbDataDiriStepSchema.safeParse({ ...validDataDiri, provinsi: '' }).success).toBe(false)
    expect(
      pmbDataDiriStepSchema.safeParse({
        ...validDataDiri,
        relationship_to_child: 'Lainnya',
        relationship_to_child_other: '',
      }).success,
    ).toBe(false)
    expect(
      pmbDataDiriStepSchema.safeParse({
        ...validDataDiri,
        relationship_to_child: 'Lainnya',
        relationship_to_child_other: 'anak angkat',
      }).success,
    ).toBe(true)
  })

  it('formats relationship other text', () => {
    const result = pmbDataDiriStepSchema.safeParse({
      ...validDataDiri,
      relationship_to_child: 'Lainnya',
      relationship_to_child_other: 'anak asuh',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.relationship_to_child_other).toBe('Anak Asuh')
    }
  })

  it('formats names and address on data diri validation', () => {
    const result = pmbDataDiriStepSchema.safeParse({
      ...validDataDiri,
      student_name: 'ahmad fauzi',
      birth_place: 'jakarta',
      address: 'jl. merdeka no 5',
      kabupaten: 'jakarta selatan',
      provinsi: 'dki jakarta',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.student_name).toBe('Ahmad Fauzi')
      expect(result.data.birth_place).toBe('Jakarta')
      expect(result.data.address).toBe('Jl. merdeka no 5')
      expect(result.data.kabupaten).toBe('Jakarta Selatan')
      expect(result.data.provinsi).toBe('Dki Jakarta')
    }
  })

  it('validates orang tua step with at least one parent phone', () => {
    expect(
      pmbOrangTuaStepSchema.safeParse({
        father_name: 'Budi',
        mother_name: 'Siti',
        father_phone: '81234567890',
        parent_email: 'budi@example.com',
      }).success,
    ).toBe(true)

    expect(
      pmbOrangTuaStepSchema.safeParse({
        father_name: 'Budi',
        mother_name: 'Siti',
        parent_email: 'budi@example.com',
      }).success,
    ).toBe(false)
  })

  it('validates payment step requires proof and confirmation', () => {
    expect(
      pmbPaymentStepSchema.safeParse({
        payment_proof_media_id: 1,
        transfer_confirmed: true,
      }).success,
    ).toBe(true)

    expect(
      pmbPaymentStepSchema.safeParse({
        payment_proof_media_id: 1,
        transfer_confirmed: false,
      }).success,
    ).toBe(false)
  })
})

describe('formatRelationshipToChild', () => {
  it('returns preset label for standard options', () => {
    expect(formatRelationshipToChild('Anak kandung', null)).toBe('Anak kandung')
  })

  it('returns custom text when Lainnya is selected', () => {
    expect(formatRelationshipToChild('Lainnya', 'Anak angkat')).toBe('Anak angkat')
  })
})
