import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTeacherTypeLabels } from '@/hooks/useTeacherTypeLabels'
import { createWrapper } from '@/test/renderWithProviders'

describe('useTeacherTypeLabels', () => {
  it('returns Indonesian labels by default', () => {
    const { result } = renderHook(() => useTeacherTypeLabels(), { wrapper: createWrapper() })

    expect(result.current.kepala_sekolah).toBe('Kepala Sekolah')
    expect(result.current.guru).toBe('Guru')
    expect(result.current.staff).toBe('Staff')
    expect(result.current.pimpinan_yayasan).toBe('Pimpinan Yayasan')
  })
})
