import { render, screen } from '@testing-library/react'
import { User } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { PmbFormSection } from '@/components/pmb/PmbFormSection'

describe('PmbFormSection', () => {
  it('renders title and description with icon', () => {
    render(
      <PmbFormSection icon={User} title="Identitas Calon Siswa" description="Nama sesuai dokumen.">
        <p>Konten form</p>
      </PmbFormSection>,
    )

    expect(screen.getByRole('heading', { name: 'Identitas Calon Siswa' })).toBeInTheDocument()
    expect(screen.getByText('Nama sesuai dokumen.')).toBeInTheDocument()
    expect(screen.getByText('Konten form')).toBeInTheDocument()
  })
})
