import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useUnsavedChanges } from './useUnsavedChanges'

describe('useUnsavedChanges', () => {
  it('mounts without throwing', () => {
    expect(() => {
      renderHook(() => useUnsavedChanges(false))
    }).not.toThrow()
  })
})
