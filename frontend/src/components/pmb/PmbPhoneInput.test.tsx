import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbPhoneInput } from '@/components/pmb/PmbPhoneInput'

describe('PmbPhoneInput', () => {
  it('shows +62 prefix and emits digit-only local part', () => {
    const onChange = vi.fn()

    render(<PmbPhoneInput value="" onChange={onChange} />)

    expect(screen.getByText('+62')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '081234567890' } })

    expect(onChange).toHaveBeenCalledWith('81234567890')
  })
})
