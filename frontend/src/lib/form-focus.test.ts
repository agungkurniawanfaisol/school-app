import { describe, expect, it } from 'vitest'
import { getFirstErrorField, PMB_STEP_FIELD_ORDER } from '@/lib/form-focus'

describe('form-focus', () => {
  it('returns first error field in visual order', () => {
    const order = PMB_STEP_FIELD_ORDER[0]
    expect(getFirstErrorField(['address', 'student_name'], order)).toBe('student_name')
    expect(getFirstErrorField(['child_order', 'relationship_to_child'], order)).toBe('relationship_to_child')
  })

  it('returns undefined when no matching errors', () => {
    expect(getFirstErrorField(['unknown_field'], PMB_STEP_FIELD_ORDER[1])).toBeUndefined()
  })
})
